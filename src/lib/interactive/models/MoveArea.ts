import { BoundingBox } from './BoundingBox';
import type { Vec2 } from './Vec2';

export class MoveArea {
	start: Vec2;
	end: Vec2;
	downTarget: Vec2 | undefined;
	upTarget: Vec2 | undefined;

	aabb: BoundingBox;

	constructor(
		cellSize: number,
		start: Vec2,
		end: Vec2,
		downTarget: Vec2 | undefined = undefined,
		upTarget: Vec2 | undefined = undefined
	) {
		this.start = start;
		this.end = end;
		this.downTarget = downTarget;
		this.upTarget = upTarget;

		this.aabb = BoundingBox.fromGrid(this.start.x, this.start.y, this.end.x, this.end.y, cellSize);
	}
}
