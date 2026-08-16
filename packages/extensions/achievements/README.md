# Achievements 成就系统

进程级（全局）成就引擎：观察 agent/session 事件，把工具调用、goal、子代理、workflow、preset 切换、skill、模型路由等行为折叠成成就进度，解锁时进入一次性队列，供浏览器读取。注册一个只读模型可见工具 `list_achievements`。

**持久化**：计数、去重集合、标志与解锁时间戳写入 `~/.agent-achievements/state.json`（本地 JSON，防抖写入，dispose 时 flush），重启后完整恢复。只持久化成就进度，从不写入消息正文或文件内容。

**隐私分层**：
- 基础层（默认开启）：只读取叶子标量（工具名、成功标志、agent id、事件类型、文件路径、token 计数），不读消息正文/文件内容/错误详情/搜索结果。
- 深度洞察层（`deepInsights`，默认关闭）：首次运行时通过设置页询问用户，启用后允许对消息正文做正则匹配与历史会话扫描，用于专属深度成就。正文只在运行时匹配、绝不落盘。

## Model Experience

### Request context and condition

#### What the model sees

`list_achievements` 工具的 schema（参数为空对象，只读）。调用返回当前成就进度：已解锁数量、总成就数、连击、最近解锁与逐项进度。该工具调用与结果写入 session log，满足「模型可见 ⟺ 可记录」不变量。

#### Token effect

零直接 token 效果：本包不注册 system-prompt 章节，只有模型显式调用 `list_achievements` 时才有一次工具调用开销。

#### KV Cache effect

Independent behavior：本包不修改请求或响应前缀，不影响复用。

## Known Limitations and Deferred Work

- **作用域为进程级而非每会话** — 计数器与解锁集合是进程共享的，会话之间不隔离；已持久化，重启后保留（与动态插件前身的"重启清零"行为不同）。
- **成就获得率未实装** — 本包零遥测、零上传，无法统计真实用户获得比例；UI 不显示任何预估百分比。
- **深度层为 opt-in** — 消息正文匹配与历史扫描仅在用户于设置中启用「深度洞察」后生效，默认关闭。
