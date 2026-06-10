import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Tv, 
  FileText, 
  Award, 
  HelpCircle, 
  Sliders, 
  Play, 
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Grid
} from "lucide-react";
import { presentationSlides as slides, PresentationSlide } from "../projectFiles";

export default function Presentation() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Render a visual schematic or diagram matching the slide logic
  const renderVisualArtifact = (slideData: PresentationSlide) => {
    switch (slideData.visualType) {
      case "diagram":
        return (
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-center flex-1 self-stretch flex flex-col justify-center min-h-[220px]">
            <h4 className="text-yellow-400 font-bold text-xs uppercase tracking-wider">{slideData.diagramTitle || "Architecture Flow"}</h4>
            
            <div className="flex flex-col items-center gap-1.5 text-[9px] relative py-2">
              <div className="bg-slate-800 border border-slate-705 px-3 py-1 rounded">Input Question</div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-350 rotate-90" />
              <div className="bg-slate-800 border border-slate-705 px-3 py-1 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Chain-of-Thought Generator</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-350 rotate-90" />
              <div className="bg-slate-850 px-3 py-1 rounded text-cyan-300">Cognitive Trace Steps</div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-350 rotate-90" />
              <div className="bg-slate-800 border border-slate-705 px-3 py-1 rounded flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Self-Correction Auditor</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-350 rotate-90" />
              <div className="bg-emerald-950 border border-emerald-600 px-3 py-1 rounded text-white font-bold">Certified Output</div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="bg-slate-50 border border-slate-200.rounded-xl p-4 rounded-xl space-y-2 flex-grow self-stretch flex flex-col justify-center text-xs">
            <h4 className="font-semibold text-slate-950 font-mono text-[10px] uppercase block tracking-wider">Evaluation Benchmarks</h4>
            
            <table className="w-full text-[10px] border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-300 text-slate-705 uppercase font-mono text-left">
                  <th className="py-1">System Mode</th>
                  <th className="py-1">Accuracy (%)</th>
                  <th className="py-1">Latency (s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-1">Direct Baseline</td>
                  <td className="py-1 text-amber-600 font-bold">30.0%</td>
                  <td className="py-1">0.92s</td>
                </tr>
                <tr>
                  <td className="py-1">CoT Prompting</td>
                  <td className="py-1 font-semibold">71.7%</td>
                  <td className="py-1 font-mono">2.30s</td>
                </tr>
                <tr className="bg-slate-950 text-white font-semibold">
                  <td className="py-1 pl-1">CoT + Self-Check</td>
                  <td className="py-1 text-emerald-400 font-bold">90.0%</td>
                  <td className="py-1 pr-1 font-mono">4.15s</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "quote":
        return (
          <div className="border-l-4 border-slate-900 bg-slate-50 p-5 rounded-r-xl italic text-slate-750 font-serif leading-relaxed text-xs flex-grow self-stretch flex flex-col justify-center">
            "{slideData.subtitle || "Force analytical deconstructs to capture and reverse logical hallucinations before state emissions occurs."}"
          </div>
        );

      case "bullets":
      default:
        return (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 flex-grow self-stretch flex flex-col justify-center font-mono text-[10px] text-slate-600">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold uppercase">
              <Grid className="w-3.5 h-3.5" />
              <span>Project Checkpoints</span>
            </div>
            <div className="space-y-1">
              <div>✓ Modular Python Framework</div>
              <div>✓ Cost & Token Estimation</div>
              <div>✓ Rigorous Logic Traps Tested</div>
              <div>✓ Certified Audit Outflows</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6" id="slides-deck">
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono mb-2">
            <Tv className="w-3 h-3" /> PRESENTATION MODULE
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Defense Slide Deck & Pitch Presentation
          </h2>
          <p className="text-slate-600 text-xs mt-1">
            Slide-by-slide structure outline optimized for defense of your academic intern project thesis.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main slide layout */}
        <div className="bg-white border border-slate-200.rounded-xl rounded-xl shadow-md p-8 min-h-[420px] flex flex-col justify-between relative overflow-hidden border-t-8 border-slate-950">
          
          {/* Top slide counts */}
          <div className="flex justify-between items-center text-[11px] font-mono font-semibold text-slate-400">
            <span>CHAIN-OF-THOUGHT LOGIC ENGINE</span>
            <span>SLIDE {slide.number} OF {slides.length}</span>
          </div>

          {/* Middle slide content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-6 items-center flex-1">
            
            {/* Bullet points on Left */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                {slide.title}
              </h3>
              {slide.subtitle && (
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                  {slide.subtitle}
                </p>
              )}

              <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed list-disc pl-5">
                {slide.points.map((point, index) => (
                  <li key={index} className="pl-1">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Schematic representation on Right */}
            <div className="md:col-span-5 flex items-center justify-center">
              {renderVisualArtifact(slide)}
            </div>
          </div>

          {/* Slide Footer with controls */}
          <div className="border-t border-slate-100 pt-5 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <Award className="w-4 h-4 text-slate-450" />
              <span>Internship Defense Deck</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="p-1.5 bg-slate-150 text-slate-700 rounded hover:bg-slate-205 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-205 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="font-mono text-xs flex items-center px-2 text-slate-600">
                {currentSlideIndex + 1} / {slides.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
