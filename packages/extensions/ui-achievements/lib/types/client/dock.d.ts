/**
 * Achievements dock readout: an ambient one-line progress strip in the
 * composer dock, showing unlocked/total, the success streak, and the nearest
 * pending milestone. Reads the store snapshot fed by the apply-world poll.
 */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots';
import type { AchievementsState } from './store.ts';
/** Injected face of the dock readout. */
export interface DockInjected {
    useSnapshot: SnapshotSelectorHook<AchievementsState>;
}
/** The composer dock entry (renders nothing until the first poll lands). */
export declare function DockReadout({ useSnapshot, t }: DockInjected & PropsLocale<'achievements'>): import("react").JSX.Element | null;
//# sourceMappingURL=dock.d.ts.map