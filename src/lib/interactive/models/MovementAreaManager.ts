import { PLAYER } from '../constants';
import { BoundingBox } from './BoundingBox';
import type { CollisionSpace } from './CollisionSpace';
import { MoveArea } from './MoveArea';
import type { Player } from './Player';
import type { Vec2 } from './Vec2';

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
			let moveAreaAABB = this.moveAreas[i].aabb;
			if (moveAreaAABB.colliding(playerAABB)) {
				// TODO: open new input options
				console.log('HEY THERE');
				break;
			}
		}
	}
}
