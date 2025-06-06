import type { Context } from '../core/Context';
import { BoundingBox } from './BoundingBox';
import type { ClickArea } from './ClickArea';

export class InteractArea {
	aabb: BoundingBox;

	clickArea?: ClickArea;

	onClick?: (context: Context) => void; // optional, because if a clickable area is available, that function can be used instead
	whileInside?: () => void;

	constructor(
		cellSize: number,
		xStart: number,
		xEnd: number,
		y: number,
		clickArea?: ClickArea,
		onClick?: (context: Context) => void,
		whileInside?: () => void
	) {
		this.clickArea = clickArea;
		this.onClick = onClick;
		this.whileInside = whileInside;

		this.aabb = BoundingBox.fromGrid(xStart, y, xEnd, y, cellSize);
	}
}
