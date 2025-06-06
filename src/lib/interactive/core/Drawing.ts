import { PriorityQueue } from '$lib/collections/PriorityQueue';
import { Drawable, GridRectangle, Img, Rectangle, Text } from '../models/Drawable';
import type { Context } from './Context';

/**
 * helps draw world items on the canvas with proper scaling
 */
export class Drawing {
	#renderQueue: PriorityQueue<Drawable>;

	constructor() {
		this.#renderQueue = new PriorityQueue<Drawable>();
	}

	render(context: Context) {
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
}
