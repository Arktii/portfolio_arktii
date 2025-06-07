import type { Context } from '../core/Context';
import type { SpriteAnimation } from './SpriteAnimation';
import { Vec2 } from './Vec2';

export class AnimatedSprite {
	position: Vec2;
	drawOffset: Vec2;
	flipX: boolean = false;
	zIndex: number;

	#animations: { [name: string]: SpriteAnimation } = {};

	#queue: string[] = [];

	#currentAnimationName?: string;
	#currentAnimation?: SpriteAnimation;

	constructor(position: Vec2, drawOffset: Vec2 = Vec2.zero(), zIndex: number = 0) {
		this.position = position;
		this.drawOffset = drawOffset;
		this.zIndex = zIndex;
	}

	get queueLength(): number {
		return this.#queue.length;
	}

	get finished(): boolean {
		return this.#currentAnimation?.finished ?? false;
	}

	addAnim(name: string, animation: SpriteAnimation): AnimatedSprite {
		this.#animations[name] = animation;
		return this;
	}

	update(deltaSecs: number) {
		this.#currentAnimation?.update(deltaSecs);

		if (this.#currentAnimation?.finished && this.#queue.length > 0) {
			let next = this.#queue.splice(0, 1)[0];
			this.play(next);
		}
	}

	clearQueue() {
		this.#queue = [];
	}

	enqueue(name: string) {
		this.#queue.push(name);
	}

	play(name: string) {
		if (!this.#currentAnimationName || this.#currentAnimationName !== name) {
			this.#currentAnimationName = name;
			this.#currentAnimation = this.#animations[name];
			this.#currentAnimation.reset();
		}
	}

	draw(context: Context) {
		this.#currentAnimation?.draw(
			context,
			Vec2.add(this.position, this.drawOffset),
			this.flipX,
			this.zIndex
		);
	}
}
