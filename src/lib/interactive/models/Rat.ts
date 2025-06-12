import { FIXED_DELTA_SECS, INDICATORS, PLAYER, RAT, RAT_COMPUTED } from '../constants';
import type { Context } from '../core/Context';
import { BoundingBox } from './BoundingBox';
import { Mobile } from './Mobile';
import type { Vec2 } from './Vec2';

export class Rat extends Mobile {
	position: Vec2;
	direction: -1 | 1 = 1;
	sprite: import('p5').Image;
	captured: boolean = false;

	#speed: number = RAT.WALK_SPEED;
	#beingChased: boolean = false;
	/** blocked either by an edge or a wall */
	#blocked: boolean = false;

	#stoppedTime: number = 0;
	#panicTimeLeft: number = 0;
	#jumpCooldown: number = 0;

	constructor(position: Vec2, sprite: import('p5').Image) {
		super(position, RAT.WIDTH, RAT.HEIGHT);
		this.position = position;
		this.sprite = sprite;
	}

	/**
	 * the hitbox for interactions
	 */
	calculateInteractAABB(): BoundingBox {
		// i think this more explicit form is a bit easier to read than adding in an offset
		if (this.direction > 0) {
			return BoundingBox.fromRect(
				this.position.x + RAT_COMPUTED.INTERACT_WIDTH_DIFF,
				this.position.y,
				PLAYER.INTERACT_WIDTH,
				PLAYER.HEIGHT
			);
		} else {
			return BoundingBox.fromRect(
				this.position.x,
				this.position.y,
				PLAYER.INTERACT_WIDTH,
				PLAYER.HEIGHT
			);
		}
	}

	fixedUpdate(context: Context) {
		if (!this.movementTween) {
			if (this.collidingWithPlayerX(context)) {
				this.capture(context);
			} else {
				this.updateBeingChased(context);

				if (this.#beingChased) {
					this.#panicTimeLeft = RAT.PANIC_TIME;
				}

				if (this.#panicTimeLeft > 0) {
					this.#panicTimeLeft -= FIXED_DELTA_SECS;
					this.drawPanicIndicator(context);
				}

				if (this.#jumpCooldown > 0) {
					this.#jumpCooldown -= FIXED_DELTA_SECS;
				}

				this.moveHorizontally(context);

				this.applyGravity();

				this.updatePosition(context);

				if (this.velocity.x == 0) {
					this.#stoppedTime += FIXED_DELTA_SECS;
				} else {
					this.#stoppedTime = 0;
				}

				if (this.#stoppedTime > RAT.STOPPED_THRESHOLD) {
					this.#blocked = true;
				} else {
					this.#blocked = false;
				}
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

	updateBeingChased(context: Context) {
		if (
			Math.abs(context.player.position.y + PLAYER.HEIGHT - this.position.y - RAT.HEIGHT) >
			RAT.PLAYER_DETECTION_Y
		) {
			// player is too higher or too low
			this.#beingChased = false;
		} else if (context.player.position.x < this.position.x) {
			// player is to the left of this
			this.#beingChased =
				this.position.x - (context.player.position.x + context.player.width) <
				RAT.PLAYER_DETECTION_X;
		} else {
			// player is to the right of this
			this.#beingChased =
				context.player.position.x - (this.position.x + this.width) < RAT.PLAYER_DETECTION_X;
		}
	}

	moveHorizontally(context: Context) {
		if (this.#panicTimeLeft > 0) {
			this.#speed = RAT.RUN_SPEED;
		} else {
			this.#speed = RAT.WALK_SPEED;
		}

		if (this.#beingChased) {
			// based on bounding box collisionY logic: this.bottom > other.top && this.top < other.bottom;
			const playerAlmostSameLevel =
				this.position.y + this.height + RAT.PLAYER_SAME_LEVEL_MARGIN > context.player.position.y &&
				this.position.y - RAT.PLAYER_SAME_LEVEL_MARGIN <
					context.player.position.y + context.player.height;

			// if player on the same level, move away
			if (playerAlmostSameLevel) {
				const dirAwayFromPlayer = context.player.position.x < this.position.x ? 1 : -1;
				this.setDirection(dirAwayFromPlayer);
			}

			if (this.#blocked && this.#jumpCooldown <= 0) {
				// try to jump
				const moveArea = context.moveAreaManager.checkForMoveArea(this.calculateInteractAABB());

				if (moveArea) {
					if (playerAlmostSameLevel) {
						// check up and down in a random order
						let targets = [moveArea.calculateDownTarget(this), moveArea.calculateUpTarget(this)];

						if (Math.random() < 0.5) {
							targets.reverse();
						}

						for (let i = 0; i < 2; i++) {
							if (targets[i]) {
								this.jump(targets[i]!);
								break;
							}
						}
					}
					// if player is above rat, check down only
					else if (
						context.player.position.y + context.player.height <
						this.position.y + this.height
					) {
						const downTargetWorld = moveArea.calculateDownTarget(this)!;
						if (downTargetWorld) {
							this.jump(downTargetWorld);
						}
					}
					// if player is below rat, check up only
					else {
						const upTargetWorld = moveArea.calculateUpTarget(this)!;
						if (upTargetWorld) {
							this.jump(upTargetWorld);
						}
					}
				}
			}
		}

		if (this.#blocked) {
			// @ts-expect-error (direction can be inverted and still be -1 or 1)
			this.setDirection(-this.direction);
			this.#blocked = false;
		}
		this.velocity.x = this.#speed * this.direction;
	}

	drawPanicIndicator(context: Context) {
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
		this.captured = true;

		context.eventBus.publish('ratCaptured');
	}

	override jump(target: Vec2) {
		this.#stoppedTime = 0;
		this.#blocked = false;

		super.jump(target);
	}

	protected override tweenOnFinishExtraActions(): void {
		this.#jumpCooldown = RAT.JUMP_COOLDOWN;
		this.#blocked = false;
	}
}
