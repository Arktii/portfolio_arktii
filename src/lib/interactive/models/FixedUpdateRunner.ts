import type { Context } from '../core/Context';

/**
 * Calls a single function during the update loop
 */
export class FixedUpdateRunner {
	constructor(public fixedUpdate: (context: Context) => void) {}
}
