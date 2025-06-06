import type { EventBus } from './EventBus';
import type { CollisionSpace } from './CollisionSpace';
import type { Drawing } from './Drawing';
import type { World } from './World';
import type { Player } from '../models/Player';
import type { Inputs } from './Inputs';

/**
 * A class for encompassing all of the necessary dependencies for easy injection
 */
export class Context {
	p5: import('p5');
	world: World;
	inputs: Inputs;
	drawing: Drawing;
	colSpace: CollisionSpace;
	eventBus: EventBus;
	player: Player;

	constructor(
		p5: import('p5'),
		world: World,
		inputs: Inputs,
		drawing: Drawing,
		colSpace: CollisionSpace,
		eventBus: EventBus,
		player: Player
	) {
		this.p5 = p5;
		this.world = world;
		this.inputs = inputs;
		this.drawing = drawing;
		this.colSpace = colSpace;
		this.eventBus = eventBus;
		this.player = player;
	}
}
