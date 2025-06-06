<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/interactive/core/CollisionSpace';

	import type p5 from 'p5';

	import building from '$lib/images/building.png';
	import buildingForeground from '$lib/images/building-foreground.png';
	import playerImg from '$lib/images/player.png';
	import {
		BUILDING,
		COLLISION_SPACE as COL_SPACE,
		makeColliderGrid,
		PLAYER as PLAYER,
		WORLD_SIZE
	} from '$lib/interactive/constants';
	import { Player } from '$lib/interactive/models/Player';
	import { World } from '$lib/interactive/core/World';
	import { Vec2 } from '$lib/interactive/models/Vec2';
	import { EventBus } from '$lib/interactive/core/EventBus';
	import { MovementPointManager as MoveAreaManager } from '$lib/interactive/systems/MovementAreaManager';
	import { Drawing } from '$lib/interactive/core/Drawing';
	import { Context } from '$lib/interactive/core/Context';
	import { ShovableManager } from '$lib/interactive/systems/ShovableManager';
	import { InteractionManager } from '$lib/interactive/systems/InteractionManager';

	let buildingImage: p5.Image;
	let buildingFgImage: p5.Image;
	let playerImage: p5.Image;

	let context: Context;
	let world: World;
	let colSpace: CollisionSpace;
	let drawing: Drawing;
	let player: Player;

	let testButton: p5.Element;

	let eventBus: EventBus;

	let moveAreaManager: MoveAreaManager;
	let shovableManager: ShovableManager;
	let interactionManager: InteractionManager;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
		buildingFgImage = await p5.loadImage(buildingForeground);
		playerImage = await p5.loadImage(playerImg);
	}

	async function setup(p5: import('p5')) {
		// testPriorityQueue();

		world = new World();
		drawing = new Drawing();
		eventBus = new EventBus();
		colSpace = new CollisionSpace(
			Math.ceil(BUILDING.WIDTH / COL_SPACE.CELL_SIZE),
			Math.ceil(BUILDING.HEIGHT / COL_SPACE.CELL_SIZE),
			COL_SPACE.CELL_SIZE
		);
		colSpace.colliderGrid = makeColliderGrid();

		context = new Context(p5, world, drawing, colSpace, eventBus);

		// setup player
		player = new Player(new Vec2(WORLD_SIZE.REFERENCE_WIDTH / 2, 0));
		await player.setup(context);

		// setup movement areas
		moveAreaManager = new MoveAreaManager(colSpace, player);
		await moveAreaManager.setup(context);

		// setup interaction areas
		interactionManager = new InteractionManager(colSpace, player);
		await interactionManager.setup(context);

		// setup pots
		shovableManager = new ShovableManager(player);
		await shovableManager.setup(context);

		eventBus.subscribe('update', player.update.bind(player));
		eventBus.subscribe('update', moveAreaManager.update.bind(moveAreaManager));
		eventBus.subscribe('update', interactionManager.update.bind(interactionManager));
		eventBus.subscribe('update', shovableManager.update.bind(shovableManager));

		p5.resizeCanvas(p5.width, p5.width / BUILDING.ASPECT_RATIO);
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function update(p5: import('p5'), deltaSecs: number) {
		eventBus.publish('update', context, deltaSecs);

		display(p5);
	}

	function display(p5: import('p5')) {
		drawing.image(buildingImage, 0, 0, BUILDING.WIDTH, BUILDING.HEIGHT, false, BUILDING.Z_INDEX);
		drawing.image(
			buildingFgImage,
			0,
			0,
			BUILDING.WIDTH,
			BUILDING.HEIGHT,
			false,
			BUILDING.FOREGROUND_Z_INDEX
		);

		// draw colliders
		// for (let y = 0; y < colSpace.gridHeight; y++) {
		// 	for (let x = 0; x < colSpace.gridWidth; x++) {
		// 		if (colSpace.colliderGrid[x][y] === true) {
		// 			drawing.gridRect(x, y, 1, 1);
		// 		}
		// 	}
		// }

		let displayCellSize = world.toCanvas(colSpace.cellSize);

		drawing.render(context);

		let playerAABB = player.calculateAABB();
		p5.line(
			world.toCanvas(playerAABB.left),
			world.toCanvas(playerAABB.top),
			world.toCanvas(playerAABB.right),
			world.toCanvas(playerAABB.top)
		);
		p5.line(
			world.toCanvas(playerAABB.left),
			world.toCanvas(playerAABB.bottom),
			world.toCanvas(playerAABB.right),
			world.toCanvas(playerAABB.bottom)
		);
		p5.line(
			world.toCanvas(playerAABB.left),
			world.toCanvas(playerAABB.top),
			world.toCanvas(playerAABB.left),
			world.toCanvas(playerAABB.bottom)
		);
		p5.line(
			world.toCanvas(playerAABB.right),
			world.toCanvas(playerAABB.top),
			world.toCanvas(playerAABB.right),
			world.toCanvas(playerAABB.bottom)
		);

		// TODO: add proper drawing methods to handle this
		let gridX = Math.floor(world.toWorld(p5.mouseX) / colSpace.cellSize);
		let gridY = Math.floor(world.toWorld(p5.mouseY) / colSpace.cellSize);
		let worldX = world.toCanvas(gridX * colSpace.cellSize);
		let worldY = world.toCanvas(gridY * colSpace.cellSize);
		p5.rect(worldX, worldY, displayCellSize, displayCellSize);
		p5.text(gridX + ',' + gridY, worldX, worldY + world.toCanvas(5));
	}

	function windowResized(p5: import('p5')) {
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;

		p5.resizeCanvas(p5.width, world.toCanvas(BUILDING.HEIGHT));
	}

	function keyPressed(p5: import('p5')) {
		// Keycodes are used instead of properties like p5.ARROW_LEFT because those seem to be automatically cast into strings
		// if (p5.keyCode == 38 || p5.key == 'w') {
		// 	console.log('UP');
		// } else if (p5.keyCode == 40 || p5.key == 's') {
		// 	console.log('DOWN');
		// } else if (p5.key == ' ') {
		// 	console.log('Interact Button Pressed');
		// }
	}

	function keyReleased(p5: import('p5')) {
		// console.log('Released: ', p5.key);
		// if (p5.keyCode == 38 || p5.key == 'w') {
		// 	console.log('UP');
		// } else if (p5.keyCode == 40 || p5.key == 's') {
		// 	console.log('DOWN');
		// } else if (p5.key == ' ') {
		// 	console.log('Interact Button Released');
		// }
	}
</script>

<p>Top of the screen</p>

<div class="mx-auto w-fit">
	<Canvas {preload} {setup} {update} {windowResized} {keyPressed} {keyReleased} />
</div>

<p>Bottom of the screen</p>
