import React from 'react';
import { Bot, Sparkles, Cpu, Database, Plus, Download, Trash2 } from 'lucide-react';
import { Agent } from '../types/agent';

interface NavbarProps {
  activeAgent: Agent;
  onOpenNewAgent: () => void;
  onOpenMemory: () => void;
  onClearSession: () => void;
  onExportSession: () => void;
  messageCount: number;
  artifactCount: number;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeAgent,
  onOpenNewAgent,
  onOpenMemory,
  onClearSession,
  onExportSession,
  messageCount,
  artifactCount,
  hasApiKey,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Active Agent Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
          <Bot className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-100 text-base tracking-tight">NexusAgent</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Studio
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Autonomous Multi-Agent Workspace</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-cyan-400 font-medium">{activeAgent.name}</span>
          </p>
        </div>
      </div>

      {/* Model & System Telemetry Pills */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-slate-200">Gemini 3.8 Flash</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Thinking: {activeAgent.thinkingLevel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-slate-300">{hasApiKey ? 'Gemini Live Ready' : 'Agent Ready'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMemory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition cursor-pointer"
          title="Inspect Agent Memory"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Memory</span>
        </button>

        <button
          onClick={onOpenNewAgent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Agent</span>
        </button>

        {messageCount > 0 && (
          <>
            <button
              onClick={onExportSession}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              title="Export Session & Artifacts"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearSession}
              className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 text-xs transition cursor-pointer"
              title="Clear Conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
