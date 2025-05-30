import { clamp } from '$lib/utils/Math';
import { PLAYER } from '../constants';
import type { CollisionSpace } from './CollisionSpace';
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

	update(p5: import('p5'), deltaSecs: number) {
		let playerAABB = this.player.calculateAABB();

		for (let i = 0; i < this.moveAreas.length; i++) {
			let moveArea = this.moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.downTarget && p5.keyIsDown('s') && !this.player.inputIsLocked) {
					this.jump(
						moveArea.downTarget.offset,
						moveArea.downTarget.xLimitStart,
						moveArea.downTarget.xLimitEnd,
						moveArea.downTarget.multiplyXByDirection
					);
					break;
				}
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.upTarget && p5.keyIsDown('w') && !this.player.inputIsLocked) {
					this.jump(
						moveArea.upTarget.offset,
						moveArea.upTarget.xLimitStart,
						moveArea.upTarget.xLimitEnd,
						moveArea.upTarget.multiplyXByDirection
					);
					break;
				}
			}
		}
	}

	private jump(
		offset: Vec2,
		xLimitStart: number | undefined,
		xLimitEnd: number | undefined,
		multiplyXByDirection: boolean
	) {
		let direction = multiplyXByDirection ? this.player.direction : 1;

		let target = new Vec2(
			this.player.position.x + offset.x * direction,
			this.player.position.y + offset.y
		);

		if (xLimitStart !== undefined) target.x = Math.max(target.x, xLimitStart);
		if (xLimitEnd !== undefined) target.x = Math.min(target.x, xLimitEnd);

		let targetX = target.x;
		let targetY = target.y - PLAYER.HEIGHT;

		this.player.jump(new Vec2(targetX, targetY));
	}
}
