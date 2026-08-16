/**
 * Achievements dock readout: an ambient one-line progress strip in the
 * composer dock, showing unlocked/total, the success streak, and the nearest
 * pending milestone. Reads the store snapshot fed by the apply-world poll.
 */

import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { AchievementsState } from './store.ts'
import styles from './dock.module.css'

/** Injected face of the dock readout. */
export interface DockInjected {
  useSnapshot: SnapshotSelectorHook<AchievementsState>
}

/** The composer dock entry (renders nothing until the first poll lands). */
export function DockReadout({ useSnapshot, t }: DockInjected & PropsLocale<'achievements'>) {
  const dock = useSnapshot(s => s.dock)
  if (dock === null) return null
  const combo = dock.streak >= 2 ? t('dock.combo', { count: dock.streak }) : ''
  const next = dock.next === null ? t('dock.complete') : t('dock.next', {
    name: dock.next.name,
    current: dock.next.current,
    target: dock.next.target,
  })
  return (
    <div className={styles.dock}>
      {t('dock.summary', { unlocked: dock.unlocked, total: dock.total })}
      {combo}
      {' · '}
      {next}
    </div>
  )
}
