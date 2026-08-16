import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Achievements gallery: the settings-section page. Fetches the achievements
 * snapshot on mount through the inject face's Remote-backed `list` callback,
 * then renders a themed overview, progress groups, and rarity-aware cards.
 */
import { useEffect, useState } from 'react';
import { twemojiPath, TWEMOJI_BASE } from "./twemoji.js";
import styles from './AchievementsSection.module.css';
const CATEGORY_ORDER = ['getting-started', 'toolsmith', 'filecraft', 'orchestration', 'goals', 'skill', 'model', 'behavior', 'crossover', 'hidden'];
/** Rarity tiers in ascending difficulty for the by-rarity sort. */
const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];
const CATEGORY_ICONS = {
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
};
const RARITY_ICONS = {
    common: '○',
    rare: '◇',
    epic: '✦',
    legendary: '♛',
};
const PROGRESS_TICKS = Array.from({ length: 9 }, (_, index) => index);
/** Emoji icon via Twemoji CDN with a text fallback on load failure. */
function Icon({ icon }) {
    const [failed, setFailed] = useState(false);
    if (failed)
        return _jsx("span", { children: icon });
    return _jsx("img", { className: styles.iconImage, src: `${TWEMOJI_BASE}${twemojiPath(icon)}.svg`, alt: icon, loading: "lazy", onError: () => { setFailed(true); } });
}
function completionOf(current, total) {
    if (total <= 0)
        return 0;
    return Math.min(100, Math.round((current / total) * 100));
}
function statusMatches(a, filter) {
    if (filter === 'all')
        return true;
    return filter === 'unlocked' ? a.unlocked : !a.unlocked;
}
/** One achievement card. */
function Row({ a, t }) {
    const hiddenLocked = a.hidden && !a.unlocked;
    const deepLocked = a.deepLocked && !a.unlocked;
    const name = hiddenLocked ? '？？？' : a.name;
    const desc = hiddenLocked ? t('hidden') : (deepLocked ? t('deepLocked') : a.desc);
    const rarityClass = styles[`rarity-${a.rarity}`] ?? styles['rarity-common'];
    const rowClass = `${styles.row} ${rarityClass} ${a.unlocked ? styles.done : ''} ${hiddenLocked || deepLocked || !a.unlocked ? styles.locked : ''}`;
    const badgeClass = hiddenLocked
        ? styles['badge-locked']
        : (styles[`badge-${a.rarity}`] ?? styles['badge-common']);
    const progress = completionOf(a.progress.current, a.progress.target);
    const statusBadge = a.unlocked
        ? _jsx("span", { className: `${styles.badge} ${styles['badge-done']}`, children: t('done') })
        : (deepLocked
            ? _jsx("span", { className: `${styles.badge} ${styles['badge-locked']}`, children: t('deepHint') })
            : (a.progress.target > 1
                ? _jsxs("span", { className: `${styles.badge} ${styles['badge-locked']}`, children: [a.progress.current, " / ", a.progress.target] })
                : _jsx("span", { className: `${styles.badge} ${styles['badge-locked']}`, children: t('todo') })));
    const bar = (!hiddenLocked && !deepLocked && a.progress.target > 1 && !a.unlocked)
        ? (_jsxs("div", { className: styles.barWrap, children: [_jsxs("div", { className: styles.bar, "aria-hidden": "true", children: [_jsx("div", { className: styles.barFill, style: { width: `${progress}%` } }), _jsx("span", { className: styles.barTicks, children: PROGRESS_TICKS.map(tick => _jsx("i", {}, tick)) })] }), _jsxs("div", { className: styles.barLabel, children: [_jsx("span", { children: t('progress') }), _jsxs("span", { children: [a.progress.current, " / ", a.progress.target] })] })] }))
        : null;
    return (_jsxs("article", { className: rowClass, "data-rarity": a.rarity, "data-unlocked": a.unlocked, children: [_jsx("span", { className: styles.rowFrame, "aria-hidden": "true" }), _jsxs("span", { className: styles.recordCode, children: ["[ ACHV::", a.id.toUpperCase(), " ]"] }), _jsxs("div", { className: styles.icon, "data-unlocked": a.unlocked, children: [hiddenLocked ? _jsx("span", { children: "?" }) : _jsx(Icon, { icon: a.icon }), a.unlocked && _jsx("span", { className: styles.iconCheck, "aria-hidden": "true", children: "\u2713" })] }), _jsxs("div", { className: styles.main, children: [_jsxs("div", { className: styles.rowTop, children: [_jsxs("div", { className: styles.titleBlock, children: [_jsxs("div", { className: styles.nameLine, children: [_jsx("span", { className: styles.name, children: name }), _jsx("span", { className: `${styles.badge} ${badgeClass}`, children: hiddenLocked ? t('hiddenDesc') : t(`rarity.${a.rarity}`) })] }), _jsx("div", { className: styles.desc, children: desc })] }), statusBadge] }), bar, a.unlocked && _jsx("div", { className: styles.unlockedLine, children: _jsxs("span", { children: ["\u2713 ", t('unlockedHint')] }) })] })] }));
}
/** Hollow donut chart (SVG) with a center total. */
function Donut({ slices, center, t }) {
    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    if (total <= 0) {
        return (_jsx("div", { className: styles.donutEmpty, role: "img", "aria-label": t('chart.empty'), children: _jsx("span", { children: t('chart.empty') }) }));
    }
    const radius = 15.9;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    return (_jsxs("div", { className: styles.donutWrap, children: [_jsxs("svg", { className: styles.donut, viewBox: "0 0 42 42", "aria-hidden": "true", children: [_jsx("circle", { className: styles.donutTrack, cx: "21", cy: "21", r: radius }), slices.map((slice) => {
                        const fraction = slice.value / total;
                        const dash = fraction * circumference;
                        const el = (_jsx("circle", { className: styles.donutSlice, cx: "21", cy: "21", r: radius, stroke: slice.color, strokeDasharray: `${dash} ${circumference - dash}`, strokeDashoffset: -offset }, slice.label));
                        offset += dash;
                        return el;
                    })] }), _jsxs("div", { className: styles.donutCenter, children: [_jsx("strong", { children: center }), _jsx("span", { children: t('chart.total') })] })] }));
}
/** Horizontal terminal bar row (label + filled bar + value). */
function HBar({ label, value, max, color }) {
    const width = max > 0 ? Math.round((value / max) * 100) : 0;
    return (_jsxs("div", { className: styles.hbarRow, children: [_jsx("span", { className: styles.hbarLabel, title: label, children: label }), _jsx("div", { className: styles.hbarTrack, "aria-hidden": "true", children: _jsx("div", { className: styles.hbarFill, style: { width: `${width}%`, background: color } }) }), _jsx("span", { className: styles.hbarValue, children: value })] }));
}
/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, deepState, setDeepInsights, stats, t }) {
    const [snapshot, setSnapshot] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [mode, setMode] = useState('category');
    const [status, setStatus] = useState('all');
    const [deepEnabled, setDeepEnabled] = useState(false);
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [reloadToken, setReloadToken] = useState(0);
    useEffect(() => {
        let alive = true;
        setLoadError(null);
        void Promise.resolve().then(list).then((result) => {
            if (!alive)
                return;
            if (result.ok)
                setSnapshot(result.value);
            else
                setLoadError(result.error.message);
        }).catch(() => {
            if (alive)
                setLoadError(t('loadError'));
        });
        // deepState is optional: hosts predating the deep-insights tier lack it.
        if (deepState !== undefined) {
            void Promise.resolve().then(deepState).then((result) => {
                if (alive && result.ok)
                    setDeepEnabled(result.value.enabled);
            }).catch(() => {
                if (alive)
                    setDeepEnabled(false);
            });
        }
        // stats is optional: hosts predating the dashboard aggregates lack it.
        if (stats !== undefined) {
            void Promise.resolve().then(stats).then((result) => {
                if (alive && result.ok)
                    setStatsData(result.value);
            }).catch(() => {
                if (alive)
                    setStatsData(null);
            });
        }
        return () => {
            alive = false;
        };
    }, [list, deepState, stats, reloadToken, t]);
    if (snapshot === null) {
        if (loadError !== null) {
            return (_jsxs("div", { className: styles.loadFailure, role: "alert", children: [_jsx("span", { className: styles.loadFailureIcon, "aria-hidden": "true", children: "!" }), _jsxs("div", { children: [_jsx("strong", { children: t('loadError') }), _jsx("p", { children: loadError })] }), _jsx("button", { type: "button", onClick: () => { setReloadToken(value => value + 1); }, children: t('retry') })] }));
        }
        return _jsxs("div", { className: styles.loading, role: "status", children: [_jsx("span", { className: styles.loadingSpinner, "aria-hidden": "true" }), t('loading')] });
    }
    const toggleDeep = () => {
        if (setDeepInsights === undefined)
            return;
        void Promise.resolve().then(() => setDeepInsights(!deepEnabled)).then((result) => {
            if (result.ok)
                setDeepEnabled(result.value.enabled);
        }).catch(() => {
            // The toggle is best-effort; keep the current state on failure.
        });
    };
    const unlocked = snapshot.unlocked;
    const remaining = Math.max(0, snapshot.total - unlocked);
    const completion = completionOf(unlocked, snapshot.total);
    const visibleCount = snapshot.achievements.filter(a => statusMatches(a, status)).length;
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
        }));
    const visibleGroups = groups.map((group) => {
        const items = group.all.filter(a => statusMatches(a, status));
        const groupUnlocked = group.all.filter(a => a.unlocked).length;
        return {
            ...group,
            items,
            groupUnlocked,
            groupCompletion: completionOf(groupUnlocked, group.all.length),
        };
    }).filter(group => group.items.length > 0);
    const activeGroup = visibleGroups.find(group => group.id === activeGroupId) ?? visibleGroups[0];
    // ── dashboard charts data ───────────────────────────────────────
    const rarityColors = {
        common: '#10b981',
        rare: '#2dd4bf',
        epic: '#a78bfa',
        legendary: '#fbbf24',
    };
    const raritySlices = RARITY_ORDER.map(rarity => ({
        label: t(`rarity.${rarity}`),
        value: snapshot.achievements.filter(a => a.rarity === rarity && a.unlocked).length,
        color: rarityColors[rarity],
    }));
    const catColors = {
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
    };
    const catSlices = CATEGORY_ORDER
        .filter(cat => cat !== 'hidden')
        .map(cat => ({
        label: t(`cat.${cat}`),
        value: snapshot.achievements.filter(a => a.category === cat && a.unlocked).length,
        color: catColors[cat],
    }));
    const tokenBuckets = (statsData?.tokens
        ? [
            { label: t('chart.tokens.output'), value: statsData.tokens.output, color: '#10b981' },
            { label: t('chart.tokens.cache'), value: statsData.tokens.cacheRead, color: '#2dd4bf' },
            { label: t('chart.tokens.uncached'), value: statsData.tokens.uncached, color: '#a78bfa' },
            { label: t('chart.tokens.reasoning'), value: statsData.tokens.reasoning, color: '#fbbf24' },
        ]
        : []);
    const toolMax = (statsData?.tools[0]?.count ?? 0);
    const toolBars = statsData?.tools ?? [];
    return (_jsxs("div", { className: styles.section, children: [_jsxs("section", { className: styles.hero, "aria-labelledby": "achievements-overview-title", children: [_jsxs("span", { className: styles.heroBadge, "aria-hidden": "true", children: ["[", t('title'), "]"] }), _jsx("div", { className: styles.heroGlow, "aria-hidden": "true" }), _jsxs("div", { className: styles.heroTop, children: [_jsx("div", { className: styles.heroIcon, "aria-hidden": "true", children: ">_" }), _jsxs("div", { className: styles.heroCopy, children: [_jsx("div", { className: styles.kicker, children: t('kicker') }), _jsx("h2", { className: styles.heroTitle, id: "achievements-overview-title", children: t('title') }), _jsx("p", { className: styles.heroSubtitle, children: t('subtitle') })] }), _jsxs("div", { className: styles.heroPct, "aria-label": `${completion}% ${t('complete')}`, children: [_jsxs("strong", { children: [completion, "%"] }), _jsx("span", { children: t('complete') })] })] }), _jsxs("div", { className: styles.stats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: unlocked }), _jsx("span", { children: t('stats.unlocked') })] }), _jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: snapshot.total }), _jsx("span", { children: t('stats.total') })] }), _jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: remaining }), _jsx("span", { children: t('stats.remaining') })] })] }), _jsx("div", { className: styles.statBar, "aria-hidden": "true", children: _jsx("div", { className: styles.statBarFill, style: { width: `${completion}%` } }) })] }), _jsxs("div", { className: styles.charts, role: "group", "aria-label": t('chart.title'), children: [_jsxs("section", { className: styles.chart, "aria-labelledby": "chart-rarity-title", children: [_jsxs("h4", { className: styles.chartBadge, id: "chart-rarity-title", children: ["[", t('chart.rarity'), "]"] }), _jsx("div", { className: styles.chartBars, children: raritySlices.map(slice => (_jsx(HBar, { label: slice.label, value: slice.value, max: snapshot.total, color: slice.color }, slice.label))) })] }), _jsxs("section", { className: styles.chart, "aria-labelledby": "chart-category-title", children: [_jsxs("h4", { className: styles.chartBadge, id: "chart-category-title", children: ["[", t('chart.category'), "]"] }), _jsx(Donut, { slices: catSlices, center: String(unlocked), t: t })] }), _jsxs("section", { className: styles.chart, "aria-labelledby": "chart-tokens-title", children: [_jsxs("h4", { className: styles.chartBadge, id: "chart-tokens-title", children: ["[", t('chart.tokens'), "]"] }), tokenBuckets.length > 0
                                ? _jsx(Donut, { slices: tokenBuckets, center: String(Math.round(tokenBuckets.reduce((s, x) => s + x.value, 0))), t: t })
                                : _jsx("div", { className: styles.chartEmpty, children: t('chart.empty') })] }), _jsxs("section", { className: styles.chart, "aria-labelledby": "chart-tools-title", children: [_jsxs("h4", { className: styles.chartBadge, id: "chart-tools-title", children: ["[", t('chart.tools'), "]"] }), toolBars.length > 0
                                ? _jsx("div", { className: styles.chartBars, children: toolBars.map(tool => (_jsx(HBar, { label: tool.name, value: tool.count, max: toolMax, color: "#10b981" }, tool.name))) })
                                : _jsx("div", { className: styles.chartEmpty, children: t('chart.empty') })] })] }), _jsxs("div", { className: styles.toolbar, children: [_jsxs("div", { className: styles.toolbarCopy, children: [_jsx("span", { className: styles.toolbarLabel, children: t('browse') }), _jsx("span", { className: styles.toolbarCount, children: t('visibleCount', { count: visibleCount }) })] }), _jsxs("div", { className: styles.controls, children: [_jsxs("div", { className: styles.segmented, role: "tablist", "aria-label": t('sort.label'), children: [_jsx("button", { type: "button", role: "tab", "aria-selected": mode === 'category', className: `${styles.sortBtn} ${mode === 'category' ? styles.sortActive : ''}`, onClick: () => { setMode('category'); }, children: t('sort.byCategory') }), _jsx("button", { type: "button", role: "tab", "aria-selected": mode === 'rarity', className: `${styles.sortBtn} ${mode === 'rarity' ? styles.sortActive : ''}`, onClick: () => { setMode('rarity'); }, children: t('sort.byRarity') })] }), _jsx("div", { className: styles.segmented, role: "group", "aria-label": t('filter.label'), children: ['all', 'unlocked', 'locked'].map(value => (_jsx("button", { type: "button", "aria-pressed": status === value, className: `${styles.filterBtn} ${status === value ? styles.filterActive : ''}`, onClick: () => { setStatus(value); }, children: t(`filter.${value}`) }, value))) }), _jsxs("button", { type: "button", "aria-pressed": deepEnabled, className: `${styles.deepBtn} ${deepEnabled ? styles.deepActive : ''}`, onClick: toggleDeep, title: t('settings.deepDesc'), children: [t('settings.deepTitle'), " \u00B7 ", deepEnabled ? t('settings.deepDisable') : t('settings.deepEnable')] })] })] }), activeGroup && (_jsxs("div", { className: styles.archive, children: [_jsxs("nav", { className: styles.rail, "aria-label": mode === 'category' ? t('sort.byCategory') : t('sort.byRarity'), children: [_jsxs("div", { className: styles.railHeader, children: [_jsx("span", { className: styles.railTitle, children: mode === 'category' ? t('sort.byCategory') : t('sort.byRarity') }), _jsx("span", { className: styles.railCount, children: visibleGroups.length })] }), _jsx("div", { className: styles.railList, children: visibleGroups.map((group) => {
                                    const active = group.id === activeGroup.id;
                                    return (_jsxs("button", { type: "button", className: `${styles.railItem} ${active ? styles.railItemActive : ''}`, "data-group": group.id, "aria-current": active ? 'page' : undefined, onClick: () => { setActiveGroupId(group.id); }, children: [_jsx("span", { className: styles.railIcon, "aria-hidden": "true", children: group.icon }), _jsxs("span", { className: styles.railCopy, children: [_jsx("strong", { children: group.label }), _jsxs("small", { children: [group.groupUnlocked, " / ", group.all.length] })] }), _jsx("span", { className: styles.railMeter, "aria-hidden": "true", children: _jsx("span", { style: { width: `${group.groupCompletion}%` } }) })] }, group.id));
                                }) })] }), _jsxs("section", { className: styles.ledger, "data-group": activeGroup.id, "aria-labelledby": `achievement-group-${activeGroup.id}`, children: [_jsxs("div", { className: styles.ledgerHeader, children: [_jsxs("div", { className: styles.groupHeading, children: [_jsx("span", { className: styles.groupIcon, "aria-hidden": "true", children: activeGroup.icon }), _jsxs("div", { children: [_jsx("h3", { className: styles.groupTitle, id: `achievement-group-${activeGroup.id}`, children: activeGroup.label }), _jsxs("span", { className: styles.groupMeta, children: [activeGroup.groupUnlocked, " / ", activeGroup.all.length, " ", t('stats.unlocked')] })] })] }), _jsxs("div", { className: styles.ledgerCompletion, children: [_jsxs("strong", { children: [activeGroup.groupCompletion, "%"] }), _jsx("span", { children: t('complete') })] })] }), _jsx("div", { className: styles.groupProgress, "aria-hidden": "true", children: _jsx("div", { style: { width: `${activeGroup.groupCompletion}%` } }) }), _jsx("div", { className: styles.rows, children: activeGroup.items.map(a => _jsx(Row, { a: a, t: t }, a.id)) })] })] })), visibleCount === 0 && _jsx("div", { className: styles.empty, children: t('empty') })] }));
}
//# sourceMappingURL=AchievementsSection.js.map