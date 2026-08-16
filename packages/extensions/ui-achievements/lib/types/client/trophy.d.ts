/**
 * Achievements trophy: the sidebar footer action with an unread badge that
 * toggles the gallery overlay. Owner prop `wide` selects the labelled rail form.
 */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots';
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client';
import type { AchievementsState } from './store.ts';
/** Injected face of the trophy button. */
export interface TrophyInjected {
    useSnapshot: SnapshotSelectorHook<AchievementsState>;
    toggle: () => void;
}
/** The sidebar footer trophy entry. */
export declare function Trophy({ useSnapshot, toggle, wide, t }: TrophyInjected & SidebarFooterActionOwnerProps & PropsLocale<'achievements'>): import("react").JSX.Element;
//# sourceMappingURL=trophy.d.ts.map