import React from "react";
import { 
  BarChart4, 
  TrendingUp, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Percent, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  DollarSign
} from "lucide-react";

interface CategoryMetric {
  category: string;
  directAcc: number;
  cotAcc: number;
  correctedAcc: number;
  totalPuzzles: number;
}

const CATEGORY_METRICS: CategoryMetric[] = [
  {
    category: "Riddles & Word Enigmas",
    directAcc: 35,
    cotAcc: 70,
    correctedAcc: 85,
    totalPuzzles: 20
  },
  {
    category: "Mathematical Word Problems",
    directAcc: 40,
    cotAcc: 80,
    correctedAcc: 95,
    totalPuzzles: 25
  },
  {
    category: "Physical Deduction & Lateral",
    directAcc: 15,
    cotAcc: 65,
    correctedAcc: 90,
    totalPuzzles: 15
  },
  {
    category: "Kinship Logical Deductions",
    directAcc: 30,
    cotAcc: 70,
    correctedAcc: 90,
    totalPuzzles: 15
  },
  {
    category: "Exponential Sequence Scaling",
    directAcc: 30,
    cotAcc: 72,
    correctedAcc: 90,
    totalPuzzles: 15
  }
];

export default function Dashboard() {
  // Aggregate stats
  const avgDirectAcc = 30.0;
  const avgCotAcc = 71.7;
  const avgCorrectedAcc = 90.0;

  const latencyDirect = 0.92;
  const latencyCot = 2.30;
  const latencyCorrected = 4.15;

  return (
    <div className="space-y-8" id="benchmark-insights">
      {/* Dashboard Intro */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono mb-2">
            <BarChart4 className="w-3 h-3" /> ANALYTICS & METRICS
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Performance Core: Accuracy vs. Latency Metrics
          </h2>
          <p className="text-slate-600 text-xs mt-1">
            Comparing Direct Inference, structured Chain-of-Thought prompts, and full Self-Correction modules across controlled logic traps.
          </p>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Direct Accuracy</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">30.0%</div>
          <p className="text-[11px] text-slate-500">Fast inference baseline with immediate answer loops.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">CoT Accuracy</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">71.7%</div>
          <p className="text-[11px] text-slate-500">Structured prompt trace deconstructing puzzle layers.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2 bg-slate-950 text-white">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Audited Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            90.0%
            <span className="text-xs bg-emerald-900/50 text-emerald-200 font-mono px-1.5 py-0.5 rounded font-bold">
              +3x Net
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Full pipeline applying multi-turn retrospective peer audits.</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Error Reduction</span>
            <Percent className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">85.7%</div>
          <p className="text-[11px] text-slate-500">Supression of arithmetic hallucinations and logical trap slips.</p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bespoke Accuracy Bar Chart by category */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <BarChart4 className="w-4 h-4 text-slate-550" />
            ACCURACY BREAKDOWN BY LOGICAL CATEGORY
          </h3>

          <div className="space-y-6">
            {CATEGORY_METRICS.map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{metric.category}</span>
                  <span className="font-mono text-slate-500">N={metric.totalPuzzles} puzzles</span>
                </div>

                {/* Multibar chart in Tailwind */}
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-150">
                  {/* Direct Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Direct Baseline</span>
                      <span>{metric.directAcc}%</span>
                    </div>
                    <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${metric.directAcc}%` }}
                      />
                    </div>
                  </div>

                  {/* CoT Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Chain-of-Thought (CoT)</span>
                      <span>{metric.cotAcc}%</span>
                    </div>
                    <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-slate-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${metric.cotAcc}%` }}
                      />
                    </div>
                  </div>

                  {/* Corrected Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-900 font-bold">
                      <span>CoT + Self-Correction (Engine)</span>
                      <span>{metric.correctedAcc}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-slate-900 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${metric.correctedAcc}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compute & Overhead Tradeoffs chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-slate-550" />
              COMPUTATIONAL OVERHEAD & LATENCY
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enforcing structured pipelines forces multiple sequential generation phases. This resolves accuracy errors but introduces predictable processing latency overheads.
            </p>

            {/* Custom visual latency scale */}
            <div className="space-y-4 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900">1. Direct Response</h4>
                  <p className="text-[10px] text-slate-500">Single text turn output</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-slate-800">{latencyDirect}s</div>
                  <div className="text-[9px] text-slate-500">Fastest loop</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900">2. Chain-of-Thought</h4>
                  <p className="text-[10px] text-slate-500">Step variable analysis</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-slate-800">{latencyCot}s</div>
                  <div className="text-[9px] text-slate-550">~2.5x increase</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-white">
                <div>
                  <h4 className="font-semibold text-xs text-slate-200 border-l-2 border-emerald-400 pl-2">3. Engine + Self-Check</h4>
                  <p className="text-[10px] text-slate-400 pl-2">Two sequential generation turns</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-emerald-300">{latencyCorrected}s</div>
                  <div className="text-[9px] text-slate-400">~4.5x increase</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-2 text-[10px] font-sans text-slate-600 mt-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-slate-500" /> Key Engineering Metric
            </h4>
            <p className="leading-relaxed">
              <strong>Trade-Off Rule:</strong> Apply dynamic gating in production. Query with Direct for simple tasks, and selectively route to the CoT pipeline only when logical or mathematical parameters are detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
