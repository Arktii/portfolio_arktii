import { calculateSingleDisplacementX } from '$lib/utils/Collisions';
import { PHYSICS, POT, POT_COMPUTED } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import type { BoundingBox } from '../models/BoundingBox';
import { Shovable } from '../models/Shovable';
import { SpriteAnimation } from '../models/SpriteAnimation';
import { Vec2 } from '../models/Vec2';
import potShatter from '$lib/images/pot-shatter.png';
import { AnimatedSprite } from '../models/AnimatedSprite';

const potImageCount = 6;

export class ShovableManager {
	#potImages: import('p5').Image[] = [];
	#shatterSheet?: import('p5').Image;

	#active: Shovable[] = [];
	#shattering: AnimatedSprite[] = [];

	async setup(context: Context) {
		for (let i = 1; i <= potImageCount; i++) {
			let imported = await import(`$lib/images/pot${i}.png`);
			const img = await context.p5.loadImage(imported.default);
			this.#potImages.push(img);
		}
		this.#shatterSheet = await context.p5.loadImage(potShatter);

		this.addShovable(context, 20, 3, 5);
		this.addShovable(context, 4, 9, 0);
		this.addShovable(context, 8, 43, 1);
		this.addShovable(context, 3, 49, 2);
		this.addShovable(context, 7, 55, 3);
		this.addShovable(context, 13, 61, 4);
	}

	private addShovable(context: Context, gridX: number, gridY: number, imageIndex: number) {
		this.#active.push(
			new Shovable(
				new Vec2(
					context.colSpace.cellSize * gridX,
					context.colSpace.cellSize * gridY + POT.HEIGHT // spawn the pot on the ground
				),
				POT.WIDTH,
				POT.HEIGHT,
				this.#potImages[imageIndex]
			)
		);
	}

	update(context: Context, deltaSecs: number) {
		let playerAABB = context.player.calculateAABB();

		for (let i = this.#active.length - 1; i >= 0; i--) {
			let item = this.#active[i];

			// gravity
			item.yVelocity += PHYSICS.GRAVITY * deltaSecs;
			item.position.y += item.yVelocity * deltaSecs;

			if (!item.falling) {
				this.handlePlayerCollisions(playerAABB, item);

				this.handleEnvironmentCollisions(context.colSpace, item);

				if (item.yVelocity > POT.FALLING_VELOCITY) {
					item.falling = true;
				}
			} else {
				let aabb = item.calculateAABB();

				if (context.colSpace.checkForCollision(item.calculateAABB())) {
					let overlap = context.colSpace.calculateOverlap(aabb);
					// if overlap.y is less than overlap.x, that means the collision is in the y-axis, so shatter
					if (overlap.y < overlap.x) {
						// push pot out of ground
						item.position.y -= overlap.y;

						this.#active.splice(i, 1);

						// shatter pot
						if (this.#shatterSheet) {
							let shatterAnimatedSprite = new AnimatedSprite(
								new Vec2(
									item.position.x - (POT.SHATTER_CELL_WIDTH - POT.WIDTH) / 2,
									item.position.y - (POT.SHATTER_CELL_HEIGHT - POT.HEIGHT)
								),
								Vec2.zero(),
								POT.Z_INDEX
							);

							shatterAnimatedSprite.addAnim(
								'shatter',
								new SpriteAnimation(
									this.#shatterSheet,
									POT.SHATTER_CELL_WIDTH,
									POT.SHATTER_CELL_HEIGHT,
									8,
									1,
									8,
									0.1,
									false
								)
							);

							shatterAnimatedSprite.play('shatter');

							this.#shattering.push(shatterAnimatedSprite);
						}
					}
				}
			}

			// draw
			context.drawing.image(
				item.image,
				item.position.x - (POT.SPRITE_WIDTH - item.width) / 2,
				item.position.y - POT_COMPUTED.HEIGHT_DIFF,
				POT.SPRITE_WIDTH,
				POT.SPRITE_HEIGHT,
				false,
				2
			);
		}

		for (let i = this.#shattering.length - 1; i >= 0; i--) {
			let animated = this.#shattering[i];

			animated.update(deltaSecs);
			animated.draw(context);

			if (animated.finished) {
				this.#shattering.splice(i, 1);
			}
		}
	}

	private handlePlayerCollisions(playerAABB: BoundingBox, item: Shovable) {
		let collisionBox = item.calculateAABB();

		if (playerAABB.colliding(collisionBox)) {
			let collisionDisplacement = calculateSingleDisplacementX(playerAABB, collisionBox);

			item.position.x += collisionDisplacement.x;
		}
	}

	private handleEnvironmentCollisions(colSpace: CollisionSpace, item: Shovable) {
		let collisionBox = item.calculateAABB();

		let collisionDisplacement = colSpace.calculateDisplacement(collisionBox);
		if (collisionDisplacement.y != 0) {
			item.yVelocity = 0;
			item.position.y += collisionDisplacement.y;
		}

		item.position.x += collisionDisplacement.x;
	}
}
