/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  BarChart4, 
  FolderOpen, 
  FileText, 
  Tv, 
  GraduationCap, 
  BookOpen, 
  ArrowRight
} from "lucide-react";
import Playground from "./components/Playground";
import FileExplorer from "./components/FileExplorer";
import Dashboard from "./components/Dashboard";
import Presentation from "./components/Presentation";
import ReportViewer from "./components/ReportViewer";

type TabId = "playground" | "metrics" | "explorer" | "report" | "slides";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("playground");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans tracking-tight antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Prime Header, clean off-white design */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-950 pr-4">
                Chain-of-Thought (CoT) Logic Engine
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Enhancing Multi-Step Reasoning and Self-Correction in Large Language Models
              </p>
            </div>
          </div>

          {/* Academic Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-201 text-slate-800 rounded-full font-mono text-[10px] uppercase font-bold self-start md:self-auto">
            <span>Internship Thesis Project</span>
          </div>
        </div>

        {/* Tab row */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto border-b border-transparent py-1 scrollbar-none scroll-smooth">
            <button
              id="tab-playground"
              onClick={() => setActiveTab("playground")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg font-mono tracking-wide transition-all ${
                activeTab === "playground"
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Reasoning Sandbox</span>
            </button>

            <button
              id="tab-metrics"
              onClick={() => setActiveTab("metrics")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg font-mono tracking-wide transition-all ${
                activeTab === "metrics"
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BarChart4 className="w-4 h-4" />
              <span>Performance Metrics</span>
            </button>

            <button
              id="tab-explorer"
              onClick={() => setActiveTab("explorer")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg font-mono tracking-wide transition-all ${
                activeTab === "explorer"
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>virtual Workspace IDE</span>
            </button>

            <button
              id="tab-report"
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg font-mono tracking-wide transition-all ${
                activeTab === "report"
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Thesis Dissertation</span>
            </button>

            <button
              id="tab-slides"
              onClick={() => setActiveTab("slides")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg font-mono tracking-wide transition-all ${
                activeTab === "slides"
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Defense Slides Deck</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main active workspace viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 overflow-y-auto">
        {activeTab === "playground" && <Playground />}
        {activeTab === "metrics" && <Dashboard />}
        {activeTab === "explorer" && <FileExplorer />}
        {activeTab === "report" && <ReportViewer />}
        {activeTab === "slides" && <Presentation />}
      </main>

      {/* Pristine footer */}
      <footer className="bg-white border-t border-slate-200 py-5 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
          <div>
            © 2026 Chain-of-Thought Logic Engine. All intellectual assets certified.
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              Active Host <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> Cloud Run Cluster
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
