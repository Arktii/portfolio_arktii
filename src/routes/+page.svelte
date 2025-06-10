<script lang="ts">
	// import components
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/interactive/core/CollisionSpace';

	import type p5 from 'p5';

	// import images
	import bgNightSky from '$lib/images/background/night-sky.png';
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
	import hereArrow from '$lib/images/icons/hereArrow.png';

	import beastBonds from '$lib/images/projects/beast-bonds.png';
	import chasmsCall from '$lib/images/projects/chasms-call.png';
	import flickeringFlame from '$lib/images/projects/flickering-flame.png';
	import timeflowers from '$lib/images/projects/timeflowers.png';
	import wreckingWhiskers from '$lib/images/projects/wrecking-whiskers.png';

	import charge from '$lib/images/projects/charge.png';
	import specialProblem from '$lib/images/projects/special-problem.png';
	import subaybay from '$lib/images/projects/subaybay.png';

	// import fonts
	import aldritch from '$lib/fonts/Aldrich-Regular.ttf';
	import russoOne from '$lib/fonts/RussoOne-Regular.ttf';

	import {
		BUILDING,
		COLLISION_SPACE as COL_SPACE,
		makeColliderGrid,
		PLAYER,
		PLAYER_COMPUTED,
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
	import { FixedUpdateRunner } from '$lib/interactive/models/FixedUpdateRunner';
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

	let hadFixedUpdateFrame: boolean = false;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
		buildingFgImage = await p5.loadImage(buildingForeground);
		playerImage = await p5.loadImage(playerImg);
	}

	async function setup(p5: import('p5'), canvas: HTMLCanvasElement) {
		// testPriorityQueue();

		world = new World(canvas);
		inputs = new Inputs();
		drawing = new Drawing();
		eventBus = new EventBus();
		colSpace = new CollisionSpace(
			Math.ceil(BUILDING.WIDTH / COL_SPACE.CELL_SIZE),
			Math.ceil(BUILDING.HEIGHT / COL_SPACE.CELL_SIZE),
			COL_SPACE.CELL_SIZE
		);
		player = new Player(new Vec2(WORLD_SIZE.REFERENCE_WIDTH / 2 - PLAYER_COMPUTED.HALF_WIDTH, 20));
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
				TV.IMAGE_DURATION
			)
		);
		objects.push(
			new TvScreen(
				[
					new TvDisplay(4, 95, 460, 100, 70, TV.GLOW_GROW),
					new TvDisplay(5, 95, 422, 46, 32, TV.GLOW_GROW_SMALL)
				],
				[
					new TvImageInfo(charge, 'multiplayer game using Unity and AWS'),
					new TvImageInfo(subaybay, 'software for the Office of the University Registrar'),
					new TvImageInfo(specialProblem, 'thesis equivalent, successfully defended May 26, 2025')
				],
				TV.IMAGE_DURATION
			)
		);

		setupBuildingDrawers();

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
		await preloads.loadImage(p5, 'hereArrow', hereArrow);

		await preloads.loadFont(p5, 'Aldritch', aldritch);
		await preloads.loadFont(p5, 'Russo One', russoOne);

		// setup and subscribe to update loop
		for (let i = 0; i < objects.length; i++) {
			let item = objects[i];
			if (item.setup) {
				await item.setup(context);
			}

			if (item.fixedUpdate) {
				eventBus.subscribe('fixedUpdate', item.fixedUpdate.bind(item));
			}
		}

		p5.resizeCanvas(p5.width, p5.width / BUILDING.ASPECT_RATIO);
		world.canvasResizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function setupBuildingDrawers() {
		addFixedRunner((context) => {
			context.drawing.image(
				buildingImage,
				0,
				0,
				BUILDING.WIDTH,
				BUILDING.HEIGHT,
				false,
				BUILDING.Z_INDEX
			);
			context.drawing.image(
				buildingFgImage,
				0,
				0,
				BUILDING.WIDTH,
				BUILDING.HEIGHT,
				false,
				BUILDING.FOREGROUND_Z_INDEX
			);
		});

		addFixedRunner((context) => {
			context.drawing
				.text(140, 157, 'INTERNSHIP', BUILDING.FONT_SIZE, BUILDING.Z_INDEX)
				.font(context.preloads.font('Russo One'))
				.textAlign(context.p5.LEFT, context.p5.CENTER);
		});

		addFixedRunner((context) => {
			context.drawing
				.text(33, 205, 'PERSONAL PROJECTS', BUILDING.FONT_SIZE, BUILDING.Z_INDEX)
				.font(context.preloads.font('Russo One'))
				.textAlign(context.p5.LEFT, context.p5.CENTER);
		});

		addFixedRunner((context) => {
			context.drawing
				.text(110, 359, 'SCHOOL PROJECTS', BUILDING.FONT_SIZE, BUILDING.Z_INDEX)
				.font(context.preloads.font('Russo One'))
				.textAlign(context.p5.LEFT, context.p5.CENTER);
		});

		addFixedRunner((context) => {
			context.drawing
				.text(30, 579, 'LINKS', BUILDING.FONT_SIZE, BUILDING.Z_INDEX)
				.font(context.preloads.font('Russo One'))
				.textAlign(context.p5.LEFT, context.p5.CENTER);
		});
	}

	// draws ui to assist in development
	function setupDevDisplayDrawers() {
		addFixedRunner((context) => {
			let playerAABB = player.calculateInteractAABB();
			context.drawing
				.rect(
					playerAABB.left,
					playerAABB.top,
					playerAABB.right - playerAABB.left,
					playerAABB.bottom - playerAABB.top,
					PLAYER.Z_INDEX + 1
				)
				.fillColor(context.p5.color('rgba(0, 0, 0, 0)'))
				.stroke(context.p5.color('rgb(0, 0, 0)'), 0.5);
		});

		addFixedRunner((context) => {
			let gridX = context.colSpace.worldToGrid(context.world.toWorld(context.p5.mouseX));
			let gridY = context.colSpace.worldToGrid(context.world.toWorld(context.p5.mouseY));

			let worldX = context.colSpace.gridToWorldCenter(gridX);
			let worldY = context.colSpace.gridToWorldCenter(gridY);

			context.drawing.gridRect(gridX, gridY, 1, 1, 50);
			context.drawing.text(worldX, worldY, `${gridX}, ${gridY}`, 3.5, 50);
		});
	}

	function addFixedRunner(toRun: (context: Context) => void) {
		instantiate(new FixedUpdateRunner(toRun));
	}

	function instantiate(object: any) {
		objects.push(object);
	}

	function fixedUpdate(p5: import('p5')) {
		drawing.emptyQueue();

		eventBus.publish('fixedUpdate', context);

		hadFixedUpdateFrame = true;

		inputs.newFrame();
	}

	function update(p5: import('p5'), deltaSecs: number) {
		display(p5);
	}

	function display(p5: import('p5')) {
		if (hadFixedUpdateFrame) {
			drawing.render(context);
			hadFixedUpdateFrame = false;
		}
	}

	function windowResized(p5: import('p5')) {
		world.canvasResizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;

		p5.resizeCanvas(p5.width, world.toCanvas(BUILDING.HEIGHT));
	}

	function mouseClicked(p5: import('p5')) {
		inputs?.setMouseClicked();
	}

	function mousePressed(p5: import('p5')) {
		inputs?.setMouseJustPressed(p5.mouseButton);
	}

	function mouseReleased(p5: import('p5')) {
		inputs?.setMouseJustReleased();
	}

	function keyPressed(p5: import('p5')) {
		inputs?.setKeyJustPressed(p5.key);
	}

	function keyReleased(p5: import('p5')) {
		inputs?.setKeyJustReleased(p5.key);
	}
</script>

<main class="bg-[url({bgNightSky})] bg-repeat">
	<p>Top of the screen</p>

	<div class="mx-auto w-fit">
		<Canvas
			{preload}
			{setup}
			{fixedUpdate}
			{update}
			{windowResized}
			{mouseClicked}
			{mousePressed}
			{mouseReleased}
			{keyPressed}
			{keyReleased}
		/>
	</div>

	<p>Bottom of the screen</p>
</main>
