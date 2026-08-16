/**
 * Package-owned invariant companion for `@wjnct55555/dsh-client-ui-achievements`.
 * @module @wjnct55555/dsh-client-ui-achievements/invariant
 */
const PACKAGE_NAME = '@wjnct55555/dsh-client-ui-achievements';
/** Cordis companion plugin name. */
export const name = 'client-ui-achievements-invariant';
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants'];
/**
 * No runtime invariant: a pure-presentation plugin deriving its rows from the
 * achievements Remote snapshot — it emits no cordis events and owns no
 * cross-plugin mutable state; render behavior is asserted by this package's
 * component specs.
 */
const install = () => { };
/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
/* jscpd:ignore-end */
//# sourceMappingURL=invariant.js.map