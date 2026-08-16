/**
 * Achievements engine: a root-scoped Typert Remote service observing the agent
 * plane and folding observed activity into a process-global in-memory state.
 * Progress is intentionally global (not per-session): the dynamic-plugin
 * predecessor mounted under the root `cordis-dynamic` group, so this service
 * preserves that contract — counters and unlocks are shared across every
 * session in the process and reset only on restart.
 *
 * Privacy: listeners read only leaf scalars (tool name, success flag, agent id,
 * event kind, write/edit file paths, token counts). Message bodies, file
 * contents, error details, and search results are never read. Every listener is
 * wrapped so an observer bug can never leak into the agent loop.
 * @module @deepseek-ai/dsh-achievements
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-presets/types'
import type {} from '@deepseek-ai/dsh-goal'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-subagent'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ToolRunContext } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {} from '@deepseek-ai/dsh-workflow'
import type {} from '@deepseek-ai/cordis-plugin-loader'
import type { JsonValue } from '@deepseek-ai/dsh-session/types'
import type {
  AchievementCategory, AchievementProgress, AchievementRarity, AchievementView,
  AchievementsDock, AchievementsSnapshot, RecentUnlock,
} from './types.ts'

export type * from './types.ts'

/** Internal rule: a counter threshold, a distinct-set threshold, or a one-shot flag. */
type Rule =
  | { readonly kind: 'counter'; readonly key: string; readonly target: number }
  | { readonly kind: 'distinct'; readonly key: string; readonly target: number }
  | { readonly kind: 'lang-count'; readonly target: number }
  | { readonly kind: 'flag'; readonly flag: string }

interface AchievementDefinition {
  readonly id: string
  readonly name: string
  readonly desc: string
  readonly icon: string
  readonly category: AchievementCategory
  readonly rarity: AchievementRarity
  readonly hidden?: boolean
  readonly rule: Rule
}

/** Per-agent facts folded between a turn's first tool call and its close. */
interface TurnState {
  toolCalls: number
  error: boolean
  wroteRunnable: boolean
  ranShell: boolean
}

const LANG_BY_EXT: Readonly<Record<string, string>> = {
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.js': 'JavaScript', '.mjs': 'JavaScript', '.cjs': 'JavaScript', '.jsx': 'JavaScript',
  '.py': 'Python', '.rs': 'Rust', '.go': 'Go', '.java': 'Java', '.kt': 'Kotlin', '.kts': 'Kotlin',
  '.c': 'C', '.h': 'C', '.cpp': 'C++', '.cc': 'C++', '.hpp': 'C++', '.cs': 'C#',
  '.rb': 'Ruby', '.php': 'PHP', '.swift': 'Swift', '.sh': 'Shell', '.bash': 'Shell', '.ps1': 'PowerShell',
}

const RUNNABLE_EXTS: ReadonlySet<string> = new Set(
  ['.py', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.sh', '.bash', '.ps1', '.go', '.rs', '.rb', '.php', '.java', '.kt'],
)

const SHELL_TOOLS: ReadonlySet<string> = new Set(['bash', 'shell', 'pwsh', 'powershell'])

/** Loader module-name fragments that identify an installed dsh-deep-whale skin. */
const DEEP_WHALE_NAMES: readonly string[] = ['dsh-client-ui-skin-maid-atelier', 'dsh-deep-whale', 'maid-atelier']

/** Whether a loader module name belongs to the dsh-deep-whale skin family. */
function isDeepWhaleName(name: string): boolean {
  return DEEP_WHALE_NAMES.some(fragment => name.includes(fragment))
}

const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  { id: 'first-session', name: '启程', desc: '开始你的第一个会话', icon: '🚀', category: 'getting-started', rarity: 'common', rule: { kind: 'distinct', key: 'sessions', target: 1 } },
  { id: 'first-turn', name: '初试身手', desc: '完成第一轮对话', icon: '👋', category: 'getting-started', rarity: 'common', rule: { kind: 'counter', key: 'turns', target: 1 } },
  { id: 'first-tool', name: '工具初体验', desc: '第一次调用工具', icon: '🛠️', category: 'getting-started', rarity: 'common', rule: { kind: 'counter', key: 'tools', target: 1 } },
  { id: 'tool-10', name: '工具新手', desc: '累计调用 10 次工具', icon: '🔧', category: 'toolsmith', rarity: 'common', rule: { kind: 'counter', key: 'tools', target: 10 } },
  { id: 'tool-50', name: '工具达人', desc: '累计调用 50 次工具', icon: '⚙️', category: 'toolsmith', rarity: 'rare', rule: { kind: 'counter', key: 'tools', target: 50 } },
  { id: 'tool-200', name: '工具大师', desc: '累计调用 200 次工具', icon: '🔩', category: 'toolsmith', rarity: 'epic', rule: { kind: 'counter', key: 'tools', target: 200 } },
  { id: 'five-tools', name: '多面手', desc: '使用过 5 种不同的工具', icon: '🧰', category: 'toolsmith', rarity: 'rare', rule: { kind: 'distinct', key: 'toolsUsed', target: 5 } },
  { id: 'streak-10', name: '行云流水', desc: '连续 10 次工具调用全部成功', icon: '🔥', category: 'toolsmith', rarity: 'rare', rule: { kind: 'counter', key: 'streak', target: 10 } },
  { id: 'first-write', name: '白纸作画', desc: '第一次写入文件', icon: '📝', category: 'filecraft', rarity: 'common', rule: { kind: 'counter', key: 'writes', target: 1 } },
  { id: 'edit-25', name: '精雕细琢', desc: '累计编辑文件 25 次', icon: '✏️', category: 'filecraft', rarity: 'rare', rule: { kind: 'counter', key: 'edits', target: 25 } },
  { id: 'first-subagent', name: '指挥官', desc: '第一次派出子代理', icon: '🧑‍💼', category: 'orchestration', rarity: 'common', rule: { kind: 'counter', key: 'subagents', target: 1 } },
  { id: 'subagent-5', name: '军团', desc: '累计派出 5 个子代理', icon: '👥', category: 'orchestration', rarity: 'rare', rule: { kind: 'counter', key: 'subagents', target: 5 } },
  { id: 'multi-turn', name: '多线程', desc: '同时运行 3 个子代理', icon: '⚡', category: 'orchestration', rarity: 'rare', hidden: true, rule: { kind: 'flag', flag: 'multiTurn' } },
  { id: 'first-workflow', name: '编排师', desc: '第一次运行 workflow', icon: '🎼', category: 'orchestration', rarity: 'rare', rule: { kind: 'counter', key: 'workflows', target: 1 } },
  { id: 'big-workflow', name: '指挥家', desc: '单次 workflow 派出 3 个以上子代理', icon: '🎭', category: 'orchestration', rarity: 'epic', hidden: true, rule: { kind: 'flag', flag: 'bigWorkflow' } },
  { id: 'first-goal', name: '立旗', desc: '第一次创建 goal', icon: '🎯', category: 'goals', rarity: 'common', rule: { kind: 'counter', key: 'goalsCreated', target: 1 } },
  { id: 'goal-done', name: '旗开得胜', desc: '第一次完成 goal', icon: '🏁', category: 'goals', rarity: 'epic', rule: { kind: 'counter', key: 'goalsCompleted', target: 1 } },
  { id: 'deep-whale', name: '吾栖之肤', desc: '安装 dsh-deep-whale 鲸鱼娘皮肤插件（联动成就）', icon: '🐋', category: 'crossover', rarity: 'rare', rule: { kind: 'flag', flag: 'deepWhale' } },
  { id: 'night-owl', name: '夜猫子', desc: '在凌晨 0-5 点发送消息', icon: '🦉', category: 'hidden', rarity: 'rare', hidden: true, rule: { kind: 'flag', flag: 'nightOwl' } },
  { id: 'phoenix', name: '凤凰涅槃', desc: '回合内出错却仍然完成', icon: '🔥', category: 'hidden', rarity: 'epic', hidden: true, rule: { kind: 'flag', flag: 'phoenix' } },
  { id: 'marathon', name: '马拉松', desc: '单回合内调用 10 次工具', icon: '🏃', category: 'hidden', rarity: 'rare', hidden: true, rule: { kind: 'flag', flag: 'marathon' } },
  { id: 'shape-shifter', name: '百变星君', desc: '切换过 3 种不同的 agent preset', icon: '🦎', category: 'hidden', rarity: 'rare', hidden: true, rule: { kind: 'distinct', key: 'presets', target: 3 } },
  { id: 'self-ref', name: '自我指涉', desc: '用 DeepSeek Harness 修改了 DSH 本身', icon: '♻️', category: 'hidden', rarity: 'epic', hidden: true, rule: { kind: 'flag', flag: 'selfRef' } },
  { id: 'linguist', name: '语言学家', desc: '在单个项目中，用 AI 生成了 3 种或以上不同编程语言的代码', icon: '🌐', category: 'filecraft', rarity: 'rare', rule: { kind: 'lang-count', target: 3 } },
  { id: 'that-works', name: '这也能行？', desc: '用一段看似毫不相关的自然语言描述，让 AI 生成了一个可运行的程序', icon: '🤔', category: 'hidden', rarity: 'rare', hidden: true, rule: { kind: 'flag', flag: 'thatWorks' } },
  { id: 'billionaire', name: '亿万富翁', desc: '累计消耗一亿万（1 亿）token', icon: '💰', category: 'hidden', rarity: 'legendary', rule: { kind: 'counter', key: 'tokens', target: 100000000 } },
]

/** Return the lowercase file extension, or '' for paths without one. */
function extOf(path: unknown): string {
  if (typeof path !== 'string') return ''
  const slash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  const base = slash >= 0 ? path.slice(slash + 1) : path
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(dot).toLowerCase() : ''
}

/** Whether a write/edit path points at the DSH checkout itself (a coarse self-reference signal). */
function isDshPath(path: unknown): boolean {
  if (typeof path !== 'string') return false
  const norm = path.replace(/\\/g, '/')
  return norm.includes('deepseek-harness')
    || norm.includes('/packages/')
    || norm.includes('/vendor/')
    || norm.includes('/apps/')
    || norm.includes('/scripts/')
}

/** Achievements service: global observers, one-shot unlock queue, and read-only Remote surface. */
export class AchievementsService extends TypertRemoteService {
  static inject = ['tools']

  private readonly counters = new Map<string, number>()
  private readonly distinct = new Map<string, Set<string>>()
  private readonly flags = new Set<string>()
  private readonly turnState = new Map<string, TurnState>()
  private readonly unlocked = new Map<string, number>()
  private readonly unlockQueue: RecentUnlock[] = []
  private readonly activeSubagents = new Set<string>()
  private readonly seenUsage = new Set<string>()

  constructor(ctx: Context) {
    super(ctx, 'achievements')
    this.attachListeners(ctx)
    this.seedSessions(ctx)
    this.registerTool(ctx)
    this.detectDeepWhale(ctx)
    // A skin installed by a later loader row (HMR/user patch) is only visible
    // once its entry's options are applied; re-scan after each entry-init.
    ctx.on('loader/entry-init', () => {
      queueMicrotask(() => { this.detectDeepWhale(ctx) })
    })
  }

  /** Read the full catalog with live progress. */
  @Remote('list')
  list(): AchievementsSnapshot {
    return {
      total: ACHIEVEMENTS.length,
      unlocked: this.unlocked.size,
      achievements: ACHIEVEMENTS.map(a => this.viewOf(a)),
    }
  }

  /** Drain and return newly unlocked achievements (consumes the queue). */
  @Remote('recent')
  recent(): { unlocks: RecentUnlock[] } {
    return { unlocks: this.unlockQueue.splice(0) }
  }

  /** Compact readout for the composer dock strip. */
  @Remote('dock')
  dock(): AchievementsDock {
    let next: { name: string; icon: string; current: number; target: number; gap: number } | null = null
    for (const a of ACHIEVEMENTS) {
      if (this.unlocked.has(a.id) || a.rule.kind === 'flag') continue
      const p = this.progressOf(a.rule)
      const gap = p.target - p.current
      if (next === null || gap < next.gap) next = { name: a.name, icon: a.icon, current: p.current, target: p.target, gap }
    }
    return {
      unlocked: this.unlocked.size,
      total: ACHIEVEMENTS.length,
      streak: this.counters.get('streak') ?? 0,
      next: next === null ? null : { name: next.name, icon: next.icon, current: next.current, target: next.target },
    }
  }

  private viewOf(a: AchievementDefinition): AchievementView {
    return {
      id: a.id,
      name: a.name,
      desc: a.desc,
      icon: a.icon,
      category: a.category,
      rarity: a.rarity,
      hidden: a.hidden === true,
      unlocked: this.unlocked.has(a.id),
      unlockedAt: this.unlocked.get(a.id) ?? null,
      progress: this.progressOf(a.rule),
    }
  }

  private bump(key: string, by = 1): void {
    this.counters.set(key, (this.counters.get(key) ?? 0) + by)
  }

  private addDistinct(key: string, value: string): void {
    let set = this.distinct.get(key)
    if (set === undefined) { set = new Set(); this.distinct.set(key, set) }
    set.add(value)
  }

  private mark(flag: string): void {
    this.flags.add(flag)
  }

  private agentKey(agent: Agent | undefined): string {
    return agent !== undefined && typeof agent.id === 'string' ? agent.id : 'root'
  }

  private ruleMet(rule: Rule): boolean {
    if (rule.kind === 'counter') return (this.counters.get(rule.key) ?? 0) >= rule.target
    if (rule.kind === 'distinct') return (this.distinct.get(rule.key)?.size ?? 0) >= rule.target
    if (rule.kind === 'lang-count') return this.maxLangCount() >= rule.target
    return this.flags.has(rule.flag)
  }

  private maxLangCount(): number {
    let max = 0
    for (const [key, set] of this.distinct) {
      if (key.startsWith('lang:') && set.size > max) max = set.size
    }
    return max
  }

  private progressOf(rule: Rule): AchievementProgress {
    if (rule.kind === 'counter') {
      return { current: Math.min(this.counters.get(rule.key) ?? 0, rule.target), target: rule.target }
    }
    if (rule.kind === 'distinct') {
      return { current: Math.min(this.distinct.get(rule.key)?.size ?? 0, rule.target), target: rule.target }
    }
    if (rule.kind === 'lang-count') {
      return { current: Math.min(this.maxLangCount(), rule.target), target: rule.target }
    }
    return { current: 0, target: 1 }
  }

  private checkAll(): void {
    for (const a of ACHIEVEMENTS) {
      if (this.unlocked.has(a.id) || !this.ruleMet(a.rule)) continue
      const at = Date.now()
      this.unlocked.set(a.id, at)
      this.unlockQueue.push({ id: a.id, name: a.name, rarity: a.rarity, icon: a.icon, at })
    }
  }

  private turnFor(agent: Agent | undefined): TurnState {
    const key = this.agentKey(agent)
    let turn = this.turnState.get(key)
    if (turn === undefined) { turn = { toolCalls: 0, error: false, wroteRunnable: false, ranShell: false }; this.turnState.set(key, turn) }
    return turn
  }

  private seedSessions(ctx: Context): void {
    const agents = ctx.get('agents') as { list?: () => Agent[] } | undefined
    if (agents === undefined || typeof agents.list !== 'function') return
    for (const agent of agents.list()) {
      if (typeof agent.id === 'string') this.addDistinct('sessions', agent.id)
    }
    this.checkAll()
  }

  /** Mark the dsh-deep-whale crossover achievement when its skin is installed. */
  private detectDeepWhale(ctx: Context): void {
    const loader = ctx.get('loader')
    if (loader === undefined) return
    for (const entry of loader.entries()) {
      if (typeof entry.options.name === 'string' && isDeepWhaleName(entry.options.name)) {
        this.mark('deepWhale')
        break
      }
    }
    this.checkAll()
  }

  private attachListeners(ctx: Context): void {
    ctx.on('tools/result', (exec, result) => {
      const name = exec.name
      this.bump('tools')
      this.addDistinct('toolsUsed', name)
      if (name === 'write') this.bump('writes')
      if (name === 'edit') this.bump('edits')
      if (!result.isError) this.bump('streak')
      else this.counters.set('streak', 0)

      const turn = this.turnFor(exec.agent)
      turn.toolCalls += 1
      if (turn.toolCalls >= 10) this.mark('marathon')

      if ((name === 'write' || name === 'edit') && exec.arguments !== undefined) {
        const args = exec.arguments as { file_path?: unknown }
        const path = args.file_path
        if (typeof path === 'string') {
          const ext = extOf(path)
          const lang = LANG_BY_EXT[ext]
          if (lang !== undefined) {
            const norm = path.replace(/\\/g, '/')
            const segs = norm.split('/').filter(Boolean)
            const project = segs.length >= 2 ? (segs[1] ?? 'default') : (segs[0] ?? 'default')
            this.addDistinct(`lang:${project}`, lang)
          }
          if (isDshPath(path)) this.mark('selfRef')
          if (RUNNABLE_EXTS.has(ext)) turn.wroteRunnable = true
        }
      }
      if (SHELL_TOOLS.has(name)) turn.ranShell = true
      if (turn.wroteRunnable && turn.ranShell) this.mark('thatWorks')
      this.checkAll()
    })

    // Count only the final per-(turn,step) sample to avoid double counting the chunk snapshot.
    ctx.on('session/event', (_session: Session, event: SessionEvent) => {
      if (event.type !== 'assistant/message') return
      const usage = event.data.usage
      if (usage === undefined || typeof usage !== 'object') return
      const turn = event.data.turn
      const step = event.data.step
      // Key by session too: two live sessions can share the same (turn, step).
      const key = `${_session.id}:${turn}:${step}`
      if (this.seenUsage.has(key)) return
      this.seenUsage.add(key)
      const record = usage as {
        inputTokens?: unknown
        outputTokens?: unknown
        cacheReadTokens?: unknown
        cacheWriteTokens?: unknown
        reasoningTokens?: unknown
      }
      const total = [record.inputTokens, record.outputTokens, record.cacheReadTokens, record.cacheWriteTokens, record.reasoningTokens]
        .reduce((sum: number, value) => sum + (typeof value === 'number' ? value : 0), 0)
      if (total > 0) { this.bump('tokens', total); this.checkAll() }
    })

    // phoenix: a turn that saw a recoverable request error yet still completed.
    // `agent/error` only fires on the fatal path (the turn ends there), while
    // `agent/request-error` fires on a failed attempt that llm-retry may
    // recover — so it is the signal for "errored but completed". A waterfall
    // listener must delegate with next() so the retry chain is not short-circuited.
    ctx.on('agent/request-error', (payload, next) => {
      this.turnFor(payload.agent).error = true
      return next()
    })

    // A fatal turn error never reaches turn-stopping: drop its half-folded
    // turn state so the next turn starts clean (marathon/that-works counts
    // must not bleed across turns).
    ctx.on('agent/error', (payload) => {
      this.turnState.delete(this.agentKey(payload.agent))
    })

    ctx.on('agent/turn-stopping', (payload) => {
      this.bump('turns')
      const turn = this.turnState.get(this.agentKey(payload.agent))
      if (turn !== undefined) {
        if (turn.error) this.mark('phoenix')
        if (turn.wroteRunnable && turn.ranShell) this.mark('thatWorks')
        this.turnState.delete(this.agentKey(payload.agent))
      }
      this.checkAll()
    })

    ctx.on('goal/changed', (payload) => {
      const op = payload.change.operation
      if (op === 'create') this.bump('goalsCreated')
      if (op === 'complete') this.bump('goalsCompleted')
      this.checkAll()
    })

    // 多线程: count concurrent live subagents, immune to each child's own turn close.
    ctx.on('subagent/start', (info) => {
      this.activeSubagents.add(info.runId)
      if (this.activeSubagents.size >= 3) this.mark('multiTurn')
      this.checkAll()
    })

    ctx.on('subagent/end', (info) => {
      this.bump('subagents')
      this.activeSubagents.delete(info.runId)
      this.checkAll()
    })

    ctx.on('workflow/end', (_info, result) => {
      this.bump('workflows')
      if (result.agentsStarted >= 3) this.mark('bigWorkflow')
      this.checkAll()
    })

    ctx.on('agent-preset/selected', (_sessionId, preset) => {
      this.addDistinct('presets', preset)
      this.checkAll()
    })

    ctx.on('agent/inbox/inserted', () => {
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 5) this.mark('nightOwl')
      this.checkAll()
    })

    ctx.on('agent/session-start', (payload) => {
      this.addDistinct('sessions', this.agentKey(payload.agent))
      this.checkAll()
    })
  }

  private registerTool(ctx: Context): void {
    ctx.tools.register(defineTool({
      name: 'list_achievements',
      description: '查询当前成就系统状态：已解锁成就、总成就数、最近解锁与各项进度。只读，不影响会话。',
      parameters: {},
      output: {
        schema: { type: 'json' },
        render: (_args: unknown, value: JsonValue) => [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
      },
      execute: (_args: unknown, _exec: ToolRunContext): Promise<JsonValue> =>
        Promise.resolve({
          unlockedCount: this.unlocked.size,
          total: ACHIEVEMENTS.length,
          streak: this.counters.get('streak') ?? 0,
          recent: this.unlockQueue.slice(-3).map(u => ({ id: u.id, name: u.name, rarity: u.rarity, icon: u.icon })),
          achievements: ACHIEVEMENTS.map(a => this.viewOf(a)),
        } as unknown as JsonValue),
    }))
  }
}

export default AchievementsService
