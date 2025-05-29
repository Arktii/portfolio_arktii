import { PLAYER } from '$lib/constants';
import type { CollisionSpace } from './CollisionSpace';
import { DirectionFlags } from './DirectionFlags';
import { Vec2 } from './Vec2';
import { BoundingBox } from './BoundingBox';

export class Player {
	position: Vec2;
	// aabb: BoundingBox;

	lockInput: boolean;

	speed: number;

	directionInputs: DirectionFlags;
	velocity: Vec2;

	colSpace: CollisionSpace;

	constructor(collisionSpace: CollisionSpace, position: Vec2) {
		this.colSpace = collisionSpace;

		this.position = position;
		// this.aabb = BoundingBox.fromRect(position.x, position.y, PLAYER.WIDTH, PLAYER.HEIGHT);

		this.lockInput = false;
		this.directionInputs = new DirectionFlags();
		this.speed = PLAYER.SPEED;
		this.velocity = Vec2.ZERO;
	}

	update(p5: import('p5'), deltaSecs: number) {
		// movement inputs (checked in update for greater responsiveness)
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.directionInputs.left = p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown('a');
		// @ts-ignore (typescript definitions aren't up to date with p5 version)
		this.directionInputs.right = p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown('d');

		// gravity
		// TODO: check if grounded
		// horizontal movement
		this.velocity.x = this.directionInputs.xAxis() * this.speed;
		this.position.x += this.velocity.x * deltaSecs;

		// TODO: don't walk off of edges

		// Collisions
		let collisionBox = BoundingBox.fromRect(
			this.position.x,
			this.position.y,
			PLAYER.WIDTH,
			PLAYER.HEIGHT
		);

		this.velocity.y += PLAYER.GRAVITY * deltaSecs;
		this.position.y += this.velocity.y * deltaSecs;

		let collisionDisplacement = this.colSpace.calculateDisplacement(collisionBox);
		if (collisionDisplacement.y != 0) {
			this.velocity.y = 0;
			this.position.y += collisionDisplacement.y;
		}

		if (collisionDisplacement.x != 0) {
			this.velocity.x = 0;
			this.position.x += collisionDisplacement.x;
		}
	}
}
