/**
 * Achievements browser surface: the settings-section gallery, the trophy
 * footer action, the composer dock readout, and the trophy-toggled gallery
 * overlay plus unlock toast stack. The apply world polls the achievements
 * Remote (`recent` + `dock`) on a timer and feeds one shared store; components
 * read through the bound selector hook and write through the store actions.
 */
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react';
import { AchievementsSection } from "./AchievementsSection.js";
import { DockReadout } from "./dock.js";
import { GalleryOverlay } from "./gallery.js";
import { ToastStack } from "./toast.js";
import { Trophy } from "./trophy.js";
import { AchievementsStore } from "./store.js";
import { en, zh } from "./locales.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'achievements';
/** Poll cadence for the recent-unlock queue and dock readout. */
const POLL_MS = 3000;
/** Required services: slots, Remote namespace, and copy (timer is optional). */
export const inject = ['slots', 'locale', 'remote', 'remote.achievements'];
/**
 * Client plugin body: register the copy and the four surfaces, and start the
 * Remote poll that feeds the shared store.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-achievements: dictionaries');
    const store = new AchievementsStore();
    const useSnapshot = bindSnapshotSelector(store.store);
    const t = ctx.locale.bind(NS);
    const list = () => ctx.remote.achievements.list();
    // The deep-insights Remote methods may be absent on hosts that predate them;
    // keep the plugin applyable so the gallery still opens there.
    const deepRemote = ctx.remote.achievements;
    const deepState = deepRemote.deepState;
    const setDeepInsights = deepRemote.setDeepInsights;
    const poll = async () => {
        const recent = await ctx.remote.achievements.recent();
        const dock = await ctx.remote.achievements.dock();
        if (recent.ok && dock.ok) {
            store.ingest(dock.value, recent.value.unlocks);
        }
        store.prune();
    };
    // The timer drives the poll; every surface re-renders from the store.
    const timer = ctx.get('timer');
    if (timer !== undefined) {
        ctx.effect(() => timer.interval(() => { void poll(); }, POLL_MS), 'ui-achievements: remote poll');
    }
    void poll();
    const injected = () => ({
        list,
        ...deepState !== undefined ? { deepState } : {},
        ...setDeepInsights !== undefined ? { setDeepInsights } : {},
    });
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'achievements',
        order: 30,
        label: () => t('nav'),
        locale: NS,
        inject: injected,
    }, AchievementsSection));
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'achievements-toast',
        order: 100,
        locale: NS,
        inject: () => ({ useSnapshot, dismiss: (clientAt) => { store.dismiss(clientAt); } }),
    }, ToastStack));
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'achievements-gallery',
        order: 101,
        locale: NS,
        inject: () => ({
            useSnapshot,
            close: () => { store.closeGallery(); },
            list,
            ...deepState !== undefined ? { deepState } : {},
            ...setDeepInsights !== undefined ? { setDeepInsights } : {},
        }),
    }, GalleryOverlay));
    ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'achievements-trophy',
        order: 5,
        locale: NS,
        inject: () => ({ useSnapshot, toggle: () => { store.toggleGallery(); } }),
    }, Trophy));
    ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
        name: 'conversation.composer.dock',
        id: 'achievements',
        order: 1,
        locale: NS,
        inject: () => ({ useSnapshot }),
    }, DockReadout));
}
//# sourceMappingURL=index.js.map