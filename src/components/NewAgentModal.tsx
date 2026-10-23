import React, { useState } from 'react';
import {
  X,
  Bot,
  Target,
  Code2,
  Compass,
  BarChart3,
  Sparkles,
  Sliders,
  Check,
} from 'lucide-react';
import { Agent } from '../types/agent';

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agent: Agent) => void;
}

export const NewAgentModal: React.FC<NewAgentModalProps> = ({
  isOpen,
  onClose,
  onCreateAgent,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('Bot');
  const [color, setColor] = useState('from-cyan-500 to-blue-600');
  const [thinkingLevel, setThinkingLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [temperature, setTemperature] = useState(0.7);
  const [systemInstruction, setSystemInstruction] = useState(
    'You are a specialized autonomous AI agent. Always formulate dynamic execution plans, reflect on assumptions, invoke tools, and produce tangible deliverables.'
  );
  const [tools, setTools] = useState({
    webSearch: true,
    codeSandbox: true,
    memoryStore: true,
    artifactBuilder: true,
    dataAnalyzer: true,
  });

  const presets = [
    {
      title: 'Security Auditor',
      name: 'Sentinel',
      role: 'Cybersecurity & Vulnerability Auditor',
      description: 'Audits smart contracts, analyzes threat models, checks OWASP compliance, and inspects attack vectors.',
      color: 'from-rose-500 to-red-600',
      avatar: 'Target',
      prompt: 'You are Sentinel, an elite cybersecurity auditor. Evaluate system vulnerabilities, prioritize CVE risks, and generate mitigation plans.',
    },
    {
      title: 'DevOps Architect',
      name: 'Helios',
      role: 'Infrastructure & Cloud Native Engineer',
      description: 'Configures Kubernetes clusters, CI/CD pipelines, Dockerfiles, and Terraform infrastructure specs.',
      color: 'from-orange-500 to-amber-600',
      avatar: 'Code2',
      prompt: 'You are Helios, a cloud-native DevOps engineer. Write resilient IaC definitions, Helm charts, and continuous delivery automation.',
    },
    {
      title: 'Growth Strategist',
      name: 'Echo',
      role: 'Product Growth & Marketing Strategist',
      description: 'Crafts viral user acquisition loops, messaging frameworks, SEO landing page structures, and pitch decks.',
      color: 'from-fuchsia-500 to-purple-600',
      avatar: 'Compass',
      prompt: 'You are Echo, a growth strategist. Analyze market positioning, customer retention loops, and build high-conversion campaign copy.',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setName(preset.name);
    setRole(preset.role);
    setDescription(preset.description);
    setColor(preset.color);
    setAvatar(preset.avatar);
    setSystemInstruction(preset.prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      description: description.trim() || `Specialized autonomous agent for ${role.trim()}`,
      avatar,
      color,
      systemInstruction: systemInstruction.trim(),
      model: 'gemini-3.8-flash',
      thinkingLevel,
      temperature,
      tools,
      isCustom: true,
    };

    onCreateAgent(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Create Custom AI Agent</h3>
              <p className="text-xs text-slate-400">Configure persona, reasoning depth, and tool access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/80">
          <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
            Quick Template Presets
          </span>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition text-xs group cursor-pointer"
              >
                <div className="font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Apex"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Quantum Computing Researcher"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short bio explaining what this agent specializes in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Model & Thinking Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Thinking Level</label>
              <select
                value={thinkingLevel}
                onChange={e => setThinkingLevel(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="HIGH">HIGH (Complex reasoning & math)</option>
                <option value="MEDIUM">MEDIUM (Balanced speed & depth)</option>
                <option value="LOW">LOW (Fast minimal thinking)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 mt-1"
              />
            </div>
          </div>

          {/* Tool Permissions */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Enabled Agent Tools
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(tools).map(([key, enabled]) => (
                <label
                  key={key}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition ${
                    enabled
                      ? 'bg-cyan-950/40 border-cyan-600/50 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={e => setTools(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded accent-cyan-500"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* System Instruction */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              System Instruction & Behavior
            </label>
            <textarea
              rows={3}
              value={systemInstruction}
              onChange={e => setSystemInstruction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-600/20 transition cursor-pointer"
            >
              Create Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
