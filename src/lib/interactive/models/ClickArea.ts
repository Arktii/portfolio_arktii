import { INTERACTION, INTERACTION_DISPLAY, PLAYER } from '../constants';
import type { Context } from '../core/Context';
import type { BoundingBox } from './BoundingBox';

export class ClickArea {
	aabb: BoundingBox;
	#mainText: string;
	#secondaryText: string;

	#mainAction?: (context: Context) => void;
	#secondaryAction?: (context: Context) => void;

	constructor(
		aabb: BoundingBox,
		mainText: string = '',
		mainAction?: (context: Context) => void,
		secondaryText: string = '',
		secondaryAction?: (context: Context) => void
	) {
		this.aabb = aabb;

		this.#mainAction = mainAction;
		this.#secondaryAction = secondaryAction;
		this.#mainText = mainText;
		this.#secondaryText = secondaryText;
	}

	primaryHover(context: Context) {
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

	playerHover(context: Context) {
		context.drawing
			.iconText(
				context.player.position.x,
				context.player.position.y - PLAYER.HEIGHT,
				PLAYER.SPRITE_WIDTH,
				PLAYER.HEIGHT,
				context.preloads.image('keyE'),
				INTERACTION_DISPLAY.WIDTH,
				INTERACTION_DISPLAY.HEIGHT,
				this.#mainText,
				5,
				INTERACTION_DISPLAY.PLAYER_HOVER_Z_INDEX
			)
			.font(context.preloads.font('Aldrich'))
			.textColor(context.p5.color('rgb(255, 255, 255)'))
			.stroke(context.p5.color('rgb(0, 0, 0)'), 1)
			.xAlign('left');

		if (this.#secondaryAction) {
			context.drawing
				.iconText(
					context.player.position.x,
					context.player.position.y - PLAYER.HEIGHT - INTERACTION_DISPLAY.MULTIPLE_OPTIONS_GAP,
					PLAYER.SPRITE_WIDTH,
					PLAYER.HEIGHT,
					context.preloads.image('keyQ'),
					INTERACTION_DISPLAY.WIDTH,
					INTERACTION_DISPLAY.HEIGHT,
					this.#secondaryText,
					5,
					INTERACTION_DISPLAY.PLAYER_HOVER_Z_INDEX
				)
				.font(context.preloads.font('Aldrich'))
				.textColor(context.p5.color('rgb(255, 255, 255)'))
				.stroke(context.p5.color('rgb(0, 0, 0)'), 1)
				.xAlign('left');
		}
	}

	mouseHover(context: Context) {
		const width = this.aabb.right - this.aabb.left;
		const height = this.aabb.bottom - this.aabb.top;

		let mainY = this.aabb.top;
		if (this.#secondaryAction) {
			mainY = this.aabb.top - INTERACTION_DISPLAY.MULTIPLE_OPTIONS_GAP / 2;
		}

		context.drawing
			.iconText(
				this.aabb.left,
				mainY,
				width,
				height,
				context.preloads.image('mouse1'),
				INTERACTION_DISPLAY.WIDTH,
				INTERACTION_DISPLAY.HEIGHT,
				this.#mainText,
				INTERACTION_DISPLAY.FONT_SIZE,
				INTERACTION_DISPLAY.MOUSE_HOVER_Z_INDEX
			)
			.font(context.preloads.font('Aldrich'))
			.textColor(context.p5.color(INTERACTION_DISPLAY.TEXT_COLOR))
			.stroke(
				context.p5.color(INTERACTION_DISPLAY.OUTLINE_COLOR),
				INTERACTION_DISPLAY.OUTLINE_WEIGHT
			);

		if (this.#secondaryAction) {
			context.drawing
				.iconText(
					this.aabb.left,
					mainY + INTERACTION_DISPLAY.MULTIPLE_OPTIONS_GAP,
					width,
					height,
					context.preloads.image('mouse2'),
					INTERACTION_DISPLAY.WIDTH,
					INTERACTION_DISPLAY.HEIGHT,
					this.#secondaryText,
					INTERACTION_DISPLAY.FONT_SIZE,
					INTERACTION_DISPLAY.PLAYER_HOVER_Z_INDEX
				)
				.font(context.preloads.font('Aldrich'))
				.textColor(context.p5.color('rgb(255, 255, 255)'))
				.stroke(context.p5.color('rgb(0, 0, 0)'), INTERACTION_DISPLAY.OUTLINE_WEIGHT);
		}
	}

	mainInteract(context: Context) {
		if (this.#mainAction) {
			this.#mainAction(context);
		}
	}

	secondaryInteract(context: Context) {
		if (this.#secondaryAction) {
			this.#secondaryAction(context);
		}
	}
}
