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
        ? (_jsxs("div", { className: styles.barWrap, children: [_jsx("div", { className: styles.bar, "aria-hidden": "true", children: _jsx("div", { className: styles.barFill, style: { width: `${progress}%` } }) }), _jsxs("div", { className: styles.barLabel, children: [_jsx("span", { children: t('progress') }), _jsxs("span", { children: [a.progress.current, " / ", a.progress.target] })] })] }))
        : null;
    return (_jsxs("article", { className: rowClass, "data-rarity": a.rarity, "data-unlocked": a.unlocked, children: [_jsxs("div", { className: styles.icon, "data-unlocked": a.unlocked, children: [hiddenLocked ? _jsx("span", { children: "?" }) : _jsx(Icon, { icon: a.icon }), a.unlocked && _jsx("span", { className: styles.iconCheck, "aria-hidden": "true", children: "\u2713" })] }), _jsxs("div", { className: styles.main, children: [_jsxs("div", { className: styles.rowTop, children: [_jsxs("div", { className: styles.nameLine, children: [_jsx("span", { className: styles.name, children: name }), _jsx("span", { className: `${styles.badge} ${badgeClass}`, children: hiddenLocked ? t('hiddenDesc') : t(`rarity.${a.rarity}`) })] }), statusBadge] }), _jsx("div", { className: styles.desc, children: desc }), bar, a.unlocked && _jsx("div", { className: styles.unlockedLine, children: _jsxs("span", { children: ["\u2713 ", t('unlockedHint')] }) })] })] }));
}
/** Full settings-section gallery over the achievements Remote namespace. */
export function AchievementsSection({ list, deepState, setDeepInsights, t }) {
    const [snapshot, setSnapshot] = useState(null);
    const [mode, setMode] = useState('category');
    const [status, setStatus] = useState('all');
    const [deepEnabled, setDeepEnabled] = useState(false);
    const [activeGroupId, setActiveGroupId] = useState(null);
    useEffect(() => {
        let alive = true;
        void list().then((result) => {
            if (alive && result.ok)
                setSnapshot(result.value);
        }).catch(() => {
            if (alive)
                setSnapshot(null);
        });
        // deepState is optional: hosts predating the deep-insights tier lack it.
        if (deepState !== undefined) {
            void deepState().then((result) => {
                if (alive && result.ok)
                    setDeepEnabled(result.value.enabled);
            }).catch(() => {
                if (alive)
                    setDeepEnabled(false);
            });
        }
        return () => {
            alive = false;
        };
    }, [list, deepState]);
    if (snapshot === null) {
        return _jsxs("div", { className: styles.loading, role: "status", children: [_jsx("span", { className: styles.loadingSpinner, "aria-hidden": "true" }), t('loading')] });
    }
    const toggleDeep = () => {
        if (setDeepInsights === undefined)
            return;
        void setDeepInsights(!deepEnabled).then((result) => {
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
    return (_jsxs("div", { className: styles.section, children: [_jsxs("section", { className: styles.hero, "aria-labelledby": "achievements-overview-title", children: [_jsx("div", { className: styles.heroGlow, "aria-hidden": "true" }), _jsxs("div", { className: styles.heroTop, children: [_jsx("div", { className: styles.heroIcon, "aria-hidden": "true", children: "\uD83C\uDFC6" }), _jsxs("div", { className: styles.heroCopy, children: [_jsx("div", { className: styles.kicker, children: t('kicker') }), _jsx("h2", { className: styles.heroTitle, id: "achievements-overview-title", children: t('title') }), _jsx("p", { className: styles.heroSubtitle, children: t('subtitle') })] }), _jsxs("div", { className: styles.ring, "aria-label": `${completion}% ${t('complete')}`, children: [_jsxs("svg", { className: styles.ringGraphic, viewBox: "0 0 44 44", "aria-hidden": "true", children: [_jsx("circle", { className: styles.ringTrack, cx: "22", cy: "22", r: "19" }), _jsx("circle", { className: styles.ringValue, cx: "22", cy: "22", r: "19", pathLength: "100", strokeDasharray: `${completion} 100` })] }), _jsxs("div", { className: styles.ringInner, children: [_jsxs("strong", { children: [completion, "%"] }), _jsx("span", { children: t('complete') })] })] })] }), _jsxs("div", { className: styles.stats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: unlocked }), _jsx("span", { children: t('stats.unlocked') })] }), _jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: snapshot.total }), _jsx("span", { children: t('stats.total') })] }), _jsxs("div", { className: styles.stat, children: [_jsx("strong", { children: remaining }), _jsx("span", { children: t('stats.remaining') })] })] }), _jsx("div", { className: styles.heroBar, "aria-hidden": "true", children: _jsx("div", { className: styles.heroBarFill, style: { width: `${completion}%` } }) })] }), _jsxs("div", { className: styles.toolbar, children: [_jsxs("div", { className: styles.toolbarCopy, children: [_jsx("span", { className: styles.toolbarLabel, children: t('browse') }), _jsx("span", { className: styles.toolbarCount, children: t('visibleCount', { count: visibleCount }) })] }), _jsxs("div", { className: styles.controls, children: [_jsxs("div", { className: styles.segmented, role: "tablist", "aria-label": t('sort.label'), children: [_jsx("button", { type: "button", role: "tab", "aria-selected": mode === 'category', className: `${styles.sortBtn} ${mode === 'category' ? styles.sortActive : ''}`, onClick: () => { setMode('category'); }, children: t('sort.byCategory') }), _jsx("button", { type: "button", role: "tab", "aria-selected": mode === 'rarity', className: `${styles.sortBtn} ${mode === 'rarity' ? styles.sortActive : ''}`, onClick: () => { setMode('rarity'); }, children: t('sort.byRarity') })] }), _jsx("div", { className: styles.segmented, role: "group", "aria-label": t('filter.label'), children: ['all', 'unlocked', 'locked'].map(value => (_jsx("button", { type: "button", "aria-pressed": status === value, className: `${styles.filterBtn} ${status === value ? styles.filterActive : ''}`, onClick: () => { setStatus(value); }, children: t(`filter.${value}`) }, value))) }), _jsxs("button", { type: "button", "aria-pressed": deepEnabled, className: `${styles.deepBtn} ${deepEnabled ? styles.deepActive : ''}`, onClick: toggleDeep, title: t('settings.deepDesc'), children: [t('settings.deepTitle'), " \u00B7 ", deepEnabled ? t('settings.deepDisable') : t('settings.deepEnable')] })] })] }), activeGroup && (_jsxs("div", { className: styles.archive, children: [_jsxs("nav", { className: styles.rail, "aria-label": mode === 'category' ? t('sort.byCategory') : t('sort.byRarity'), children: [_jsxs("div", { className: styles.railHeader, children: [_jsx("span", { className: styles.railTitle, children: mode === 'category' ? t('sort.byCategory') : t('sort.byRarity') }), _jsx("span", { className: styles.railCount, children: visibleGroups.length })] }), _jsx("div", { className: styles.railList, children: visibleGroups.map((group) => {
                                    const active = group.id === activeGroup.id;
                                    return (_jsxs("button", { type: "button", className: `${styles.railItem} ${active ? styles.railItemActive : ''}`, "aria-current": active ? 'page' : undefined, onClick: () => { setActiveGroupId(group.id); }, children: [_jsx("span", { className: styles.railIcon, "aria-hidden": "true", children: group.icon }), _jsxs("span", { className: styles.railCopy, children: [_jsx("strong", { children: group.label }), _jsxs("small", { children: [group.groupUnlocked, " / ", group.all.length] })] }), _jsx("span", { className: styles.railMeter, "aria-hidden": "true", children: _jsx("span", { style: { width: `${group.groupCompletion}%` } }) })] }, group.id));
                                }) })] }), _jsxs("section", { className: styles.ledger, "aria-labelledby": `achievement-group-${activeGroup.id}`, children: [_jsxs("div", { className: styles.ledgerHeader, children: [_jsxs("div", { className: styles.groupHeading, children: [_jsx("span", { className: styles.groupIcon, "aria-hidden": "true", children: activeGroup.icon }), _jsxs("div", { children: [_jsx("h3", { className: styles.groupTitle, id: `achievement-group-${activeGroup.id}`, children: activeGroup.label }), _jsxs("span", { className: styles.groupMeta, children: [activeGroup.groupUnlocked, " / ", activeGroup.all.length, " ", t('stats.unlocked')] })] })] }), _jsxs("div", { className: styles.ledgerCompletion, children: [_jsxs("strong", { children: [activeGroup.groupCompletion, "%"] }), _jsx("span", { children: t('complete') })] })] }), _jsx("div", { className: styles.groupProgress, "aria-hidden": "true", children: _jsx("div", { style: { width: `${activeGroup.groupCompletion}%` } }) }), _jsx("div", { className: styles.rows, children: activeGroup.items.map(a => _jsx(Row, { a: a, t: t }, a.id)) })] })] })), visibleCount === 0 && _jsx("div", { className: styles.empty, children: t('empty') })] }));
}
//# sourceMappingURL=AchievementsSection.js.map