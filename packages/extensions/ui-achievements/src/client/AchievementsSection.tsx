/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */

import { useEffect, useState } from 'react'
import type { AchievementsHeatmap, AchievementsRates, AchievementsSnapshot, AchievementsTelemetry, AchievementView } from '@wjnct55555/dsh-achievements/types'
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
  /** Community unlock rates; absent when the host predates telemetry. */
  rates?: () => Promise<RemoteResult<AchievementsRates | null>>
  /** Read the anonymous-telemetry opt-in; absent when the host predates telemetry. */
  telemetryState?: () => Promise<RemoteResult<AchievementsTelemetry>>
  /** Toggle anonymous telemetry; absent when the host predates telemetry. */
  setTelemetry?: (enabled: boolean) => Promise<RemoteResult<AchievementsTelemetry>>
  /** Wipe all progress; absent when the host predates it. */
  clear?: () => Promise<RemoteResult<AchievementsSnapshot>>
  /** Current-month activity heatmap; absent when the host predates it. */
  heatmap?: () => Promise<RemoteResult<AchievementsHeatmap>>
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
function Row({ a, t, pct, hasRates }: {
  a: AchievementView
  t: (key: AchievementsKey, params?: Record<string, string | number>) => string
  pct: number | undefined
  hasRates: boolean
}) {
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
        {pct !== undefined
          ? <div className={styles.rateLine} data-rarity={a.rarity}>{t('rate.users', { pct })}</div>
          : hasRates && <div className={styles.rateLine} data-rarity={a.rarity}>{t('rate.noData')}</div>}
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
  // Larger radius with a thicker stroke leaves a smaller center hole.
  const radius = 17.4
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

/** Current-month activity heatmap: a Monday-first calendar grid tinted by daily count. */
function emptyCurrentMonthHeatmap(): AchievementsHeatmap {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const daysInMonth = new Date(year, month, 0).getDate()
  return {
    year,
    month,
    days: Array.from({ length: daysInMonth }, (_, index) => ({
      date: `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
      count: 0,
    })),
  }
}

type HeatmapStatus = 'loading' | 'ready' | 'missing' | 'error'

function Heatmap({ data, status, t }: { data: AchievementsHeatmap; status: HeatmapStatus; t: (key: AchievementsKey) => string }) {
  const { year, month, days } = data
  const countByDate = new Map(days.map(d => [d.date, d.count]))
  const first = new Date(year, month - 1, 1)
  // Monday-first weekday (0 = Monday).
  const lead = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: Array<{ date: string | null; day: number; count: number }> = []
  for (let i = 0; i < lead; i++) cells.push({ date: null, day: 0, count: 0 })
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ date, day, count: countByDate.get(date) ?? 0 })
  }
  const max = Math.max(1, ...days.map(d => d.count))
  const weekdays = ['一', '二', '三', '四', '五', '六', '日']
  return (
    <div className={styles.heatmapWrap}>
      <div className={styles.heatmapHeader}>
        <span>{year} · {String(month).padStart(2, '0')}</span>
        <span>{t('chart.heatmap')}</span>
      </div>
      <div className={styles.heatmapGrid} role="img" aria-label={`${t('chart.heatmap')}: ${year}-${month}`}>
        {weekdays.map(wd => <span key={wd} className={styles.heatmapWeekday} aria-hidden="true">{wd}</span>)}
        {cells.map((cell, index) => {
          if (cell.date === null) return <span key={`pad-${index}`} className={styles.heatmapCell} aria-hidden="true" />
          const level = cell.count === 0 ? 0 : Math.min(4, 1 + Math.round((cell.count / max) * 3))
          return (
            <span
              key={cell.date}
              className={styles.heatmapCell}
              data-level={level}
              title={`${cell.date}: ${cell.count}`}
            >
              {cell.day}
            </span>
          )
        })}
      </div>
      <div className={styles.heatmapLegend}>
        <span>{t('chart.empty')}</span>
        <span className={styles.heatmapLegendScale}>
          {[0, 1, 2, 3, 4].map(level => <i key={level} data-level={level} aria-hidden="true" />)}
        </span>
        <span>{t('chart.total')}</span>
      </div>
      {status !== 'ready' && <div className={styles.heatmapStatus} role="status">{t(status === 'loading' ? 'chart.loading' : status === 'missing' ? 'chart.unavailable' : 'chart.error')}</div>}
    </div>
  )
}

/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, deepState, setDeepInsights, rates, telemetryState, setTelemetry, clear, heatmap, t }: AchievementsSectionInjected & PropsLocale<'achievements'>) {
  const [snapshot, setSnapshot] = useState<AchievementsSnapshot | null>(null)
  const [ratesData, setRatesData] = useState<AchievementsRates | null>(null)
  const [heatmapData, setHeatmapData] = useState<AchievementsHeatmap>(() => emptyCurrentMonthHeatmap())
  const [heatmapStatus, setHeatmapStatus] = useState<HeatmapStatus>('loading')
  const [telemetryEnabled, setTelemetryEnabled] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [mode, setMode] = useState<SortMode>('category')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [deepEnabled, setDeepEnabled] = useState(false)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
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
    // telemetry face is optional: hosts predating it degrade to "off".
    if (telemetryState !== undefined) {
      void Promise.resolve().then(telemetryState).then((result) => {
        if (alive && result.ok) setTelemetryEnabled(result.value.enabled)
      }).catch(() => {
        if (alive) setTelemetryEnabled(false)
      })
    }
    if (rates !== undefined) {
      void Promise.resolve().then(rates).then((result) => {
        if (alive && result.ok) setRatesData(result.value)
      }).catch(() => {
        if (alive) setRatesData(null)
      })
    }
    // Keep the calendar visible when a running host has not loaded the optional
    // Remote method yet; the empty cells make the missing data state explicit.
    if (heatmap === undefined) {
      setHeatmapStatus('missing')
    } else {
      void Promise.resolve().then(heatmap).then((result) => {
        if (!alive) return
        if (result.ok) {
          setHeatmapData(result.value)
          setHeatmapStatus('ready')
        } else {
          setHeatmapStatus('error')
        }
      }).catch(() => {
        if (alive) setHeatmapStatus('error')
      })
    }
    return () => {
      alive = false
    }
  }, [list, deepState, rates, telemetryState, heatmap, reloadToken, t])
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

  const toggleTelemetry = (): void => {
    if (setTelemetry === undefined) return
    void Promise.resolve().then(() => setTelemetry(!telemetryEnabled)).then((result) => {
      if (result.ok) setTelemetryEnabled(result.value.enabled)
    }).catch(() => {
      // The toggle is best-effort; keep the current state on failure.
    })
  }

  const doClear = (): void => {
    if (clear === undefined) return
    void Promise.resolve().then(clear).then((result) => {
      if (result.ok) {
        setSnapshot(result.value)
        setRatesData(null)
        setConfirmClear(false)
      }
    }).catch(() => {
      // Clearing is best-effort; keep the current state on failure.
      setConfirmClear(false)
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
    common: '#ffffff',
    rare: '#3b82f6',
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
          <button type="button" className={styles.chartHead} aria-expanded={!collapsed['category']} onClick={() => { setCollapsed(prev => ({ ...prev, category: !prev['category'] })) }}>
            <h4 className={styles.chartBadge} id="chart-category-title">[{t('chart.category')}]</h4>
            <span className={styles.chartFold} aria-hidden="true">{collapsed['category'] ? '[+]' : '[−]'}</span>
          </button>
          {!collapsed['category'] && <Donut slices={catSlices} center={String(unlocked)} t={t} />}
        </section>

        <section className={styles.chart} aria-labelledby="chart-heatmap-title">
          <button type="button" className={styles.chartHead} aria-expanded={!collapsed['heatmap']} onClick={() => { setCollapsed(prev => ({ ...prev, heatmap: !prev['heatmap'] })) }}>
            <h4 className={styles.chartBadge} id="chart-heatmap-title">[{t('chart.heatmap')}]</h4>
            <span className={styles.chartFold} aria-hidden="true">{collapsed['heatmap'] ? '[+]' : '[−]'}</span>
          </button>
          {!collapsed['heatmap'] && <Heatmap data={heatmapData} status={heatmapStatus} t={t} />}
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
            {deepEnabled ? t('settings.deepDisable') : t('settings.deepEnable')}
          </button>
          {telemetryState !== undefined && setTelemetry !== undefined && (
            <button type="button" aria-pressed={telemetryEnabled} className={`${styles.deepBtn} ${telemetryEnabled ? styles.deepActive : ''}`} onClick={toggleTelemetry} title={t('settings.telemetryDesc')}>
              {telemetryEnabled ? t('settings.telemetryDisable') : t('settings.telemetryEnable')}
            </button>
          )}
          {clear !== undefined && (
            <button type="button" className={styles.clearBtn} onClick={() => { setConfirmClear(true) }} title={t('settings.clearDesc')}>
              {t('settings.clearTitle')}
            </button>
          )}
        </div>
      </div>

      {confirmClear && clear !== undefined && (
        <div className={styles.clearDialog} role="alertdialog" aria-modal="true" aria-labelledby="achievements-clear-title" onClick={() => { setConfirmClear(false) }}>
          <div className={styles.clearPanel} onClick={(e) => { e.stopPropagation() }}>
            <span className={styles.clearPanelTitle} id="achievements-clear-title">[{t('settings.clearAsk')}]</span>
            <p className={styles.clearPanelDesc}>{t('settings.clearAskDesc')}</p>
            <div className={styles.clearPanelActions}>
              <button type="button" className={styles.clearBtn} onClick={doClear}>{t('settings.clearConfirm')}</button>
              <button type="button" className={styles.clearCancel} onClick={() => { setConfirmClear(false) }}>{t('settings.clearCancel')}</button>
            </div>
          </div>
        </div>
      )}

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
            <div className={styles.rows}>
              {activeGroup.items.map(a => <Row key={a.id} a={a} t={t} pct={ratesData?.pct[a.id]} hasRates={ratesData !== null} />)}
            </div>
          </section>
        </div>
      )}
      {visibleCount === 0 && <div className={styles.empty}>{t('empty')}</div>}
    </div>
  )
}
