import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Wrench,
  FileCode,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Maximize2,
  Code2,
  FileText,
  Table,
} from 'lucide-react';
import { Agent, AgentMessage, AgentMode, AgentArtifact } from '../types/agent';

interface ChatAreaProps {
  agent: Agent;
  mode: AgentMode;
  messages: AgentMessage[];
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
  onOpenArtifact: (artifact: AgentArtifact) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  agent,
  mode,
  messages,
  isLoading,
  onSendMessage,
  onOpenArtifact,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts: Record<string, string[]> = {
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
    'aether-research': [
      'Synthesize 2026 architectural breakthroughs in autonomous LLM agents',
      'Compare tree-of-thought reasoning vs dynamic tool invocation frameworks',
      'Analyze the security attack surfaces of agentic web browsing and code execution',
    ],
    'veritas-analyst': [
      'Model the compute cost and token efficiency of reasoning models at 1M queries/day',
      'Analyze latency trade-offs between local tool calling vs remote API loops',
      'Generate a quantitative benchmark table comparing agent orchestration frameworks',
    ],
  };

  const currentPrompts = quickPrompts[agent.id] || [
    'Analyze system requirements and provide a structured plan',
    'Write a production-ready solution with clean code and artifacts',
    'Research domain best practices and deliver an executive brief',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-10 px-4 text-center">
            {/* Agent Hero */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${agent.color} mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/10 mb-4`}>
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Meet {agent.name}
            </h3>
            <p className="text-sm font-medium text-cyan-400 mt-1">{agent.role}</p>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              {agent.description}
            </p>

            <div className="mt-8 border-t border-slate-900 pt-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recommended Missions & Inquiries
              </span>
              <div className="mt-3 grid grid-cols-1 gap-2 text-left">
                {currentPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition flex items-center justify-between group cursor-pointer"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
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
                <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-md text-sm max-w-xl">
                  {msg.content}
                </div>
              ) : (
                /* Agent Message Card */
                <div className="w-full bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
                  {/* Agent Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white text-xs font-bold`}>
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
                          <span>Mission Execution Plan</span>
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
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold">
                              ✓
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
                            <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Tool Invoked: {tc.name}</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                              success
                            </span>
                          </summary>
                          <div className="p-3 border-t border-slate-800/60 space-y-2 bg-slate-950/80">
                            <div className="text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-300">Input:</span>{' '}
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

                  {/* Generated Artifacts Pills / Cards */}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                        Deliverable Artifacts Generated:
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
                              <span>View</span>
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
              <span className="font-semibold text-cyan-400">{agent.name}</span> is planning
              and executing mission checkpoints...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
                  ? `Assign autonomous mission to ${agent.name} (e.g., 'Analyze edge compute architecture and generate specification')...`
                  : `Ask ${agent.name} anything or converse in real time...`
              }
              rows={2}
              className="w-full bg-transparent p-3 pr-14 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                input.trim() && !isLoading
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              title="Launch Execution"
              aria-label="Send mission prompt"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              Mode: <strong className="text-cyan-400">{mode === 'mission' ? 'Autonomous Mission (Multi-Step)' : 'Interactive Chat'}</strong>
            </span>
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd> to execute</span>
          </div>
        </form>
      </div>
    </div>
  );
};
