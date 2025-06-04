<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLElement | undefined;
	let p5Instance: import('p5');

	export let setup = (p5js: any) => {};
	export let draw = (p5js: any) => {};
	export let windowResized = (p5js: any) => {};
	export let mouseMoved = (p5js: any) => {};
	export let keyPressed = (p5js: any) => {};
	export let keyReleased = (p5js: any) => {};

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const p5 = await import('p5');

			p5Instance = new p5.default((p5js: import('p5')) => {
				p5js.setup = () => setup(p5js);
				p5js.draw = () => draw(p5js);
				p5js.windowResized = () => windowResized(p5js);
				p5js.mouseMoved = () => mouseMoved(p5js);
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

<div bind:this={canvas}></div>
