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
/** Current on-disk format version. */
export declare const STATE_SCHEMA_VERSION = 1;
/** The serializable subset of engine state. */
export interface PersistedState {
    readonly schemaVersion: number;
    readonly counters: Readonly<Record<string, number>>;
    readonly distinct: Readonly<Record<string, readonly string[]>>;
    readonly flags: readonly string[];
    readonly unlocked: Readonly<Record<string, number>>;
}
/** A file-backed state store with debounced writes. */
export declare class AchievementStateStore {
    private readonly filePath;
    private readonly debounceMs;
    private writeTimer;
    private pending;
    constructor(filePath: string, debounceMs?: number);
    /** Load and validate the persisted state; returns an empty baseline when absent or corrupt. */
    load(): Promise<PersistedState>;
    /** Whether a state file already exists (first-run probe). */
    exists(): Promise<boolean>;
    /** Schedule a debounced write of the latest state. */
    save(state: PersistedState): void;
    /** Immediately write any pending state and await the write. */
    flush(): Promise<void>;
    private write;
    private empty;
}
//# sourceMappingURL=state.d.ts.map