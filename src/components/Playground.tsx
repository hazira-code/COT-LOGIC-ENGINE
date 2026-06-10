import React, { useState } from "react";
import { 
  Play, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Search,
  Eye,
  FileCheck,
  Zap,
  RefreshCw,
  CornerDownRight
} from "lucide-react";
import { EvaluationPayload } from "../types";

interface PuzzlePreset {
  title: string;
  category: string;
  trap: string;
  description: string;
  question: string;
}

const PUZZLE_PRESETS: PuzzlePreset[] = [
  {
    title: "Bat and Ball Puzzle",
    category: "Mathematical Word Problem",
    trap: "Cognitive Intuition Bias",
    description: "Fools the fast system into outputting $0.10 immediately instead of solving the simple algebra.",
    question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"
  },
  {
    title: "Three Light Switches",
    category: "Physical Deduction Puzzle",
    trap: "Missing Physical Dimension Check",
    description: "Requires lateral thinking using heat variables since visual feedback alone is blocked.",
    question: "In a room, there are three light switches outside a closed door. Inside the room is a single incandescent light bulb. You can flip the switches as much as you want, but you can only open the door once to check. How do you find out which switch controls the bulb?"
  },
  {
    title: "Lily Pad Exponential double",
    category: "Exponential Reasoning",
    trap: "Linear Sequence Assumption",
    description: "Confuses linear scaling expectations (guessing 24 days instead of subtracting 1 step backwards to cover half).",
    question: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take to cover half of the lake?"
  },
  {
    title: "Sarah & John's Age Riddle",
    category: "Algebraic Enigma",
    trap: "Recursive Temporal Reference",
    description: "Tricky language logic involving overlapping past-tense age differences.",
    question: "Sarah is twice as old as John was when Sarah was as old as John is now. If the sum of their ages is 49, how old is Sarah and how old is John?"
  },
  {
    title: "The Photograph Riddle",
    category: "Kinship Deductive Logic",
    trap: "Deictic Kin Reference Error",
    description: "Confuses pronouns and recursive pointers ('father's son' in relation to the speaker with no siblings).",
    question: "A man is looking at a photograph of someone. His friend asks who it is. The man replies: \"Brothers and sisters I have none. But that man's father is my father's son.\" Who is in the photograph?"
  }
];

export default function Playground() {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customQuestion, setCustomQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationPayload | null>(null);
  const [errorInfo, setErrorInfo] = useState<{ message: string; remediation?: string } | null>(null);

  // Stats calculation variables
  const getSelectedQuestion = () => {
    if (selectedPreset === -1) return customQuestion;
    return PUZZLE_PRESETS[selectedPreset].question;
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    if (idx !== -1) {
      setCustomQuestion(PUZZLE_PRESETS[idx].question);
    } else {
      setCustomQuestion("");
    }
  };

  const runEvaluation = async () => {
    const questionToRun = getSelectedQuestion().trim();
    if (!questionToRun) return;

    setIsLoading(true);
    setErrorInfo(null);
    setResult(null);

    try {
      const response = await fetch("/api/reasoning/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToRun })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to execute pipeline.");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorInfo({
        message: err.message || "An unexpected network error occurred while running the logic engine.",
        remediation: "Verify that GEMINI_API_KEY is configured in your Settings > Secrets panel, or restart the dev server if it appears stale."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to highlight structuring tags or bold sections for maximum readability
  const renderFormattedChain = (chain: string | undefined) => {
    if (!chain) return "No data returned.";
    
    // Split key structural stages based on bracketed headers
    const segments = chain.split(/(\[[A-Z0-9_\-\s]+\]:?)/g);
    
    return (
      <div className="space-y-4 font-sans text-sm leading-relaxed text-slate-700">
        {segments.map((seg, i) => {
          if (seg.startsWith("[") && seg.endsWith("]")) {
            return (
              <div 
                key={i} 
                className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 border-l-2 border-slate-400 pl-3 mt-4 first:mt-0"
              >
                <CornerDownRight className="w-3 h-3 text-slate-500" />
                {seg.replace(/[\[\]:]/g, "")}
              </div>
            );
          }
          return <p key={i} className="pl-5 text-slate-600 font-sans break-words whitespace-pre-wrap">{seg.trim()}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8" id="cot-playground">
      {/* Intro Header banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono mb-2">
            <Sparkles className="w-3 h-3" /> PIPELINE TESTING UNIT
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Interactive Reasoning Sandbox
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Force explicit Chain-of-Thought reasoning steps and test self-correction checkpoints against common cognitive puzzles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left control panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-medium text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-3">
              <Search className="w-4 h-4 text-slate-500" />
              1. Select a Logical Trap Problem
            </h3>
            
            <div className="space-y-2">
              {PUZZLE_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  id={`preset-${i}`}
                  onClick={() => handleSelectPreset(i)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedPreset === i 
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="font-semibold text-xs flex justify-between items-center">
                    <span>{preset.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedPreset === i ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                    }`}>
                      {preset.category}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1.5 line-clamp-2 ${
                    selectedPreset === i ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {preset.description}
                  </p>
                  <p className={`text-[10px] italic mt-1 font-mono flex items-center gap-1 ${
                    selectedPreset === i ? "text-red-300" : "text-red-600"
                  }`}>
                    <AlertTriangle className="w-2.5 h-2.5" /> Trap: {preset.trap}
                  </p>
                </button>
              ))}

              <button
                id="preset-custom"
                onClick={() => handleSelectPreset(-1)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPreset === -1
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="font-semibold text-xs">Custom Challenge Question</div>
                <p className={`text-[11px] mt-1 ${selectedPreset === -1 ? "text-slate-300" : "text-slate-500"}`}>
                  Input your own multi-step sequence math problem, lateral riddle, or deduction equation.
                </p>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-medium text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-3">
              <Zap className="w-4 h-4 text-slate-500" />
              2. Query Formulation
            </h3>
            
            <div className="space-y-3">
              <label className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
                Active Problem Prompt
              </label>
              <textarea
                value={selectedPreset === -1 ? customQuestion : PUZZLE_PRESETS[selectedPreset].question}
                onChange={(e) => {
                  if (selectedPreset === -1) {
                    setCustomQuestion(e.target.value);
                  }
                }}
                disabled={selectedPreset !== -1}
                placeholder="Type your complex math formula, lateral riddle, or sequence prediction puzzle here..."
                className="w-full h-36 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white resize-none"
              />

              <button
                id="run-pipeline-btn"
                onClick={runEvaluation}
                disabled={isLoading || !getSelectedQuestion().trim()}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Audit Pipelines...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white text-white" />
                    Run Reasoning Framework
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time responses side-by-side */}
        <div className="lg:col-span-2 space-y-6">
          {errorInfo && (
            <div 
              className="p-5 bg-red-50 border border-red-200 rounded-xl text-xs space-y-2 text-red-900 transition-all duration-300 animate-in fade-in"
            >
              <div className="flex items-center gap-2 font-semibold font-sans">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Execution Failure
              </div>
              <p className="font-sans leading-relaxed">{errorInfo.message}</p>
              {errorInfo.remediation && (
                <div className="bg-white/80 p-3 rounded-lg border border-red-100 font-mono text-[10px] mt-2">
                  <strong className="text-red-955 block mb-1">REMEDIATION STEPS:</strong>
                  {errorInfo.remediation}
                </div>
              )}
            </div>
          )}

          {!result && !isLoading && !errorInfo && (
            <div
              className="h-full flex flex-col justify-center items-center text-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 transition-all duration-300 animate-in fade-in"
            >
              <HelpCircle className="w-12 h-12 stroke-[1.2] text-slate-400 mb-3" />
              <h4 className="font-medium text-slate-800 text-xs">No Active Pipeline Execution</h4>
              <p className="text-[11px] max-w-sm mt-1.5 leading-relaxed">
                Select an academic puzzle trap layout on the left column or type a custom lateral riddle, then trigger the reasoning pipelines.
              </p>
            </div>
          )}

          {isLoading && (
            <div
              className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-4 transition-all duration-300 animate-in fade-in"
            >
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-slate-900" />
              <div>
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider font-mono">
                  Synchronizing Pipeline Notes
                </h4>
                <div className="max-w-md mx-auto space-y-2 mt-3 font-sans text-xs">
                  <p className="text-[11px] text-slate-500">
                    Step 1: Instantiating Direct baseline model reference turn...
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Step 2: Injecting cot_prompt.txt structuring layers to construct verbal math chains...
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold text-slate-900">
                    Step 3: Triggering self_correction_prompt.txt to trace and prevent logic slips...
                  </p>
                </div>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div
              className="space-y-6 transition-all duration-300 animate-in fade-in"
            >
              <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[11px] font-mono text-slate-600">
                  Model: <strong className="text-slate-900">models/gemini-3.5-flash</strong> (0.1 temp)
                </span>
                
                {result.corrected.detectedCorrection && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold bg-red-150 border border-red-200 text-red-900 rounded-full font-mono shadow-sm animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-600" /> SELF-CORRECTION RESOLVED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Direct baseline output */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[450px]">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold font-mono text-xs text-slate-900">Baseline (No CoT)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">Fast Turn</span>
                  </div>

                  <div className="p-4 overflow-y-auto flex-1 font-sans text-xs text-slate-700 leading-relaxed bg-slate-50/20 whitespace-pre-wrap">
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-2 border-b border-dashed border-slate-200 pb-1">
                      Direct Model Answer
                    </div>
                    <p className="text-slate-800 break-words">{result.direct.answer}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 space-y-1.5 text-[10px] font-mono text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Latency:</span>
                      <strong className="text-slate-900">{(result.direct.stats.latencyMs / 1000).toFixed(2)}s</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> API Cost:</span>
                      <strong className="text-slate-900">${result.direct.stats.costUsd?.toFixed(6)}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Total Tokens:</span>
                      <strong className="text-slate-900">{result.direct.stats.totalTokens}</strong>
                    </div>
                  </div>
                </div>

                {/* CoT Structured output */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[450px]">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-slate-600" />
                      <span className="font-semibold font-mono text-xs text-slate-900">CoT Prompt Trace</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-900 text-white px-1.5 py-0.5 rounded">Structured</span>
                  </div>

                  <div className="p-4 overflow-y-auto flex-1 bg-slate-50/20 whitespace-pre-wrap font-sans">
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-2 border-b border-dashed border-slate-200 pb-1">
                      Chain-of-Thought
                    </div>
                    {renderFormattedChain(result.cot.chain)}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 space-y-1.5 text-[10px] font-mono text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Latency:</span>
                      <strong className="text-slate-900">{(result.cot.stats.latencyMs / 1000).toFixed(2)}s</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> API Cost:</span>
                      <strong className="text-slate-900">${result.cot.stats.costUsd?.toFixed(6)}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Total Tokens:</span>
                      <strong className="text-slate-900">{result.cot.stats.totalTokens}</strong>
                    </div>
                  </div>
                </div>

                {/* Correction audited outputs */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[450px] col-span-1 md:col-span-2 lg:col-span-1 border-l-4 border-l-slate-950 animate-in">
                  <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0 text-white font-sans">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-slate-300" />
                      <span className="font-semibold font-mono text-xs">Self-Correction Audit</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Retrospective</span>
                  </div>

                  <div className="p-4 overflow-y-auto flex-1 bg-slate-50/20 whitespace-pre-wrap font-sans">
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-2 border-b border-dashed border-slate-200 pb-1">
                      Revision Checkpoint
                    </div>
                    {renderFormattedChain(result.corrected.chain)}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 space-y-1.5 text-[10px] font-mono text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Latency:</span>
                      <strong className="text-slate-900">{(result.corrected.stats.latencyMs / 1000).toFixed(2)}s</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> API Cost:</span>
                      <strong className="text-slate-900">${result.corrected.stats.costUsd?.toFixed(6)}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Total Tokens:</span>
                      <strong className="text-slate-900">{result.corrected.stats.totalTokens}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cognitive workflow deconstruction visualization bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h4 className="font-medium text-xs text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Cognitive Structuring Lifecycle Visualization
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 text-center text-[10px] font-mono text-slate-600">
                  <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 font-semibold text-slate-900">
                    Problem Understanding
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 font-semibold text-slate-900">
                    Known Facts
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 font-semibold text-slate-900">
                    Assumptions
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 font-semibold text-slate-900">
                    Step-by-Step Reasoning
                  </div>
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold rounded-lg">
                    Intermediate Conclusion
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 font-semibold rounded-lg">
                    Self-Review & Check
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-lg shadow-sm">
                    Corrective Final Answer
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
