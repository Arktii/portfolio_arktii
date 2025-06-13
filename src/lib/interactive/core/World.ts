import { Vec2 } from '$lib/interactive/models/Vec2';
import { BoundingBox } from '../models/BoundingBox';

export class World {
	/**
	 * the world's origin relative to the canvas (in canvas coordinates)
	 */
	canvasOffset: Vec2 = Vec2.zero();
	#canvas: HTMLCanvasElement;

	canvasResizeRatio: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
	}

	/**
	 * resize a world size value for rendering on the canvas
	 */
	toCanvasSize(value: number): number {
		return value * this.canvasResizeRatio;
	}

	/**
	 * convert a world x-coordinate for rendering on the canvas
	 */
	toCanvasX(value: number): number {
		return value * this.canvasResizeRatio + this.canvasOffset.x;
	}

	/**
	 * conver a world y-coordinate for rendering on the canvas
	 */
	toCanvasY(value: number): number {
		return value * this.canvasResizeRatio + this.canvasOffset.y;
	}

	/**
	 * resize a canvas size value into a world value
	 */
	toWorldSize(value: number): number {
		return value / this.canvasResizeRatio;
	}

	/**
	 * convert a canvas x-coordinate into a world x-coordinate
	 */
	toWorldX(value: number): number {
		return (value - this.canvasOffset.x) / this.canvasResizeRatio;
	}

	/**
	 * convert a canvas y-coordinate into a world y-coordinate
	 */
	toWorldY(value: number): number {
		return (value - this.canvasOffset.y) / this.canvasResizeRatio;
	}

	/**
	 * covert a world point to a point relative to the actual document
	 */
	toAbsolute(point: Vec2): Vec2 {
		// relative to viewport
		const canvasRect = this.#canvas.getBoundingClientRect();

		const canvasX = this.toCanvasX(point.x);
		const canvasY = this.toCanvasY(point.y);

		const absoluteX = canvasRect.left + canvasX + window.scrollX;
		const absoluteY = canvasRect.top + canvasY + window.scrollY;

		return new Vec2(absoluteX, absoluteY);
	}

	/**
	 * convert a world point to a viewport point
	 */
	toViewport(point: Vec2): Vec2 {
		const canvasRect = this.#canvas.getBoundingClientRect();

		const canvasX = this.toCanvasX(point.x);
		const canvasY = this.toCanvasY(point.y);

		const viewPortX = canvasRect.left + canvasX;
		const viewPortY = canvasRect.top + canvasY;

		return new Vec2(viewPortX, viewPortY);
	}

	/**
	 * convert a viewport point to a world point
	 */
	viewportToWorld(point: Vec2): Vec2 {
		const canvasRect = this.#canvas.getBoundingClientRect();

		const canvasX = point.x - canvasRect.left;
		const canvasY = point.y - canvasRect.top;

		const worldX = this.toWorldX(canvasX);
		const worldY = this.toWorldY(canvasY);

		return new Vec2(worldX, worldY);
	}

	calculateViewportWorld(): BoundingBox {
		const viewportRect = this.#canvas.getBoundingClientRect();

		return new BoundingBox(
			this.toWorldX(-viewportRect.left),
			this.toWorldX(-viewportRect.left + window.innerWidth),
			this.toWorldY(-viewportRect.top),
			this.toWorldY(-viewportRect.top + window.innerHeight)
		);
	}

	/**
	 * Returns how far out of bounds an object is from the viewport.
	 *
	 * Results are in world coordinates
	 *
	 * For example, if an object's top exceeds the top of the viewport by 5, and its right exceeds the right by 2
	 * this will return Vec(2, -5).
	 *
	 * Calculating the correctional displacement would require flipping the sign
	 */
	calculateViewportOutOfBounds(worldAABB: BoundingBox): Vec2 {
		const viewportWorldRect = this.calculateViewportWorld();

		const left = viewportWorldRect.left - worldAABB.left;
		const right = worldAABB.right - viewportWorldRect.right;
		const top = viewportWorldRect.top - worldAABB.top;
		const bottom = worldAABB.bottom - viewportWorldRect.bottom;

		// discard negative out of bounds, since there are NOT out of bounds at all
		let xOutOfBounds = left > right ? -Math.max(0, left) : Math.max(0, right);
		let yOutOfBounds = top > bottom ? -Math.max(0, top) : Math.max(0, bottom);

		return new Vec2(xOutOfBounds, yOutOfBounds);
	}
}
