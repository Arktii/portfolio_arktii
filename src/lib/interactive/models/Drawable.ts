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

export class Rectangle extends Drawable {
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
		callOrder: number
	) {
		super(zIndex, callOrder);

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw(context: Context): void {
		let world = context.world;

		context.p5.rect(
			world.toCanvas(this.x),
			world.toCanvas(this.y),
			world.toCanvas(this.width),
			world.toCanvas(this.height)
		);
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
