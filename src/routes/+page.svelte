<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/interactive/core/CollisionSpace';

	import type p5 from 'p5';

	import building from '$lib/images/building.png';
	import playerImg from '$lib/images/player.png';
	import {
		BUILDING_SIZE,
		COLLISION_SPACE as COL_SPACE,
		makeColliderGrid,
		PLAYER as PLAYER,
		WORLD_SIZE
	} from '$lib/interactive/constants';
	import { Player } from '$lib/interactive/models/Player';
	import { World } from '$lib/interactive/core/World';
	import { Vec2 } from '$lib/interactive/models/Vec2';
	import { EventBus } from '$lib/interactive/core/EventBus';
	import { Target } from '$lib/interactive/models/MoveArea';
	import { MovementPointManager as MoveAreaManager } from '$lib/interactive/models/MovementAreaManager';
	import { Drawing } from '$lib/interactive/core/Drawing';
	import { Context } from '$lib/interactive/core/Context';
	import { testPriorityQueue, type PriorityQueue } from '$lib/collections/PriorityQueue';

	let buildingImage: p5.Image;
	let playerImage: p5.Image;

	let context: Context;
	let world: World;
	let colSpace: CollisionSpace;
	let drawing: Drawing;
	let player: Player;

	let eventBus: EventBus;

	let moveAreaManager: MoveAreaManager;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
		playerImage = await p5.loadImage(playerImg);
	}

	function setup(p5: import('p5')) {
		testPriorityQueue();

		world = new World();
		drawing = new Drawing(p5, world);
		eventBus = new EventBus();
		colSpace = new CollisionSpace(
			Math.ceil(BUILDING_SIZE.WIDTH / COL_SPACE.CELL_SIZE),
			Math.ceil(BUILDING_SIZE.HEIGHT / COL_SPACE.CELL_SIZE),
			COL_SPACE.CELL_SIZE
		);
		colSpace.colliderGrid = makeColliderGrid();

		context = new Context(p5, world, drawing, colSpace, eventBus);

		player = new Player(colSpace, new Vec2(p5.width / 2, 0));
		eventBus.subscribe('update', player.update.bind(player));

		// setup movement points
		// TODO: consider other locations for this
		moveAreaManager = new MoveAreaManager(colSpace, player);
		moveAreaManager.addArea(0, 7, 2, new Target(3, 5, 0, 5, true));
		moveAreaManager.addArea(0, 3, 7, undefined, new Target(1, -5, 0));
		moveAreaManager.addArea(4, 6, 7, new Target(6, 1, 10, 14, false), new Target(1, -5, 0));
		moveAreaManager.addArea(10, 10, 8, new Target(1, 4, 0, 15), new Target(5, -1, 0, 5));
		moveAreaManager.addArea(12, 14, 8, new Target(1, 4, 0, 15));
		moveAreaManager.addArea(9, 15, 11, undefined, new Target(1, -4, 10, 13));

		eventBus.subscribe('update', moveAreaManager.update.bind(moveAreaManager));

		p5.resizeCanvas(p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function update(p5: import('p5'), deltaSecs: number) {
		eventBus.publish('update', context, deltaSecs);

		display(p5);
	}

	function display(p5: import('p5')) {
		drawing.image(buildingImage, 0, 0, BUILDING_SIZE.WIDTH, BUILDING_SIZE.HEIGHT);

		for (let y = 0; y < colSpace.gridHeight; y++) {
			for (let x = 0; x < colSpace.gridWidth; x++) {
				if (colSpace.colliderGrid[x][y] === true) {
					drawing.gridRect(x, y, 1, 1, colSpace.cellSize);
				}
			}
		}

		let displayCellSize = world.toCanvas(colSpace.cellSize);

		drawing.image(
			playerImage,
			player.position.x - (PLAYER.SPRITE_WIDTH - PLAYER.WIDTH) / 2,
			player.position.y - PLAYER.HEIGHT,
			PLAYER.SPRITE_WIDTH,
			PLAYER.SPRITE_HEIGHT,
			player.direction < 0
		);

		let gridX = Math.floor(world.toWorld(p5.mouseX) / colSpace.cellSize);
		let gridY = Math.floor(world.toWorld(p5.mouseY) / colSpace.cellSize);
		let worldX = world.toCanvas(gridX * colSpace.cellSize);
		let worldY = world.toCanvas(gridY * colSpace.cellSize);
		p5.rect(worldX, worldY, displayCellSize, displayCellSize);
		p5.text(gridX + ',' + gridY, worldX, worldY + world.toWorld(colSpace.cellSize / 2));

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

		// p5.rect(
		// 	world.toCanvas(player.position.x),
		// 	world.toCanvas(player.position.y),
		// 	world.toCanvas(PLAYER.WIDTH),
		// 	world.toCanvas(PLAYER.HEIGHT)
		// );
	}

	function windowResized(p5: import('p5')) {
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;

		p5.resizeCanvas(p5.width, world.toCanvas(BUILDING_SIZE.HEIGHT));
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

		if (p5.key == 't') {
			console.log('JUMP');
			player.jump(new Vec2(50, 100));
		}
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
