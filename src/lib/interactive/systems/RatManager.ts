import { FIXED_DELTA_SECS, RAT } from '../constants';
import { Context } from '../core/Context';
import { AnimatedSprite } from '../models/AnimatedSprite';
import { Rat } from '../models/Rat';
import { SpriteAnimation } from '../models/SpriteAnimation';
import { Vec2 } from '../models/Vec2';
import { WordBubble } from '../models/WordBubble';

export class RatManager {
	#rats: Rat[] = [];
	#particles: AnimatedSprite[] = [];

	async setup(context: Context) {
		context.eventBus.subscribe('ratRequested', this.addRat.bind(this));

		this.addRat(context, context.preloads.image('ratUnity'), false);
		this.addRat(context, context.preloads.image('ratGodot'), false);
		this.addRat(context, context.preloads.image('ratBevy'), false);
	}

	fixedUpdate(context: Context) {
		for (let i = this.#rats.length - 1; i >= 0; i--) {
			if (!this.#rats[i].captured) {
				this.#rats[i].fixedUpdate(context);
			} else {
				const rat = this.#rats[i];
				this.#rats.splice(i, 1);

				let text;
				if (this.#rats.length > 0) {
					const s = this.#rats.length == 1 ? '' : 's';
					text = `Nice Catch! ${this.#rats.length} rat${s} left.`;
				} else {
					text = `All rats caught. Well done!`;
				}

				context.eventBus.publish(
					'wordBubble',
					context,
					new WordBubble(text, 'word', RAT.SPEECH_BUBBLE_DURATION, RAT.SPEECH_BUBBLE_PRIORITY)
				);

				this.playCaughtParticles(context, rat.position);
			}
		}

		for (let i = this.#particles.length - 1; i >= 0; i--) {
			let animated = this.#particles[i];

			animated.update(FIXED_DELTA_SECS);
			animated.draw(context);

			if (animated.finished) {
				this.#particles.splice(i, 1);
			}
		}
	}

	addRat(context: Context, sprite: import('p5').Image, sendWordBubble: boolean = true) {
		if (this.#rats.length < RAT.MAX_RATS) {
			let moveArea;
			// prevent spawning rat on player
			do {
				moveArea = context.moveAreaManager.getRandomArea();
			} while (context.player.calculateAABB().colliding(moveArea.aabb));

			const position = new Vec2(moveArea.aabb.left, moveArea.aabb.bottom - RAT.HEIGHT);

			this.#rats.push(new Rat(position, sprite));

			this.playSpawnParticles(context, position);

			if (sendWordBubble) {
				const isAre = this.#rats.length == 1 ? 'is' : 'are';
				const s = this.#rats.length == 1 ? '' : 's';

				context.eventBus.publish(
					'wordBubble',
					context,
					new WordBubble(
						`Rat spawned somewhere.\nGo catch it!\n(there ${isAre} ${this.#rats.length} rat${s})`,
						'word',
						RAT.SPEECH_BUBBLE_DURATION,
						RAT.SPEECH_BUBBLE_PRIORITY
					)
				);
			}
		} else {
			if (sendWordBubble) {
				context.eventBus.publish(
					'wordBubble',
					context,
					new WordBubble(
						'Too many rats! Go catch some before spawning more.',
						'word',
						RAT.SPEECH_BUBBLE_DURATION,
						RAT.SPEECH_BUBBLE_PRIORITY
					)
				);
			}
		}
	}

	private playSpawnParticles(context: Context, position: Vec2) {
		let particlesAnimatedSprite = new AnimatedSprite(
			new Vec2(
				position.x - (RAT.PARTICLES_CELL_WIDTH - RAT.WIDTH) / 2,
				position.y - (RAT.PARTICLES_CELL_HEIGHT - RAT.HEIGHT)
			),
			Vec2.zero(),
			RAT.Z_INDEX
		);

		particlesAnimatedSprite.addAnim(
			'play',
			new SpriteAnimation(
				context.preloads.image('spawnSheet'),
				RAT.PARTICLES_CELL_WIDTH,
				RAT.PARTICLES_CELL_HEIGHT,
				6,
				1,
				6,
				0.05,
				false
			)
		);

		particlesAnimatedSprite.play('play');

		this.#particles.push(particlesAnimatedSprite);
	}

	private playCaughtParticles(context: Context, position: Vec2) {
		let particlesAnimatedSprite = new AnimatedSprite(
			new Vec2(
				position.x - (RAT.PARTICLES_CELL_WIDTH - RAT.WIDTH) / 2,
				position.y - (RAT.PARTICLES_CELL_HEIGHT - RAT.HEIGHT)
			),
			Vec2.zero(),
			RAT.Z_INDEX
		);

		particlesAnimatedSprite.addAnim(
			'play',
			new SpriteAnimation(
				context.preloads.image('caughtSheet'),
				RAT.PARTICLES_CELL_WIDTH,
				RAT.PARTICLES_CELL_HEIGHT,
				7,
				1,
				7,
				0.075,
				false
			)
		);

		particlesAnimatedSprite.play('play');

		this.#particles.push(particlesAnimatedSprite);
	}
}
