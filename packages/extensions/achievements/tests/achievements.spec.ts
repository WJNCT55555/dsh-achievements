/**
 * Achievements engine behavior: event listeners fold observed activity into
 * counters and unlocks, and the Remote surface reads back a stable projection.
 */
import { Context } from '@deepseek-ai/cordis'
import type { ToolExecution, ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AchievementsService } from '../src/index.ts'
import type { AchievementsDock, AchievementsSnapshot } from '../src/types.ts'

import { afterEach, describe, expect, it } from 'vitest'

/** Per-test temp state dirs, removed after each test. */
const stateDirs: string[] = []
afterEach(() => {
  for (const dir of stateDirs.splice(0)) {
    try { rmSync(dir, { recursive: true, force: true }) } catch { /* best-effort */ }
  }
})

/** Build a service against an isolated state directory. */
function makeService(ctx: Context, config: { deepInsights?: boolean } = {}): AchievementsService {
  const stateDir = mkdtempSync(join(tmpdir(), 'dsh-achievements-test-'))
  stateDirs.push(stateDir)
  return new AchievementsService(ctx, { ...config, stateDir })
}

/** Emit helper that sidesteps the typed Event overloads for hand-built payloads. */
function emit(ctx: Context, name: string, ...args: unknown[]): void {
  ;(ctx as unknown as { emit: (n: string, ...a: unknown[]) => void }).emit(name, ...args)
}

/** Serial-style dispatch helper for waterfall events (agent/request-error). */
function waterfall(ctx: Context, name: string, payload: unknown, fallback: unknown): Promise<unknown> {
  const events = (ctx as unknown as { waterfall: (n: string, p: unknown, ...rest: unknown[]) => Promise<unknown> }).waterfall
  return events(name, payload, () => fallback)
}

function exec(name: string, id = 'agent-1'): ToolExecution {
  return {
    callId: `call-${name}`,
    rootCallId: `call-${name}`,
    name,
    arguments: {},
    agent: { id },
    signal: new AbortController().signal,
    token: Symbol('token'),
  } as unknown as ToolExecution
}

function ok(result: Partial<ToolExecutionResult> = {}): ToolExecutionResult {
  return { isError: false, value: {}, content: [], ...result } as ToolExecutionResult
}

describe('AchievementsService', () => {
  it('seeds the first-session achievement from live agents', () => {
    const ctx = new Context()
    ctx.provide('agents', { list: () => [{ id: 'session-a' }] })
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'first-session')?.unlocked).toBe(true)
  })

  it('unlocks first-tool and counts tool calls across sessions', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'tools/result', exec('grep', 'b'), ok())
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'first-tool')?.unlocked).toBe(true)
  })

  it('resets the success streak on a failed tool call', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'tools/result', exec('read'), ok())
    emit(ctx, 'tools/result', exec('read'), ok({ isError: true, error: {} as never }))
    const service = ctx.get('achievements') as unknown as { dock: () => AchievementsDock }
    expect(service.dock().streak).toBe(0)
  })

  it('unlocks multi-turn at three concurrent subagents', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'subagent/start', { runId: 'r1' })
    emit(ctx, 'subagent/start', { runId: 'r2' })
    emit(ctx, 'subagent/start', { runId: 'r3' })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'multi-turn')?.unlocked).toBe(true)
  })

  it('unlocks phoenix when a request error is recovered and the turn completes', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    // A recoverable request error marks the turn; the fallback (retry) is chosen.
    await waterfall(ctx, 'agent/request-error', { agent: { id: 'a' }, turn: 1, step: 1, provider: 'p', failure: {}, retryPolicy: undefined, signal: new AbortController().signal }, { kind: 'retry' })
    emit(ctx, 'agent/turn-stopping', { agent: { id: 'a' }, turn: 1, signal: new AbortController().signal })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'phoenix')?.unlocked).toBe(true)
  })

  it('does not unlock phoenix when the request error was never recovered', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    // No request-error at all: a clean turn must not count as phoenix.
    emit(ctx, 'agent/turn-stopping', { agent: { id: 'a' }, turn: 1, signal: new AbortController().signal })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'phoenix')?.unlocked).toBe(false)
  })

  it('resets marathon turn state on a fatal turn error', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    // Nine calls in turn A: one short of marathon, then the turn dies.
    for (let i = 0; i < 9; i++) emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'agent/error', { agent: { id: 'a' }, turn: 1, step: 1, error: new Error('fatal') })
    // Two calls in turn B must not inherit turn A's counter.
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'marathon')?.unlocked).toBe(false)
  })

  it('unlocks the deep-whale crossover achievement when the skin is installed', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    ctx.provide('loader', { entries: () => [
      { options: { name: '@dsh-external/dsh-client-ui-skin-maid-atelier' } },
    ] })
    void makeService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'deep-whale')?.unlocked).toBe(true)
  })

  it('keeps the deep-whale crossover achievement locked without the skin', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    ctx.provide('loader', { entries: () => [
      { options: { name: '@deepseek-ai/dsh-achievements' } },
    ] })
    void makeService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'deep-whale')?.unlocked).toBe(false)
  })

  it('unlocks the librarian achievement with 100 or more available skills', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    const skills = Array.from({ length: 120 }, (_, i) => ({ name: `skill-${i}` }))
    ctx.provide('skills', { list: () => Promise.resolve(skills) })
    void makeService(ctx)
    await new Promise(resolve => setTimeout(resolve, 30))
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'librarian')?.unlocked).toBe(true)
  })

  it('keeps the librarian achievement locked below 100 available skills', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    const skills = Array.from({ length: 42 }, (_, i) => ({ name: `skill-${i}` }))
    ctx.provide('skills', { list: () => Promise.resolve(skills) })
    void makeService(ctx)
    await new Promise(resolve => setTimeout(resolve, 30))
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'librarian')?.unlocked).toBe(false)
  })

  it('dedupes token usage per session, turn, and step', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    const usage = { inputTokens: 100, outputTokens: 50 }
    const message = { type: 'assistant/message', data: { turn: 1, step: 1, message: {}, usage } }
    // Same session, turn, step: second sample must be deduped.
    emit(ctx, 'session/event', { id: 's1' }, message)
    emit(ctx, 'session/event', { id: 's1' }, message)
    // A different session with the same (turn, step) must NOT be deduped.
    emit(ctx, 'session/event', { id: 's2' }, message)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const a = service.list().achievements.find(a => a.id === 'billionaire')!
    expect(a.progress.current).toBe(300)
  })

  it('persists unlocks across service instances sharing a state dir', async () => {
    const stateDir = mkdtempSync(join(tmpdir(), 'dsh-achievements-persist-'))
    stateDirs.push(stateDir)
    const first = new Context()
    first.provide('tools', { register: () => () => {} })
    first.provide('loader', { entries: () => [
      { options: { name: '@dsh-external/dsh-client-ui-skin-maid-atelier' } },
    ] })
    const svcA = new AchievementsService(first, { stateDir })
    await new Promise(resolve => setTimeout(resolve, 30))
    await (svcA as unknown as { store: { flush: () => Promise<void> } }).store.flush()
    const second = new Context()
    second.provide('tools', { register: () => () => {} })
    second.provide('loader', { entries: () => [{ options: { name: '@deepseek-ai/dsh-achievements' } }] })
    void new AchievementsService(second, { stateDir })
    await new Promise(resolve => setTimeout(resolve, 60))
    const service = second.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    // deep-whale was unlocked in the first instance and restored in the second.
    expect(service.list().achievements.find(a => a.id === 'deep-whale')?.unlocked).toBe(true)
  })

  it('keeps deep achievements locked while deep insights are off', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    await new Promise(resolve => setTimeout(resolve, 30))
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const view = service.list().achievements.find(a => a.id === 'deep-sorry')!
    expect(view.deepLocked).toBe(true)
    expect(view.unlocked).toBe(false)
  })

  it('counts deep body matches only when deep insights are enabled', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    const svc = makeService(ctx, { deepInsights: true })
    await new Promise(resolve => setTimeout(resolve, 30))
    const msg = { type: 'assistant/message', data: { turn: 1, step: 1, message: { content: [{ type: 'text', text: 'Sorry about that' }] }, usage: undefined } }
    emit(ctx, 'session/event', { id: 's1' }, msg)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const view = service.list().achievements.find(a => a.id === 'deep-sorry')!
    expect(view.deepLocked).toBe(false)
    expect(view.progress.current).toBe(1)
    void (svc as unknown as { store: { flush: () => Promise<void> } }).store.flush()
  })

  it('tracks distinct models from request headers', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'session/event', { id: 's1' }, { type: 'request/header', data: { header: { config: { provider: 'deepseek', model: 'deepseek-v4' } }, reason: 'first' } })
    emit(ctx, 'session/event', { id: 's1' }, { type: 'request/header', data: { header: { config: { provider: 'anthropic', model: 'claude-4' } }, reason: 'next' } })
    emit(ctx, 'session/event', { id: 's1' }, { type: 'request/header', data: { header: { config: { provider: 'openai', model: 'gpt-5' } }, reason: 'next' } })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const view = service.list().achievements.find(a => a.id === 'model-hop')!
    expect(view.progress.current).toBe(3)
    const polyglot = service.list().achievements.find(a => a.id === 'provider-polyglot')!
    expect(polyglot.progress.current).toBe(3)
  })

  it('counts behavior events from session history events', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'session/event', { id: 's1' }, { type: 'plan/mode', data: { active: true } })
    emit(ctx, 'session/event', { id: 's1' }, { type: 'approval/asked', data: { id: 'a1', toolName: 'bash' } })
    emit(ctx, 'session/event', { id: 's1' }, { type: 'approval/decided', data: { id: 'a1', outcome: 'rejected' } })
    emit(ctx, 'session/event', { id: 's1' }, { type: 'compaction/end', data: { compactionId: 'c1', turn: null } })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'plan-before-act')!.progress.current).toBe(1)
    expect(service.list().achievements.find(a => a.id === 'permission-magnet')!.progress.current).toBe(1)
    expect(service.list().achievements.find(a => a.id === 'voter')!.progress.current).toBe(1)
    expect(service.list().achievements.find(a => a.id === 'compactor')!.progress.current).toBe(1)
  })

  it('sets the billionaire target to one trillion tokens', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const view = service.list().achievements.find(a => a.id === 'billionaire')!
    expect(view.progress.target).toBe(1000000000000)
  })

  it('unlocks cache-perfect when the cumulative cache hit rate exceeds 99%', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    // 9900 cache reads against only 99 fresh input tokens → 99.01% hit rate.
    const usage = { inputTokens: 99, cacheReadTokens: 9900 }
    emit(ctx, 'session/event', { id: 's1' }, { type: 'assistant/message', data: { turn: 1, step: 1, message: {}, usage } })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'cache-perfect')?.unlocked).toBe(true)
  })

  it('keeps cache-perfect locked below the 99% hit rate', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    // 50% hit rate: equal fresh and cached input.
    const usage = { inputTokens: 100, cacheReadTokens: 100 }
    emit(ctx, 'session/event', { id: 's1' }, { type: 'assistant/message', data: { turn: 1, step: 1, message: {}, usage } })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'cache-perfect')?.unlocked).toBe(false)
  })

  it('tracks per-tool counts and exposes top tools via stats', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'tools/result', exec('grep', 'a'), ok())
    emit(ctx, 'tools/result', exec('read', 'b'), ok())
    const service = ctx.get('achievements') as unknown as { stats: () => { tools: Array<{ name: string; count: number }> } }
    const stats = service.stats()
    expect(stats.tools.find(t => t.name === 'read')?.count).toBe(3)
    expect(stats.tools.find(t => t.name === 'grep')?.count).toBe(1)
    expect(stats.tools[0]?.name).toBe('read')
  })

  it('exposes token buckets through stats', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void makeService(ctx)
    emit(ctx, 'session/event', { id: 's1' }, { type: 'assistant/message', data: { turn: 1, step: 1, message: {}, usage: { outputTokens: 100, cacheReadTokens: 200, inputTokens: 50 } } })
    const service = ctx.get('achievements') as unknown as { stats: () => { tokens: { output: number; cacheRead: number; uncached: number } } }
    const tokens = service.stats().tokens
    expect(tokens.output).toBe(100)
    expect(tokens.cacheRead).toBe(200)
    expect(tokens.uncached).toBe(50)
  })
})
