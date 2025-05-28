<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/models/CollisionSpace';

	import type p5 from 'p5';

	import building from '$lib/images/building.png';
	import { BUILDING_SIZE, COLLISION_SPACE as COL_SPACE } from '$lib/constants';

	let colSpace: CollisionSpace;
	let buildingImage: p5.Image;

	async function preload(p5: import('p5')) {
		buildingImage = await p5.loadImage(building);
	}

	function setup(p5: import('p5')) {
		colSpace = new CollisionSpace(0, 0, BUILDING_SIZE.WIDTH, BUILDING_SIZE.HEIGHT, 50);

		colSpace.colliderGrid[4][3] = true;

		p5.resizeCanvas(p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);

		let resizeRatio = p5.width / COL_SPACE.REFERENCE_WIDTH;
		colSpace.cellSize = COL_SPACE.DEFAULT_CELL_SIZE * resizeRatio;
	}

	function update(p5: import('p5'), deltaTime: number) {
		p5.image(buildingImage, 0, 0, p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);
		p5.circle(p5.mouseX, p5.mouseY, 40);

		for (let y = 0; y < colSpace.gridHeight; y++) {
			for (let x = 0; x < colSpace.gridWidth; x++) {
				if (colSpace.colliderGrid[x][y] === true) {
					p5.rect(
						x * colSpace.cellSize,
						y * colSpace.cellSize,
						colSpace.cellSize,
						colSpace.cellSize
					);
				}
			}
		}

		p5.rect(
			Math.floor(p5.mouseX / colSpace.cellSize) * colSpace.cellSize,
			Math.floor(p5.mouseY / colSpace.cellSize) * colSpace.cellSize,
			colSpace.cellSize,
			colSpace.cellSize
		);
	}

	function windowResized(p5: import('p5')) {
		let resizeRatio = p5.width / COL_SPACE.REFERENCE_WIDTH;
		colSpace.cellSize = COL_SPACE.DEFAULT_CELL_SIZE * resizeRatio;

		p5.resizeCanvas(p5.width, p5.width / BUILDING_SIZE.ASPECT_RATIO);
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
