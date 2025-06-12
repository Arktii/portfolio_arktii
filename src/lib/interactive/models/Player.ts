import { FIXED_DELTA_SECS, INDICATORS, PHYSICS, PLAYER, PLAYER_COMPUTED } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';

import { DirectionFlags } from './DirectionFlags';
import { Vec2 } from './Vec2';
import { BoundingBox } from './BoundingBox';
import { Tween } from '../systems/Tween';
import { AnimatedSprite } from './AnimatedSprite';

import idleSheet from '$lib/images/player-idle.png';
import walkSheet from '$lib/images/player-walk.png';
import jumpLandSheet from '$lib/images/player-jump-land.png';
import jumpUpStartSheet from '$lib/images/player-jump-up-start.png';
import jumpUpHoldSheet from '$lib/images/player-jump-up-hold.png';
import jumpDownStartSheet from '$lib/images/player-jump-down-start.png';
import jumpDownHoldSheet from '$lib/images/player-jump-down-hold.png';
import { SpriteAnimation } from './SpriteAnimation';
import { Mobile } from './Mobile';

export class Player extends Mobile {
	#inputIsLocked: boolean;

	#directionInputs: DirectionFlags;

	#idletime: number = 10;

	// animation
	#animatedSprite: AnimatedSprite;

	constructor(position: Vec2) {
		super(position, PLAYER.WIDTH, PLAYER.HEIGHT);

		this.#inputIsLocked = false;
		this.#directionInputs = new DirectionFlags();

		this.#animatedSprite = new AnimatedSprite(
			position,
			new Vec2(-(PLAYER.SPRITE_WIDTH - PLAYER.WIDTH) / 2, -(PLAYER.SPRITE_HEIGHT - PLAYER.HEIGHT)),
			PLAYER.Z_INDEX
		);
	}

	get inputIsLocked() {
		return this.#inputIsLocked;
	}

	/**
	 * the hitbox for interactions
	 */
	calculateInteractAABB(): BoundingBox {
		// i think this more explicit form is a bit easier to read than adding in an offset
		if (this.direction > 0) {
			return BoundingBox.fromRect(
				this.position.x + PLAYER_COMPUTED.INTERACT_WIDTH_DIFF,
				this.position.y,
				PLAYER.INTERACT_WIDTH,
				PLAYER.HEIGHT
			);
		} else {
			return BoundingBox.fromRect(
				this.position.x,
				this.position.y,
				PLAYER.INTERACT_WIDTH,
				PLAYER.HEIGHT
			);
		}
	}

	async setup(context: Context) {
		let p5 = context.p5;

		this.#animatedSprite
			.addAnim('idle', new SpriteAnimation(await p5.loadImage(idleSheet), 32, 32, 4, 1, 4, 0.2))
			.addAnim('walk', new SpriteAnimation(await p5.loadImage(walkSheet), 32, 32, 8, 1, 8, 0.125))
			.addAnim(
				'jump-land',
				new SpriteAnimation(await p5.loadImage(jumpLandSheet), 32, 32, 3, 1, 3, 0.125)
			)
			.addAnim(
				'jump-up-start',
				new SpriteAnimation(await p5.loadImage(jumpUpStartSheet), 32, 32, 2, 1, 2, 0.125)
			)
			.addAnim(
				'jump-up-hold',
				new SpriteAnimation(await p5.loadImage(jumpUpHoldSheet), 32, 32, 2, 1, 2, 0.1)
			)
			.addAnim(
				'jump-down-start',
				new SpriteAnimation(await p5.loadImage(jumpDownStartSheet), 32, 32, 1, 1, 1, 0.125)
			)
			.addAnim(
				'jump-down-hold',
				new SpriteAnimation(await p5.loadImage(jumpDownHoldSheet), 32, 32, 2, 1, 2, 0.125)
			);

		this.#animatedSprite.play('idle');
	}

	fixedUpdate(context: Context) {
		if (!this.#inputIsLocked) {
			this.moveHorizontally(context.p5);

			this.applyGravity();

			this.updatePosition(context);

			this.updateWalkIdleAnimation();

			// show left-right controls
			if (this.#idletime > PLAYER.CONTROLS_IDLE_THRESHOLD) {
				this.showHorizontalControls(context);
			}
		}

		if (this.movementTween) {
			this.movementTween.update(FIXED_DELTA_SECS);

			this.scrollToPlayer(context);
		}

		// update animation
		this.#animatedSprite.position = this.position;
		this.#animatedSprite.update(FIXED_DELTA_SECS);
		this.#animatedSprite.draw(context);
	}

	private updateWalkIdleAnimation() {
		if (this.velocity.x == 0) {
			this.#idletime += FIXED_DELTA_SECS;
		} else if (this.#animatedSprite.queueLength === 0) {
			this.#idletime = 0;
			this.#animatedSprite.play('walk');
		}

		if (
			this.#idletime > PLAYER.WALK_ANIM_IDLE_THRESHOLD &&
			this.#animatedSprite.queueLength === 0
		) {
			this.#animatedSprite.play('idle');
		}
	}

	override setDirection(direction: -1 | 1) {
		this.direction = direction;
		this.#animatedSprite.flipX = direction < 1;
	}

	private moveHorizontally(p5: import('p5')) {
		// movement inputs (checked in update for greater responsiveness)
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.#directionInputs.left = p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown('a');
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.#directionInputs.right = p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown('d');

		// horizontal movement
		this.velocity.x = this.#directionInputs.xAxis() * PLAYER.SPEED;

		// update direction
		if (this.velocity.x > 0) {
			this.setDirection(1);
		} else if (this.velocity.x < 0) {
			this.setDirection(-1);
		}
	}

	private scrollToPlayer(context: Context) {
		const viewportWorldHeight = context.world.toWorld(window.innerHeight);

		const playerViewAABB = new BoundingBox(
			this.position.x,
			this.position.x + PLAYER.WIDTH,
			this.position.y + PLAYER_COMPUTED.HALF_HEIGHT - viewportWorldHeight / 2,
			this.position.y + PLAYER_COMPUTED.HALF_HEIGHT + viewportWorldHeight / 2
		);

		const outOfBounds = context.world.calculateViewportOutOfBounds(playerViewAABB);
		if (outOfBounds.y !== 0) {
			const targetViewportY = context.world.toAbsolute(new Vec2(0, playerViewAABB.bottom)).y;

			window.scrollTo({ top: targetViewportY - window.innerHeight, behavior: 'smooth' });
		}
	}

	private showHorizontalControls(context: Context) {
		const y = this.position.y + PLAYER.HEIGHT + INDICATORS.SPACING;
		const leftKeyX =
			this.position.x + PLAYER_COMPUTED.HALF_WIDTH - INDICATORS.WIDTH - INDICATORS.SPACING;
		const rightKeyX = this.position.x + PLAYER_COMPUTED.HALF_WIDTH + INDICATORS.SPACING;

		context.drawing.image(
			context.preloads.image('keyD'),
			rightKeyX,
			y,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);

		context.drawing.image(
			context.preloads.image('arrowRight'),
			rightKeyX + INDICATORS.WIDTH + INDICATORS.SPACING,
			y,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);

		context.drawing.image(
			context.preloads.image('keyA'),
			leftKeyX,
			y,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);

		context.drawing.image(
			context.preloads.image('arrowLeft'),
			leftKeyX - INDICATORS.WIDTH - INDICATORS.SPACING,
			y,
			INDICATORS.WIDTH,
			INDICATORS.HEIGHT,
			false,
			INDICATORS.Z_INDEX
		);
	}

	override jump(target: Vec2) {
		this.#inputIsLocked = true;
		this.#idletime = 0;

		let yDirection = '';
		if (target.y > this.position.y) {
			yDirection = 'down';
		} else {
			yDirection = 'up';
		}

		this.#animatedSprite.clearQueue();
		this.#animatedSprite.play(`jump-${yDirection}-start`);
		this.#animatedSprite.enqueue(`jump-${yDirection}-hold`);

		super.jump(target);
	}

	protected override tweenOnFinishExtraActions(): void {
		this.#inputIsLocked = false;

		this.#animatedSprite.clearQueue();
		this.#animatedSprite.play(`jump-land`);
		this.#animatedSprite.enqueue('idle');
	}
}
