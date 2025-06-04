import { INDICATORS, PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { MoveArea, Target } from '../models/MoveArea';
import type { Player } from '../models/Player';
import { Vec2 } from '../models/Vec2';

import upKeyImg from '$lib/images/keyW.png';
import downKeyImg from '$lib/images/keyS.png';
import hereArrowImg from '$lib/images/hereArrow.png';

export class MovementPointManager {
	moveAreas: MoveArea[] = [];

	colSpace: CollisionSpace;
	player: Player;

	#hereArrowImage?: import('p5').Image;
	#upKeyImage?: import('p5').Image;
	#downKeyImage?: import('p5').Image;

	#indicatorOffset: number = 0;
	#indicatorDirection: -1 | 1 = -1;

	constructor(collisionSpace: CollisionSpace, player: Player) {
		this.colSpace = collisionSpace;
		this.player = player;
	}

	async setup(context: Context) {
		this.#upKeyImage = await context.p5.loadImage(upKeyImg);
		this.#downKeyImage = await context.p5.loadImage(downKeyImg);
		this.#hereArrowImage = await context.p5.loadImage(hereArrowImg);

		// roof
		this.addArea(1, 11, 3, new Target(2, 3, 1, 8));

		// balcony 1
		this.addArea(1, 10, 6, new Target(1, 3, 1, 8), new Target(1, -3, 1));
		this.addArea(1, 10, 9, new Target(1, 4, 1, 17), new Target(1, -3, 1, 8));

		// pipe
		this.addArea(1, 10, 13, new Target(1, 5, 3, 18), new Target(1, -4, 1, 8));
		this.addArea(11, 19, 13, new Target(1, 5, 3, 18));

		// ledge
		this.addArea(16, 20, 18, new Target(1, 3, 17, 18), new Target(2, -5, 1, 17));
		this.addArea(3, 13, 18, undefined, new Target(2, -5, 1, 17));

		// machine
		this.addArea(17, 20, 21, new Target(0, 4, 17, 18), new Target(0, -3));

		// machine
		this.addArea(17, 17, 25, new Target(3, 2, 3, 13), new Target(0, -4));
		this.addArea(17, 20, 25, new Target(0, 4), new Target(0, -4));

		// billboard
		this.addArea(15, 15, 27, new Target(0, 2, 17, 18), new Target(0, -2, 17, 18));
		this.addArea(3, 14, 27, new Target(0, 6));

		// machine
		this.addArea(17, 17, 29, new Target(2, 4, 1, 16), new Target(3, -2, 3, 13));
		this.addArea(18, 20, 29, new Target(2, 4, 1, 16), new Target(0, -4));

		// ledge
		this.addArea(16, 18, 33, new Target(1, 5, 17, 18), new Target(1, -5, 17, 18));
		this.addArea(1, 15, 33, new Target(0, 3, 1, 12));

		// pipe
		this.addArea(1, 2, 36, new Target(0, 4, 1, 1), new Target(0, -3));
		this.addArea(3, 9, 36, new Target(0, 7, 1, 6), new Target(0, -3));
		this.addArea(14, 14, 36, new Target(3, 2, 17, 17), new Target(0, -3));
		this.addArea(10, 13, 36, new Target(0, 7, 1, 6), new Target(0, -3));

		// machine
		this.addArea(17, 20, 38, new Target(0, 4), new Target(1, -2, 1, 12));

		// pipe
		this.addArea(15, 20, 42, undefined, new Target(0, -4, 17, 18));

		// balcony
		this.addArea(1, 2, 40, new Target(1, 3, 1, 6), new Target(0, -4));
		this.addArea(1, 3, 43, new Target(0, 3, 1, 1), new Target(0, -3, 1, 1));
		this.addArea(4, 5, 43, new Target(0, 6, 1, 2));

		// balcony
		this.addArea(1, 2, 46, new Target(1, 3, 1, 6), new Target(0, -3));
		this.addArea(4, 4, 49, new Target(2, 3, 6, 8, false));
		this.addArea(1, 3, 49, new Target(0, 3, 1, 1), new Target(0, -3, 1, 1));

		// balcony
		this.addArea(1, 2, 52, new Target(1, 3, 1, 6), new Target(0, -4));
		this.addArea(5, 8, 55, new Target(0, 3), new Target(1, -3, 6));
		this.addArea(1, 4, 55, new Target(0, 3), new Target(0, -3, 1, 1));

		// billboard
		this.addArea(6, 6, 52, new Target(1, 3, 1, 6), new Target(2, -3, 3, 3));
		this.addArea(7, 9, 52, new Target(1, 3, 1, 6));

		// balcony
		this.addArea(1, 9, 58, new Target(0, 3), new Target(0, -3, 1, 7));
		this.addArea(9, 17, 58, new Target(0, 3));
		this.addArea(1, 18, 61, undefined, new Target(0, -3, 1, 16));
	}

	addArea(xStart: number, xEnd: number, y: number, downTarget?: Target, upTarget?: Target) {
		this.moveAreas.push(
			new MoveArea(this.colSpace.cellSize, xStart, xEnd, y, downTarget, upTarget)
		);
	}

	update(context: Context, deltaSecs: number) {
		if (this.player.inputIsLocked) {
			return;
		}

		let p5 = context.p5;
		let playerAABB = this.player.calculateAABB();

		// detect player
		for (let i = 0; i < this.moveAreas.length; i++) {
			let moveArea = this.moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				if (moveArea.downTarget) {
					let target = this.calculateTarget(
						moveArea.downTarget.offset,
						moveArea.downTarget.xLimitStart,
						moveArea.downTarget.xLimitEnd,
						moveArea.downTarget.multiplyXByDirection
					);

					this.drawIndicator(context, target, false);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('s') && !this.player.inputIsLocked) {
						this.player.jump(new Vec2(target.x, target.y));
						break;
					}
				}
				if (moveArea.upTarget) {
					let target = this.calculateTarget(
						moveArea.upTarget.offset,
						moveArea.upTarget.xLimitStart,
						moveArea.upTarget.xLimitEnd,
						moveArea.upTarget.multiplyXByDirection
					);

					this.drawIndicator(context, target, true);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('w') && !this.player.inputIsLocked) {
						this.player.jump(target);
						break;
					}
				}
				if (moveArea.upTarget || moveArea.downTarget) {
					break;
				}
			}
		}

		// update indicator offset
		this.#indicatorOffset += deltaSecs * INDICATORS.MOVE_SPEED * this.#indicatorDirection;
		if (this.#indicatorOffset > INDICATORS.MAX_OFFSET) {
			this.#indicatorOffset = INDICATORS.MAX_OFFSET;
			this.#indicatorDirection = -1;
		} else if (this.#indicatorOffset < -INDICATORS.MAX_OFFSET) {
			this.#indicatorOffset = -INDICATORS.MAX_OFFSET;
			this.#indicatorDirection = 1;
		}
	}

	private calculateTarget(
		offset: Vec2,
		xLimitStart: number | undefined,
		xLimitEnd: number | undefined,
		multiplyXByDirection: boolean
	): Vec2 {
		let direction = multiplyXByDirection ? this.player.direction : 1;

		let target = new Vec2(
			this.player.position.x + offset.x * direction,
			this.player.position.y + offset.y
		);

		if (xLimitStart !== undefined) target.x = Math.max(target.x, xLimitStart);
		if (xLimitEnd !== undefined) target.x = Math.min(target.x, xLimitEnd);

		let targetX = target.x;
		let targetY = target.y;

		return new Vec2(targetX, targetY);
	}

	private drawIndicator(context: Context, target: Vec2, up: boolean) {
		let keyImage;
		if (up) {
			keyImage = this.#upKeyImage;
		} else {
			keyImage = this.#downKeyImage;
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
			this.#hereArrowImage,
			x,
			y - INDICATORS.HEIGHT + this.#indicatorOffset,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);
	}
}
