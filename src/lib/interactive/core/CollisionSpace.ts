import { calculateOverlap, calculateSingleDisplacement } from '$lib/utils/Collisions';
import { BoundingBox } from '../models/BoundingBox';
import { Vec2 } from '../models/Vec2';

export class CollisionSpace {
	// todo? add origin
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

	/**
	 * converts a coordinate in the world to a grid coordinate
	 */
	worldToGrid(worldCoordinate: number): number {
		return Math.floor(worldCoordinate / this.cellSize);
	}

	/**
	 * converts a grid coordinate to the cell's left edge in the world
	 */
	gridToWorldLeft(gridCoordinate: number): number {
		return gridCoordinate * this.cellSize;
	}

	/**
	 * converts a grid coordinate to the cell's right edge in the world
	 */
	gridToWorldRight(gridCoordinate: number): number {
		return (gridCoordinate + 1) * this.cellSize + this.cellSize;
	}

	/**
	 * converts a grid coordinate to the cell's top edge in the world
	 */
	gridToWorldTop(gridCoordinate: number): number {
		return gridCoordinate * this.cellSize;
	}

	/**
	 * converts a grid coordinate to the cell's bottom edge in the world
	 */
	gridToWorldBottom(gridCoordinate: number): number {
		return (gridCoordinate + 1) * this.cellSize;
	}

	checkPointCollision(point: Vec2): boolean {
		if (point.x < 0 || point.y < 0) {
			return false;
		}

		let x = this.worldToGrid(point.x);
		let y = this.worldToGrid(point.y);

		if (x >= this.gridWidth || y >= this.gridHeight) {
			return false;
		}

		return this.colliderGrid[x][y];
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
			return Vec2.zero();
		}
		if (yStart > yEnd) {
			return Vec2.zero();
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
					let disp = calculateSingleDisplacement(staticAABB, aabb);

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

	/**
	 * returns the largest overlap in each axis
	 */
	calculateOverlap(aabb: BoundingBox): Vec2 {
		let xStart = Math.floor(aabb.left / this.cellSize);
		let xEnd = Math.floor(aabb.right / this.cellSize);
		let yStart = Math.floor(aabb.top / this.cellSize);
		let yEnd = Math.floor(aabb.bottom / this.cellSize);

		xStart = Math.max(0, xStart);
		xEnd = Math.min(this.gridWidth - 1, xEnd);
		yStart = Math.max(0, yStart);
		yEnd = Math.min(this.gridHeight - 1, yEnd);

		if (xStart > xEnd) {
			return Vec2.zero();
		}
		if (yStart > yEnd) {
			return Vec2.zero();
		}

		let overlap = new Vec2(0, 0);
		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				if (this.colliderGrid[x][y]) {
					let staticAABB = BoundingBox.fromRect(
						x * this.cellSize,
						y * this.cellSize,
						this.cellSize,
						this.cellSize
					);
					let newOverlap = calculateOverlap(staticAABB, aabb);

					overlap.x = Math.max(overlap.x, newOverlap.x);
					overlap.y = Math.max(overlap.y, newOverlap.y);
				}
			}
		}

		return overlap;
	}
}
