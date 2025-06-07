import { INTERACTION } from '../constants';
import type { Context } from '../core/Context';
import type { BoundingBox } from './BoundingBox';
import { WordBubble, WordBubbleType } from './WordBubble';

export class ClickArea {
	aabb: BoundingBox;
	hoverText: string;

	onClick?: (context: Context) => void;

	constructor(aabb: BoundingBox, hoverText: string = '', onClick?: (context: Context) => void) {
		this.aabb = aabb;

		this.onClick = onClick;
		this.hoverText = hoverText;
	}

	startHover(context: Context) {
		context.eventBus.publish(
			'wordBubble',
			context,
			new WordBubble(WordBubbleType.THOUGHT, this.hoverText, INTERACTION.THOUGHT_BUBBLE_DURATION, 0)
		);
	}

	hover(context: Context) {
		context.drawing
			.rect(
				this.aabb.left,
				this.aabb.top,
				this.aabb.right - this.aabb.left,
				this.aabb.bottom - this.aabb.top,
				INTERACTION.Z_INDEX
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
				INTERACTION.Z_INDEX
			)
			.radius(1)
			.fillColor(context.p5.color(INTERACTION.FILL_COLOR))
			.stroke(context.p5.color('rgb(61, 80, 133)'), 1.25)
			.glow(context.p5.color('rgba(245, 195, 139, 1)'), 12);
	}

	click(context: Context) {
		console.log('CLICK');
		if (this.onClick) {
			this.onClick(context);
		}
	}
}
