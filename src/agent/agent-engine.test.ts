import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseThoughts,
  extractArtifacts,
  extractPlan,
  searchMemories,
  executeLocalTool,
  DEFAULT_AGENTS,
  INITIAL_MEMORIES,
} from './agent-engine';

test('parseThoughts correctly extracts thought blocks and returns clean text', () => {
  const raw = `<thought>
Analyzing the architectural trade-offs between microservices and monoliths.
Selected high-concurrency event bus pattern.
</thought>
Here is the recommended architecture design for the platform.`;

  const { thoughts, cleanText } = parseThoughts(raw);

  assert.ok(thoughts.includes('Analyzing the architectural trade-offs'));
  assert.ok(thoughts.includes('Selected high-concurrency event bus pattern'));
  assert.equal(cleanText, 'Here is the recommended architecture design for the platform.');
});

test('parseThoughts returns empty thought and identical clean text if no thought tags', () => {
  const raw = 'Direct answer with no chain of thought.';
  const { thoughts, cleanText } = parseThoughts(raw);
  assert.equal(thoughts, '');
  assert.equal(cleanText, raw);
});

test('extractArtifacts extracts markdown and code artifacts properly', () => {
  const raw = `I have generated two files for you:
<artifact title="Server.ts" type="code" language="typescript">
console.log("Hello Server");
</artifact>
And a summary document:
<artifact title="Notes.md" type="markdown">
# System Notes
All green.
</artifact>
Enjoy!`;

  const { artifacts, cleanText } = extractArtifacts(raw);

  assert.equal(artifacts.length, 2);
  assert.equal(artifacts[0].title, 'Server.ts');
  assert.equal(artifacts[0].type, 'code');
  assert.equal(artifacts[0].language, 'typescript');
  assert.equal(artifacts[0].content, 'console.log("Hello Server");');

  assert.equal(artifacts[1].title, 'Notes.md');
  assert.equal(artifacts[1].type, 'markdown');
  assert.equal(artifacts[1].content, '# System Notes\nAll green.');

  assert.ok(!cleanText.includes('<artifact'));
  assert.ok(cleanText.includes('I have generated two files for you:'));
});

test('extractPlan parses valid JSON plans inside <plan> tags', () => {
  const planJson = JSON.stringify([
    { id: 'step-1', title: 'Data Ingestion', status: 'completed' },
    { id: 'step-2', title: 'Model Inference', status: 'in_progress', toolName: 'calculator_code' },
  ]);
  const raw = `<plan>${planJson}</plan>Plan established and running.`;

  const { plan, cleanText } = extractPlan(raw);

  assert.equal(plan.length, 2);
  assert.equal(plan[0].title, 'Data Ingestion');
  assert.equal(plan[0].status, 'completed');
  assert.equal(plan[1].toolName, 'calculator_code');
  assert.equal(cleanText, 'Plan established and running.');
});

test('searchMemories filters relevant memory items', () => {
  const result = searchMemories('typescript web', INITIAL_MEMORIES);
  assert.ok(result.length > 0);
  assert.equal(result[0].key, 'runtime_preference');
});

test('executeLocalTool runs calculator_code safely', () => {
  const res = executeLocalTool('calculator_code', { expression: '15 * 4 + 10' });
  assert.ok(res.output.includes('70'));
});

test('executeLocalTool returns formatted table for data_analyzer', () => {
  const res = executeLocalTool('data_analyzer', { data: [10, 20, 30] });
  assert.ok(res.output.includes('Total Sum'));
  assert.ok(res.artifact);
  assert.equal(res.artifact.type, 'table');
});

test('default agent roster is valid with at least 4 diverse agents', () => {
  assert.ok(DEFAULT_AGENTS.length >= 4);
  const chronos = DEFAULT_AGENTS.find(a => a.id === 'chronos-planner');
  assert.ok(chronos);
  assert.equal(chronos.model, 'gemini-3.8-flash');
});
