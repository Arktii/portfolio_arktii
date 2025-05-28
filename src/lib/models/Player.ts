import type { Point } from './Point';

export class Player {
	position: Point;

	constructor(position: Point) {
		this.position = position;
	}
}
