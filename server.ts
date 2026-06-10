import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { virtualProjectFiles } from "./src/projectFiles.js";

// Lazy initialize Gemini clients to prevent startup crashes when the API key is missing
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure your API key in the 'Secrets' panel in the Settings menu of your Google AI Studio template.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Token count estimate heuristic (4 chars per token)
function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// Cost calculation based on rough rates
function calculateStats(prompt: string, completion: string, latencyMs: number) {
  const promptTokens = estimateTokens(prompt);
  const completionTokens = estimateTokens(completion);
  const totalTokens = promptTokens + completionTokens;
  
  // Flash pricing standard: $0.075 / 1M input tokens, $0.300 / 1M output tokens
  const costUsd = ((promptTokens * 0.075) + (completionTokens * 0.300)) / 1_000_000;
  
  return {
    promptTokens,
    completionTokens,
    totalTokens,
    costUsd: Number(costUsd.toFixed(8)),
    latencyMs
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 2. Fetch Project Files for Virtual Workspace
  app.get("/api/project-files", (req, res) => {
    res.json({ files: virtualProjectFiles });
  });

  // 3. Main Reasoning Pipeline Runner
  app.post("/api/reasoning/evaluate", async (req, res) => {
    const { question, model = "gemini-3.5-flash" } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Missing or invalid 'question' parameter in body." });
      return;
    }

    try {
      const ai = getGeminiClient();

      // Ensure appropriate templates
      const cotTemplateFile = virtualProjectFiles.find(f => f.path.endsWith("cot_prompt.txt"));
      const selfCorrectionTemplateFile = virtualProjectFiles.find(f => f.path.endsWith("self_correction_prompt.txt"));
      
      const cotTemplate = cotTemplateFile?.content || "Format your thoughts step-by-step.";
      const selfCorrectionTemplate = selfCorrectionTemplateFile?.content || "Perform review on candidate.";

      // ----------------------------------------------------
      // Phase 1: Baseline Direct Execution (No structure, forced brief)
      // ----------------------------------------------------
      const directPrompt = `Answer the following question simply, directly, and immediately without any intermediate steps:\n\n[USER_QUESTION] ${question}`;
      const directStart = Date.now();
      
      let directAnswer = "";
      try {
        const directResponse = await ai.models.generateContent({
          model: model,
          contents: directPrompt,
          config: {
            temperature: 0.1,
          }
        });
        directAnswer = directResponse.text || "No response received.";
      } catch (err: any) {
        directAnswer = `Error executing direct model call: ${err.message}`;
      }
      const directLatency = Date.now() - directStart;
      const directStats = calculateStats(directPrompt, directAnswer, directLatency);

      // ----------------------------------------------------
      // Phase 2: Chain-of-Thought Structuring
      // ----------------------------------------------------
      const cotPrompt = `${cotTemplate}\n\n[USER_QUESTION] ${question}`;
      const cotStart = Date.now();
      
      let cotChain = "";
      try {
        const cotResponse = await ai.models.generateContent({
          model: model,
          contents: cotPrompt,
          config: {
            temperature: 0.1,
          }
        });
        cotChain = cotResponse.text || "No response received.";
      } catch (err: any) {
        cotChain = `Error executing Chain-of-Thought stage: ${err.message}`;
      }
      const cotLatency = Date.now() - cotStart;
      const cotStats = calculateStats(cotPrompt, cotChain, cotLatency);

      // ----------------------------------------------------
      // Phase 3: Self-Correction Module (Verify and Check)
      // ----------------------------------------------------
      const correctionPrompt = `${selfCorrectionTemplate}\n\n[ORIGINAL_QUESTION] ${question}\n\n[CANDIDATE_REASONING_CHAIN] ${cotChain}`;
      const correctionStart = Date.now();
      
      let correctedChain = "";
      try {
        const correctionResponse = await ai.models.generateContent({
          model: model,
          contents: correctionPrompt,
          config: {
            temperature: 0.05, // Retain strictness
          }
        });
        correctedChain = correctionResponse.text || "No response received.";
      } catch (err: any) {
        correctedChain = `Error executing Self-Correction audit: ${err.message}`;
      }
      const correctionLatency = Date.now() - correctionStart;
      const correctionStats = calculateStats(correctionPrompt, correctedChain, correctionLatency);

      // Analyze if self-correction made a structural difference or triggered corrections
      let detectedCorrection = false;
      if (correctedChain.toLowerCase().includes("inconsistency found") || 
          correctedChain.toLowerCase().includes("error checked") ||
          correctedChain.toLowerCase().includes("revised") ||
          correctedChain.toLowerCase().includes("correction:") ||
          correctedChain.toLowerCase().includes("corrected reasoning")) {
        detectedCorrection = true;
      }

      res.json({
        success: true,
        summary: "Pipeline executed successfully.",
        question,
        direct: {
          answer: directAnswer,
          stats: directStats
        },
        cot: {
          chain: cotChain,
          stats: cotStats
        },
        corrected: {
          chain: correctedChain,
          stats: correctionStats,
          detectedCorrection
        }
      });

    } catch (err: any) {
      console.error("[ERROR] Logic pipeline failed:", err);
      res.status(500).json({
        success: false,
        error: err.message || "An unexpected error occurred in the logic runner pipeline.",
        remediation: "Verify that GEMINI_API_KEY is configured in your Settings > Secrets."
      });
    }
  });

  // 4. Vite Dev Server vs Static Asset Server Ingress
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bound to port 3000 (Required container constraint)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CoT Server] Running full-stack logical playground on port ${PORT}`);
  });
}

startServer();
