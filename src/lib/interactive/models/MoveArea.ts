import { BoundingBox } from './BoundingBox';
import type { Mobile } from './Mobile';
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

export class WorldTarget {
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

	/**
	 * calculate the target position for a given mobile entity
	 */
	calculateUpTarget(mobile: Mobile): Vec2 | null {
		if (!this.upTarget) {
			return null;
		}

		return this.calculateTarget(
			mobile,
			this.upTarget.offset,
			this.upTarget.xLimitStart,
			this.upTarget.xLimitEnd,
			this.upTarget.multiplyXByDirection
		);
	}

	calculateDownTarget(mobile: Mobile): Vec2 | null {
		if (!this.downTarget) {
			return null;
		}

		return this.calculateTarget(
			mobile,
			this.downTarget.offset,
			this.downTarget.xLimitStart,
			this.downTarget.xLimitEnd,
			this.downTarget.multiplyXByDirection
		);
	}

	private calculateTarget(
		mobile: Mobile,
		offset: Vec2,
		xLimitStart: number | undefined,
		xLimitEnd: number | undefined,
		multiplyXByDirection: boolean
	): Vec2 {
		let direction = multiplyXByDirection ? mobile.getDirection() : 1;

		let target = new Vec2(mobile.position.x + offset.x * direction, mobile.position.y + offset.y);

		if (xLimitStart !== undefined) target.x = Math.max(target.x, xLimitStart);
		if (xLimitEnd !== undefined) target.x = Math.min(target.x, xLimitEnd);

		let targetX = target.x;
		let targetY = target.y;

		return new Vec2(targetX, targetY);
	}
}
