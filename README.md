# dsh-achievements · DeepSeek Harness 成就系统

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）编写的**进程级（全局）成就系统**插件。观察 agent / session 事件，把工具调用、文件操作、子代理、workflow、goal、preset 切换等行为折叠成成就进度，解锁时弹出 toast 并写入一次性队列，供浏览器画廊、侧栏奖杯与输入坞读条展示。

## 组成

本仓库是 DSH 正式两包结构的源码快照：

| 包 | 目录 | 说明 |
|---|---|---|
| `@deepseek-ai/dsh-achievements` | `packages/extensions/achievements/` | 宿主侧引擎：事件监听、计数、解锁队列、只读 Remote（`list` / `recent` / `dock`）与 `list_achievements` 工具 |
| `@deepseek-ai/dsh-client-ui-achievements` | `packages/extensions/ui-achievements/` | 浏览器侧界面：设置页画廊、toast 堆栈、侧栏奖杯、输入坞读条、画廊浮层 |

## 设计文档

架构、规则引擎、50 个成就目录、客户端数据流与未来演进方向（参考 AGPA 的可达性审计 / 规则扩展 / hint-tip 引导等候选）见 **[docs/DESIGN.md](docs/DESIGN.md)**。

## 功能

- **50 个成就**，分 `启程 / 工具大师 / 文件工匠 / 编排 / 目标 / 技能 / 模型 / 行为 / 联动 / 隐藏` 十类，稀有度覆盖 `普通 → 稀有 → 史诗 → 传说`。
- **本地持久化**：计数与解锁写入 `~/.agent-achievements/state.json`，重启后完整保留。
- **画廊双排序**：按分类（默认）或按难度（稀有度）查看。
- **多 UI 表面**：解锁 toast（史诗/传说带彩纸）、侧栏奖杯（未读角标）、输入坞进度读条、设置页画廊与奖杯弹出的全屏画廊。
- **联动成就「吾栖之肤」**：检测到 `dsh-deep-whale` 鲸鱼娘皮肤插件（[github.com/Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)）已安装时自动解锁。
- **隐藏成就**：达成前名称/描述以 `？？？` 显示。

## 隐私

**分层设计，零遥测、零上传。**
- **基础层（默认）**：监听器只读取叶子标量（工具名、成功标志、agent id、事件类型、文件路径、token 计数），从不读取消息正文、文件内容、错误详情或搜索结果。
- **深度洞察层（opt-in，默认关闭）**：首次运行通过设置页询问，启用后允许对消息正文正则匹配与历史会话扫描，仅用于成就解锁；正文只在运行时匹配、**绝不落盘**。
- **持久化**：只保存成就进度到本地 JSON（`~/.agent-achievements/state.json`），不含任何消息/文件内容。

## 构建与安装

本包面向 DSH monorepo 内的 `packages/extensions/` 工作区，依赖 `@deepseek-ai/cordis`、`dsh-typert-protocol`、`dsh-tools` 等 workspace 包。在 DSH checkout 中：

```sh
# 放入 packages/extensions/ 后注册到 tsconfig 与 web-app bundle
pnpm install --offline
pnpm exec tsc -b packages/extensions/achievements packages/extensions/ui-achievements
pnpm exec tsdown --env.DSH_BUILD_FACE host   # 生成宿主侧 Typert 工件
pnpm --filter @deepseek-ai/dsh-client-ui-achievements bundle  # 构建浏览器侧
```

宿主侧依赖 `@deepseek-ai/cordis-plugin-loader` 读取 Loader 条目以检测联动皮肤。浏览器侧无需额外安装，挂载于 `settings.section`、`shell.overlay`、`sidebar.footer.action`、`conversation.composer.dock` 四个槽位。

## 测试

```sh
pnpm exec vitest run packages/extensions/achievements/tests/achievements.spec.ts
```

覆盖：会话播种、工具计数、连击重置、并发子代理、phoenix 恢复解锁、marathon 回合隔离、联动皮肤检测、token 按会话去重等 10 个用例。

## 许可

MIT。见各包 `package.json` 与本仓库根目录 `LICENSE`。
