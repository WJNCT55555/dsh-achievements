# Achievements 成就系统

进程级（全局）成就引擎：观察 agent/session 事件，把工具调用、goal、子代理、workflow、preset 切换等行为折叠成成就进度，解锁时进入一次性队列，供浏览器读取。注册一个只读模型可见工具 `list_achievements`。

## Model Experience

### Request context and condition

#### What the model sees

`list_achievements` 工具的 schema（参数为空对象，只读）。调用返回当前成就进度：已解锁数量、总成就数、连击、最近解锁与逐项进度。该工具调用与结果写入 session log，满足「模型可见 ⟺ 可记录」不变量。

#### Token effect

零直接 token 效果：本包不注册 system-prompt 章节，只有模型显式调用 `list_achievements` 时才有一次工具调用开销。

#### KV Cache effect

Independent behavior：本包不修改请求或响应前缀，不影响复用。

## Known Limitations and Deferred Work

- **作用域为进程级而非每会话** — 计数器与解锁集合是进程共享的，会话之间不隔离，重启即清零。这与动态插件前身的行为一致；若需每会话进度，需把计数器按 session id 分桶（消费者可见的差异）。
- **成就获得率未实装** — 本包零遥测、零上传，无法统计真实用户获得比例；UI 不显示任何预估百分比。
