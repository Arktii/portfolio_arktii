import { INTERACTION, TV } from '../constants';
import type { Context } from '../core/Context';
import type { Rect } from './Rect';
import type { TvDisplay } from './TvDisplay';
import { TvImage, type TvImageInfo } from './TvImage';
import { WordBubble, WordBubbleType } from './WordBubble';

export class TvScreen {
	#duration: number; // the duration for each image

	#displays: TvDisplay[] = [];
	#imagesToLoad: TvImageInfo[] = [];
	tvImages: TvImage[] = [];

	anchorIndex: number = 0;
	#elapsed: number = 0;

	constructor(displays: TvDisplay[], imagesToLoad: TvImageInfo[], duration: number) {
		this.#displays = displays;
		this.#imagesToLoad = imagesToLoad;
		this.#duration = duration;
	}

	async setup(context: Context) {
		context.eventBus.subscribe('tvClick', this.onTvClick.bind(this));

		for (let i = 0; i < this.#imagesToLoad.length; i++) {
			this.tvImages.push(
				new TvImage(
					await context.p5.loadImage(this.#imagesToLoad[i].imagePath),
					this.#imagesToLoad[i].hoverText
				)
			);
		}
	}

	update(context: Context, deltaSecs: number) {
		this.#elapsed += deltaSecs;

		if (this.#elapsed > this.#duration) {
			this.#elapsed -= this.#duration;
			this.anchorIndex = (this.anchorIndex + 1) % this.tvImages.length;
		}

		for (let i = 0; i < this.#displays.length; i++) {
			let imageIndex = this.imageIndex(i);

			this.show(context, this.#displays[i], imageIndex);
		}
	}

	private imageIndex(displayIndex: number) {
		return (this.anchorIndex + displayIndex) % this.tvImages.length;
	}

	private show(context: Context, display: TvDisplay, imageIndex: number) {
		context.drawing.image(
			this.tvImages[imageIndex].image,
			display.x,
			display.y,
			display.width,
			display.height,
			false,
			TV.IMAGE_Z_INDEX
		);

		let glowX = display.x - display.glowGrow;
		let glowY = display.y - display.glowGrow;
		let glowWidth = display.width + display.doubleGrowGlow;
		let glowHeight = display.height + display.doubleGrowGlow;

		context.drawing
			.rect(glowX, glowY, glowWidth, glowHeight, TV.BG_GLOW_INDEX)
			.fillColor(context.p5.color(TV.BG_FILL_COLOR))
			.stroke(context.p5.color(TV.STROKE_COLOR), 0)
			.glow(context.p5.color(TV.GLOW_COLOR), TV.GLOW_BLUR);

		context.drawing
			.rect(glowX, glowY, glowWidth, glowHeight, TV.FRONT_GLOW_Z_INDEX)
			.fillColor(context.p5.color(TV.FG_FILL_COLOR))
			.stroke(context.p5.color(TV.STROKE_COLOR), 0)
			.glow(context.p5.color(TV.GLOW_COLOR), TV.GLOW_BLUR);
	}

	onTvClick(context: Context, id: number) {
		for (let i = 0; i < this.#displays.length; i++) {
			if (this.#displays[i].id == id) {
				let tvImage = this.tvImages[this.imageIndex(i)];

				context.eventBus.publish(
					'wordBubble',
					context,
					new WordBubble(
						WordBubbleType.SPEECH,
						tvImage.hoverText,
						INTERACTION.SPEECH_BUBBLE_DURATION,
						1
					)
				);
				console.log(tvImage.hoverText);
				break;
			}
		}
	}

	next() {
		this.anchorIndex = (this.anchorIndex + 1) % this.tvImages.length;
		this.#elapsed = 0;
	}
}
