import { clamp } from '$lib/utils/Math';
import type { Context } from '../core/Context';
import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

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
	protected intensity: number = 1;

	glow(color: import('p5').Color, blurriness: number = 20, intensity: number = 1): this {
		this.glowColor = color;
		this.blur = blurriness;
		this.intensity = intensity;

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

		let x = context.world.toCanvas(this.#x);
		let y = context.world.toCanvas(this.#y);
		let width = context.world.toCanvas(this.#width);
		let height = context.world.toCanvas(this.#height);
		let borderRadius = context.world.toCanvas(this.#borderRadius);

		for (let i = 0; i < this.intensity; i++) {
			context.p5.rect(x, y, width, height, borderRadius);
		}

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

export class Curve extends Drawable {
	#x1: number;
	#y1: number;
	#x2: number;
	#y2: number;
	#x3: number;
	#y3: number;
	#x4: number;
	#y4: number;

	#color?: import('p5').Color;
	#weight?: number;

	constructor(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number,
		zIndex: number = 0,
		callOrder: number
	) {
		super(zIndex, callOrder);

		this.#x1 = x1;
		this.#y1 = y1;

		this.#x2 = x2;
		this.#y2 = y2;

		this.#x3 = x3;
		this.#y3 = y3;

		this.#x4 = x4;
		this.#y4 = y4;
	}

	stroke(color?: import('p5').Color, weight?: number): this {
		this.#color = color;
		this.#weight = weight;

		return this;
	}

	draw(context: Context): void {
		context.p5.push();

		context.p5.noFill();

		if (this.#color) {
			context.p5.stroke(this.#color);
		}

		if (this.#weight) {
			context.p5.strokeWeight(this.#weight);
		}

		context.p5.bezier(
			context.world.toCanvas(this.#x1),
			context.world.toCanvas(this.#y1),
			context.world.toCanvas(this.#x2),
			context.world.toCanvas(this.#y2),
			context.world.toCanvas(this.#x3),
			context.world.toCanvas(this.#y3),
			context.world.toCanvas(this.#x4),
			context.world.toCanvas(this.#y4)
		);

		context.p5.pop();
	}
}

//! INCOMPLETE
export class Tail extends Drawable {
	#point: Vec2;
	#width: number;
	/**
	 * the box the tail is connected to
	 */
	#box: BoundingBox;

	constructor(point: Vec2, box: BoundingBox, width: number, zIndex: number, callOrder: number) {
		super(zIndex, callOrder);

		this.#point = point;
		this.#box = box;
		this.#width = width;
	}

	draw(context: Context): void {
		let p5 = context.p5;

		let point = new Vec2(
			context.world.toCanvas(this.#point.x),
			context.world.toCanvas(this.#point.y)
		);
		let box = new BoundingBox(
			context.world.toCanvas(this.#box.left),
			context.world.toCanvas(this.#box.right),
			context.world.toCanvas(this.#box.top),
			context.world.toCanvas(this.#box.bottom)
		);
		let width = context.world.toCanvas(this.#width);

		p5.push();

		p5.beginShape();
		p5.vertex(point.x, point.y);
		p5.vertex(
			box.left + width,
			box.bottom // End point
		);
		p5.vertex(box.left, box.bottom);
		p5.endShape();

		p5.pop();
	}
}
