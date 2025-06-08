import type { Context } from '../core/Context';

/**
 * Calls a single function during the update loop
 */
export class UpdateRunner {
	constructor(public update: (context: Context, deltaSecs: number) => void) {}
}
