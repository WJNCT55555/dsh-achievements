import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './trophy.module.css';
/** The sidebar footer trophy entry. */
export function Trophy({ useSnapshot, toggle, wide, t }) {
    const newCount = useSnapshot(s => s.newCount);
    const open = useSnapshot(s => s.galleryOpen);
    return (_jsxs("button", { type: "button", className: styles.trophy, onClick: toggle, title: t('nav'), "aria-label": t('nav'), "aria-pressed": open, children: [_jsx("span", { className: styles.icon, children: "\uD83C\uDFC6" }), wide && _jsx("span", { className: styles.label, children: t('nav') }), newCount > 0 && _jsx("span", { className: styles.badge, children: newCount })] }));
}
//# sourceMappingURL=trophy.js.map