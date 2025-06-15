<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { CANVAS_SIZE, FIXED_DELTA_TIME, MAX_DELTA_TIME } from '$lib/interactive/constants';
	import Fredoka from '$lib/fonts/Fredoka-Regular.ttf';

	export let preload = async (p5: import('p5')) => {};
	export let setup = async (p5: import('p5'), canvas: HTMLCanvasElement) => {};
	export let fixedUpdate = (p5: import('p5')) => {};
	export let update = (p5: import('p5'), deltaSecs: number) => {};
	export let windowResized = (p5: import('p5')) => {};
	export let mouseClicked = (p5: import('p5')) => {};
	export let mousePressed = (p5: import('p5')) => {};
	export let mouseReleased = (p5: import('p5')) => {};
	export let keyPressed = (p5: import('p5')) => {};
	export let keyReleased = (p5: import('p5')) => {};

	let canvas: HTMLElement | undefined;
	let p5Instance: import('p5');

	// for the fixed time step
	let accumulator = 0;

	async function canvasSetup(p5: import('p5')) {
		await preload(p5);

		const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.pixelDensity(1);
		p5.noSmooth();
		canvas.style('image-rendering', 'pixelated');

		// suppress right click menu inside of canvas
		canvas.elt.oncontextmenu = (event: any) => {
			event.preventDefault();
		};

		const defaultFont = await p5.loadFont(Fredoka);

		p5.textFont(defaultFont);

		// const width = p5.constrain(p5.windowWidth * 0.9, CANVAS_SIZE.MIN_WIDTH, CANVAS_SIZE.MAX_WIDTH);
		// p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

		await setup(p5, (canvas as any).canvas as HTMLCanvasElement);
	}

	function draw(p5: import('p5')) {
		const limitedDeltaTime = Math.min(p5.deltaTime, MAX_DELTA_TIME);

		accumulator += limitedDeltaTime;

		while (accumulator >= FIXED_DELTA_TIME) {
			fixedUpdate(p5);

			accumulator -= FIXED_DELTA_TIME;
		}

		update(p5, limitedDeltaTime / 1000);
	}

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const p5 = await import('p5');

			p5Instance = new p5.default((p5js: import('p5')) => {
				p5js.setup = () => canvasSetup(p5js);
				p5js.draw = () => draw(p5js);
				p5js.windowResized = () => windowResized(p5js);
				p5js.mouseClicked = () => mouseClicked(p5js);
				p5js.mousePressed = () => mousePressed(p5js);
				p5js.mouseReleased = () => mouseReleased(p5js);
				p5js.keyPressed = () => keyPressed(p5js);
				p5js.keyReleased = () => keyReleased(p5js);
			}, canvas);
		}
	});

	onDestroy(() => {
		if (p5Instance) {
			p5Instance.remove();
		}
	});
</script>

<div class="mx-auto w-fit" bind:this={canvas}></div>
