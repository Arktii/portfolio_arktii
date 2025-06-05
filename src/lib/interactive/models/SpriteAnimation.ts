import type { Context } from '../core/Context';
import type { Vec2 } from './Vec2';

export class SpriteAnimation {
	currentFrame: number = 0;

	#frames: any[] = [];
	#elapsed: number = 0;
	#finished: boolean = false;

	constructor(
		spriteSheet: import('p5').Image,
		public cellWidth: number,
		public cellHeight: number,
		public columns: number,
		public rows: number,
		public frameCount: number,
		public frameDuration: number
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

	get finished(): boolean {
		return this.#finished;
	}

	reset() {
		this.currentFrame = 0;
		this.#elapsed = 0;
		this.#finished = false;
	}

	update(deltaSecs: number) {
		this.#elapsed += deltaSecs;

		if (this.#elapsed > this.frameDuration) {
			this.currentFrame += 1;
			this.#elapsed %= this.frameDuration;

			if (this.currentFrame >= this.frameCount) {
				this.#finished = true;
				this.currentFrame = 0;
			}
		}
	}

	draw(context: Context, position: Vec2, flipX: boolean = false, zIndex: number) {
		context.drawing.image(
			this.#frames[this.currentFrame],
			position.x,
			position.y,
			this.cellWidth,
			this.cellHeight,
			flipX,
			zIndex
		);
	}
}
