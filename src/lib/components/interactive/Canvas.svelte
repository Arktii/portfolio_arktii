<script lang="ts">
	import P5 from '$lib/components/P5.svelte';

	function setup(p5: import('p5')) {
		console.log(p5.windowWidth);
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.pixelDensity(1);
		p5.noSmooth();
	}

	function draw(p5: import('p5')) {
		console.log('draw');
        p5.clear();
		p5.circle(p5.mouseX, p5.mouseY, 50);
	}

	function windowResized(p5: import('p5')) {
		console.log('Window resized: ', p5.windowWidth, ', ', p5.windowHeight);
	}

	function mouseMoved(p5: import('p5')) {}
</script>

<div>
	<P5 {setup} {draw} {windowResized} {mouseMoved} />
</div>
