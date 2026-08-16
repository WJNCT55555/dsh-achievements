/**
 * Achievements trophy: the sidebar footer action with an unread badge that
 * toggles the gallery overlay. Owner prop `wide` selects the labelled rail form.
 */

import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { AchievementsState } from './store.ts'
import styles from './trophy.module.css'

/** Injected face of the trophy button. */
export interface TrophyInjected {
  useSnapshot: SnapshotSelectorHook<AchievementsState>
  toggle: () => void
}

/** The sidebar footer trophy entry. */
export function Trophy({ useSnapshot, toggle, wide, t }: TrophyInjected & SidebarFooterActionOwnerProps & PropsLocale<'achievements'>) {
  const newCount = useSnapshot(s => s.newCount)
  return (
    <button type="button" className={styles.trophy} onClick={toggle} title={t('nav')}>
      <span className={styles.icon}>🏆</span>
      {wide && <span className={styles.label}>{t('nav')}</span>}
      {newCount > 0 && <span className={styles.badge}>{newCount}</span>}
    </button>
  )
}
