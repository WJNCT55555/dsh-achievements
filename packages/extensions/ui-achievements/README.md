# Achievements 成就系统（浏览器面）

设置页里的成就画廊：按分类分组，稀有度差异化底色（普通灰/稀有蓝/史诗紫/传说金），Twemoji 图标（CDN SVG + emoji 兜底），进度条，隐藏成就解锁前显示 `???`。数据通过 achievements Remote 命名空间获取。

## Model Experience

### Request context and condition

#### What the model sees

无。本包是纯浏览器展示，不注册模型可见工具、不注入 system-prompt 内容；模型可见的 `list_achievements` 工具由 `@deepseek-ai/dsh-achievements`（Host 包）注册。

#### Token effect

零直接 token 效果。

#### KV Cache effect

Independent behavior：纯展示包，不参与请求组装。

## Known Limitations and Deferred Work

- **无解锁 toast / 奖杯入口 / 输入区进度条** — 动态插件前身的 toast、侧栏奖杯、composer dock 尚未迁移到正式包，当前只提供设置页画廊。
