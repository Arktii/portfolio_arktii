<script lang="ts">
	// TODO? combine this with P5 component
	import P5 from '$lib/components/P5.svelte';
	import { CANVAS_SIZE, FIXED_DELTA_TIME } from '$lib/interactive/constants';
	import Fredoka from '$lib/fonts/Fredoka-Regular.ttf';

	export let preload = async (p5: import('p5')) => {};
	export let setup = async (p5: import('p5'), canvas: HTMLCanvasElement) => {};
	export let fixedUpdate = (p5: import('p5')) => {};
	export let update = (p5: import('p5'), deltaSecs: number) => {};
	export let windowResized = (p5: import('p5')) => {};
	export let mouseClicked = (p5: import('p5')) => {};
	export let mousePressed = (p5: import('p5')) => {};
	export let mouseReleased = (p5: import('p5')) => {};
	export let mouseMoved = (p5: import('p5')) => {};
	export let keyPressed = (p5: import('p5')) => {};
	export let keyReleased = (p5: import('p5')) => {};

	// for the fixed time step
	let accumulator = 0;

	async function canvasSetup(p5: import('p5')) {
		await preload(p5);

		const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.pixelDensity(1);
		p5.noSmooth();

		// suppress right click menu inside of canvas
		canvas.elt.oncontextmenu = (event: any) => {
			event.preventDefault();
		};

		const defaultFont = await p5.loadFont(Fredoka);

		p5.textFont(defaultFont);

		const width = p5.constrain(p5.windowWidth * 0.9, CANVAS_SIZE.MIN_WIDTH, CANVAS_SIZE.MAX_WIDTH);
		p5.resizeCanvas(width, p5.windowHeight);

		await setup(p5, (canvas as any).canvas as HTMLCanvasElement);
	}

	function draw(p5: import('p5')) {
		accumulator += p5.deltaTime;

		while (accumulator >= FIXED_DELTA_TIME) {
			fixedUpdate(p5);

			accumulator -= FIXED_DELTA_TIME;
		}

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
		{mouseClicked}
		{mouseMoved}
		{mousePressed}
		{mouseReleased}
		{keyPressed}
		{keyReleased}
	/>
</div>
