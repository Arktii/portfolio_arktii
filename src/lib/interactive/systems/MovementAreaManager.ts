import { FIXED_DELTA_SECS, INDICATORS, PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import type { BoundingBox } from '../models/BoundingBox';
import { MoveArea, Target } from '../models/MoveArea';
import { Vec2 } from '../models/Vec2';

export class MoveAreaManager {
	colSpace: CollisionSpace;

	#moveAreas: MoveArea[] = [];

	#indicatorOffset: number = 0;
	#indicatorDirection: -1 | 1 = -1;

	constructor(collisionSpace: CollisionSpace) {
		this.colSpace = collisionSpace;
	}

	async setup(context: Context) {
		this.setupMoveAreas();
	}

	addArea(xStart: number, xEnd: number, y: number, downTarget?: Target, upTarget?: Target) {
		let newArea = new MoveArea(this.colSpace.cellSize, xStart, xEnd, y, downTarget, upTarget);

		if (this.#moveAreas.length == 0) {
			this.#moveAreas.push(newArea);
		} else {
			// insert sorted by y
			for (let i = this.#moveAreas.length - 1; i >= 0; i--) {
				if (this.#moveAreas[i].aabb.bottom <= newArea.aabb.bottom) {
					this.#moveAreas.splice(i + 1, 0, newArea);
					break;
				}
			}
		}
	}

	getRandomArea(): MoveArea {
		return this.#moveAreas[Math.floor(Math.random() * this.#moveAreas.length)];
	}

	checkForMoveArea(aabb: BoundingBox): MoveArea | null {
		let index = this.findIntersectingYIndex(aabb);

		if (index == -1) {
			return null;
		}

		let intersectingY = [this.#moveAreas[index]];
		// check to the right
		for (let i = index + 1; i < this.#moveAreas.length; i++) {
			const moveArea = this.#moveAreas[i];
			if (moveArea.aabb.collidingY(aabb)) {
				intersectingY.push(moveArea);
			} else {
				break;
			}
		}

		// check to the left
		for (let i = index - 1; i >= 0; i--) {
			const moveArea = this.#moveAreas[i];
			if (moveArea.aabb.collidingY(aabb)) {
				intersectingY.push(moveArea);
			} else {
				break;
			}
		}

		for (let i = 0; i < intersectingY.length; i++) {
			const moveArea = intersectingY[i];
			if (moveArea.aabb.collidingX(aabb)) {
				return moveArea;
			}
		}

		return null;
	}

	/**
	 * uses binary search to find the index of a moveArea with an intersecting y.
	 *
	 * this is not necessarily the first or last moveArea
	 */
	private findIntersectingYIndex(aabb: BoundingBox): number {
		let leftIndex = 0;
		let rightIndex = this.#moveAreas.length; // right index is exclusive
		let mid;

		while (leftIndex < rightIndex) {
			mid = Math.floor((leftIndex + rightIndex) / 2);

			const moveArea = this.#moveAreas[mid];
			if (moveArea.aabb.collidingY(aabb)) {
				return mid;
			}
			if (aabb.top >= moveArea.aabb.top) {
				leftIndex = mid + 1;
			} else {
				rightIndex = mid;
			}
		}

		return -1;
	}

	fixedUpdate(context: Context) {
		if (context.player.inputIsLocked) {
			return;
		}

		let p5 = context.p5;
		let playerAABB = context.player.calculateInteractAABB();

		// detect player
		for (let i = 0; i < this.#moveAreas.length; i++) {
			const moveArea = this.#moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				const downTargetWorld = moveArea.calculateDownTarget(context.player);
				if (downTargetWorld) {
					this.drawIndicator(context, downTargetWorld, false);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('s') && !context.player.inputIsLocked) {
						context.player.jump(downTargetWorld);
						break;
					}
				}

				const upTargetWorld = moveArea.calculateUpTarget(context.player);
				if (upTargetWorld) {
					this.drawIndicator(context, upTargetWorld, true);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('w') && !context.player.inputIsLocked) {
						context.player.jump(upTargetWorld);
						break;
					}
				}
				if (moveArea.upTarget || moveArea.downTarget) {
					break;
				}
			}
		}

		// update indicator offset
		this.updateIndicators();
	}

	private updateIndicators() {
		this.#indicatorOffset += FIXED_DELTA_SECS * INDICATORS.MOVE_SPEED * this.#indicatorDirection;
		if (this.#indicatorOffset > INDICATORS.MAX_OFFSET) {
			this.#indicatorOffset = INDICATORS.MAX_OFFSET;
			this.#indicatorDirection = -1;
		} else if (this.#indicatorOffset < -INDICATORS.MAX_OFFSET) {
			this.#indicatorOffset = -INDICATORS.MAX_OFFSET;
			this.#indicatorDirection = 1;
		}
	}

	// private calculateTarget(
	// 	player: Player,
	// 	offset: Vec2,
	// 	xLimitStart: number | undefined,
	// 	xLimitEnd: number | undefined,
	// 	multiplyXByDirection: boolean
	// ): Vec2 {
	// 	let direction = multiplyXByDirection ? player.getDirection() : 1;

	// 	let target = new Vec2(player.position.x + offset.x * direction, player.position.y + offset.y);

	// 	if (xLimitStart !== undefined) target.x = Math.max(target.x, xLimitStart);
	// 	if (xLimitEnd !== undefined) target.x = Math.min(target.x, xLimitEnd);

	// 	let targetX = target.x;
	// 	let targetY = target.y;

	// 	return new Vec2(targetX, targetY);
	// }

	private drawIndicator(context: Context, target: Vec2, up: boolean) {
		let keyImage;
		if (up) {
			keyImage = context.preloads.image('keyW');
		} else {
			keyImage = context.preloads.image('keyS');
		}

		let x = target.x - INDICATORS.WIDTH + PLAYER.SPRITE_WIDTH / 2;
		let y = target.y + (PLAYER.SPRITE_HEIGHT - PLAYER.HEIGHT) - INDICATORS.MAX_OFFSET;

		context.drawing.image(
			keyImage,
			x,
			y - 2 * INDICATORS.HEIGHT - INDICATORS.SPACING - INDICATORS.MAX_OFFSET,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);
		context.drawing.image(
			context.preloads.image('arrowDown'),
			x,
			y - INDICATORS.HEIGHT + this.#indicatorOffset,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);
	}

	private setupMoveAreas() {
		// NOTE: for consistency, keep cat max. upwards jump at 5 and max. drop at 7
		// roof
		this.addArea(2, 12, 3, new Target(2, 3, 2, 10));

		// balcony 1
		this.addArea(2, 11, 6, new Target(1, 3, 2, 10), new Target(1, -3, 2));
		this.addArea(2, 11, 9, new Target(2, 4, 2, 19), new Target(1, -3, 2, 10));

		// pipe
		this.addArea(2, 12, 13, new Target(1, 5, 4, 20), new Target(1, -4, 2, 10));
		this.addArea(13, 20, 13, new Target(1, 5, 4, 20));

		// ledge
		this.addArea(17, 21, 18, new Target(1, 3, 18, 20), new Target(2, -5, 2, 19));
		this.addArea(4, 14, 18, undefined, new Target(2, -5, 2, 19));

		// machine
		this.addArea(18, 21, 21, new Target(0, 4, 18, 20), new Target(0, -3));

		// machine
		// - to billboard / machine
		this.addArea(18, 18, 25, new Target(3, 3, 4, 15), new Target(0, -4));
		// - to machine / machine
		this.addArea(18, 21, 25, new Target(0, 4), new Target(0, -4));

		// billboard
		// - to machine / machine
		this.addArea(16, 16, 28, new Target(4, 1, 18, 20), new Target(4, -3, 18, 20));
		// - to ledge
		this.addArea(4, 15, 28, new Target(0, 5));

		// machine
		// - to ledge / billboard
		this.addArea(18, 18, 29, new Target(3, 4, 2, 18), new Target(3, -1, 4, 15));
		// - to ledge / machine
		this.addArea(19, 21, 29, new Target(3, 4, 2, 18), new Target(0, -4));

		// ledge
		// - to pipe / machine
		this.addArea(17, 19, 33, new Target(1, 5, 18, 20), new Target(1, -4, 18, 20));
		// - to pipe / billboard
		this.addArea(2, 16, 33, new Target(0, 3, 2, 14), new Target(0, -5, 4, 15));

		// pipe
		// - to rail / ledge
		this.addArea(2, 3, 36, new Target(0, 4, 2, 2), new Target(0, -3));
		// - to balcony / ledge
		this.addArea(4, 8, 36, new Target(0, 7, 2, 6), new Target(0, -3));
		// - to pipe / ledge
		this.addArea(15, 15, 36, new Target(3, 2, 18, 18), new Target(0, -3));
		// - to _ / ledge
		this.addArea(9, 14, 36, undefined, new Target(0, -3));

		// machine
		this.addArea(18, 21, 38, new Target(0, 4), new Target(1, -2, 2, 14));

		// pipe
		this.addArea(16, 21, 42, undefined, new Target(0, -4, 18, 20));

		// balcony
		this.addArea(2, 3, 40, new Target(1, 3, 2, 7), new Target(0, -4));
		this.addArea(2, 4, 43, new Target(0, 3, 2, 2), new Target(0, -3, 2, 2));
		this.addArea(5, 7, 43, new Target(0, 6, 2, 6));

		// balcony
		this.addArea(2, 3, 46, new Target(1, 3, 2, 7), new Target(0, -3));
		// - to billboard
		this.addArea(7, 7, 49, new Target(3, 3, 9, undefined, false));
		this.addArea(2, 4, 49, new Target(0, 3, 2, 2), new Target(0, -3, 2, 2));
		// - to balcony
		this.addArea(5, 7, 49, new Target(0, 6, 2, 8));

		// balcony
		this.addArea(2, 3, 52, new Target(1, 3, 2, 7), new Target(0, -3));
		this.addArea(6, 9, 55, new Target(0, 3), new Target(2, -3, 9));
		this.addArea(2, 5, 55, new Target(0, 3), new Target(0, -3, 2, 2));

		// billboard
		this.addArea(9, 10, 52, new Target(1, 3, 2, 8), new Target(2, -3, 4, 6));

		// balcony
		this.addArea(2, 10, 58, new Target(0, 3), new Target(0, -3, 2, 8));
		this.addArea(10, 18, 58, new Target(0, 3));
		this.addArea(2, 19, 61, undefined, new Target(0, -3, 2, 17));
	}
}
