<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { FiChevronLeft, FiChevronRight, FiCircle } from 'svelte-icons-pack/fi';

	const buttonSize = 6;

	export let images: string[];
	export let alt: string;

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

	function select(index: number) {
		current = index;
	}
</script>

<div class="flex w-full flex-col gap-1">
	<div class="relative w-full overflow-clip rounded-lg">
		{#if images.length > 0}
			<img class="h-full w-full {pixelArt ? 'pixelated' : ''}" src={images[current]} {alt} />
		{/if}
	</div>
	{#if images.length > 1}
		<div class="flex-between flex h-10 flex-row items-center p-2">
			<button
				class="hover:border-accent cursor-pointer items-center
	rounded-full border-1 border-transparent transition-all duration-300 hover:scale-125"
				onclick={prev}
				aria-label="prev"
			>
				<Icon
					src={FiChevronLeft}
					color="var(--color-secondary)"
					size="calc(var(--spacing) * {buttonSize})"
				/>
			</button>
			<div class="bottom-2 flex h-6 w-full flex-row items-center justify-center gap-1">
				{#each { length: images.length } as _, i}
					<button
						class="cursor-pointer items-center rounded-full
								border-1 p-1.5 transition-all duration-300 hover:scale-135
								{i == current ? 'border-secondary bg-secondary' : 'border-accent bg-transparent'}"
						aria-label="image-{i}"
						onclick={() => select(i)}
					></button>
				{/each}
			</div>
			<button
				class="hover:border-accent cursor-pointer items-center
				rounded-full border-1 border-transparent transition-all duration-300 hover:scale-125"
				onclick={next}
				aria-label="next"
			>
				<Icon
					src={FiChevronRight}
					color="var(--color-secondary)"
					size="calc(var(--spacing) * {buttonSize})"
				/>
			</button>
		</div>
	{/if}
</div>
