import { PriorityQueue } from '$lib/collections/PriorityQueue';
import { Curve, Drawable, GridRectangle, IconText, Img, Rectangle, Text } from '../models/Drawable';
import type { Context } from './Context';

/**
 * helps draw world items on the canvas with proper scaling.
 * for consistent results, the drawing functions should only be called in the fixedUpdate loop
 */
export class Drawing {
	#renderQueue: PriorityQueue<Drawable>;

	constructor() {
		this.#renderQueue = new PriorityQueue<Drawable>();
	}

	emptyQueue() {
		this.#renderQueue.clear();
	}

	render(context: Context) {
		context.p5.clear();

		while (this.#renderQueue.isNotEmpty()) {
			let nextDrawing = this.#renderQueue.pop();
			nextDrawing?.draw(context);
		}
	}

	image(
		image: any,
		x: number,
		y: number,
		width: number,
		height: number,
		flipX = false,
		zIndex: number = 0
	) {
		this.#renderQueue.insert(
			new Img(image, x, y, width, height, flipX, zIndex, this.#renderQueue.size)
		);
	}

	rect(x: number, y: number, width: number, height: number, zIndex: number = 0): Rectangle {
		let rectangle = new Rectangle(x, y, width, height, zIndex, this.#renderQueue.size);
		this.#renderQueue.insert(rectangle);

		return rectangle;
	}

	gridRect(x: number, y: number, width: number, height: number, zIndex: number = 0) {
		this.#renderQueue.insert(
			new GridRectangle(x, y, width, height, zIndex, this.#renderQueue.size)
		);
	}

	text(x: number, y: number, text: string, fontSize: number, zIndex: number = 0): Text {
		let newText = new Text(x, y, text, fontSize, zIndex, this.#renderQueue.size);
		this.#renderQueue.insert(newText);

		return newText;
	}

	curve(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number,
		zIndex: number = 0
	) {
		let drawable = new Curve(x1, y1, x2, y2, x3, y3, x4, y4, zIndex, this.#renderQueue.size);
		this.#renderQueue.insert(drawable);

		return drawable;
	}

	iconText(
		x: number,
		y: number,
		width: number,
		height: number,
		icon: import('p5').Image,
		iconWidth: number,
		iconHeight: number,
		text: string,
		fontSize: number,
		zIndex: number
	) {
		let toDraw = new IconText(
			x,
			y,
			width,
			height,
			icon,
			iconWidth,
			iconHeight,
			text,
			fontSize,
			zIndex,
			this.#renderQueue.size
		);

		this.#renderQueue.insert(toDraw);

		return toDraw;
	}
}
