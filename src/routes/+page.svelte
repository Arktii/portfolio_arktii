<script lang="ts">
	// import components
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/interactive/core/CollisionSpace';

	import type p5 from 'p5';

	// import images
	import building from '$lib/images/building.png';
	import buildingForeground from '$lib/images/building-foreground.png';
	import playerImg from '$lib/images/player.png';

	import keyW from '$lib/images/icons/keyW.png';
	import keyA from '$lib/images/icons/keyA.png';
	import keyS from '$lib/images/icons/keyS.png';
	import keyD from '$lib/images/icons/keyD.png';
	import keyE from '$lib/images/icons/keyE.png';
	import keyQ from '$lib/images/icons/keyQ.png';
	import mouse1 from '$lib/images/icons/mouse1.png';
	import mouse2 from '$lib/images/icons/mouse2.png';

	import beastBonds from '$lib/images/projects/beast-bonds.png';
	import chasmsCall from '$lib/images/projects/chasms-call.png';
	import flickeringFlame from '$lib/images/projects/flickering-flame.png';
	import timeflowers from '$lib/images/projects/timeflowers.png';
	import wreckingWhiskers from '$lib/images/projects/wrecking-whiskers.png';

	// import fonts
	import aldritch from '$lib/fonts/Aldrich-Regular.ttf';
	import russoOne from '$lib/fonts/RussoOne-Regular.ttf';

	import {
		BUILDING,
		COLLISION_SPACE as COL_SPACE,
		makeColliderGrid,
		TV,
		WORLD_SIZE
	} from '$lib/interactive/constants';

	// import core
	import { World } from '$lib/interactive/core/World';
	import { EventBus } from '$lib/interactive/core/EventBus';
	import { Drawing } from '$lib/interactive/core/Drawing';
	import { Context } from '$lib/interactive/core/Context';
	import { Inputs } from '$lib/interactive/core/Inputs';

	// import systems & models
	import { TvScreen } from '$lib/interactive/models/TvScreen';
	import { InteractionManager } from '$lib/interactive/systems/InteractionManager';
	import { MoveAreaManager } from '$lib/interactive/systems/MovementAreaManager';
	import { Player } from '$lib/interactive/models/Player';
	import { ShovableManager } from '$lib/interactive/systems/ShovableManager';
	import { Vec2 } from '$lib/interactive/models/Vec2';
	import { WordBubbleManager } from '$lib/interactive/systems/WordBubbleManager';
	import { TvDisplay } from '$lib/interactive/models/TvDisplay';
	import { TvImageInfo } from '$lib/interactive/models/TvImage';
	import { UpdateRunner } from '$lib/interactive/models/UpdateRunner';
	import { Preloads } from '$lib/interactive/core/Preloads';

	let buildingImage: p5.Image;
	let buildingFgImage: p5.Image;
	let playerImage: p5.Image;

	let context: Context;
	let inputs: Inputs;
	let world: World;
	let colSpace: CollisionSpace;
	let drawing: Drawing;
	let player: Player;
	let preloads: Preloads;

	let eventBus: EventBus;

	let moveAreaManager: MoveAreaManager;
	let shovableManager: ShovableManager;
	let interactionManager: InteractionManager;
	let wordBubbleManager: WordBubbleManager;

	let objects: any[] = [];

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
		preloads = new Preloads();
		moveAreaManager = new MoveAreaManager(colSpace);
		interactionManager = new InteractionManager(colSpace);
		shovableManager = new ShovableManager();
		wordBubbleManager = new WordBubbleManager();

		context = new Context(p5, world, inputs, drawing, colSpace, eventBus, player, preloads);

		// TODO: Move duration out to constants
		objects.push(player);
		objects.push(moveAreaManager);
		objects.push(interactionManager);
		objects.push(shovableManager);
		objects.push(wordBubbleManager);
		objects.push(
			new TvScreen(
				[
					new TvDisplay(0, 54, 210, 101, 80, TV.GLOW_GROW),
					new TvDisplay(1, 40, 303, 40, 32, TV.GLOW_GROW_SMALL),
					new TvDisplay(2, 85, 303, 40, 32, TV.GLOW_GROW_SMALL),
					new TvDisplay(3, 130, 303, 40, 32, TV.GLOW_GROW_SMALL)
				],
				[
					new TvImageInfo(chasmsCall, "Chasm's Call, made in Godot"),
					new TvImageInfo(flickeringFlame, 'Flickering Flame, made in Bevy'),
					new TvImageInfo(wreckingWhiskers, 'Wrecking Whiskers, made in Godot'),
					new TvImageInfo(timeflowers, 'Timeflowers, made in Unity'),
					new TvImageInfo(beastBonds, 'Beast Bonds, made in Unity')
				],
				5
			)
		);

		objects.push(
			new UpdateRunner((context, deltaSecs) => {
				// TODO: move out zIndex
				context.drawing
					.text(147, 157, 'INTERNSHIP', 10, 0)
					.textAlign(context.p5.LEFT, context.p5.CENTER);
			})
		);
		objects.push(
			new UpdateRunner((context, deltaSecs) => {
				// TODO: move out zIndex
				context.drawing
					.text(33, 205, 'PERSONAL PROJECTS', 10, 0)
					.textAlign(context.p5.LEFT, context.p5.CENTER);
			})
		);
		objects.push(
			new UpdateRunner((context, deltaSecs) => {
				// TODO: move out zIndex
				context.drawing
					.text(119, 359, 'SCHOOL PROJECTS', 10, 0)
					.textAlign(context.p5.LEFT, context.p5.CENTER);
			})
		);
		objects.push(
			new UpdateRunner((context, deltaSecs) => {
				// TODO: move out zIndex
				context.drawing.text(30, 579, 'LINKS', 10, 0).textAlign(context.p5.LEFT, context.p5.CENTER);
			})
		);

		// setup components
		colSpace.colliderGrid = makeColliderGrid();

		await preloads.loadImage(p5, 'keyW', keyW);
		await preloads.loadImage(p5, 'keyA', keyA);
		await preloads.loadImage(p5, 'keyS', keyS);
		await preloads.loadImage(p5, 'keyD', keyD);
		await preloads.loadImage(p5, 'keyE', keyE);
		await preloads.loadImage(p5, 'keyQ', keyQ);
		await preloads.loadImage(p5, 'mouse1', mouse1);
		await preloads.loadImage(p5, 'mouse2', mouse2);

		await preloads.loadFont(p5, 'Aldritch', aldritch);
		await preloads.loadFont(p5, 'Russo One', russoOne);

		// await player.setup(context);
		// await moveAreaManager.setup(context);
		// await interactionManager.setup(context);
		// await shovableManager.setup(context);
		// await wordBubbleManager.setup(context);

		// TODO: consider moving all update functions to their respective setups
		// eventBus.subscribe('update', player.update.bind(player));
		// eventBus.subscribe('update', moveAreaManager.update.bind(moveAreaManager));
		// eventBus.subscribe('update', interactionManager.update.bind(interactionManager));
		// eventBus.subscribe('update', shovableManager.update.bind(shovableManager));
		// eventBus.subscribe('update', wordBubbleManager.update.bind(wordBubbleManager));

		eventBus.subscribe('wordBubble', wordBubbleManager.receiveWordBubble.bind(wordBubbleManager));

		// setup and subscribe to update loop
		for (let i = 0; i < objects.length; i++) {
			let item = objects[i];
			if (item.setup) {
				await item.setup(context);
			}

			if (item.update) {
				eventBus.subscribe('update', item.update.bind(item));
			}
		}

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
