import { TV } from '../constants';
import type { Context } from '../core/Context';
import type { Rect } from './Rect';
import type { TvDisplay } from './TvDisplay';

export class TvScreen {
	#duration: number; // the duration for each image

	#displays: TvDisplay[] = [];
	#imagesToLoad: string[] = [];
	#images: import('p5').Image[] = [];

	anchorIndex: number = 0;
	#elapsed: number = 0;

	constructor(displays: TvDisplay[], imagesToLoad: string[], duration: number) {
		this.#displays = displays;
		this.#imagesToLoad = imagesToLoad;
		this.#duration = duration;
	}

	async setup(context: Context) {
		for (let i = 0; i < this.#imagesToLoad.length; i++) {
			this.#images.push(await context.p5.loadImage(this.#imagesToLoad[i]));
		}
	}

	update(context: Context, deltaSecs: number) {
		this.#elapsed += deltaSecs;

		if (this.#elapsed > this.#duration) {
			this.#elapsed -= this.#duration;
			this.anchorIndex = (this.anchorIndex + 1) % this.#images.length;
		}

		for (let i = 0; i < this.#displays.length; i++) {
			let imageIndex = (this.anchorIndex + i) % this.#images.length;

			this.show(context, this.#displays[i], imageIndex);
		}
	}

	private show(context: Context, display: TvDisplay, imageIndex: number) {
		context.drawing.image(
			this.#images[imageIndex],
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

	next() {
		this.anchorIndex = (this.anchorIndex + 1) % this.#images.length;
		this.#elapsed = 0;
	}
}
