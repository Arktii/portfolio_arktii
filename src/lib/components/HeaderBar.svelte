<script lang="ts">
	import { onMount } from 'svelte';

	let fixed: boolean = false;

	let referencePoint: Element;
	let header: Element;

	onMount(() => {
		function scrollHandler() {
			const referenceRect = referencePoint.getBoundingClientRect();

			if (referenceRect.top <= 0) {
				fixed = true;
			} else {
				fixed = false;
			}
		}

		window.addEventListener('scroll', scrollHandler);
		return () => window.removeEventListener('scroll', scrollHandler);
	});
</script>

<div bind:this={referencePoint}></div>
<header
	bind:this={header}
	class="bg-accent flex flex-row items-start pl-5 transition-[width] duration-300 ease-in-out {fixed
		? 'fixed top-0 w-full rounded-none'
		: 'relative w-3/5 rounded-full'}"
>
	<p class="text-primary text text-center">
		↑ Summary About Personal Projects School Projects Links
	</p>
</header>
