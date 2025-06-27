<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { FiChevronLeft, FiChevronRight } from 'svelte-icons-pack/fi';

	const buttonSize = 6;

	export let images: string[];
	export let alt: string;

	export let className: string = '';
	export let pixelArt: boolean = false;

	let current: number = 0;

	export function resetIndex() {
		current = 0;
	}

	function next() {
		current = (current + 1) % images.length;
	}

	function prev() {
		current = (current - 1 + images.length) % images.length;
	}
</script>

<div class="relative inline-block w-full {className}">
	{#if images.length > 0}
		<img class="h-full w-full {pixelArt ? 'pixelated' : ''}" src={images[current]} {alt} />
	{/if}
	{#if images.length > 1}
		<button
			class="border-accent hover:border-secondary absolute bottom-2.5 left-2.5 z-11 cursor-pointer
                items-center rounded-full border-1 transition-all duration-300 hover:scale-125"
			onclick={prev}
			aria-label="prev"
		>
			<Icon
				src={FiChevronLeft}
				color="var(--color-secondary)"
				size="calc(var(--spacing) * {buttonSize})"
			/>
		</button>
		<button
			class="border-accent hover:border-secondary absolute right-2.5 bottom-2.5 z-11 cursor-pointer
                items-center rounded-full border-1 transition-all duration-300 hover:scale-125"
			onclick={next}
			aria-label="next"
		>
			<Icon
				src={FiChevronRight}
				color="var(--color-secondary)"
				size="calc(var(--spacing) * {buttonSize})"
			/>
		</button>
		<div
			class="bg-primary/50 pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12.5"
		></div>
	{/if}
</div>
