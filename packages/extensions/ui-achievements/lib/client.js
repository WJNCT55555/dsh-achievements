window.__ModuleLoader__.load({
	id: "@wjnct55555/dsh-client-ui-achievements",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_web_react = require("@deepseek-ai/dsh-client-web-react");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region src/client/twemoji.ts
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
		const css$4 = "@import \"https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap\";.S48bLa_section{--retro-bg:#050807;--retro-panel:#000;--retro-card:#060b09;--retro-line:#10b98159;--retro-line-strong:#10b981a6;--retro-emerald:#10b981;--retro-emerald-dim:#34d399;--retro-emerald-deep:#064e3b;--retro-text:#f4f7f5;--retro-muted:#c5cfca;--retro-faint:#829089;--retro-amber:#fbbf24;--retro-glow:0 0 15px #10b9811a;width:100%;max-width:896px;color:var(--retro-text);flex-direction:column;gap:24px;font-family:Share Tech Mono,NSimSun,SimSun,monospace;display:flex}.S48bLa_loading{min-height:140px;color:var(--retro-muted);justify-content:center;align-items:center;gap:10px;font-size:12px;display:flex}.S48bLa_loadingSpinner{border:2px solid var(--retro-emerald-deep);border-top-color:var(--retro-emerald);border-radius:50%;width:15px;height:15px;animation:.8s linear infinite S48bLa_spin}.S48bLa_loadFailure{min-height:132px;color:var(--retro-text);background:var(--retro-panel);border:1px solid var(--retro-line-strong);box-shadow:var(--retro-glow);grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:14px;padding:24px;display:grid}.S48bLa_loadFailureIcon{width:34px;height:34px;color:var(--retro-amber);border:1px solid var(--retro-amber);place-items:center;font:700 18px/1 ui-monospace,monospace;display:grid}.S48bLa_loadFailure strong{color:var(--retro-text);font:600 15px/1.3 ui-monospace,monospace}.S48bLa_loadFailure p{color:var(--retro-faint);margin:5px 0 0;font-size:12px;line-height:1.5}.S48bLa_loadFailure button{color:var(--retro-emerald);border:1px solid var(--retro-line-strong);cursor:pointer;background:0 0;padding:8px 12px;font-family:inherit}.S48bLa_loadFailure button:hover{color:#0b0f0d;background:var(--retro-emerald)}.S48bLa_hero{box-shadow:none;background:0 0;border:0;flex-direction:column;gap:18px;padding:0 0 18px;display:flex;position:relative}.S48bLa_heroBadge{display:none}.S48bLa_hero:before,.S48bLa_hero:after,.S48bLa_heroGlow:before,.S48bLa_heroGlow:after{content:none}.S48bLa_hero:before{border-bottom:0;border-right:0;top:-2px;left:-2px}.S48bLa_hero:after{border-bottom:0;border-left:0;top:-2px;right:-2px}.S48bLa_heroGlow:before{border-top:0;border-right:0;bottom:-2px;left:-2px}.S48bLa_heroGlow:after{border-top:0;border-left:0;bottom:-2px;right:-2px}.S48bLa_heroGlow{display:none}.S48bLa_heroTop{align-items:flex-start;gap:24px;display:flex}.S48bLa_heroIcon{display:none}.S48bLa_heroCopy{flex:1;grid-template-columns:auto minmax(0,1fr);align-items:baseline;column-gap:10px;min-width:0;display:grid}.S48bLa_kicker{color:var(--retro-emerald-deep);letter-spacing:.12em;text-transform:uppercase;grid-column:1;font-size:14px;font-weight:400}.S48bLa_kicker:after{content:\" //\"}.S48bLa_heroTitle{color:var(--retro-emerald);letter-spacing:-.04em;text-shadow:0 0 6px #10b98159;grid-area:1/1/auto/-1;margin:0 0 2px;font-family:inherit;font-size:48px;font-weight:700;line-height:1.05}.S48bLa_heroTitle:before{content:none}.S48bLa_heroSubtitle{color:var(--retro-emerald-deep);letter-spacing:.1em;grid-column:2;margin:0;font-size:14px;line-height:1.5}.S48bLa_heroPct{flex-direction:column;flex:none;align-items:flex-end;gap:0;min-width:112px;padding-top:4px;display:flex}.S48bLa_heroPct strong{color:var(--retro-amber);font-variant-numeric:tabular-nums;font-size:36px;line-height:1}.S48bLa_heroPct span{color:#78350f;letter-spacing:.1em;text-transform:uppercase;margin-top:6px;font-size:12px}.S48bLa_stats{border:1px solid var(--retro-line);background:var(--retro-panel);grid-template-columns:repeat(3,1fr);gap:0;display:grid}.S48bLa_stat{background:0 0;flex-direction:column;gap:2px;padding:12px 14px;display:flex}.S48bLa_stat+.S48bLa_stat{border-left:1px solid var(--retro-line)}.S48bLa_stat strong{color:var(--retro-text);font-variant-numeric:tabular-nums;font-size:18px;line-height:22px}.S48bLa_stat strong:before{content:\"› \";color:var(--retro-emerald)}.S48bLa_stat span{color:var(--retro-faint);letter-spacing:.14em;text-transform:uppercase;font-size:11px}.S48bLa_rarityBar{border:1px solid var(--retro-line-strong);background:#020403;height:10px;display:flex;position:relative;overflow:hidden}.S48bLa_rarityBar:after,.S48bLa_groupProgress:after,.S48bLa_bar:after{content:none}.S48bLa_rarityBarSegment{height:100%;transition:width .35s;box-shadow:0 0 6px #10b9814d}.S48bLa_rarityBarSegment:first-child{border-left:0}.S48bLa_groupProgress,.S48bLa_bar{border:1px solid var(--retro-line);background:#020403;position:relative;overflow:hidden}.S48bLa_barFill{background:var(--retro-emerald);height:100%;transition:width .35s;box-shadow:0 0 8px #10b98180}.S48bLa_groupProgress div{background:var(--group-color,var(--retro-emerald));height:100%;box-shadow:0 0 8px color-mix(in srgb, var(--group-color,var(--retro-emerald)) 50%, transparent);transition:width .35s}.S48bLa_groupProgress,.S48bLa_bar{height:6px}.S48bLa_groupProgress{width:100%;margin-bottom:13px}.S48bLa_toolbar{border:1px solid var(--retro-line);background:var(--retro-panel);justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;display:flex}.S48bLa_toolbarCopy{align-items:baseline;gap:8px;min-width:0;display:flex}.S48bLa_toolbarLabel{color:var(--retro-emerald);letter-spacing:.12em;text-transform:uppercase;font-size:12px;font-weight:700}.S48bLa_toolbarCount{color:var(--retro-faint);font-size:12px}.S48bLa_controls{flex-wrap:wrap;justify-content:flex-end;gap:6px;display:flex}.S48bLa_segmented{border:1px solid var(--retro-line);background:#000;gap:2px;padding:2px;display:inline-flex}.S48bLa_sortBtn,.S48bLa_filterBtn{color:var(--retro-faint);cursor:pointer;letter-spacing:.06em;text-transform:uppercase;background:0 0;border:0;padding:2px 9px;font-family:inherit;font-size:12px;line-height:20px;transition:background .14s,color .14s}.S48bLa_sortBtn:hover,.S48bLa_filterBtn:hover{color:var(--retro-emerald-dim)}.S48bLa_sortBtn:focus-visible,.S48bLa_filterBtn:focus-visible{outline:1px solid var(--retro-emerald);outline-offset:1px}.S48bLa_sortActive,.S48bLa_filterActive{color:#020403;background:var(--retro-emerald)}.S48bLa_deepBtn{color:#f87171;cursor:pointer;letter-spacing:.05em;white-space:nowrap;text-transform:uppercase;background:0 0;border:1px solid #ef44449e;min-height:26px;padding:2px 10px;font-family:inherit;font-size:12px;transition:background .14s,color .14s,border-color .14s}.S48bLa_deepBtn:hover{color:#fff;background:#7f1d1d52;border-color:#ef4444}.S48bLa_deepBtn:focus-visible{outline-offset:1px;outline:1px solid #ef4444}.S48bLa_deepActive{color:#fff;background:#991b1b7a;border-color:#ef4444}.S48bLa_clearBtn{color:#fecaca;cursor:pointer;letter-spacing:.05em;white-space:nowrap;text-transform:uppercase;background:#7f1d1d;border:1px solid #dc2626;min-height:26px;padding:2px 10px;font-family:inherit;font-size:12px;transition:background .14s,color .14s,border-color .14s,box-shadow .14s}.S48bLa_clearBtn:hover{color:#fff;background:#991b1b;border-color:#ef4444;box-shadow:0 0 10px #ef444459}.S48bLa_clearBtn:focus-visible{outline-offset:1px;outline:1px solid #ef4444}.S48bLa_clearDialog{z-index:1200;background:#000000b8;place-items:center;display:grid;position:fixed;inset:0}.S48bLa_clearPanel{border:2px solid var(--retro-emerald-deep);background:#000;width:min(380px,100vw - 48px);padding:22px 18px 18px;position:relative;box-shadow:0 0 24px #10b98126}.S48bLa_clearPanelTitle{color:#f87171;letter-spacing:.12em;text-transform:uppercase;background:#000;margin:0 0 10px;padding:0 7px;font-size:12px;font-weight:700;display:inline-block}.S48bLa_clearPanelDesc{color:var(--retro-faint);margin:0 0 16px;font-size:12px;line-height:1.6}.S48bLa_clearPanelActions{justify-content:flex-end;gap:8px;display:flex}.S48bLa_clearCancel{border:1px solid var(--retro-line-strong);min-height:26px;color:var(--retro-faint);cursor:pointer;letter-spacing:.05em;text-transform:uppercase;background:0 0;padding:2px 12px;font-family:inherit;font-size:12px;transition:background .14s,color .14s,border-color .14s}.S48bLa_clearCancel:hover{color:var(--retro-text);border-color:var(--retro-emerald);background:#10b9811a}.S48bLa_archive{min-height:430px;box-shadow:none;background:0 0;border:0;grid-template-columns:minmax(240px,1fr) minmax(0,2fr);gap:24px;display:grid}.S48bLa_rail{border:2px solid var(--retro-emerald-deep);background:#000000e6;min-width:0;padding:22px 16px 16px;position:relative}.S48bLa_railHeader{border-bottom:0;justify-content:space-between;align-items:center;gap:8px;padding:0 0 10px;display:flex}.S48bLa_railTitle{background:var(--retro-bg);color:var(--retro-emerald);letter-spacing:.16em;text-transform:uppercase;padding:0 8px;font-size:12px;font-weight:700;position:absolute;top:-11px;left:16px}.S48bLa_railCount{border:1px solid var(--retro-line-strong);min-width:20px;height:18px;color:var(--retro-emerald-dim);font-variant-numeric:tabular-nums;justify-content:center;align-items:center;margin-left:auto;padding:0 5px;font-size:11px;display:inline-flex}.S48bLa_railList{flex-direction:column;gap:8px;padding-top:4px;display:flex}.S48bLa_railItem{--group-color:var(--retro-emerald);width:100%;color:var(--retro-faint);cursor:pointer;text-align:left;background:0 0;border:1px solid #0000;grid-template-columns:18px minmax(0,1fr);align-items:center;gap:2px 6px;padding:10px 8px 9px;font-family:inherit;transition:background .14s,border-color .14s,color .14s;display:grid;position:relative}.S48bLa_railItem:before{content:\">\";color:#0000;font-size:11px;transition:color .14s}.S48bLa_railItem:hover{border-color:var(--group-color);color:var(--retro-text);background:#10b9810f}.S48bLa_railItem:hover:before{color:var(--group-color)}.S48bLa_railItem:focus-visible{outline:1px solid var(--retro-emerald);outline-offset:1px}.S48bLa_railItemActive{border-color:var(--group-color);color:var(--retro-text);background:#064e3b4d}.S48bLa_railItemActive:before,.S48bLa_railItemActive .S48bLa_railCopy strong{color:var(--group-color)}.S48bLa_railItem[data-group=common],.S48bLa_ledger[data-group=common]{--group-color:#fff}.S48bLa_railItem[data-group=rare],.S48bLa_ledger[data-group=rare]{--group-color:#3b82f6}.S48bLa_railItem[data-group=epic],.S48bLa_ledger[data-group=epic]{--group-color:#a78bfa}.S48bLa_railItem[data-group=legendary],.S48bLa_ledger[data-group=legendary]{--group-color:#fbbf24}.S48bLa_railIcon{display:none}.S48bLa_railCopy{justify-content:space-between;align-items:baseline;gap:5px;min-width:0;display:flex}.S48bLa_railCopy strong{text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:700;overflow:hidden}.S48bLa_railCopy strong:before{content:\"[\";color:var(--group-color)}.S48bLa_railCopy strong:after{content:\"]\";color:var(--group-color)}.S48bLa_railCopy small{color:var(--retro-faint);font-variant-numeric:tabular-nums;flex:none;font-size:11px}.S48bLa_railMeter{border:1px solid var(--retro-line);background:#000;grid-column:2;height:8px;overflow:hidden}.S48bLa_railMeter span{background:var(--group-color);height:100%;display:block}.S48bLa_ledger{--group-color:var(--retro-emerald);border:2px solid var(--retro-emerald-deep);background:#000000e6;min-width:0;padding:24px 16px 16px;position:relative}.S48bLa_ledgerHeader{justify-content:space-between;align-items:center;gap:12px;min-height:44px;padding-bottom:12px;display:flex}.S48bLa_groupHeading{align-items:center;gap:9px;min-width:0;display:flex}.S48bLa_groupIcon{display:none}.S48bLa_groupTitle{background:var(--retro-bg);color:var(--group-color);letter-spacing:.08em;text-transform:uppercase;text-shadow:0 0 5px color-mix(in srgb, var(--group-color) 42%, transparent);margin:0;padding:0 8px;font-size:12px;font-weight:700;line-height:16px;position:absolute;top:-11px;left:16px}.S48bLa_groupTitle:before{content:\"[\";color:var(--group-color)}.S48bLa_groupTitle:after{content:\"]\";color:var(--group-color)}.S48bLa_groupMeta{color:var(--retro-faint);font-size:12px;line-height:14px}.S48bLa_ledgerCompletion{flex-direction:column;flex:none;align-items:flex-end;display:flex}.S48bLa_ledgerCompletion strong{color:var(--group-color);font-variant-numeric:tabular-nums;font-size:24px}.S48bLa_ledgerCompletion span{color:var(--retro-faint);letter-spacing:.1em;text-transform:uppercase;font-size:11px}.S48bLa_rows{flex-direction:column;gap:16px;padding-top:8px;display:flex}.S48bLa_row{--rarity-color:var(--retro-emerald);box-sizing:border-box;border:1px solid color-mix(in srgb, var(--rarity-color) 34%, transparent);background:#030706;align-items:flex-start;gap:14px;min-height:106px;padding:18px 14px 10px;transition:background .16s,border-color .16s;display:flex;position:relative}.S48bLa_row:before,.S48bLa_row:after{border:1.5px solid var(--rarity-color);content:\"\";pointer-events:none;width:6px;height:6px;transition:border-color .16s;position:absolute}.S48bLa_row:before{border-bottom:0;border-right:0;top:-1px;left:-1px}.S48bLa_row:after{border-top:0;border-left:0;bottom:-1px;right:-1px}.S48bLa_rowFrame:before,.S48bLa_rowFrame:after{border:1.5px solid var(--rarity-color);content:\"\";pointer-events:none;width:6px;height:6px;position:absolute}.S48bLa_rowFrame:before{border-bottom:0;border-left:0;top:-1px;right:-1px}.S48bLa_rowFrame:after{border-top:0;border-right:0;bottom:-1px;left:-1px}.S48bLa_recordCode{max-width:calc(100% - 30px);color:var(--rarity-color);background:var(--retro-panel);letter-spacing:.13em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap;padding:0 7px;font-size:12px;font-weight:700;line-height:16px;position:absolute;top:-8px;left:15px;overflow:hidden}.S48bLa_row:hover{border-color:var(--retro-line-strong);background:#06100c}.S48bLa_rarity-common{--rarity-color:#fff}.S48bLa_rarity-rare{--rarity-color:#3b82f6}.S48bLa_rarity-epic{--rarity-color:#a78bfa}.S48bLa_rarity-legendary{--rarity-color:var(--retro-amber)}.S48bLa_done{border-color:color-mix(in srgb, var(--rarity-color) 58%, transparent);background:#04100c}.S48bLa_locked{opacity:.86}.S48bLa_icon{--icon-color:#3f4a45;border:1px solid var(--icon-color);width:56px;height:58px;color:var(--icon-color);filter:saturate(.45)brightness(.8);background:#020403;flex:none;justify-content:center;align-self:flex-start;align-items:center;font-size:24px;transition:border-color .16s,color .16s,filter .16s;display:inline-flex;position:relative;transform:none}.S48bLa_icon[data-unlocked=true]{border-color:var(--icon-color);filter:none;background:#064e3b4d}[data-rarity=common] .S48bLa_icon[data-unlocked=true]{--icon-color:#fff}[data-rarity=rare] .S48bLa_icon[data-unlocked=true]{--icon-color:#3b82f6}[data-rarity=epic] .S48bLa_icon[data-unlocked=true]{--icon-color:#a78bfa}[data-rarity=legendary] .S48bLa_icon[data-unlocked=true]{--icon-color:#fbbf24}.S48bLa_iconImage{object-fit:contain;width:26px;height:26px}.S48bLa_iconCheck{border:2px solid var(--retro-panel);background:var(--retro-emerald);color:#020403;border-radius:50%;justify-content:center;align-items:center;width:16px;height:16px;font-size:10px;font-weight:800;display:inline-flex;position:absolute;bottom:-5px;right:-5px}.S48bLa_main{flex:1;min-width:0;position:relative}.S48bLa_rowTop,.S48bLa_nameLine{align-items:center;gap:8px;display:flex}.S48bLa_rowTop{justify-content:space-between;align-items:flex-start;gap:14px}.S48bLa_nameLine{flex-wrap:wrap;min-width:0}.S48bLa_titleBlock{border-left:4px solid var(--rarity-color);min-width:0;padding-left:14px}.S48bLa_name{color:#fff;letter-spacing:.08em;text-shadow:0 0 4px #ffffff29;font-family:inherit;font-size:24px;font-weight:700;line-height:30px}.S48bLa_desc{color:#c5cfca;margin-top:3px;font-family:inherit;font-size:16px;line-height:25px}.S48bLa_badge{border:1px solid var(--badge-color,var(--retro-line-strong));letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;background:#000;align-items:center;min-height:22px;padding:1px 8px;font-size:12px;font-weight:650;line-height:14px;display:inline-flex}.S48bLa_badge-common{--badge-color:#ffffff8c;color:#f0f4f8}.S48bLa_badge-rare{--badge-color:#3b82f699;color:#93c5fd}.S48bLa_badge-epic{--badge-color:#a78bfa99;color:#c4b5fd}.S48bLa_badge-legendary{--badge-color:#fbbf2499;color:var(--retro-amber)}.S48bLa_badge-done{--badge-color:#10b98199;color:var(--retro-emerald-dim);background:#064e3b4d}.S48bLa_badge-locked{--badge-color:var(--retro-line);color:var(--retro-faint)}.S48bLa_barWrap{margin:8px 0 0 15px}.S48bLa_barFill{background:var(--rarity-color);box-shadow:none}.S48bLa_barTicks{pointer-events:none;justify-content:space-evenly;display:flex;position:absolute;inset:0}.S48bLa_barTicks i{background:#0000008c;width:1px;height:100%}.S48bLa_barLabel{color:var(--retro-faint);font-variant-numeric:tabular-nums;justify-content:space-between;margin-top:4px;font-size:12px;display:flex}.S48bLa_unlockedLine{color:var(--retro-emerald-dim);letter-spacing:.08em;text-transform:uppercase;border-top:1px solid #10b98129;margin:6px 0 0 15px;padding-top:5px;font-size:12px;font-weight:600}.S48bLa_rateLine{color:var(--retro-faint);letter-spacing:.05em;font-variant-numeric:tabular-nums;margin:4px 0 0 15px;font-size:11px}.S48bLa_rateLine[data-rarity=common]{color:#fff}.S48bLa_rateLine[data-rarity=rare]{color:#3b82f6}.S48bLa_rateLine[data-rarity=epic]{color:#a78bfa}.S48bLa_rateLine[data-rarity=legendary]{color:#fbbf24}.S48bLa_done .S48bLa_rateLine[data-rarity=common]{color:#ffffffb8}.S48bLa_done .S48bLa_rateLine[data-rarity=rare]{color:#3b82f6bf}.S48bLa_done .S48bLa_rateLine[data-rarity=epic]{color:#a78bfac7}.S48bLa_done .S48bLa_rateLine[data-rarity=legendary]{color:#fbbf24d9}.S48bLa_empty{border:1px dashed var(--retro-line-strong);background:var(--retro-panel);color:var(--retro-faint);text-align:center;padding:24px;font-size:11px}.S48bLa_charts{grid-template-columns:minmax(0,1fr);gap:10px;display:grid}.S48bLa_chart{border:1px solid var(--retro-line);background:var(--retro-panel);min-width:0;padding:20px 14px 14px;position:relative}.S48bLa_chart:before,.S48bLa_chart:after{border:1.5px solid var(--retro-emerald);content:\"\";pointer-events:none;width:7px;height:7px;position:absolute}.S48bLa_chart:before{border-bottom:0;border-right:0;top:-1px;left:-1px}.S48bLa_chart:after{border-top:0;border-left:0;bottom:-1px;right:-1px}.S48bLa_chartBadge{background:var(--retro-panel);color:var(--retro-emerald);letter-spacing:.18em;text-transform:uppercase;margin:0;padding:0 7px;font-size:9px;font-weight:700;position:absolute;top:-9px;left:10px}.S48bLa_chartHead{cursor:pointer;color:inherit;font:inherit;background:0 0;border:0;align-items:center;gap:6px;margin:0;padding:0;display:flex;position:absolute;top:-9px;left:10px}.S48bLa_chartHead .S48bLa_chartBadge{padding:0 7px;position:static}.S48bLa_chartFold{color:var(--retro-faint);letter-spacing:.08em;font-size:9px}.S48bLa_chartHead:hover .S48bLa_chartFold{color:var(--retro-emerald)}.S48bLa_chartBody{transition:opacity .18s}.S48bLa_chartBodyCollapsed{opacity:.45}.S48bLa_chartBars{flex-direction:column;gap:7px;display:flex}.S48bLa_hbarRow{grid-template-columns:84px minmax(0,1fr) 40px;align-items:center;gap:8px;display:grid}.S48bLa_hbarLabel{color:var(--retro-faint);text-overflow:ellipsis;white-space:nowrap;font-size:10px;overflow:hidden}.S48bLa_hbarTrack{border:1px solid var(--retro-line);background:#020403;height:9px;position:relative;overflow:hidden}.S48bLa_hbarFill{height:100%;transition:width .3s;box-shadow:0 0 6px #10b98166}.S48bLa_hbarValue{color:var(--retro-muted);font-variant-numeric:tabular-nums;text-align:right;font-size:10px}.S48bLa_donutWrap{place-items:center;min-height:118px;display:grid;position:relative}.S48bLa_donut{width:118px;height:118px;transform:rotate(-90deg)}.S48bLa_donutTrack{fill:none;stroke:#10b98124;stroke-width:5px}.S48bLa_donutSlice{fill:none;stroke-width:5px}.S48bLa_donutCenter{pointer-events:none;flex-direction:column;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.S48bLa_donutCenter strong{color:var(--retro-emerald-dim);font-variant-numeric:tabular-nums;font-size:18px}.S48bLa_donutCenter span{color:var(--retro-faint);letter-spacing:.1em;text-transform:uppercase;font-size:8px}.S48bLa_donutEmpty,.S48bLa_chartEmpty{min-height:118px;color:var(--retro-faint);text-align:center;place-items:center;font-size:10px;display:grid}.S48bLa_heatmapWrap{flex-direction:column;gap:10px;display:flex}.S48bLa_heatmapHeader{color:var(--retro-faint);letter-spacing:.08em;text-transform:uppercase;justify-content:space-between;align-items:baseline;font-size:10px;display:flex}.S48bLa_heatmapHeader span:first-child{color:var(--retro-emerald-dim);font-variant-numeric:tabular-nums}.S48bLa_heatmapGrid{grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;display:grid}.S48bLa_heatmapWeekday{color:var(--retro-faint);letter-spacing:.1em;text-align:center;text-transform:uppercase;font-size:9px}.S48bLa_heatmapCell{aspect-ratio:1;color:var(--retro-faint);font-variant-numeric:tabular-nums;background:#020403;border:1px solid #10b9811f;place-items:center;font-size:9px;transition:background .15s,border-color .15s,color .15s;display:grid}.S48bLa_heatmapCell:hover{border-color:var(--retro-emerald);color:var(--retro-text)}.S48bLa_heatmapCell[data-level=\"1\"]{color:var(--retro-emerald-dim);background:#10b98129;border-color:#10b98159}.S48bLa_heatmapCell[data-level=\"2\"]{color:var(--retro-text);background:#10b98157;border-color:#10b9818c}.S48bLa_heatmapCell[data-level=\"3\"]{color:#020403;background:#10b98194;border-color:#10b981bf}.S48bLa_heatmapCell[data-level=\"4\"]{color:#020403;background:#10b981;border-color:#10b981;box-shadow:0 0 8px #10b98180}.S48bLa_heatmapLegend{color:var(--retro-faint);letter-spacing:.06em;text-transform:uppercase;justify-content:flex-end;align-items:center;gap:8px;font-size:9px;display:flex}.S48bLa_heatmapLegendScale{gap:2px;display:inline-flex}.S48bLa_heatmapLegendScale i{background:#020403;border:1px solid #10b9811f;width:10px;height:10px;display:inline-block}.S48bLa_heatmapLegendScale i[data-level=\"1\"]{background:#10b98129}.S48bLa_heatmapLegendScale i[data-level=\"2\"]{background:#10b98157}.S48bLa_heatmapLegendScale i[data-level=\"3\"]{background:#10b98194}.S48bLa_heatmapLegendScale i[data-level=\"4\"]{background:#10b981}@keyframes S48bLa_spin{to{transform:rotate(360deg)}}@media (width<=760px){.S48bLa_charts{grid-template-columns:1fr}.S48bLa_archive{flex-direction:column;gap:24px;min-height:0;display:flex}.S48bLa_rail{border:2px solid var(--retro-emerald-deep);padding:22px 16px 16px}.S48bLa_railHeader{padding-bottom:8px}.S48bLa_railList{flex-direction:row;gap:6px;padding:8px 0 1px;overflow-x:auto}.S48bLa_railItem{flex:none;width:170px}.S48bLa_ledger{padding:24px 16px 16px}}@media (width<=620px){.S48bLa_hero{padding:0 0 14px}.S48bLa_heroTop{gap:12px}.S48bLa_heroTitle{font-size:30px}.S48bLa_kicker,.S48bLa_heroSubtitle{font-size:12px}.S48bLa_heroPct{min-width:72px}.S48bLa_heroPct strong{font-size:24px}.S48bLa_heroPct span{font-size:10px}.S48bLa_toolbar{flex-direction:column;align-items:flex-start}.S48bLa_controls{justify-content:flex-start}.S48bLa_segmented{max-width:100%}.S48bLa_row{align-items:flex-start;min-height:98px;padding:16px 11px 8px}.S48bLa_rowTop{flex-direction:column;gap:8px}.S48bLa_titleBlock{padding-left:12px}.S48bLa_icon{width:54px;height:56px;transform:translateY(0)}.S48bLa_name{font-size:20px;line-height:26px}.S48bLa_desc{font-size:14px;line-height:22px}.S48bLa_badge,.S48bLa_barLabel,.S48bLa_unlockedLine{font-size:11px}}@media (prefers-reduced-motion:reduce){.S48bLa_loadingSpinner,.S48bLa_row,.S48bLa_rarityBarSegment,.S48bLa_groupProgress div,.S48bLa_barFill{transition:none;animation:none}}";
		const tagId$4 = "@wjnct55555/dsh-client-ui-achievements/AchievementsSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wjnct55555/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var AchievementsSection_module_css_default = {
			"railTitle": "S48bLa_railTitle",
			"spin": "S48bLa_spin",
			"badge-legendary": "S48bLa_badge-legendary",
			"loadFailure": "S48bLa_loadFailure",
			"clearCancel": "S48bLa_clearCancel",
			"donut": "S48bLa_donut",
			"donutSlice": "S48bLa_donutSlice",
			"badge-epic": "S48bLa_badge-epic",
			"donutEmpty": "S48bLa_donutEmpty",
			"railCount": "S48bLa_railCount",
			"chartFold": "S48bLa_chartFold",
			"nameLine": "S48bLa_nameLine",
			"badge-common": "S48bLa_badge-common",
			"rows": "S48bLa_rows",
			"rarityBarSegment": "S48bLa_rarityBarSegment",
			"chart": "S48bLa_chart",
			"hbarValue": "S48bLa_hbarValue",
			"heatmapGrid": "S48bLa_heatmapGrid",
			"rail": "S48bLa_rail",
			"rarity-rare": "S48bLa_rarity-rare",
			"heatmapLegend": "S48bLa_heatmapLegend",
			"chartEmpty": "S48bLa_chartEmpty",
			"clearBtn": "S48bLa_clearBtn",
			"hbarTrack": "S48bLa_hbarTrack",
			"heatmapWeekday": "S48bLa_heatmapWeekday",
			"rarityBar": "S48bLa_rarityBar",
			"iconCheck": "S48bLa_iconCheck",
			"desc": "S48bLa_desc",
			"groupMeta": "S48bLa_groupMeta",
			"clearPanelActions": "S48bLa_clearPanelActions",
			"loadingSpinner": "S48bLa_loadingSpinner",
			"loading": "S48bLa_loading",
			"railItem": "S48bLa_railItem",
			"ledgerHeader": "S48bLa_ledgerHeader",
			"main": "S48bLa_main",
			"iconImage": "S48bLa_iconImage",
			"locked": "S48bLa_locked",
			"donutCenter": "S48bLa_donutCenter",
			"controls": "S48bLa_controls",
			"badge-locked": "S48bLa_badge-locked",
			"chartBody": "S48bLa_chartBody",
			"stats": "S48bLa_stats",
			"railItemActive": "S48bLa_railItemActive",
			"groupTitle": "S48bLa_groupTitle",
			"deepBtn": "S48bLa_deepBtn",
			"charts": "S48bLa_charts",
			"kicker": "S48bLa_kicker",
			"heatmapHeader": "S48bLa_heatmapHeader",
			"toolbarCount": "S48bLa_toolbarCount",
			"badge": "S48bLa_badge",
			"icon": "S48bLa_icon",
			"donutTrack": "S48bLa_donutTrack",
			"ledgerCompletion": "S48bLa_ledgerCompletion",
			"heatmapLegendScale": "S48bLa_heatmapLegendScale",
			"barFill": "S48bLa_barFill",
			"chartBadge": "S48bLa_chartBadge",
			"heroIcon": "S48bLa_heroIcon",
			"titleBlock": "S48bLa_titleBlock",
			"chartHead": "S48bLa_chartHead",
			"section": "S48bLa_section",
			"hbarLabel": "S48bLa_hbarLabel",
			"groupIcon": "S48bLa_groupIcon",
			"sortActive": "S48bLa_sortActive",
			"rowTop": "S48bLa_rowTop",
			"donutWrap": "S48bLa_donutWrap",
			"heroPct": "S48bLa_heroPct",
			"clearPanelTitle": "S48bLa_clearPanelTitle",
			"empty": "S48bLa_empty",
			"hbarFill": "S48bLa_hbarFill",
			"sortBtn": "S48bLa_sortBtn",
			"unlockedLine": "S48bLa_unlockedLine",
			"clearPanel": "S48bLa_clearPanel",
			"rarity-epic": "S48bLa_rarity-epic",
			"heroSubtitle": "S48bLa_heroSubtitle",
			"done": "S48bLa_done",
			"barLabel": "S48bLa_barLabel",
			"deepActive": "S48bLa_deepActive",
			"clearPanelDesc": "S48bLa_clearPanelDesc",
			"railCopy": "S48bLa_railCopy",
			"chartBars": "S48bLa_chartBars",
			"rowFrame": "S48bLa_rowFrame",
			"hbarRow": "S48bLa_hbarRow",
			"badge-done": "S48bLa_badge-done",
			"loadFailureIcon": "S48bLa_loadFailureIcon",
			"toolbar": "S48bLa_toolbar",
			"rateLine": "S48bLa_rateLine",
			"hero": "S48bLa_hero",
			"stat": "S48bLa_stat",
			"rarity-common": "S48bLa_rarity-common",
			"heroTitle": "S48bLa_heroTitle",
			"railList": "S48bLa_railList",
			"filterBtn": "S48bLa_filterBtn",
			"rarity-legendary": "S48bLa_rarity-legendary",
			"barTicks": "S48bLa_barTicks",
			"filterActive": "S48bLa_filterActive",
			"heroBadge": "S48bLa_heroBadge",
			"heroTop": "S48bLa_heroTop",
			"railIcon": "S48bLa_railIcon",
			"heatmapCell": "S48bLa_heatmapCell",
			"groupHeading": "S48bLa_groupHeading",
			"heroCopy": "S48bLa_heroCopy",
			"chartBodyCollapsed": "S48bLa_chartBodyCollapsed",
			"recordCode": "S48bLa_recordCode",
			"segmented": "S48bLa_segmented",
			"bar": "S48bLa_bar",
			"barWrap": "S48bLa_barWrap",
			"name": "S48bLa_name",
			"row": "S48bLa_row",
			"badge-rare": "S48bLa_badge-rare",
			"toolbarLabel": "S48bLa_toolbarLabel",
			"railHeader": "S48bLa_railHeader",
			"railMeter": "S48bLa_railMeter",
			"groupProgress": "S48bLa_groupProgress",
			"heroGlow": "S48bLa_heroGlow",
			"archive": "S48bLa_archive",
			"heatmapWrap": "S48bLa_heatmapWrap",
			"clearDialog": "S48bLa_clearDialog",
			"toolbarCopy": "S48bLa_toolbarCopy",
			"ledger": "S48bLa_ledger"
		};
		//#endregion
		//#region src/client/AchievementsSection.tsx
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
		const PROGRESS_TICKS = Array.from({ length: 9 }, (_, index) => index);
		/** Emoji icon via Twemoji CDN with a text fallback on load failure. */
		function Icon({ icon }) {
			const [failed, setFailed] = (0, react.useState)(false);
			if (failed) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: icon });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
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
		function Row({ a, t, pct, hasRates }) {
			const hiddenLocked = a.hidden && !a.unlocked;
			const deepLocked = a.deepLocked && !a.unlocked;
			const name = hiddenLocked ? "？？？" : a.name;
			const desc = hiddenLocked ? t("hidden") : deepLocked ? t("deepLocked") : a.desc;
			const rarityClass = AchievementsSection_module_css_default[`rarity-${a.rarity}`] ?? AchievementsSection_module_css_default["rarity-common"];
			const rowClass = `${AchievementsSection_module_css_default.row} ${rarityClass} ${a.unlocked ? AchievementsSection_module_css_default.done : ""} ${hiddenLocked || deepLocked || !a.unlocked ? AchievementsSection_module_css_default.locked : ""}`;
			const badgeClass = hiddenLocked ? AchievementsSection_module_css_default["badge-locked"] : AchievementsSection_module_css_default[`badge-${a.rarity}`] ?? AchievementsSection_module_css_default["badge-common"];
			const progress = completionOf(a.progress.current, a.progress.target);
			const statusBadge = a.unlocked ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-done"]}`,
				children: t("done")
			}) : deepLocked ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: t("deepHint")
			}) : a.progress.target > 1 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: [
					a.progress.current,
					" / ",
					a.progress.target
				]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: `${AchievementsSection_module_css_default.badge} ${AchievementsSection_module_css_default["badge-locked"]}`,
				children: t("todo")
			});
			const bar = !hiddenLocked && !deepLocked && a.progress.target > 1 && !a.unlocked ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.barWrap,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.bar,
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AchievementsSection_module_css_default.barFill,
						style: { width: `${progress}%` }
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: AchievementsSection_module_css_default.barTicks,
						children: PROGRESS_TICKS.map((tick) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}, tick))
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.barLabel,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("progress") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						a.progress.current,
						" / ",
						a.progress.target
					] })]
				})]
			}) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: rowClass,
				"data-rarity": a.rarity,
				"data-unlocked": a.unlocked,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: AchievementsSection_module_css_default.rowFrame,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: AchievementsSection_module_css_default.recordCode,
						children: [
							"[ ACHV::",
							a.id.toUpperCase(),
							" ]"
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.icon,
						"data-unlocked": a.unlocked,
						children: [hiddenLocked ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "?" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { icon: a.icon }), a.unlocked && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: AchievementsSection_module_css_default.iconCheck,
							"aria-hidden": "true",
							children: "✓"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.main,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.rowTop,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.titleBlock,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.nameLine,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: AchievementsSection_module_css_default.name,
											children: name
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: `${AchievementsSection_module_css_default.badge} ${badgeClass}`,
											children: hiddenLocked ? t("hiddenDesc") : t(`rarity.${a.rarity}`)
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: AchievementsSection_module_css_default.desc,
										children: desc
									})]
								}), statusBadge]
							}),
							bar,
							a.unlocked && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.unlockedLine,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["✓ ", t("unlockedHint")] })
							}),
							pct !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.rateLine,
								"data-rarity": a.rarity,
								children: t("rate.users", { pct })
							}) : hasRates && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.rateLine,
								"data-rarity": a.rarity,
								children: t("rate.noData")
							})
						]
					})
				]
			});
		}
		/** Hollow donut chart (SVG) with a center total. */
		function Donut({ slices, center, t }) {
			const total = slices.reduce((sum, slice) => sum + slice.value, 0);
			if (total <= 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: AchievementsSection_module_css_default.donutEmpty,
				role: "img",
				"aria-label": t("chart.empty"),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chart.empty") })
			});
			const radius = 17.4;
			const circumference = 2 * Math.PI * radius;
			let offset = 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.donutWrap,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					className: AchievementsSection_module_css_default.donut,
					viewBox: "0 0 42 42",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						className: AchievementsSection_module_css_default.donutTrack,
						cx: "21",
						cy: "21",
						r: radius
					}), slices.map((slice) => {
						const dash = slice.value / total * circumference;
						const el = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							className: AchievementsSection_module_css_default.donutSlice,
							cx: "21",
							cy: "21",
							r: radius,
							stroke: slice.color,
							strokeDasharray: `${dash} ${circumference - dash}`,
							strokeDashoffset: -offset
						}, slice.label);
						offset += dash;
						return el;
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.donutCenter,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: center }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chart.total") })]
				})]
			});
		}
		/** Current-month activity heatmap: a Monday-first calendar grid tinted by daily count. */
		function Heatmap({ data, t }) {
			const { year, month, days } = data;
			const countByDate = new Map(days.map((d) => [d.date, d.count]));
			const lead = (new Date(year, month - 1, 1).getDay() + 6) % 7;
			const daysInMonth = new Date(year, month, 0).getDate();
			const cells = [];
			for (let i = 0; i < lead; i++) cells.push({
				date: null,
				day: 0,
				count: 0
			});
			for (let day = 1; day <= daysInMonth; day++) {
				const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
				cells.push({
					date,
					day,
					count: countByDate.get(date) ?? 0
				});
			}
			const max = Math.max(1, ...days.map((d) => d.count));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.heatmapWrap,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.heatmapHeader,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
							year,
							" · ",
							String(month).padStart(2, "0")
						] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chart.heatmap") })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.heatmapGrid,
						role: "img",
						"aria-label": `${t("chart.heatmap")}: ${year}-${month}`,
						children: [[
							"一",
							"二",
							"三",
							"四",
							"五",
							"六",
							"日"
						].map((wd) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: AchievementsSection_module_css_default.heatmapWeekday,
							"aria-hidden": "true",
							children: wd
						}, wd)), cells.map((cell, index) => {
							if (cell.date === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.heatmapCell,
								"aria-hidden": "true"
							}, `pad-${index}`);
							const level = cell.count === 0 ? 0 : Math.min(4, 1 + Math.round(cell.count / max * 3));
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.heatmapCell,
								"data-level": level,
								title: `${cell.date}: ${cell.count}`,
								children: cell.day
							}, cell.date);
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.heatmapLegend,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chart.empty") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.heatmapLegendScale,
								children: [
									0,
									1,
									2,
									3,
									4
								].map((level) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
									"data-level": level,
									"aria-hidden": "true"
								}, level))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("chart.total") })
						]
					})
				]
			});
		}
		/** Full settings-section gallery over the achievements Remote namespace. */
		function AchievementsSection({ list, deepState, setDeepInsights, rates, telemetryState, setTelemetry, clear, heatmap, t }) {
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [ratesData, setRatesData] = (0, react.useState)(null);
			const [heatmapData, setHeatmapData] = (0, react.useState)(null);
			const [telemetryEnabled, setTelemetryEnabled] = (0, react.useState)(false);
			const [confirmClear, setConfirmClear] = (0, react.useState)(false);
			const [mode, setMode] = (0, react.useState)("category");
			const [status, setStatus] = (0, react.useState)("all");
			const [deepEnabled, setDeepEnabled] = (0, react.useState)(false);
			const [activeGroupId, setActiveGroupId] = (0, react.useState)(null);
			const [collapsed, setCollapsed] = (0, react.useState)({});
			const [loadError, setLoadError] = (0, react.useState)(null);
			const [reloadToken, setReloadToken] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				let alive = true;
				setLoadError(null);
				Promise.resolve().then(list).then((result) => {
					if (!alive) return;
					if (result.ok) setSnapshot(result.value);
					else setLoadError(result.error.message);
				}).catch(() => {
					if (alive) setLoadError(t("loadError"));
				});
				if (deepState !== void 0) Promise.resolve().then(deepState).then((result) => {
					if (alive && result.ok) setDeepEnabled(result.value.enabled);
				}).catch(() => {
					if (alive) setDeepEnabled(false);
				});
				if (telemetryState !== void 0) Promise.resolve().then(telemetryState).then((result) => {
					if (alive && result.ok) setTelemetryEnabled(result.value.enabled);
				}).catch(() => {
					if (alive) setTelemetryEnabled(false);
				});
				if (rates !== void 0) Promise.resolve().then(rates).then((result) => {
					if (alive && result.ok) setRatesData(result.value);
				}).catch(() => {
					if (alive) setRatesData(null);
				});
				if (heatmap !== void 0) Promise.resolve().then(heatmap).then((result) => {
					if (alive && result.ok) setHeatmapData(result.value);
				}).catch(() => {
					if (alive) setHeatmapData(null);
				});
				return () => {
					alive = false;
				};
			}, [
				list,
				deepState,
				rates,
				telemetryState,
				heatmap,
				reloadToken,
				t
			]);
			if (snapshot === null) {
				if (loadError !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.loadFailure,
					role: "alert",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: AchievementsSection_module_css_default.loadFailureIcon,
							"aria-hidden": "true",
							children: "!"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("loadError") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: loadError })] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setReloadToken((value) => value + 1);
							},
							children: t("retry")
						})
					]
				});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AchievementsSection_module_css_default.loading,
					role: "status",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: AchievementsSection_module_css_default.loadingSpinner,
						"aria-hidden": "true"
					}), t("loading")]
				});
			}
			const toggleDeep = () => {
				if (setDeepInsights === void 0) return;
				Promise.resolve().then(() => setDeepInsights(!deepEnabled)).then((result) => {
					if (result.ok) setDeepEnabled(result.value.enabled);
				}).catch(() => {});
			};
			const toggleTelemetry = () => {
				if (setTelemetry === void 0) return;
				Promise.resolve().then(() => setTelemetry(!telemetryEnabled)).then((result) => {
					if (result.ok) setTelemetryEnabled(result.value.enabled);
				}).catch(() => {});
			};
			const doClear = () => {
				if (clear === void 0) return;
				Promise.resolve().then(clear).then((result) => {
					if (result.ok) {
						setSnapshot(result.value);
						setRatesData(null);
						setConfirmClear(false);
					}
				}).catch(() => {
					setConfirmClear(false);
				});
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
			const rarityColors = {
				common: "#ffffff",
				rare: "#3b82f6",
				epic: "#a78bfa",
				legendary: "#fbbf24"
			};
			const raritySlices = RARITY_ORDER.map((rarity) => ({
				label: t(`rarity.${rarity}`),
				value: snapshot.achievements.filter((a) => a.rarity === rarity && a.unlocked).length,
				color: rarityColors[rarity]
			}));
			const catColors = {
				"getting-started": "#10b981",
				toolsmith: "#34d399",
				filecraft: "#2dd4bf",
				orchestration: "#5eead4",
				goals: "#a7f3d0",
				skill: "#6ee7b7",
				model: "#a78bfa",
				behavior: "#c4b5fd",
				crossover: "#fbbf24",
				hidden: "#94a3b8"
			};
			const catSlices = CATEGORY_ORDER.filter((cat) => cat !== "hidden").map((cat) => ({
				label: t(`cat.${cat}`),
				value: snapshot.achievements.filter((a) => a.category === cat && a.unlocked).length,
				color: catColors[cat]
			}));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AchievementsSection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: AchievementsSection_module_css_default.hero,
						"aria-labelledby": "achievements-overview-title",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: AchievementsSection_module_css_default.heroBadge,
								"aria-hidden": "true",
								children: [
									"[",
									t("title"),
									"]"
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.heroGlow,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.heroTop,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: AchievementsSection_module_css_default.heroIcon,
										"aria-hidden": "true",
										children: ">_"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.heroCopy,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: AchievementsSection_module_css_default.kicker,
												children: t("kicker")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
												className: AchievementsSection_module_css_default.heroTitle,
												id: "achievements-overview-title",
												children: t("title")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: AchievementsSection_module_css_default.heroSubtitle,
												children: t("subtitle")
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.heroPct,
										"aria-label": `${completion}% ${t("complete")}`,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [completion, "%"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("complete") })]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.stats,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: unlocked }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("stats.unlocked") })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: snapshot.total }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("stats.total") })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.stat,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: remaining }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("stats.remaining") })]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.rarityBar,
								role: "img",
								"aria-label": `${t("chart.rarity")}: ${unlocked}/${snapshot.total}`,
								children: raritySlices.map((slice) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.rarityBarSegment,
									style: {
										width: `${slice.value / snapshot.total * 100}%`,
										background: slice.color
									},
									title: `${slice.label}: ${slice.value}`
								}, slice.label))
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.charts,
						role: "group",
						"aria-label": t("chart.title"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: AchievementsSection_module_css_default.chart,
							"aria-labelledby": "chart-category-title",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: AchievementsSection_module_css_default.chartHead,
								"aria-expanded": !collapsed["category"],
								onClick: () => {
									setCollapsed((prev) => ({
										...prev,
										category: !prev["category"]
									}));
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", {
									className: AchievementsSection_module_css_default.chartBadge,
									id: "chart-category-title",
									children: [
										"[",
										t("chart.category"),
										"]"
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.chartFold,
									"aria-hidden": "true",
									children: collapsed["category"] ? "[+]" : "[−]"
								})]
							}), !collapsed["category"] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Donut, {
								slices: catSlices,
								center: String(unlocked),
								t
							})]
						}), heatmapData !== null && heatmap !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: AchievementsSection_module_css_default.chart,
							"aria-labelledby": "chart-heatmap-title",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: AchievementsSection_module_css_default.chartHead,
								"aria-expanded": !collapsed["heatmap"],
								onClick: () => {
									setCollapsed((prev) => ({
										...prev,
										heatmap: !prev["heatmap"]
									}));
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h4", {
									className: AchievementsSection_module_css_default.chartBadge,
									id: "chart-heatmap-title",
									children: [
										"[",
										t("chart.heatmap"),
										"]"
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.chartFold,
									"aria-hidden": "true",
									children: collapsed["heatmap"] ? "[+]" : "[−]"
								})]
							}), !collapsed["heatmap"] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Heatmap, {
								data: heatmapData,
								t
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.toolbar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.toolbarCopy,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.toolbarLabel,
								children: t("browse")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: AchievementsSection_module_css_default.toolbarCount,
								children: t("visibleCount", { count: visibleCount })
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.controls,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.segmented,
									role: "tablist",
									"aria-label": t("sort.label"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "category",
										className: `${AchievementsSection_module_css_default.sortBtn} ${mode === "category" ? AchievementsSection_module_css_default.sortActive : ""}`,
										onClick: () => {
											setMode("category");
										},
										children: t("sort.byCategory")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.segmented,
									role: "group",
									"aria-label": t("filter.label"),
									children: [
										"all",
										"unlocked",
										"locked"
									].map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": status === value,
										className: `${AchievementsSection_module_css_default.filterBtn} ${status === value ? AchievementsSection_module_css_default.filterActive : ""}`,
										onClick: () => {
											setStatus(value);
										},
										children: t(`filter.${value}`)
									}, value))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": deepEnabled,
									className: `${AchievementsSection_module_css_default.deepBtn} ${deepEnabled ? AchievementsSection_module_css_default.deepActive : ""}`,
									onClick: toggleDeep,
									title: t("settings.deepDesc"),
									children: deepEnabled ? t("settings.deepDisable") : t("settings.deepEnable")
								}),
								telemetryState !== void 0 && setTelemetry !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": telemetryEnabled,
									className: `${AchievementsSection_module_css_default.deepBtn} ${telemetryEnabled ? AchievementsSection_module_css_default.deepActive : ""}`,
									onClick: toggleTelemetry,
									title: t("settings.telemetryDesc"),
									children: telemetryEnabled ? t("settings.telemetryDisable") : t("settings.telemetryEnable")
								}),
								clear !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: AchievementsSection_module_css_default.clearBtn,
									onClick: () => {
										setConfirmClear(true);
									},
									title: t("settings.clearDesc"),
									children: t("settings.clearTitle")
								})
							]
						})]
					}),
					confirmClear && clear !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AchievementsSection_module_css_default.clearDialog,
						role: "alertdialog",
						"aria-modal": "true",
						"aria-labelledby": "achievements-clear-title",
						onClick: () => {
							setConfirmClear(false);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AchievementsSection_module_css_default.clearPanel,
							onClick: (e) => {
								e.stopPropagation();
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: AchievementsSection_module_css_default.clearPanelTitle,
									id: "achievements-clear-title",
									children: [
										"[",
										t("settings.clearAsk"),
										"]"
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: AchievementsSection_module_css_default.clearPanelDesc,
									children: t("settings.clearAskDesc")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.clearPanelActions,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: AchievementsSection_module_css_default.clearBtn,
										onClick: doClear,
										children: t("settings.clearConfirm")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: AchievementsSection_module_css_default.clearCancel,
										onClick: () => {
											setConfirmClear(false);
										},
										children: t("settings.clearCancel")
									})]
								})
							]
						})
					}),
					activeGroup && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: AchievementsSection_module_css_default.archive,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
							className: AchievementsSection_module_css_default.rail,
							"aria-label": mode === "category" ? t("sort.byCategory") : t("sort.byRarity"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: AchievementsSection_module_css_default.railHeader,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.railTitle,
									children: mode === "category" ? t("sort.byCategory") : t("sort.byRarity")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: AchievementsSection_module_css_default.railCount,
									children: visibleGroups.length
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: AchievementsSection_module_css_default.railList,
								children: visibleGroups.map((group) => {
									const active = group.id === activeGroup.id;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: `${AchievementsSection_module_css_default.railItem} ${active ? AchievementsSection_module_css_default.railItemActive : ""}`,
										"data-group": group.id,
										"aria-current": active ? "page" : void 0,
										onClick: () => {
											setActiveGroupId(group.id);
										},
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: AchievementsSection_module_css_default.railIcon,
												"aria-hidden": "true",
												children: group.icon
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: AchievementsSection_module_css_default.railCopy,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: group.label }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
													group.groupUnlocked,
													" / ",
													group.all.length
												] })]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: AchievementsSection_module_css_default.railMeter,
												"aria-hidden": "true",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: { width: `${group.groupCompletion}%` } })
											})
										]
									}, group.id);
								})
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: AchievementsSection_module_css_default.ledger,
							"data-group": activeGroup.id,
							"aria-labelledby": `achievement-group-${activeGroup.id}`,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: AchievementsSection_module_css_default.ledgerHeader,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.groupHeading,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: AchievementsSection_module_css_default.groupIcon,
											"aria-hidden": "true",
											children: activeGroup.icon
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
											className: AchievementsSection_module_css_default.groupTitle,
											id: `achievement-group-${activeGroup.id}`,
											children: activeGroup.label
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: AchievementsSection_module_css_default.groupMeta,
											children: [
												activeGroup.groupUnlocked,
												" / ",
												activeGroup.all.length,
												" ",
												t("stats.unlocked")
											]
										})] })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: AchievementsSection_module_css_default.ledgerCompletion,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [activeGroup.groupCompletion, "%"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("complete") })]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.groupProgress,
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: { width: `${activeGroup.groupCompletion}%` } })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: AchievementsSection_module_css_default.rows,
									children: activeGroup.items.map((a) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
										a,
										t,
										pct: ratesData?.pct[a.id],
										hasRates: ratesData !== null
									}, a.id))
								})
							]
						})]
					}),
					visibleCount === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AchievementsSection_module_css_default.empty,
						children: t("empty")
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\dock.module.css.mjs
		const css$3 = ".ySutMG_dock{color:#4b8f76;background:#000000e6;border:1px solid #10b98180;align-items:center;gap:7px;max-width:min(100%,420px);min-height:26px;padding:3px 10px 3px 5px;font-family:ui-monospace,Cascadia Mono,JetBrains Mono,Menlo,Consolas,monospace;font-size:10px;line-height:18px;display:inline-flex;overflow:hidden;box-shadow:0 0 12px #10b98114}.ySutMG_icon{color:#34d399;background:#064e3b40;border:1px solid #10b981a6;flex:none;justify-content:center;align-items:center;width:20px;height:20px;font-size:10px;display:inline-flex}.ySutMG_summary{color:#6ee7b7;font-variant-numeric:tabular-nums;flex:none;font-weight:700}.ySutMG_combo{color:#fbbf24;background:#fbbf240f;border:1px solid #fbbf2480;flex:none;padding:0 6px;font-size:9px;font-weight:700}.ySutMG_next{color:#4b8f76;text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}";
		const tagId$3 = "@wjnct55555/dsh-client-ui-achievements/dock.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wjnct55555/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var dock_module_css_default = {
			"summary": "ySutMG_summary",
			"dock": "ySutMG_dock",
			"icon": "ySutMG_icon",
			"combo": "ySutMG_combo",
			"next": "ySutMG_next"
		};
		//#endregion
		//#region src/client/dock.tsx
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: dock_module_css_default.dock,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.icon,
						"aria-hidden": "true",
						children: "🏆"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.summary,
						children: t("dock.summary", {
							unlocked: dock.unlocked,
							total: dock.total
						})
					}),
					combo && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.combo,
						children: combo
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: dock_module_css_default.next,
						title: next,
						children: next
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\gallery.module.css.mjs
		const css$2 = ".Odo5Oq_backdrop{z-index:60;pointer-events:auto;backdrop-filter:blur(6px);background:#020403d1;justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}.Odo5Oq_panel{box-sizing:border-box;color:#f4f7f5;pointer-events:auto;--dsh-scrollbar-thumb:#10b98159;--dsh-scrollbar-thumb-hover:#10b98199;background:#000000f0;border:1px solid #064e3b;flex-direction:column;width:min(940px,100%);max-height:min(88vh,900px);padding:22px 21px;font-family:ui-monospace,Cascadia Mono,JetBrains Mono,Menlo,Consolas,monospace;animation:.18s ease-out Odo5Oq_rise;display:flex;position:relative;overflow:auto;box-shadow:0 0 30px #10b9811f}.Odo5Oq_scanlines{z-index:4;pointer-events:none;background-image:repeating-linear-gradient(#0000 0 2px,#0003 2px 3px),repeating-linear-gradient(90deg,#ff000006 0 1px,#00ff8003 1px 2px,#0050ff06 2px 3px);position:absolute;inset:0;overflow:hidden}.Odo5Oq_scanlines:after{content:\"\";background:linear-gradient(#0000,#10b9810e,#0000);height:72px;animation:9s linear infinite Odo5Oq_scan;position:absolute;left:0;right:0}.Odo5Oq_panel:before,.Odo5Oq_panel:after,.Odo5Oq_panel .Odo5Oq_head:before,.Odo5Oq_panel .Odo5Oq_head:after{content:\"\";pointer-events:none;border:2px solid #10b981;width:12px;height:12px;position:absolute}.Odo5Oq_panel:before{border-bottom:0;border-right:0;top:-2px;left:-2px}.Odo5Oq_panel:after{border-bottom:0;border-left:0;top:-2px;right:-2px}.Odo5Oq_panel .Odo5Oq_head:before{border-top:0;border-right:0;bottom:-2px;left:-2px}.Odo5Oq_panel .Odo5Oq_head:after{border-top:0;border-left:0;bottom:-2px;right:-2px}.Odo5Oq_head{justify-content:space-between;align-items:center;gap:12px;margin-bottom:17px;display:flex;position:relative}.Odo5Oq_heading{align-items:center;gap:11px;min-width:0;display:flex}.Odo5Oq_headingIcon{color:#34d399;background:#064e3b40;border:1px solid #10b981a6;flex:none;justify-content:center;align-items:center;width:40px;height:40px;font-size:20px;display:inline-flex;box-shadow:inset 0 0 10px #10b9811a}.Odo5Oq_heading>div{flex-direction:column;gap:1px;display:flex}.Odo5Oq_kicker{color:#10b981;letter-spacing:.22em;text-transform:uppercase;font-size:9px;font-weight:700}.Odo5Oq_title{color:#f4f7f5;letter-spacing:.02em;text-shadow:0 0 5px #fff3;font-size:17px;font-weight:700;line-height:22px}.Odo5Oq_title:before{content:\"[\";color:#10b981}.Odo5Oq_title:after{content:\"]\";color:#10b981}.Odo5Oq_close{color:#4b8f76;cursor:pointer;background:0 0;border:1px solid #0000;flex:none;justify-content:center;align-items:center;width:31px;height:31px;font-family:inherit;font-size:18px;line-height:1;transition:background .14s,border-color .14s,color .14s;display:inline-flex}.Odo5Oq_close:hover{color:#34d399;background:#10b98114;border-color:#10b98180}.Odo5Oq_close:focus-visible{outline-offset:2px;outline:1px solid #10b981}@keyframes Odo5Oq_rise{0%{opacity:0;transform:translateY(8px)scale(.985)}to{opacity:1;transform:none}}@keyframes Odo5Oq_scan{0%{transform:translateY(-90px)}to{transform:translateY(900px)}}@media (width<=620px){.Odo5Oq_backdrop{align-items:flex-end;padding:10px}.Odo5Oq_panel{max-height:92vh;padding:18px 16px}}@media (prefers-reduced-motion:reduce){.Odo5Oq_scanlines:after,.Odo5Oq_panel,.Odo5Oq_close{transition:none;animation:none}}";
		const tagId$2 = "@wjnct55555/dsh-client-ui-achievements/gallery.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wjnct55555/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var gallery_module_css_default = {
			"backdrop": "Odo5Oq_backdrop",
			"heading": "Odo5Oq_heading",
			"headingIcon": "Odo5Oq_headingIcon",
			"rise": "Odo5Oq_rise",
			"head": "Odo5Oq_head",
			"kicker": "Odo5Oq_kicker",
			"title": "Odo5Oq_title",
			"close": "Odo5Oq_close",
			"scanlines": "Odo5Oq_scanlines",
			"panel": "Odo5Oq_panel",
			"scan": "Odo5Oq_scan"
		};
		//#endregion
		//#region src/client/gallery.tsx
		/**
		* Achievements gallery overlay: the trophy-toggled full gallery in
		* `shell.overlay`. Reuses the settings-section gallery component; the backdrop
		* opts back into pointer events to trap the click-away.
		*/
		/** The trophy-toggled gallery overlay (renders nothing while closed). */
		function GalleryOverlay({ useSnapshot, close, list, deepState, setDeepInsights, rates, telemetryState, setTelemetry, clear, heatmap, t }) {
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: gallery_module_css_default.backdrop,
				onClick: close,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: gallery_module_css_default.panel,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "achievements-gallery-title",
					onClick: (e) => {
						e.stopPropagation();
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: gallery_module_css_default.scanlines,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: gallery_module_css_default.head,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: gallery_module_css_default.heading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: gallery_module_css_default.headingIcon,
									"aria-hidden": "true",
									children: "🏆"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: gallery_module_css_default.kicker,
									children: t("kicker")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: gallery_module_css_default.title,
									id: "achievements-gallery-title",
									children: t("title")
								})] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: gallery_module_css_default.close,
								onClick: close,
								"aria-label": t("gallery.close"),
								children: "×"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AchievementsSection, {
							list,
							...deepState !== void 0 ? { deepState } : {},
							...setDeepInsights !== void 0 ? { setDeepInsights } : {},
							...rates !== void 0 ? { rates } : {},
							...telemetryState !== void 0 ? { telemetryState } : {},
							...setTelemetry !== void 0 ? { setTelemetry } : {},
							...clear !== void 0 ? { clear } : {},
							...heatmap !== void 0 ? { heatmap } : {},
							t
						})
					]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:D:\deepseek\deepseek-harness-master\packages\extensions\ui-achievements\src\client\toast.module.css.mjs
		const css$1 = "._4q_60W_stack{z-index:50;pointer-events:none;flex-direction:column;gap:10px;display:flex;position:fixed;bottom:18px;right:18px}._4q_60W_toast{--toast-rarity:#2dd4bf;border:1px solid var(--toast-rarity);color:#d1fae5;pointer-events:auto;background:#000000f0;align-items:center;gap:12px;width:min(340px,100vw - 36px);padding:13px 40px 13px 13px;font-family:ui-monospace,Cascadia Mono,JetBrains Mono,Menlo,Consolas,monospace;animation:.22s ease-out _4q_60W_pop;display:flex;position:relative;overflow:hidden;box-shadow:0 0 16px #10b9811f}._4q_60W_toast:before,._4q_60W_toast:after{border:1.5px solid var(--toast-rarity);content:\"\";pointer-events:none;width:7px;height:7px;position:absolute}._4q_60W_toast:before{border-bottom:0;border-right:0;top:-1px;left:-1px}._4q_60W_toast:after{border-top:0;border-left:0;bottom:-1px;right:-1px}._4q_60W_rarity-common{--toast-rarity:#fff}._4q_60W_rarity-rare{--toast-rarity:#3b82f6}._4q_60W_rarity-epic{--toast-rarity:#a78bfa}._4q_60W_rarity-legendary{--toast-rarity:#fbbf24}._4q_60W_icon{border:1px solid var(--toast-rarity);width:42px;height:44px;color:var(--toast-rarity);background:#000;flex:none;justify-content:center;align-items:center;font-size:21px;display:inline-flex;box-shadow:inset 0 0 10px #10b98114}._4q_60W_copy{min-width:0}._4q_60W_eyebrow{color:var(--toast-rarity);letter-spacing:.18em;text-transform:uppercase;font-size:8px;font-weight:700}._4q_60W_title{color:#d1fae5;letter-spacing:.02em;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:700;line-height:18px;overflow:hidden}._4q_60W_title:before{content:\"> \";color:var(--toast-rarity)}._4q_60W_sub{color:#4b8f76;font-size:9px;line-height:14px}._4q_60W_close{color:#4b8f76;cursor:pointer;background:0 0;border:1px solid #0000;justify-content:center;align-items:center;width:22px;height:22px;font-family:inherit;font-size:15px;display:inline-flex;position:absolute;top:8px;right:8px}._4q_60W_close:hover{color:#34d399;background:#10b98114;border-color:#10b98180}._4q_60W_close:focus-visible{outline:1px solid var(--toast-rarity);outline-offset:1px}._4q_60W_confetti{z-index:70;pointer-events:none;position:fixed;inset:0;overflow:hidden}._4q_60W_piece{opacity:.9;border-radius:2px;width:8px;height:14px;animation-name:_4q_60W_fall;animation-timing-function:ease-in;animation-fill-mode:forwards;position:absolute;top:-14px}@keyframes _4q_60W_fall{0%{opacity:1;transform:translateY(0)rotate(0)}to{opacity:.35;transform:translateY(105vh)rotate(720deg)}}@keyframes _4q_60W_pop{0%{opacity:0;transform:translateY(8px)scale(.98)}to{opacity:1;transform:none}}@media (width<=620px){._4q_60W_stack{bottom:10px;right:10px}}@media (prefers-reduced-motion:reduce){._4q_60W_piece,._4q_60W_toast{animation:none}}";
		const tagId$1 = "@wjnct55555/dsh-client-ui-achievements/toast.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wjnct55555/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var toast_module_css_default = {
			"copy": "_4q_60W_copy",
			"piece": "_4q_60W_piece",
			"title": "_4q_60W_title",
			"icon": "_4q_60W_icon",
			"rarity-rare": "_4q_60W_rarity-rare",
			"sub": "_4q_60W_sub",
			"close": "_4q_60W_close",
			"pop": "_4q_60W_pop",
			"stack": "_4q_60W_stack",
			"confetti": "_4q_60W_confetti",
			"rarity-legendary": "_4q_60W_rarity-legendary",
			"rarity-epic": "_4q_60W_rarity-epic",
			"eyebrow": "_4q_60W_eyebrow",
			"toast": "_4q_60W_toast",
			"rarity-common": "_4q_60W_rarity-common",
			"fall": "_4q_60W_fall"
		};
		//#endregion
		//#region src/client/toast.tsx
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [celebratory && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Confetti, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${toast_module_css_default.toast} ${toast_module_css_default[`rarity-${toast.rarity}`]}`,
				role: "status",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: toast_module_css_default.icon,
						children: toast.icon
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: toast_module_css_default.copy,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.eyebrow,
								children: t("toast.sub")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.title,
								children: toast.name
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: toast_module_css_default.sub,
								children: t(RARITY_LABEL[toast.rarity])
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: toast_module_css_default.confetti,
				children: Array.from({ length: 60 }, (_, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
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
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: toast_module_css_default.stack,
				children: toasts.map((toast) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toast, {
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
		const css = ".AnwqOW_trophy{color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:1px solid #0000;align-items:center;gap:8px;padding:6px 8px;font-family:ui-monospace,Cascadia Mono,JetBrains Mono,Menlo,Consolas,monospace;font-size:15px;transition:background .14s,border-color .14s,transform .14s;display:flex;position:relative}.AnwqOW_trophy:hover{background:#10b9810f;border-color:#10b98180;transform:translateY(-1px)}.AnwqOW_trophy[aria-pressed=true]{background:#064e3b4d;border-color:#10b981cc}.AnwqOW_trophy:focus-visible{outline-offset:2px;outline:1px solid #10b981}.AnwqOW_icon{color:#34d399;background:#064e3b40;border:1px solid #10b981a6;justify-content:center;align-items:center;width:23px;height:23px;font-size:13px;display:inline-flex;box-shadow:inset 0 0 8px #10b9811a}.AnwqOW_label{color:#6ee7b7;letter-spacing:.04em;font-size:11px;font-weight:700}.AnwqOW_badge{border:2px solid var(--dsw-alias-bg-base);color:#020403;background:#10b981;border-radius:999px;justify-content:center;align-items:center;min-width:17px;height:17px;padding:0 4px;font-size:10px;font-weight:800;line-height:13px;animation:.2s ease-out AnwqOW_badgeIn;display:inline-flex;position:absolute;top:-4px;right:-3px}@keyframes AnwqOW_badgeIn{0%{opacity:0;transform:scale(.75)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.AnwqOW_trophy{transition:none}.AnwqOW_badge{animation:none}}";
		const tagId = "@wjnct55555/dsh-client-ui-achievements/trophy.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@wjnct55555/dsh-client-ui-achievements";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var trophy_module_css_default = {
			"trophy": "AnwqOW_trophy",
			"badge": "AnwqOW_badge",
			"label": "AnwqOW_label",
			"badgeIn": "AnwqOW_badgeIn",
			"icon": "AnwqOW_icon"
		};
		//#endregion
		//#region src/client/trophy.tsx
		/** The sidebar footer trophy entry. */
		function Trophy({ useSnapshot, toggle, wide, t }) {
			const newCount = useSnapshot((s) => s.newCount);
			const open = useSnapshot((s) => s.galleryOpen);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: trophy_module_css_default.trophy,
				onClick: toggle,
				title: t("nav"),
				"aria-label": t("nav"),
				"aria-pressed": open,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.icon,
						children: "🏆"
					}),
					wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.label,
						children: t("nav")
					}),
					newCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: trophy_module_css_default.badge,
						children: newCount
					})
				]
			});
		}
		//#endregion
		//#region src/client/store.ts
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
		//#region src/client/locales.ts
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
			"chart.title": "数据仪表盘",
			"chart.rarity": "稀有度分布",
			"chart.category": "分类进度",
			"chart.heatmap": "当月活动",
			"chart.total": "总计",
			"chart.empty": "暂无数据",
			"stats.unlocked": "已解锁",
			"stats.total": "成就总数",
			"stats.remaining": "待解锁",
			"loading": "加载中…",
			"loadError": "无法载入成就档案",
			"retry": "重新载入",
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
			"settings.telemetryTitle": "匿名统计",
			"settings.telemetryDesc": "分享匿名成就解锁数据：仅上报成就 ID、稀有度与随机匿名标识，不含会话、工具或内容数据。默认关闭。",
			"settings.telemetryEnable": "启用匿名统计",
			"settings.telemetryDisable": "关闭匿名统计",
			"settings.telemetryNoEndpoint": "未配置统计端点",
			"settings.clearTitle": "清除成就记录",
			"settings.clearDesc": "清空全部计数与已解锁成就，立即生效且不可恢复。",
			"settings.clearAsk": "确定清除全部成就记录？",
			"settings.clearAskDesc": "所有计数、进度与已解锁成就将被清空，此操作不可撤销。",
			"settings.clearConfirm": "确定清除",
			"settings.clearCancel": "取消",
			"rate.users": "约 {pct}% 用户获得",
			"rate.noData": "暂无社区统计",
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
			"chart.title": "Telemetry Dashboard",
			"chart.rarity": "Rarity spread",
			"chart.category": "Category progress",
			"chart.heatmap": "Activity this month",
			"chart.total": "total",
			"chart.empty": "No data yet",
			"stats.unlocked": "Unlocked",
			"stats.total": "Total",
			"stats.remaining": "Remaining",
			"loading": "Loading…",
			"loadError": "Unable to load achievement records",
			"retry": "Try again",
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
			"settings.telemetryTitle": "Anonymous stats",
			"settings.telemetryDesc": "Share anonymous unlock data: only achievement id, rarity, and a random anonymous id — never session, tool, or content data. Off by default.",
			"settings.telemetryEnable": "Enable anonymous stats",
			"settings.telemetryDisable": "Disable anonymous stats",
			"settings.telemetryNoEndpoint": "No stats endpoint configured",
			"settings.clearTitle": "Clear achievement records",
			"settings.clearDesc": "Wipe all counters and unlocked achievements. Takes effect immediately and cannot be undone.",
			"settings.clearAsk": "Clear all achievement records?",
			"settings.clearAskDesc": "Every counter, progress value, and unlocked achievement will be wiped. This cannot be undone.",
			"settings.clearConfirm": "Clear",
			"settings.clearCancel": "Cancel",
			"rate.users": "~{pct}% of users unlocked",
			"rate.noData": "No community stats yet",
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
		//#region src/client/index.ts
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
			const rates = deepRemote.rates;
			const telemetryState = deepRemote.telemetryState;
			const setTelemetry = deepRemote.setTelemetry;
			const clear = deepRemote.clear;
			const heatmap = deepRemote.heatmap;
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
				...setDeepInsights !== void 0 ? { setDeepInsights } : {},
				...rates !== void 0 ? { rates } : {},
				...telemetryState !== void 0 ? { telemetryState } : {},
				...setTelemetry !== void 0 ? { setTelemetry } : {},
				...clear !== void 0 ? { clear } : {},
				...heatmap !== void 0 ? { heatmap } : {}
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
					...setDeepInsights !== void 0 ? { setDeepInsights } : {},
					...rates !== void 0 ? { rates } : {},
					...telemetryState !== void 0 ? { telemetryState } : {},
					...setTelemetry !== void 0 ? { setTelemetry } : {},
					...clear !== void 0 ? { clear } : {},
					...heatmap !== void 0 ? { heatmap } : {}
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