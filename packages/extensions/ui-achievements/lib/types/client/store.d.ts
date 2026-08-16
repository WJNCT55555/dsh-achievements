/**
 * Achievements client store: transient viewing state shared across the toast
 * stack, sidebar trophy, gallery overlay, and composer dock. The Host stays
 * the single fact source — the apply world polls the achievements Remote and
 * feeds this store, components read through the bound selector hook.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { AchievementsDock, RecentUnlock } from '@deepseek-ai/dsh-achievements/types';
/** One client-side toast: the host unlock plus its local arrival time. */
export interface AchievementToast extends RecentUnlock {
    readonly clientAt: number;
}
/** Achievements viewing state (mutable inside store drafts). */
export interface AchievementsState {
    dock: AchievementsDock | null;
    toasts: AchievementToast[];
    newCount: number;
    galleryOpen: boolean;
}
/** The achievements client controller (one per client plugin apply). */
export declare class AchievementsStore {
    /** The snapshot the surfaces render from (uSES-safe store). */
    readonly store: SnapshotStore<AchievementsState>;
    /** Fold a host dock snapshot and a batch of fresh unlocks into the store. */
    ingest(dock: AchievementsDock, unlocks: readonly RecentUnlock[]): void;
    /** Drop every toast whose TTL has elapsed (the poll tick prunes them). */
    prune(): void;
    /** Remove one toast by identity (dismiss button). */
    dismiss(clientAt: number): void;
    /** Toggle the gallery overlay; opening it clears the unread badge. */
    toggleGallery(): void;
    /** Close the gallery overlay. */
    closeGallery(): void;
}
//# sourceMappingURL=store.d.ts.map