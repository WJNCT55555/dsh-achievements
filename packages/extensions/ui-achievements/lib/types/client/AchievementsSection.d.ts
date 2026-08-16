/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */
import type { AchievementsSnapshot, AchievementsStats } from '@deepseek-ai/dsh-achievements/types';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
/** Injected dependencies of {@link AchievementsSection} (slot `inject`). */
export interface AchievementsSectionInjected {
    /** Remote-backed snapshot loader. */
    list: () => Promise<RemoteResult<AchievementsSnapshot>>;
    /** Read the deep-insights opt-in state; absent when the host predates it. */
    deepState?: () => Promise<RemoteResult<{
        enabled: boolean;
    }>>;
    /** Toggle the deep-insights opt-in; absent when the host predates it. */
    setDeepInsights?: (enabled: boolean) => Promise<RemoteResult<{
        enabled: boolean;
    }>>;
    /** Dashboard aggregates (tools + tokens); absent when the host predates it. */
    stats?: () => Promise<RemoteResult<AchievementsStats>>;
}
/** Full settings-section gallery over the achievements Remote namespace. */
export declare function AchievementsSection({ list, deepState, setDeepInsights, stats, t }: AchievementsSectionInjected & PropsLocale<'achievements'>): import("react").JSX.Element;
//# sourceMappingURL=AchievementsSection.d.ts.map