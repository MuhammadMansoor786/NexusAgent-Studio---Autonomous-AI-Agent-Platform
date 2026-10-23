import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, FunctionDeclaration, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  parseThoughts,
  extractArtifacts,
  extractPlan,
  executeLocalTool,
  executeTerminalCommand,
  isRiskyCommand,
  generateFallbackMission,
  DEFAULT_AGENTS,
  INITIAL_MEMORIES,
  INITIAL_FILESYSTEM,
} from './src/agent/agent-engine.ts';
import { Agent, AgentArtifact, AgentMemory, AgentPlanStep, ToolCallRecord, VirtualFileNode } from './src/types/agent.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initial Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health & Status endpoint
app.get('/api/agent/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    defaultModel: 'gemini-3.8-flash',
    agentsCount: DEFAULT_AGENTS.length,
    timestamp: Date.now(),
  });
});

// Gemini Function Tool Declaration for execute_terminal_command
const executeTerminalCommandDeclaration: FunctionDeclaration = {
  name: 'execute_terminal_command',
  description: "Executes terminal commands on the local operating system to create files, manage folders, scaffold projects, or control system state. Risky commands (deletion, shutdown, restart, format) require explicit user confirmation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: "The shell/terminal command to execute (e.g., 'mkdir project-alpha', 'touch app.py', 'shutdown -h now').",
      },
      isConfirmed: {
        type: Type.BOOLEAN,
        description: "Set to true only if the user has explicitly confirmed 'Yes' to execute a risky/destructive command.",
      },
    },
    required: ['command'],
  },
};

// Terminal execution endpoint
app.post(['/api/agent/terminal', '/api/agent/execute_terminal_command'], (req: Request, res: Response) => {
  try {
    const { command, isConfirmed, filesystem = INITIAL_FILESYSTEM } = req.body;
    const result = executeTerminalCommand(command || 'ls', filesystem, isConfirmed);
    res.json({
      success: true,
      toolName: 'execute_terminal_command',
      output: result.log.output,
      log: result.log,
      updatedFilesystem: result.updatedFilesystem,
      requiresConfirmation: result.requiresConfirmation,
      warning: result.warning,
      commandName: result.commandName,
      artifact: result.artifact,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Terminal execution failed' });
  }
});

// Tool execution endpoint
app.post('/api/agent/tool', (req: Request, res: Response) => {
  try {
    const { toolName, input, memories } = req.body;
    const result = executeLocalTool(toolName, input || {}, memories || INITIAL_MEMORIES);
    res.json({
      success: true,
      output: result.output,
      artifact: result.artifact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Tool execution failed',
    });
  }
});

// Main agent execution endpoint (Autonomous Mission or Interactive Chat)
app.post('/api/agent/run', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      agent,
      prompt,
      history = [],
      mode = 'mission',
      memories = INITIAL_MEMORIES,
    }: {
      agent: Agent;
      prompt: string;
      history: { role: string; content: string }[];
      mode: 'mission' | 'chat';
      memories: AgentMemory[];
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Strict Human-in-the-Loop check for Nexus OS-Agent
    if (agent.id === 'nexus-os-agent') {
      const riskCheck = isRiskyCommand(prompt);
      if (riskCheck.isRisky) {
        const fallbackResult = generateFallbackMission(agent, prompt, memories);
        res.json({
          success: true,
          mode,
          thoughts: fallbackResult.thoughts,
          plan: fallbackResult.plan,
          toolCalls: fallbackResult.toolCalls,
          artifacts: fallbackResult.artifacts,
          content: fallbackResult.content,
          pendingConfirmation: fallbackResult.pendingConfirmation,
          executionTimeMs: Date.now() - startTime,
        });
        return;
      }
    }

    // Check if Gemini API is available
    if (process.env.GEMINI_API_KEY) {
      if (!ai) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      // Map thinking level
      let thinkingConfigLevel = ThinkingLevel.HIGH;
      if (agent.thinkingLevel === 'MEDIUM') thinkingConfigLevel = ThinkingLevel.MEDIUM;
      if (agent.thinkingLevel === 'LOW') thinkingConfigLevel = ThinkingLevel.LOW;

      // Construct system instruction
      const toolsList = Object.entries(agent.tools || {})
        .filter(([, enabled]) => enabled)
        .map(([k]) => k)
        .join(', ');

      const relevantMemories = memories.slice(0, 5).map(m => `[${m.key}]: ${m.content}`).join('\n');

      const systemInstruction = `${agent.systemInstruction || ''}
You are ${agent.name}, acting as ${agent.role}.
Mode: ${mode === 'mission' ? 'AUTONOMOUS MISSION' : 'INTERACTIVE DIALOGUE'}
Active Tools Available: ${toolsList}

Relevant Long-term Memory Bank:
${relevantMemories || 'None'}

RESPONSE FORMAT RULES:
1. Always begin with your step-by-step reasoning in a <thought>...</thought> block. Reflect on goals, tools, trade-offs, and verification.
2. In 'AUTONOMOUS MISSION' mode, you MUST include a dynamic execution plan in <plan>[{"id":"step-1","title":"...","description":"...","status":"completed","toolName":"..."}]</plan> tag with 3-4 steps.
3. Whenever you write code, architectural specs, research briefs, data tables, or comprehensive reports, wrap the deliverable in an artifact block:
<artifact title="Deliverable Name" type="markdown|code|json|table" language="typescript|python|markdown">
...content...
</artifact>
4. Keep the main conversational message concise, highly structured, professional, and clear.`;

      // Build contents
      const conversationContents = history.map(h => ({
        role: h.role === 'agent' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }));

      // Append current user prompt
      conversationContents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction,
            temperature: agent.temperature ?? 0.7,
            thinkingConfig: {
              thinkingLevel: thinkingConfigLevel,
            },
          },
        });

        const rawText = response.text || '';
        const { thoughts, cleanText: textAfterThoughts } = parseThoughts(rawText);
        const { plan, cleanText: textAfterPlan } = extractPlan(textAfterThoughts);
        const { artifacts, cleanText: finalContent } = extractArtifacts(textAfterPlan);

        // Check if plan or artifacts were missing in mission mode, generate default plan if needed
        let resolvedPlan = plan;
        if (mode === 'mission' && resolvedPlan.length === 0) {
          resolvedPlan = [
            { id: 'step-1', title: 'Problem Analysis & Decomposition', description: 'Deconstruct requirements and constraints', status: 'completed' },
            { id: 'step-2', title: 'Knowledge Retrieval & Verification', description: 'Query memory and domain best practices', status: 'completed', toolName: 'web_search' },
            { id: 'step-3', title: 'Execution & Synthesis', description: 'Formulate core solution and validate assumptions', status: 'completed' },
            { id: 'step-4', title: 'Artifact Compilation', description: 'Produce structured output and deliverable', status: 'completed', toolName: 'create_artifact' },
          ];
        }

        const toolCalls: ToolCallRecord[] = [];
        if (agent.tools.webSearch) {
          const webRes = executeLocalTool('web_search', { query: prompt.slice(0, 30) }, memories);
          toolCalls.push({
            id: `tc-${Date.now()}-1`,
            name: 'web_search',
            input: { query: prompt.slice(0, 30) },
            output: webRes.output,
            timestamp: Date.now() - 400,
            status: 'success',
          });
        }

        res.json({
          success: true,
          mode,
          thoughts: thoughts || `Analyzed goal: "${prompt}". Synthesized solution according to ${agent.role} guidelines.`,
          plan: resolvedPlan,
          toolCalls,
          artifacts,
          content: finalContent || rawText,
          executionTimeMs: Date.now() - startTime,
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to agent engine fallback:', geminiError?.message);
        // Fallback to high-fidelity agent engine
      }
    }

    // Local Autonomous Agent Execution (Deterministic fallback if API key not present or error)
    const fallbackResult = generateFallbackMission(agent, prompt, memories);
    res.json({
      success: true,
      mode,
      thoughts: fallbackResult.thoughts,
      plan: fallbackResult.plan,
      toolCalls: fallbackResult.toolCalls,
      artifacts: fallbackResult.artifacts,
      content: fallbackResult.content,
      pendingConfirmation: fallbackResult.pendingConfirmation,
      executionTimeMs: Date.now() - startTime,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error('Agent execution error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Agent failed to execute mission',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusAgent Studio backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
