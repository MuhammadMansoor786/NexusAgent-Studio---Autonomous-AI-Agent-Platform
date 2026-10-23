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
    terminalExecutor?: boolean;
    osManager?: boolean;
    voiceControl?: boolean;
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
  status: 'executing' | 'success' | 'error' | 'awaiting_confirmation';
  isRisky?: boolean;
  commandName?: string;
}

export interface AgentArtifact {
  id: string;
  title: string;
  type: 'markdown' | 'code' | 'json' | 'table' | 'spec' | 'terminal';
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
  isVoiceInput?: boolean;
  pendingConfirmation?: {
    commandName: string;
    command: string;
    warningText: string;
  };
}

export interface AgentMemory {
  id: string;
  key: string;
  content: string;
  category: 'fact' | 'preference' | 'insight' | 'system';
  timestamp: number;
}

export interface VirtualFileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: string;
  content?: string;
  updatedAt: number;
  children?: VirtualFileNode[];
}

export interface TerminalLog {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  timestamp: number;
  os: 'bash' | 'powershell';
  status: 'success' | 'error' | 'blocked' | 'pending';
}

export type AgentMode = 'mission' | 'chat';
