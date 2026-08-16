/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */
import type { AchievementsRates, AchievementsSnapshot, AchievementsTelemetry } from '@wjnct55555/dsh-achievements/types';
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
    /** Community unlock rates; absent when the host predates telemetry. */
    rates?: () => Promise<RemoteResult<AchievementsRates | null>>;
    /** Read the anonymous-telemetry opt-in; absent when the host predates telemetry. */
    telemetryState?: () => Promise<RemoteResult<AchievementsTelemetry>>;
    /** Toggle anonymous telemetry; absent when the host predates telemetry. */
    setTelemetry?: (enabled: boolean) => Promise<RemoteResult<AchievementsTelemetry>>;
}
/** Full settings-section gallery over the achievements Remote namespace. */
export declare function AchievementsSection({ list, deepState, setDeepInsights, rates, telemetryState, setTelemetry, t }: AchievementsSectionInjected & PropsLocale<'achievements'>): import("react").JSX.Element;
//# sourceMappingURL=AchievementsSection.d.ts.map