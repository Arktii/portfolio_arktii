import { BoundingBox } from './BoundingBox';
import { Vec2 } from './Vec2';

export class MoveArea {
	start: Vec2;
	end: Vec2;
	downTarget?: Vec2;
	upTarget?: Vec2;

	aabb: BoundingBox;

	constructor(
		cellSize: number,
		start: Vec2,
		end: Vec2,
		downGridTarget: Vec2 | undefined = undefined,
		upGridTarget: Vec2 | undefined = undefined
	) {
		this.start = start;
		this.end = end;

		if (downGridTarget) {
			this.downTarget = Vec2.multiply(downGridTarget, cellSize);
		}
		if (upGridTarget) {
			this.upTarget = Vec2.multiply(upGridTarget, cellSize);
		}

		this.aabb = BoundingBox.fromGrid(this.start.x, this.start.y, this.end.x, this.end.y, cellSize);
	}
}
