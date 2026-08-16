/**
 * Pure wire types of the achievements domain: the achievement definition
 * vocabulary, per-achievement runtime projection, and the two client-facing
 * snapshots. Free of host-side imports (cordis events, dsh-agent, the service)
 * so the `./types` subpath serves client aggregates without dragging the host
 * Context merge into a browser program.
 * @module @deepseek-ai/dsh-achievements/types
 */
/** Stable rarity tier, mapped to a visual treatment by the client. */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
/** Coarse grouping for the gallery; `hidden` holds the secret achievements. */
export type AchievementCategory = 'getting-started' | 'toolsmith' | 'filecraft' | 'orchestration' | 'goals' | 'skill' | 'model' | 'behavior' | 'crossover' | 'hidden';
/** Point-in-time progress of one achievement's rule. */
export interface AchievementProgress {
    /** Current observed value, clamped to `target`. */
    readonly current: number;
    /** Threshold at which the achievement unlocks. */
    readonly target: number;
}
/** One achievement as the client renders it. */
export interface AchievementView {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** Emoji icon rendered through the Twemoji CDN with a text fallback. */
    readonly icon: string;
    readonly category: AchievementCategory;
    readonly rarity: AchievementRarity;
    /** Secret achievements hide their name/desc until unlocked. */
    readonly hidden: boolean;
    /** Requires the deep-insights opt-in. */
    readonly deep: boolean;
    /** True while deep insights are off: the achievement is not yet eligible. */
    readonly deepLocked: boolean;
    readonly unlocked: boolean;
    /** Epoch ms of the unlock, or null while locked. */
    readonly unlockedAt: number | null;
    readonly progress: AchievementProgress;
}
/** Full achievement catalog plus the current unlocked count. */
export interface AchievementsSnapshot {
    readonly total: number;
    readonly unlocked: number;
    readonly achievements: readonly AchievementView[];
}
/** Dashboard aggregates served by the `stats` Remote. */
export interface AchievementsStats {
    /** Most-used tools, descending, capped at 8. */
    readonly tools: ReadonlyArray<{
        readonly name: string;
        readonly count: number;
    }>;
    /** Token usage buckets (leaf counts). */
    readonly tokens: {
        readonly output: number;
        readonly cacheRead: number;
        readonly uncached: number;
        readonly reasoning: number;
    };
}
/** One freshly unlocked achievement drained from the recent queue. */
export interface RecentUnlock {
    readonly id: string;
    readonly name: string;
    readonly rarity: AchievementRarity;
    readonly icon: string;
    readonly at: number;
}
/** Ambient dock readout: counts, current success streak, and the nearest pending milestone. */
export interface AchievementsDock {
    readonly unlocked: number;
    readonly total: number;
    /** Consecutive successful tool calls. */
    readonly streak: number;
    readonly next: {
        readonly name: string;
        readonly icon: string;
        readonly current: number;
        readonly target: number;
    } | null;
}
//# sourceMappingURL=types.d.ts.map