import type { Context } from '../core/Context';
import type { SpriteAnimation } from './SpriteAnimation';
import { Vec2 } from './Vec2';

export class AnimatedSprite {
	position: Vec2;
	drawOffset: Vec2;
	flipX: boolean = false;

	#animations: { [name: string]: SpriteAnimation } = {};

	#currentAnimationName?: string;
	#currentAnimation?: SpriteAnimation;

	constructor(position: Vec2, drawOffset: Vec2 = Vec2.zero()) {
		this.position = position;
		this.drawOffset = drawOffset;
	}

	addAnim(name: string, animation: SpriteAnimation): AnimatedSprite {
		this.#animations[name] = animation;
		return this;
	}

	update(deltaSecs: number) {
		this.#currentAnimation?.update(deltaSecs);
	}

	play(name: string) {
		if (!this.#currentAnimationName || this.#currentAnimationName !== name) {
			this.#currentAnimationName = name;
			this.#currentAnimation = this.#animations[name];
			this.#currentAnimation.reset();
		}
	}

	draw(context: Context) {
		this.#currentAnimation?.draw(context, Vec2.add(this.position, this.drawOffset), this.flipX);
	}
}
