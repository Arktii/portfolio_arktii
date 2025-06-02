import type { World } from './World';

/**
 * helps draw world items on the canvas with proper scaling
 */
export class Drawing {
	#p5: import('p5');
	#world: World;

	constructor(p5: import('p5'), world: World) {
		this.#p5 = p5;
		this.#world = world;
	}

	image(image: any, x: number, y: number, width: number, height: number, flipX = false) {
		this.#p5.push();
		this.#p5.scale(flipX ? -1 : 1, 1);

        let xDirection = flipX ? -1 : 1;
		let addX = flipX ? -width : 0;

		this.#p5.image(
			image,
			this.#world.toCanvas(x * xDirection + addX),
			this.#world.toCanvas(y),
			this.#world.toCanvas(width),
			this.#world.toCanvas(height)
		);
		this.#p5.pop();
	}

	rect(x: number, y: number, width: number, height: number) {
		this.#p5.rect(
			this.#world.toCanvas(x),
			this.#world.toCanvas(y),
			this.#world.toCanvas(width),
			this.#world.toCanvas(height)
		);
	}

	// TODO?: store colspace in Drawing class
	gridRect(x: number, y: number, width: number, height: number, cellSize: number) {
		let canvasCellSize = this.#world.toCanvas(cellSize);
		this.#p5.rect(
			x * canvasCellSize,
			y * canvasCellSize,
			width * canvasCellSize,
			height * canvasCellSize
		);
	}
}
