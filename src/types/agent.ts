export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  systemInstruction: string;
  model: string;
  thinkingLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  temperature: number;
  tools: {
    webSearch: boolean;
    codeSandbox: boolean;
    memoryStore: boolean;
    artifactBuilder: boolean;
    dataAnalyzer: boolean;
  };
  isCustom?: boolean;
}

export interface AgentPlanStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  toolName?: string;
  resultSummary?: string;
}

export interface ToolCallRecord {
  id: string;
  name: string;
  input: Record<string, any>;
  output: string;
  timestamp: number;
  status: 'executing' | 'success' | 'error';
}

export interface AgentArtifact {
  id: string;
  title: string;
  type: 'markdown' | 'code' | 'json' | 'table' | 'spec';
  language?: string;
  content: string;
  createdAt: number;
  agentId?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  thoughts?: string;
  plan?: AgentPlanStep[];
  toolCalls?: ToolCallRecord[];
  artifacts?: AgentArtifact[];
  timestamp: number;
  executionTimeMs?: number;
  isStreaming?: boolean;
}

export interface AgentMemory {
  id: string;
  key: string;
  content: string;
  category: 'fact' | 'preference' | 'insight' | 'system';
  timestamp: number;
}

export type AgentMode = 'mission' | 'chat';
