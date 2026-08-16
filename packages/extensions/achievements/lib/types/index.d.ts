/**
 * Achievements engine: a root-scoped Typert Remote service observing the agent
 * plane and folding observed activity into a durable, process-global state.
 * Counters, distinct sets, flags, and unlock timestamps are persisted to
 * `~/.agent-achievements/state.json` so progress survives restarts.
 *
 * Two privacy tiers:
 * - The base tier (always on) reads only leaf scalars — tool name, success
 *   flag, agent id, event kind, write/edit file paths, token counts. Message
 *   bodies, file contents, error details, and search results are never read.
 * - The deep tier (`deepInsights`, default OFF, opted in at first run via the
 *   user-questions UI) enables message-body regex matching and session-log
 *   history scanning for dedicated achievements. Deep tier matches bodies at
 *   runtime and persists only which achievement unlocked — never body text.
 * @module @wjnct55555/dsh-achievements
 */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { z } from 'zod';
import type { AchievementsDock, AchievementsSnapshot, RecentUnlock } from './types.ts';
export type * from './types.ts';
/** Config: the deep-insights opt-in and the state-file location. */
export declare const Config: z.ZodObject<{
    deepInsights: z.ZodDefault<z.ZodBoolean>;
    stateDir: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Achievements service: durable global observers, one-shot unlock queue, and read-only Remote surface. */
export declare class AchievementsService extends TypertRemoteService {
    static inject: string[];
    private readonly counters;
    private readonly distinct;
    private readonly flags;
    private readonly turnState;
    private readonly unlocked;
    private readonly unlockQueue;
    private readonly activeSubagents;
    private readonly seenUsage;
    private readonly store;
    private deepInsights;
    constructor(ctx: Context, config?: Partial<z.infer<typeof Config>>);
    /** Restore persisted state, then run the first-run deep-insights opt-in when applicable. */
    private restore;
    /** Turn on deep insights at runtime (from the settings toggle or the first-run ask). */
    private enableDeepInsights;
    /** Remote surface: read the deep-insights opt-in state. */
    deepState(): {
        enabled: boolean;
    };
    /** Remote surface: toggle deep insights from the settings panel. */
    setDeepInsights(enabled: boolean): {
        enabled: boolean;
    };
    /** The context this service was constructed with (retained for runtime wiring). */
    private ownCtx;
    /** Fold persisted state back into the in-memory containers. */
    private applyPersisted;
    /** Snapshot current state for persistence (deep bodies never included). */
    private snapshot;
    private scheduleSave;
    /** Track the number of available skills for the librarian achievement. */
    private trackSkills;
    /** Read the full catalog with live progress. */
    list(): AchievementsSnapshot;
    /** Drain and return newly unlocked achievements (consumes the queue). */
    recent(): {
        unlocks: RecentUnlock[];
    };
    /** Compact readout for the composer dock strip. */
    dock(): AchievementsDock;
    private viewOf;
    private bump;
    private addDistinct;
    private mark;
    private agentKey;
    private ruleMet;
    private maxLangCount;
    private progressOf;
    private checkAll;
    private turnFor;
    private seedSessions;
    /** Mark the dsh-deep-whale crossover achievement and count third-party plugins. */
    private detectDeepWhale;
    private attachListeners;
    /** Deep-tier listeners: message-body regex matches (runtime only, never stored). */
    private attachDeepListeners;
    /** One history scan over known sessions (deep tier): seed counters from past events. */
    private scanHistory;
    private registerTool;
}
export default AchievementsService;
//# sourceMappingURL=index.d.ts.map