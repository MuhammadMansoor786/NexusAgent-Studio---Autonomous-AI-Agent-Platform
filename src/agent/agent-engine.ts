import {
  Agent,
  AgentArtifact,
  AgentMemory,
  AgentPlanStep,
  ToolCallRecord,
  VirtualFileNode,
  TerminalLog,
} from '../types/agent';

export const INITIAL_FILESYSTEM: VirtualFileNode[] = [
  {
    id: 'dir-root',
    name: 'workspace',
    path: '/home/user/workspace',
    type: 'directory',
    updatedAt: Date.now() - 86400000,
    children: [
      {
        id: 'dir-projects',
        name: 'projects',
        path: '/home/user/workspace/projects',
        type: 'directory',
        updatedAt: Date.now() - 43200000,
        children: [
          {
            id: 'file-portfolio',
            name: 'portfolio.html',
            path: '/home/user/workspace/projects/portfolio.html',
            type: 'file',
            size: '2.4 KB',
            content: '<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>My Dev Work</h1></body></html>',
            updatedAt: Date.now() - 36000000,
          },
        ],
      },
      {
        id: 'dir-downloads',
        name: 'downloads',
        path: '/home/user/workspace/downloads',
        type: 'directory',
        updatedAt: Date.now() - 21600000,
        children: [
          {
            id: 'file-temp',
            name: 'cache_temp.log',
            path: '/home/user/workspace/downloads/cache_temp.log',
            type: 'file',
            size: '14.2 KB',
            content: '[LOG] 2026-10-22 Cache warmup completed with 0 errors.',
            updatedAt: Date.now() - 7200000,
          },
        ],
      },
      {
        id: 'dir-documents',
        name: 'documents',
        path: '/home/user/workspace/documents',
        type: 'directory',
        updatedAt: Date.now() - 14400000,
        children: [
          {
            id: 'file-readme',
            name: 'system_notes.txt',
            path: '/home/user/workspace/documents/system_notes.txt',
            type: 'file',
            size: '1.1 KB',
            content: 'Local Computer Automation System v2.6. Managed by Nexus OS-Agent.',
            updatedAt: Date.now() - 10800000,
          },
        ],
      },
    ],
  },
];

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'nexus-os-agent',
    name: 'Nexus OS-Agent',
    role: 'Local Computer Automation & OS Assistant',
    description: 'Executes voice-dictated OS commands, file/folder management, coding project scaffolding, and system control with strict Human-in-the-Loop safety confirmation.',
    avatar: 'Terminal',
    color: 'from-cyan-500 to-blue-600',
    systemInstruction: `You are "Nexus OS-Agent", a highly advanced, local computer automation assistant. You receive commands (transcribed from user voice input) and execute them on the user's local operating system using your configured function tools.

Core Responsibilities:
1. OS Management: Create files, manage folders, organize directories, and control system states (e.g., shutdown, restart) strictly based on user commands.
2. Coding & Automation: Scaffold web projects, write code, and structure assignments directly into the user's local directory.

Strict Safety & Data Privacy Protocols (CRITICAL):
- Human-in-the-Loop: You MUST ask for explicit user confirmation before executing any "destructive" or "system-altering" commands. This includes deleting files/folders, formatting drives, modifying system settings, or shutting down/restarting the PC.
- Read/Write Restrictions: Do not read, scan, or analyze any personal files, folders, or directories unless explicitly instructed by the user to do so for a specific task.
- Confirmation Format: If a requested task involves risk (e.g., "delete this folder" or "shutdown"), pause and reply with: "WARNING: I am about to execute a risky command [Command Name]. Please say 'Yes' to approve or 'No' to cancel."

Execution Workflow:
1. Analyze the transcribed voice text to understand the user's goal.
2. Formulate the correct terminal/OS command (e.g., CMD/PowerShell for Windows, Bash for Mac/Linux).
3. If the command is safe (e.g., creating a folder, scaffolding a React app), execute it immediately via the execute_terminal_command tool.
4. Once the tool returns a success response, confirm task completion to the user concisely.`,
    model: 'gemini-3.8-flash',
    thinkingLevel: 'HIGH',
    temperature: 0.3,
    tools: {
      webSearch: true,
      codeSandbox: true,
      memoryStore: true,
      artifactBuilder: true,
      dataAnalyzer: true,
      terminalExecutor: true,
      osManager: true,
      voiceControl: true,
    },
  },
  {
    id: 'chronos-planner',
    name: 'Chronos',
    role: 'Autonomous Task Planner & Orchestrator',
    description: 'Decomposes complex requests into executable multi-step plans, runs tools sequentially, and produces complete solutions.',
    avatar: 'Target',
    color: 'from-amber-500 to-orange-600',
    systemInstruction: `You are Chronos, a hyper-capable autonomous planning and orchestration AI agent. 
When given a user goal:
1. Always formulate a dynamic 3-4 step execution plan inside <plan> tags formatted as JSON.
2. Formulate your internal chain-of-thought inside <thought> tags.
3. Identify when external tools are needed (web_search, calculator_code, memory_store, create_artifact, data_analyzer).
4. Provide structured, thorough, production-grade output and generate concrete artifacts when appropriate.`,
    model: 'gemini-3.8-flash',
    thinkingLevel: 'HIGH',
    temperature: 0.7,
    tools: {
      webSearch: true,
      codeSandbox: true,
      memoryStore: true,
      artifactBuilder: true,
      dataAnalyzer: true,
    },
  },
  {
    id: 'nova-coder',
    name: 'Nova',
    role: 'Full-Stack Software Architect & Engineer',
    description: 'Designs scalable system architectures, debugs complex algorithms, and delivers production-ready code artifacts.',
    avatar: 'Code2',
    color: 'from-indigo-500 to-cyan-500',
    systemInstruction: `You are Nova, an elite senior software architect and full-stack engineer agent.
You prioritize clean code, type safety, modular architecture, and edge-case handling.
When answering technical missions, write concise reasoning inside <thought> tags, simulate architecture evaluation, and create clean code files wrapped in <artifact title="..." type="code" language="...">...</artifact>.`,
    model: 'gemini-3.8-flash',
    thinkingLevel: 'HIGH',
    temperature: 0.4,
    tools: {
      webSearch: true,
      codeSandbox: true,
      memoryStore: true,
      artifactBuilder: true,
      dataAnalyzer: true,
    },
  },
  {
    id: 'aether-research',
    name: 'Aether',
    role: 'Intelligence & Research Analyst',
    description: 'Synthesizes domain literature, investigates emerging trends, queries factual sources, and drafts executive briefings.',
    avatar: 'Compass',
    color: 'from-emerald-500 to-teal-600',
    systemInstruction: `You are Aether, an autonomous intelligence and research agent.
You verify claims with rigorous citations, summarize trade-offs objectively, and generate structured executive research briefs.
Always use <thought> to show your hypothesis testing and <artifact title="..." type="markdown"> to output comprehensive briefings.`,
    model: 'gemini-3.8-flash',
    thinkingLevel: 'MEDIUM',
    temperature: 0.6,
    tools: {
      webSearch: true,
      codeSandbox: false,
      memoryStore: true,
      artifactBuilder: true,
      dataAnalyzer: true,
    },
  },
  {
    id: 'veritas-analyst',
    name: 'Veritas',
    role: 'Data Analyst & Quantitative Modeler',
    description: 'Performs statistical computations, analyzes datasets, models projections, and creates structured data tables.',
    avatar: 'BarChart3',
    color: 'from-purple-500 to-pink-600',
    systemInstruction: `You are Veritas, a quantitative analytics and data modeling agent.
You compute exact metrics, format mathematical formulas cleanly, and generate structured data artifacts with key metrics, variance, and forecasts.`,
    model: 'gemini-3.8-flash',
    thinkingLevel: 'HIGH',
    temperature: 0.3,
    tools: {
      webSearch: true,
      codeSandbox: true,
      memoryStore: true,
      artifactBuilder: true,
      dataAnalyzer: true,
    },
  },
];

export const INITIAL_MEMORIES: AgentMemory[] = [
  {
    id: 'mem-0',
    key: 'safety_policy',
    content: 'Human-in-the-Loop required for deletion, formatting, system modifications, or power actions.',
    category: 'system',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'mem-1',
    key: 'runtime_preference',
    content: 'User prefers TypeScript, modular architecture, and Tailwind CSS for web apps.',
    category: 'preference',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'mem-2',
    key: 'architecture_pattern',
    content: 'Agentic workflows must maintain clear reasoning trace, step validation, and artifact separation.',
    category: 'fact',
    timestamp: Date.now() - 1800000,
  },
  {
    id: 'mem-3',
    key: 'local_environment',
    content: 'Target OS: Linux/macOS Bash and Windows PowerShell compatible. Root workspace: ~/workspace.',
    category: 'system',
    timestamp: Date.now() - 600000,
  },
];

/**
 * Checks if a requested terminal or OS command is destructive or system-altering.
 * Requires Human-in-the-loop explicit confirmation.
 */
export function isRiskyCommand(input: string): {
  isRisky: boolean;
  commandName: string;
  warningText: string;
} {
  const normalized = input.toLowerCase().trim();

  // Deletion checks
  if (
    normalized.includes('rm ') ||
    normalized.includes('rmdir') ||
    normalized.includes('del ') ||
    normalized.includes('remove') ||
    normalized.includes('delete') ||
    normalized.includes('unlink')
  ) {
    const cmdName = 'File/Directory Deletion (rm/del)';
    return {
      isRisky: true,
      commandName: cmdName,
      warningText: `WARNING: I am about to execute a risky command [${cmdName}]. Please say 'Yes' to approve or 'No' to cancel.`,
    };
  }

  // Shutdown / Restart checks
  if (
    normalized.includes('shutdown') ||
    normalized.includes('poweroff') ||
    normalized.includes('reboot') ||
    normalized.includes('restart computer') ||
    normalized.includes('restart pc') ||
    normalized.includes('halt')
  ) {
    const cmdName = 'System State Control (Shutdown/Restart)';
    return {
      isRisky: true,
      commandName: cmdName,
      warningText: `WARNING: I am about to execute a risky command [${cmdName}]. Please say 'Yes' to approve or 'No' to cancel.`,
    };
  }

  // Disk Format / Overwrite checks
  if (
    normalized.includes('format') ||
    normalized.includes('mkfs') ||
    normalized.includes('dd if=') ||
    normalized.includes('fdisk')
  ) {
    const cmdName = 'Drive Formatting / Block Overwrite';
    return {
      isRisky: true,
      commandName: cmdName,
      warningText: `WARNING: I am about to execute a risky command [${cmdName}]. Please say 'Yes' to approve or 'No' to cancel.`,
    };
  }

  // Dangerous permissions or kill commands
  if (
    normalized.includes('chmod -r 777') ||
    normalized.includes('chown -r') ||
    normalized.includes('kill -9') ||
    normalized.includes('taskkill /f')
  ) {
    const cmdName = 'Elevated System Override (chmod/kill)';
    return {
      isRisky: true,
      commandName: cmdName,
      warningText: `WARNING: I am about to execute a risky command [${cmdName}]. Please say 'Yes' to approve or 'No' to cancel.`,
    };
  }

  return {
    isRisky: false,
    commandName: '',
    warningText: '',
  };
}

/**
 * Extracts <thought>...</thought> blocks from the model's output
 */
export function parseThoughts(text: string): { thoughts: string; cleanText: string } {
  const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/gi;
  const match = thoughtRegex.exec(text);

  if (match) {
    const thoughts = match[1].trim();
    const cleanText = text.replace(thoughtRegex, '').trim();
    return { thoughts, cleanText };
  }

  return { thoughts: '', cleanText: text };
}

/**
 * Extracts <artifact title="..." type="..." language="...">...</artifact> blocks
 */
export function extractArtifacts(text: string): { artifacts: AgentArtifact[]; cleanText: string } {
  const artifacts: AgentArtifact[] = [];
  const artifactRegex = /<artifact\s+title="([^"]+)"(?:\s+type="([^"]+)")?(?:\s+language="([^"]+)")?>([\s\S]*?)<\/artifact>/gi;

  let match: RegExpExecArray | null;
  while ((match = artifactRegex.exec(text)) !== null) {
    const title = match[1];
    const type = (match[2] as any) || 'markdown';
    const language = match[3] || (type === 'code' ? 'typescript' : undefined);
    const content = match[4].trim();

    artifacts.push({
      id: `art-${Math.random().toString(36).substring(2, 9)}`,
      title,
      type,
      language,
      content,
      createdAt: Date.now(),
    });
  }

  const cleanText = text.replace(artifactRegex, '').trim();
  return { artifacts, cleanText };
}

/**
 * Extracts plan steps from <plan>[...]</plan> tag
 */
export function extractPlan(text: string): { plan: AgentPlanStep[]; cleanText: string } {
  const planRegex = /<plan>([\s\S]*?)<\/plan>/gi;
  const match = planRegex.exec(text);

  if (match) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) {
        const plan: AgentPlanStep[] = parsed.map((item, index) => ({
          id: item.id || `step-${index + 1}`,
          title: item.title || `Step ${index + 1}`,
          description: item.description || '',
          status: item.status || 'completed',
          toolName: item.toolName,
          resultSummary: item.resultSummary,
        }));
        const cleanText = text.replace(planRegex, '').trim();
        return { plan, cleanText };
      }
    } catch {
      // JSON parse failed, ignore
    }
  }

  return { plan: [], cleanText: text };
}

/**
 * Search relevant memories given a query
 */
export function searchMemories(query: string, memories: AgentMemory[]): AgentMemory[] {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  return memories.filter(mem => {
    const text = `${mem.key} ${mem.content} ${mem.category}`.toLowerCase();
    return words.some(w => text.includes(w));
  });
}

/**
 * Simulates OS Terminal Command Execution & Local Filesystem Management
 */
export function executeTerminalCommand(
  command: string,
  filesystem: VirtualFileNode[],
  isConfirmed: boolean = false
): {
  log: TerminalLog;
  updatedFilesystem: VirtualFileNode[];
  requiresConfirmation: boolean;
  warning?: string;
  commandName?: string;
  artifact?: AgentArtifact;
} {
  const trimmed = command.trim();
  const riskCheck = isRiskyCommand(trimmed);

  // If command is destructive and not explicitly approved by user:
  if (riskCheck.isRisky && !isConfirmed) {
    return {
      log: {
        id: `term-${Date.now()}`,
        command: trimmed,
        output: riskCheck.warningText,
        exitCode: 1,
        timestamp: Date.now(),
        os: 'bash',
        status: 'blocked',
      },
      updatedFilesystem: filesystem,
      requiresConfirmation: true,
      warning: riskCheck.warningText,
      commandName: riskCheck.commandName,
    };
  }

  // Safe or Approved execution:
  const newFs = JSON.parse(JSON.stringify(filesystem)) as VirtualFileNode[];
  const root = newFs[0] || {
    id: 'dir-root',
    name: 'workspace',
    path: '/home/user/workspace',
    type: 'directory',
    updatedAt: Date.now(),
    children: [],
  };

  if (!root.children) root.children = [];

  let stdout = '';
  let exitCode = 0;
  let artifact: AgentArtifact | undefined;

  // 1. Scaffolding commands (e.g. npx create-react-app, npm create vite)
  if (
    trimmed.includes('create-react-app') ||
    trimmed.includes('create vite') ||
    trimmed.includes('scaffold')
  ) {
    const appNameMatch = trimmed.match(/(?:create-react-app|create vite(?:@latest)?|scaffold)\s+([\w-]+)/i);
    const appName = appNameMatch ? appNameMatch[1] : 'my-react-app';
    const appPath = `/home/user/workspace/${appName}`;

    const newProjectNode: VirtualFileNode = {
      id: `dir-${appName}-${Date.now()}`,
      name: appName,
      path: appPath,
      type: 'directory',
      updatedAt: Date.now(),
      children: [
        {
          id: `file-pkg-${Date.now()}`,
          name: 'package.json',
          path: `${appPath}/package.json`,
          type: 'file',
          size: '1.2 KB',
          content: JSON.stringify(
            {
              name: appName,
              version: '0.1.0',
              private: true,
              scripts: { dev: 'vite', build: 'vite build' },
              dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
            },
            null,
            2
          ),
          updatedAt: Date.now(),
        },
        {
          id: `file-app-${Date.now()}`,
          name: 'App.tsx',
          path: `${appPath}/src/App.tsx`,
          type: 'file',
          size: '850 B',
          content: `export default function App() {\n  return (\n    <main className="p-8 text-center">\n      <h1 className="text-3xl font-bold">Welcome to ${appName}</h1>\n      <p>Scaffolded autonomously by Nexus OS-Agent</p>\n    </main>\n  );\n}`,
          updatedAt: Date.now(),
        },
      ],
    };

    root.children.push(newProjectNode);
    stdout = `✔ Creating a new React application in ${appPath}...\n✔ Installed dependencies (react, react-dom, vite, tailwindcss)\n✔ Generated package.json and src/App.tsx\n\nSuccess! Created ${appName} at ${appPath}\nInside that directory, you can run:\n  npm run dev`;
    
    artifact = {
      id: `art-scaffold-${Date.now()}`,
      title: `${appName}/src/App.tsx`,
      type: 'code',
      language: 'typescript',
      content: newProjectNode.children![1].content!,
      createdAt: Date.now(),
    };
  }
  // 2. mkdir (directory creation)
  else if (trimmed.startsWith('mkdir ')) {
    const dirName = trimmed.replace(/^mkdir\s+(-p\s+)?/i, '').trim();
    const newDir: VirtualFileNode = {
      id: `dir-${Date.now()}`,
      name: dirName,
      path: `/home/user/workspace/${dirName}`,
      type: 'directory',
      updatedAt: Date.now(),
      children: [],
    };
    root.children.push(newDir);
    stdout = `Directory '${dirName}' created successfully in /home/user/workspace.`;
  }
  // 3. touch / echo > file (file creation / coding)
  else if (trimmed.startsWith('touch ') || trimmed.includes('>') || trimmed.startsWith('cat <<')) {
    let fileName = 'new_file.txt';
    let content = '// Created by Nexus OS-Agent\n';

    if (trimmed.startsWith('touch ')) {
      fileName = trimmed.replace('touch ', '').trim();
    } else if (trimmed.includes('>')) {
      const parts = trimmed.split('>');
      fileName = parts[parts.length - 1].trim();
      content = parts[0].replace(/^echo\s+["']?|["']?\s*$/g, '').trim();
    }

    const newFile: VirtualFileNode = {
      id: `file-${Date.now()}`,
      name: fileName,
      path: `/home/user/workspace/${fileName}`,
      type: 'file',
      size: `${content.length} B`,
      content,
      updatedAt: Date.now(),
    };
    root.children.push(newFile);
    stdout = `File '${fileName}' written to /home/user/workspace (${content.length} bytes).`;

    artifact = {
      id: `art-file-${Date.now()}`,
      title: fileName,
      type: fileName.endsWith('.ts') || fileName.endsWith('.py') || fileName.endsWith('.js') ? 'code' : 'markdown',
      language: fileName.endsWith('.py') ? 'python' : fileName.endsWith('.ts') ? 'typescript' : 'bash',
      content,
      createdAt: Date.now(),
    };
  }
  // 4. ls / dir
  else if (trimmed === 'ls' || trimmed.startsWith('ls ') || trimmed === 'dir') {
    const items = root.children.map(c => `${c.type === 'directory' ? 'd' : '-'}rw-r--r-- user staff ${c.size || '4.0 KB'} ${c.name}`);
    stdout = `total ${root.children.length}\n${items.join('\n')}`;
  }
  // 5. Approved risky command: rm / delete
  else if (riskCheck.isRisky && isConfirmed) {
    if (trimmed.includes('shutdown') || trimmed.includes('reboot')) {
      stdout = `[SYSTEM] Approval verified. Initiating clean system ${trimmed.includes('reboot') ? 'reboot' : 'shutdown'} sequence...\n[OK] Stopping all background agent daemons.\n[OK] Unmounting filesystems.\n[OK] System halted successfully.`;
    } else {
      // simulate removal of matching folder or temp
      const targetName = trimmed.split(/\s+/).pop() || '';
      root.children = root.children.filter(c => !c.name.includes(targetName) && !targetName.includes(c.name));
      stdout = `✔ User confirmation verified.\n✔ Target resource removed: ${targetName || 'temporary items'}\nOperation exited with code 0.`;
    }
  }
  // 6. Generic command
  else {
    stdout = `[Nexus OS Terminal] Executed command: \`${trimmed}\`\nExecution completed with exit code 0.`;
  }

  const log: TerminalLog = {
    id: `term-${Date.now()}`,
    command: trimmed,
    output: stdout,
    exitCode,
    timestamp: Date.now(),
    os: 'bash',
    status: exitCode === 0 ? 'success' : 'error',
  };

  return {
    log,
    updatedFilesystem: newFs,
    requiresConfirmation: false,
    artifact,
  };
}

/**
 * Safely executes or simulates local agent tools
 */
export function executeLocalTool(
  toolName: string,
  input: Record<string, any>,
  memories: AgentMemory[] = []
): { output: string; artifact?: AgentArtifact } {
  switch (toolName) {
    case 'execute_terminal_command': {
      const cmd = input.command || input.cmd || 'ls -la';
      const result = executeTerminalCommand(cmd, INITIAL_FILESYSTEM, input.isConfirmed);
      return {
        output: result.log.output,
        artifact: result.artifact,
      };
    }

    case 'calculator_code': {
      const expr = input.expression || input.code || '0';
      try {
        const sanitized = String(expr).replace(/[^0-9+\-*/().,%^Math\s]/g, '');
        const result = Function(`"use strict"; return (${sanitized});`)();
        return {
          output: `Evaluated expression: \`${expr}\`\nResult: **${result}**`,
        };
      } catch (err: any) {
        return {
          output: `Evaluation error for \`${expr}\`: ${err?.message || 'Invalid expression'}`,
        };
      }
    }

    case 'web_search': {
      const query = input.query || 'agent systems';
      const mockResults = [
        {
          title: `State of Autonomous AI Systems & Tool Calling (2026)`,
          snippet: `Recent benchmark studies show dynamic decomposition and multi-agent coordination improve task completion rates by 68% over single-turn prompts.`,
          source: 'arxiv.org/abs/2602.04918',
        },
        {
          title: `Local OS Automation & Safe Human-in-the-Loop Policies`,
          snippet: `Strict confirmation gates on destructive commands prevent accidental data loss and protect system integrity during autonomous runs.`,
          source: 'os-agent-safety.org/spec',
        },
      ];

      const formatted = mockResults
        .map((r, i) => `**[${i + 1}] ${r.title}**\n*Source: ${r.source}*\n${r.snippet}`)
        .join('\n\n');

      return {
        output: `Web Search Results for "${query}":\n\n${formatted}`,
      };
    }

    case 'memory_store': {
      const action = input.action || 'query';
      if (action === 'query') {
        const query = input.query || '';
        const found = searchMemories(query, memories);
        if (found.length === 0) {
          return { output: `No specific memories found matching "${query}".` };
        }
        const text = found
          .map(m => `• [${m.category.toUpperCase()}] **${m.key}**: ${m.content}`)
          .join('\n');
        return { output: `Retrieved Memory Items:\n${text}` };
      }
      return { output: `Memory updated with key: ${input.key}` };
    }

    case 'data_analyzer': {
      const dataset = input.data || [10, 25, 45, 80, 120];
      const numbers = Array.isArray(dataset)
        ? dataset.map(Number).filter(n => !isNaN(n))
        : [10, 25, 45, 80, 120];
      const sum = numbers.reduce((a, b) => a + b, 0);
      const avg = sum / numbers.length;
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);

      const tableMarkdown = `
| Metric | Value |
| :--- | :--- |
| Sample Size (N) | ${numbers.length} |
| Total Sum | ${sum.toLocaleString()} |
| Arithmetic Mean | ${avg.toFixed(2)} |
| Minimum | ${min} |
| Maximum | ${max} |
      `.trim();

      return {
        output: `Statistical Data Analysis Completed:\n\n${tableMarkdown}`,
        artifact: {
          id: `art-data-${Date.now()}`,
          title: input.title || 'Quantitative Data Summary',
          type: 'table',
          content: tableMarkdown,
          createdAt: Date.now(),
        },
      };
    }

    default:
      return {
        output: `Tool "${toolName}" executed with input: ${JSON.stringify(input)}`,
      };
  }
}

/**
 * Generates autonomous responses for Nexus OS-Agent and other agents
 */
export function generateFallbackMission(
  agent: Agent,
  prompt: string,
  memories: AgentMemory[]
): {
  thoughts: string;
  plan: AgentPlanStep[];
  toolCalls: ToolCallRecord[];
  artifacts: AgentArtifact[];
  content: string;
  pendingConfirmation?: {
    commandName: string;
    command: string;
    warningText: string;
  };
} {
  // If Nexus OS-Agent
  if (agent.id === 'nexus-os-agent') {
    const riskCheck = isRiskyCommand(prompt);

    // If risky command detected without confirmation:
    if (riskCheck.isRisky) {
      const thoughts = `I am Nexus OS-Agent.
1. Transcribed voice command received: "${prompt}".
2. Goal involves a high-risk operation: "${riskCheck.commandName}".
3. Protocol check: STRICT Human-in-the-Loop policy applies.
4. I must halt execution immediately and request explicit user confirmation.
5. Standard warning format triggered: "${riskCheck.warningText}".`;

      const plan: AgentPlanStep[] = [
        {
          id: 'step-1',
          title: 'Voice Command Analysis',
          description: `Transcribed user voice: "${prompt}"`,
          status: 'completed',
          resultSummary: 'Parsed command and detected system-altering operation.',
        },
        {
          id: 'step-2',
          title: 'Safety Protocol & Risk Evaluation',
          description: `Identified risk classification: ${riskCheck.commandName}`,
          status: 'in_progress',
          resultSummary: 'Paused execution. Awaiting user explicit confirmation.',
        },
      ];

      const toolCalls: ToolCallRecord[] = [
        {
          id: `tc-risk-${Date.now()}`,
          name: 'execute_terminal_command',
          input: { command: prompt, isConfirmed: false },
          output: `[BLOCKED BY SAFETY PROTOCOL]\n${riskCheck.warningText}`,
          timestamp: Date.now(),
          status: 'awaiting_confirmation',
          isRisky: true,
          commandName: riskCheck.commandName,
        },
      ];

      return {
        thoughts,
        plan,
        toolCalls,
        artifacts: [],
        content: riskCheck.warningText,
        pendingConfirmation: {
          commandName: riskCheck.commandName,
          command: prompt,
          warningText: riskCheck.warningText,
        },
      };
    }

    // Safe OS Command (Creating files, scaffolding React apps, organizing folders)
    const isScaffold = /scaffold|create-react-app|react|vite|web app|project/i.test(prompt);
    const isFolder = /folder|mkdir|directory/i.test(prompt);
    const isPython = /python|script|monitor|code/i.test(prompt);

    let terminalCmd = 'mkdir -p project-alpha';
    if (isScaffold) {
      terminalCmd = 'npx create-react-app dashboard-app';
    } else if (isPython) {
      terminalCmd = `echo "import time\nimport psutil\nprint('Monitoring CPU...')\n" > monitor.py`;
    } else if (isFolder) {
      terminalCmd = 'mkdir -p project-alpha && touch project-alpha/README.md';
    }

    const execResult = executeTerminalCommand(terminalCmd, INITIAL_FILESYSTEM);

    const plan: AgentPlanStep[] = [
      {
        id: 'step-1',
        title: 'Voice Transcription & Intent Analysis',
        description: `Analyzed voice input: "${prompt}"`,
        status: 'completed',
        resultSummary: 'Command analyzed and classified as safe OS operation.',
      },
      {
        id: 'step-2',
        title: 'Formulate OS Terminal Command',
        description: `Target command: \`${terminalCmd}\``,
        status: 'completed',
        resultSummary: 'Constructed POSIX compliant command.',
      },
      {
        id: 'step-3',
        title: 'Execute Terminal Command',
        description: 'Run command in user local directory via execute_terminal_command tool',
        status: 'completed',
        toolName: 'execute_terminal_command',
        resultSummary: 'Success response received from terminal subprocess.',
      },
    ];

    const toolCalls: ToolCallRecord[] = [
      {
        id: `tc-os-${Date.now()}`,
        name: 'execute_terminal_command',
        input: { command: terminalCmd },
        output: execResult.log.output,
        timestamp: Date.now(),
        status: 'success',
      },
    ];

    const artifacts: AgentArtifact[] = [];
    if (execResult.artifact) {
      artifacts.push(execResult.artifact);
    }

    const thoughts = `I am Nexus OS-Agent.
1. Received user request: "${prompt}".
2. Assessed safety: Command does not modify system settings, format drives, or delete files. Safe to execute.
3. Formulated local terminal command: \`${terminalCmd}\`.
4. Executed via execute_terminal_command tool.
5. Task completed successfully. Preparing concise confirmation.`;

    const content = `Command executed successfully.

\`\`\`bash
$ ${terminalCmd}
${execResult.log.output}
\`\`\`

The files and directories have been created in your local workspace.`;

    return {
      thoughts,
      plan,
      toolCalls,
      artifacts,
      content,
    };
  }

  // Fallback for Chronos, Nova, Aether, Veritas
  const isCodeRelated = /code|react|typescript|python|api|app|function|server|database|backend|bug/i.test(prompt);
  const isDataRelated = /data|metric|stats|calculate|analyze|number|percent|growth|roi/i.test(prompt);

  const plan: AgentPlanStep[] = [
    {
      id: 'step-1',
      title: 'Goal Decomposition & Scope Validation',
      description: `Analyze mission constraints for: "${prompt.slice(0, 40)}..."`,
      status: 'completed',
      resultSummary: 'Requirements parsed, architecture strategy established.',
    },
    {
      id: 'step-2',
      title: 'Context & Knowledge Base Retrieval',
      description: 'Query working memory and external sources for best practices and domain data.',
      status: 'completed',
      toolName: agent.tools.webSearch ? 'web_search' : 'memory_store',
      resultSummary: 'Context gathered and cross-referenced with domain guidelines.',
    },
    {
      id: 'step-3',
      title: 'Synthesis & Core Solution Execution',
      description: isCodeRelated 
        ? 'Generate modular implementation with error boundaries and typed interfaces'
        : 'Synthesize evidence, compute quantitative projections, and structure insights',
      status: 'completed',
      toolName: isDataRelated ? 'data_analyzer' : 'calculator_code',
      resultSummary: 'Solution formulated and validated against edge cases.',
    },
    {
      id: 'step-4',
      title: 'Artifact Generation & Executive Delivery',
      description: 'Package results into production-grade deliverable artifact with operational summary.',
      status: 'completed',
      toolName: 'create_artifact',
      resultSummary: 'Deliverable compiled and verified for immediate consumption.',
    },
  ];

  const toolCalls: ToolCallRecord[] = [];
  const artifacts: AgentArtifact[] = [];

  if (agent.tools.webSearch) {
    const webResult = executeLocalTool('web_search', { query: prompt.slice(0, 30) }, memories);
    toolCalls.push({
      id: `tc-1`,
      name: 'web_search',
      input: { query: prompt.slice(0, 30) },
      output: webResult.output,
      timestamp: Date.now() - 2500,
      status: 'success',
    });
  }

  const finalArtifact: AgentArtifact = {
    id: `art-doc-${Date.now()}`,
    title: 'Executive_Deliverable.md',
    type: 'markdown',
    content: `# Deliverable: ${prompt}\nCompiled by ${agent.name} (${agent.role}).`,
    createdAt: Date.now(),
    agentId: agent.id,
  };
  artifacts.push(finalArtifact);

  return {
    thoughts: `Analyzed goal: "${prompt}". Formulated complete structured execution plan.`,
    plan,
    toolCalls,
    artifacts,
    content: `Mission accomplished for: **"${prompt}"**.\n\nAll deliverables have been compiled into your workspace artifacts.`,
  };
}
