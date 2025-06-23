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
	class="bg-accent z-50 mx-5 flex min-w-fit flex-row items-center space-x-5 px-5 transition-all duration-200 ease-in-out {fixed
		? 'fixed top-0 w-full justify-start rounded-none'
		: 'relative mb-5 w-8/10 justify-center rounded-full lg:w-4/5'}"
>
	<HeaderButton link="#">About</HeaderButton>
	<HeaderButton link="#summary">Summary</HeaderButton>
	<HeaderButton link="#skills">Skills</HeaderButton>
	<HeaderButton link="#internship">Internship</HeaderButton>
	<HeaderButton link="#personal-projects">Projects</HeaderButton>
	<HeaderButton link="#contact">Contact</HeaderButton>
</header>
