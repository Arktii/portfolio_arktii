import { PLAYER } from '../constants';
import type { CollisionSpace } from './CollisionSpace';
import { MoveArea } from './MoveArea';
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

	addArea(
		start: Vec2,
		end: Vec2,
		downTarget: Vec2 | undefined = undefined,
		upTarget: Vec2 | undefined = undefined
	) {
		this.moveAreas.push(new MoveArea(this.colSpace.cellSize, start, end, downTarget, upTarget));
	}

	update(p5: import('p5'), deltaSecs: number) {
		let playerAABB = this.player.calculateAABB();

		for (let i = 0; i < this.moveAreas.length; i++) {
			let moveArea = this.moveAreas[i];
			if (moveArea.aabb.colliding(playerAABB)) {
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.downTarget && p5.keyIsDown('s') && !this.player.inputIsLocked) {
					let targetX = moveArea.downTarget.x - PLAYER.WIDTH / 2;
					let targetY = moveArea.downTarget.y - PLAYER.HEIGHT / 2;

					this.player.jump(new Vec2(targetX, targetY));
					break;
				}
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (moveArea.upTarget && p5.keyIsDown('w') && !this.player.inputIsLocked) {
					let targetX = moveArea.upTarget.x - PLAYER.WIDTH / 2;
					let targetY = moveArea.upTarget.y - PLAYER.HEIGHT / 2;

					this.player.jump(new Vec2(targetX, targetY));
					break;
				}
			}
		}
	}
}
