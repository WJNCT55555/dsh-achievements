import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './dock.module.css';
/** The composer dock entry (renders nothing until the first poll lands). */
export function DockReadout({ useSnapshot, t }) {
    const dock = useSnapshot(s => s.dock);
    if (dock === null)
        return null;
    const combo = dock.streak >= 2 ? t('dock.combo', { count: dock.streak }) : '';
    const next = dock.next === null ? t('dock.complete') : t('dock.next', {
        name: dock.next.name,
        current: dock.next.current,
        target: dock.next.target,
    });
    return (_jsxs("div", { className: styles.dock, children: [_jsx("span", { className: styles.icon, "aria-hidden": "true", children: "\uD83C\uDFC6" }), _jsx("span", { className: styles.summary, children: t('dock.summary', { unlocked: dock.unlocked, total: dock.total }) }), combo && _jsx("span", { className: styles.combo, children: combo }), _jsx("span", { className: styles.next, title: next, children: next })] }));
}
//# sourceMappingURL=dock.js.map