import type { Context } from '../core/Context';
import type { Vec2 } from './Vec2';

export class SpriteAnimation {
	currentFrame: number = 0;

	#frames: any[] = [];
	#elapsed: number = 0;

	constructor(
		spriteSheet: import('p5').Image,
		public cellWidth: number,
		public cellHeight: number,
		public columns: number,
		public rows: number,
		public frameCount: number,
		public frameDuration: number,
		public zIndex: number
	) {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				let img = spriteSheet.get(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
				this.#frames.push(img);

				frameCount--;
				if (frameCount === 0) {
					break;
				}
			}
		}
	}

	reset() {
		this.currentFrame = 0;
		this.#elapsed = 0;
	}

	update(deltaSecs: number) {
		this.#elapsed += deltaSecs;

		if (this.#elapsed > this.frameDuration) {
			this.currentFrame = (this.currentFrame + 1) % this.frameCount;
			this.#elapsed %= this.frameDuration;
		}
	}

	draw(context: Context, position: Vec2, flipX: boolean = false) {
		context.drawing.image(
			this.#frames[this.currentFrame],
			position.x,
			position.y,
			this.cellWidth,
			this.cellHeight,
			flipX,
			this.zIndex
		);
	}
}
