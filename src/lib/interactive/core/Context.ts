import type { EventBus } from './EventBus';
import type { CollisionSpace } from './CollisionSpace';
import type { Drawing } from './Drawing';
import type { World } from './World';

/**
 * A class for encompassing all of the necessary dependencies for easy injection
 */
export class Context {
	p5: import('p5');
	world: World;
	drawing: Drawing;
	colSpace: CollisionSpace;
	eventBus: EventBus;

	constructor(
		p5: import('p5'),
		world: World,
		drawing: Drawing,
		colSpace: CollisionSpace,
		eventBus: EventBus
	) {
		this.p5 = p5;
		this.world = world;
		this.drawing = drawing;
		this.colSpace = colSpace;
		this.eventBus = eventBus;
	}
}
