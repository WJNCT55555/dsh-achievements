/**
 * dsh-achievements 匿名统计端点（参考实现）
 *
 * 这是「约 x% 用户获得」功能的免费后端：一个可部署到 Cloudflare
 * Workers 免费层的单文件 Worker。它只做两件事：
 *
 *   POST /unlock  收到一次匿名解锁上报，入桶计数（仅成就 id + 匿名安装 id）
 *   GET  /stats   返回 { users, counts }，供插件计算每个成就的获得率
 *
 * 隐私边界与插件端一致：本服务不接收、不存储会话、工具、文件或内容数据。
 * 全部数据仅为「哪个成就 id 被哪个匿名安装 id 解锁」。匿名安装 id 是
 * 每个安装随机生成并持久化的 UUID，与任何身份无关。
 *
 * 部署（免费，零成本）：
 *   1. 注册 Cloudflare 免费账户（无需付费）
 *   2. 新建 Worker，把本文件内容粘贴进 worker.js（或使用 wrangler）
 *   3. 部署后得到形如 https://your-name.workers.dev 的地址
 *   4. 在 DSH 的 cordis.yml 中配置插件：
 *        - plugin: @wjnct55555/dsh-achievements
 *          config:
 *            telemetryEndpoint: https://your-name.workers.dev
 *   5. 用户在成就画廊设置里打开「匿名统计」开关即可开始共享
 *
 * 持久化说明：Worker 使用 Durable Object 存储计数，免费层包含 DO 存储
 * 配额。若不想用 DO，可改用 Cloudflare KV（把本文件改造成 KV 版）。
 */

/**
 * 计数持久化单元：一个 Durable Object 实例持有全部计数。
 * 通过绑定 STATS 使用（见下方 fetch 里的 env.STATS.idFromName）。
 */
export class StatsObject {
  /**
   * @param {import('cloudflare:workers').DurableObjectState} state
   */
  constructor(state) {
    this.state = state
    this.users = new Set()
    this.counts = new Map()
  }

  /** 从 DO 存储恢复内存状态（首次调用或冷启动）。 */
  async init() {
    const stored = await this.state.storage.get('data')
    if (!stored) return
    if (Array.isArray(stored.users)) this.users = new Set(stored.users)
    if (stored.counts && typeof stored.counts === 'object') {
      this.counts = new Map(Object.entries(stored.counts))
    }
  }

  /** 记一次匿名解锁：users 去重，counts[achievementId] 自增。 */
  async unlock(achievementId, anonymousId) {
    await this.init()
    if (typeof achievementId !== 'string' || achievementId.length === 0) return false
    if (typeof anonymousId === 'string' && anonymousId.length > 0) {
      this.users.add(anonymousId)
    }
    this.counts.set(achievementId, (this.counts.get(achievementId) ?? 0) + 1)
    await this.state.storage.put('data', {
      users: [...this.users],
      counts: Object.fromEntries(this.counts),
    })
    return true
  }

  /** 当前样本：去重安装数 + 每个成就的解锁次数。 */
  async stats() {
    await this.init()
    return {
      users: this.users.size,
      counts: Object.fromEntries(this.counts),
    }
  }
}

/**
 * Worker 入口：路由 /unlock 与 /stats。
 * @param {Request} request
 * @param {{ STATS: DurableObjectNamespace }} env
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (request.method === 'POST' && url.pathname === '/unlock') {
      let body
      try {
        body = await request.json()
      } catch {
        return new Response('invalid json', { status: 400, headers: cors })
      }
      const id = env.STATS.idFromName('global')
      const stub = env.STATS.get(id)
      const ok = await stub.unlock(body?.achievementId, body?.anonymousId)
      if (!ok) return new Response('bad payload', { status: 400, headers: cors })
      return new Response('ok', { status: 200, headers: cors })
    }
    if (request.method === 'GET' && url.pathname === '/stats') {
      const id = env.STATS.idFromName('global')
      const stub = env.STATS.get(id)
      const data = await stub.stats()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'content-type': 'application/json', ...cors },
      })
    }
    return new Response('not found', { status: 404, headers: cors })
  },
}
