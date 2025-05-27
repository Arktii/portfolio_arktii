<script lang="ts">
	import Canvas from '$lib/components/interactive/Canvas.svelte';
	import { CollisionSpace } from '$lib/models/CollisionSpace';

	let collisionSpace: CollisionSpace;

	function setup(p5: import('p5')) {
		collisionSpace = new CollisionSpace(0, 0, 500, 500, 50);
	}

	function update(p5: import('p5'), deltaTime: number) {
		p5.circle(p5.mouseX, p5.mouseY, 250);
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

<Canvas {setup} {update} {keyPressed} />
