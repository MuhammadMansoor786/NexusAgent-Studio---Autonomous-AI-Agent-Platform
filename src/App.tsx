import React, { useState, useEffect } from 'react';
import {
  DEFAULT_AGENTS,
  INITIAL_MEMORIES,
} from './agent/agent-engine';
import {
  Agent,
  AgentArtifact,
  AgentMemory,
  AgentMessage,
  AgentMode,
} from './types/agent';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AgentHeader } from './components/AgentHeader';
import { ChatArea } from './components/ChatArea';
import { ArtifactPanel } from './components/ArtifactPanel';
import { NewAgentModal } from './components/NewAgentModal';
import { MemoryModal } from './components/MemoryModal';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('nexus_agents');
    return saved ? JSON.parse(saved) : DEFAULT_AGENTS;
  });

  const [activeAgentId, setActiveAgentId] = useState<string>(
    () => agents[0]?.id || 'chronos-planner'
  );

  const [mode, setMode] = useState<AgentMode>('mission');

  const [messages, setMessages] = useState<AgentMessage[]>(() => {
    const saved = localStorage.getItem('nexus_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [artifacts, setArtifacts] = useState<AgentArtifact[]>(() => {
    const saved = localStorage.getItem('nexus_artifacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [memories, setMemories] = useState<AgentMemory[]>(() => {
    const saved = localStorage.getItem('nexus_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check backend status
  useEffect(() => {
    fetch('/api/agent/status')
      .then(res => res.json())
      .then(data => {
        if (data.hasApiKey) setHasApiKey(true);
      })
      .catch(() => {
        // Backend fallback ready
      });
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexus_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('nexus_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('nexus_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem('nexus_memories', JSON.stringify(memories));
  }, [memories]);

  const activeAgent =
    agents.find(a => a.id === activeAgentId) || agents[0] || DEFAULT_AGENTS[0];

  const handleSendMessage = async (prompt: string) => {
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: activeAgent,
          prompt,
          history,
          mode,
          memories,
        }),
      });

      if (!res.ok) {
        throw new Error(`Execution failed with status: ${res.status}`);
      }

      const data = await res.json();

      const newArtifacts: AgentArtifact[] = data.artifacts || [];
      if (newArtifacts.length > 0) {
        setArtifacts(prev => [...newArtifacts, ...prev]);
        setActiveArtifactId(newArtifacts[0].id);
        setIsArtifactsOpen(true);
      }

      const agentMessage: AgentMessage = {
        id: `msg-${Date.now()}-agent`,
        role: 'agent',
        content: data.content,
        agentId: activeAgent.id,
        thoughts: data.thoughts,
        plan: data.plan,
        toolCalls: data.toolCalls,
        artifacts: newArtifacts,
        timestamp: Date.now(),
        executionTimeMs: data.executionTimeMs,
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err: any) {
      console.error('Error invoking agent:', err);
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'agent',
        content: `Agent encountered an error during task execution: ${err?.message || 'Network error'}. Please try again.`,
        agentId: activeAgent.id,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTool = (toolKey: keyof Agent['tools']) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id === activeAgent.id) {
          return {
            ...a,
            tools: {
              ...a.tools,
              [toolKey]: !a.tools[toolKey],
            },
          };
        }
        return a;
      })
    );
  };

  const handleCreateAgent = (newAgent: Agent) => {
    setAgents(prev => [newAgent, ...prev]);
    setActiveAgentId(newAgent.id);
  };

  const handleOpenArtifact = (artifact: AgentArtifact) => {
    setActiveArtifactId(artifact.id);
    setIsArtifactsOpen(true);
  };

  const handleAddMemory = (newMemory: Omit<AgentMemory, 'id' | 'timestamp'>) => {
    const mem: AgentMemory = {
      ...newMemory,
      id: `mem-${Date.now()}`,
      timestamp: Date.now(),
    };
    setMemories(prev => [mem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleClearSession = () => {
    if (window.confirm('Clear all conversation messages?')) {
      setMessages([]);
    }
  };

  const handleExportSession = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      agent: activeAgent,
      messages,
      artifacts,
      memories,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_agent_session_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeAgent={activeAgent}
        onOpenNewAgent={() => setIsNewAgentOpen(true)}
        onOpenMemory={() => setIsMemoryOpen(true)}
        onClearSession={handleClearSession}
        onExportSession={handleExportSession}
        messageCount={messages.length}
        artifactCount={artifacts.length}
        hasApiKey={hasApiKey}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Agent Directory */}
        <Sidebar
          agents={agents}
          activeAgentId={activeAgent.id}
          onSelectAgent={id => {
            setActiveAgentId(id);
            setIsSidebarOpen(false);
          }}
          onOpenNewAgent={() => setIsNewAgentOpen(true)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
          />
        )}

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AgentHeader
            agent={activeAgent}
            mode={mode}
            onModeChange={setMode}
            onToggleTool={handleToggleTool}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onToggleArtifacts={() => setIsArtifactsOpen(!isArtifactsOpen)}
            artifactsCount={artifacts.length}
          />

          <ChatArea
            agent={activeAgent}
            mode={mode}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onOpenArtifact={handleOpenArtifact}
          />
        </main>

        {/* Right Drawer - Artifacts Studio */}
        <ArtifactPanel
          artifacts={artifacts}
          activeArtifactId={activeArtifactId}
          onSelectArtifact={setActiveArtifactId}
          isOpen={isArtifactsOpen}
          onClose={() => setIsArtifactsOpen(false)}
        />
      </div>

      {/* Modals */}
      <NewAgentModal
        isOpen={isNewAgentOpen}
        onClose={() => setIsNewAgentOpen(false)}
        onCreateAgent={handleCreateAgent}
      />

      <MemoryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
      />
    </div>
  );
}
