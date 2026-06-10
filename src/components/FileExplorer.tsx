import React, { useState, useEffect } from "react";
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Terminal, 
  Save, 
  Info,
  Layers,
  FileCode,
  FolderOpen
} from "lucide-react";
import { virtualProjectFiles as initialFiles, ProjectFile } from "../projectFiles";

export default function FileExplorer() {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("ChainOfThought_LogicEngine/src/reasoning_engine.py");
  const [editorContent, setEditorContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
    "ChainOfThought_LogicEngine": true,
    "ChainOfThought_LogicEngine/src": true,
    "ChainOfThought_LogicEngine/prompts": true,
    "ChainOfThought_LogicEngine/data": true,
    "ChainOfThought_LogicEngine/outputs": true,
    "ChainOfThought_LogicEngine/report": true,
  });

  // Keep track of active selected file
  const activeFile = files.find(f => f.path === selectedFilePath);

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || "");
      setIsSaved(false);
    }
  }, [selectedFilePath, activeFile]);

  const toggleFolder = (path: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleCopy = () => {
    if (editorContent) {
      navigator.clipboard.writeText(editorContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([editorContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    setFiles(prev => 
      prev.map(f => f.path === selectedFilePath ? { ...f, content: editorContent } : f)
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Triger download of the entire project setup script (or composite download list)
  const downloadAllAsBundle = () => {
    const header = `# ==========================================\n# Chain-of-Thought Logic Engine Script Bundle\n# ==========================================\n\n`;
    const body = files
      .filter(f => f.type === "file")
      .map(f => `\n# === FILE: ${f.path} ===\n${f.content || ""}\n`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cot_logic_engine_bundle.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Draw directory tree recursively
  const renderTree = (parentPath: string) => {
    const items = files.filter(f => {
      const pDir = f.path.substring(0, f.path.lastIndexOf("/"));
      return pDir === parentPath && f.path !== "ChainOfThought_LogicEngine";
    });

    // Sort: directories first, then files
    const sorted = [...items].sort((a, b) => {
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="pl-4 space-y-1">
        {sorted.map(item => {
          if (item.type === "directory") {
            const isFolderOpen = isExpanded[item.path];
            return (
              <div key={item.path} className="space-y-1">
                <button
                  onClick={() => toggleFolder(item.path)}
                  className="w-full flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded text-xs text-slate-800 font-mono font-semibold"
                >
                  <span className="text-slate-400">
                    {isFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                  <Folder className="w-4 h-4 text-sky-600 fill-sky-200" />
                  <span>{item.name}/</span>
                </button>
                {isFolderOpen && renderTree(item.path)}
              </div>
            );
          } else {
            const isSelected = selectedFilePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setSelectedFilePath(item.path)}
                className={`w-full flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded text-xs text-left font-mono border-l-2 ${
                  isSelected 
                    ? "bg-slate-150 text-slate-950 font-bold border-l-slate-900" 
                    : "text-slate-600 border-l-transparent"
                }`}
              >
                <File className="w-3.5 h-3.5 text-slate-400 fill-slate-50 ml-5" />
                <span>{item.name}</span>
              </button>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="virtual-ide">
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono mb-2">
            <FolderOpen className="w-3 h-3" /> INTERN WORKSPACE
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Source Code & Dataset Explorer
          </h2>
          <p className="text-slate-600 text-xs mt-1">
            Review the modular Python architecture, evaluation questions, and prompts. This virtual directory can be modified and exported as an integration-ready archive.
          </p>
        </div>

        <button
          onClick={downloadAllAsBundle}
          className="bg-slate-900 hover:bg-slate-800 text-white font-mono font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition-all text-center self-start md:self-center"
        >
          <Download className="w-3.5 h-3.5" /> Export Full Codebase (.txt)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Tree column */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-[650px]">
          <h3 className="font-semibold text-xs text-slate-900 font-mono flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <Layers className="w-4 h-4 text-slate-550" />
            WORKSPACE DIRECTORY
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2">
            {/* Main direct tree start */}
            <div>
              <button
                onClick={() => toggleFolder("ChainOfThought_LogicEngine")}
                className="w-full flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded text-xs text-slate-950 font-mono font-bold"
              >
                <span className="text-slate-400">
                  {isExpanded["ChainOfThought_LogicEngine"] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </span>
                <Folder className="w-4 h-4 text-emerald-600 fill-emerald-200" />
                <span>ChainOfThought_LogicEngine/</span>
              </button>

              {isExpanded["ChainOfThought_LogicEngine"] && renderTree("ChainOfThought_LogicEngine")}
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-205 rounded-lg space-y-2 text-[10px] font-sans text-slate-600">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1"><Info className="w-3.5 h-3.5 text-slate-500" /> Professional Design Note</h4>
            <p className="leading-relaxed">
              This files tree illustrates the modular structure of the project. Developers can copy individual elements or customize prompts to optimize the CoT and retrospective check behaviors.
            </p>
          </div>
        </div>

        {/* Right Code editor pane */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[650px]">
          {/* Editor Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-650" />
              <span className="font-mono font-semibold text-xs text-slate-900">{selectedFilePath}</span>
              {isSaved && (
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold rounded animate-fade-in">
                  ✓ SAVED TO SHADOW CONTEXT
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 flex items-center gap-1 text-[11px] font-mono border border-slate-200 bg-white"
                title="Copy contents"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-705 hover:text-slate-900 flex items-center gap-1 text-[11px] font-mono border border-slate-200 bg-white"
                title="Download single file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Local</span>
              </button>

              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-slate-900 bg-slate-950 text-white rounded flex items-center gap-1 text-[11px] font-mono"
                title="Commit changes locally"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Memory</span>
              </button>
            </div>
          </div>

          {/* Interactive Editable Terminal Editor */}
          <div className="flex-1 flex flex-col font-mono text-xs overflow-hidden relative">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="flex-1 w-full p-4 bg-slate-950 text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
              spellCheck={false}
            />

            {/* Line counting side strip gutter overlay can be avoided to keep it clean */}
            <div className="absolute top-2 right-4 bg-slate-900/60 text-slate-400 text-[9px] px-2 py-0.5 rounded pointer-events-none">
              UTF-8 • {activeFile?.language || "text"}
            </div>
          </div>

          {/* Simulated shell execution feedback */}
          <div className="bg-slate-900 border-t border-slate-800 p-3 shrink-0 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>Shell Console Simulator: Ready</span>
            </div>
            <div className="text-slate-500">
              $ python src/main.py --eval-mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
