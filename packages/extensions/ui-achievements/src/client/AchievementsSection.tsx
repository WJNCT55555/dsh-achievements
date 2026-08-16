/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders each achievement grouped by category with rarity-specific
 * styling, Twemoji icons, and progress bars.
 */

import { useEffect, useState } from 'react'
import type { AchievementsSnapshot, AchievementView } from '@deepseek-ai/dsh-achievements/types'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { twemojiPath, TWEMOJI_BASE } from './twemoji.ts'
import type { AchievementsKey } from './locales.ts'
import styles from './AchievementsSection.module.css'

const CATEGORY_ORDER = ['getting-started', 'toolsmith', 'filecraft', 'orchestration', 'goals', 'crossover', 'hidden'] as const

/** Rarity tiers in ascending difficulty for the by-rarity sort. */
const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'] as const

/** Gallery sort mode: by category (default) or by difficulty (rarity). */
type SortMode = 'category' | 'rarity'

/** Injected dependencies of {@link AchievementsSection} (slot `inject`). */
export interface AchievementsSectionInjected {
  /** Remote-backed snapshot loader. */
  list: () => Promise<RemoteResult<AchievementsSnapshot>>
}

/** Emoji icon via Twemoji CDN with a text fallback on load failure. */
function Icon({ icon }: { icon: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span>{icon}</span>
  return <img src={`${TWEMOJI_BASE}${twemojiPath(icon)}.svg`} alt={icon} loading="lazy" onError={() => { setFailed(true) }} />
}

/** One achievement row. */
function Row({ a, t }: { a: AchievementView; t: (key: AchievementsKey) => string }) {
  const hiddenLocked = a.hidden && !a.unlocked
  const name = hiddenLocked ? '？？？' : a.name
  const desc = hiddenLocked ? t('hidden') : a.desc
  const rarityClass = styles[`rarity-${a.rarity}`] ?? styles['rarity-common']
  const rowClass = `${styles.row} ${rarityClass} ${a.unlocked ? styles.done : ''} ${hiddenLocked || !a.unlocked ? styles.locked : ''}`
  const badgeClass = hiddenLocked
    ? styles['badge-locked']
    : (styles[`badge-${a.rarity}`] ?? styles['badge-common'])
  const statusBadge = a.unlocked
    ? <span className={`${styles.badge} ${styles['badge-done']}`}>{t('done')}</span>
    : (a.progress.target > 1
      ? <span className={`${styles.badge} ${styles['badge-locked']}`}>{a.progress.current} / {a.progress.target}</span>
      : <span className={`${styles.badge} ${styles['badge-locked']}`}>{t('todo')}</span>)
  const bar = (!hiddenLocked && a.progress.target > 1 && !a.unlocked)
    ? (
      <div className={styles.barWrap}>
        <div className={styles.bar}>
          <div
            className={styles.barFill}
            style={{ width: `${Math.min(100, Math.round((a.progress.current / a.progress.target) * 100))}%` }}
          />
        </div>
        <div className={styles.barLabel}><span>{t('progress')}</span><span>{a.progress.current} / {a.progress.target}</span></div>
      </div>
    )
    : null
  return (
    <div className={rowClass}>
      <div className={styles.icon}>{hiddenLocked ? <span>❓</span> : <Icon icon={a.icon} />}</div>
      <div className={styles.main}>
        <div className={styles.name}>
          {name}
          <span className={`${styles.badge} ${badgeClass}`}>
            {hiddenLocked ? t('hiddenDesc') : t(`rarity.${a.rarity}`)}
          </span>
          {statusBadge}
        </div>
        <div className={styles.desc}>{desc}</div>
        {bar}
      </div>
    </div>
  )
}

/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, t }: AchievementsSectionInjected & PropsLocale<'achievements'>) {
  const [snapshot, setSnapshot] = useState<AchievementsSnapshot | null>(null)
  const [mode, setMode] = useState<SortMode>('category')
  useEffect(() => {
    let alive = true
    void list().then((result) => {
      if (alive && result.ok) setSnapshot(result.value)
    }).catch(() => {
      if (alive) setSnapshot(null)
    })
    return () => {
      alive = false
    }
  }, [list])
  if (snapshot === null) return <div className={styles.section}>{t('loading')}</div>
  const toggle = (next: SortMode) => {
    setMode(next)
  }
  const byCategory = mode === 'category'
  return (
    <div className={styles.section}>
      <div className={styles.title}>🏆 {t('title')} {snapshot.unlocked} / {snapshot.total}</div>
      <div className={styles.sortRow} role="tablist" aria-label={t('sort.byCategory')}>
        <button
          type="button"
          role="tab"
          aria-selected={byCategory}
          className={`${styles.sortBtn} ${byCategory ? styles.sortActive : ''}`}
          onClick={() => { toggle('category') }}
        >
          {t('sort.byCategory')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!byCategory}
          className={`${styles.sortBtn} ${byCategory ? '' : styles.sortActive}`}
          onClick={() => { toggle('rarity') }}
        >
          {t('sort.byRarity')}
        </button>
      </div>
      {byCategory
        ? CATEGORY_ORDER.map((cat) => {
          const items = snapshot.achievements.filter(a => a.category === cat)
          if (items.length === 0) return null
          return (
            <div key={cat} className={styles.group}>
              <div className={styles.groupTitle}>{t(`cat.${cat}`)}</div>
              {items.map(a => <Row key={a.id} a={a} t={t} />)}
            </div>
          )
        })
        : RARITY_ORDER.map((rarity) => {
          const items = snapshot.achievements.filter(a => a.rarity === rarity)
          if (items.length === 0) return null
          return (
            <div key={rarity} className={styles.group}>
              <div className={styles.groupTitle}>{t(`rarity.${rarity}`)}</div>
              {items.map(a => <Row key={a.id} a={a} t={t} />)}
            </div>
          )
        })}
    </div>
  )
}
