import { INDICATORS, PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { MoveArea, Target } from './MoveArea';
import type { Player } from './Player';
import { Vec2 } from './Vec2';

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

		this.addArea(0, 7, 2, new Target(3, 5, 0, 5, true));
		this.addArea(0, 3, 7, undefined, new Target(1, -5, 0));
		this.addArea(4, 6, 7, new Target(6, 1, 10, 14, false), new Target(1, -5, 0));
		this.addArea(10, 10, 8, new Target(1, 4, 0, 15), new Target(5, -1, 0, 5));
		this.addArea(12, 14, 8, new Target(1, 4, 0, 15));
		this.addArea(9, 15, 11, undefined, new Target(1, -4, 10, 13));

		console.log('Please work');
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
		let targetY = target.y - PLAYER.HEIGHT;

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
