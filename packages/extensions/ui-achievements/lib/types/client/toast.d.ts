/**
 * Achievements toast stack: transient unlock cards with rarity styling and a
 * confetti burst for epic/legendary unlocks. Rendered in `shell.overlay`; the
 * layer is click-through, so only the cards opt back into pointer events.
 */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots';
import type { AchievementsState } from './store.ts';
/** Injected face of the toast stack. */
export interface ToastStackInjected {
    useSnapshot: SnapshotSelectorHook<AchievementsState>;
    dismiss: (clientAt: number) => void;
}
/** The toast stack entry (renders nothing when no toast is live). */
export declare function ToastStack({ useSnapshot, dismiss, t }: ToastStackInjected & PropsLocale<'achievements'>): import("react").JSX.Element | null;
//# sourceMappingURL=toast.d.ts.map