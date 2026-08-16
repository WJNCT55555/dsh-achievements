/**
 * Achievements gallery overlay: the trophy-toggled full gallery in
 * `shell.overlay`. Reuses the settings-section gallery component; the backdrop
 * opts back into pointer events to trap the click-away.
 */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots';
import type { AchievementsSectionInjected } from './AchievementsSection.tsx';
import type { AchievementsState } from './store.ts';
/** Injected face of the gallery overlay. */
export interface GalleryOverlayInjected extends AchievementsSectionInjected {
    useSnapshot: SnapshotSelectorHook<AchievementsState>;
    close: () => void;
}
/** The trophy-toggled gallery overlay (renders nothing while closed). */
export declare function GalleryOverlay({ useSnapshot, close, list, deepState, setDeepInsights, stats, rates, telemetryState, setTelemetry, t }: GalleryOverlayInjected & PropsLocale<'achievements'>): import("react").JSX.Element | null;
//# sourceMappingURL=gallery.d.ts.map