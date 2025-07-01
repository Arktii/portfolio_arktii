<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderButton from './HeaderButton.svelte';

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

		scrollHandler();

		window.addEventListener('scroll', scrollHandler);
		return () => window.removeEventListener('scroll', scrollHandler);
	});
</script>

<div class="mt-5" bind:this={referencePoint}></div>
<header
	bind:this={header}
	class="bg-accent/25 border-secondary/35 shadow-primary/10 px-auto z-50 mx-5
		h-fit touch-pan-x items-center justify-center overflow-x-auto py-2 shadow-xl
		backdrop-blur-lg transition-all duration-200 ease-in-out {fixed
		? 'fixed top-0 w-full rounded-none border-b-1 md:justify-start'
		: 'relative mb-5 w-9/10 rounded-lg border-1 lg:w-8/10'}"
>
	<div
		class="mx-auto flex w-fit flex-row flex-nowrap justify-center space-x-2.5 px-1.5 md:space-x-5"
	>
		<HeaderButton link="#">About</HeaderButton>
		<HeaderButton link="#summary">Summary</HeaderButton>
		<HeaderButton link="#skills">Skills</HeaderButton>
		<HeaderButton link="#internship">Internship</HeaderButton>
		<HeaderButton link="#personal-projects">Projects</HeaderButton>
		<HeaderButton link="#contact">Contact</HeaderButton>
	</div>
</header>
{#if fixed}
	<!-- Invisible div to replace header when it moves to top -->
	<div class="relative mb-5 w-full overflow-x-auto border-1 px-2.5 py-2 opacity-0 backdrop-blur-lg">
		<HeaderButton>A</HeaderButton>
	</div>
{/if}
