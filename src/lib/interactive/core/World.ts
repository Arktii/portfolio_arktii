import { Vec2 } from '$lib/interactive/models/Vec2';

export class World {
	resizeRatio: number = 0;

	worldToCanvas(x: number, y: number): Vec2 {
		return new Vec2(x * this.resizeRatio, y * this.resizeRatio);
	}

	worldPointToCanvas(point: Vec2): Vec2 {
		return new Vec2(point.x * this.resizeRatio, point.y * this.resizeRatio);
	}

	/**
	 * resize a world value for rendering on the canvas
	 */
	toCanvas(value: number): number {
		return value * this.resizeRatio;
	}

	/**
	 * convert a canvas value into a world value
	 */
	toWorld(value: number): number {
		return value / this.resizeRatio;
	}
}
