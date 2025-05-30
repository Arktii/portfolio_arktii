import { FLOAT_TOLERANCE, PLAYER } from '$lib/interactive/constants';
import type { CollisionSpace } from './CollisionSpace';
import { DirectionFlags } from './DirectionFlags';
import { Vec2 } from './Vec2';
import { BoundingBox } from './BoundingBox';
import { Tween } from '../systems/Tween';

export class Player {
	position: Vec2;

	#inputIsLocked: boolean;

	// property, because I may introduce a slower speed for when pushing objects
	#speed: number;

	#directionInputs: DirectionFlags;
	#velocity: Vec2;

	#colSpace: CollisionSpace;

	#tween?: Tween;

	constructor(collisionSpace: CollisionSpace, position: Vec2) {
		this.#colSpace = collisionSpace;

		this.position = position;

		this.#inputIsLocked = false;
		this.#directionInputs = new DirectionFlags();
		this.#speed = PLAYER.SPEED;
		this.#velocity = Vec2.ZERO;
	}

	get inputIsLocked() {
		return this.#inputIsLocked;
	}

	calculateAABB(): BoundingBox {
		return BoundingBox.fromRect(this.position.x, this.position.y, PLAYER.WIDTH, PLAYER.HEIGHT);
	}

	update(p5: import('p5'), deltaSecs: number) {
		if (!this.#inputIsLocked) {
			this.moveHorizontally(p5);

			// gravity
			this.#velocity.y += PLAYER.GRAVITY * deltaSecs;

			// update positions
			this.position.y += this.#velocity.y * deltaSecs;
			this.position.x = Math.max(this.position.x + this.#velocity.x * deltaSecs, 0); // prevent negative x

			this.handleCollisions();

			this.handleEdgeProtection();
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
	}

	private handleCollisions() {
		let collisionBox = this.calculateAABB();

		let collisionDisplacement = this.#colSpace.calculateDisplacement(collisionBox);
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
	private handleEdgeProtection() {
		if (this.#velocity.y == 0) {
			// walking left
			if (this.#velocity.x < 0) {
				let playerLeft = this.position.x;
				let playerBottom = this.position.y + PLAYER.HEIGHT;
				// a point slightly below the overhang
				let point = new Vec2(playerLeft, playerBottom + PLAYER.EDGE_CHECK);

				if (!this.#colSpace.checkPointCollision(point)) {
					this.#velocity.x = 0;
					this.position.x += this.#colSpace.cellSize - (playerLeft % this.#colSpace.cellSize);
				}
			}

			// walking right
			else if (this.#velocity.x > 0) {
				let playerRight = this.position.x + PLAYER.WIDTH;
				let playerBottom = this.position.y + PLAYER.HEIGHT;
				// a point slightly below the overhang
				let point = new Vec2(playerRight, playerBottom + PLAYER.EDGE_CHECK);

				if (!this.#colSpace.checkPointCollision(point)) {
					this.#velocity.x = 0;
					this.position.x -= playerRight % this.#colSpace.cellSize;
				}
			}
		}
	}

	jump(target: Vec2) {
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
				console.log('landed');
				this.#tween = undefined;
			});

		this.#tween = tween;
	}

	private updateJumpPosition(start: Vec2, end: Vec2, t: number, calcDeltaY: (x: number) => number) {
		let flat = Vec2.lerp(start, end, t);
		let deltaX = start.distanceTo(flat);

		let y = calcDeltaY(deltaX);

		this.position = new Vec2(flat.x, flat.y - y);
	}

	// Code from other project for jumping Lerp:
	// public static void Jump(Node2D node2d, Vector2 end, Action callback, float speed = MoveSpeed)
	// {
	//     node2d.ZIndex += 1;
	//     Vector2 start = node2d.Position;
	//     float distance = start.DistanceTo(end);
	//     float duration = distance / speed;

	//     float tan = Mathf.Tan(LaunchAngle);
	//     (float sin, float cos) = Mathf.SinCos(LaunchAngle);
	//     float adjustedSpeed = Mathf.Sqrt(5 * distance / (sin * cos));

	//     // Formula: y(x) = -g/2 * (x/v_0*cos(theta))^2  + x * tan(theta); where g = 10
	//     float deltaY(float x) => -5 * Mathf.Pow(x / (adjustedSpeed * cos), 2) + (x * tan);

	//     Tween tween = node2d.CreateTween();
	//     Callable callable = Callable.From((float t) => UpdatePosition(node2d, start, end, deltaY, t));
	//     Callable finalize = Callable.From(() => { node2d.ZIndex -= 1; callback(); });
	//     tween.TweenMethod(callable, 0f, 1f, duration);
	//     tween.TweenCallback(finalize);
	// }

	// private static void UpdatePosition(Node2D node2d, Vector2 start, Vector2 end, Func<float, float> deltaY, float t)
	// {
	//     Vector2 flat = start.Lerp(end, t);
	//     float deltaX = start.DistanceTo(flat);

	//     float y = deltaY(deltaX);

	//     node2d.Position = new Vector2(flat.X, flat.Y - y);
	// }
}
