# dsh-achievements 设计文档

> 本文件记录 dsh-achievements（DeepSeek Harness 成就系统）的**当前设计架构**与**未来演进方向**。当前架构与代码一一对应（`packages/extensions/achievements` 与 `packages/extensions/ui-achievements`）；未来方向参考了 [AgentPlayerAchievements (AGPA)](https://github.com/eiainano/AgentPlayerAchievements) 等同类项目，仅作为设计候选，未实现。

---

## 1. 设计目标与原则

成就系统为 DeepSeek Harness（DSH）Web 界面提供游戏化激励：把 agent 的真实行为（工具调用、文件操作、子代理、workflow、goal、preset 切换等）折叠成可展示的成就。设计遵循以下硬约束：

1. **纯观察者，零干扰** — 服务只监听事件、累加计数，从不修改、拦截或影响 agent 循环；任何监听器异常都被隔离，不会泄漏进主流程。
2. **最小窥探，零遥测** — 只读取叶子标量（工具名、成功标志、agent id、事件类型、文件路径、token 计数）。**从不读取**消息正文、文件内容、错误详情、搜索结果。无任何上传、无持久化、无网络调用。
3. **进程级全局状态** — 计数与解锁集合跨会话共享，与动态插件前身的行为一致；重启即清零，不做磁盘持久化。
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

Host 引擎注册 10 类事件监听器：

| 事件 | 折叠进 | 成就 |
|------|--------|------|
| `tools/result` | tools、toolsUsed、writes、edits、streak、turnState | first-tool、tool-10/50/200、five-tools、streak-10、first-write、edit-25、marathon、that-works、self-ref、linguist |
| `session/event` (`assistant/message`) | tokens（去重采样） | billionaire |
| `agent/request-error` | turnState.error | phoenix |
| `agent/error` | 清理 turnState | —（生命周期） |
| `agent/turn-stopping` | turns、phoenix、that-works | first-turn、phoenix |
| `goal/changed` | goalsCreated、goalsCompleted | first-goal、goal-done |
| `subagent/start` / `subagent/end` | activeSubagents、subagents | multi-turn、first-subagent、subagent-5 |
| `workflow/end` | workflows、bigWorkflow | first-workflow、big-workflow |
| `agent-preset/selected` | presets | shape-shifter |
| `agent/inbox/inserted` | nightOwl（本地时间 0-5 点） | night-owl |
| `agent/session-start` | sessions | first-session |
| `loader/entry-init` | deepWhale（重扫） | deep-whale |
| 构造时种子 | sessions（`agents.list()`） | first-session |

### 完整成就目录（26 个）

| id | 名称 | 分类 | 稀有度 | 规则 |
|----|------|------|--------|------|
| first-session | 启程 | getting-started | common | distinct sessions ≥ 1 |
| first-turn | 初试身手 | getting-started | common | counter turns ≥ 1 |
| first-tool | 工具初体验 | getting-started | common | counter tools ≥ 1 |
| tool-10 | 工具新手 | toolsmith | common | counter tools ≥ 10 |
| tool-50 | 工具达人 | toolsmith | rare | counter tools ≥ 50 |
| tool-200 | 工具大师 | toolsmith | epic | counter tools ≥ 200 |
| five-tools | 多面手 | toolsmith | rare | distinct toolsUsed ≥ 5 |
| streak-10 | 行云流水 | toolsmith | rare | counter streak ≥ 10 |
| first-write | 白纸作画 | filecraft | common | counter writes ≥ 1 |
| edit-25 | 精雕细琢 | filecraft | rare | counter edits ≥ 25 |
| linguist | 语言学家 | filecraft | rare | lang-count ≥ 3 |
| first-subagent | 指挥官 | orchestration | common | counter subagents ≥ 1 |
| subagent-5 | 军团 | orchestration | rare | counter subagents ≥ 5 |
| multi-turn | 多线程 | orchestration | rare | flag（3 并发，hidden） |
| first-workflow | 编排师 | orchestration | rare | counter workflows ≥ 1 |
| big-workflow | 指挥家 | orchestration | epic | flag（agentsStarted ≥ 3，hidden） |
| first-goal | 立旗 | goals | common | counter goalsCreated ≥ 1 |
| goal-done | 旗开得胜 | goals | epic | counter goalsCompleted ≥ 1 |
| deep-whale | 吾栖之肤 | crossover | rare | flag（安装 dsh-deep-whale 皮肤） |
| night-owl | 夜猫子 | hidden | rare | flag（0-5 点发消息，hidden） |
| phoenix | 凤凰涅槃 | hidden | epic | flag（回合出错仍完成，hidden） |
| marathon | 马拉松 | hidden | rare | flag（单回合 10 工具，hidden） |
| shape-shifter | 百变星君 | hidden | rare | distinct presets ≥ 3（hidden） |
| self-ref | 自我指涉 | hidden | epic | flag（修改 DSH 自身，hidden） |
| that-works | 这也能行？ | hidden | rare | flag（写可运行程序并运行，hidden） |
| billionaire | 亿万富翁 | hidden | legendary | counter tokens ≥ 100,000,000 |

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

- 按分类：`CATEGORY_ORDER` = getting-started → toolsmith → filecraft → orchestration → goals → crossover → hidden。
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

- **进程级而非每会话** — 计数器与解锁集合进程共享，重启清零（与动态插件前身一致；如需每会话进度，需按 session id 分桶）。
- **获得率未实装** — 零遥测无法统计真实用户比例，UI 不显示任何预估百分比。
- **语言识别按扩展名映射，项目分桶按路径片段** — 对多语言/嵌套项目目录是粗粒度近似。
- **无持久化** — streak 等跨会话成就（如「连续使用 N 天」）当前不可行，因为不落盘。

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

---

## 10. 版本记录

| 版本 | 变更 |
|------|------|
| 0.1.0-rc.5+ | 本设计文档建立时快照：26 成就、双排序、phoenix/去重/回合隔离修复、联动成就 |

## 许可

MIT（与本仓库根目录 `LICENSE` 一致）。
