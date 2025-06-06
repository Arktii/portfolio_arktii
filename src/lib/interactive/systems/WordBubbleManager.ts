import { PLAYER, WORD_BUBBLE } from '../constants';
import type { Context } from '../core/Context';
import { WordBubbleType, type WordBubble } from '../models/WordBubble';
import { EasingFunctions, Tween } from './Tween';

export class WordBubbleManager {
	#elapsed: number = 0;
	#currentWordBubble: WordBubble | null = null;

	#fillTween: Tween | null = null;
	#textColorTween: Tween | null = null;

	async setup(context: Context) {}

	update(context: Context, deltaSecs: number) {
		if (this.#currentWordBubble) {
			// if finished
			if (this.#elapsed > this.#currentWordBubble.duration) {
				this.#elapsed = 0;
				this.#currentWordBubble = null;
				this.#fillTween = null;
			}
			// otherwise, update everything
			else {
				this.#elapsed += deltaSecs;
				this.#fillTween?.update(deltaSecs);
				this.#textColorTween?.update(deltaSecs);

				let bubbleX = context.player.position.x + PLAYER.WIDTH + WORD_BUBBLE.OFFSET_X;
				let bubbleY = context.player.position.y - WORD_BUBBLE.HEIGHT + WORD_BUBBLE.OFFSET_Y;

				// TODO: add sprite / line to differentiate between thought and speech bubbles

				let bgColor = context.p5.color(WORD_BUBBLE.FILL_COLOR);
				let textColor = context.p5.color(WORD_BUBBLE.TEXT_COLOR);
				// @ts-expect-error (this should never be null, because it is assigned with currentWordBubble)
				bgColor.setAlpha(this.#fillTween.currentValue);
				// @ts-expect-error (this should never be null, because it is assigned with currentWordBubble)
				textColor.setAlpha(this.#textColorTween.currentValue);

				context.drawing
					.rect(bubbleX, bubbleY, WORD_BUBBLE.WIDTH, WORD_BUBBLE.HEIGHT, WORD_BUBBLE.Z_INDEX)
					.fillColor(bgColor)
					.radius(WORD_BUBBLE.BORDER_RADIUS)
					.stroke(undefined, WORD_BUBBLE.STROKE_WIDTH);

				context.drawing
					.text(
						bubbleX,
						bubbleY,
						this.#currentWordBubble?.text ?? '',
						WORD_BUBBLE.FONT_SIZE,
						WORD_BUBBLE.Z_INDEX
					)
					.width(WORD_BUBBLE.WIDTH)
					.height(WORD_BUBBLE.HEIGHT)
					.textColor(textColor);
			}
		}
	}

	receiveWordBubble(context: Context, wordBubble: WordBubble) {
		if (!this.#currentWordBubble || wordBubble.priority >= this.#currentWordBubble.priority) {
			this.#currentWordBubble = wordBubble;
			this.#elapsed = 0;

			let easing;
			if (wordBubble.bubbleType == WordBubbleType.SPEECH) {
				easing = EasingFunctions.easeInQuartic;
			} else {
				easing = EasingFunctions.easeInCubic;
			}

			this.#fillTween = new Tween(
				WORD_BUBBLE.FILL_ALPHA,
				0,
				this.#currentWordBubble.duration,
				easing
			);

			this.#textColorTween = new Tween(
				WORD_BUBBLE.TEXT_ALPHA,
				0,
				this.#currentWordBubble.duration,
				EasingFunctions.easeInQuartic
			);
		}
	}
}
