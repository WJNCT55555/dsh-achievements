/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-achievements`.
 * @module @deepseek-ai/dsh-achievements/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-achievements'

/** Cordis companion plugin name. */
export const name = 'achievements-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the achievements engine is a pure observer. It reads
 * only leaf scalars from agent/session events, emits no cordis events, and owns
 * no cross-plugin mutable state — counters and unlocks live inside the service
 * instance. Unlock behavior is asserted directly by this package's unit specs.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
