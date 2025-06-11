import type { EventBus } from './EventBus';
import type { CollisionSpace } from './CollisionSpace';
import type { Drawing } from './Drawing';
import type { World } from './World';
import type { Player } from '../models/Player';
import type { Inputs } from './Inputs';
import { Preloads } from './Preloads';
import type { MoveAreaManager } from '../systems/MovementAreaManager';

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
	preloads: Preloads;
	moveAreaManager: MoveAreaManager;

	constructor(
		p5: import('p5'),
		world: World,
		inputs: Inputs,
		drawing: Drawing,
		colSpace: CollisionSpace,
		eventBus: EventBus,
		player: Player,
		preloads: Preloads,
		moveAreaManager: MoveAreaManager
	) {
		this.p5 = p5;
		this.world = world;
		this.inputs = inputs;
		this.drawing = drawing;
		this.colSpace = colSpace;
		this.eventBus = eventBus;
		this.player = player;
		this.preloads = preloads;
		this.moveAreaManager = moveAreaManager;
	}
}
