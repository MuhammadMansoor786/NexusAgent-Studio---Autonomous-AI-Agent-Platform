import React, { useState } from 'react';
import {
  X,
  Database,
  Plus,
  Trash2,
  Search,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AgentMemory } from '../types/agent';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: AgentMemory[];
  onAddMemory: (memory: Omit<AgentMemory, 'id' | 'timestamp'>) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<AgentMemory['category']>('fact');
  const [isAdding, setIsAdding] = useState(false);

  const filteredMemories = memories.filter(
    m =>
      m.key.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    onAddMemory({
      key: newKey.trim(),
      content: newContent.trim(),
      category: newCategory,
    });

    setNewKey('');
    setNewContent('');
    setIsAdding(false);
  };

  const getCategoryBadge = (category: AgentMemory['category']) => {
    switch (category) {
      case 'preference':
        return 'bg-purple-950 text-purple-300 border-purple-800/40';
      case 'insight':
        return 'bg-amber-950 text-amber-300 border-amber-800/40';
      case 'system':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800/40';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Agent Memory Bank</h3>
              <p className="text-xs text-slate-400">
                Episodic and persistent facts recalled during reasoning
              </p>
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

        {/* Search & Actions Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search memories by keyword or tag..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Key Identifier</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="e.g. preferred_framework"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="fact">Fact</option>
                  <option value="preference">Preference</option>
                  <option value="insight">Insight</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Content</label>
              <textarea
                required
                rows={2}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="The detailed memory description or constraint the agent should remember..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded-md text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Save Item
              </button>
            </div>
          </form>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredMemories.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No memory items match your search.
            </div>
          ) : (
            filteredMemories.map(mem => (
              <div
                key={mem.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200 truncate">{mem.key}</span>
                    <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border ${getCategoryBadge(mem.category)}`}>
                      {mem.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{mem.content}</p>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(mem.timestamp).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  title="Delete memory"
                  aria-label="Delete memory item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
