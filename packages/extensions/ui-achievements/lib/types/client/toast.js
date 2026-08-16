import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import styles from './toast.module.css';
const RARITY_LABEL = {
    common: 'rarity.common',
    rare: 'rarity.rare',
    epic: 'rarity.epic',
    legendary: 'rarity.legendary',
};
/** Confetti piece palette (rarity-agnostic, reused by the toast burst). */
const CONFETTI_COLORS = ['#60a5fa', '#a78bfa', '#fbbf24', '#4ade80', '#f87171', '#22d3ee', '#f472b6', '#facc15'];
/** One transient unlock card. */
function Toast({ toast, t, onDismiss }) {
    const celebratory = toast.rarity === 'epic' || toast.rarity === 'legendary';
    return (_jsxs(_Fragment, { children: [celebratory && _jsx(Confetti, {}), _jsxs("div", { className: `${styles.toast} ${styles[`rarity-${toast.rarity}`]}`, role: "status", children: [_jsx("div", { className: styles.icon, children: toast.icon }), _jsxs("div", { className: styles.copy, children: [_jsx("div", { className: styles.eyebrow, children: t('toast.sub') }), _jsx("div", { className: styles.title, children: toast.name }), _jsx("div", { className: styles.sub, children: t(RARITY_LABEL[toast.rarity]) })] }), _jsx("button", { type: "button", className: styles.close, onClick: onDismiss, "aria-label": t('toast.close'), children: "\u00D7" })] })] }));
}
/** A one-shot confetti burst (pure CSS keyframes). */
function Confetti() {
    return (_jsx("div", { className: styles.confetti, children: Array.from({ length: 60 }, (_, i) => (_jsx("span", { className: styles.piece, style: {
                left: `${(i * 37) % 101}%`,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDelay: `${(i % 12) * 0.05}s`,
                animationDuration: `${2.4 + (i % 9) * 0.16}s`,
                transform: `rotate(${(i * 47) % 360}deg)`,
            } }, i))) }));
}
/** The toast stack entry (renders nothing when no toast is live). */
export function ToastStack({ useSnapshot, dismiss, t }) {
    const toasts = useSnapshot(s => s.toasts);
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { className: styles.stack, children: toasts.map(toast => (_jsx(Toast, { toast: toast, t: t, onDismiss: () => { dismiss(toast.clientAt); } }, toast.clientAt))) }));
}
//# sourceMappingURL=toast.js.map