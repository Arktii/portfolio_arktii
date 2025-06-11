import type { Vec2 } from './Vec2';

export class BoundingBox {
	left: number;
	right: number;
	top: number;
	bottom: number;

	constructor(left: number, right: number, top: number, bottom: number) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
	}

	/// x and y are the coordinates of the upper-left corner
	static fromRect(x: number, y: number, width: number, height: number): BoundingBox {
		return new BoundingBox(x, x + width, y, y + height);
	}

	static fromGrid(xStart: number, yStart: number, xEnd: number, yEnd: number, cellSize: number) {
		return new BoundingBox(
			xStart * cellSize,
			(xEnd + 1) * cellSize,
			yStart * cellSize,
			(yEnd + 1) * cellSize
		);
	}

	colliding(other: BoundingBox): boolean {
		return (
			this.left < other.right &&
			this.right > other.left &&
			this.bottom > other.top &&
			this.top < other.bottom
		);
	}

	collidingY(other: BoundingBox): boolean {
		return this.bottom > other.top && this.top < other.bottom;
	}

	collidingX(other: BoundingBox): boolean {
		return this.left < other.right && this.right > other.left;
	}

	contains(point: Vec2): boolean {
		return (
			point.y > this.top && point.y < this.bottom && point.x > this.left && point.x < this.right
		);
	}
}
