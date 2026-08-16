//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-achievements`.
* @module @deepseek-ai/dsh-achievements/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-achievements";
/** Cordis companion plugin name. */
const name = "achievements-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the achievements engine is a pure observer. It reads
* only leaf scalars from agent/session events, emits no cordis events, and owns
* no cross-plugin mutable state — counters and unlocks live inside the service
* instance. Unlock behavior is asserted directly by this package's unit specs.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
