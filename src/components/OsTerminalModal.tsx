import React, { useState } from 'react';
import {
  X,
  Terminal,
  FolderTree,
  Folder,
  FileCode,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { TerminalLog, VirtualFileNode } from '../types/agent';

interface OsTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminalLogs: TerminalLog[];
  filesystem: VirtualFileNode[];
  onExecuteCommand: (command: string, isConfirmed?: boolean) => void;
}

export const OsTerminalModal: React.FC<OsTerminalModalProps> = ({
  isOpen,
  onClose,
  terminalLogs,
  filesystem,
  onExecuteCommand,
}) => {
  if (!isOpen) return null;

  const [inputCmd, setInputCmd] = useState('');
  const [selectedTab, setSelectedTab] = useState<'terminal' | 'filesystem'>('terminal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    onExecuteCommand(inputCmd.trim());
    setInputCmd('');
  };

  const sampleCommands = [
    { label: 'List Files', cmd: 'ls -la' },
    { label: 'Scaffold React App', cmd: 'npx create-react-app telemetry-ui' },
    { label: 'Create Folder & File', cmd: 'mkdir -p project-x && touch project-x/main.py' },
    { label: 'Delete Temp Cache (Risky)', cmd: 'rm -rf downloads/cache_temp.log' },
    { label: 'System Shutdown (Risky)', cmd: 'shutdown -h now' },
  ];

  const renderFileTree = (nodes: VirtualFileNode[], depth: number = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ paddingLeft: `${depth * 16}px` }} className="py-1">
        <div className="flex items-center gap-2 text-xs hover:bg-slate-800/40 px-2 py-1 rounded">
          {node.type === 'directory' ? (
            <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.py') ? (
            <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className="font-mono text-slate-200">{node.name}</span>
          {node.size && <span className="text-[10px] text-slate-500 font-mono">({node.size})</span>}
        </div>
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">Local OS Subprocess & Virtual Filesystem</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  sandbox: safe
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Host: linux-x86_64 • Root: /home/user/workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedTab('terminal')}
                className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTab === 'terminal' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
              </button>
              <button
                onClick={() => setSelectedTab('filesystem')}
                className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTab === 'filesystem' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Filesystem</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close terminal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="p-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap pl-1">Run OS Command:</span>
          {sampleCommands.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteCommand(sample.cmd)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition whitespace-nowrap font-mono text-[11px] cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {selectedTab === 'terminal' ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-4">
            <div className="text-slate-500 text-[11px]">
              Nexus OS Automation Subshell [Version 2.6.4]
              <br />
              Type &apos;help&apos; or assign voice commands to Nexus OS-Agent.
            </div>

            {terminalLogs.map(log => (
              <div key={log.id} className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="text-emerald-400">user@nexus-os</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-indigo-400">~/workspace</span>
                  <span className="text-slate-300">$</span>
                  <span className="font-semibold text-slate-100">{log.command}</span>
                </div>

                <div
                  className={`p-3 rounded-lg border text-xs whitespace-pre-wrap leading-relaxed ${
                    log.status === 'blocked'
                      ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                      : log.status === 'error'
                      ? 'bg-red-950/30 border-red-600/40 text-red-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200'
                  }`}
                >
                  {log.output}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 space-y-2">
            <div className="text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Local Filesystem Directory Tree</span>
              <span className="text-[11px] text-cyan-400 font-mono">/home/user/workspace</span>
            </div>
            <div className="pt-2">{renderFileTree(filesystem)}</div>
          </div>
        )}

        {/* Interactive CLI Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-cyan-500 font-mono text-xs">
            <span className="text-cyan-400 font-bold">$</span>
            <input
              type="text"
              value={inputCmd}
              onChange={e => setInputCmd(e.target.value)}
              placeholder="e.g. npx create-react-app portfolio, mkdir -p test, ls -la..."
              className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute</span>
          </button>
        </form>
      </div>
    </div>
  );
};
