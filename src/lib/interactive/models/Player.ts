import { PHYSICS, PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';

import { DirectionFlags } from './DirectionFlags';
import { Vec2 } from './Vec2';
import { BoundingBox } from './BoundingBox';
import { Tween } from '../systems/Tween';

export class Player {
	position: Vec2;

	#direction: -1 | 1;

	#inputIsLocked: boolean;

	// property, because I may introduce a slower speed for when pushing objects
	#speed: number;

	#directionInputs: DirectionFlags;
	#velocity: Vec2;

	#tween?: Tween;

	constructor(collisionSpace: CollisionSpace, position: Vec2) {
		this.position = position;
		this.#direction = 1;

		this.#inputIsLocked = false;
		this.#directionInputs = new DirectionFlags();
		this.#speed = PLAYER.SPEED;
		this.#velocity = Vec2.ZERO;
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

	update(context: Context, deltaSecs: number) {
		if (!this.#inputIsLocked) {
			this.moveHorizontally(context.p5);

			// gravity
			this.#velocity.y += PHYSICS.GRAVITY * deltaSecs;

			// update positions
			this.position.y += this.#velocity.y * deltaSecs;
			this.position.x = Math.max(this.position.x + this.#velocity.x * deltaSecs, 0); // prevent negative x

			this.handleCollisions(context.colSpace);

			this.handleEdgeProtection(context.colSpace);
		}

		if (this.#tween) {
			this.#tween.update(deltaSecs);
		}
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
			this.#direction = 1;
		} else if (this.velocity.x < 0) {
			this.#direction = -1;
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

	jump(target: Vec2) {
		this.#inputIsLocked = true;

		if (target.x < this.position.x) {
			this.#direction = -1;
		} else if (target.x > this.position.x) {
			this.#direction = 1;
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

		let tween = new Tween(0, 1, duration)
			.setUpdateFunction((t) => {
				this.updateJumpPosition(start, target, t, calcDeltaY);
			})
			.setFinishFunction(() => {
				this.position = target;
				this.#tween = undefined;
				this.#inputIsLocked = false;
			});

		this.#tween = tween;
	}

	private updateJumpPosition(start: Vec2, end: Vec2, t: number, calcDeltaY: (x: number) => number) {
		let flat = Vec2.lerp(start, end, t);
		let deltaX = start.distanceTo(flat);

		let y = calcDeltaY(deltaX);

		this.position = new Vec2(flat.x, flat.y - y);
	}
}
