import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

// TODO: remove absolute, replace with absolute limits
export class Target {
	gridX: number;
	gridY: number;
	absolute: boolean = false;
	/**
	 * has no effect if absolute is true
	 */
	multiplyXByDirection: boolean;

	constructor(
		gridX: number,
		gridY: number,
		absolute: boolean = true,
		multiplyXByDirection: boolean = false
	) {
		this.gridX = gridX;
		this.gridY = gridY;
		this.absolute = absolute;
		this.multiplyXByDirection = multiplyXByDirection;
	}
}

class WorldTarget {
	/**
	 * targets bottom left corner (rather than top)
	 */
	worldX: number;
	/**
	 * targets bottom left corner (rather than top)
	 */
	worldY: number;
	absolute: boolean;
	/**
	 * has no effect if absolute is true
	 */
	multiplyXByDirection: boolean;

	constructor(
		worldX: number,
		worldY: number,
		absolute: boolean = true,
		multiplyXByDirection: boolean = false
	) {
		this.worldX = worldX;
		this.worldY = worldY;
		this.absolute = absolute;
		this.multiplyXByDirection = multiplyXByDirection;
	}
}

export class MoveArea {
	start: Vec2;
	end: Vec2;
	downTarget?: WorldTarget;
	upTarget?: WorldTarget;

	aabb: BoundingBox;

	constructor(
		cellSize: number,
		start: Vec2,
		end: Vec2,
		downGridTarget?: Target,
		upGridTarget?: Target
	) {
		this.start = start;
		this.end = end;

		if (downGridTarget) {
			this.downTarget = new WorldTarget(
				downGridTarget.gridX * cellSize,
				(downGridTarget.gridY + 1) * cellSize,
				downGridTarget.absolute,
				downGridTarget.multiplyXByDirection
			);
		}
		if (upGridTarget) {
			this.upTarget = new WorldTarget(
				upGridTarget.gridX * cellSize,
				(upGridTarget.gridY + 1) * cellSize,
				upGridTarget.absolute,
				upGridTarget.multiplyXByDirection
			);
		}

		this.aabb = BoundingBox.fromGrid(this.start.x, this.start.y, this.end.x, this.end.y, cellSize);
	}
}
