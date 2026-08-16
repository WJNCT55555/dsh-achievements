/**
 * Achievements engine behavior: event listeners fold observed activity into
 * counters and unlocks, and the Remote surface reads back a stable projection.
 */
import { Context } from '@deepseek-ai/cordis'
import type { ToolExecution, ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import { AchievementsService } from '../src/index.ts'
import type { AchievementsDock, AchievementsSnapshot } from '../src/types.ts'

import { describe, expect, it } from 'vitest'

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
    void new AchievementsService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'first-session')?.unlocked).toBe(true)
  })

  it('unlocks first-tool and counts tool calls across sessions', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
    emit(ctx, 'tools/result', exec('read', 'a'), ok())
    emit(ctx, 'tools/result', exec('grep', 'b'), ok())
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'first-tool')?.unlocked).toBe(true)
  })

  it('resets the success streak on a failed tool call', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
    emit(ctx, 'tools/result', exec('read'), ok())
    emit(ctx, 'tools/result', exec('read'), ok({ isError: true, error: {} as never }))
    const service = ctx.get('achievements') as unknown as { dock: () => AchievementsDock }
    expect(service.dock().streak).toBe(0)
  })

  it('unlocks multi-turn at three concurrent subagents', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
    emit(ctx, 'subagent/start', { runId: 'r1' })
    emit(ctx, 'subagent/start', { runId: 'r2' })
    emit(ctx, 'subagent/start', { runId: 'r3' })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'multi-turn')?.unlocked).toBe(true)
  })

  it('unlocks phoenix when a request error is recovered and the turn completes', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
    // A recoverable request error marks the turn; the fallback (retry) is chosen.
    await waterfall(ctx, 'agent/request-error', { agent: { id: 'a' }, turn: 1, step: 1, provider: 'p', failure: {}, retryPolicy: undefined, signal: new AbortController().signal }, { kind: 'retry' })
    emit(ctx, 'agent/turn-stopping', { agent: { id: 'a' }, turn: 1, signal: new AbortController().signal })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'phoenix')?.unlocked).toBe(true)
  })

  it('does not unlock phoenix when the request error was never recovered', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
    // No request-error at all: a clean turn must not count as phoenix.
    emit(ctx, 'agent/turn-stopping', { agent: { id: 'a' }, turn: 1, signal: new AbortController().signal })
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    expect(service.list().achievements.find(a => a.id === 'phoenix')?.unlocked).toBe(false)
  })

  it('resets marathon turn state on a fatal turn error', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
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
    void new AchievementsService(ctx)
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
    void new AchievementsService(ctx)
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'deep-whale')?.unlocked).toBe(false)
  })

  it('unlocks the librarian achievement with 100 or more available skills', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    const skills = Array.from({ length: 120 }, (_, i) => ({ name: `skill-${i}` }))
    ctx.provide('skills', { list: () => Promise.resolve(skills) })
    void new AchievementsService(ctx)
    await new Promise(resolve => setImmediate(resolve))
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'librarian')?.unlocked).toBe(true)
  })

  it('keeps the librarian achievement locked below 100 available skills', async () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    const skills = Array.from({ length: 42 }, (_, i) => ({ name: `skill-${i}` }))
    ctx.provide('skills', { list: () => Promise.resolve(skills) })
    void new AchievementsService(ctx)
    await new Promise(resolve => setImmediate(resolve))
    const service = ctx.get('achievements') as unknown as { list: () => AchievementsSnapshot }
    const snapshot = service.list()
    expect(snapshot.achievements.find(a => a.id === 'librarian')?.unlocked).toBe(false)
  })

  it('dedupes token usage per session, turn, and step', () => {
    const ctx = new Context()
    ctx.provide('tools', { register: () => () => {} })
    void new AchievementsService(ctx)
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
})
