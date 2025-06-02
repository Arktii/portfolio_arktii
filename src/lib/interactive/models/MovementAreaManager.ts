import { PLAYER } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { MoveArea, Target } from './MoveArea';
import type { Player } from './Player';
import { Vec2 } from './Vec2';

export class MovementPointManager {
	moveAreas: MoveArea[] = [];

	colSpace: CollisionSpace;
	player: Player;

	constructor(collisionSpace: CollisionSpace, player: Player) {
		this.colSpace = collisionSpace;
		this.player = player;
	}

	addArea(xStart: number, xEnd: number, y: number, downTarget?: Target, upTarget?: Target) {
		this.moveAreas.push(
			new MoveArea(this.colSpace.cellSize, xStart, xEnd, y, downTarget, upTarget)
		);
	}

	update(context: Context, deltaSecs: number) {
		let p5 = context.p5;
		let playerAABB = this.player.calculateAABB();

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

					this.drawTarget(p5, target);

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

					this.drawTarget(p5, target);

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

	private drawTarget(p5: import('p5'), target: Vec2) {
		p5.rect(target.x, target.y, 25, 25);
	}
}
