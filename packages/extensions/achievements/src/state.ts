/**
 * Durable state persistence for the achievements engine: serializes the
 * process-global counters, distinct sets, flags, and unlock timestamps to a
 * single JSON file under `~/.agent-achievements/state.json`. Only achievement
 * progress is written — message bodies, file contents, and search results are
 * never persisted (the deep-insights layer matches bodies at runtime and
 * stores nothing but the unlock itself).
 *
 * Writes are debounced so hot event paths never touch the disk; a final flush
 * happens on disposal. The file format carries a schema version and is
 * forward-tolerant: unknown keys are ignored on load.
 * @module @wjnct55555/dsh-achievements/state
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

/** Current on-disk format version. */
export const STATE_SCHEMA_VERSION = 1

/** Narrow a parsed JSON value to a plain object record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** The serializable subset of engine state. */
export interface PersistedState {
  readonly schemaVersion: number
  readonly counters: Readonly<Record<string, number>>
  readonly distinct: Readonly<Record<string, readonly string[]>>
  readonly flags: readonly string[]
  readonly unlocked: Readonly<Record<string, number>>
  /** Anonymous telemetry opt-in: whether unlocks are shared, plus the per-install id. */
  readonly telemetry: {
    readonly enabled: boolean
    readonly anonymousId: string
  }
}

/** A file-backed state store with debounced writes. */
export class AchievementStateStore {
  private writeTimer: NodeJS.Timeout | undefined
  private pending: PersistedState | undefined

  constructor(
    private readonly filePath: string,
    private readonly debounceMs = 500,
  ) {}

  /** Load and validate the persisted state; returns an empty baseline when absent or corrupt. */
  async load(): Promise<PersistedState> {
    try {
      const raw = await readFile(this.filePath, 'utf8')
      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed !== 'object' || parsed === null) return this.empty()
      const record = parsed as Record<string, unknown>
      if (record['schemaVersion'] !== STATE_SCHEMA_VERSION) return this.empty()
      const telemetryRaw = isRecord(record['telemetry']) ? record['telemetry'] : {}
      return {
        schemaVersion: STATE_SCHEMA_VERSION,
        counters: isRecord(record['counters']) ? record['counters'] as Record<string, number> : {},
        distinct: isRecord(record['distinct']) ? record['distinct'] as Record<string, string[]> : {},
        flags: Array.isArray(record['flags']) ? record['flags'] as string[] : [],
        unlocked: isRecord(record['unlocked']) ? record['unlocked'] as Record<string, number> : {},
        telemetry: {
          enabled: telemetryRaw['enabled'] === true,
          anonymousId: typeof telemetryRaw['anonymousId'] === 'string' ? telemetryRaw['anonymousId'] : '',
        },
      }
    } catch {
      return this.empty()
    }
  }

  /** Whether a state file already exists (first-run probe). */
  async exists(): Promise<boolean> {
    try {
      await readFile(this.filePath)
      return true
    } catch {
      return false
    }
  }

  /** Schedule a debounced write of the latest state. */
  save(state: PersistedState): void {
    this.pending = state
    if (this.writeTimer !== undefined) return
    this.writeTimer = setTimeout(() => { void this.flush() }, this.debounceMs)
    // The timer keeps the process alive; unref so a quiet process can exit.
    this.writeTimer.unref()
  }

  /** Immediately write any pending state and await the write. */
  async flush(): Promise<void> {
    if (this.writeTimer !== undefined) {
      clearTimeout(this.writeTimer)
      this.writeTimer = undefined
    }
    const state = this.pending
    if (state === undefined) return
    this.pending = undefined
    await this.write(state)
  }

  private async write(state: PersistedState): Promise<void> {
    const json = JSON.stringify(state, null, 2)
    const tmp = `${this.filePath}.tmp`
    try {
      await mkdir(dirname(this.filePath), { recursive: true })
      await writeFile(tmp, json, 'utf8')
      await rename(tmp, this.filePath)
    } catch {
      // Persistence is best-effort: a failed write must never crash the engine.
    }
  }

  private empty(): PersistedState {
    return {
      schemaVersion: STATE_SCHEMA_VERSION,
      counters: {},
      distinct: {},
      flags: [],
      unlocked: {},
      telemetry: { enabled: false, anonymousId: '' },
    }
  }
}
