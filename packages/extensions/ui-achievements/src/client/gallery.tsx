/**
 * Achievements gallery overlay: the trophy-toggled full gallery in
 * `shell.overlay`. Reuses the settings-section gallery component; the backdrop
 * opts back into pointer events to trap the click-away.
 */

import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import { AchievementsSection } from './AchievementsSection.tsx'
import type { AchievementsSectionInjected } from './AchievementsSection.tsx'
import type { AchievementsState } from './store.ts'
import styles from './gallery.module.css'

/** Injected face of the gallery overlay. */
export interface GalleryOverlayInjected extends AchievementsSectionInjected {
  useSnapshot: SnapshotSelectorHook<AchievementsState>
  close: () => void
}

/** The trophy-toggled gallery overlay (renders nothing while closed). */
export function GalleryOverlay({ useSnapshot, close, list, t }: GalleryOverlayInjected & PropsLocale<'achievements'>) {
  const open = useSnapshot(s => s.galleryOpen)
  if (!open) return null
  return (
    <div className={styles.backdrop} onClick={close}>
      <div className={styles.panel} onClick={(e) => { e.stopPropagation() }}>
        <div className={styles.head}>
          <span className={styles.title}>🏆 {t('title')}</span>
          <button type="button" className={styles.close} onClick={close} aria-label={t('gallery.close')}>×</button>
        </div>
        <AchievementsSection list={list} t={t} />
      </div>
    </div>
  )
}
