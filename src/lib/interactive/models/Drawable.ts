import type { Context } from '../core/Context';

export abstract class Drawable implements Ord {
	callOrder: number;
	zIndex: number;

	constructor(zIndex: number = 0, callOrder: number) {
		this.zIndex = zIndex;
		this.callOrder = callOrder;
	}

	lessThan(other: this): boolean {
		if (this.zIndex === other.zIndex) {
			return this.callOrder < other.callOrder;
		} else {
			return this.zIndex < other.zIndex;
		}
	}
	greaterThan(other: this): boolean {
		if (this.zIndex === other.zIndex) {
			return this.callOrder > other.callOrder;
		} else {
			return this.zIndex > other.zIndex;
		}
	}
	equalTo(other: this): boolean {
		return this.zIndex === other.zIndex && this.callOrder === other.callOrder;
	}

	abstract draw(context: Context): void;
}

export abstract class Glowable extends Drawable {
	protected glowColor?: import('p5').Color;
	protected blur: number = 20;

	glow(color: import('p5').Color, blurriness: number = 20): this {
		this.glowColor = color;
		this.blur = blurriness;

		return this;
	}

	/**
	 * should be called by children to setup the glow
	 */
	protected addGlow(p5: import('p5')) {
		p5.drawingContext.shadowBlur = this.blur;
		p5.drawingContext.shadowColor = this.glowColor;
	}
}

export class Rectangle extends Glowable {
	#x: number;
	#y: number;
	#width: number;
	#height: number;
	#color?: import('p5').Color;
	#strokeColor?: import('p5').Color;
	#strokeWeight?: number;
	#borderRadius: number = 0;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		zIndex: number,
		callOrder: number
	) {
		super(zIndex, callOrder);

		this.#x = x;
		this.#y = y;
		this.#width = width;
		this.#height = height;
	}

	radius(r: number): this {
		this.#borderRadius = r;
		return this;
	}

	stroke(color?: import('p5').Color, weight?: number): this {
		this.#strokeColor = color;
		this.#strokeWeight = weight;
		return this;
	}

	fillColor(color: import('p5').Color): this {
		this.#color = color;
		return this;
	}

	draw(context: Context): void {
		context.p5.push();

		if (this.#strokeColor) {
			context.p5.stroke(this.#strokeColor);
		}

		if (this.#strokeWeight !== undefined) {
			context.p5.strokeWeight(context.world.toCanvas(this.#strokeWeight));
		}

		if (this.#color) {
			context.p5.fill(this.#color);
		}

		if (this.glowColor) {
			this.addGlow(context.p5);
		}

		context.p5.rect(
			context.world.toCanvas(this.#x),
			context.world.toCanvas(this.#y),
			context.world.toCanvas(this.#width),
			context.world.toCanvas(this.#height),
			context.world.toCanvas(this.#borderRadius)
		);

		context.p5.pop();
	}
}

export class Img extends Drawable {
	image: any;
	x: number;
	y: number;
	width: number;
	height: number;
	flipX: boolean;

	constructor(
		image: any,
		x: number,
		y: number,
		width: number,
		height: number,
		flipX: boolean,
		zIndex: number,
		callOrder: number
	) {
		super(zIndex, callOrder);
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.flipX = flipX;
	}

	draw(context: Context): void {
		let world = context.world;

		context.p5.push();
		context.p5.scale(this.flipX ? -1 : 1, 1);

		let xDirection = this.flipX ? -1 : 1;
		let addX = this.flipX ? -this.width : 0;

		context.p5.image(
			this.image,
			world.toCanvas(this.x * xDirection + addX),
			world.toCanvas(this.y),
			world.toCanvas(this.width),
			world.toCanvas(this.height)
		);

		context.p5.pop();
	}
}

export class GridRectangle extends Drawable {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		zIndex: number,
		callorder: number
	) {
		super(zIndex, callorder);

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw(context: Context): void {
		let canvasCellSize = context.world.toCanvas(context.colSpace.cellSize);

		context.p5.rect(
			this.x * canvasCellSize,
			this.y * canvasCellSize,
			this.width * canvasCellSize,
			this.height * canvasCellSize
		);
	}
}

export class Text extends Drawable {
	#x: number;
	#y: number;
	#width?: number;
	#height?: number;
	#color?: import('p5').Color;
	#text: string;
	#fontSize: number;
	#horizontalAlign?: import('p5').HORIZ_ALIGN;
	#verticalAlign?: import('p5').VERT_ALIGN;

	constructor(
		x: number,
		y: number,
		text: string,
		fontSize: number = 10,
		zIndex: number,
		callOrder: number
	) {
		super(zIndex, callOrder);

		this.#x = x;
		this.#y = y;
		this.#text = text;
		this.#fontSize = fontSize;
	}

	width(width: number): this {
		this.#width = width;

		return this;
	}

	height(height: number): this {
		this.#height = height;

		return this;
	}

	textAlign(horizontal?: import('p5').HORIZ_ALIGN, vertical?: import('p5').VERT_ALIGN): this {
		this.#horizontalAlign = horizontal;
		this.#verticalAlign = vertical;

		return this;
	}

	textColor(color: import('p5').Color) {
		this.#color = color;
	}

	draw(context: Context): void {
		context.p5.push();
		context.p5.textSize(context.world.toCanvas(this.#fontSize));
		context.p5.textAlign(
			this.#horizontalAlign ?? context.p5.CENTER,
			this.#verticalAlign ?? context.p5.CENTER
		);

		if (this.#color) {
			context.p5.fill(this.#color);
		}

		if (this.#width) {
			context.p5.textWrap(context.p5.WORD);
		}

		context.p5.text(
			this.#text,
			context.world.toCanvas(this.#x),
			context.world.toCanvas(this.#y),
			this.#width ? context.world.toCanvas(this.#width) : undefined,
			this.#height ? context.world.toCanvas(this.#height) : undefined
		);

		context.p5.pop();
	}
}
