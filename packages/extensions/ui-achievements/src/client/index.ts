/**
 * Achievements browser surface: the settings-section gallery, the trophy
 * footer action, the composer dock readout, and the trophy-toggled gallery
 * overlay plus unlock toast stack. The apply world polls the achievements
 * Remote (`recent` + `dock`) on a timer and feeds one shared store; components
 * read through the bound selector hook and write through the store actions.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ctx.remote merge (the achievements Remote namespace).
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the settings shell SlotMap merge ('settings.section').
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the layout shell SlotMap merge ('shell.overlay').
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: pulls the sidebar footer-action owner share ('sidebar.footer.action').
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
// Type-only: pulls the conversation dock owner share ('conversation.composer.dock').
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { AchievementsRates, AchievementsSnapshot, AchievementsStats, AchievementsTelemetry } from '@wjnct55555/dsh-achievements/types'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { AchievementsSection, type AchievementsSectionInjected } from './AchievementsSection.tsx'
import { DockReadout, type DockInjected } from './dock.tsx'
import { GalleryOverlay } from './gallery.tsx'
import { ToastStack, type ToastStackInjected } from './toast.tsx'
import { Trophy, type TrophyInjected } from './trophy.tsx'
import { AchievementsStore } from './store.ts'
import { en, zh, type AchievementsKey } from './locales.ts'

export type { AchievementsSectionInjected } from './AchievementsSection.tsx'
export type { AchievementsKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The achievements gallery copy. */
    achievements: AchievementsKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'achievements'

/** Poll cadence for the recent-unlock queue and dock readout. */
const POLL_MS = 3000

/** Required services: slots, Remote namespace, and copy (timer is optional). */
export const inject = ['slots', 'locale', 'remote', 'remote.achievements']

/**
 * Client plugin body: register the copy and the four surfaces, and start the
 * Remote poll that feeds the shared store.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-achievements: dictionaries')

  const store = new AchievementsStore()
  const useSnapshot = bindSnapshotSelector(store.store)
  const t = ctx.locale.bind(NS)
  const list = (): Promise<RemoteResult<AchievementsSnapshot>> => ctx.remote.achievements.list()
  // The deep-insights / stats / telemetry Remote methods may be absent on hosts
  // that predate them; keep the plugin applyable so the gallery still opens there.
  const deepRemote = (ctx.remote.achievements as unknown as {
    deepState?: () => Promise<RemoteResult<{ enabled: boolean }>>
    setDeepInsights?: (enabled: boolean) => Promise<RemoteResult<{ enabled: boolean }>>
    stats?: () => Promise<RemoteResult<AchievementsStats>>
    rates?: () => Promise<RemoteResult<AchievementsRates | null>>
    telemetryState?: () => Promise<RemoteResult<AchievementsTelemetry>>
    setTelemetry?: (enabled: boolean) => Promise<RemoteResult<AchievementsTelemetry>>
  })
  const deepState = deepRemote.deepState
  const setDeepInsights = deepRemote.setDeepInsights
  const stats = deepRemote.stats
  const rates = deepRemote.rates
  const telemetryState = deepRemote.telemetryState
  const setTelemetry = deepRemote.setTelemetry

  const poll = async (): Promise<void> => {
    const recent = await ctx.remote.achievements.recent()
    const dock = await ctx.remote.achievements.dock()
    if (recent.ok && dock.ok) {
      store.ingest(dock.value, recent.value.unlocks)
    }
    store.prune()
  }
  // The timer drives the poll; every surface re-renders from the store.
  const timer = ctx.get('timer') as { interval: (cb: () => void, ms: number) => () => void } | undefined
  if (timer !== undefined) {
    ctx.effect(() => timer.interval(() => { void poll() }, POLL_MS), 'ui-achievements: remote poll')
  }
  void poll()

  const injected = (): AchievementsSectionInjected => ({
    list,
    ...deepState !== undefined ? { deepState } : {},
    ...setDeepInsights !== undefined ? { setDeepInsights } : {},
    ...stats !== undefined ? { stats } : {},
    ...rates !== undefined ? { rates } : {},
    ...telemetryState !== undefined ? { telemetryState } : {},
    ...setTelemetry !== undefined ? { setTelemetry } : {},
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'achievements',
    order: 30,
    label: () => t('nav'),
    locale: NS,
    inject: injected,
  }, AchievementsSection))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'achievements-toast',
    order: 100,
    locale: NS,
    inject: (): ToastStackInjected => ({ useSnapshot, dismiss: (clientAt) => { store.dismiss(clientAt) } }),
  }, ToastStack))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'achievements-gallery',
    order: 101,
    locale: NS,
    inject: () => ({
      useSnapshot,
      close: () => { store.closeGallery() },
      list,
      ...deepState !== undefined ? { deepState } : {},
      ...setDeepInsights !== undefined ? { setDeepInsights } : {},
      ...stats !== undefined ? { stats } : {},
      ...rates !== undefined ? { rates } : {},
      ...telemetryState !== undefined ? { telemetryState } : {},
      ...setTelemetry !== undefined ? { setTelemetry } : {},
    }),
  }, GalleryOverlay))

  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'achievements-trophy',
    order: 5,
    locale: NS,
    inject: (): TrophyInjected => ({ useSnapshot, toggle: () => { store.toggleGallery() } }),
  }, Trophy))

  ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'achievements',
    order: 1,
    locale: NS,
    inject: (): DockInjected => ({ useSnapshot }),
  }, DockReadout))
}
