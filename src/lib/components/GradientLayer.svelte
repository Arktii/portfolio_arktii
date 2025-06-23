<script lang="ts">
	import { onMount } from 'svelte';

	export let zIndex: number = -10;
	export let offsetX: number = 0;
	export let offsetY: number = 0;

	export let gradientColorCode: string = 'rgba(95, 169, 173, 0.15) 10%, var(--color-primary) 80%';
	export let opacity: number = 1.0;
	export let mousePanSpeed: number = 0;

	let towardsY = 0;
	let towardsX = 0;

	let windowHalfX = 0;
	let windowHalfY = 0;

	onMount(() => {
		function handleMousemove(event: MouseEvent) {
			towardsX = (event.clientX - window.innerWidth / 2) * mousePanSpeed + offsetX;
			towardsY = (event.clientY - window.innerHeight / 2) * mousePanSpeed;
		}

		function handleResize() {
			windowHalfX = window.innerWidth / 2;
			windowHalfY = window.innerHeight / 2;
		}

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div
	class="fixed h-full w-full bg-no-repeat"
	style="
        background-image: 
            radial-gradient(circle at
            {towardsX + offsetX + windowHalfX}px 
            {towardsY + offsetY + windowHalfY}px,
            {gradientColorCode});
        z-index: {zIndex}; opacity: {opacity};"
></div>
<!-- <div class="bg-secondary fixed z-[{zIndex}] h-full w-full"></div> -->
