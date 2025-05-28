<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/models/CollisionSpace';

	import type p5 from 'p5';

	import building from '$lib/images/building.png';
	import playerImg from '$lib/images/player.png';
	import {
		BUILDING_SIZE,
		COLLISION_SPACE as COL_SPACE,
		PLAYER_SIZE,
		WORLD_SIZE
	} from '$lib/constants';
	import { Player } from '$lib/models/Player';
	import { World } from '$lib/models/World';

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

		colSpace = new CollisionSpace(0, 0, BUILDING_SIZE.WIDTH, BUILDING_SIZE.HEIGHT, 50);
		player = new Player({ x: p5.width / 2, y: 50 });

		colSpace.colliderGrid[4][3] = true;

		p5.resizeCanvas(p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);

		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;
	}

	function update(p5: import('p5'), deltaTime: number) {
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
			world.toCanvas(player.position.y - PLAYER_SIZE.HEIGHT),
			world.toCanvas(PLAYER_SIZE.WIDTH),
			world.toCanvas(PLAYER_SIZE.HEIGHT)
		);

		p5.rect(
			world.toCanvas(Math.floor(world.toWorld(p5.mouseX) / colSpace.cellSize) * colSpace.cellSize),
			world.toCanvas(Math.floor(world.toWorld(p5.mouseY) / colSpace.cellSize) * colSpace.cellSize),
			displayCellSize,
			displayCellSize
		);
	}

	function windowResized(p5: import('p5')) {
		world.resizeRatio = p5.width / WORLD_SIZE.REFERENCE_WIDTH;

		p5.resizeCanvas(p5.width, world.toCanvas(BUILDING_SIZE.HEIGHT));
	}

	function keyPressed(p5: import('p5')) {
		console.log(p5.key);
		if (p5.key == ' ') {
			console.log('Mobility Button Pressed');
		} else if (p5.key == 'F' || p5.keyCode == p5.ENTER) {
			console.log('Interact Button Pressed');
		}
	}
</script>

<p>Top of the screen</p>

<div class="mx-auto w-fit">
	<Canvas {preload} {setup} {update} {windowResized} {keyPressed} />
</div>

<p>Bottom of the screen</p>
