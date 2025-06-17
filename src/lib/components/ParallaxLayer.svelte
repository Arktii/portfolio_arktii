<script lang="ts">
	import { onMount } from 'svelte';

	export let zIndex: number = -10;
	export let source: string = '';
	export let offsetX: number = 0;
	export let offsetY: number = 0;

	export let opacity: number = 1.0;
	/**
	 * from 0 to 1.0
	 */
	export let scrollSpeed: number = 0.5;
	export let mousePanSpeed: number = 0;

	let counterScroll = 0;
	let towardsY = 0;
	let towardsX = 0;

	onMount(() => {
		function handleScroll() {
			counterScroll = -window.scrollY * scrollSpeed;
		}

		function handleMousemove(event: MouseEvent) {
			towardsX = (event.clientX - window.innerWidth / 2) * mousePanSpeed + offsetX;
			towardsY = (event.clientY - window.innerHeight / 2) * mousePanSpeed;
		}

		handleScroll();

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('mousemove', handleMousemove);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMousemove);
		};
	});
</script>

<div
	class="{source.length == 0 ? 'bg-primary' : ''} fixed h-full w-full bg-repeat"
	style="background-image: url({source}); background-position: {towardsX +
		offsetX}px {counterScroll + towardsY + offsetY}px; z-index: {zIndex}; opacity: {opacity};"
></div>
<!-- <div class="bg-secondary fixed z-[{zIndex}] h-full w-full"></div> -->
