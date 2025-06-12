import { RAT } from '../constants';
import { Context } from '../core/Context';
import { Rat } from '../models/Rat';
import type { Vec2 } from '../models/Vec2';
import { WordBubble } from '../models/WordBubble';

export class RatManager {
	#rats: Rat[] = [];

	async setup(context: Context) {
		context.eventBus.subscribe('ratRequested', this.addRat.bind(this));
	}

	fixedUpdate(context: Context) {
		for (let i = this.#rats.length - 1; i >= 0; i--) {
			if (!this.#rats[i].captured) {
				this.#rats[i].fixedUpdate(context);
			} else {
				this.#rats.splice(i, 1);

				let text;
				if (this.#rats.length > 0) {
					const s = this.#rats.length == 1 ? '' : 's';
					text = `Nice Catch! ${this.#rats.length} rat${s} left.`;
				} else {
					text = `All rats caught. Well done!`;
				}

				context.eventBus.publish(
					'wordBubble',
					context,
					new WordBubble(text, 'word', RAT.SPEECH_BUBBLE_DURATION, RAT.SPEECH_BUBBLE_PRIORITY)
				);
			}
		}
	}

	addRat(context: Context, position: Vec2, sprite: import('p5').Image) {
		if (this.#rats.length < RAT.MAX_RATS) {
			this.#rats.push(new Rat(position, sprite));
			// TODO: play particles?

			const s = this.#rats.length == 1 ? '' : 's';

			context.eventBus.publish(
				'wordBubble',
				context,
				new WordBubble(
					`Rat spawned somewhere.\nGo catch it!\n(there are ${this.#rats.length} rat${s})`,
					'word',
					RAT.SPEECH_BUBBLE_DURATION,
					RAT.SPEECH_BUBBLE_PRIORITY
				)
			);
		} else {
			context.eventBus.publish(
				'wordBubble',
				context,
				new WordBubble(
					'Too many rats! Go catch some before spawning more.',
					'word',
					RAT.SPEECH_BUBBLE_DURATION,
					RAT.SPEECH_BUBBLE_PRIORITY
				)
			);
		}
	}
}
