/**
 * Achievements toast stack: transient unlock cards with rarity styling and a
 * confetti burst for epic/legendary unlocks. Rendered in `shell.overlay`; the
 * layer is click-through, so only the cards opt back into pointer events.
 */

import type { AchievementRarity } from '@wjnct55555/dsh-achievements/types'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { AchievementsKey } from './locales.ts'
import type { AchievementToast, AchievementsState } from './store.ts'
import styles from './toast.module.css'

const RARITY_LABEL: Record<AchievementRarity, AchievementsKey> = {
  common: 'rarity.common',
  rare: 'rarity.rare',
  epic: 'rarity.epic',
  legendary: 'rarity.legendary',
}

/** Confetti piece palette (rarity-agnostic, reused by the toast burst). */
const CONFETTI_COLORS = ['#60a5fa', '#a78bfa', '#fbbf24', '#4ade80', '#f87171', '#22d3ee', '#f472b6', '#facc15']

/** One transient unlock card. */
function Toast({ toast, t, onDismiss }: {
  toast: AchievementToast
  t: (key: AchievementsKey) => string
  onDismiss: () => void
}) {
  const celebratory = toast.rarity === 'epic' || toast.rarity === 'legendary'
  return (
    <>
      {celebratory && <Confetti />}
      <div className={`${styles.toast} ${styles[`rarity-${toast.rarity}`]}`} role="status">
        <div className={styles.icon}>{toast.icon}</div>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>{t('toast.sub')}</div>
          <div className={styles.title}>{toast.name}</div>
          <div className={styles.sub}>{t(RARITY_LABEL[toast.rarity])}</div>
        </div>
        <button type="button" className={styles.close} onClick={onDismiss} aria-label={t('toast.close')}>×</button>
      </div>
    </>
  )
}

/** A one-shot confetti burst (pure CSS keyframes). */
function Confetti() {
  return (
    <div className={styles.confetti}>
      {Array.from({ length: 60 }, (_, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{
            left: `${(i * 37) % 101}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 12) * 0.05}s`,
            animationDuration: `${2.4 + (i % 9) * 0.16}s`,
            transform: `rotate(${(i * 47) % 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

/** Injected face of the toast stack. */
export interface ToastStackInjected {
  useSnapshot: SnapshotSelectorHook<AchievementsState>
  dismiss: (clientAt: number) => void
}

/** The toast stack entry (renders nothing when no toast is live). */
export function ToastStack({ useSnapshot, dismiss, t }: ToastStackInjected & PropsLocale<'achievements'>) {
  const toasts = useSnapshot(s => s.toasts)
  if (toasts.length === 0) return null
  return (
    <div className={styles.stack}>
      {toasts.map(toast => (
        <Toast key={toast.clientAt} toast={toast} t={t} onDismiss={() => { dismiss(toast.clientAt) }} />
      ))}
    </div>
  )
}
