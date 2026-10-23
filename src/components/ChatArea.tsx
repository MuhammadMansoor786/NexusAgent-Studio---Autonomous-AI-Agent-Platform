import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  ChevronDown,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Wrench,
  FileText,
  Table,
  Code2,
  Maximize2,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldAlert,
  Check,
  X,
  Volume2,
  Terminal,
} from 'lucide-react';
import { Agent, AgentMessage, AgentMode, AgentArtifact } from '../types/agent';

interface ChatAreaProps {
  agent: Agent;
  mode: AgentMode;
  messages: AgentMessage[];
  isLoading: boolean;
  onSendMessage: (prompt: string, isVoiceInput?: boolean) => void;
  onOpenArtifact: (artifact: AgentArtifact) => void;
  onConfirmRiskyAction?: (command: string, approved: boolean) => void;
  onOpenTerminal?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  agent,
  mode,
  messages,
  isLoading,
  onSendMessage,
  onOpenArtifact,
  onConfirmRiskyAction,
  onOpenTerminal,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showVoicePresets, setShowVoicePresets] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Web Speech API or simulated dictation
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };
        recognition.onerror = () => {
          setIsRecording(false);
          setShowVoicePresets(true);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
        return;
      } catch {
        // Fallback to voice presets
      }
    }

    // Fallback: toggle voice preset quick list
    setShowVoicePresets(!showVoicePresets);
  };

  const voicePresets = [
    {
      label: 'Scaffold React App',
      voice: 'Create a new folder called project-alpha and scaffold a React app inside',
      type: 'safe',
    },
    {
      label: 'Write CPU Monitor Script',
      voice: 'Write a Python script that monitors CPU usage into monitor.py',
      type: 'safe',
    },
    {
      label: 'Organize Downloads',
      voice: 'Organize my downloads directory and list files',
      type: 'safe',
    },
    {
      label: 'Delete Temp Cache Folder',
      voice: 'Delete the old temporary cache folder',
      type: 'risky',
    },
    {
      label: 'Shutdown Local Computer',
      voice: 'Shutdown the computer',
      type: 'risky',
    },
  ];

  const quickPrompts: Record<string, string[]> = {
    'nexus-os-agent': [
      'Create a new folder called project-alpha and scaffold a React app inside',
      'Write a Python script that monitors CPU usage into monitor.py',
      'Delete the old temporary cache folder',
      'Shutdown the computer',
    ],
    'chronos-planner': [
      'Build an autonomous agent pipeline with memory recall and tool sandboxing',
      'Create a complete product release plan for an AI developer platform',
      'Decompose an end-to-end cloud migration into verifiable weekly milestones',
    ],
    'nova-coder': [
      'Implement a distributed job queue worker with TypeScript and backoff retry',
      'Design a reactive event-driven state machine for multi-agent negotiation',
      'Write a high-performance in-memory LRU cache with TTL eviction in TypeScript',
    ],
  };

  const currentPrompts = quickPrompts[agent.id] || quickPrompts['nexus-os-agent'];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-8 px-4 text-center">
            {/* Agent Hero */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${agent.color} mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/10 mb-4`}
            >
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">{agent.name}</h3>
            <p className="text-sm font-medium text-cyan-400 mt-1">{agent.role}</p>
            <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
              {agent.description}
            </p>

            {/* Safety Protocol Badge */}
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Strict Human-in-the-Loop safety guardrail active</span>
            </div>

            <div className="mt-8 border-t border-slate-900 pt-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Voice & Terminal Automation Missions
              </span>
              <div className="mt-3 grid grid-cols-1 gap-2 text-left">
                {currentPrompts.map((prompt, idx) => {
                  const isRisky = /delete|shutdown|format|reboot/i.test(prompt);
                  return (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt)}
                      className={`p-3 rounded-xl border text-xs transition flex items-center justify-between group cursor-pointer ${
                        isRisky
                          ? 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-800/40 hover:border-amber-600/60 text-amber-200'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isRisky ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span className="truncate">{prompt}</span>
                      </div>
                      {isRisky && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/40 ml-2 shrink-0">
                          Risky (Confirmation)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`max-w-3xl mx-auto flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* User Message */}
              {msg.role === 'user' ? (
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-md text-sm max-w-xl">
                    {msg.isVoiceInput && (
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan-200 font-semibold mb-1 uppercase tracking-wider">
                        <Volume2 className="w-3 h-3 text-cyan-300 animate-pulse" />
                        <span>Transcribed Voice Input</span>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* Agent Message Card */
                <div className="w-full bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{agent.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {agent.model}
                          </span>
                        </div>
                      </div>
                    </div>
                    {msg.executionTimeMs && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {(msg.executionTimeMs / 1000).toFixed(2)}s
                      </span>
                    )}
                  </div>

                  {/* CRITICAL Human-in-the-Loop Risk Confirmation Banner */}
                  {msg.pendingConfirmation && (
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/60 space-y-3 shadow-lg">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Strict Human-in-the-Loop Protocol Triggered
                          </h4>
                          <p className="text-xs text-amber-100 font-mono mt-1 font-semibold">
                            {msg.pendingConfirmation.warningText}
                          </p>
                          <div className="mt-2 text-[11px] text-slate-300">
                            Target command:{' '}
                            <code className="text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded font-mono">
                              {msg.pendingConfirmation.command}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-800/50">
                        <button
                          onClick={() =>
                            onConfirmRiskyAction?.(msg.pendingConfirmation!.command, false)
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                          <span>No (Cancel)</span>
                        </button>
                        <button
                          onClick={() =>
                            onConfirmRiskyAction?.(msg.pendingConfirmation!.command, true)
                          }
                          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md shadow-amber-600/30 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Yes (Approve & Execute)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Thoughts Accordion */}
                  {msg.thoughts && (
                    <details className="group border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden text-xs">
                      <summary className="px-3 py-2 cursor-pointer select-none text-slate-400 font-medium flex items-center justify-between hover:bg-slate-900/40">
                        <span className="flex items-center gap-2 text-indigo-400 font-semibold">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Chain-of-Thought Reasoning</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
                      </summary>
                      <div className="p-3 border-t border-slate-800/60 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed bg-slate-950/80">
                        {msg.thoughts}
                      </div>
                    </details>
                  )}

                  {/* Execution Plan Checklist */}
                  {msg.plan && msg.plan.length > 0 && (
                    <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span className="flex items-center gap-1.5 text-cyan-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>OS Mission Execution Plan</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {msg.plan.filter(s => s.status === 'completed').length}/{msg.plan.length} Completed
                        </span>
                      </div>
                      <div className="space-y-1.5 mt-2">
                        {msg.plan.map((step, idx) => (
                          <div
                            key={step.id || idx}
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/40 text-xs"
                          >
                            <span
                              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                step.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {step.status === 'completed' ? '✓' : '•'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200 truncate">{step.title}</span>
                                {step.toolName && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                                    {step.toolName}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                              {step.resultSummary && (
                                <p className="text-[10px] text-emerald-400/90 font-mono mt-1">
                                  → {step.resultSummary}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tool Call Records */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="space-y-2">
                      {msg.toolCalls.map(tc => (
                        <details
                          key={tc.id}
                          className="border border-slate-800 rounded-xl bg-slate-950/40 text-xs overflow-hidden"
                        >
                          <summary className="px-3 py-2 cursor-pointer text-slate-400 font-medium flex items-center justify-between hover:bg-slate-900/40">
                            <span className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Tool Invoked: {tc.name}</span>
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                tc.status === 'awaiting_confirmation'
                                  ? 'bg-amber-950 text-amber-400 border-amber-800/40'
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                              }`}
                            >
                              {tc.status}
                            </span>
                          </summary>
                          <div className="p-3 border-t border-slate-800/60 space-y-2 bg-slate-950/80">
                            <div className="text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-300">Parameters:</span>{' '}
                              <code className="text-cyan-300 font-mono">{JSON.stringify(tc.input)}</code>
                            </div>
                            <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {tc.output}
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}

                  {/* Main Message Content */}
                  <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-200 space-y-3 leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Generated Artifacts Pills */}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                        Deliverables & Scaffolds Generated:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.artifacts.map(art => (
                          <div
                            key={art.id}
                            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                                {art.type === 'code' ? (
                                  <Code2 className="w-4 h-4" />
                                ) : art.type === 'table' ? (
                                  <Table className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition">
                                  {art.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 uppercase font-mono">
                                  {art.language || art.type}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => onOpenArtifact(art)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                            >
                              <span>Inspect</span>
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="max-w-3xl mx-auto w-full p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-cyan-400">{agent.name}</span> is analyzing voice
              input and formulating OS commands...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Presets Dropdown */}
      {showVoicePresets && (
        <div className="max-w-3xl mx-auto w-full px-4 mb-2">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Simulated Voice Transcriptions</span>
              <button
                onClick={() => setShowVoicePresets(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {voicePresets.map((vp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(vp.voice);
                    setShowVoicePresets(false);
                    onSendMessage(vp.voice, true);
                  }}
                  className={`p-2 rounded-lg border text-left transition font-mono text-[11px] flex items-center justify-between cursor-pointer ${
                    vp.type === 'risky'
                      ? 'bg-amber-950/30 hover:bg-amber-950/60 border-amber-800/40 text-amber-200'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Volume2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span className="truncate">{vp.label}</span>
                  </div>
                  {vp.type === 'risky' && (
                    <span className="text-[9px] bg-amber-950 text-amber-400 px-1 py-0.2 rounded border border-amber-800 shrink-0 ml-1">
                      Risk Gate
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="border-t border-slate-800 bg-slate-950 p-4 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40 transition">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'mission'
                  ? `Speak or type OS automation command (e.g. 'Scaffold a React app', 'Organize downloads', 'Delete temp cache')...`
                  : `Ask ${agent.name} anything...`
              }
              rows={2}
              className="w-full bg-transparent p-3 pr-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              {/* Mic / Voice Dictation Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400'
                }`}
                title="Voice Input / Dictation"
                aria-label="Voice Input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Terminal View Button */}
              {onOpenTerminal && (
                <button
                  type="button"
                  onClick={onOpenTerminal}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                  title="Open OS Terminal & Virtual Filesystem"
                  aria-label="Open OS Terminal"
                >
                  <Terminal className="w-4 h-4" />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                  input.trim() && !isLoading
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Execute Command"
                aria-label="Send mission prompt"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <span>Persona:</span>
              <strong className="text-cyan-400">{agent.name}</strong>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Safety:</span>
              <span className="text-amber-400 font-medium">Human-in-the-Loop Active</span>
            </span>
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd> or click 🎙️</span>
          </div>
        </form>
      </div>
    </div>
  );
};
