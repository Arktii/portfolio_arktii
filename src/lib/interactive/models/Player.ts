import { FIXED_DELTA_SECS, PHYSICS, PLAYER, PLAYER_COMPUTED } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';

import { DirectionFlags } from './DirectionFlags';
import { Vec2 } from './Vec2';
import { BoundingBox } from './BoundingBox';
import { Tween } from '../systems/Tween';
import { AnimatedSprite } from './AnimatedSprite';

import idleSheet from '$lib/images/player-idle.png';
import walkSheet from '$lib/images/player-walk.png';
import jumpLandSheet from '$lib/images/player-jump-land.png';
import jumpUpStartSheet from '$lib/images/player-jump-up-start.png';
import jumpUpHoldSheet from '$lib/images/player-jump-up-hold.png';
import jumpDownStartSheet from '$lib/images/player-jump-down-start.png';
import jumpDownHoldSheet from '$lib/images/player-jump-down-hold.png';
import { SpriteAnimation } from './SpriteAnimation';

export class Player {
	position: Vec2;

	#direction: -1 | 1;
	#inputIsLocked: boolean;

	// property, because I may introduce a slower speed for when pushing objects
	#speed: number;

	#directionInputs: DirectionFlags;
	#velocity: Vec2;

	#movementTween?: Tween;

	#idletime: number = 0;

	// animation
	#animatedSprite: AnimatedSprite;

	constructor(position: Vec2) {
		this.position = position;
		this.#direction = 1;

		this.#inputIsLocked = false;
		this.#directionInputs = new DirectionFlags();
		this.#speed = PLAYER.SPEED;
		this.#velocity = Vec2.zero();

		this.#animatedSprite = new AnimatedSprite(
			position,
			new Vec2(-(PLAYER.SPRITE_WIDTH - PLAYER.WIDTH) / 2, -(PLAYER.SPRITE_HEIGHT - PLAYER.HEIGHT)),
			PLAYER.Z_INDEX
		);
	}

	get inputIsLocked() {
		return this.#inputIsLocked;
	}

	get velocity() {
		return this.#velocity;
	}

	get direction() {
		return this.#direction;
	}

	calculateAABB(): BoundingBox {
		return BoundingBox.fromRect(this.position.x, this.position.y, PLAYER.WIDTH, PLAYER.HEIGHT);
	}

	/**
	 * the hitbox for interactions
	 */
	calculateInteractAABB(): BoundingBox {
		// i think this more explicit form is a bit easier to read than adding in an offset
		if (this.direction > 0) {
			return BoundingBox.fromRect(
				this.position.x + PLAYER_COMPUTED.INTERACT_WIDTH_DIFF,
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

	async setup(context: Context) {
		let p5 = context.p5;

		this.#animatedSprite
			.addAnim('idle', new SpriteAnimation(await p5.loadImage(idleSheet), 32, 32, 4, 1, 4, 0.2))
			.addAnim('walk', new SpriteAnimation(await p5.loadImage(walkSheet), 32, 32, 8, 1, 8, 0.125))
			.addAnim(
				'jump-land',
				new SpriteAnimation(await p5.loadImage(jumpLandSheet), 32, 32, 3, 1, 3, 0.125)
			)
			.addAnim(
				'jump-up-start',
				new SpriteAnimation(await p5.loadImage(jumpUpStartSheet), 32, 32, 2, 1, 2, 0.125)
			)
			.addAnim(
				'jump-up-hold',
				new SpriteAnimation(await p5.loadImage(jumpUpHoldSheet), 32, 32, 2, 1, 2, 0.1)
			)
			.addAnim(
				'jump-down-start',
				new SpriteAnimation(await p5.loadImage(jumpDownStartSheet), 32, 32, 1, 1, 1, 0.125)
			)
			.addAnim(
				'jump-down-hold',
				new SpriteAnimation(await p5.loadImage(jumpDownHoldSheet), 32, 32, 2, 1, 2, 0.125)
			);

		this.#animatedSprite.play('idle');
	}

	fixedUpdate(context: Context) {
		if (!this.#inputIsLocked) {
			this.moveHorizontally(context.p5);

			// gravity
			this.#velocity.y += PHYSICS.GRAVITY * FIXED_DELTA_SECS;

			// update positions
			this.position.y += this.#velocity.y * FIXED_DELTA_SECS;
			this.position.x = Math.max(this.position.x + this.#velocity.x * FIXED_DELTA_SECS, 0); // prevent negative x

			this.handleCollisions(context.colSpace);

			this.handleEdgeProtection(context.colSpace);

			// update animation (should be after edge protection to avoid "walking" without moving)
			if (this.velocity.x == 0) {
				this.#idletime += FIXED_DELTA_SECS;
			} else if (this.#animatedSprite.queueLength === 0) {
				this.#idletime = 0;
				this.#animatedSprite.play('walk');
			}

			if (this.#idletime > PLAYER.WALK_ANIM_IDLE_THRESHOLD && this.#animatedSprite.queueLength === 0) {
				this.#animatedSprite.play('idle');
			}
		}

		if (this.#movementTween) {
			this.#movementTween.update(FIXED_DELTA_SECS);

			this.scrollToPlayer(context);
		}

		// update animation
		this.#animatedSprite.position = this.position;
		this.#animatedSprite.update(FIXED_DELTA_SECS);
		this.#animatedSprite.draw(context);
	}

	setDirection(direction: -1 | 1) {
		this.#direction = direction;
		this.#animatedSprite.flipX = direction < 1;
	}

	private moveHorizontally(p5: import('p5')) {
		// movement inputs (checked in update for greater responsiveness)
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.#directionInputs.left = p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown('a');
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.#directionInputs.right = p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown('d');

		// horizontal movement
		this.#velocity.x = this.#directionInputs.xAxis() * this.#speed;

		// update direction
		if (this.velocity.x > 0) {
			this.setDirection(1);
		} else if (this.velocity.x < 0) {
			this.setDirection(-1);
		}
	}

	private handleCollisions(colSpace: CollisionSpace) {
		let collisionBox = this.calculateAABB();

		let collisionDisplacement = colSpace.calculateDisplacement(collisionBox);
		if (collisionDisplacement.y != 0) {
			this.#velocity.y = 0;
			this.position.y += collisionDisplacement.y;
		}

		if (collisionDisplacement.x != 0) {
			this.#velocity.x = 0;
			this.position.x += collisionDisplacement.x;
		}
	}

	/**
	 * prevent walking off edges
	 */
	private handleEdgeProtection(colSpace: CollisionSpace) {
		if (this.#velocity.y == 0) {
			// walking left
			if (this.#velocity.x < 0) {
				let playerLeft = this.position.x;
				let playerBottom = this.position.y + PLAYER.HEIGHT;
				// a point slightly below the overhang
				let point = new Vec2(playerLeft, playerBottom + PLAYER.EDGE_CHECK);

				if (!colSpace.checkPointCollision(point)) {
					this.#velocity.x = 0;
					this.position.x += colSpace.cellSize - (playerLeft % colSpace.cellSize);
				}
			}

			// walking right
			else if (this.#velocity.x > 0) {
				let playerRight = this.position.x + PLAYER.WIDTH;
				let playerBottom = this.position.y + PLAYER.HEIGHT;
				// a point slightly below the overhang
				let point = new Vec2(playerRight, playerBottom + PLAYER.EDGE_CHECK);

				if (!colSpace.checkPointCollision(point)) {
					this.#velocity.x = 0;
					this.position.x -= playerRight % colSpace.cellSize;
				}
			}
		}
	}

	private scrollToPlayer(context: Context) {
		const viewportWorldHeight = context.world.toWorld(window.innerHeight);

		const playerViewAABB = new BoundingBox(
			this.position.x,
			this.position.x + PLAYER.WIDTH,
			this.position.y + PLAYER_COMPUTED.HALF_HEIGHT - viewportWorldHeight / 2,
			this.position.y + PLAYER_COMPUTED.HALF_HEIGHT + viewportWorldHeight / 2
		);

		const outOfBounds = context.world.calculateViewportOutOfBounds(playerViewAABB);
		if (outOfBounds.y !== 0) {
			const targetViewportY = context.world.toAbsolute(new Vec2(0, playerViewAABB.bottom)).y;

			window.scrollTo({ top: targetViewportY - window.innerHeight, behavior: 'smooth' });
		}
	}

	jump(target: Vec2) {
		this.#inputIsLocked = true;

		if (target.x < this.position.x) {
			this.setDirection(-1);
		} else if (target.x > this.position.x) {
			this.setDirection(1);
		}

		let yDirection = '';
		if (target.y > this.position.y) {
			yDirection = 'down';
		} else {
			yDirection = 'up';
		}

		let launchAngle =
			target.y < this.position.y ? PLAYER.UP_LAUNCH_ANGLE : PLAYER.DOWN_LAUNCH_ANGLE;
		let jumpSpeed = target.y < this.position.y ? PLAYER.UP_JUMP_SPEED : PLAYER.DOWN_JUMP_SPEED;

		let start = this.position;
		let distance = start.distanceTo(target);
		let duration = distance / jumpSpeed;

		let tan = Math.tan(launchAngle);
		let sin = Math.sin(launchAngle);
		let cos = Math.cos(launchAngle);
		let adjustedSpeed = Math.sqrt((5 * distance) / (sin * cos));

		// Formula: y(x) = -g/2 * (x/v_0*cos(theta))^2  + x * tan(theta); where g = 10
		function calcDeltaY(x: number) {
			return -5 * Math.pow(x / (adjustedSpeed * cos), 2) + x * tan;
		}

		this.#animatedSprite.clearQueue();
		this.#animatedSprite.play(`jump-${yDirection}-start`);
		this.#animatedSprite.enqueue(`jump-${yDirection}-hold`);

		let tween = new Tween(0, 1, duration)
			.setUpdateFunction((t) => {
				this.updateJumpPosition(start, target, t, calcDeltaY);
			})
			.setFinishFunction(() => {
				this.position = target;
				this.#movementTween = undefined;
				this.#inputIsLocked = false;

				this.#animatedSprite.clearQueue();
				this.#animatedSprite.play(`jump-land`);
				this.#animatedSprite.enqueue('idle');
			});

		this.#movementTween = tween;
	}

	private updateJumpPosition(start: Vec2, end: Vec2, t: number, calcDeltaY: (x: number) => number) {
		let flat = Vec2.lerp(start, end, t);
		let deltaX = start.distanceTo(flat);

		let y = calcDeltaY(deltaX);

		this.position = new Vec2(flat.x, flat.y - y);
	}
}
