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
 * @module @deepseek-ai/dsh-achievements/state
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
/** Current on-disk format version. */
export const STATE_SCHEMA_VERSION = 1;
/** Narrow a parsed JSON value to a plain object record. */
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** A file-backed state store with debounced writes. */
export class AchievementStateStore {
    filePath;
    debounceMs;
    writeTimer;
    pending;
    constructor(filePath, debounceMs = 500) {
        this.filePath = filePath;
        this.debounceMs = debounceMs;
    }
    /** Load and validate the persisted state; returns an empty baseline when absent or corrupt. */
    async load() {
        try {
            const raw = await readFile(this.filePath, 'utf8');
            const parsed = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null)
                return this.empty();
            const record = parsed;
            if (record['schemaVersion'] !== STATE_SCHEMA_VERSION)
                return this.empty();
            return {
                schemaVersion: STATE_SCHEMA_VERSION,
                counters: isRecord(record['counters']) ? record['counters'] : {},
                distinct: isRecord(record['distinct']) ? record['distinct'] : {},
                flags: Array.isArray(record['flags']) ? record['flags'] : [],
                unlocked: isRecord(record['unlocked']) ? record['unlocked'] : {},
            };
        }
        catch {
            return this.empty();
        }
    }
    /** Whether a state file already exists (first-run probe). */
    async exists() {
        try {
            await readFile(this.filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /** Schedule a debounced write of the latest state. */
    save(state) {
        this.pending = state;
        if (this.writeTimer !== undefined)
            return;
        this.writeTimer = setTimeout(() => { void this.flush(); }, this.debounceMs);
        // The timer keeps the process alive; unref so a quiet process can exit.
        this.writeTimer.unref();
    }
    /** Immediately write any pending state and await the write. */
    async flush() {
        if (this.writeTimer !== undefined) {
            clearTimeout(this.writeTimer);
            this.writeTimer = undefined;
        }
        const state = this.pending;
        if (state === undefined)
            return;
        this.pending = undefined;
        await this.write(state);
    }
    async write(state) {
        const json = JSON.stringify(state, null, 2);
        const tmp = `${this.filePath}.tmp`;
        try {
            await mkdir(dirname(this.filePath), { recursive: true });
            await writeFile(tmp, json, 'utf8');
            await rename(tmp, this.filePath);
        }
        catch {
            // Persistence is best-effort: a failed write must never crash the engine.
        }
    }
    empty() {
        return {
            schemaVersion: STATE_SCHEMA_VERSION,
            counters: {},
            distinct: {},
            flags: [],
            unlocked: {},
        };
    }
}
//# sourceMappingURL=state.js.map