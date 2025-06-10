import { clamp } from '$lib/utils/Math';
import { FIXED_DELTA_SECS, PLAYER, WORD_BUBBLE, WORLD_SIZE } from '../constants';
import type { Context } from '../core/Context';
import { Vec2 } from '../models/Vec2';
import { WordBubble } from '../models/WordBubble';
import { EasingFunctions, Tween } from './Tween';

export class WordBubbleManager {
	#elapsed: number = 0;
	#currentWordBubble: WordBubble | null = null;

	#fillTween: Tween | null = null;
	#textColorTween: Tween | null = null;

	async setup(context: Context) {
		context.eventBus.subscribe('wordBubble', this.receiveWordBubble.bind(this));
	}

	fixedUpdate(context: Context) {
		if (this.#currentWordBubble) {
			// if finished
			if (this.#elapsed > this.#currentWordBubble.duration) {
				this.#elapsed = 0;
				this.#currentWordBubble = null;
				this.#fillTween = null;
			}
			// otherwise, update everything
			else {
				// update tweens
				this.#elapsed += FIXED_DELTA_SECS;
				this.#fillTween?.update(FIXED_DELTA_SECS);
				this.#textColorTween?.update(FIXED_DELTA_SECS);

				const viewportRect = context.world.calculateViewportWorld();
				let bubbleY = Math.max(
					context.player.position.y - WORD_BUBBLE.HEIGHT + WORD_BUBBLE.OFFSET_Y,
					viewportRect.top + WORD_BUBBLE.MIN_VIEWPORT_OFFSET,
					0
				);

				// draw bubble depending on direction player is facing
				let bubbleX;
				if (context.player.direction > 0) {
					bubbleX = context.player.position.x + PLAYER.WIDTH + WORD_BUBBLE.OFFSET_X;
				} else {
					bubbleX = context.player.position.x - WORD_BUBBLE.WIDTH - WORD_BUBBLE.OFFSET_X;
				}
				bubbleX = clamp(bubbleX, 0, WORLD_SIZE.REFERENCE_WIDTH - WORD_BUBBLE.WIDTH);

				this.drawTail(context, bubbleX, bubbleY);

				this.drawTextBubble(context, bubbleX, bubbleY);
			}
		}
	}

	private drawTail(context: Context, bubbleX: number, bubbleY: number) {
		let tailColor = context.p5.color(WORD_BUBBLE.TAIL_COLOR);
		// @ts-expect-error (this should never be null, because it is assigned with currentWordBubble)
		tailColor.setAlpha(this.#fillTween.currentValue);

		const tailY = context.player.position.y + WORD_BUBBLE.TAIL_OFFSET_Y;

		let tailX;
		let targetX;
		if (context.player.direction > 0) {
			tailX = context.player.position.x + PLAYER.WIDTH + WORD_BUBBLE.TAIL_OFFSET_X;
			targetX = Math.max(tailX + WORD_BUBBLE.IDEAL_TAIL_LENGTH, bubbleX);
		} else {
			tailX = context.player.position.x - WORD_BUBBLE.TAIL_OFFSET_X;
			targetX = Math.min(tailX - WORD_BUBBLE.IDEAL_TAIL_LENGTH, bubbleX + WORD_BUBBLE.WIDTH);
		}

		// don't draw any tail if completely covered by word bubble
		if (
			tailX > bubbleX &&
			tailX < bubbleX + WORD_BUBBLE.WIDTH &&
			tailY > bubbleY &&
			tailY < bubbleY + WORD_BUBBLE.HEIGHT
		) {
			return;
		}

		let targetY;
		// tail point is above bubble
		if (tailY < bubbleY) {
			targetY = bubbleY - WORD_BUBBLE.TAIL_BOX_GAP;
		}
		// tail point is below bubble
		else if (tailY > bubbleY + WORD_BUBBLE.HEIGHT) {
			targetY = bubbleY + WORD_BUBBLE.HEIGHT + WORD_BUBBLE.TAIL_BOX_GAP;
		}
		// tail point is on level with bubble
		else {
			targetY = tailY;

			if (context.player.direction > 0) {
				targetX = Math.min(targetX, bubbleX - WORD_BUBBLE.TAIL_BOX_GAP);
			} else {
				targetX = Math.max(targetX, bubbleX + WORD_BUBBLE.WIDTH + WORD_BUBBLE.TAIL_BOX_GAP);
			}
		}

		// Draw tail depending on direction player is facing
		if (context.player.direction > 0) {
			context.drawing
				.curve(tailX, tailY, tailX, tailY, targetX, tailY, targetX, targetY, WORD_BUBBLE.Z_INDEX)
				.stroke(tailColor, WORD_BUBBLE.TAIL_WIDTH);
		} else {
			context.drawing
				.curve(tailX, tailY, tailX, tailY, targetX, tailY, targetX, targetY, WORD_BUBBLE.Z_INDEX)
				.stroke(tailColor, WORD_BUBBLE.TAIL_WIDTH);
		}
	}

	private drawTextBubble(context: Context, bubbleX: number, bubbleY: number) {
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
			.stroke(undefined, 0);

		context.drawing
			.text(
				bubbleX + WORD_BUBBLE.PADDING_X,
				bubbleY,
				this.#currentWordBubble?.text ?? '',
				WORD_BUBBLE.FONT_SIZE,
				WORD_BUBBLE.Z_INDEX
			)
			.width(WORD_BUBBLE.WIDTH - 2 * WORD_BUBBLE.PADDING_X)
			.height(WORD_BUBBLE.HEIGHT)
			.textColor(textColor);
	}

	receiveWordBubble(context: Context, wordBubble: WordBubble) {
		if (!this.#currentWordBubble || wordBubble.priority >= this.#currentWordBubble.priority) {
			this.#currentWordBubble = wordBubble;
			this.#elapsed = 0;

			this.#fillTween = new Tween(
				WORD_BUBBLE.FILL_ALPHA,
				0,
				this.#currentWordBubble.duration,
				EasingFunctions.easeInCubic
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
