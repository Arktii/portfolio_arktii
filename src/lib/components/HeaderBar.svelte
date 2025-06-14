<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderButton from './HeaderButton.svelte';

	export let currentSection: number = 0;

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

<div bind:this={referencePoint}></div>
<header
	bind:this={header}
	class="bg-accent mx-5 flex min-w-fit flex-row items-center space-x-5 px-5 transition-all duration-200 ease-in-out {fixed
		? 'fixed top-0 w-full justify-start rounded-none'
		: 'relative w-3/5 justify-center rounded-full'}"
>
	<HeaderButton isCurrent={currentSection == 1} link="#summary">Summary</HeaderButton>
	<HeaderButton isCurrent={currentSection == 2} link="#about">About</HeaderButton>
	<HeaderButton isCurrent={currentSection == 3} link="#internship">Internship</HeaderButton>
	<HeaderButton isCurrent={currentSection == 4} link="#projects">Projects</HeaderButton>
	<HeaderButton isCurrent={currentSection == 5} link="#links">Links</HeaderButton>
</header>
