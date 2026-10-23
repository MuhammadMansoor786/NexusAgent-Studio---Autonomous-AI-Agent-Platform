import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Table,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { AgentArtifact } from '../types/agent';

interface ArtifactPanelProps {
  artifacts: AgentArtifact[];
  activeArtifactId: string | null;
  onSelectArtifact: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentArtifact =
    artifacts.find(a => a.id === activeArtifactId) || artifacts[0];

  const handleCopy = () => {
    if (!currentArtifact) return;
    navigator.clipboard.writeText(currentArtifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentArtifact) return;
    const blob = new Blob([currentArtifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentArtifact.title.includes('.')
      ? currentArtifact.title
      : `${currentArtifact.title}.${currentArtifact.type === 'code' ? 'ts' : 'md'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="fixed md:static inset-y-0 right-0 z-30 w-full md:w-96 bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace Artifacts ({artifacts.length})
          </h3>
          <p className="text-[11px] text-slate-500">Deliverables compiled by agents</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="Close Artifacts Panel"
          aria-label="Close Artifacts Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {artifacts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <FileCode className="w-10 h-10 mb-2 opacity-40 text-cyan-400" />
          <p className="text-xs font-medium text-slate-400">No artifacts generated yet</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Run an autonomous mission with an agent to produce specifications, code files, or data reports.
          </p>
        </div>
      ) : (
        <>
          {/* Artifacts Tab List */}
          <div className="p-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {artifacts.map(art => {
              const isActive = currentArtifact?.id === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => onSelectArtifact(art.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/40'
                  }`}
                >
                  {art.type === 'code' ? (
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  ) : art.type === 'table' ? (
                    <Table className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-pink-400" />
                  )}
                  <span className="truncate max-w-[120px]">{art.title}</span>
                </button>
              );
            })}
          </div>

          {/* Artifact Details & Viewer */}
          {currentArtifact && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">
                    {currentArtifact.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    Type: {currentArtifact.type} {currentArtifact.language && `• ${currentArtifact.language}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Copy to clipboard"
                    aria-label="Copy artifact content"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Download file"
                    aria-label="Download artifact file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code / Content Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                {currentArtifact.content}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
};
