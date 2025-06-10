import { Vec2 } from '$lib/interactive/models/Vec2';
import { BoundingBox } from '../models/BoundingBox';

export class World {
	#canvas: HTMLCanvasElement;
	canvasResizeRatio: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
	}

	/**
	 * resize a world value for rendering on the canvas
	 */
	toCanvas(value: number): number {
		return value * this.canvasResizeRatio;
	}

	/**
	 * convert a canvas value into a world value
	 */
	toWorld(value: number): number {
		return value / this.canvasResizeRatio;
	}

	/**
	 * covert a world point to a point relative to the actual document
	 */
	toAbsolute(point: Vec2): Vec2 {
		// relative to viewport
		const canvasRect = this.#canvas.getBoundingClientRect();

		const canvasX = this.toCanvas(point.x);
		const canvasY = this.toCanvas(point.y);

		const absoluteX = canvasRect.left + canvasX + window.scrollX;
		const absoluteY = canvasRect.top + canvasY + window.scrollY;

		return new Vec2(absoluteX, absoluteY);
	}

	/**
	 * convert a world point to a viewport point
	 */
	toViewport(point: Vec2): Vec2 {
		const canvasRect = this.#canvas.getBoundingClientRect();

		const canvasX = this.toCanvas(point.x);
		const canvasY = this.toCanvas(point.y);

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

		const worldX = this.toWorld(canvasX);
		const worldY = this.toWorld(canvasY);

		return new Vec2(worldX, worldY);
	}

	calculateViewportWorld(): BoundingBox {
		const viewportRect = this.#canvas.getBoundingClientRect();

		return new BoundingBox(
			this.toWorld(-viewportRect.left),
			this.toWorld(-viewportRect.left + window.innerWidth),
			this.toWorld(-viewportRect.top),
			this.toWorld(-viewportRect.top + window.innerHeight)
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
