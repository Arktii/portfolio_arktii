<script lang="ts">
	// TODO? combine this with P5 component
	import P5 from '$lib/components/P5.svelte';
	import { CANVAS_SIZE } from '$lib/interactive/constants';

	export let preload = async (p5: import('p5')) => {};
	export let setup = async (p5: import('p5')) => {};
	export let update = (p5: import('p5'), deltaSecs: number) => {};
	export let windowResized = (p5: import('p5')) => {};
	export let mouseMoved = (p5: import('p5')) => {};
	export let keyPressed = (p5: import('p5')) => {};
	export let keyReleased = (p5: import('p5')) => {};

	async function canvasSetup(p5: import('p5')) {
		await preload(p5);

		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.pixelDensity(1);
		p5.noSmooth();

		const width = p5.constrain(p5.windowWidth * 0.9, CANVAS_SIZE.MIN_WIDTH, CANVAS_SIZE.MAX_WIDTH);
		p5.resizeCanvas(width, p5.windowHeight);

		await setup(p5);
	}

	function draw(p5: import('p5')) {
		p5.clear();

		update(p5, p5.deltaTime / 1000);
	}

	function canvasWindowResized(p5: import('p5')) {
		const width = p5.constrain(p5.windowWidth * 0.9, CANVAS_SIZE.MIN_WIDTH, CANVAS_SIZE.MAX_WIDTH);
		p5.resizeCanvas(width, p5.windowHeight);

		windowResized(p5);
	}
</script>

<div class="mx-auto w-fit">
	<P5
		setup={canvasSetup}
		{draw}
		windowResized={canvasWindowResized}
		{mouseMoved}
		{keyPressed}
		{keyReleased}
	/>
</div>
