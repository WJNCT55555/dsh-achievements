# dsh-achievements 设计文档

> 本文件记录 dsh-achievements（DeepSeek Harness 成就系统）的**当前设计架构**与**未来演进方向**。当前架构与代码一一对应（`packages/extensions/achievements` 与 `packages/extensions/ui-achievements`）；未来方向参考了 [AgentPlayerAchievements (AGPA)](https://github.com/eiainano/AgentPlayerAchievements) 等同类项目，仅作为设计候选，未实现。

---

## 1. 设计目标与原则

成就系统为 DeepSeek Harness（DSH）Web 界面提供游戏化激励：把 agent 的真实行为（工具调用、文件操作、子代理、workflow、goal、preset 切换、skill、模型路由等）折叠成可展示的成就。设计遵循以下硬约束：

1. **纯观察者，零干扰** — 服务只监听事件、累加计数，从不修改、拦截或影响 agent 循环；任何监听器异常都被隔离，不会泄漏进主流程。
2. **分层隐私** — 基础层只读取叶子标量（工具名、成功标志、agent id、事件类型、文件路径、token 计数），**从不读取**消息正文、文件内容、错误详情、搜索结果；深度洞察层（`deepInsights`，默认关闭、opt-in）允许对消息正文正则匹配与历史会话扫描，但正文只在运行时匹配、**绝不落盘**。零上传、零遥测。
3. **本地持久化** — 计数、去重集合、标志与解锁时间戳写入 `~/.agent-achievements/state.json`（防抖写入，dispose 时 flush），重启后完整恢复；只持久化成就进度，不含任何消息/文件内容。
4. **可验证** — 每个成就必须真实可达（存在能触发它的事件路径），通过单元测试断言。

---

## 2. 总体架构

```
                    ┌──────────────────────────────────────┐
                    │   Host 引擎 (AchievementsService)    │
                    │   @deepseek-ai/dsh-achievements      │
                    │                                      │
   agent/session    │  ctx.on(...)  ──►  计数器/集合/标志    │
   tools/workflow ──┤                                      │
   goal/subagent ───┤  checkAll()   ──►  解锁队列           │
                    │                                      │
                    └───────────────┬──────────────────────┘
                                    │  Typert Remote (list / recent / dock)
                                    │  JSON-RPC over the DSH API gateway
                    ┌───────────────▼──────────────────────┐
                    │   Client UI                          │
                    │   @deepseek-ai/dsh-client-ui-achievements │
                    │                                      │
                    │   store.ts ◄── 3s 轮询 recent+dock    │
                    │     ├─ settings.section     画廊     │
                    │     ├─ shell.overlay        toast+画廊│
                    │     ├─ sidebar.footer.action 奖杯    │
                    │     └─ conversation.composer.dock 读条│
                    └──────────────────────────────────────┘
```

两个包遵循 DSH 的正式两包插件模式：

- **Host 包**（`dsh-achievements`）：`AchievementsService extends TypertRemoteService`，注册 `list` / `recent` / `dock` 三个 Remote 方法，并注册只读模型工具 `list_achievements`。
- **Client 包**（`dsh-client-ui-achievements`）：注册四个槽位表面，apply 世界用可选 `timer` 每 3 秒轮询 `recent` + `dock` 喂给快照 store；组件只读 store，从不自行订阅 Remote。

---

## 3. 规则引擎

### 3.1 规则类型（`Rule`）

| kind | 语义 | 数据结构 | 当前用途 |
|------|------|----------|----------|
| `counter` | 累计达到阈值 | `{ key, target }` | turns、tools、writes、edits、streak、subagents、workflows、goalsCreated、goalsCompleted、tokens |
| `distinct` | 去重集合达到阈值 | `{ key, target }` | sessions、toolsUsed、presets |
| `lang-count` | 某项目语言种类达到阈值 | `{ target }` | linguist（3 种语言） |
| `flag` | 一次性事件标志 | `{ flag }` | multiTurn、bigWorkflow、deepWhale、nightOwl、phoenix、marathon、selfRef、thatWorks |

规则与成就定义同构存放在 `ACHIEVEMENTS` 数组中；`ruleMet()` 统一求值，`progressOf()` 统一投影（flag 无进度）。

### 3.2 状态容器

| 容器 | 类型 | 说明 |
|------|------|------|
| `counters` | `Map<string, number>` | 单调累加计数 |
| `distinct` | `Map<string, Set<string>>` | 去重集合；`lang:*` 前缀按项目分桶 |
| `flags` | `Set<string>` | 一次性标志 |
| `turnState` | `Map<string, TurnState>` | 按 agent 的回合内临时事实（工具数、出错、写了可运行文件、跑了 shell），在 `agent/turn-stopping` 或 `agent/error` 时清理 |
| `activeSubagents` | `Set<string>` | 存活的子代理 runId，用于并发计数 |
| `seenUsage` | `Set<string>` | token 采样去重（session:turn:step） |
| `unlocked` / `unlockQueue` | `Map` / `RecentUnlock[]` | 已解锁时间戳 + 一次性消费队列 |

### 3.3 关键设计决策

#### 3.3.1 phoenix（凤凰涅槃）的触发信号

「回合内出错却仍然完成」的正确信号是 `agent/request-error`（waterfall），**不是** `agent/error`：

- `agent/error` 只在致命路径触发（`throwError` 后回合以 error 结束），此时 `agent/turn-stopping` **不会**发出，原实现永远无法解锁。
- `agent/request-error` 在模型请求失败但可能被 `llm-retry` 恢复时触发；恢复成功后回合正常完成 → `agent/turn-stopping` 检查到 `turn.error` → 解锁 phoenix。
- 作为 waterfall 监听器必须调用 `next()` 委托，避免短路 llm-retry 的重试链。

#### 3.3.2 回合状态生命周期

`turnState` 的清理有两个出口：正常完成走 `agent/turn-stopping`；致命错误走 `agent/error`（否则残留状态会让 marathon / that-works 的计数跨回合泄漏）。

#### 3.3.3 token 去重键

`seenUsage` 键为 `sessionId:turn:step`（不是裸 `turn:step`），因为两个并发会话可能共享相同的 (turn, step)，裸键会漏计。

#### 3.3.4 multi-turn（多线程）

用 `activeSubagents` 集合跟踪**并发存活**子代理（`subagent/start` 加入、`subagent/end` 移除、size ≥ 3 解锁），避免用全局计数器被子代理自身的回合关闭误清零。

#### 3.3.5 联动成就（deep-whale / 吾栖之肤）

通过读取 Loader 配置条目检测：构造时扫描 `ctx.loader.entries()` 的 `options.name`，匹配 `dsh-client-ui-skin-maid-atelier` / `deep-whale` / `maid-atelier` 片段；再监听 `loader/entry-init` 并在微任务中重扫，覆盖 HMR / 后续用户补丁加载的皮肤。只读模块名字符串，不读取任何配置内容。

---

## 4. 事件监听与成就目录

Host 引擎注册的事件监听器（基础层）：

| 事件 | 折叠进 | 成就 |
|------|--------|------|
| `tools/result` | tools、toolsUsed、writes、edits、streak、turnState、selfQueries、skillCalls、skillsUsed | first-tool、tool-10/50/200、five-tools、tool-palette、first-write、edit-25、marathon、that-works、self-ref、self-ref-v2/v3、linguist、skill-sampler、skill-addict |
| `session/event` (`assistant/message`) | tokens、outTokens、cacheRead、reasoningTokens（去重采样） | billionaire、token-bookworm、cache-whisperer |
| `session/event` (`request/header`) | models、providers | model-hop、provider-polyglot、model-whale |
| `session/event` (`plan/mode` / `approval/*` / `compaction/end` / `schedule/change` / `feedback/record` / `session/title`) | planEntries、approvalsAsked、approvalsRejected、compactions、schedulesCreated、feedbacks、titles | plan-before-act、permission-magnet、voter、compactor、scheduler、critic、title-architect |
| `agent/request-error` | turnState.error | phoenix |
| `agent/error` | 清理 turnState | —（生命周期） |
| `agent/turn-stopping` | turns、phoenix、that-works | first-turn、phoenix |
| `goal/changed` | goalsCreated、goalsCompleted | first-goal、goal-done |
| `skills/change` / 构造采样 | skills（`ctx.skills.list()` 数量） | librarian、skill-hoarder |
| `subagent/start` / `subagent/end` | activeSubagents、subagents | multi-turn、first-subagent、subagent-5、subagent-army |
| `workflow/end` | workflows、maxAgentsStarted | first-workflow、big-workflow、workflow-symphony、delegation-king |
| `agent-preset/selected` | presets | shape-shifter |
| `agent/inbox/inserted` | nightOwl（本地时间 0-5 点） | night-owl |
| `agent/session-start` | sessions | first-session |
| `loader/entry-init` + 构造扫描 | deepWhale、extraPlugins | deep-whale、dsh-native |
| 构造时种子 | sessions（`agents.list()`） | first-session |
| `session/event` (`user/message` + `assistant/message`，深度层) | deepSorry、deepCodeHeavy、deepQuestion | deep-sorry、deep-code-heavy、deep-question |

### 完整成就目录（51 个）

| id | 名称 | 分类 | 稀有度 | 规则 | 深度 |
|----|------|------|--------|------|------|
| first-session | 启程 | getting-started | common | distinct sessions ≥ 1 | — |
| first-turn | 初试身手 | getting-started | common | counter turns ≥ 1 | — |
| first-tool | 工具初体验 | getting-started | common | counter tools ≥ 1 | — |
| tool-10 | 工具新手 | toolsmith | common | counter tools ≥ 10 | — |
| tool-50 | 工具达人 | toolsmith | rare | counter tools ≥ 50 | — |
| tool-200 | 工具大师 | toolsmith | epic | counter tools ≥ 200 | — |
| five-tools | 多面手 | toolsmith | rare | distinct toolsUsed ≥ 5 | — |
| tool-palette | 工具箱收藏家 | toolsmith | epic | counter distinctToolsInTurn ≥ 8（hidden） | — |
| first-write | 白纸作画 | filecraft | common | counter writes ≥ 1 | — |
| edit-25 | 精雕细琢 | filecraft | rare | counter edits ≥ 25 | — |
| linguist | 语言学家 | filecraft | rare | lang-count ≥ 3 | — |
| first-subagent | 指挥官 | orchestration | common | counter subagents ≥ 1 | — |
| subagent-5 | 军团 | orchestration | rare | counter subagents ≥ 5 | — |
| multi-turn | 多线程 | orchestration | rare | flag（3 并发，hidden） | — |
| first-workflow | 编排师 | orchestration | rare | counter workflows ≥ 1 | — |
| big-workflow | 指挥家 | orchestration | epic | flag（agentsStarted ≥ 3，hidden） | — |
| workflow-symphony | 编排交响乐 | orchestration | rare | counter workflows ≥ 20 | — |
| delegation-king | 甩手掌柜 | orchestration | epic | counter maxAgentsStarted ≥ 10（hidden） | — |
| subagent-army | 千军万马 | orchestration | epic | counter subagents ≥ 100 | — |
| first-goal | 立旗 | goals | common | counter goalsCreated ≥ 1 | — |
| goal-done | 旗开得胜 | goals | epic | counter goalsCompleted ≥ 1 | — |
| librarian | 图书管理员 | skill | rare | counter skills ≥ 100 | — |
| skill-hoarder | 藏书万卷 | skill | epic | counter skills ≥ 300 | — |
| skill-sampler | 博览群书 | skill | rare | distinct skillsUsed ≥ 20 | — |
| skill-addict | 人形锦囊 | skill | rare | counter skillCalls ≥ 100 | — |
| model-hop | 模型蹦迪 | model | common | distinct models ≥ 5 | — |
| provider-polyglot | Provider 语言学家 | model | rare | distinct providers ≥ 3 | — |
| model-whale | 模型百科全书 | model | epic | distinct models ≥ 10 | — |
| plan-before-act | 先谋后动 | behavior | rare | counter planEntries ≥ 20 | — |
| permission-magnet | 审批磁铁 | behavior | rare | counter approvalsAsked ≥ 50 | — |
| voter | 表决权持有人 | behavior | rare | counter approvalsRejected ≥ 5 | — |
| compactor | 断舍离大师 | behavior | rare | counter compactions ≥ 10 | — |
| scheduler | 时间管理大师 | behavior | common | counter schedulesCreated ≥ 1 | — |
| critic | 苛刻的读者 | behavior | rare | counter feedbacks ≥ 3 | — |
| title-architect | 起名大师 | behavior | rare | counter titles ≥ 10 | — |
| deep-whale | 吾栖之肤 | crossover | rare | flag（安装 dsh-deep-whale 皮肤） | — |
| dsh-native | 原教旨主义者 | crossover | rare | counter extraPlugins ≥ 5 | — |
| night-owl | 夜猫子 | hidden | rare | flag（0-5 点发消息，hidden） | — |
| phoenix | 凤凰涅槃 | hidden | epic | flag（回合出错仍完成，hidden） | — |
| marathon | 马拉松 | hidden | rare | flag（单回合 10 工具，hidden） | — |
| shape-shifter | 百变星君 | hidden | rare | distinct presets ≥ 3（hidden） | — |
| self-ref | 自我指涉 | hidden | epic | flag（修改 DSH 自身，hidden） | — |
| self-ref-v2 | 自我指涉·闭环 | hidden | rare | flag（用成就工具查询自己，hidden） | — |
| self-ref-v3 | 观察者效应 | hidden | rare | counter selfQueries ≥ 10（hidden） | — |
| that-works | 这也能行？ | hidden | rare | flag（写可运行程序并运行，hidden） | — |
| billionaire | 亿万富翁 | hidden | legendary | counter tokens ≥ 1,000,000,000,000 | — |
| token-bookworm | 啃书虫 | hidden | rare | counter outTokens ≥ 1,000,000 | — |
| cache-whisperer | 缓存寻宝人 | hidden | epic | counter cacheRead ≥ 5,000,000 | — |
| cache-perfect | 百发百中 | hidden | epic | flag（累计缓存命中率 > 99%，hidden） | — |
| deep-sorry | 道歉大师 | hidden | rare | counter deepSorry ≥ 10（hidden） | ✅ |
| deep-code-heavy | 代码洪流 | hidden | rare | counter deepCodeHeavy ≥ 50（hidden） | ✅ |
| deep-question | 十万个为什么 | hidden | rare | counter deepQuestion ≥ 20（hidden） | ✅ |

---

## 5. 客户端设计

### 5.1 槽位表面

| 槽位 | 组件 | 职责 |
|------|------|------|
| `settings.section` | `AchievementsSection` | 设置页画廊（分类/难度双排序、进度条、稀有度样式、Twemoji 图标） |
| `shell.overlay` | `ToastStack` + `GalleryOverlay` | 解锁 toast（史诗/传说带彩纸）+ 奖杯弹出的全屏画廊 |
| `sidebar.footer.action` | `Trophy` | 侧栏奖杯，未读角标 |
| `conversation.composer.dock` | `DockReadout` | 输入坞进度读条（解锁数、连击、最近目标） |

### 5.2 数据流

- apply 世界用 `ctx.get('timer')`（可选）每 3 秒调 `remote.achievements.recent()` + `dock()`，`store.ingest()` 折叠进 `AchievementsStore`（snapshot store，uSES-safe）。
- 组件通过 `bindSnapshotSelector` 绑定 store；toast 带 7 秒 TTL，`store.prune()` 在每次轮询时清理。
- 画廊与设置页复用同一个 `AchievementsSection` 组件，通过注入面拿到 `list` 回调（内部解包 `RemoteResult`）。

### 5.3 画廊双排序

`AchievementsSection` 内置 `SortMode`（`category` 默认 / `rarity`）：

- 按分类：`CATEGORY_ORDER` = getting-started → toolsmith → filecraft → orchestration → goals → skill → crossover → hidden。
- 按难度：`RARITY_ORDER` = common → rare → epic → legendary，按稀有度分组。
- 分段按钮（`role="tablist"`）切换，`aria-selected` 标记当前模式。

### 5.4 隐藏成就

`hidden: true` 的成就在未解锁时以 `？？？` 显示，隐藏名称/描述/图标；稀有度徽章显示「隐藏」。

---

## 6. 模型可见面

`list_achievements` 工具（参数为空，只读）返回：已解锁数量、总数、当前连击、最近 3 条解锁、逐项成就的解锁状态与进度。调用与结果写入 session log，满足「模型可见 ⟺ 可记录」不变量。零直接 token 效果（不注册 system-prompt 章节）。

---

## 7. 测试策略

`tests/achievements.spec.ts`（vitest，10 用例）用 `emit` 辅助函数模拟事件，覆盖：

1. 会话播种（first-session）
2. 工具计数与跨会话统计（first-tool）
3. 连击重置（streak）
4. 并发子代理（multi-turn）
5. phoenix 恢复解锁（request-error + turn-stopping）
6. phoenix 不误触发（无错误回合）
7. marathon 回合隔离（致命错误清理 turnState）
8. deep-whale 安装解锁
9. deep-whale 未安装保持锁定
10. token 按 session/turn/step 去重

---

## 8. 当前已知限制

- **进程级而非每会话** — 计数器与解锁集合进程共享（已持久化，重启保留）；如需每会话进度，需按 session id 分桶。
- **获得率未实装** — 零遥测无法统计真实用户比例，UI 不显示任何预估百分比。
- **语言识别按扩展名映射，项目分桶按路径片段** — 对多语言/嵌套项目目录是粗粒度近似。
- **深度洞察默认关闭** — 消息正文匹配与历史扫描需用户显式开启（首次运行询问 + 设置开关）；未开启时深度成就保持锁定。
- **持久化格式 v1** — `~/.agent-achievements/state.json` 目前只存成就进度；若未来需要跨会话 streak 等派生状态，需扩展格式并升级 schema 版本。

---

## 9. 未来设计（参考 AGPA 的候选方向）

以下方向参考 [AgentPlayerAchievements (AGPA)](https://github.com/eiainano/AgentPlayerAchievements)（217 成就、12 种条件类型、YAML 成就包、事件目录 + 可达性审计）。AGPA 本身是独立于 agent 的 CLI + MCP 服务器，而 DSH 成就是宿主内插件，因此**只借鉴其设计思想，不照搬架构**。

### 9.1 自动化可达性审计（最优先）

AGPA 的 `src/verify/auditor.ts` 把「成就是否真实可达」变成可运行检查（Layer C：条件引用的事件必须有 emitter）。对应到本插件：写一个 vitest 用例遍历 `ACHIEVEMENTS`，对每条 rule 断言其信号事件（`tools/result`、`subagent/start`、`loader/entry-init`…）确有注册的监听器，防止未来新增成就时出现永远无法触发的条目。

### 9.2 规则类型扩展

| AGPA 条件类型 | 含义 | 本插件可行性 |
|--------------|------|-------------|
| `set_completion` | 完成某分类/全部成就 | 高 —— 可加传说级「全收集」隐藏成就（依赖 `unlocked` 集合） |
| `threshold` | 字段求和（如 inputTokens / outputTokens 分开） | 高 —— `session/event` 已有 usage 字段 |
| `sequence` | 事件顺序（先写文件→跑 shell→提交） | 中 —— 需引入轻量顺序状态机 |
| `time_gap` | 跨时段两次活动 | 中 —— 已有 night-owl 先例，可加「深夜开始白天结束」类 |
| `streak`（跨天） | 连续 N 天使用 | 低 —— 与「零持久化」冲突，需先决策持久化 |
| `pattern_match` | 正则匹配对话内容 | **不采用** —— 违反最小窥探承诺 |

### 9.3 hint / tip 引导

AGPA 给隐藏成就配锁定前 `hint`（暗示不剧透）与解锁后 `tip`（教学）。可扩展成就定义加 `hint`/`tip` 字段，客户端在锁定行的线索气泡与解锁 toast 中展示，让隐藏成就从「黑盒」变「有引导的彩蛋」。

### 9.4 `future` 标志

成就引用尚未实现的事件时标记 `future: true`，从画廊与列表自动隐藏，直到事件支持出现。防止「设计出来了但不可达」的条目混入。

### 9.5 规则定义数据化

将 `ACHIEVEMENTS` 数组从硬编码 TS 迁移为数据驱动定义（保留 TS 类型约束，不引入 YAML/DSL 解析器），使新增成就无需改动引擎代码——为社区包/配置化铺路，但保持类型安全。

### 9.6 明确不引入（与约束冲突）

- **MCP / Hook 双通道** — DSH 是宿主环境，事件总线已覆盖，无独立子进程需求。
- **电池检测 / 4 个月热力图 / XP 等级** — 需采集更多环境数据，超出最小窥探与成就范畴。
- **遥测开关** — 本插件承诺零遥测，不留后门。

### 9.7 多档位与单会话峰值（参考 hermes-achievements）

[hermes-achievements](https://github.com/PCinkusz/hermes-achievements)（Hermes 成就引擎）及其 [desktop 插件](https://github.com/asimons81/hermes-desktop-achievements) 提供第二类设计参考：**离线扫描历史会话 + 分档深度**。它本身读取消息正文做正则匹配（`ERROR_RE`/`PORT_RE`…），这与本插件「从不读取消息正文」的承诺**直接冲突，不采用**；但其**分档与指标形态**值得借鉴：

| 设计 | 含义 | 本插件可行性 |
|------|------|-------------|
| `tiers` 多档位 | 每个成就 5 档（Copper → Silver → Gold → Diamond → Olympian），解锁变升档 | 中高 —— 把 `tool-10/50/200` 这类隐含分档推广为统一分层规则，每个成就带升级进度与档位徽章 |
| `best_session` 指标 | 单会话峰值：max tool calls / max files touched / max distinct tools | 高 —— `turnState` 已跟踪回合内工具数，可加「单回合/单会话峰值」类成就（如「单回合 10 工具」marathon 的升档版） |
| `multi_condition` 成就 | 多条件同时满足（如 terminal + file + web 全达标） | 中 —— 扩展 `Rule` 支持条件组合（AND 语义） |
| `discovered` 三态 | 未达成但已发现 → 显示进度；secret 隐藏到首个信号 | 高 —— 现有 `progress` + `hidden` 已覆盖，可形式化为统一三态 |
| 模型 / provider 类成就 | 多模型、多 provider、本地模型 | 高 —— `assistant/message` 的 `source` 携带 provider/model **叶子标量**，可安全实现「模型猎手」「Provider 多面手」类 |

**与 AGPA 的关系**：AGPA 是「事件驱动 + 通用条件类型」（广度），hermes 是「历史扫描 + 分档」（深度）。两者正交：`tiers` 分档可作为规则引擎的横向扩展，与 9.1 自动化审计、9.2 新规则类型互不冲突。

**明确不采用**：读取消息正文正则匹配（错误文本、端口冲突、安装命令…）——违反最小窥探承诺；DSH 中错误信号改用 `tools/result` 的 `isError` 标志与 `agent/error` 事件（已有 phoenix 先例）。持久化历史扫描同样不采用，除非未来决策放开「零持久化」。

---

## 10. 成就扩充设计方案（候选，未实现）

本节是一次成就要件扩充的**设计方案**：扩充 skill 类、token 类、联动（crossover）类，并新增 model、workflow、hidden 彩蛋等。设计约束与第 1 节一致——每个成就必须绑定至少一个**可观察的叶子信号**（事件名 + 字段），不读取消息正文 / 文件内容 / 错误详情 / 搜索结果。

**信号速查表**（DSH 事件平面，均只读叶子标量）：

| 信号 | 事件 / 服务 | 可读字段 |
|------|-------------|----------|
| 工具调用 | `tools/result` | `name`、`isError`、`arguments.file_path` |
| 工具调用前置 | `tools/execute` / `tool/call`（session 事件） | `name` |
| 模型路由 | `request/header`（session 事件） | `header.config.provider`、`header.config.model` |
| token 用量 | `session/event` (`assistant/message`) | `usage.input/output/cacheRead/cacheWrite/reasoningTokens` |
| skill 目录 | `skills/change` + `ctx.skills.list()` | 数量、`name` 列表 |
| goal | `goal/changed` | `change.operation` |
| 子代理 | `subagent/start` / `subagent/end` | `runId`、并发集合 |
| workflow | `workflow/end` | `agentsStarted` |
| preset | `agent-preset/selected` | preset id |
| 用户消息 | `agent/inbox/inserted` | 仅取时间（hour） |
| 计划模式 | `plan/mode`（session 事件） | `active` |
| 审批 | `approval/asked` / `approval/decided`（session 事件） | `toolName`、`outcome` |
| 压缩 | `compaction/end`（session 事件） | 事件存在性 |
| 定时任务 | `schedule/change`（session 事件） | `operation` |
| 反馈 | `feedback/record`（session 事件） | 事件存在性 |
| 会话标题 | `session/title`（session 事件） | 事件存在性 |
| 安装插件 | Loader entries | `entry.options.name` |

### 11.1 skill 类扩充（现有引擎可直接实现）

「图书管理员」只覆盖了数量维度。扩充同分类成就，转向**使用维度**（skill 被实际调用）与**深度维度**（同一 skill 反复使用）：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `skill-hoarder` | 藏书万卷 | 可用的 skill 超过 300 个 | epic | counter `skills` ≥ 300 | `skills/change` 采样 |
| `skill-sampler` | 博览群书 | 使用过 20 种不同的 skill | rare | distinct `skillsUsed` ≥ 20 | `tools/result` name ∈ skill 工具 + `skills/change` |
| `skill-addict` | 人形锦囊 | 累计调用 skill 工具 100 次 | rare | counter `skillCalls` ≥ 100 | `tools/result` name ∈ skill 工具族 |
| `skill-monogamy` | 一招鲜 | 同一个 skill 反复调用 50 次 | rare | counter `skillFav` ≥ 50（按 name 计最高） | `tools/result` skill 工具 + name 去重 |

> **新信号**：`skills/change` 已注册；「skill 工具名族」需在构造时从 `ctx.skills.list()` 读取工具名集合（叶子标量），与 `tools/result.name` 比对。需要新增 `distinct-tool-family` 与 `max-counter` 两种规则变体。

### 11.2 token 类扩充（现有引擎可直接实现）

「亿万富翁」只跟踪总额。扩充为**分桶**与**单次峰值**，让 token 成就更有探索梯度：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `token-bookworm` | 啃书虫 | 累计输出 100 万 token | rare | counter `outTokens` ≥ 1_000_000 | usage.outputTokens |
| `cache-whisperer` | 缓存寻宝人 | 累计命中 500 万 cache-read token | epic | counter `cacheRead` ≥ 5_000_000 | usage.cacheReadTokens |
| `context-bender` | 上下文折纸师 | 单次请求 context 超过 128K | epic | **peak** `maxInput` ≥ 131072 | usage.inputTokens 单事件峰值 |
| `token-sprinter` | 冲量高手 | 单次请求输出超过 8K | rare | **peak** `maxOutput` ≥ 8192 | usage.outputTokens 单事件峰值 |
| `reasoning-wizard` | 深思熟虑 | 累计推理 token 超 1000 万 | legendary | counter `reasoningTokens` ≥ 10_000_000 | usage.reasoningTokens |

> **新规则**：`peak`（单事件字段峰值，非累计）。现有 `counter` 只支持累加，需新增 `{ kind: 'peak'; key; field }`。

### 11.3 model 类（新增分类，高价值）

DSH 是多 provider 架构，`request/header` 携带 provider/model 叶子标量。这是「模型猎手」类成就的天然土壤：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `model-hop` | 模型蹦迪 | 用过 5 个不同的 model | common | distinct `models` ≥ 5 | request/header.config.model |
| `provider-polyglot` | Provider 语言学家 | 用过 3 个不同的 provider | rare | distinct `providers` ≥ 3 | request/header.config.provider |
| `local-model-pilgrim` | 本地模型朝圣者 | 用过 1 个本地 / 开源模型 | rare | distinct `localModels` ≥ 1 | model 名含 ollama / llama / local 等 |
| `model-whale` | 模型百科全书 | 用过 10 个不同的 model | epic | distinct `models` ≥ 10 | request/header.config.model |
| `deepseek-devotee` | 深度信徒 | 只用一个模型完成 100 个回合 | epic | counter `sameModelTurns` ≥ 100（**联动/彩蛋**：与 DSH 品牌呼应） | request/header.config.model 连续一致 |

> **新信号**：监听 `session/event` 的 `request/header`（只读 `header.config.provider/model` 字符串）。distinct 规则已存在，直接复用。

### 11.4 联动类扩充（现有引擎可直接实现 + 新检测源）

「吾栖之肤」证明了 loader-entry 检测可行。扩充联动成就，覆盖 DSH 生态中的真实插件与周边：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `dsh-native` | 原教旨主义者 | 安装了 5 个以上 DSH 官方 bundle 之外的插件 | rare | counter `extraPlugins` ≥ 5 | loader entries（非 `@deepseek-ai/dsh-*` 行） |
| `crossover-twain` | 跨次元旅客 | 安装了 2 个联动来源插件 | epic | distinct `crossoverPlugins` ≥ 2 | loader entries 匹配联动白名单 |
| `self-hosted` | 自托管狂人 | 通过本地 / 自建 profile 运行 DSH | common | flag | `ctx.get('loader')` 的 baseUrl 指向本地路径 |

> **新信号**：扩展 `detectDeepWhale` 的 loader 扫描，返回所有非官方插件名集合（只读 `options.name` 字符串）。需要一个"外部插件清单"维护点（硬编码白名单或前缀排除），并加 `distinct-from-loader` 规则。

### 11.5 workflow / 编排类扩充

现有 only 2 个 workflow 成就。扩充编排叙事：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `workflow-symphony` | 编排交响乐 | 累计运行 20 次 workflow | rare | counter `workflows` ≥ 20 | workflow/end |
| `delegation-king` | 甩手掌柜 | 单次 workflow 派出 10 个子代理 | epic | **peak** `maxAgentsStarted` ≥ 10 | workflow/end.agentsStarted |
| `subagent-army` | 千军万马 | 累计派出 100 个子代理 | epic | counter `subagents` ≥ 100 | subagent/end |

### 11.6 行为 / 生活方式类扩充（现有引擎可直接实现）

用 session 事件补足"习惯养成"维度，全部只读存在性与简单字段：

| id | 名称 | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|------|-----------|--------|------|------|
| `plan-before-act` | 先谋后动 | 进入计划模式 20 次 | rare | counter `planEntries` ≥ 20 | plan/mode active=true |
| `permission-magnet` | 审批磁铁 | 累计触发 50 次工具审批 | rare | counter `approvalsAsked` ≥ 50 | approval/asked |
| `voter` | 表决权持有人 | 累计拒绝 5 次工具调用 | rare | counter `approvalsRejected` ≥ 5 | approval/decided outcome=rejected |
| `compactor` | 断舍离大师 | 触发 10 次上下文压缩 | rare | counter `compactions` ≥ 10 | compaction/end |
| `scheduler` | 时间管理大师 | 创建过定时任务 | common | counter `schedulesCreated` ≥ 1 | schedule/change operation=create |
| `critic` | 苛刻的读者 | 提交过 3 次反馈 | rare | counter `feedbacks` ≥ 3 | feedback/record |
| `title-architect` | 起名大师 | 会话标题被 AI 起名 10 次 | rare | counter `titles` ≥ 10 | session/title |

### 11.7 hidden 彩蛋类（有梗、可探索）

隐藏成就是"探索的乐趣"。这些成就的名称/描述隐藏，解锁条件有梗但不泄露：

| id | 名称（解锁后） | 描述（梗） | 稀有度 | 规则 | 信号 |
|----|--------------|-----------|--------|------|------|
| `phoenix-deep` | 涅槃重生·极 | 同回合连续 3 次请求错误后恢复并完成 | legendary | counter `recoveries` ≥ 3（同 turn） | agent/request-error + turn-stopping |
| `that-works-v2` | 这也能行？·续 | 写出可运行程序并**在另一回合**运行它 | epic | **multi-condition**（跨 turn 记忆） | write(runnable) + 后续 shell |
| `self-ref-v2` | 自我指涉·闭环 | 用成就工具查询自己 | rare | flag | `tools/result` name=`list_achievements` |
| `self-ref-v3` | 观察者效应 | 查询成就进度 10 次 | rare | counter `selfQueries` ≥ 10 | list_achievements 调用 |
| `tool-palette` | 工具箱收藏家 | 单回合使用 8 种不同工具 | epic | **peak** `maxDistinctToolsInTurn` ≥ 8 | tools/result + turnState |
| `workflow-inception` | 梦中梦 | workflow 内派出子代理再跑 workflow | legendary | **multi-condition**（嵌套信号） | workflow/end + subagent/start 时序 |
| `double-midnight` | 午夜双连 | 连续两天在凌晨 0-5 点工作 | legendary | counter `nightStreak` ≥ 2（跨天） | agent/inbox/inserted + 日期变化 |
| `billionaire-v2` | 亿万富翁·彩蛋 | 单会话消耗超过 5000 万 token | epic | **peak** `maxSessionTokens` ≥ 50_000_000 | session/event usage 按 session 聚合 |
| `easter-egg` | ？？？ | （保留位：留给未来的隐藏惊喜） | mythic | flag | 预留 |

### 11.8 需要的新规则能力（汇总）

| 能力 | 类型 | 说明 | 涉及成就 |
|------|------|------|----------|
| `peak` | 新规则 | 单事件字段峰值 / 单会话聚合峰值 | context-bender、token-sprinter、delegation-king、tool-palette、billionaire-v2 |
| `multi-condition` | 新规则 | AND 语义 + 跨回合时序状态 | that-works-v2、workflow-inception |
| `distinct-from-loader` | 新信号 | 外部插件清单（非官方） | dsh-native、crossover-twain |
| `tool-family` | 新信号 | 按工具名前缀/集合归类（skill 工具族） | skill-sampler、skill-addict、skill-monogamy |
| `night-streak` | 新状态 | 跨天连续凌晨工作 | double-midnight |
| `model-route` | 新信号 | 监听 request/header 读 provider/model | model 类全部 |

### 11.9 优先级建议

1. **P0（现有引擎零改动，直接加成就）**：token 分桶（11.2 前两项）、workflow 计数（11.5）、行为类全部（11.6）、self-ref-v2/v3、skill-hoarder、model-hop/provider-polyglot。
2. **P1（新增 `peak` 规则 + 小改监听）**：context-bender、token-sprinter、delegation-king、tool-palette、billionaire-v2。
3. **P2（新增 loader 外部清单信号）**：dsh-native、crossover-twain。
4. **P3（多条件时序状态机）**：that-works-v2、workflow-inception、double-midnight。

---

## 11. 版本记录

| 版本 | 变更 |
|------|------|
| 0.1.0-rc.5+ | 本设计文档建立时快照：25 成就、双排序、phoenix/去重/回合隔离修复、联动成就；删除与「马拉松」语义重叠的「行云流水」（streak-10） |
| 0.1.0-rc.5+ | 未来方向补充 hermes-achievements 借鉴条目（多档位 tiers / best_session / multi_condition / 模型类成就；正文正则扫描不采用） |
| 0.1.0-rc.5+ | 新增 skill 分类与「图书管理员」成就（`ctx.skills.list()` ≥ 100）；成就数 26 |
| 0.1.0-rc.5+ | 新增第 10 节「成就扩充设计方案」：skill/token/model/联动/workflow/行为/hidden 彩蛋共 30+ 候选成就、信号速查表、新规则能力与优先级（未实现，待决策） |
| 0.1.0-rc.5+ | **落地扩充方案**：本地持久化（`~/.agent-achievements/state.json`，重启保留）、深度洞察 opt-in（首次运行询问 + 设置开关 + 正文正则/历史扫描，正文不落盘）、新增 model/behavior 分类与 30+ 成就（成就数 50）、设置页深度开关 UI。§10 方案主体已实施 |
| 0.1.0-rc.5+ | 亿万富翁 target 提升至 1 万亿 token；新增「百发百中」（累计缓存命中率 > 99%，hidden）；修复 token 类成就 checkAll 回归；成就数 51 |

## 许可

MIT（与本仓库根目录 `LICENSE` 一致）。
