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
	class="bg-secondary/25 border-accent/35 shadow-primary/10 z-50 mx-5 flex min-w-fit flex-row items-center justify-center space-x-2.5 px-2.5 shadow-xl backdrop-blur-lg
		transition-all duration-200 ease-in-out md:space-x-5 {fixed
		? 'fixed top-0 w-full rounded-none border-b-1 md:justify-start'
		: 'relative mb-5 w-9/10 rounded-lg border-1 lg:w-8/10'}"
>
	<HeaderButton link="#">About</HeaderButton>
	<HeaderButton link="#summary">Summary</HeaderButton>
	<HeaderButton link="#skills">Skills</HeaderButton>
	<HeaderButton link="#internship">Internship</HeaderButton>
	<HeaderButton link="#personal-projects">Projects</HeaderButton>
	<HeaderButton link="#contact">Contact</HeaderButton>
</header>
{#if fixed}
	<!-- Invisible div to replace header when it moves to top -->
	<header
		bind:this={header}
		class="relative mb-5 w-full border-1 px-2.5 opacity-0 backdrop-blur-lg"
	>
		<HeaderButton>_</HeaderButton>
	</header>
{/if}
