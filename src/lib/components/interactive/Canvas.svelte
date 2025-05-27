<script lang="ts">
	import P5 from '$lib/components/P5.svelte';

	export let setup = (p5: import('p5')) => {};
	export let update = (p5: import('p5'), deltaTime: number) => {};
	export let windowResized = (p5: import('p5')) => {};
	export let mouseMoved = (p5: import('p5')) => {};
    export let keyPressed = (p5: import('p5')) => {};

	function canvasSetup(p5: import('p5')) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.pixelDensity(1);
		p5.noSmooth();

		setup(p5);
	}

	function draw(p5: import('p5')) {
		p5.clear();

		update(p5, p5.deltaTime);
	}
</script>

<div>
	<P5 setup={canvasSetup} {draw} {windowResized} {mouseMoved} {keyPressed} />
</div>
