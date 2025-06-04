import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

export class Shovable {
	position: Vec2;
	width: number;
	height: number;
	image: import('p5').Image;
	yVelocity: number = 0;
	falling: boolean = false;

	constructor(position: Vec2, width: number, height: number, image: import('p5').Image) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.image = image;
	}

	calculateAABB(): BoundingBox {
		return BoundingBox.fromRect(this.position.x, this.position.y, this.width, this.height);
	}

	break(): void {
		console.log('BROKEN');
	}
}
