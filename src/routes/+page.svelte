<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/interactive/models/CollisionSpace';

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
	import { World } from '$lib/interactive/models/World';
	import { Vec2 } from '$lib/interactive/models/Vec2';

	let buildingImage: p5.Image;
	let playerImage: p5.Image;

	let world: World;
	let colSpace: CollisionSpace;
	let player: Player;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
		playerImage = await p5.loadImage(playerImg);
	}

	function setup(p5: import('p5')) {
		world = new World();

		colSpace = new CollisionSpace(
			Math.ceil(BUILDING_SIZE.WIDTH / COL_SPACE.CELL_SIZE),
			Math.ceil(BUILDING_SIZE.HEIGHT / COL_SPACE.CELL_SIZE),
			COL_SPACE.CELL_SIZE
		);
		colSpace.colliderGrid = makeColliderGrid();
		player = new Player(colSpace, new Vec2(p5.width / 2, 0));

		p5.resizeCanvas(p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);

		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function update(p5: import('p5'), deltaTime: number) {
		// TODO: have each entity subscribe to update loop instead of mentioning them explicitly here
		player.update(p5, deltaTime);

		display(p5);
	}

	function display(p5: import('p5')) {
		p5.image(
			buildingImage,
			world.toCanvas(0),
			world.toCanvas(0),
			world.toCanvas(BUILDING_SIZE.WIDTH),
			world.toCanvas(BUILDING_SIZE.HEIGHT)
		);

		for (let y = 0; y < colSpace.gridHeight; y++) {
			for (let x = 0; x < colSpace.gridWidth; x++) {
				if (colSpace.colliderGrid[x][y] === true) {
					p5.rect(
						x * world.toCanvas(colSpace.cellSize),
						y * world.toCanvas(colSpace.cellSize),
						world.toCanvas(colSpace.cellSize),
						world.toCanvas(colSpace.cellSize)
					);
				}
			}
		}

		let displayCellSize = world.toCanvas(colSpace.cellSize);
		let playerDisplayPosition = world.worldPointToCanvas(player.position);

		p5.image(
			playerImage,
			world.toCanvas(player.position.x),
			world.toCanvas(player.position.y),
			world.toCanvas(PLAYER.WIDTH),
			world.toCanvas(PLAYER.HEIGHT)
		);

		let gridX = Math.floor(world.toWorld(p5.mouseX) / colSpace.cellSize);
		let gridY = Math.floor(world.toWorld(p5.mouseY) / colSpace.cellSize);
		let worldX = world.toCanvas(gridX * colSpace.cellSize);
		let worldY = world.toCanvas(gridY * colSpace.cellSize);
		p5.rect(worldX, worldY, displayCellSize, displayCellSize);
		p5.text(gridX + ',' + gridY, worldX, worldY + world.toWorld(colSpace.cellSize / 2));

		p5.rect(world.toCanvas(player.position.x), world.toCanvas(player.position.y), world.toCanvas(PLAYER.WIDTH), world.toCanvas(PLAYER.HEIGHT));
	}

	function windowResized(p5: import('p5')) {
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;

		p5.resizeCanvas(p5.width, world.toCanvas(BUILDING_SIZE.HEIGHT));
	}

	function keyPressed(p5: import('p5')) {
		// Keycodes are used instead of properties like p5.ARROW_LEFT because those seem to be automatically cast into strings
		console.log(p5.keyCode);
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
