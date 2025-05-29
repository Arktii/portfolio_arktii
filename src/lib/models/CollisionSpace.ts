import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

export class CollisionSpace {
	/// World width
	worldWidth: number;
	/// World height
	worldHeight: number;

	cellSize: number;

	gridWidth: number;
	gridHeight: number;

	colliderGrid: boolean[][];

	/// gridWidth and height are in terms of number of cells
	constructor(gridWidth: number, gridHeight: number, cellSize: number) {
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;
		this.cellSize = cellSize;

		this.worldWidth = gridWidth * cellSize;
		this.worldHeight = gridHeight * cellSize;

		this.colliderGrid = Array(this.gridWidth)
			.fill(null)
			.map(() => Array(this.gridWidth).fill(false));
	}

	checkForCollision(aabb: BoundingBox): boolean {
		let xStart = Math.floor(aabb.left / this.cellSize);
		let xEnd = Math.floor(aabb.right / this.cellSize);
		let yStart = Math.floor(aabb.top / this.cellSize);
		let yEnd = Math.floor(aabb.bottom / this.cellSize);

		xStart = Math.max(0, xStart);
		xEnd = Math.min(this.gridWidth - 1, xEnd);
		yStart = Math.max(0, yStart);
		yEnd = Math.min(this.gridHeight - 1, yEnd);

		if (xStart > xEnd) {
			return false;
		}
		if (yStart > yEnd) {
			return false;
		}

		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				if (this.colliderGrid[x][y]) {
					return true;
				}
			}
		}

		return false;
	}

	calculateDisplacement(aabb: BoundingBox): Vec2 {
		let xStart = Math.floor(aabb.left / this.cellSize);
		let xEnd = Math.floor(aabb.right / this.cellSize);
		let yStart = Math.floor(aabb.top / this.cellSize);
		let yEnd = Math.floor(aabb.bottom / this.cellSize);

		xStart = Math.max(0, xStart);
		xEnd = Math.min(this.gridWidth - 1, xEnd);
		yStart = Math.max(0, yStart);
		yEnd = Math.min(this.gridHeight - 1, yEnd);

		if (xStart > xEnd) {
			return Vec2.ZERO;
		}
		if (yStart > yEnd) {
			return Vec2.ZERO;
		}

		let displacement = new Vec2(0, 0);
		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				if (this.colliderGrid[x][y]) {
					let staticAABB = BoundingBox.fromRect(
						x * this.cellSize,
						y * this.cellSize,
						this.cellSize,
						this.cellSize
					);
					let disp = this.calculateSingleDisplacement(staticAABB, aabb);

					if (disp.x != 0) {
						displacement.x = disp.x;
					} else if (disp.y != 0) {
						displacement.y = disp.y;
					}
				}
			}
		}

		return displacement;
	}

	calculateSingleDisplacement(staticAABB: BoundingBox, pushedAABB: BoundingBox): Vec2 {
		let left = pushedAABB.right - staticAABB.left;
		let right = staticAABB.right - pushedAABB.left;

		// normally, these two are reversed,
		// but canvas coordinates have lower values up and higher values going down
		let down = staticAABB.bottom - pushedAABB.top;
		let up = pushedAABB.bottom - staticAABB.top;

		console.log(left, right, up, down);

		if (Math.min(left, right) < Math.min(up, down)) {
			if (left < right) {
				return new Vec2(-left, 0);
			} else {
				return new Vec2(right, 0);
			}
		} else {
			if (up < down) {
				return new Vec2(0, -up);
			} else {
				return new Vec2(0, down);
			}
		}
	}
}
