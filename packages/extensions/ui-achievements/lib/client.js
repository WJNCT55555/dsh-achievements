window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-achievements",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_web_react = require("@deepseek-ai/dsh-client-web-react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region lib/types/client/twemoji.js
		/** Twemoji CDN base: consistent, flat, CC BY 4.0-licensed emoji SVGs. */
		const TWEMOJI_BASE = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/";
		/** Map an emoji to its Twemoji SVG filename (UTF-16 code units, '-' joined). */
		function twemojiPath(emoji) {
			const points = [];
			for (let i = 0; i < emoji.length; i++) points.push(emoji.charCodeAt(i).toString(16));
			return points.join("-");
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\AchievementsSection.module.css.mjs
		const css$4 = ".S48bLa_section{--achievement-bg:#10171e;--achievement-panel:#17212b;--achievement-card:#1c2832;--achievement-raised:#22313d;--achievement-line:#314351;--achievement-line-strong:#465b69;--achievement-text:#e5e9ec;--achievement-muted:#96a4af;--achievement-brass:#b89a61;--achievement-brass-dark:#3b3427;--achievement-steel:#8998a6;--achievement-blue:#6f9fc4;--achievement-violet:#917aa8;--achievement-green:#6f9b7b;max-width:920px;color:var(--achievement-text);flex-direction:column;gap:18px;display:flex}.S48bLa_loading{min-height:140px;color:var(--achievement-muted);justify-content:center;align-items:center;gap:8px;font-size:13px;display:flex}.S48bLa_loadingSpinner{border:2px solid var(--achievement-line);border-top-color:var(--achievement-brass);border-radius:50%;width:15px;height:15px;animation:.8s linear infinite S48bLa_spin}.S48bLa_loadFailure{color:#d7dbe0;background:#171c22;border:1px solid #4d3d34;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:14px;min-height:132px;padding:24px;display:grid;box-shadow:inset 3px 0 #9a5a49}.S48bLa_loadFailureIcon{color:#f0d8cf;border:1px solid #9a5a49;place-items:center;width:34px;height:34px;font:700 18px/1 Georgia,serif;display:grid}.S48bLa_loadFailure strong{color:#f0d8cf;font:600 15px/1.3 Georgia,serif}.S48bLa_loadFailure p{color:#9fa8b2;margin:5px 0 0;font-size:12px;line-height:1.5}.S48bLa_loadFailure button{color:#d9c7a0;cursor:pointer;background:#222a33;border:1px solid #6e6048;padding:8px 12px}.S48bLa_loadFailure button:hover{color:#f0dfb7;background:#29333e}.S48bLa_hero{background:var(--achievement-panel);border:1px solid #4b4435;border-radius:12px;flex-direction:column;gap:14px;padding:19px 20px 17px;display:flex;position:relative;overflow:hidden;box-shadow:0 10px 24px #050a0f38}.S48bLa_hero:before{background:var(--achievement-brass);content:\"\";width:3px;position:absolute;inset:18px auto 18px 0}.S48bLa_hero:after{content:\"\";background:#655b46;height:1px;position:absolute;top:0;left:22px;right:22px}.S48bLa_heroGlow{display:none}.S48bLa_heroTop{align-items:center;gap:15px;display:flex}.S48bLa_heroIcon{border:1px solid var(--achievement-brass);background:var(--achievement-brass-dark);color:#d8c28f;border-radius:12px;flex:none;justify-content:center;align-items:center;width:56px;height:56px;font-size:27px;display:inline-flex}.S48bLa_heroCopy{flex:1;min-width:0}.S48bLa_kicker{color:var(--achievement-brass);letter-spacing:.18em;text-transform:uppercase;font-size:9px;font-weight:700}.S48bLa_heroTitle{color:#f0ece2;letter-spacing:-.01em;margin:3px 0;font-family:Georgia,Times New Roman,serif;font-size:22px;font-weight:700;line-height:1.25}.S48bLa_heroSubtitle{color:#a9b3bb;margin:0;font-size:12px;line-height:1.5}.S48bLa_ring{flex:none;place-items:center;width:78px;height:78px;display:grid;position:relative}.S48bLa_ringGraphic{width:100%;height:100%;position:absolute;inset:0;transform:rotate(-90deg)}.S48bLa_ringTrack,.S48bLa_ringValue{fill:none;stroke-width:3px}.S48bLa_ringTrack{stroke:var(--achievement-line)}.S48bLa_ringValue{stroke:var(--achievement-brass);stroke-linecap:round;transition:stroke-dasharray .35s}.S48bLa_ringInner{background:var(--achievement-bg);border:1px solid #2c3a45;border-radius:50%;flex-direction:column;justify-content:center;align-items:center;width:59px;height:59px;display:flex}.S48bLa_ringInner strong{color:#d8c28f;font-variant-numeric:tabular-nums;font-family:Georgia,Times New Roman,serif;font-size:17px;line-height:20px}.S48bLa_ringInner span{color:var(--achievement-muted);font-size:9px}.S48bLa_stats{border:1px solid var(--achievement-line);background:var(--achievement-card);border-radius:8px;grid-template-columns:repeat(3,1fr);gap:0;display:grid;overflow:hidden}.S48bLa_stat{background:0 0;border:0;flex-direction:column;gap:2px;padding:9px 12px;display:flex}.S48bLa_stat+.S48bLa_stat{border-left:1px solid var(--achievement-line)}.S48bLa_stat strong{color:#ddd4bf;font-variant-numeric:tabular-nums;font-family:Georgia,Times New Roman,serif;font-size:17px;line-height:21px}.S48bLa_stat span{color:var(--achievement-muted);letter-spacing:.06em;text-transform:uppercase;font-size:9px}.S48bLa_heroBar,.S48bLa_groupProgress,.S48bLa_bar{background:#0c1319;border-radius:999px;overflow:hidden}.S48bLa_heroBar{height:6px}.S48bLa_heroBarFill,.S48bLa_groupProgress div,.S48bLa_barFill{border-radius:inherit;background:var(--achievement-brass);height:100%;transition:width .35s}.S48bLa_toolbar{border:1px solid var(--achievement-line);background:#131b22;border-radius:8px;justify-content:space-between;align-items:center;gap:12px;padding:8px 10px;display:flex}.S48bLa_toolbarCopy{align-items:baseline;gap:8px;min-width:0;display:flex}.S48bLa_toolbarLabel{color:var(--achievement-text);font-family:Georgia,Times New Roman,serif;font-size:13px;font-weight:700}.S48bLa_toolbarCount{color:var(--achievement-muted);font-size:11px}.S48bLa_controls{flex-wrap:wrap;justify-content:flex-end;gap:6px;display:flex}.S48bLa_segmented{border:1px solid var(--achievement-line);background:var(--achievement-bg);border-radius:9px;gap:2px;padding:3px;display:inline-flex}.S48bLa_sortBtn,.S48bLa_filterBtn{color:var(--achievement-muted);cursor:pointer;font:inherit;background:0 0;border:0;border-radius:6px;padding:2px 8px;font-size:11px;line-height:20px;transition:background .14s,color .14s}.S48bLa_sortBtn:hover,.S48bLa_filterBtn:hover{background:var(--achievement-card);color:var(--achievement-text)}.S48bLa_sortBtn:focus-visible,.S48bLa_filterBtn:focus-visible{outline:2px solid var(--achievement-brass);outline-offset:1px}.S48bLa_sortActive,.S48bLa_filterActive{color:#f0ece2;background:#353c41}.S48bLa_deepBtn{color:#8fa0ac;cursor:pointer;min-height:28px;font:inherit;white-space:nowrap;background:#17212b;border:1px solid #3b4b57;border-radius:7px;padding:3px 9px;font-size:10px}.S48bLa_deepBtn:hover{color:#cbd2d7;border-color:#526674}.S48bLa_deepActive{color:#c6ae78;background:#302b22;border-color:#655b46}.S48bLa_deepBtn{border:1px solid var(--achievement-line);color:var(--achievement-muted);cursor:pointer;font:inherit;background:0 0;border-radius:8px;padding:2px 10px;font-size:11px;line-height:20px;transition:background .14s,color .14s,border-color .14s}.S48bLa_deepBtn:hover{background:var(--achievement-card);color:var(--achievement-text)}.S48bLa_deepBtn:focus-visible{outline:2px solid var(--achievement-brass);outline-offset:1px}.S48bLa_deepActive{border-color:var(--achievement-green);color:#cfe6d4;background:#6f9b7b24}.S48bLa_archive{border:1px solid var(--achievement-line);background:var(--achievement-panel);border-radius:12px;grid-template-columns:190px minmax(0,1fr);min-height:430px;display:grid;overflow:hidden;box-shadow:0 10px 24px #050a0f33}.S48bLa_rail{border-right:1px solid var(--achievement-line);background:#111920;min-width:0;padding:12px 10px}.S48bLa_railHeader{border-bottom:1px solid #293943;justify-content:space-between;align-items:center;gap:8px;padding:2px 7px 10px;display:flex}.S48bLa_railTitle{color:#c4ccd2;letter-spacing:.12em;text-transform:uppercase;font-size:9px;font-weight:700}.S48bLa_railCount{color:#c6ae78;font-variant-numeric:tabular-nums;border:1px solid #4b4435;border-radius:4px;justify-content:center;align-items:center;min-width:20px;height:18px;padding:0 5px;font-size:9px;display:inline-flex}.S48bLa_railList{flex-direction:column;gap:4px;padding-top:8px;display:flex}.S48bLa_railItem{width:100%;color:var(--achievement-muted);cursor:pointer;font:inherit;text-align:left;background:0 0;border:1px solid #0000;border-radius:7px;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:2px 8px;padding:8px 8px 7px;transition:background .14s,border-color .14s,color .14s;display:grid}.S48bLa_railItem:hover{color:var(--achievement-text);background:#18232c;border-color:#2f414d}.S48bLa_railItem:focus-visible{outline:2px solid var(--achievement-brass);outline-offset:1px}.S48bLa_railItemActive{color:#eee8dc;background:#2d2b25;border-color:#655b46}.S48bLa_railIcon{width:28px;height:30px;color:var(--achievement-brass);background:#0d141a;border:1px solid #3b4b57;border-radius:6px;grid-row:1/span 2;justify-content:center;align-items:center;font-size:13px;display:inline-flex}.S48bLa_railItemActive .S48bLa_railIcon{background:var(--achievement-brass-dark);color:#d8c28f;border-color:#756744}.S48bLa_railCopy{justify-content:space-between;align-items:baseline;gap:5px;min-width:0;display:flex}.S48bLa_railCopy strong{text-overflow:ellipsis;white-space:nowrap;font-family:Georgia,Times New Roman,serif;font-size:11px;font-weight:700;overflow:hidden}.S48bLa_railCopy small{color:#71818d;font-variant-numeric:tabular-nums;flex:none;font-size:9px}.S48bLa_railMeter{background:#090e12;border-radius:999px;grid-column:2;height:3px;overflow:hidden}.S48bLa_railMeter span{border-radius:inherit;background:#7c6b49;height:100%;display:block}.S48bLa_ledger{background:var(--achievement-panel);min-width:0;padding:15px 16px 17px}.S48bLa_ledgerHeader{justify-content:space-between;align-items:center;gap:12px;min-height:42px;padding-bottom:10px;display:flex}.S48bLa_groupHeading{align-items:center;gap:9px;min-width:0;display:flex}.S48bLa_groupIcon{background:var(--achievement-brass-dark);color:#d8c28f;border:1px solid #655b46;border-radius:7px;flex:none;justify-content:center;align-items:center;width:34px;height:34px;font-size:15px;display:inline-flex}.S48bLa_groupTitle{color:var(--achievement-text);margin:0;font-family:Georgia,Times New Roman,serif;font-size:15px;font-weight:700;line-height:16px}.S48bLa_groupMeta{color:var(--achievement-muted);font-size:10px;line-height:14px}.S48bLa_ledgerCompletion{flex-direction:column;flex:none;align-items:flex-end;display:flex}.S48bLa_ledgerCompletion strong{color:#ddd4bf;font-variant-numeric:tabular-nums;font-family:Georgia,Times New Roman,serif;font-size:16px}.S48bLa_ledgerCompletion span{color:var(--achievement-muted);letter-spacing:.08em;text-transform:uppercase;font-size:8px}.S48bLa_groupProgress{width:100%;height:4px;margin-bottom:13px}.S48bLa_rows{flex-direction:column;gap:8px;display:flex}.S48bLa_row{--rarity-color:var(--achievement-steel);border:1px solid var(--achievement-line);border-left:3px solid var(--rarity-color);background:var(--achievement-card);border-radius:11px;align-items:flex-start;gap:13px;padding:13px;transition:background .16s,border-color .16s,transform .16s;display:flex;position:relative;box-shadow:0 5px 14px #050a0f24}.S48bLa_row:hover{border-color:var(--achievement-line-strong);background:var(--achievement-raised);transform:translateY(-1px)}.S48bLa_rarity-common{--rarity-color:var(--achievement-steel)}.S48bLa_rarity-rare{--rarity-color:var(--achievement-blue)}.S48bLa_rarity-epic{--rarity-color:var(--achievement-violet)}.S48bLa_rarity-legendary{--rarity-color:var(--achievement-brass)}.S48bLa_done{background:#1c2b29}.S48bLa_locked{opacity:.78}.S48bLa_icon{border:1px solid var(--rarity-color);background:var(--achievement-bg);width:44px;height:46px;color:var(--rarity-color);border-radius:9px;flex:none;justify-content:center;align-items:center;font-size:21px;display:inline-flex;position:relative}.S48bLa_icon[data-unlocked=true]{border-color:var(--achievement-brass);background:var(--achievement-brass-dark)}.S48bLa_iconImage{object-fit:contain;width:25px;height:25px}.S48bLa_iconCheck{border:2px solid var(--achievement-card);background:var(--achievement-green);color:#f3f5f2;border-radius:50%;justify-content:center;align-items:center;width:17px;height:17px;font-size:10px;font-weight:800;display:inline-flex;position:absolute;bottom:-5px;right:-5px}.S48bLa_main{flex:1;min-width:0}.S48bLa_rowTop,.S48bLa_nameLine{align-items:center;gap:8px;display:flex}.S48bLa_rowTop{justify-content:space-between}.S48bLa_nameLine{flex-wrap:wrap;min-width:0}.S48bLa_name{color:var(--achievement-text);font-family:Georgia,Times New Roman,serif;font-size:13px;font-weight:700;line-height:20px}.S48bLa_desc{color:#a8b3bc;margin-top:3px;font-size:11px;line-height:1.45}.S48bLa_badge{border:1px solid var(--badge-color,var(--achievement-steel));letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;background:#151e26;border-radius:4px;align-items:center;min-height:19px;padding:1px 7px;font-size:9px;font-weight:650;line-height:15px;display:inline-flex}.S48bLa_badge-common{--badge-color:#596b79;color:#aab4bd}.S48bLa_badge-rare{--badge-color:#426d8f;color:#8fb7d5}.S48bLa_badge-epic{--badge-color:#66547a;color:#ad9abe}.S48bLa_badge-legendary{--badge-color:#75623d;color:#d1b777}.S48bLa_badge-done{--badge-color:#496b54;color:#8db398;background:#18251f}.S48bLa_badge-locked{--badge-color:#3d4c57;color:#83919c;background:#151e26}.S48bLa_barWrap{margin-top:9px}.S48bLa_bar{height:5px}.S48bLa_barFill{background:var(--rarity-color)}.S48bLa_barLabel{color:var(--achievement-muted);font-variant-numeric:tabular-nums;justify-content:space-between;margin-top:4px;font-size:10px;display:flex}.S48bLa_unlockedLine{color:#8db398;margin-top:5px;font-size:10px;font-weight:600}.S48bLa_empty{border:1px dashed var(--achievement-line-strong);background:var(--achievement-panel);color:var(--achievement-muted);text-align:center;border-radius:10px;padding:24px;font-size:12px}@keyframes S48bLa_spin{to{transform:rotate(360deg)}}@media (width<=760px){.S48bLa_archive{flex-direction:column;min-height:0;display:flex}.S48bLa_rail{border-right:0;border-bottom:1px solid var(--achievement-line);padding:10px}.S48bLa_railHeader{padding-bottom:8px}.S48bLa_railList{flex-direction:row;gap:6px;padding:8px 0 1px;overflow-x:auto}.S48bLa_railItem{flex:none;width:164px}.S48bLa_ledger{padding:14px}}@media (width<=620px){.S48bLa_hero{border-radius:13px;padding:17px}.S48bLa_heroIcon{width:46px;height:46px;font-size:23px}.S48bLa_ring{width:64px;height:64px}.S48bLa_ringInner{width:48px;height:48px}.S48bLa_ringInner strong{font-size:14px}.S48bLa_toolbar{flex-direction:column;align-items:flex-start}.S48bLa_controls{justify-content:flex-start}.S48bLa_segmented{max-width:100%}.S48bLa_row{padding:11px}}@media (prefers-reduced-motion:reduce){.S48bLa_loadingSpinner,.S48bLa_row,.S48bLa_ringValue,.S48bLa_heroBarFill,.S48bLa_groupProgress div,.S48bLa_barFill{transition:none;animation:none}}";
		const tagId$4 = "@deepseek-ai/dsh-client-ui-achievements/AchievementsSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var AchievementsSection_module_css_default = {
			"ringValue": "S48bLa_ringValue",
			"toolbarCopy": "S48bLa_toolbarCopy",
			"nameLine": "S48bLa_nameLine",
			"badge-common": "S48bLa_badge-common",
			"railCount": "S48bLa_railCount",
			"stats": "S48bLa_stats",
			"iconCheck": "S48bLa_iconCheck",
			"rowTop": "S48bLa_rowTop",
			"heroGlow": "S48bLa_heroGlow",
			"iconImage": "S48bLa_iconImage",
			"sortBtn": "S48bLa_sortBtn",
			"railList": "S48bLa_railList",
			"filterBtn": "S48bLa_filterBtn",
			"loadFailure": "S48bLa_loadFailure",
			"ringInner": "S48bLa_ringInner",
			"groupMeta": "S48bLa_groupMeta",
			"badge-epic": "S48bLa_badge-epic",
			"badge-locked": "S48bLa_badge-locked",
			"barLabel": "S48bLa_barLabel",
			"unlockedLine": "S48bLa_unlockedLine",
			"loading": "S48bLa_loading",
			"badge": "S48bLa_badge",
			"ringGraphic": "S48bLa_ringGraphic",
			"groupProgress": "S48bLa_groupProgress",
			"badge-rare": "S48bLa_badge-rare",
			"heroIcon": "S48bLa_heroIcon",
			"segmented": "S48bLa_segmented",
			"rarity-epic": "S48bLa_rarity-epic",
			"badge-legendary": "S48bLa_badge-legendary",
			"loadFailureIcon": "S48bLa_loadFailureIcon",
			"railTitle": "S48bLa_railTitle",
			"row": "S48bLa_row",
			"ring": "S48bLa_ring",
			"controls": "S48bLa_controls",
			"toolbarLabel": "S48bLa_toolbarLabel",
			"toolbar": "S48bLa_toolbar",
			"groupTitle": "S48bLa_groupTitle",
			"kicker": "S48bLa_kicker",
			"hero": "S48bLa_hero",
			"deepBtn": "S48bLa_deepBtn",
			"sortActive": "S48bLa_sortActive",
			"spin": "S48bLa_spin",
			"stat": "S48bLa_stat",
			"bar": "S48bLa_bar",
			"name": "S48bLa_name",
			"railIcon": "S48bLa_railIcon",
			"barWrap": "S48bLa_barWrap",
			"heroSubtitle": "S48bLa_heroSubtitle",
			"rarity-common": "S48bLa_rarity-common",
			"ringTrack": "S48bLa_ringTrack",
			"empty": "S48bLa_empty",
			"ledgerHeader": "S48bLa_ledgerHeader",
			"toolbarCount": "S48bLa_toolbarCount",
			"railHeader": "S48bLa_railHeader",
			"groupIcon": "S48bLa_groupIcon",
			"ledgerCompletion": "S48bLa_ledgerCompletion",
			"desc": "S48bLa_desc",
			"railCopy": "S48bLa_railCopy",
			"barFill": "S48bLa_barFill",
			"icon": "S48bLa_icon",
			"heroTitle": "S48bLa_heroTitle",
			"filterActive": "S48bLa_filterActive",
			"deepActive": "S48bLa_deepActive",
			"railItem": "S48bLa_railItem",
			"rows": "S48bLa_rows",
			"railMeter": "S48bLa_railMeter",
			"locked": "S48bLa_locked",
			"main": "S48bLa_main",
			"loadingSpinner": "S48bLa_loadingSpinner",
			"heroBarFill": "S48bLa_heroBarFill",
			"archive": "S48bLa_archive",
			"badge-done": "S48bLa_badge-done",
			"done": "S48bLa_done",
			"rail": "S48bLa_rail",
			"heroTop": "S48bLa_heroTop",
			"ledger": "S48bLa_ledger",
			"heroCopy": "S48bLa_heroCopy",
			"groupHeading": "S48bLa_groupHeading",
			"heroBar": "S48bLa_heroBar",
			"railItemActive": "S48bLa_railItemActive",
			"section": "S48bLa_section",
			"rarity-legendary": "S48bLa_rarity-legendary",
			"rarity-rare": "S48bLa_rarity-rare"
		};
		//#endregion
		//#region lib/types/client/AchievementsSection.js
		/**
		* Achievements gallery: the settings-section page. Fetches the achievements
		* snapshot on mount through the inject face's Remote-backed `list` callback,
		* then renders a themed overview, progress groups, and rarity-aware cards.
		*/
		const CATEGORY_ORDER = [
			"getting-started",
			"toolsmith",
			"filecraft",
			"orchestration",
			"goals",
			"skill",
			"model",
			"behavior",
			"crossover",
			"hidden"
		];
		/** Rarity tiers in ascending difficulty for the by-rarity sort. */
		const RARITY_ORDER = [
			"common",
			"rare",
			"epic",
			"legendary"
		];
		const CATEGORY_ICONS = {
			"getting-started": "✦",
			toolsmith: "⚒",
			filecraft: "✎",
			orchestration: "✧",
			goals: "◎",
			skill: "⌘",
			model: "🧠",
			behavior: "🌱",
			crossover: "⟲",
			hidden: "◌"
		};
		const RARITY_ICONS = {
			common: "○",
			rare: "◇",
			epic: "✦",
			legendary: "♛"
		};
		/** Emoji icon via Twemoji CDN with a text fallback on load failure. */
		function Icon({ icon }) {
			const [failed, setFailed] = (0, react.useState)(false);
			if (failed) return (0, react_jsx_runtime.jsx)("span", { children: icon });
			return (0, react_jsx_runtime.jsx)("img", {
				className: AchievementsSection_module_css_default.iconImage,
				src: `${TWEMOJI_BASE}${twemojiPath(icon)}.svg`,
				alt: icon,
				loading: "lazy",
				onError: () => {
					setFailed(true);
				}
			});
		}
		function completionOf(current, total) {
			if (total <= 0) return 0;
			return Math.min(100, Math.round(current / total * 100));
		}
		function statusMatches(a, filter) {
			if (filter === "all") return true;
			return filter === "unlocked" ? a.unlocked : !a.unlocked;
		}
		/** One achievement card. */
		function Row({ a, t }) {
			const hiddenLocked = a.hidden && !a.unlocked;
			const deepLocked = a.deepLocked && !a.unlocked;
			const name = hiddenLocked ? "？？？" : a.name;
			const desc = hiddenLocked ? t("hidden") : deepLocked ? t("deepLocked") : a.desc;
			const rarityClass = AchievementsSection_module_css_default[`rarity-${a.rarity}`] ?? AchievementsSection_module_css_default["rarity-common"];
			const rowClass = `${AchievementsSection_module_css_default.row} ${rarityClass} ${a.unlocked ? AchievementsSection_module_css_default.done : ""} ${hiddenLocked || deepLocked || !a.unlocked ? AchievementsSection_module_css_default.locked : ""}`;
			const badgeClass = hiddenLocked ? AchievementsSection_module_css_default["badge-locked"] : AchievementsSection_module_css_default[`badge-${a.rarity}`] ?? AchievementsSection_module_css_default["badge-common"];
			const progress = completionOf(a.progress.current, a.progress.target);
			const statusBadge = a.unlocked ? (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-done"]}`,
				children: t("done")
			}) : deepLocked ? (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: t("deepHint")
			}) : a.progress.target > 1 ? (0, react_jsx_runtime.jsxs)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: [
					a.progress.current,
					" / ",
					a.progress.target
				]
			}) : (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: t("todo")
			});
			const bar = !hiddenLocked && !deepLocked && a.progress.target > 1 && !a.unlocked ? (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.barWrap,
				children: [(0, react_jsx_runtime.jsx)("div", {
					className: AchievementsSection_module_css_default.bar,
					"aria-hidden": "true",
					children: (0, react_jsx_runtime.jsx)("div", {
						className: AchievementsSection_module_css_default.barFill,
						style: { width: `${progress}%` }
					})
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.barLabel,
					children: [(0, react_jsx_runtime.jsx)("span", { children: t("progress") }), (0, react_jsx_runtime.jsxs)("span", { children: [
						a.progress.current,
						" / ",
						a.progress.target
					] })]
				})]
			}) : null;
			return (0, react_jsx_runtime.jsxs)("article", {
				className: rowClass,
				"data-rarity": a.rarity,
				"data-unlocked": a.unlocked,
				children: [(0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.icon,
					"data-unlocked": a.unlocked,
					children: [hiddenLocked ? (0, react_jsx_runtime.jsx)("span", { children: "?" }) : (0, react_jsx_runtime.jsx)(Icon, { icon: a.icon }), a.unlocked && (0, react_jsx_runtime.jsx)("span", {
						className: AchievementsSection_module_css_default.iconCheck,
						"aria-hidden": "true",
						children: "✓"
					})]
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.main,
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.rowTop,
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.nameLine,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.name,
									children: name
								}), (0, react_jsx_runtime.jsx)("span", {
									className: `${AchievementsSection_module_css_default.badge} ${badgeClass}`,
									children: hiddenLocked ? t("hiddenDesc") : t(`rarity.${a.rarity}`)
								})]
							}), statusBadge]
						}),
						(0, react_jsx_runtime.jsx)("div", {
							className: AchievementsSection_module_css_default.desc,
							children: desc
						}),
						bar,
						a.unlocked && (0, react_jsx_runtime.jsx)("div", {
							className: AchievementsSection_module_css_default.unlockedLine,
							children: (0, react_jsx_runtime.jsxs)("span", { children: ["✓ ", t("unlockedHint")] })
						})
					]
				})]
			});
		}
		/** Full settings-section gallery over the achievements Remote namespace. */
		function AchievementsSection({ list, deepState, setDeepInsights, t }) {
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [mode, setMode] = (0, react.useState)("category");
			const [status, setStatus] = (0, react.useState)("all");
			const [deepEnabled, setDeepEnabled] = (0, react.useState)(false);
			const [activeGroupId, setActiveGroupId] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				let alive = true;
				list().then((result) => {
					if (alive && result.ok) setSnapshot(result.value);
				}).catch(() => {
					if (alive) setSnapshot(null);
				});
				if (deepState !== void 0) deepState().then((result) => {
					if (alive && result.ok) setDeepEnabled(result.value.enabled);
				}).catch(() => {
					if (alive) setDeepEnabled(false);
				});
				return () => {
					alive = false;
				};
			}, [list, deepState]);
			if (snapshot === null) return (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.loading,
				role: "status",
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: AchievementsSection_module_css_default.loadingSpinner,
					"aria-hidden": "true"
				}), t("loading")]
			});
			const toggleDeep = () => {
				if (setDeepInsights === void 0) return;
				setDeepInsights(!deepEnabled).then((result) => {
					if (result.ok) setDeepEnabled(result.value.enabled);
				}).catch(() => {});
			};
			const unlocked = snapshot.unlocked;
			const remaining = Math.max(0, snapshot.total - unlocked);
			const completion = completionOf(unlocked, snapshot.total);
			const visibleCount = snapshot.achievements.filter((a) => statusMatches(a, status)).length;
			const visibleGroups = (mode === "category" ? CATEGORY_ORDER.map((id) => ({
				id,
				label: t(`cat.${id}`),
				icon: CATEGORY_ICONS[id],
				all: snapshot.achievements.filter((a) => a.category === id)
			})) : RARITY_ORDER.map((id) => ({
				id,
				label: t(`rarity.${id}`),
				icon: RARITY_ICONS[id],
				all: snapshot.achievements.filter((a) => a.rarity === id)
			}))).map((group) => {
				const items = group.all.filter((a) => statusMatches(a, status));
				const groupUnlocked = group.all.filter((a) => a.unlocked).length;
				return {
					...group,
					items,
					groupUnlocked,
					groupCompletion: completionOf(groupUnlocked, group.all.length)
				};
			}).filter((group) => group.items.length > 0);
			const activeGroup = visibleGroups.find((group) => group.id === activeGroupId) ?? visibleGroups[0];
			return (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.section,
				children: [
					(0, react_jsx_runtime.jsxs)("section", {
						className: AchievementsSection_module_css_default.hero,
						"aria-labelledby": "achievements-overview-title",
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.heroGlow,
								"aria-hidden": "true"
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.heroTop,
								children: [
									(0, react_jsx_runtime.jsx)("div", {
										className: AchievementsSection_module_css_default.heroIcon,
										"aria-hidden": "true",
										children: "🏆"
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.heroCopy,
										children: [
											(0, react_jsx_runtime.jsx)("div", {
												className: AchievementsSection_module_css_default.kicker,
												children: t("kicker")
											}),
											(0, react_jsx_runtime.jsx)("h2", {
												className: AchievementsSection_module_css_default.heroTitle,
												id: "achievements-overview-title",
												children: t("title")
											}),
											(0, react_jsx_runtime.jsx)("p", {
												className: AchievementsSection_module_css_default.heroSubtitle,
												children: t("subtitle")
											})
										]
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.ring,
										"aria-label": `${completion}% ${t("complete")}`,
										children: [(0, react_jsx_runtime.jsxs)("svg", {
											className: AchievementsSection_module_css_default.ringGraphic,
											viewBox: "0 0 44 44",
											"aria-hidden": "true",
											children: [(0, react_jsx_runtime.jsx)("circle", {
												className: AchievementsSection_module_css_default.ringTrack,
												cx: "22",
												cy: "22",
												r: "19"
											}), (0, react_jsx_runtime.jsx)("circle", {
												className: AchievementsSection_module_css_default.ringValue,
												cx: "22",
												cy: "22",
												r: "19",
												pathLength: "100",
												strokeDasharray: `${completion} 100`
											})]
										}), (0, react_jsx_runtime.jsxs)("div", {
											className: AchievementsSection_module_css_default.ringInner,
											children: [(0, react_jsx_runtime.jsxs)("strong", { children: [completion, "%"] }), (0, react_jsx_runtime.jsx)("span", { children: t("complete") })]
										})]
									})
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.stats,
								children: [
									(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [(0, react_jsx_runtime.jsx)("strong", { children: unlocked }), (0, react_jsx_runtime.jsx)("span", { children: t("stats.unlocked") })]
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [(0, react_jsx_runtime.jsx)("strong", { children: snapshot.total }), (0, react_jsx_runtime.jsx)("span", { children: t("stats.total") })]
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [(0, react_jsx_runtime.jsx)("strong", { children: remaining }), (0, react_jsx_runtime.jsx)("span", { children: t("stats.remaining") })]
									})
								]
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.heroBar,
								"aria-hidden": "true",
								children: (0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.heroBarFill,
									style: { width: `${completion}%` }
								})
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.toolbar,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.toolbarCopy,
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.toolbarLabel,
								children: t("browse")
							}), (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.toolbarCount,
								children: t("visibleCount", { count: visibleCount })
							})]
						}), (0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.controls,
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.segmented,
									role: "tablist",
									"aria-label": t("sort.label"),
									children: [(0, react_jsx_runtime.jsx)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "category",
										className: `${AchievementsSection_module_css_default.sortBtn} ${mode === "category" ? AchievementsSection_module_css_default.sortActive : ""}`,
										onClick: () => {
											setMode("category");
										},
										children: t("sort.byCategory")
									}), (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "rarity",
										className: `${AchievementsSection_module_css_default.sortBtn} ${mode === "rarity" ? AchievementsSection_module_css_default.sortActive : ""}`,
										onClick: () => {
											setMode("rarity");
										},
										children: t("sort.byRarity")
									})]
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.segmented,
									role: "group",
									"aria-label": t("filter.label"),
									children: [
										"all",
										"unlocked",
										"locked"
									].map((value) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": status === value,
										className: `${AchievementsSection_module_css_default.filterBtn} ${status === value ? AchievementsSection_module_css_default.filterActive : ""}`,
										onClick: () => {
											setStatus(value);
										},
										children: t(`filter.${value}`)
									}, value))
								}),
								(0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": deepEnabled,
									className: `${AchievementsSection_module_css_default.deepBtn} ${deepEnabled ? AchievementsSection_module_css_default.deepActive : ""}`,
									onClick: toggleDeep,
									title: t("settings.deepDesc"),
									children: [
										t("settings.deepTitle"),
										" · ",
										deepEnabled ? t("settings.deepDisable") : t("settings.deepEnable")
									]
								})
							]
						})]
					}),
					activeGroup && (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.archive,
						children: [(0, react_jsx_runtime.jsxs)("nav", {
							className: AchievementsSection_module_css_default.rail,
							"aria-label": mode === "category" ? t("sort.byCategory") : t("sort.byRarity"),
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.railHeader,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.railTitle,
									children: mode === "category" ? t("sort.byCategory") : t("sort.byRarity")
								}), (0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.railCount,
									children: visibleGroups.length
								})]
							}), (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.railList,
								children: visibleGroups.map((group) => {
									const active = group.id === activeGroup.id;
									return (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: `${AchievementsSection_module_css_default.railItem} ${active ? AchievementsSection_module_css_default.railItemActive : ""}`,
										"aria-current": active ? "page" : void 0,
										onClick: () => {
											setActiveGroupId(group.id);
										},
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												className: AchievementsSection_module_css_default.railIcon,
												"aria-hidden": "true",
												children: group.icon
											}),
											(0, react_jsx_runtime.jsxs)("span", {
												className: AchievementsSection_module_css_default.railCopy,
												children: [(0, react_jsx_runtime.jsx)("strong", { children: group.label }), (0, react_jsx_runtime.jsxs)("small", { children: [
													group.groupUnlocked,
													" / ",
													group.all.length
												] })]
											}),
											(0, react_jsx_runtime.jsx)("span", {
												className: AchievementsSection_module_css_default.railMeter,
												"aria-hidden": "true",
												children: (0, react_jsx_runtime.jsx)("span", { style: { width: `${group.groupCompletion}%` } })
											})
										]
									}, group.id);
								})
							})]
						}), (0, react_jsx_runtime.jsxs)("section", {
							className: AchievementsSection_module_css_default.ledger,
							"aria-labelledby": `achievement-group-${activeGroup.id}`,
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.ledgerHeader,
									children: [(0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.groupHeading,
										children: [(0, react_jsx_runtime.jsx)("span", {
											className: AchievementsSection_module_css_default.groupIcon,
											"aria-hidden": "true",
											children: activeGroup.icon
										}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", {
											className: AchievementsSection_module_css_default.groupTitle,
											id: `achievement-group-${activeGroup.id}`,
											children: activeGroup.label
										}), (0, react_jsx_runtime.jsxs)("span", {
											className: AchievementsSection_module_css_default.groupMeta,
											children: [
												activeGroup.groupUnlocked,
												" / ",
												activeGroup.all.length,
												" ",
												t("stats.unlocked")
											]
										})] })]
									}), (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.ledgerCompletion,
										children: [(0, react_jsx_runtime.jsxs)("strong", { children: [activeGroup.groupCompletion, "%"] }), (0, react_jsx_runtime.jsx)("span", { children: t("complete") })]
									})]
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.groupProgress,
									"aria-hidden": "true",
									children: (0, react_jsx_runtime.jsx)("div", { style: { width: `${activeGroup.groupCompletion}%` } })
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.rows,
									children: activeGroup.items.map((a) => (0, react_jsx_runtime.jsx)(Row, {
										a,
										t
									}, a.id))
								})
							]
						})]
					}),
					visibleCount === 0 && (0, react_jsx_runtime.jsx)("div", {
						className: AchievementsSection_module_css_default.empty,
						children: t("empty")
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\dock.module.css.mjs
		const css$3 = ".ySutMG_dock{color:#a8b3bc;background:#17212b;border:1px solid #3b4b57;border-radius:999px;align-items:center;gap:7px;max-width:min(100%,420px);min-height:26px;padding:3px 10px 3px 5px;font-size:11px;line-height:18px;display:inline-flex;overflow:hidden;box-shadow:0 4px 12px #050a0f2e}.ySutMG_icon{color:#d8c28f;background:#3b3427;border:1px solid #b89a61;border-radius:50%;flex:none;justify-content:center;align-items:center;width:20px;height:20px;font-size:11px;display:inline-flex}.ySutMG_summary{color:#ddd4bf;font-variant-numeric:tabular-nums;flex:none;font-family:Georgia,Times New Roman,serif;font-weight:700}.ySutMG_combo{color:#c6ae78;background:#302b22;border:1px solid #655b46;border-radius:999px;flex:none;padding:0 6px;font-size:10px;font-weight:700}.ySutMG_next{color:#8fa2b1;text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}";
		const tagId$3 = "@deepseek-ai/dsh-client-ui-achievements/dock.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var dock_module_css_default = {
			"dock": "ySutMG_dock",
			"combo": "ySutMG_combo",
			"next": "ySutMG_next",
			"icon": "ySutMG_icon",
			"summary": "ySutMG_summary"
		};
		//#endregion
		//#region lib/types/client/dock.js
		/** The composer dock entry (renders nothing until the first poll lands). */
		function DockReadout({ useSnapshot, t }) {
			const dock = useSnapshot((s) => s.dock);
			if (dock === null) return null;
			const combo = dock.streak >= 2 ? t("dock.combo", { count: dock.streak }) : "";
			const next = dock.next === null ? t("dock.complete") : t("dock.next", {
				name: dock.next.name,
				current: dock.next.current,
				target: dock.next.target
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: dock_module_css_default.dock,
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.icon,
						"aria-hidden": "true",
						children: "🏆"
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.summary,
						children: t("dock.summary", {
							unlocked: dock.unlocked,
							total: dock.total
						})
					}),
					combo && (0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.combo,
						children: combo
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.next,
						title: next,
						children: next
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\gallery.module.css.mjs
		const css$2 = ".Odo5Oq_backdrop{z-index:60;pointer-events:auto;backdrop-filter:blur(8px);background:#060a0ec7;justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}.Odo5Oq_panel{color:#e5e9ec;pointer-events:auto;--dsh-scrollbar-thumb:#3b4b57;--dsh-scrollbar-thumb-hover:#526674;background:#111a22;border:1px solid #4b4435;border-radius:17px;flex-direction:column;width:min(980px,100%);max-height:min(88vh,900px);padding:21px;animation:.2s ease-out Odo5Oq_rise;display:flex;position:relative;overflow:auto;box-shadow:0 24px 64px #00000073}.Odo5Oq_panel:before{content:\"\";background:#655b46;height:1px;position:absolute;top:0;left:22px;right:22px}.Odo5Oq_head{justify-content:space-between;align-items:center;gap:12px;margin-bottom:17px;display:flex}.Odo5Oq_heading{align-items:center;gap:11px;min-width:0;display:flex}.Odo5Oq_headingIcon{color:#d8c28f;background:#3b3427;border:1px solid #b89a61;border-radius:9px;flex:none;justify-content:center;align-items:center;width:40px;height:40px;font-size:20px;display:inline-flex}.Odo5Oq_heading>div{flex-direction:column;gap:1px;display:flex}.Odo5Oq_kicker{color:#b89a61;letter-spacing:.18em;text-transform:uppercase;font-size:9px;font-weight:700}.Odo5Oq_title{color:#f0ece2;font-family:Georgia,Times New Roman,serif;font-size:18px;font-weight:700;line-height:23px}.Odo5Oq_close{color:#8996a0;cursor:pointer;width:31px;height:31px;font:inherit;background:0 0;border:1px solid #0000;border-radius:7px;flex:none;justify-content:center;align-items:center;font-size:22px;line-height:1;transition:background .14s,border-color .14s,color .14s;display:inline-flex}.Odo5Oq_close:hover{color:#d8c28f;background:#252a2c;border-color:#4b4435}.Odo5Oq_close:focus-visible{outline-offset:2px;outline:2px solid #b89a61}@keyframes Odo5Oq_rise{0%{opacity:0;transform:translateY(8px)scale(.985)}to{opacity:1;transform:none}}@media (width<=620px){.Odo5Oq_backdrop{align-items:flex-end;padding:10px}.Odo5Oq_panel{border-radius:14px;max-height:92vh;padding:17px}}@media (prefers-reduced-motion:reduce){.Odo5Oq_panel,.Odo5Oq_close{transition:none;animation:none}}";
		const tagId$2 = "@deepseek-ai/dsh-client-ui-achievements/gallery.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var gallery_module_css_default = {
			"close": "Odo5Oq_close",
			"head": "Odo5Oq_head",
			"rise": "Odo5Oq_rise",
			"panel": "Odo5Oq_panel",
			"kicker": "Odo5Oq_kicker",
			"title": "Odo5Oq_title",
			"backdrop": "Odo5Oq_backdrop",
			"heading": "Odo5Oq_heading",
			"headingIcon": "Odo5Oq_headingIcon"
		};
		//#endregion
		//#region lib/types/client/gallery.js
		/**
		* Achievements gallery overlay: the trophy-toggled full gallery in
		* `shell.overlay`. Reuses the settings-section gallery component; the backdrop
		* opts back into pointer events to trap the click-away.
		*/
		/** The trophy-toggled gallery overlay (renders nothing while closed). */
		function GalleryOverlay({ useSnapshot, close, list, deepState, setDeepInsights, t }) {
			const open = useSnapshot((s) => s.galleryOpen);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onKeyDown = (event) => {
					if (event.key === "Escape") close();
				};
				window.addEventListener("keydown", onKeyDown);
				return () => {
					window.removeEventListener("keydown", onKeyDown);
				};
			}, [close, open]);
			if (!open) return null;
			return (0, react_jsx_runtime.jsx)("div", {
				className: gallery_module_css_default.backdrop,
				onClick: close,
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: gallery_module_css_default.panel,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "achievements-gallery-title",
					onClick: (e) => {
						e.stopPropagation();
					},
					children: [(0, react_jsx_runtime.jsxs)("div", {
						className: gallery_module_css_default.head,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: gallery_module_css_default.heading,
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: gallery_module_css_default.headingIcon,
								"aria-hidden": "true",
								children: "🏆"
							}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", {
								className: gallery_module_css_default.kicker,
								children: t("kicker")
							}), (0, react_jsx_runtime.jsx)("span", {
								className: gallery_module_css_default.title,
								id: "achievements-gallery-title",
								children: t("title")
							})] })]
						}), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: gallery_module_css_default.close,
							onClick: close,
							"aria-label": t("gallery.close"),
							children: "×"
						})]
					}), (0, react_jsx_runtime.jsx)(AchievementsSection, {
						list,
						...deepState !== void 0 ? { deepState } : {},
						...setDeepInsights !== void 0 ? { setDeepInsights } : {},
						t
					})]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\toast.module.css.mjs
		const css$1 = "._4q_60W_stack{z-index:50;pointer-events:none;flex-direction:column;gap:10px;display:flex;position:fixed;bottom:18px;right:18px}._4q_60W_toast{--toast-rarity:#6f9fc4;border:1px solid #3b4b57;border-left:4px solid var(--toast-rarity);color:#e5e9ec;pointer-events:auto;background:#17212b;border-radius:12px;align-items:center;gap:12px;width:min(340px,100vw - 36px);padding:13px 40px 13px 13px;animation:.22s ease-out _4q_60W_pop;display:flex;position:relative;overflow:hidden;box-shadow:0 14px 30px #00000052}._4q_60W_rarity-common{--toast-rarity:#8998a6}._4q_60W_rarity-rare{--toast-rarity:#6f9fc4}._4q_60W_rarity-epic{--toast-rarity:#917aa8}._4q_60W_rarity-legendary{--toast-rarity:#b89a61}._4q_60W_icon{border:1px solid var(--toast-rarity);width:42px;height:44px;color:var(--toast-rarity);background:#10171e;border-radius:9px;flex:none;justify-content:center;align-items:center;font-size:22px;display:inline-flex}._4q_60W_copy{min-width:0}._4q_60W_eyebrow{color:var(--toast-rarity);letter-spacing:.14em;text-transform:uppercase;font-size:9px;font-weight:700}._4q_60W_title{color:#f0ece2;text-overflow:ellipsis;white-space:nowrap;font-family:Georgia,Times New Roman,serif;font-size:14px;font-weight:700;line-height:19px;overflow:hidden}._4q_60W_sub{color:#96a4af;font-size:10px;line-height:15px}._4q_60W_close{color:#8996a0;cursor:pointer;width:22px;height:22px;font:inherit;background:0 0;border:1px solid #0000;border-radius:6px;justify-content:center;align-items:center;font-size:17px;display:inline-flex;position:absolute;top:8px;right:8px}._4q_60W_close:hover{color:#e5e9ec;background:#22313d;border-color:#3b4b57}._4q_60W_close:focus-visible{outline:2px solid var(--toast-rarity);outline-offset:1px}._4q_60W_confetti{z-index:70;pointer-events:none;position:fixed;inset:0;overflow:hidden}._4q_60W_piece{opacity:.9;border-radius:2px;width:8px;height:14px;animation-name:_4q_60W_fall;animation-timing-function:ease-in;animation-fill-mode:forwards;position:absolute;top:-14px}@keyframes _4q_60W_fall{0%{opacity:1;transform:translateY(0)rotate(0)}to{opacity:.35;transform:translateY(105vh)rotate(720deg)}}@keyframes _4q_60W_pop{0%{opacity:0;transform:translateY(8px)scale(.98)}to{opacity:1;transform:none}}@media (width<=620px){._4q_60W_stack{bottom:10px;right:10px}}@media (prefers-reduced-motion:reduce){._4q_60W_piece,._4q_60W_toast{animation:none}}";
		const tagId$1 = "@deepseek-ai/dsh-client-ui-achievements/toast.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var toast_module_css_default = {
			"eyebrow": "_4q_60W_eyebrow",
			"stack": "_4q_60W_stack",
			"pop": "_4q_60W_pop",
			"piece": "_4q_60W_piece",
			"close": "_4q_60W_close",
			"sub": "_4q_60W_sub",
			"title": "_4q_60W_title",
			"rarity-rare": "_4q_60W_rarity-rare",
			"rarity-legendary": "_4q_60W_rarity-legendary",
			"toast": "_4q_60W_toast",
			"fall": "_4q_60W_fall",
			"rarity-common": "_4q_60W_rarity-common",
			"copy": "_4q_60W_copy",
			"icon": "_4q_60W_icon",
			"rarity-epic": "_4q_60W_rarity-epic",
			"confetti": "_4q_60W_confetti"
		};
		//#endregion
		//#region lib/types/client/toast.js
		const RARITY_LABEL = {
			common: "rarity.common",
			rare: "rarity.rare",
			epic: "rarity.epic",
			legendary: "rarity.legendary"
		};
		/** Confetti piece palette (rarity-agnostic, reused by the toast burst). */
		const CONFETTI_COLORS = [
			"#60a5fa",
			"#a78bfa",
			"#fbbf24",
			"#4ade80",
			"#f87171",
			"#22d3ee",
			"#f472b6",
			"#facc15"
		];
		/** One transient unlock card. */
		function Toast({ toast, t, onDismiss }) {
			const celebratory = toast.rarity === "epic" || toast.rarity === "legendary";
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [celebratory && (0, react_jsx_runtime.jsx)(Confetti, {}), (0, react_jsx_runtime.jsxs)("div", {
				className: `${toast_module_css_default.toast} ${toast_module_css_default[`rarity-${toast.rarity}`]}`,
				role: "status",
				children: [
					(0, react_jsx_runtime.jsx)("div", {
						className: toast_module_css_default.icon,
						children: toast.icon
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: toast_module_css_default.copy,
						children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.eyebrow,
								children: t("toast.sub")
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.title,
								children: toast.name
							}),
							(0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.sub,
								children: t(RARITY_LABEL[toast.rarity])
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: toast_module_css_default.close,
						onClick: onDismiss,
						"aria-label": t("toast.close"),
						children: "×"
					})
				]
			})] });
		}
		/** A one-shot confetti burst (pure CSS keyframes). */
		function Confetti() {
			return (0, react_jsx_runtime.jsx)("div", {
				className: toast_module_css_default.confetti,
				children: Array.from({ length: 60 }, (_, i) => (0, react_jsx_runtime.jsx)("span", {
					className: toast_module_css_default.piece,
					style: {
						left: `${i * 37 % 101}%`,
						background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
						animationDelay: `${i % 12 * .05}s`,
						animationDuration: `${2.4 + i % 9 * .16}s`,
						transform: `rotate(${i * 47 % 360}deg)`
					}
				}, i))
			});
		}
		/** The toast stack entry (renders nothing when no toast is live). */
		function ToastStack({ useSnapshot, dismiss, t }) {
			const toasts = useSnapshot((s) => s.toasts);
			if (toasts.length === 0) return null;
			return (0, react_jsx_runtime.jsx)("div", {
				className: toast_module_css_default.stack,
				children: toasts.map((toast) => (0, react_jsx_runtime.jsx)(Toast, {
					toast,
					t,
					onDismiss: () => {
						dismiss(toast.clientAt);
					}
				}, toast.clientAt))
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\trophy.module.css.mjs
		const css = ".AnwqOW_trophy{color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;background:0 0;border:1px solid #0000;border-radius:9px;align-items:center;gap:8px;padding:6px 8px;font-size:16px;transition:background .14s,border-color .14s,transform .14s;display:flex;position:relative}.AnwqOW_trophy:hover{background:#1c2832;border-color:#3b4b57;transform:translateY(-1px)}.AnwqOW_trophy[aria-pressed=true]{background:#302b22;border-color:#655b46}.AnwqOW_trophy:focus-visible{outline-offset:2px;outline:2px solid #b89a61}.AnwqOW_icon{color:#d8c28f;background:#3b3427;border:1px solid #b89a61;border-radius:7px;justify-content:center;align-items:center;width:23px;height:23px;font-size:14px;display:inline-flex}.AnwqOW_label{color:#c5cdd3;font-family:Georgia,Times New Roman,serif;font-size:12px;font-weight:700}.AnwqOW_badge{border:2px solid var(--dsw-alias-bg-base);color:#17130d;background:#b89a61;border-radius:999px;justify-content:center;align-items:center;min-width:17px;height:17px;padding:0 4px;font-size:10px;font-weight:800;line-height:13px;animation:.2s ease-out AnwqOW_badgeIn;display:inline-flex;position:absolute;top:-4px;right:-3px}@keyframes AnwqOW_badgeIn{0%{opacity:0;transform:scale(.75)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.AnwqOW_trophy{transition:none}.AnwqOW_badge{animation:none}}";
		const tagId = "@deepseek-ai/dsh-client-ui-achievements/trophy.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var trophy_module_css_default = {
			"badgeIn": "AnwqOW_badgeIn",
			"trophy": "AnwqOW_trophy",
			"icon": "AnwqOW_icon",
			"badge": "AnwqOW_badge",
			"label": "AnwqOW_label"
		};
		//#endregion
		//#region lib/types/client/trophy.js
		/** The sidebar footer trophy entry. */
		function Trophy({ useSnapshot, toggle, wide, t }) {
			const newCount = useSnapshot((s) => s.newCount);
			const open = useSnapshot((s) => s.galleryOpen);
			return (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: trophy_module_css_default.trophy,
				onClick: toggle,
				title: t("nav"),
				"aria-label": t("nav"),
				"aria-pressed": open,
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.icon,
						children: "🏆"
					}),
					wide && (0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.label,
						children: t("nav")
					}),
					newCount > 0 && (0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.badge,
						children: newCount
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/store.js
		/**
		* Achievements client store: transient viewing state shared across the toast
		* stack, sidebar trophy, gallery overlay, and composer dock. The Host stays
		* the single fact source — the apply world polls the achievements Remote and
		* feeds this store, components read through the bound selector hook.
		*/
		/** Toast retention window before a card auto-dismisses. */
		const TOAST_TTL_MS = 7e3;
		/** The achievements client controller (one per client plugin apply). */
		var AchievementsStore = class {
			/** The snapshot the surfaces render from (uSES-safe store). */
			store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)({
				dock: null,
				toasts: [],
				newCount: 0,
				galleryOpen: false
			});
			/** Fold a host dock snapshot and a batch of fresh unlocks into the store. */
			ingest(dock, unlocks) {
				const now = Date.now();
				this.store.update((s) => {
					s.dock = dock;
					const retained = s.toasts.filter((t) => now - t.clientAt < TOAST_TTL_MS);
					const fresh = unlocks.map((u) => ({
						...u,
						clientAt: now
					}));
					s.toasts = [...retained, ...fresh].slice(-5);
					s.newCount = s.newCount + fresh.length;
				});
			}
			/** Drop every toast whose TTL has elapsed (the poll tick prunes them). */
			prune() {
				const now = Date.now();
				this.store.update((s) => {
					s.toasts = s.toasts.filter((t) => now - t.clientAt < TOAST_TTL_MS);
				});
			}
			/** Remove one toast by identity (dismiss button). */
			dismiss(clientAt) {
				this.store.update((s) => {
					s.toasts = s.toasts.filter((t) => t.clientAt !== clientAt);
				});
			}
			/** Toggle the gallery overlay; opening it clears the unread badge. */
			toggleGallery() {
				this.store.update((s) => {
					s.galleryOpen = !s.galleryOpen;
					if (s.galleryOpen) s.newCount = 0;
				});
			}
			/** Close the gallery overlay. */
			closeGallery() {
				this.store.update((s) => {
					s.galleryOpen = false;
				});
			}
		};
		//#endregion
		//#region lib/types/client/locales.js
		/** `achievements` namespace dictionaries: gallery copy. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"nav": "成就",
			"title": "成就",
			"kicker": "成就收藏",
			"subtitle": "记录每一次工具调用、协作与突破",
			"complete": "完成度",
			"browse": "浏览成就",
			"visibleCount": "共 {count} 项",
			"unlockedHint": "已收入收藏",
			"empty": "没有符合当前筛选条件的成就",
			"stats.unlocked": "已解锁",
			"stats.total": "成就总数",
			"stats.remaining": "待解锁",
			"loading": "加载中…",
			"hidden": "隐藏成就，达成后揭晓",
			"hiddenDesc": "隐藏",
			"done": "✓ 已达成",
			"todo": "未达成",
			"progress": "进度",
			"rarity.common": "普通",
			"rarity.rare": "稀有",
			"rarity.epic": "史诗",
			"rarity.legendary": "传说",
			"cat.getting-started": "启程",
			"cat.toolsmith": "工具大师",
			"cat.filecraft": "文件工匠",
			"cat.orchestration": "编排",
			"cat.goals": "目标",
			"cat.skill": "技能",
			"cat.model": "模型",
			"cat.behavior": "行为",
			"cat.crossover": "联动",
			"cat.hidden": "隐藏",
			"deepLocked": "深度洞察成就，需在设置中启用「深度洞察」后解锁",
			"deepHint": "需启用深度洞察",
			"settings.deepTitle": "深度洞察成就",
			"settings.deepDesc": "允许读取消息正文与历史会话做统计匹配（仅用于成就解锁，不存储、不上传、不影响正常使用）。",
			"settings.deepEnable": "启用深度洞察",
			"settings.deepDisable": "关闭深度洞察",
			"sort.label": "排序方式",
			"filter.label": "筛选状态",
			"sort.byCategory": "按分类",
			"sort.byRarity": "按难度",
			"filter.all": "全部",
			"filter.unlocked": "已解锁",
			"filter.locked": "未解锁",
			"toast.sub": "解锁成就",
			"toast.close": "关闭",
			"gallery.close": "关闭",
			"dock.summary": "🏆 {unlocked}/{total}",
			"dock.combo": " · 🔥 连击 x{count}",
			"dock.next": "下一项：{name} {current}/{target}",
			"dock.complete": "全部达成！"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"nav": "Achievements",
			"title": "Achievements",
			"kicker": "ACHIEVEMENT COLLECTION",
			"subtitle": "Track every tool call, collaboration, and breakthrough",
			"complete": "complete",
			"browse": "Browse achievements",
			"visibleCount": "{count} achievements",
			"unlockedHint": "Added to your collection",
			"empty": "No achievements match the current filter",
			"stats.unlocked": "Unlocked",
			"stats.total": "Total",
			"stats.remaining": "Remaining",
			"loading": "Loading…",
			"hidden": "Hidden achievement, revealed on unlock",
			"hiddenDesc": "Hidden",
			"done": "✓ Unlocked",
			"todo": "Locked",
			"progress": "Progress",
			"rarity.common": "Common",
			"rarity.rare": "Rare",
			"rarity.epic": "Epic",
			"rarity.legendary": "Legendary",
			"cat.getting-started": "Getting started",
			"cat.toolsmith": "Toolsmith",
			"cat.filecraft": "Filecraft",
			"cat.orchestration": "Orchestration",
			"cat.goals": "Goals",
			"cat.skill": "Skills",
			"cat.model": "Models",
			"cat.behavior": "Behavior",
			"cat.crossover": "Crossover",
			"cat.hidden": "Hidden",
			"deepLocked": "Deep-insights achievement; enable \"Deep Insights\" in settings to unlock",
			"deepHint": "Requires deep insights",
			"settings.deepTitle": "Deep Insights Achievements",
			"settings.deepDesc": "Allow reading message bodies and session history for statistical matching (unlock only; never stored or uploaded; does not affect normal use).",
			"settings.deepEnable": "Enable deep insights",
			"settings.deepDisable": "Disable deep insights",
			"sort.label": "Sort by",
			"filter.label": "Filter by status",
			"sort.byCategory": "By category",
			"sort.byRarity": "By rarity",
			"filter.all": "All",
			"filter.unlocked": "Unlocked",
			"filter.locked": "Locked",
			"toast.sub": "Achievement unlocked",
			"toast.close": "Dismiss",
			"gallery.close": "Close",
			"dock.summary": "🏆 {unlocked}/{total}",
			"dock.combo": " · 🔥 Streak x{count}",
			"dock.next": "Next: {name} {current}/{target}",
			"dock.complete": "All done!"
		};
		//#endregion
		//#region lib/types/client/index.js
		/**
		* Achievements browser surface: the settings-section gallery, the trophy
		* footer action, the composer dock readout, and the trophy-toggled gallery
		* overlay plus unlock toast stack. The apply world polls the achievements
		* Remote (`recent` + `dock`) on a timer and feeds one shared store; components
		* read through the bound selector hook and write through the store actions.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "achievements";
		/** Poll cadence for the recent-unlock queue and dock readout. */
		const POLL_MS = 3e3;
		/** Required services: slots, Remote namespace, and copy (timer is optional). */
		const inject = [
			"slots",
			"locale",
			"remote",
			"remote.achievements"
		];
		/**
		* Client plugin body: register the copy and the four surfaces, and start the
		* Remote poll that feeds the shared store.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-achievements: dictionaries");
			const store = new AchievementsStore();
			const useSnapshot = (0, _deepseek_ai_dsh_client_web_react.bindSnapshotSelector)(store.store);
			const t = ctx.locale.bind(NS);
			const list = () => ctx.remote.achievements.list();
			const deepRemote = ctx.remote.achievements;
			const deepState = deepRemote.deepState;
			const setDeepInsights = deepRemote.setDeepInsights;
			const poll = async () => {
				const recent = await ctx.remote.achievements.recent();
				const dock = await ctx.remote.achievements.dock();
				if (recent.ok && dock.ok) store.ingest(dock.value, recent.value.unlocks);
				store.prune();
			};
			const timer = ctx.get("timer");
			if (timer !== void 0) ctx.effect(() => timer.interval(() => {
				poll();
			}, POLL_MS), "ui-achievements: remote poll");
			poll();
			const injected = () => ({
				list,
				...deepState !== void 0 ? { deepState } : {},
				...setDeepInsights !== void 0 ? { setDeepInsights } : {}
			});
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "achievements",
				order: 30,
				label: () => t("nav"),
				locale: NS,
				inject: injected
			}, AchievementsSection));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "achievements-toast",
				order: 100,
				locale: NS,
				inject: () => ({
					useSnapshot,
					dismiss: (clientAt) => {
						store.dismiss(clientAt);
					}
				})
			}, ToastStack));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "achievements-gallery",
				order: 101,
				locale: NS,
				inject: () => ({
					useSnapshot,
					close: () => {
						store.closeGallery();
					},
					list,
					...deepState !== void 0 ? { deepState } : {},
					...setDeepInsights !== void 0 ? { setDeepInsights } : {}
				})
			}, GalleryOverlay));
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "achievements-trophy",
				order: 5,
				locale: NS,
				inject: () => ({
					useSnapshot,
					toggle: () => {
						store.toggleGallery();
					}
				})
			}, Trophy));
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "achievements",
				order: 1,
				locale: NS,
				inject: () => ({ useSnapshot })
			}, DockReadout));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map