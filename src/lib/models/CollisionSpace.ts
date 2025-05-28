export class CollisionSpace {
	originX: number;
	originY: number;

	/// World width
	worldWidth: number;
	/// World height
	worldHeight: number;

	cellSize: number;

	gridWidth: number;
	gridHeight: number;

	colliderGrid: boolean[][];

	/// gridWidth and height are in terms of number of cells
	constructor(
		originX: number,
		originY: number,
		gridWidth: number,
		gridHeight: number,
		cellSize: number
	) {
		this.originX = originX;
		this.originY = originY;

		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;
		this.cellSize = cellSize;

		this.worldWidth = gridWidth * cellSize;
		this.worldHeight = gridHeight * cellSize;

		this.colliderGrid = Array(this.gridWidth)
			.fill(null)
			.map(() => Array(this.gridWidth).fill(false));
	}

	checkForCollision(rectangle: BoundingBox): boolean {
		let xStart = Math.floor((rectangle.left - this.originX) / this.cellSize);
		let xEnd = Math.floor((rectangle.right - this.originX) / this.cellSize);
		let yStart = Math.floor((rectangle.top - this.originY) / this.cellSize);
		let yEnd = Math.floor((rectangle.bottom - this.originY) / this.cellSize);

		xStart = Math.max(0, xStart);
		xEnd = Math.min(this.gridWidth, xEnd);
		yStart = Math.max(0, yStart);
		yEnd = Math.min(this.gridHeight - this.cellSize, yEnd);

		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				if (this.colliderGrid[x][y]) {
					return true;
				}
			}
		}

		return false;
	}
}
