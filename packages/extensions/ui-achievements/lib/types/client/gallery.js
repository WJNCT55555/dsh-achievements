import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Achievements gallery overlay: the trophy-toggled full gallery in
 * `shell.overlay`. Reuses the settings-section gallery component; the backdrop
 * opts back into pointer events to trap the click-away.
 */
import { useEffect } from 'react';
import { AchievementsSection } from "./AchievementsSection.js";
import styles from './gallery.module.css';
/** The trophy-toggled gallery overlay (renders nothing while closed). */
export function GalleryOverlay({ useSnapshot, close, list, deepState, setDeepInsights, rates, telemetryState, setTelemetry, t }) {
    const open = useSnapshot(s => s.galleryOpen);
    useEffect(() => {
        if (!open)
            return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                close();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => { window.removeEventListener('keydown', onKeyDown); };
    }, [close, open]);
    if (!open)
        return null;
    return (_jsx("div", { className: styles.backdrop, onClick: close, children: _jsxs("div", { className: styles.panel, role: "dialog", "aria-modal": "true", "aria-labelledby": "achievements-gallery-title", onClick: (e) => { e.stopPropagation(); }, children: [_jsx("span", { className: styles.scanlines, "aria-hidden": "true" }), _jsxs("div", { className: styles.head, children: [_jsxs("div", { className: styles.heading, children: [_jsx("span", { className: styles.headingIcon, "aria-hidden": "true", children: "\uD83C\uDFC6" }), _jsxs("div", { children: [_jsx("span", { className: styles.kicker, children: t('kicker') }), _jsx("span", { className: styles.title, id: "achievements-gallery-title", children: t('title') })] })] }), _jsx("button", { type: "button", className: styles.close, onClick: close, "aria-label": t('gallery.close'), children: "\u00D7" })] }), _jsx(AchievementsSection, { list: list, ...deepState !== undefined ? { deepState } : {}, ...setDeepInsights !== undefined ? { setDeepInsights } : {}, ...rates !== undefined ? { rates } : {}, ...telemetryState !== undefined ? { telemetryState } : {}, ...setTelemetry !== undefined ? { setTelemetry } : {}, t: t })] }) }));
}
//# sourceMappingURL=gallery.js.map