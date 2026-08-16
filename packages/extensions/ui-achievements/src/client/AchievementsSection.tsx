/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */

import { useEffect, useState } from 'react'
import type { AchievementsSnapshot, AchievementsStats, AchievementView } from '@deepseek-ai/dsh-achievements/types'
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

const PROGRESS_TICKS = Array.from({ length: 9 }, (_, index) => index)

/** Injected dependencies of {@link AchievementsSection} (slot `inject`). */
export interface AchievementsSectionInjected {
  /** Remote-backed snapshot loader. */
  list: () => Promise<RemoteResult<AchievementsSnapshot>>
  /** Read the deep-insights opt-in state; absent when the host predates it. */
  deepState?: () => Promise<RemoteResult<{ enabled: boolean }>>
  /** Toggle the deep-insights opt-in; absent when the host predates it. */
  setDeepInsights?: (enabled: boolean) => Promise<RemoteResult<{ enabled: boolean }>>
  /** Dashboard aggregates (tools + tokens); absent when the host predates it. */
  stats?: () => Promise<RemoteResult<AchievementsStats>>
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
          <span className={styles.barTicks}>{PROGRESS_TICKS.map(tick => <i key={tick} />)}</span>
        </div>
        <div className={styles.barLabel}><span>{t('progress')}</span><span>{a.progress.current} / {a.progress.target}</span></div>
      </div>
    )
    : null
  return (
    <article className={rowClass} data-rarity={a.rarity} data-unlocked={a.unlocked}>
      <span className={styles.rowFrame} aria-hidden="true" />
      <span className={styles.recordCode}>[ ACHV::{a.id.toUpperCase()} ]</span>
      <div className={styles.icon} data-unlocked={a.unlocked}>
        {hiddenLocked ? <span>?</span> : <Icon icon={a.icon} />}
        {a.unlocked && <span className={styles.iconCheck} aria-hidden="true">✓</span>}
      </div>
      <div className={styles.main}>
        <div className={styles.rowTop}>
          <div className={styles.titleBlock}>
            <div className={styles.nameLine}>
              <span className={styles.name}>{name}</span>
              <span className={`${styles.badge} ${badgeClass}`}>
                {hiddenLocked ? t('hiddenDesc') : t(`rarity.${a.rarity}`)}
              </span>
            </div>
            <div className={styles.desc}>{desc}</div>
          </div>
          {statusBadge}
        </div>
        {bar}
        {a.unlocked && <div className={styles.unlockedLine}><span>✓ {t('unlockedHint')}</span></div>}
      </div>
    </article>
  )
}

/** One ring segment of a donut chart: value + color. */
interface DonutSlice {
  label: string
  value: number
  color: string
}

/** Hollow donut chart (SVG) with a center total. */
function Donut({ slices, center, t }: { slices: readonly DonutSlice[]; center: string; t: (key: AchievementsKey) => string }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  if (total <= 0) {
    return (
      <div className={styles.donutEmpty} role="img" aria-label={t('chart.empty')}>
        <span>{t('chart.empty')}</span>
      </div>
    )
  }
  const radius = 15.9
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className={styles.donutWrap}>
      <svg className={styles.donut} viewBox="0 0 42 42" aria-hidden="true">
        <circle className={styles.donutTrack} cx="21" cy="21" r={radius} />
        {slices.map((slice) => {
          const fraction = slice.value / total
          const dash = fraction * circumference
          const el = (
            <circle
              key={slice.label}
              className={styles.donutSlice}
              cx="21"
              cy="21"
              r={radius}
              stroke={slice.color}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className={styles.donutCenter}><strong>{center}</strong><span>{t('chart.total')}</span></div>
    </div>
  )
}

/** Horizontal terminal bar row (label + filled bar + value). */
function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={styles.hbarRow}>
      <span className={styles.hbarLabel} title={label}>{label}</span>
      <div className={styles.hbarTrack} aria-hidden="true">
        <div className={styles.hbarFill} style={{ width: `${width}%`, background: color }} />
      </div>
      <span className={styles.hbarValue}>{value}</span>
    </div>
  )
}

/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, deepState, setDeepInsights, stats, t }: AchievementsSectionInjected & PropsLocale<'achievements'>) {
  const [snapshot, setSnapshot] = useState<AchievementsSnapshot | null>(null)
  const [statsData, setStatsData] = useState<AchievementsStats | null>(null)
  const [mode, setMode] = useState<SortMode>('category')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [deepEnabled, setDeepEnabled] = useState(false)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  useEffect(() => {
    let alive = true
    setLoadError(null)
    void Promise.resolve().then(list).then((result) => {
      if (!alive) return
      if (result.ok) setSnapshot(result.value)
      else setLoadError(result.error.message)
    }).catch(() => {
      if (alive) setLoadError(t('loadError'))
    })
    // deepState is optional: hosts predating the deep-insights tier lack it.
    if (deepState !== undefined) {
      void Promise.resolve().then(deepState).then((result) => {
        if (alive && result.ok) setDeepEnabled(result.value.enabled)
      }).catch(() => {
        if (alive) setDeepEnabled(false)
      })
    }
    // stats is optional: hosts predating the dashboard aggregates lack it.
    if (stats !== undefined) {
      void Promise.resolve().then(stats).then((result) => {
        if (alive && result.ok) setStatsData(result.value)
      }).catch(() => {
        if (alive) setStatsData(null)
      })
    }
    return () => {
      alive = false
    }
  }, [list, deepState, stats, reloadToken, t])
  if (snapshot === null) {
    if (loadError !== null) {
      return (
        <div className={styles.loadFailure} role="alert">
          <span className={styles.loadFailureIcon} aria-hidden="true">!</span>
          <div>
            <strong>{t('loadError')}</strong>
            <p>{loadError}</p>
          </div>
          <button type="button" onClick={() => { setReloadToken(value => value + 1) }}>{t('retry')}</button>
        </div>
      )
    }
    return <div className={styles.loading} role="status"><span className={styles.loadingSpinner} aria-hidden="true" />{t('loading')}</div>
  }

  const toggleDeep = (): void => {
    if (setDeepInsights === undefined) return
    void Promise.resolve().then(() => setDeepInsights(!deepEnabled)).then((result) => {
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

  // ── dashboard charts data ───────────────────────────────────────
  const rarityColors: Record<AchievementView['rarity'], string> = {
    common: '#e8f5ef',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fbbf24',
  }
  const raritySlices: DonutSlice[] = (RARITY_ORDER as readonly AchievementView['rarity'][]).map(rarity => ({
    label: t(`rarity.${rarity}`),
    value: snapshot.achievements.filter(a => a.rarity === rarity && a.unlocked).length,
    color: rarityColors[rarity],
  }))
  const catColors: Record<AchievementView['category'], string> = {
    'getting-started': '#10b981',
    toolsmith: '#34d399',
    filecraft: '#2dd4bf',
    orchestration: '#5eead4',
    goals: '#a7f3d0',
    skill: '#6ee7b7',
    model: '#a78bfa',
    behavior: '#c4b5fd',
    crossover: '#fbbf24',
    hidden: '#94a3b8',
  }
  const catSlices: DonutSlice[] = CATEGORY_ORDER
    .filter(cat => cat !== 'hidden')
    .map(cat => ({
      label: t(`cat.${cat}`),
      value: snapshot.achievements.filter(a => a.category === cat && a.unlocked).length,
      color: catColors[cat],
    }))
  const tokenBuckets: DonutSlice[] = (statsData?.tokens
    ? [
      { label: t('chart.tokens.output'), value: statsData.tokens.output, color: '#10b981' },
      { label: t('chart.tokens.cache'), value: statsData.tokens.cacheRead, color: '#2dd4bf' },
      { label: t('chart.tokens.uncached'), value: statsData.tokens.uncached, color: '#a78bfa' },
      { label: t('chart.tokens.reasoning'), value: statsData.tokens.reasoning, color: '#fbbf24' },
    ]
    : [])
  const toolMax = (statsData?.tools[0]?.count ?? 0)
  const toolBars = statsData?.tools ?? []

  return (
    <div className={styles.section}>
      <section className={styles.hero} aria-labelledby="achievements-overview-title">
        <span className={styles.heroBadge} aria-hidden="true">[{t('title')}]</span>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroTop}>
          <div className={styles.heroIcon} aria-hidden="true">&gt;_</div>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>{t('kicker')}</div>
            <h2 className={styles.heroTitle} id="achievements-overview-title">{t('title')}</h2>
            <p className={styles.heroSubtitle}>{t('subtitle')}</p>
          </div>
          <div className={styles.heroPct} aria-label={`${completion}% ${t('complete')}`}>
            <strong>{completion}%</strong>
            <span>{t('complete')}</span>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><strong>{unlocked}</strong><span>{t('stats.unlocked')}</span></div>
          <div className={styles.stat}><strong>{snapshot.total}</strong><span>{t('stats.total')}</span></div>
          <div className={styles.stat}><strong>{remaining}</strong><span>{t('stats.remaining')}</span></div>
        </div>
        <div className={styles.rarityBar} role="img" aria-label={`${t('chart.rarity')}: ${unlocked}/${snapshot.total}`}>
          {raritySlices.map(slice => (
            <div
              key={slice.label}
              className={styles.rarityBarSegment}
              style={{ width: `${(slice.value / snapshot.total) * 100}%`, background: slice.color }}
              title={`${slice.label}: ${slice.value}`}
            />
          ))}
        </div>
      </section>

      <div className={styles.charts} role="group" aria-label={t('chart.title')}>
        <section className={styles.chart} aria-labelledby="chart-category-title">
          <h4 className={styles.chartBadge} id="chart-category-title">[{t('chart.category')}]</h4>
          <Donut slices={catSlices} center={String(unlocked)} t={t} />
        </section>

        <section className={styles.chart} aria-labelledby="chart-tokens-title">
          <h4 className={styles.chartBadge} id="chart-tokens-title">[{t('chart.tokens')}]</h4>
          {tokenBuckets.length > 0
            ? <Donut slices={tokenBuckets} center={String(Math.round(tokenBuckets.reduce((s, x) => s + x.value, 0)))} t={t} />
            : <div className={styles.chartEmpty}>{t('chart.empty')}</div>}
        </section>

        <section className={styles.chart} aria-labelledby="chart-tools-title">
          <h4 className={styles.chartBadge} id="chart-tools-title">[{t('chart.tools')}]</h4>
          {toolBars.length > 0
            ? <div className={styles.chartBars}>{toolBars.map(tool => (
              <HBar key={tool.name} label={tool.name} value={tool.count} max={toolMax} color="#10b981" />
            ))}</div>
            : <div className={styles.chartEmpty}>{t('chart.empty')}</div>}
        </section>
      </div>

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
                    data-group={group.id}
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

          <section className={styles.ledger} data-group={activeGroup.id} aria-labelledby={`achievement-group-${activeGroup.id}`}>
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
