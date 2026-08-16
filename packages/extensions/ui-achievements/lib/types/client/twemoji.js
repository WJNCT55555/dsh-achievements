/** Twemoji CDN base: consistent, flat, CC BY 4.0-licensed emoji SVGs. */
export const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';
/** Map an emoji to its Twemoji SVG filename (UTF-16 code units, '-' joined). */
export function twemojiPath(emoji) {
    const points = [];
    for (let i = 0; i < emoji.length; i++)
        points.push(emoji.charCodeAt(i).toString(16));
    return points.join('-');
}
//# sourceMappingURL=twemoji.js.map