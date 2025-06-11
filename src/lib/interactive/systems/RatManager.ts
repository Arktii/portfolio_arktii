import type { Context } from '../core/Context';
import { Rat } from '../models/Rat';
import type { Vec2 } from '../models/Vec2';

export class RatManager {
	#rats: { [id: string]: Rat } = {};

	async setup(context: Context) {
		context.eventBus.subscribe('ratRequested', this.addRat.bind(this));
	}

	fixedUpdate(context: Context) {
		for (let id in this.#rats) {
			if (!this.#rats[id].captured) {
				this.#rats[id].fixedUpdate(context);
			} else {
				delete this.#rats[id];
			}
		}
	}

	addRat(id: string, position: Vec2, sprite: import('p5').Image) {
		if (id in this.#rats) {
			// TODO: spawn particles to play on rat destroyed
			console.log('Destroyed a rat');
		}

		this.#rats[id] = new Rat(position, sprite);
	}
}
