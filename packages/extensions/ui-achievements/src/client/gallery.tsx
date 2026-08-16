/**
 * Achievements gallery overlay: the trophy-toggled full gallery in
 * `shell.overlay`. Reuses the settings-section gallery component; the backdrop
 * opts back into pointer events to trap the click-away.
 */

import { useEffect } from 'react'
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
export function GalleryOverlay({ useSnapshot, close, list, deepState, setDeepInsights, t }: GalleryOverlayInjected & PropsLocale<'achievements'>) {
  const open = useSnapshot(s => s.galleryOpen)
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [close, open])
  if (!open) return null
  return (
    <div className={styles.backdrop} onClick={close}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="achievements-gallery-title" onClick={(e) => { e.stopPropagation() }}>
        <div className={styles.head}>
          <div className={styles.heading}>
            <span className={styles.headingIcon} aria-hidden="true">🏆</span>
            <div><span className={styles.kicker}>{t('kicker')}</span><span className={styles.title} id="achievements-gallery-title">{t('title')}</span></div>
          </div>
          <button type="button" className={styles.close} onClick={close} aria-label={t('gallery.close')}>×</button>
        </div>
        <AchievementsSection
          list={list}
          {...deepState !== undefined ? { deepState } : {}}
          {...setDeepInsights !== undefined ? { setDeepInsights } : {}}
          t={t}
        />
      </div>
    </div>
  )
}
