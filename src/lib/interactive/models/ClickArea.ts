import { INTERACTION } from '../constants';
import type { Context } from '../core/Context';
import type { BoundingBox } from './BoundingBox';

export class ClickArea {
	aabb: BoundingBox;
	hoverText: string;

	onClick?: () => void;

	constructor(aabb: BoundingBox, hoverText: string = '', onClick?: () => void) {
		this.aabb = aabb;

		this.onClick = onClick;
		this.hoverText = hoverText;
	}

	hover(context: Context) {
		// TODO: fire event via event bus so player can have thought bubble for hover text
		// TODO: handle highlighting

		console.log(this.hoverText);

		context.drawing
			.rect(
				this.aabb.left,
				this.aabb.top,
				this.aabb.right - this.aabb.left,
				this.aabb.bottom - this.aabb.top,
				0
			)
			.radius(1)
			.fillColor(context.p5.color(INTERACTION.FILL_COLOR))
			.stroke(context.p5.color(INTERACTION.STROKE_COLOR), INTERACTION.STROKE_WEIGHT)
			.glow(context.p5.color(INTERACTION.GLOW_COLOR), 25);
	}

	secondaryHover(context: Context) {
		context.drawing
			.rect(
				this.aabb.left,
				this.aabb.top,
				this.aabb.right - this.aabb.left,
				this.aabb.bottom - this.aabb.top,
				0
			)
			.radius(1)
			.fillColor(context.p5.color(INTERACTION.FILL_COLOR))
			.stroke(context.p5.color('rgb(61, 80, 133)'), 1.25)
			.glow(context.p5.color('rgba(245, 195, 139, 1)'), 12);
	}

	click() {
		console.log('CLICK');
		if (this.onClick) {
			this.onClick();
		}
	}
}
