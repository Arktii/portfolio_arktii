import { INDICATORS, PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { MoveArea, Target } from '../models/MoveArea';
import type { Player } from '../models/Player';
import { Vec2 } from '../models/Vec2';

import upKeyImg from '$lib/images/keyW.png';
import downKeyImg from '$lib/images/keyS.png';
import hereArrowImg from '$lib/images/hereArrow.png';

export class MoveAreaManager {
	colSpace: CollisionSpace;

	#moveAreas: MoveArea[] = [];

	#hereArrowImage?: import('p5').Image;
	#upKeyImage?: import('p5').Image;
	#downKeyImage?: import('p5').Image;

	#indicatorOffset: number = 0;
	#indicatorDirection: -1 | 1 = -1;

	constructor(collisionSpace: CollisionSpace) {
		this.colSpace = collisionSpace;
	}

	async setup(context: Context) {
		this.#upKeyImage = await context.p5.loadImage(upKeyImg);
		this.#downKeyImage = await context.p5.loadImage(downKeyImg);
		this.#hereArrowImage = await context.p5.loadImage(hereArrowImg);

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
		this.addArea(19, 21, 29, new Target(3, 3, 2, 18), new Target(0, -4));

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
		this.addArea(2, 3, 52, new Target(1, 3, 2, 7), new Target(0, -4));
		this.addArea(6, 9, 55, new Target(0, 3), new Target(1, -3, 7));
		this.addArea(2, 5, 55, new Target(0, 3), new Target(0, -3, 2, 2));

		// billboard
		this.addArea(9, 10, 52, new Target(1, 3, 2, 8), new Target(2, -3, 4, 6));

		// balcony
		this.addArea(2, 10, 58, new Target(0, 3), new Target(0, -3, 2, 8));
		this.addArea(10, 18, 58, new Target(0, 3));
		this.addArea(2, 19, 61, undefined, new Target(0, -3, 2, 17));
	}

	addArea(xStart: number, xEnd: number, y: number, downTarget?: Target, upTarget?: Target) {
		this.#moveAreas.push(
			new MoveArea(this.colSpace.cellSize, xStart, xEnd, y, downTarget, upTarget)
		);
	}

	update(context: Context, deltaSecs: number) {
		if (context.player.inputIsLocked) {
			return;
		}

		let p5 = context.p5;
		let playerAABB = context.player.calculateInteractAABB();

		// detect player
		for (let i = 0; i < this.#moveAreas.length; i++) {
			let moveArea = this.#moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				if (moveArea.downTarget) {
					let target = this.calculateTarget(
						context.player,
						moveArea.downTarget.offset,
						moveArea.downTarget.xLimitStart,
						moveArea.downTarget.xLimitEnd,
						moveArea.downTarget.multiplyXByDirection
					);

					this.drawIndicator(context, target, false);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('s') && !context.player.inputIsLocked) {
						context.player.jump(new Vec2(target.x, target.y));
						break;
					}
				}
				if (moveArea.upTarget) {
					let target = this.calculateTarget(
						context.player,
						moveArea.upTarget.offset,
						moveArea.upTarget.xLimitStart,
						moveArea.upTarget.xLimitEnd,
						moveArea.upTarget.multiplyXByDirection
					);

					this.drawIndicator(context, target, true);

					// @ts-ignore (typescript definitions aren't up to date with p5 version)
					if (p5.keyIsDown('w') && !context.player.inputIsLocked) {
						context.player.jump(target);
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
		player: Player,
		offset: Vec2,
		xLimitStart: number | undefined,
		xLimitEnd: number | undefined,
		multiplyXByDirection: boolean
	): Vec2 {
		let direction = multiplyXByDirection ? player.direction : 1;

		let target = new Vec2(player.position.x + offset.x * direction, player.position.y + offset.y);

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
