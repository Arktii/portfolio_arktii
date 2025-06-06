import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

export class Target {
	offsetX: number;
	offSetY: number;
	xLimitStart?: number;
	xLimitEnd?: number;
	multiplyXByDirection: boolean;

	constructor(
		gridX: number,
		gridY: number,
		xLimitStart?: number,
		xLimitEnd?: number,
		multiplyXByDirection: boolean = true
	) {
		this.offsetX = gridX;
		this.offSetY = gridY;
		this.xLimitStart = xLimitStart;
		this.xLimitEnd = xLimitEnd;
		this.multiplyXByDirection = multiplyXByDirection;
	}
}

class WorldTarget {
	/**
	 * bottom-left corner
	 */
	offset: Vec2;
	xLimitStart?: number;
	xLimitEnd?: number;

	/**
	 * has no effect if absolute is true
	 */
	multiplyXByDirection: boolean;

	constructor(target: Target, cellSize: number) {
		this.offset = new Vec2(target.offsetX * cellSize, target.offSetY * cellSize);

		if (target.xLimitStart !== undefined) this.xLimitStart = target.xLimitStart * cellSize;
		if (target.xLimitEnd !== undefined) this.xLimitEnd = target.xLimitEnd * cellSize;

		this.multiplyXByDirection = target.multiplyXByDirection;
	}
}

export class MoveArea {
	downTarget?: WorldTarget;
	upTarget?: WorldTarget;

	aabb: BoundingBox;

	constructor(
		cellSize: number,
		xStart: number,
		xEnd: number,
		y: number,
		downGridTarget?: Target,
		upGridTarget?: Target
	) {
		if (downGridTarget) {
			this.downTarget = new WorldTarget(downGridTarget, cellSize);
		}
		if (upGridTarget) {
			this.upTarget = new WorldTarget(upGridTarget, cellSize);
		}

		this.aabb = BoundingBox.fromGrid(xStart, y, xEnd, y, cellSize);
	}
}
