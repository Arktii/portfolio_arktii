export class Vec2 {
	x: number;
	y: number;

	static readonly ZERO = new Vec2(0, 0);
	static readonly ONE = new Vec2(0, 0);
	static readonly UP = new Vec2(0, 1);
	static readonly DOWN = new Vec2(0, -1);
	static readonly LEFT = new Vec2(-1, 0);
	static readonly RIGHT = new Vec2(1, 0);

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static add(a: Vec2, b: Vec2): Vec2 {
		return new Vec2(a.x + b.x, a.y + b.y);
	}

	static multiply(vec: Vec2, scalar: number): Vec2 {
		return new Vec2(vec.x * scalar, vec.y * scalar);
	}

	static lerp(start: Vec2, end: Vec2, t: number): Vec2 {
		return new Vec2(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t);
	}

	/**
	 * magnitude squared (square root operation is not performed)
	 */
	magnitudeSq(): number {
		return this.x * this.x + this.y * this.y;
	}

	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	equals(a: Vec2, b: Vec2): boolean {
		return a.x == b.x && a.y == b.y;
	}

	/**
	 * distance squared (square root operation is not performed)
	 */
	distanceToSq(other: Vec2): number {
		let dx = other.x - this.x;
		let dy = other.y - this.y;

		return dx * dx + dy * dy;
	}

	distanceTo(other: Vec2): number {
		return Math.sqrt(this.distanceToSq(other));
	}
}
