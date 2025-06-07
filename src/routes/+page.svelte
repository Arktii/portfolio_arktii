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
		WORLD_SIZE
	} from '$lib/interactive/constants';

	import { Player } from '$lib/interactive/models/Player';
	import { Vec2 } from '$lib/interactive/models/Vec2';

	import { World } from '$lib/interactive/core/World';
	import { EventBus } from '$lib/interactive/core/EventBus';
	import { Drawing } from '$lib/interactive/core/Drawing';
	import { Context } from '$lib/interactive/core/Context';
	import { Inputs } from '$lib/interactive/core/Inputs';

	import { MoveAreaManager } from '$lib/interactive/systems/MovementAreaManager';
	import { ShovableManager } from '$lib/interactive/systems/ShovableManager';
	import { InteractionManager } from '$lib/interactive/systems/InteractionManager';
	import { WordBubbleManager } from '$lib/interactive/systems/WordBubbleManager';

	let buildingImage: p5.Image;
	let buildingFgImage: p5.Image;
	let playerImage: p5.Image;

	let context: Context;
	let inputs: Inputs;
	let world: World;
	let colSpace: CollisionSpace;
	let drawing: Drawing;
	let player: Player;

	let testButton: p5.Element;

	let eventBus: EventBus;

	let moveAreaManager: MoveAreaManager;
	let shovableManager: ShovableManager;
	let interactionManager: InteractionManager;
	let wordBubbleManager: WordBubbleManager;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
		buildingFgImage = await p5.loadImage(buildingForeground);
		playerImage = await p5.loadImage(playerImg);
	}

	async function setup(p5: import('p5')) {
		// testPriorityQueue();

		world = new World();
		inputs = new Inputs();
		drawing = new Drawing();
		eventBus = new EventBus();
		colSpace = new CollisionSpace(
			Math.ceil(BUILDING.WIDTH / COL_SPACE.CELL_SIZE),
			Math.ceil(BUILDING.HEIGHT / COL_SPACE.CELL_SIZE),
			COL_SPACE.CELL_SIZE
		);
		player = new Player(new Vec2(WORLD_SIZE.REFERENCE_WIDTH / 2, 0));
		moveAreaManager = new MoveAreaManager(colSpace);
		interactionManager = new InteractionManager(colSpace);
		shovableManager = new ShovableManager();
		wordBubbleManager = new WordBubbleManager();

		context = new Context(p5, world, inputs, drawing, colSpace, eventBus, player);

		// setup components
		colSpace.colliderGrid = makeColliderGrid();

		await player.setup(context);
		await moveAreaManager.setup(context);
		await interactionManager.setup(context);
		await shovableManager.setup(context);
		await wordBubbleManager.setup(context);

		eventBus.subscribe('update', player.update.bind(player));
		eventBus.subscribe('update', moveAreaManager.update.bind(moveAreaManager));
		eventBus.subscribe('update', interactionManager.update.bind(interactionManager));
		eventBus.subscribe('update', shovableManager.update.bind(shovableManager));
		eventBus.subscribe('update', wordBubbleManager.update.bind(wordBubbleManager));

		eventBus.subscribe('wordBubble', wordBubbleManager.receiveWordBubble.bind(wordBubbleManager));

		p5.resizeCanvas(p5.width, p5.width / BUILDING.ASPECT_RATIO);
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function update(p5: import('p5'), deltaSecs: number) {
		eventBus.publish('update', context, deltaSecs);

		inputs.newFrame();

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

		// // draw colliders
		// for (let y = 0; y < colSpace.gridHeight; y++) {
		// 	for (let x = 0; x < colSpace.gridWidth; x++) {
		// 		if (colSpace.colliderGrid[x][y] === true) {
		// 			drawing.gridRect(x, y, 1, 1);
		// 		}
		// 	}
		// }

		let displayCellSize = world.toCanvas(colSpace.cellSize);

		drawing.render(context);

		let playerAABB = player.calculateInteractAABB();
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

	function mouseClicked(p5: import('p5')) {
		inputs?.setMouseClicked();
	}

	function keyPressed(p5: import('p5')) {
		inputs?.setKeyJustPressed(p5.key);
	}

	function keyReleased(p5: import('p5')) {
		inputs?.setKeyJustReleased(p5.key);
	}
</script>

<p>Top of the screen</p>

<div class="mx-auto w-fit">
	<Canvas {preload} {setup} {update} {windowResized} {mouseClicked} {keyPressed} {keyReleased} />
</div>

<p>Bottom of the screen</p>
