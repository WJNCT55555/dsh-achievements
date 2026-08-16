/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */

import { useEffect, useState } from 'react'
import type { AchievementsSnapshot, AchievementView } from '@deepseek-ai/dsh-achievements/types'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { twemojiPath, TWEMOJI_BASE } from './twemoji.ts'
import type { AchievementsKey } from './locales.ts'
import styles from './AchievementsSection.module.css'

const CATEGORY_ORDER = ['getting-started', 'toolsmith', 'filecraft', 'orchestration', 'goals', 'skill', 'model', 'behavior', 'crossover', 'hidden'] as const

/** Rarity tiers in ascending difficulty for the by-rarity sort. */
const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'] as const

/** Gallery sort mode: by category (default) or by difficulty (rarity). */
type SortMode = 'category' | 'rarity'

/** Gallery status filter. */
type StatusFilter = 'all' | 'unlocked' | 'locked'

const CATEGORY_ICONS: Record<AchievementView['category'], string> = {
  'getting-started': '✦',
  toolsmith: '⚒',
  filecraft: '✎',
  orchestration: '✧',
  goals: '◎',
  skill: '⌘',
  model: '🧠',
  behavior: '🌱',
  crossover: '⟲',
  hidden: '◌',
}

const RARITY_ICONS: Record<AchievementView['rarity'], string> = {
  common: '○',
  rare: '◇',
  epic: '✦',
  legendary: '♛',
}

/** Injected dependencies of {@link AchievementsSection} (slot `inject`). */
export interface AchievementsSectionInjected {
  /** Remote-backed snapshot loader. */
  list: () => Promise<RemoteResult<AchievementsSnapshot>>
  /** Read the deep-insights opt-in state; absent when the host predates it. */
  deepState?: () => Promise<RemoteResult<{ enabled: boolean }>>
  /** Toggle the deep-insights opt-in; absent when the host predates it. */
  setDeepInsights?: (enabled: boolean) => Promise<RemoteResult<{ enabled: boolean }>>
}

/** Emoji icon via Twemoji CDN with a text fallback on load failure. */
function Icon({ icon }: { icon: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span>{icon}</span>
  return <img className={styles.iconImage} src={`${TWEMOJI_BASE}${twemojiPath(icon)}.svg`} alt={icon} loading="lazy" onError={() => { setFailed(true) }} />
}

function completionOf(current: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((current / total) * 100))
}

function statusMatches(a: AchievementView, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  return filter === 'unlocked' ? a.unlocked : !a.unlocked
}

/** One achievement card. */
function Row({ a, t }: { a: AchievementView; t: (key: AchievementsKey) => string }) {
  const hiddenLocked = a.hidden && !a.unlocked
  const deepLocked = a.deepLocked && !a.unlocked
  const name = hiddenLocked ? '？？？' : a.name
  const desc = hiddenLocked ? t('hidden') : (deepLocked ? t('deepLocked') : a.desc)
  const rarityClass = styles[`rarity-${a.rarity}`] ?? styles['rarity-common']
  const rowClass = `${styles.row} ${rarityClass} ${a.unlocked ? styles.done : ''} ${hiddenLocked || deepLocked || !a.unlocked ? styles.locked : ''}`
  const badgeClass = hiddenLocked
    ? styles['badge-locked']
    : (styles[`badge-${a.rarity}`] ?? styles['badge-common'])
  const progress = completionOf(a.progress.current, a.progress.target)
  const statusBadge = a.unlocked
    ? <span className={`${styles.badge} ${styles['badge-done']}`}>{t('done')}</span>
    : (deepLocked
      ? <span className={`${styles.badge} ${styles['badge-locked']}`}>{t('deepHint')}</span>
      : (a.progress.target > 1
        ? <span className={`${styles.badge} ${styles['badge-locked']}`}>{a.progress.current} / {a.progress.target}</span>
        : <span className={`${styles.badge} ${styles['badge-locked']}`}>{t('todo')}</span>))
  const bar = (!hiddenLocked && !deepLocked && a.progress.target > 1 && !a.unlocked)
    ? (
      <div className={styles.barWrap}>
        <div className={styles.bar} aria-hidden="true">
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.barLabel}><span>{t('progress')}</span><span>{a.progress.current} / {a.progress.target}</span></div>
      </div>
    )
    : null
  return (
    <article className={rowClass} data-rarity={a.rarity} data-unlocked={a.unlocked}>
      <div className={styles.icon} data-unlocked={a.unlocked}>
        {hiddenLocked ? <span>?</span> : <Icon icon={a.icon} />}
        {a.unlocked && <span className={styles.iconCheck} aria-hidden="true">✓</span>}
      </div>
      <div className={styles.main}>
        <div className={styles.rowTop}>
          <div className={styles.nameLine}>
            <span className={styles.name}>{name}</span>
            <span className={`${styles.badge} ${badgeClass}`}>
              {hiddenLocked ? t('hiddenDesc') : t(`rarity.${a.rarity}`)}
            </span>
          </div>
          {statusBadge}
        </div>
        <div className={styles.desc}>{desc}</div>
        {bar}
        {a.unlocked && <div className={styles.unlockedLine}><span>✓ {t('unlockedHint')}</span></div>}
      </div>
    </article>
  )
}

/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, deepState, setDeepInsights, t }: AchievementsSectionInjected & PropsLocale<'achievements'>) {
  const [snapshot, setSnapshot] = useState<AchievementsSnapshot | null>(null)
  const [mode, setMode] = useState<SortMode>('category')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [deepEnabled, setDeepEnabled] = useState(false)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    void list().then((result) => {
      if (alive && result.ok) setSnapshot(result.value)
    }).catch(() => {
      if (alive) setSnapshot(null)
    })
    // deepState is optional: hosts predating the deep-insights tier lack it.
    if (deepState !== undefined) {
      void deepState().then((result) => {
        if (alive && result.ok) setDeepEnabled(result.value.enabled)
      }).catch(() => {
        if (alive) setDeepEnabled(false)
      })
    }
    return () => {
      alive = false
    }
  }, [list, deepState])
  if (snapshot === null) {
    return <div className={styles.loading} role="status"><span className={styles.loadingSpinner} aria-hidden="true" />{t('loading')}</div>
  }

  const toggleDeep = (): void => {
    if (setDeepInsights === undefined) return
    void setDeepInsights(!deepEnabled).then((result) => {
      if (result.ok) setDeepEnabled(result.value.enabled)
    }).catch(() => {
      // The toggle is best-effort; keep the current state on failure.
    })
  }

  const unlocked = snapshot.unlocked
  const remaining = Math.max(0, snapshot.total - unlocked)
  const completion = completionOf(unlocked, snapshot.total)
  const visibleCount = snapshot.achievements.filter(a => statusMatches(a, status)).length
  const groups = mode === 'category'
    ? CATEGORY_ORDER.map(id => ({
      id,
      label: t(`cat.${id}`),
      icon: CATEGORY_ICONS[id],
      all: snapshot.achievements.filter(a => a.category === id),
    }))
    : RARITY_ORDER.map(id => ({
      id,
      label: t(`rarity.${id}`),
      icon: RARITY_ICONS[id],
      all: snapshot.achievements.filter(a => a.rarity === id),
    }))
  const visibleGroups = groups.map((group) => {
    const items = group.all.filter(a => statusMatches(a, status))
    const groupUnlocked = group.all.filter(a => a.unlocked).length
    return {
      ...group,
      items,
      groupUnlocked,
      groupCompletion: completionOf(groupUnlocked, group.all.length),
    }
  }).filter(group => group.items.length > 0)
  const activeGroup = visibleGroups.find(group => group.id === activeGroupId) ?? visibleGroups[0]

  return (
    <div className={styles.section}>
      <section className={styles.hero} aria-labelledby="achievements-overview-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroTop}>
          <div className={styles.heroIcon} aria-hidden="true">🏆</div>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>{t('kicker')}</div>
            <h2 className={styles.heroTitle} id="achievements-overview-title">{t('title')}</h2>
            <p className={styles.heroSubtitle}>{t('subtitle')}</p>
          </div>
          <div
            className={styles.ring}
            aria-label={`${completion}% ${t('complete')}`}
          >
            <svg className={styles.ringGraphic} viewBox="0 0 44 44" aria-hidden="true">
              <circle className={styles.ringTrack} cx="22" cy="22" r="19" />
              <circle className={styles.ringValue} cx="22" cy="22" r="19" pathLength="100" strokeDasharray={`${completion} 100`} />
            </svg>
            <div className={styles.ringInner}><strong>{completion}%</strong><span>{t('complete')}</span></div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><strong>{unlocked}</strong><span>{t('stats.unlocked')}</span></div>
          <div className={styles.stat}><strong>{snapshot.total}</strong><span>{t('stats.total')}</span></div>
          <div className={styles.stat}><strong>{remaining}</strong><span>{t('stats.remaining')}</span></div>
        </div>
        <div className={styles.heroBar} aria-hidden="true"><div className={styles.heroBarFill} style={{ width: `${completion}%` }} /></div>
      </section>

      <div className={styles.toolbar}>
        <div className={styles.toolbarCopy}>
          <span className={styles.toolbarLabel}>{t('browse')}</span>
          <span className={styles.toolbarCount}>{t('visibleCount', { count: visibleCount })}</span>
        </div>
        <div className={styles.controls}>
          <div className={styles.segmented} role="tablist" aria-label={t('sort.label')}>
            <button type="button" role="tab" aria-selected={mode === 'category'} className={`${styles.sortBtn} ${mode === 'category' ? styles.sortActive : ''}`} onClick={() => { setMode('category') }}>
              {t('sort.byCategory')}
            </button>
            <button type="button" role="tab" aria-selected={mode === 'rarity'} className={`${styles.sortBtn} ${mode === 'rarity' ? styles.sortActive : ''}`} onClick={() => { setMode('rarity') }}>
              {t('sort.byRarity')}
            </button>
          </div>
          <div className={styles.segmented} role="group" aria-label={t('filter.label')}>
            {(['all', 'unlocked', 'locked'] as const).map(value => (
              <button key={value} type="button" aria-pressed={status === value} className={`${styles.filterBtn} ${status === value ? styles.filterActive : ''}`} onClick={() => { setStatus(value) }}>
                {t(`filter.${value}`)}
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={deepEnabled} className={`${styles.deepBtn} ${deepEnabled ? styles.deepActive : ''}`} onClick={toggleDeep} title={t('settings.deepDesc')}>
            {t('settings.deepTitle')} · {deepEnabled ? t('settings.deepDisable') : t('settings.deepEnable')}
          </button>
        </div>
      </div>

      {activeGroup && (
        <div className={styles.archive}>
          <nav className={styles.rail} aria-label={mode === 'category' ? t('sort.byCategory') : t('sort.byRarity')}>
            <div className={styles.railHeader}>
              <span className={styles.railTitle}>{mode === 'category' ? t('sort.byCategory') : t('sort.byRarity')}</span>
              <span className={styles.railCount}>{visibleGroups.length}</span>
            </div>
            <div className={styles.railList}>
              {visibleGroups.map((group) => {
                const active = group.id === activeGroup.id
                return (
                  <button
                    key={group.id}
                    type="button"
                    className={`${styles.railItem} ${active ? styles.railItemActive : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => { setActiveGroupId(group.id) }}
                  >
                    <span className={styles.railIcon} aria-hidden="true">{group.icon}</span>
                    <span className={styles.railCopy}>
                      <strong>{group.label}</strong>
                      <small>{group.groupUnlocked} / {group.all.length}</small>
                    </span>
                    <span className={styles.railMeter} aria-hidden="true"><span style={{ width: `${group.groupCompletion}%` }} /></span>
                  </button>
                )
              })}
            </div>
          </nav>

          <section className={styles.ledger} aria-labelledby={`achievement-group-${activeGroup.id}`}>
            <div className={styles.ledgerHeader}>
              <div className={styles.groupHeading}>
                <span className={styles.groupIcon} aria-hidden="true">{activeGroup.icon}</span>
                <div>
                  <h3 className={styles.groupTitle} id={`achievement-group-${activeGroup.id}`}>{activeGroup.label}</h3>
                  <span className={styles.groupMeta}>{activeGroup.groupUnlocked} / {activeGroup.all.length} {t('stats.unlocked')}</span>
                </div>
              </div>
              <div className={styles.ledgerCompletion}>
                <strong>{activeGroup.groupCompletion}%</strong>
                <span>{t('complete')}</span>
              </div>
            </div>
            <div className={styles.groupProgress} aria-hidden="true"><div style={{ width: `${activeGroup.groupCompletion}%` }} /></div>
            <div className={styles.rows}>{activeGroup.items.map(a => <Row key={a.id} a={a} t={t} />)}</div>
          </section>
        </div>
      )}
      {visibleCount === 0 && <div className={styles.empty}>{t('empty')}</div>}
    </div>
  )
}
