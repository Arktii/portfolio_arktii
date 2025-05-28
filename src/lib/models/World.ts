import type { Point } from './Point';

export class World {
	resizeRatio: number = 0;

	worldToCanvas(x: number, y: number): Point {
		return {
			x: x * this.resizeRatio,
			y: y * this.resizeRatio
		};
	}

	worldPointToCanvas(point: Point): Point {
		return {
			x: point.x * this.resizeRatio,
			y: point.y * this.resizeRatio
		};
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
