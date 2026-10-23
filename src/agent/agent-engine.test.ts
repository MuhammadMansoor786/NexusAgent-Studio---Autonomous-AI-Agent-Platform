import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isRiskyCommand,
  executeTerminalCommand,
  generateFallbackMission,
  parseThoughts,
  extractArtifacts,
  extractPlan,
  searchMemories,
  DEFAULT_AGENTS,
  INITIAL_FILESYSTEM,
} from './agent-engine';

test('isRiskyCommand detects deletion commands and enforces confirmation', () => {
  const rmCheck = isRiskyCommand('rm -rf /downloads/temp');
  assert.equal(rmCheck.isRisky, true);
  assert.ok(rmCheck.commandName.includes('Deletion'));
  assert.ok(rmCheck.warningText.includes("WARNING: I am about to execute a risky command"));
  assert.ok(rmCheck.warningText.includes("Please say 'Yes' to approve or 'No' to cancel"));

  const delCheck = isRiskyCommand('delete this folder please');
  assert.equal(delCheck.isRisky, true);
});

test('isRiskyCommand detects shutdown and reboot commands', () => {
  const shutdownCheck = isRiskyCommand('shutdown the computer now');
  assert.equal(shutdownCheck.isRisky, true);
  assert.ok(shutdownCheck.commandName.includes('Shutdown'));
  assert.ok(shutdownCheck.warningText.includes("WARNING: I am about to execute a risky command"));

  const rebootCheck = isRiskyCommand('reboot the pc');
  assert.equal(rebootCheck.isRisky, true);
});

test('isRiskyCommand allows safe operations without warning', () => {
  const safeMkdir = isRiskyCommand('mkdir project-alpha');
  assert.equal(safeMkdir.isRisky, false);

  const safeReact = isRiskyCommand('npx create-react-app portfolio');
  assert.equal(safeReact.isRisky, false);
});

test('executeTerminalCommand blocks risky commands when unconfirmed', () => {
  const res = executeTerminalCommand('rm -rf temp_logs', INITIAL_FILESYSTEM, false);
  assert.equal(res.requiresConfirmation, true);
  assert.equal(res.log.status, 'blocked');
  assert.ok(res.warning?.includes("Please say 'Yes' to approve or 'No' to cancel"));
});

test('executeTerminalCommand executes safe commands immediately and updates filesystem', () => {
  const res = executeTerminalCommand('mkdir project-x', INITIAL_FILESYSTEM, false);
  assert.equal(res.requiresConfirmation, false);
  assert.equal(res.log.status, 'success');
  const root = res.updatedFilesystem[0];
  assert.ok(root.children?.some(c => c.name === 'project-x'));
});

test('executeTerminalCommand creates React scaffold with package.json and App.tsx', () => {
  const res = executeTerminalCommand('npx create-react-app my-dashboard', INITIAL_FILESYSTEM, false);
  assert.equal(res.requiresConfirmation, false);
  const root = res.updatedFilesystem[0];
  const project = root.children?.find(c => c.name === 'my-dashboard');
  assert.ok(project);
  assert.ok(project.children?.some(c => c.name === 'package.json'));
  assert.ok(project.children?.some(c => c.name === 'App.tsx'));
  assert.ok(res.artifact);
});

test('Nexus OS-Agent is the first flagship agent with strict safety protocols', () => {
  const firstAgent = DEFAULT_AGENTS[0];
  assert.equal(firstAgent.id, 'nexus-os-agent');
  assert.equal(firstAgent.name, 'Nexus OS-Agent');
  assert.ok(firstAgent.systemInstruction.includes('Human-in-the-Loop'));
  assert.ok(firstAgent.systemInstruction.includes("Please say 'Yes' to approve or 'No' to cancel"));
});

test('generateFallbackMission generates human-in-the-loop confirmation for Nexus OS-Agent on risky command', () => {
  const osAgent = DEFAULT_AGENTS[0];
  const res = generateFallbackMission(osAgent, 'delete the old cache folder', []);
  assert.ok(res.pendingConfirmation);
  assert.ok(res.content.includes("WARNING: I am about to execute a risky command"));
  assert.equal(res.toolCalls[0].status, 'awaiting_confirmation');
});

test("executeLocalTool handles 'execute_terminal_command' tool correctly", () => {
  // Safe command
  const safeRes = executeTerminalCommand('mkdir -p user_scripts', INITIAL_FILESYSTEM, false);
  assert.equal(safeRes.requiresConfirmation, false);
  assert.ok(safeRes.log.output.includes('user_scripts'));

  // Risky command without confirmation
  const riskyUnconfirmed = executeTerminalCommand('shutdown -h now', INITIAL_FILESYSTEM, false);
  assert.equal(riskyUnconfirmed.requiresConfirmation, true);
  assert.ok(riskyUnconfirmed.warning?.includes('Shutdown'));

  // Risky command with confirmation
  const riskyConfirmed = executeTerminalCommand('shutdown -h now', INITIAL_FILESYSTEM, true);
  assert.equal(riskyConfirmed.requiresConfirmation, false);
  assert.ok(riskyConfirmed.log.output.includes('Initiating clean system'));
});
