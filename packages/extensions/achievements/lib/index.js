import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
/** Narrow a parsed JSON value to a plain object record. */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** A file-backed state store with debounced writes. */
var AchievementStateStore = class {
	filePath;
	debounceMs;
	writeTimer;
	pending;
	constructor(filePath, debounceMs = 500) {
		this.filePath = filePath;
		this.debounceMs = debounceMs;
	}
	/** Load and validate the persisted state; returns an empty baseline when absent or corrupt. */
	async load() {
		try {
			const raw = await readFile(this.filePath, "utf8");
			const parsed = JSON.parse(raw);
			if (typeof parsed !== "object" || parsed === null) return this.empty();
			const record = parsed;
			if (record["schemaVersion"] !== 1) return this.empty();
			return {
				schemaVersion: 1,
				counters: isRecord(record["counters"]) ? record["counters"] : {},
				distinct: isRecord(record["distinct"]) ? record["distinct"] : {},
				flags: Array.isArray(record["flags"]) ? record["flags"] : [],
				unlocked: isRecord(record["unlocked"]) ? record["unlocked"] : {}
			};
		} catch {
			return this.empty();
		}
	}
	/** Whether a state file already exists (first-run probe). */
	async exists() {
		try {
			await readFile(this.filePath);
			return true;
		} catch {
			return false;
		}
	}
	/** Schedule a debounced write of the latest state. */
	save(state) {
		this.pending = state;
		if (this.writeTimer !== void 0) return;
		this.writeTimer = setTimeout(() => {
			this.flush();
		}, this.debounceMs);
		this.writeTimer.unref();
	}
	/** Immediately write any pending state and await the write. */
	async flush() {
		if (this.writeTimer !== void 0) {
			clearTimeout(this.writeTimer);
			this.writeTimer = void 0;
		}
		const state = this.pending;
		if (state === void 0) return;
		this.pending = void 0;
		await this.write(state);
	}
	async write(state) {
		const json = JSON.stringify(state, null, 2);
		const tmp = `${this.filePath}.tmp`;
		try {
			await mkdir(dirname(this.filePath), { recursive: true });
			await writeFile(tmp, json, "utf8");
			await rename(tmp, this.filePath);
		} catch {}
	}
	empty() {
		return {
			schemaVersion: 1,
			counters: {},
			distinct: {},
			flags: [],
			unlocked: {}
		};
	}
};
//#endregion
//#region lib/types/index.js
/**
* Achievements engine: a root-scoped Typert Remote service observing the agent
* plane and folding observed activity into a durable, process-global state.
* Counters, distinct sets, flags, and unlock timestamps are persisted to
* `~/.agent-achievements/state.json` so progress survives restarts.
*
* Two privacy tiers:
* - The base tier (always on) reads only leaf scalars — tool name, success
*   flag, agent id, event kind, write/edit file paths, token counts. Message
*   bodies, file contents, error details, and search results are never read.
* - The deep tier (`deepInsights`, default OFF, opted in at first run via the
*   user-questions UI) enables message-body regex matching and session-log
*   history scanning for dedicated achievements. Deep tier matches bodies at
*   runtime and persists only which achievement unlocked — never body text.
* @module @wjnct55555/dsh-achievements
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Config: the deep-insights opt-in and the state-file location. */
const Config = z.object({
	/** Enable message-body regex and session-history achievements (default OFF). */
	deepInsights: z.boolean().default(false),
	/** State directory; defaults to `~/.agent-achievements`. */
	stateDir: z.string().optional()
});
/** The deep-insights first-run question. */
const DEEP_INSIGHTS_QUESTION = {
	id: "deep-insights",
	question: "启用「深度洞察」成就？它会读取消息正文与历史会话做统计匹配（仅用于成就解锁，不存储、不上传、不影响正常使用）。",
	options: [{
		label: "启用",
		value: "enable"
	}, {
		label: "暂不启用",
		value: "skip"
	}]
};
const LANG_BY_EXT = {
	".ts": "TypeScript",
	".tsx": "TypeScript",
	".js": "JavaScript",
	".mjs": "JavaScript",
	".cjs": "JavaScript",
	".jsx": "JavaScript",
	".py": "Python",
	".rs": "Rust",
	".go": "Go",
	".java": "Java",
	".kt": "Kotlin",
	".kts": "Kotlin",
	".c": "C",
	".h": "C",
	".cpp": "C++",
	".cc": "C++",
	".hpp": "C++",
	".cs": "C#",
	".rb": "Ruby",
	".php": "PHP",
	".swift": "Swift",
	".sh": "Shell",
	".bash": "Shell",
	".ps1": "PowerShell"
};
const RUNNABLE_EXTS = /* @__PURE__ */ new Set([
	".py",
	".js",
	".mjs",
	".cjs",
	".ts",
	".tsx",
	".sh",
	".bash",
	".ps1",
	".go",
	".rs",
	".rb",
	".php",
	".java",
	".kt"
]);
const SHELL_TOOLS = /* @__PURE__ */ new Set([
	"bash",
	"shell",
	"pwsh",
	"powershell"
]);
/** Loader module-name fragments that identify an installed dsh-deep-whale skin. */
const DEEP_WHALE_NAMES = [
	"dsh-client-ui-skin-maid-atelier",
	"dsh-deep-whale",
	"maid-atelier"
];
/** Whether a loader module name belongs to the dsh-deep-whale skin family. */
function isDeepWhaleName(name) {
	return DEEP_WHALE_NAMES.some((fragment) => name.includes(fragment));
}
/** Skill tool family: tool names that load/execute skills (from the skill tool). */
const SKILL_TOOL_NAMES = /* @__PURE__ */ new Set(["skill"]);
/** Deep-tier message-body regexes, matched only while deepInsights is on. */
const DEEP_BODY_PATTERNS = {
	"deep-sorry": /sorry|抱歉|apologiz|对不起/i,
	"deep-code-heavy": /```|function |class |const |let |def |import /,
	"deep-question": /\?$/m
};
const ACHIEVEMENTS = [
	{
		id: "first-session",
		name: "启程",
		desc: "开始你的第一个会话",
		icon: "🚀",
		category: "getting-started",
		rarity: "common",
		rule: {
			kind: "distinct",
			key: "sessions",
			target: 1
		}
	},
	{
		id: "first-turn",
		name: "初试身手",
		desc: "完成第一轮对话",
		icon: "👋",
		category: "getting-started",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "turns",
			target: 1
		}
	},
	{
		id: "first-tool",
		name: "工具初体验",
		desc: "第一次调用工具",
		icon: "🛠️",
		category: "getting-started",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "tools",
			target: 1
		}
	},
	{
		id: "tool-10",
		name: "工具新手",
		desc: "累计调用 10 次工具",
		icon: "🔧",
		category: "toolsmith",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "tools",
			target: 10
		}
	},
	{
		id: "tool-50",
		name: "工具达人",
		desc: "累计调用 50 次工具",
		icon: "⚙️",
		category: "toolsmith",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "tools",
			target: 50
		}
	},
	{
		id: "tool-200",
		name: "工具大师",
		desc: "累计调用 200 次工具",
		icon: "🔩",
		category: "toolsmith",
		rarity: "epic",
		rule: {
			kind: "counter",
			key: "tools",
			target: 200
		}
	},
	{
		id: "five-tools",
		name: "多面手",
		desc: "使用过 5 种不同的工具",
		icon: "🧰",
		category: "toolsmith",
		rarity: "rare",
		rule: {
			kind: "distinct",
			key: "toolsUsed",
			target: 5
		}
	},
	{
		id: "tool-palette",
		name: "工具箱收藏家",
		desc: "单回合使用 8 种不同工具",
		icon: "🎨",
		category: "toolsmith",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "counter",
			key: "distinctToolsInTurn",
			target: 8
		}
	},
	{
		id: "first-write",
		name: "白纸作画",
		desc: "第一次写入文件",
		icon: "📝",
		category: "filecraft",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "writes",
			target: 1
		}
	},
	{
		id: "edit-25",
		name: "精雕细琢",
		desc: "累计编辑文件 25 次",
		icon: "✏️",
		category: "filecraft",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "edits",
			target: 25
		}
	},
	{
		id: "linguist",
		name: "语言学家",
		desc: "在单个项目中，用 AI 生成了 3 种或以上不同编程语言的代码",
		icon: "🌐",
		category: "filecraft",
		rarity: "rare",
		rule: {
			kind: "lang-count",
			target: 3
		}
	},
	{
		id: "first-subagent",
		name: "指挥官",
		desc: "第一次派出子代理",
		icon: "🧑‍💼",
		category: "orchestration",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "subagents",
			target: 1
		}
	},
	{
		id: "subagent-5",
		name: "军团",
		desc: "累计派出 5 个子代理",
		icon: "👥",
		category: "orchestration",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "subagents",
			target: 5
		}
	},
	{
		id: "multi-turn",
		name: "多线程",
		desc: "同时运行 3 个子代理",
		icon: "⚡",
		category: "orchestration",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "multiTurn"
		}
	},
	{
		id: "first-workflow",
		name: "编排师",
		desc: "第一次运行 workflow",
		icon: "🎼",
		category: "orchestration",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "workflows",
			target: 1
		}
	},
	{
		id: "big-workflow",
		name: "指挥家",
		desc: "单次 workflow 派出 3 个以上子代理",
		icon: "🎭",
		category: "orchestration",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "bigWorkflow"
		}
	},
	{
		id: "workflow-symphony",
		name: "编排交响乐",
		desc: "累计运行 20 次 workflow",
		icon: "🎻",
		category: "orchestration",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "workflows",
			target: 20
		}
	},
	{
		id: "delegation-king",
		name: "甩手掌柜",
		desc: "单次 workflow 派出 10 个子代理",
		icon: "🤴",
		category: "orchestration",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "counter",
			key: "maxAgentsStarted",
			target: 10
		}
	},
	{
		id: "subagent-army",
		name: "千军万马",
		desc: "累计派出 100 个子代理",
		icon: "⚔️",
		category: "orchestration",
		rarity: "epic",
		rule: {
			kind: "counter",
			key: "subagents",
			target: 100
		}
	},
	{
		id: "first-goal",
		name: "立旗",
		desc: "第一次创建 goal",
		icon: "🎯",
		category: "goals",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "goalsCreated",
			target: 1
		}
	},
	{
		id: "goal-done",
		name: "旗开得胜",
		desc: "第一次完成 goal",
		icon: "🏁",
		category: "goals",
		rarity: "epic",
		rule: {
			kind: "counter",
			key: "goalsCompleted",
			target: 1
		}
	},
	{
		id: "librarian",
		name: "图书管理员",
		desc: "拥有 100 个以上可用 skill",
		icon: "📚",
		category: "skill",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "skills",
			target: 100
		}
	},
	{
		id: "skill-hoarder",
		name: "藏书万卷",
		desc: "拥有 300 个以上可用 skill",
		icon: "🗄️",
		category: "skill",
		rarity: "epic",
		rule: {
			kind: "counter",
			key: "skills",
			target: 300
		}
	},
	{
		id: "skill-sampler",
		name: "博览群书",
		desc: "使用过 20 种不同 skill",
		icon: "📖",
		category: "skill",
		rarity: "rare",
		rule: {
			kind: "distinct",
			key: "skillsUsed",
			target: 20
		}
	},
	{
		id: "skill-addict",
		name: "人形锦囊",
		desc: "累计调用 skill 工具 100 次",
		icon: "🧰",
		category: "skill",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "skillCalls",
			target: 100
		}
	},
	{
		id: "deep-whale",
		name: "吾栖之肤",
		desc: "安装 dsh-deep-whale 鲸鱼娘皮肤插件（联动成就）",
		icon: "🐋",
		category: "crossover",
		rarity: "rare",
		rule: {
			kind: "flag",
			flag: "deepWhale"
		}
	},
	{
		id: "dsh-native",
		name: "原教旨主义者",
		desc: "安装了 5 个以上 DSH 官方之外的插件",
		icon: "📦",
		category: "crossover",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "extraPlugins",
			target: 5
		}
	},
	{
		id: "billionaire",
		name: "亿万富翁",
		desc: "累计消耗一万亿 token",
		icon: "💰",
		category: "hidden",
		rarity: "legendary",
		rule: {
			kind: "counter",
			key: "tokens",
			target: 0xe8d4a51000
		}
	},
	{
		id: "token-bookworm",
		name: "啃书虫",
		desc: "累计输出 100 万 token",
		icon: "🐛",
		category: "hidden",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "outTokens",
			target: 1e6
		}
	},
	{
		id: "cache-whisperer",
		name: "缓存寻宝人",
		desc: "累计命中 500 万 cache-read token",
		icon: "🔮",
		category: "hidden",
		rarity: "epic",
		rule: {
			kind: "counter",
			key: "cacheRead",
			target: 5e6
		}
	},
	{
		id: "cache-perfect",
		name: "百发百中",
		desc: "累计缓存命中率超过 99%",
		icon: "🎯",
		category: "hidden",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "cachePerfect"
		}
	},
	{
		id: "model-hop",
		name: "模型蹦迪",
		desc: "用过 5 个不同的 model",
		icon: "🎵",
		category: "model",
		rarity: "common",
		rule: {
			kind: "distinct",
			key: "models",
			target: 5
		}
	},
	{
		id: "provider-polyglot",
		name: "Provider 语言学家",
		desc: "用过 3 个不同的 provider",
		icon: "🌍",
		category: "model",
		rarity: "rare",
		rule: {
			kind: "distinct",
			key: "providers",
			target: 3
		}
	},
	{
		id: "model-whale",
		name: "模型百科全书",
		desc: "用过 10 个不同的 model",
		icon: "🐘",
		category: "model",
		rarity: "epic",
		rule: {
			kind: "distinct",
			key: "models",
			target: 10
		}
	},
	{
		id: "plan-before-act",
		name: "先谋后动",
		desc: "进入计划模式 20 次",
		icon: "📐",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "planEntries",
			target: 20
		}
	},
	{
		id: "permission-magnet",
		name: "审批磁铁",
		desc: "累计触发 50 次工具审批",
		icon: "🧲",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "approvalsAsked",
			target: 50
		}
	},
	{
		id: "voter",
		name: "表决权持有人",
		desc: "累计拒绝 5 次工具调用",
		icon: "🗳️",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "approvalsRejected",
			target: 5
		}
	},
	{
		id: "compactor",
		name: "断舍离大师",
		desc: "触发 10 次上下文压缩",
		icon: "🗜️",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "compactions",
			target: 10
		}
	},
	{
		id: "scheduler",
		name: "时间管理大师",
		desc: "创建过定时任务",
		icon: "⏰",
		category: "behavior",
		rarity: "common",
		rule: {
			kind: "counter",
			key: "schedulesCreated",
			target: 1
		}
	},
	{
		id: "critic",
		name: "苛刻的读者",
		desc: "提交过 3 次反馈",
		icon: "🕵️",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "feedbacks",
			target: 3
		}
	},
	{
		id: "title-architect",
		name: "起名大师",
		desc: "会话标题被 AI 起名 10 次",
		icon: "🏷️",
		category: "behavior",
		rarity: "rare",
		rule: {
			kind: "counter",
			key: "titles",
			target: 10
		}
	},
	{
		id: "night-owl",
		name: "夜猫子",
		desc: "在凌晨 0-5 点发送消息",
		icon: "🦉",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "nightOwl"
		}
	},
	{
		id: "phoenix",
		name: "凤凰涅槃",
		desc: "回合内出错却仍然完成",
		icon: "🔥",
		category: "hidden",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "phoenix"
		}
	},
	{
		id: "marathon",
		name: "马拉松",
		desc: "单回合内调用 10 次工具",
		icon: "🏃",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "marathon"
		}
	},
	{
		id: "shape-shifter",
		name: "百变星君",
		desc: "切换过 3 种不同的 agent preset",
		icon: "🦎",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "distinct",
			key: "presets",
			target: 3
		}
	},
	{
		id: "self-ref",
		name: "自我指涉",
		desc: "用 DeepSeek Harness 修改了 DSH 本身",
		icon: "♻️",
		category: "hidden",
		rarity: "epic",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "selfRef"
		}
	},
	{
		id: "self-ref-v2",
		name: "自我指涉·闭环",
		desc: "用成就工具查询自己",
		icon: "🪞",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "selfRefV2"
		}
	},
	{
		id: "self-ref-v3",
		name: "观察者效应",
		desc: "查询成就进度 10 次",
		icon: "👁️",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "counter",
			key: "selfQueries",
			target: 10
		}
	},
	{
		id: "that-works",
		name: "这也能行？",
		desc: "用一段看似毫不相关的自然语言描述，让 AI 生成了一个可运行的程序",
		icon: "🤔",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		rule: {
			kind: "flag",
			flag: "thatWorks"
		}
	},
	{
		id: "deep-sorry",
		name: "道歉大师",
		desc: "AI 累计道歉 10 次（深度洞察）",
		icon: "🙇",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		deep: true,
		rule: {
			kind: "counter",
			key: "deepSorry",
			target: 10
		}
	},
	{
		id: "deep-code-heavy",
		name: "代码洪流",
		desc: "收到 50 条含代码块的消息（深度洞察）",
		icon: "🌊",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		deep: true,
		rule: {
			kind: "counter",
			key: "deepCodeHeavy",
			target: 50
		}
	},
	{
		id: "deep-question",
		name: "十万个为什么",
		desc: "用户连续提问 20 次（深度洞察）",
		icon: "❓",
		category: "hidden",
		rarity: "rare",
		hidden: true,
		deep: true,
		rule: {
			kind: "counter",
			key: "deepQuestion",
			target: 20
		}
	}
];
/** Return the lowercase file extension, or '' for paths without one. */
function extOf(path) {
	if (typeof path !== "string") return "";
	const slash = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	const base = slash >= 0 ? path.slice(slash + 1) : path;
	const dot = base.lastIndexOf(".");
	return dot > 0 ? base.slice(dot).toLowerCase() : "";
}
/** Whether a write/edit path points at the DSH checkout itself (a coarse self-reference signal). */
function isDshPath(path) {
	if (typeof path !== "string") return false;
	const norm = path.replace(/\\/g, "/");
	return norm.includes("deepseek-harness") || norm.includes("/packages/") || norm.includes("/vendor/") || norm.includes("/apps/") || norm.includes("/scripts/");
}
/** Extract plain text from a message-like value (deep tier only; never stored). */
function textOf(message) {
	if (typeof message === "string") return message;
	if (message === null || typeof message !== "object") return "";
	const content = message.content;
	if (typeof content === "string") return content;
	if (Array.isArray(content)) return content.map((block) => {
		if (block === null || typeof block !== "object") return "";
		const b = block;
		if (typeof b.text === "string") return b.text;
		return typeof b.content === "string" ? b.content : "";
	}).join("\n");
	return "";
}
/** Achievements service: durable global observers, one-shot unlock queue, and read-only Remote surface. */
let AchievementsService = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _deepState_decorators;
	let _setDeepInsights_decorators;
	let _list_decorators;
	let _recent_decorators;
	let _dock_decorators;
	return class AchievementsService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_deepState_decorators = [Remote("deepState")];
			_setDeepInsights_decorators = [Remote("setDeepInsights")];
			_list_decorators = [Remote("list")];
			_recent_decorators = [Remote("recent")];
			_dock_decorators = [Remote("dock")];
			__esDecorate(this, null, _deepState_decorators, {
				kind: "method",
				name: "deepState",
				static: false,
				private: false,
				access: {
					has: (obj) => "deepState" in obj,
					get: (obj) => obj.deepState
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setDeepInsights_decorators, {
				kind: "method",
				name: "setDeepInsights",
				static: false,
				private: false,
				access: {
					has: (obj) => "setDeepInsights" in obj,
					get: (obj) => obj.setDeepInsights
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _recent_decorators, {
				kind: "method",
				name: "recent",
				static: false,
				private: false,
				access: {
					has: (obj) => "recent" in obj,
					get: (obj) => obj.recent
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _dock_decorators, {
				kind: "method",
				name: "dock",
				static: false,
				private: false,
				access: {
					has: (obj) => "dock" in obj,
					get: (obj) => obj.dock
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["tools"];
		counters = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
		distinct = /* @__PURE__ */ new Map();
		flags = /* @__PURE__ */ new Set();
		turnState = /* @__PURE__ */ new Map();
		unlocked = /* @__PURE__ */ new Map();
		unlockQueue = [];
		activeSubagents = /* @__PURE__ */ new Set();
		seenUsage = /* @__PURE__ */ new Set();
		store;
		deepInsights;
		constructor(ctx, config = {}) {
			super(ctx, "achievements");
			this.ownCtx = ctx;
			this.deepInsights = config.deepInsights ?? false;
			const stateDir = config.stateDir ?? join(homedir(), ".agent-achievements");
			this.store = new AchievementStateStore(join(stateDir, "state.json"));
			this.restore(ctx);
			this.attachListeners(ctx);
			this.attachDeepListeners(ctx);
			this.seedSessions(ctx);
			this.registerTool(ctx);
			this.detectDeepWhale(ctx);
			ctx.on("loader/entry-init", () => {
				queueMicrotask(() => {
					this.detectDeepWhale(ctx);
				});
			});
			this.trackSkills(ctx);
			ctx.effect(() => async () => {
				await this.store.flush();
			}, "achievements: flush state");
		}
		/** Restore persisted state, then run the first-run deep-insights opt-in when applicable. */
		async restore(ctx) {
			const state = await this.store.load();
			this.applyPersisted(state);
			const decided = state.counters["deepAsked"] !== void 0;
			if (!this.deepInsights && !decided) {
				const questions = ctx.get("userQuestions");
				if (questions !== void 0 && typeof questions.ask === "function") try {
					if ((await questions.ask({ questions: [DEEP_INSIGHTS_QUESTION] })).answers?.find((a) => a.id === "deep-insights")?.selected?.[0] === "enable") this.enableDeepInsights(ctx);
				} catch {}
				this.counters.set("deepAsked", 1);
				this.scheduleSave();
			}
			this.checkAll();
		}
		/** Turn on deep insights at runtime (from the settings toggle or the first-run ask). */
		enableDeepInsights(ctx) {
			if (this.deepInsights) return;
			this.deepInsights = true;
			this.scanHistory(ctx);
			this.scheduleSave();
		}
		/** Remote surface: read the deep-insights opt-in state. */
		deepState() {
			return { enabled: this.deepInsights };
		}
		/** Remote surface: toggle deep insights from the settings panel. */
		setDeepInsights(enabled) {
			if (enabled && !this.deepInsights) {
				const ctx = this.ownCtx;
				if (ctx !== void 0) this.enableDeepInsights(ctx);
				else this.deepInsights = true;
			} else if (!enabled) {
				this.deepInsights = false;
				this.scheduleSave();
			}
			return { enabled: this.deepInsights };
		}
		/** The context this service was constructed with (retained for runtime wiring). */
		ownCtx;
		/** Fold persisted state back into the in-memory containers. */
		applyPersisted(state) {
			for (const [key, value] of Object.entries(state.counters)) if (typeof value === "number") this.counters.set(key, value);
			for (const [key, values] of Object.entries(state.distinct)) {
				if (!Array.isArray(values)) continue;
				const set = /* @__PURE__ */ new Set();
				for (const value of values) if (typeof value === "string") set.add(value);
				if (set.size > 0) this.distinct.set(key, set);
			}
			for (const flag of state.flags) if (typeof flag === "string") this.flags.add(flag);
			for (const [id, at] of Object.entries(state.unlocked)) if (typeof at === "number") this.unlocked.set(id, at);
		}
		/** Snapshot current state for persistence (deep bodies never included). */
		snapshot() {
			const counters = {};
			for (const [key, value] of this.counters) counters[key] = value;
			const distinct = {};
			for (const [key, set] of this.distinct) distinct[key] = [...set];
			const flags = [...this.flags];
			const unlocked = {};
			for (const [id, at] of this.unlocked) unlocked[id] = at;
			return {
				schemaVersion: 1,
				counters,
				distinct,
				flags,
				unlocked
			};
		}
		scheduleSave() {
			this.store.save(this.snapshot());
		}
		/** Track the number of available skills for the librarian achievement. */
		trackSkills(ctx) {
			const skills = ctx.get("skills");
			const refresh = () => {
				if (skills === void 0 || typeof skills.list !== "function") return;
				skills.list().then((items) => {
					this.counters.set("skills", items.length);
					this.checkAll();
				}).catch(() => {});
			};
			refresh();
			ctx.on("skills/change", refresh);
		}
		/** Read the full catalog with live progress. */
		list() {
			return {
				total: ACHIEVEMENTS.length,
				unlocked: this.unlocked.size,
				achievements: ACHIEVEMENTS.map((a) => this.viewOf(a))
			};
		}
		/** Drain and return newly unlocked achievements (consumes the queue). */
		recent() {
			return { unlocks: this.unlockQueue.splice(0) };
		}
		/** Compact readout for the composer dock strip. */
		dock() {
			let next = null;
			for (const a of ACHIEVEMENTS) {
				if (this.unlocked.has(a.id) || a.rule.kind === "flag") continue;
				const p = this.progressOf(a.rule);
				const gap = p.target - p.current;
				if (next === null || gap < next.gap) next = {
					name: a.name,
					icon: a.icon,
					current: p.current,
					target: p.target,
					gap
				};
			}
			return {
				unlocked: this.unlocked.size,
				total: ACHIEVEMENTS.length,
				streak: this.counters.get("streak") ?? 0,
				next: next === null ? null : {
					name: next.name,
					icon: next.icon,
					current: next.current,
					target: next.target
				}
			};
		}
		viewOf(a) {
			return {
				id: a.id,
				name: a.name,
				desc: a.desc,
				icon: a.icon,
				category: a.category,
				rarity: a.rarity,
				hidden: a.hidden === true,
				deep: a.deep === true,
				deepLocked: a.deep === true && !this.deepInsights,
				unlocked: this.unlocked.has(a.id),
				unlockedAt: this.unlocked.get(a.id) ?? null,
				progress: this.progressOf(a.rule)
			};
		}
		bump(key, by = 1) {
			this.counters.set(key, (this.counters.get(key) ?? 0) + by);
			this.scheduleSave();
		}
		addDistinct(key, value) {
			let set = this.distinct.get(key);
			if (set === void 0) {
				set = /* @__PURE__ */ new Set();
				this.distinct.set(key, set);
			}
			set.add(value);
			this.scheduleSave();
		}
		mark(flag) {
			this.flags.add(flag);
			this.scheduleSave();
		}
		agentKey(agent) {
			return agent !== void 0 && typeof agent.id === "string" ? agent.id : "root";
		}
		ruleMet(rule) {
			if (rule.kind === "counter") return (this.counters.get(rule.key) ?? 0) >= rule.target;
			if (rule.kind === "distinct") return (this.distinct.get(rule.key)?.size ?? 0) >= rule.target;
			if (rule.kind === "lang-count") return this.maxLangCount() >= rule.target;
			return this.flags.has(rule.flag);
		}
		maxLangCount() {
			let max = 0;
			for (const [key, set] of this.distinct) if (key.startsWith("lang:") && set.size > max) max = set.size;
			return max;
		}
		progressOf(rule) {
			if (rule.kind === "counter") return {
				current: Math.min(this.counters.get(rule.key) ?? 0, rule.target),
				target: rule.target
			};
			if (rule.kind === "distinct") return {
				current: Math.min(this.distinct.get(rule.key)?.size ?? 0, rule.target),
				target: rule.target
			};
			if (rule.kind === "lang-count") return {
				current: Math.min(this.maxLangCount(), rule.target),
				target: rule.target
			};
			return {
				current: 0,
				target: 1
			};
		}
		checkAll() {
			let changed = false;
			for (const a of ACHIEVEMENTS) {
				if (this.unlocked.has(a.id) || !this.ruleMet(a.rule)) continue;
				const at = Date.now();
				this.unlocked.set(a.id, at);
				this.unlockQueue.push({
					id: a.id,
					name: a.name,
					rarity: a.rarity,
					icon: a.icon,
					at
				});
				changed = true;
			}
			if (changed) this.scheduleSave();
		}
		turnFor(agent) {
			const key = this.agentKey(agent);
			let turn = this.turnState.get(key);
			if (turn === void 0) {
				turn = {
					toolCalls: 0,
					error: false,
					wroteRunnable: false,
					ranShell: false,
					distinctTools: /* @__PURE__ */ new Set()
				};
				this.turnState.set(key, turn);
			}
			return turn;
		}
		seedSessions(ctx) {
			const agents = ctx.get("agents");
			if (agents === void 0 || typeof agents.list !== "function") return;
			for (const agent of agents.list()) if (typeof agent.id === "string") this.addDistinct("sessions", agent.id);
			this.checkAll();
		}
		/** Mark the dsh-deep-whale crossover achievement and count third-party plugins. */
		detectDeepWhale(ctx) {
			const loader = ctx.get("loader");
			if (loader === void 0) return;
			let deepWhaleSeen = false;
			let extraPlugins = 0;
			for (const entry of loader.entries()) {
				const name = entry.options.name;
				if (typeof name !== "string") continue;
				if (isDeepWhaleName(name)) deepWhaleSeen = true;
				if (!name.startsWith("@deepseek-ai/dsh-") && !name.startsWith("cordis:") && !name.startsWith(".")) extraPlugins += 1;
			}
			if (deepWhaleSeen) this.mark("deepWhale");
			if (extraPlugins >= 5) this.counters.set("extraPlugins", extraPlugins);
			this.checkAll();
		}
		attachListeners(ctx) {
			ctx.on("tools/result", (exec, result) => {
				const name = exec.name;
				this.bump("tools");
				this.addDistinct("toolsUsed", name);
				if (name === "write") this.bump("writes");
				if (name === "edit") this.bump("edits");
				if (!result.isError) this.bump("streak");
				else this.counters.set("streak", 0);
				const turn = this.turnFor(exec.agent);
				turn.toolCalls += 1;
				turn.distinctTools.add(name);
				if (turn.toolCalls >= 10) this.mark("marathon");
				if (turn.distinctTools.size >= 8) this.mark("toolPalette");
				if (name === "list_achievements") {
					this.bump("selfQueries");
					this.mark("selfRefV2");
				}
				if (SKILL_TOOL_NAMES.has(name)) {
					this.bump("skillCalls");
					this.addDistinct("skillsUsed", name);
				}
				if ((name === "write" || name === "edit") && exec.arguments !== void 0) {
					const path = exec.arguments.file_path;
					if (typeof path === "string") {
						const ext = extOf(path);
						const lang = LANG_BY_EXT[ext];
						if (lang !== void 0) {
							const segs = path.replace(/\\/g, "/").split("/").filter(Boolean);
							const project = segs.length >= 2 ? segs[1] ?? "default" : segs[0] ?? "default";
							this.addDistinct(`lang:${project}`, lang);
						}
						if (isDshPath(path)) this.mark("selfRef");
						if (RUNNABLE_EXTS.has(ext)) turn.wroteRunnable = true;
					}
				}
				if (SHELL_TOOLS.has(name)) turn.ranShell = true;
				if (turn.wroteRunnable && turn.ranShell) this.mark("thatWorks");
				this.checkAll();
			});
			ctx.on("session/event", (_session, event) => {
				if (event.type === "assistant/message") {
					const usage = event.data.usage;
					if (usage !== void 0 && typeof usage === "object") {
						const turn = event.data.turn;
						const step = event.data.step;
						const key = `${_session.id}:${turn}:${step}`;
						if (!this.seenUsage.has(key)) {
							this.seenUsage.add(key);
							const record = usage;
							const total = [
								record.inputTokens,
								record.outputTokens,
								record.cacheReadTokens,
								record.cacheWriteTokens,
								record.reasoningTokens
							].reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
							if (total > 0) this.bump("tokens", total);
							if (typeof record.outputTokens === "number") this.bump("outTokens", record.outputTokens);
							if (typeof record.cacheReadTokens === "number") this.bump("cacheRead", record.cacheReadTokens);
							if (typeof record.inputTokens === "number") this.bump("uncachedInput", record.inputTokens);
							if (typeof record.reasoningTokens === "number") this.bump("reasoningTokens", record.reasoningTokens);
							this.checkAll();
							const cacheRead = this.counters.get("cacheRead") ?? 0;
							const uncached = this.counters.get("uncachedInput") ?? 0;
							if (cacheRead > 0 && uncached > 0 && cacheRead / (cacheRead + uncached) >= .99) {
								this.mark("cachePerfect");
								this.checkAll();
							}
						}
					}
					return;
				}
				if (event.type === "request/header") {
					const header = event.data.header;
					const provider = header?.config?.provider;
					const model = header?.config?.model;
					if (typeof provider === "string" && provider.length > 0) this.addDistinct("providers", provider);
					if (typeof model === "string" && model.length > 0) this.addDistinct("models", model);
					return;
				}
				if (event.type === "plan/mode") {
					if (event.data.active) this.bump("planEntries");
					return;
				}
				if (event.type === "approval/asked") {
					this.bump("approvalsAsked");
					return;
				}
				if (event.type === "approval/decided") {
					if (event.data.outcome === "rejected") this.bump("approvalsRejected");
					return;
				}
				if (event.type === "compaction/end") {
					this.bump("compactions");
					return;
				}
				if (event.type === "schedule/change") {
					if (event.data.operation === "create") this.bump("schedulesCreated");
					return;
				}
				if (event.type === "feedback/record") {
					this.bump("feedbacks");
					return;
				}
				if (event.type === "session/title") {
					this.bump("titles");
					return;
				}
				if (event.type === "user/message" && this.deepInsights && textOf(event.data).endsWith("?")) this.bump("deepQuestion");
			});
			ctx.on("agent/request-error", (payload, next) => {
				this.turnFor(payload.agent).error = true;
				return next();
			});
			ctx.on("agent/error", (payload) => {
				this.turnState.delete(this.agentKey(payload.agent));
			});
			ctx.on("agent/turn-stopping", (payload) => {
				this.bump("turns");
				const turn = this.turnState.get(this.agentKey(payload.agent));
				if (turn !== void 0) {
					if (turn.error) this.mark("phoenix");
					if (turn.wroteRunnable && turn.ranShell) this.mark("thatWorks");
					this.turnState.delete(this.agentKey(payload.agent));
				}
				this.checkAll();
			});
			ctx.on("goal/changed", (payload) => {
				const op = payload.change.operation;
				if (op === "create") this.bump("goalsCreated");
				if (op === "complete") this.bump("goalsCompleted");
				this.checkAll();
			});
			ctx.on("subagent/start", (info) => {
				this.activeSubagents.add(info.runId);
				if (this.activeSubagents.size >= 3) this.mark("multiTurn");
				this.checkAll();
			});
			ctx.on("subagent/end", (info) => {
				this.bump("subagents");
				this.activeSubagents.delete(info.runId);
				this.checkAll();
			});
			ctx.on("workflow/end", (_info, result) => {
				this.bump("workflows");
				if (result.agentsStarted >= 3) this.mark("bigWorkflow");
				const prev = this.counters.get("maxAgentsStarted") ?? 0;
				if (result.agentsStarted > prev) {
					this.counters.set("maxAgentsStarted", result.agentsStarted);
					this.scheduleSave();
				}
				this.checkAll();
			});
			ctx.on("agent-preset/selected", (_sessionId, preset) => {
				this.addDistinct("presets", preset);
				this.checkAll();
			});
			ctx.on("agent/inbox/inserted", () => {
				const hour = (/* @__PURE__ */ new Date()).getHours();
				if (hour >= 0 && hour < 5) this.mark("nightOwl");
				this.checkAll();
			});
			ctx.on("agent/session-start", (payload) => {
				this.addDistinct("sessions", this.agentKey(payload.agent));
				this.checkAll();
			});
		}
		/** Deep-tier listeners: message-body regex matches (runtime only, never stored). */
		attachDeepListeners(ctx) {
			ctx.on("session/event", (_session, event) => {
				if (!this.deepInsights) return;
				if (event.type !== "assistant/message") return;
				const text = textOf(event.data.message);
				if (DEEP_BODY_PATTERNS["deep-sorry"]?.test(text)) this.bump("deepSorry");
				if (DEEP_BODY_PATTERNS["deep-code-heavy"]?.test(text)) this.bump("deepCodeHeavy");
				this.checkAll();
			});
		}
		/** One history scan over known sessions (deep tier): seed counters from past events. */
		async scanHistory(ctx) {
			const sessions = ctx.get("sessions");
			if (sessions === void 0 || typeof sessions.list !== "function") return;
			try {
				const all = await sessions.list();
				for (const session of all) for (const event of session.events) if (event.type === "assistant/message") {
					const usage = event.data.usage;
					if (usage !== void 0 && typeof usage === "object") {
						const record = usage;
						if (typeof record.outputTokens === "number") this.bump("outTokens", record.outputTokens);
						if (typeof record.cacheReadTokens === "number") this.bump("cacheRead", record.cacheReadTokens);
						if (typeof record.inputTokens === "number") this.bump("uncachedInput", record.inputTokens);
					}
					const text = textOf(event.data.message);
					if (DEEP_BODY_PATTERNS["deep-sorry"]?.test(text)) this.bump("deepSorry");
					if (DEEP_BODY_PATTERNS["deep-code-heavy"]?.test(text)) this.bump("deepCodeHeavy");
				} else if (event.type === "request/header") {
					const header = event.data.header;
					if (typeof header?.config?.provider === "string") this.addDistinct("providers", header.config.provider);
					if (typeof header?.config?.model === "string") this.addDistinct("models", header.config.model);
				} else if (event.type === "plan/mode" && event.data.active) this.bump("planEntries");
				else if (event.type === "approval/asked") this.bump("approvalsAsked");
				else if (event.type === "approval/decided" && event.data.outcome === "rejected") this.bump("approvalsRejected");
				else if (event.type === "compaction/end") this.bump("compactions");
				this.checkAll();
			} catch {}
		}
		registerTool(ctx) {
			ctx.tools.register(defineTool({
				name: "list_achievements",
				description: "查询当前成就系统状态：已解锁成就、总成就数、最近解锁与各项进度。只读，不影响会话。",
				parameters: {},
				output: {
					schema: { type: "json" },
					render: (_args, value) => [{
						type: "text",
						text: JSON.stringify(value, null, 2)
					}]
				},
				execute: (_args, _exec) => Promise.resolve({
					unlockedCount: this.unlocked.size,
					total: ACHIEVEMENTS.length,
					streak: this.counters.get("streak") ?? 0,
					recent: this.unlockQueue.slice(-3).map((u) => ({
						id: u.id,
						name: u.name,
						rarity: u.rarity,
						icon: u.icon
					})),
					achievements: ACHIEVEMENTS.map((a) => this.viewOf(a))
				})
			}));
		}
	};
})();
//#endregion
export { AchievementsService, AchievementsService as default, Config };
