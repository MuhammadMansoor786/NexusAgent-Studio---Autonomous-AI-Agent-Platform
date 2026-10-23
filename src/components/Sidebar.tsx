import React from 'react';
import {
  Target,
  Code2,
  Compass,
  BarChart3,
  Bot,
  Plus,
  ShieldCheck,
  Cpu,
  Search,
  Terminal,
  Database,
  FileCode,
  Sliders,
} from 'lucide-react';
import { Agent } from '../types/agent';

interface SidebarProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (agentId: string) => void;
  onOpenNewAgent: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onOpenNewAgent,
  isOpen,
  onToggle,
}) => {
  const getAvatarIcon = (avatarName: string, colorClass: string) => {
    const iconClass = 'w-4 h-4 text-white';
    switch (avatarName) {
      case 'Terminal':
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <Terminal className={iconClass} />
          </div>
        );
      case 'Target':
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <Target className={iconClass} />
          </div>
        );
      case 'Code2':
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <Code2 className={iconClass} />
          </div>
        );
      case 'Compass':
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <Compass className={iconClass} />
          </div>
        );
      case 'BarChart3':
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <BarChart3 className={iconClass} />
          </div>
        );
      default:
        return (
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-md`}>
            <Bot className={iconClass} />
          </div>
        );
    }
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Agents Roster Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Agent Directory ({agents.length})
          </h2>
          <p className="text-[11px] text-slate-500">Autonomous personas & capabilities</p>
        </div>
        <button
          onClick={onOpenNewAgent}
          className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 transition cursor-pointer"
          title="Create New Agent"
          aria-label="Create New Agent"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {agents.map(agent => {
          const isActive = agent.id === activeAgentId;
          const activeToolsCount = Object.values(agent.tools).filter(Boolean).length;

          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {getAvatarIcon(agent.avatar, agent.color)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition truncate">
                      {agent.name}
                    </span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    ) : (
                      <span className="text-[10px] text-slate-500">Idle</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{agent.role}</p>

                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {agent.thinkingLevel} Thinking
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-400 border border-slate-700/50">
                      {activeToolsCount} Tools
                    </span>
                    {agent.isCustom && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Agent Capability Matrix Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Active Agent Architecture</span>
          <span className="text-cyan-400">ReAct + CoT</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <Search className="w-3 h-3 text-emerald-400" />
            <span>Web Search</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>Code Sandbox</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <Database className="w-3 h-3 text-amber-400" />
            <span>Vector Memory</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <FileCode className="w-3 h-3 text-pink-400" />
            <span>Artifact Studio</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
