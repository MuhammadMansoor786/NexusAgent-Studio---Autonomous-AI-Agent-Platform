import React from 'react';
import {
  Rocket,
  MessageSquare,
  Globe,
  Code,
  Database,
  FileCheck2,
  PieChart,
  SlidersHorizontal,
  FolderOpen,
  Menu,
} from 'lucide-react';
import { Agent, AgentMode } from '../types/agent';

interface AgentHeaderProps {
  agent: Agent;
  mode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
  onToggleTool: (toolKey: keyof Agent['tools']) => void;
  onToggleSidebar: () => void;
  onToggleArtifacts: () => void;
  artifactsCount: number;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  mode,
  onModeChange,
  onToggleTool,
  onToggleSidebar,
  onToggleArtifacts,
  artifactsCount,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/40 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Agent Info & Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Agent Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">{agent.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {agent.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{agent.description}</p>
        </div>
      </div>

      {/* Mode Switcher & Tools Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mission vs Chat Mode Toggle */}
        <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => onModeChange('mission')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              mode === 'mission'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Autonomous Mission</span>
          </button>
          <button
            onClick={() => onModeChange('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              mode === 'chat'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive Chat</span>
          </button>
        </div>

        {/* Tools Quick Toggles */}
        <div className="hidden lg:flex items-center gap-1 border-l border-slate-800 pl-3">
          <span className="text-[11px] text-slate-500 mr-1">Tools:</span>
          <button
            onClick={() => onToggleTool('webSearch')}
            className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
              agent.tools.webSearch
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Web Search: ${agent.tools.webSearch ? 'Enabled' : 'Disabled'}`}
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleTool('codeSandbox')}
            className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
              agent.tools.codeSandbox
                ? 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Code Sandbox: ${agent.tools.codeSandbox ? 'Enabled' : 'Disabled'}`}
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleTool('memoryStore')}
            className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
              agent.tools.memoryStore
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Vector Memory: ${agent.tools.memoryStore ? 'Enabled' : 'Disabled'}`}
          >
            <Database className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleTool('artifactBuilder')}
            className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
              agent.tools.artifactBuilder
                ? 'bg-pink-950/60 border-pink-700/60 text-pink-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Artifact Studio: ${agent.tools.artifactBuilder ? 'Enabled' : 'Disabled'}`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Artifacts Drawer Button */}
        <button
          onClick={onToggleArtifacts}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Artifacts</span>
          {artifactsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
              {artifactsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
