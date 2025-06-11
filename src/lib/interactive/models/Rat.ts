import { FIXED_DELTA_SECS, INDICATORS, PLAYER, RAT, RAT_COMPUTED } from '../constants';
import type { Context } from '../core/Context';
import { Mobile } from './Mobile';
import type { Vec2 } from './Vec2';

export class Rat extends Mobile {
	position: Vec2;
	direction: -1 | 1 = 1;
	sprite: import('p5').Image;
	captured: boolean = false;
	#speed: number = RAT.WALK_SPEED;

	constructor(position: Vec2, sprite: import('p5').Image) {
		super(position, RAT.WIDTH, RAT.HEIGHT);
		this.position = position;
		this.sprite = sprite;
	}

	fixedUpdate(context: Context) {
		if (!this.movementTween) {
			if (this.collidingWithPlayerX(context)) {
				this.capture(context);
			} else {
				this.moveHorizontally(context);

				this.applyGravity();

				this.updatePosition(context);
			}
		} else {
			this.movementTween.update(FIXED_DELTA_SECS);
		}

		context.drawing.image(
			this.sprite,
			this.position.x - RAT_COMPUTED.WIDTH_DIFF_HALF,
			this.position.y - RAT_COMPUTED.HEIGHT_DIFF,
			RAT.SPRITE_WIDTH,
			RAT.SPRITE_HEIGHT,
			this.direction < 0,
			PLAYER.Z_INDEX
		);
	}

	collidingWithPlayerX(context: Context): boolean {
		const playerAABB = context.player.calculateAABB();
		const aabb = this.calculateAABB();

		return playerAABB.colliding(aabb);
	}

	moveHorizontally(context: Context) {
		let beingChased;
		if (
			// player is too higher or too low
			Math.abs(context.player.position.y + PLAYER.HEIGHT - this.position.y - RAT.HEIGHT) >
			RAT.PLAYER_DETECTION_Y
		) {
			beingChased = false;
		} else if (context.player.position.x < this.position.x) {
			// player is to the left of this
			beingChased =
				this.position.x - (context.player.position.x + context.player.width) <
				RAT.PLAYER_DETECTION_X;
		} else {
			// player is to the right of this
			beingChased =
				context.player.position.x - (this.position.x + this.width) < RAT.PLAYER_DETECTION_X;
		}

		if (beingChased) {
			const dirAwayFromPlayer = context.player.position.x < this.position.x ? 1 : -1;
			this.setDirection(dirAwayFromPlayer);
			this.#speed = RAT.RUN_SPEED;

			this.drawIndicator(context);

			if (this.walkingAgainstEdge) {
				// TODO: try to jump
			}
		} else {
			this.#speed = RAT.WALK_SPEED;

			if (this.walkingAgainstEdge) {
				// @ts-expect-error (direction can be inverted and still be -1 or 1)
				this.setDirection(-this.direction);
				this.walkingAgainstEdge = false;
			}
		}
		this.velocity.x = this.#speed * this.direction;
	}

	drawIndicator(context: Context) {
		context.drawing.image(
			context.preloads.image('scaredMark'),
			this.position.x + (RAT.WIDTH - RAT.INDICATOR_WIDTH) / 2,
			this.position.y - RAT.INDICATOR_OFFSET_Y - RAT.INDICATOR_HEIGHT,
			RAT.INDICATOR_WIDTH,
			RAT.INDICATOR_HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);
	}

	capture(context: Context) {
		// TODO: word bubble for "Nice Catch!" or something
		this.captured = true;

		context.eventBus.publish('ratCaptured');
	}
}
