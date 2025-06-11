import { FIXED_DELTA_SECS, MOBILE, PHYSICS } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { Tween } from '../systems/Tween';
import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

export abstract class Mobile {
	position: Vec2;
	width: number;
	height: number;
	velocity: Vec2 = Vec2.zero();

	protected direction: -1 | 1 = 1;
	protected walkingAgainstEdge: boolean = false;

	movementTween?: Tween;

	constructor(position: Vec2, width: number, height: number) {
		this.position = position;
		this.width = width;
		this.height = height;
	}

	protected setDirection(direction: -1 | 1) {
		this.direction = direction;
	}

	calculateAABB(): BoundingBox {
		return BoundingBox.fromRect(this.position.x, this.position.y, this.width, this.height);
	}

	protected applyGravity() {
		this.velocity.y += PHYSICS.GRAVITY * FIXED_DELTA_SECS;
	}

	/**
	 * handles updating position based on set velocity; also handles collisions and edges
	 */
	protected updatePosition(context: Context) {
		this.position.y += this.velocity.y * FIXED_DELTA_SECS;
		this.position.x = Math.max(this.position.x + this.velocity.x * FIXED_DELTA_SECS, 0); // prevent negative x

		this.handleCollisions(context.colSpace);

		this.handleEdgeProtection(context.colSpace);
	}

	private handleCollisions(colSpace: CollisionSpace) {
		let collisionBox = this.calculateAABB();

		let collisionDisplacement = colSpace.calculateDisplacement(collisionBox);
		if (collisionDisplacement.y != 0) {
			this.velocity.y = 0;
			this.position.y += collisionDisplacement.y;
		}

		if (collisionDisplacement.x != 0) {
			this.velocity.x = 0;
			this.position.x += collisionDisplacement.x;
		}
	}

	/**
	 * prevent walking off edges
	 */
	private handleEdgeProtection(colSpace: CollisionSpace) {
		if (this.velocity.y == 0) {
			// walking left
			if (this.velocity.x < 0) {
				let playerLeft = this.position.x;
				let playerBottom = this.position.y + this.height;
				// a point slightly below the overhang
				let point = new Vec2(playerLeft, playerBottom + MOBILE.EDGE_CHECK);

				if (!colSpace.checkPointCollision(point)) {
					this.velocity.x = 0;
					this.position.x += colSpace.cellSize - (playerLeft % colSpace.cellSize);
					this.walkingAgainstEdge = true;
				} else {
					this.walkingAgainstEdge = false;
				}
			}
			// walking right
			else if (this.velocity.x > 0) {
				let playerRight = this.position.x + this.width;
				let playerBottom = this.position.y + this.height;
				// a point slightly below the overhang
				let point = new Vec2(playerRight, playerBottom + MOBILE.EDGE_CHECK);

				if (!colSpace.checkPointCollision(point)) {
					this.velocity.x = 0;
					this.position.x -= playerRight % colSpace.cellSize;
					this.walkingAgainstEdge = true;
				} else {
					this.walkingAgainstEdge = false;
				}
			}
		} else {
			this.walkingAgainstEdge = false;
		}
	}

	jump(target: Vec2) {
		if (target.x < this.position.x) {
			this.setDirection(-1);
		} else if (target.x > this.position.x) {
			this.setDirection(1);
		}

		let launchAngle =
			target.y < this.position.y ? MOBILE.UP_LAUNCH_ANGLE : MOBILE.DOWN_LAUNCH_ANGLE;
		let jumpSpeed = target.y < this.position.y ? MOBILE.UP_JUMP_SPEED : MOBILE.DOWN_JUMP_SPEED;

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

				this.tweenOnUpdateExtraActions();
			})
			.setFinishFunction(() => {
				this.position = target;
				this.movementTween = undefined;

				this.tweenOnFinishExtraActions();
			});

		this.movementTween = tween;
	}

	private updateJumpPosition(start: Vec2, end: Vec2, t: number, calcDeltaY: (x: number) => number) {
		let flat = Vec2.lerp(start, end, t);
		let deltaX = start.distanceTo(flat);

		let y = calcDeltaY(deltaX);

		this.position = new Vec2(flat.x, flat.y - y);
	}

	/**
	 * Additional functionality for when tween updates
	 */
	protected tweenOnUpdateExtraActions() {}

	/**
	 * Additional functionality for when the tween finished
	 */
	protected tweenOnFinishExtraActions() {}
}
