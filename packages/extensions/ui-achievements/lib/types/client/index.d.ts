/**
 * Achievements browser surface: the settings-section gallery, the trophy
 * footer action, the composer dock readout, and the trophy-toggled gallery
 * overlay plus unlock toast stack. The apply world polls the achievements
 * Remote (`recent` + `dock`) on a timer and feeds one shared store; components
 * read through the bound selector hook and write through the store actions.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type AchievementsKey } from './locales.ts';
export type { AchievementsSectionInjected } from './AchievementsSection.tsx';
export type { AchievementsKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The achievements gallery copy. */
        achievements: AchievementsKey;
    }
}
/** Required services: slots, Remote namespace, and copy (timer is optional). */
export declare const inject: string[];
/**
 * Client plugin body: register the copy and the four surfaces, and start the
 * Remote poll that feeds the shared store.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map