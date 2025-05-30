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

	addArea(start: Vec2, end: Vec2, downTarget?: Target, upTarget?: Target) {
		this.moveAreas.push(new MoveArea(this.colSpace.cellSize, start, end, downTarget, upTarget));
	}

	update(p5: import('p5'), deltaSecs: number) {
		let playerAABB = this.player.calculateAABB();

		for (let i = 0; i < this.moveAreas.length; i++) {
			let moveArea = this.moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.downTarget && p5.keyIsDown('s') && !this.player.inputIsLocked) {
					let target: Vec2;
					if (moveArea.downTarget.absolute) {
						target = new Vec2(moveArea.downTarget.worldX, moveArea.downTarget.worldY);
					} else {
						let direction = moveArea.downTarget.multiplyXByDirection ? this.player.direction : 1;

						target = new Vec2(
							this.player.position.x + moveArea.downTarget.worldX * direction,
							this.player.position.y + moveArea.downTarget.worldY
						);
					}

					this.jump(target);
					break;
				}
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.upTarget && p5.keyIsDown('w') && !this.player.inputIsLocked) {
					let target: Vec2;
					if (moveArea.upTarget.absolute) {
						target = new Vec2(moveArea.upTarget.worldX, moveArea.upTarget.worldY);
					} else {
						let direction = moveArea.upTarget.multiplyXByDirection ? this.player.direction : 1;

						console.log('Direction: ', direction);
						console.log('Offset: ', moveArea.upTarget.worldX * direction);

						target = new Vec2(
							this.player.position.x + moveArea.upTarget.worldX * direction,
							this.player.position.y + moveArea.upTarget.worldY
						);
					}

					this.jump(target);

					break;
				}
			}
		}
	}

	private jump(target: Vec2) {
		let targetX = target.x;
		let targetY = target.y - PLAYER.HEIGHT;

		this.player.jump(new Vec2(targetX, targetY));
	}
}
