<script lang="ts">
	import { onMount } from 'svelte';

	export let onChange = (isIntersecting: boolean) => {};

	// TODO?: export?
	const options = { threshold: 0.1 };

	let observer: IntersectionObserver;
	let element: Element;

	onMount(() => {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				onChange(entry.isIntersecting);
			});
		}, options);

		observer.observe(element);

		return () => observer.unobserve(element);
	});
</script>

<div bind:this={element}></div>
