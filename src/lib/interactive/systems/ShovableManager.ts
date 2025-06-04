import { calculateSingleDisplacementX } from '$lib/utils/Collisions';
import { PHYSICS, POT, POT_COMPUTED, WORLD_SIZE } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import type { BoundingBox } from '../models/BoundingBox';
import type { Player } from '../models/Player';
import { Shovable } from '../models/Shovable';
import { Vec2 } from '../models/Vec2';

const potImageCount = 6;

export class ShovableManager {
	#player: Player;

	#potImages: import('p5').Image[] = [];

	#active: Shovable[] = [];

	constructor(player: Player) {
		this.#player = player;
	}

	async setup(context: Context) {
		for (let i = 1; i <= potImageCount; i++) {
			let something = await import(`$lib/images/pot${i}.png`);
			const img = await context.p5.loadImage(something.default);
			this.#potImages.push(img);
		}

		this.addShovable(context, 20, 3, 5);
		this.addShovable(context, 1, 9, 0);
		this.addShovable(context, 8, 43, 1);
		this.addShovable(context, 2, 49, 2);
		this.addShovable(context, 6, 55, 3);
		this.addShovable(context, 12, 61, 4);
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
		let playerAABB = this.#player.calculateAABB();

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
				// todo: rotate and play shatter animation
				let aabb = item.calculateAABB();

				if (context.colSpace.checkForCollision(item.calculateAABB())) {
					let overlap = context.colSpace.calculateOverlap(aabb);
					// if overlap.y is less than overlap.x, that means the collision is in the y-axis, so shatter
					if (overlap.y < overlap.x) {
						this.#active.splice(i, 1);
						item.break();
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
