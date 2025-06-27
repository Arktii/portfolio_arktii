<script lang="ts">
	import { type ProjectCardInfo } from '$lib/types/projectTypes';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Badge from './Badge.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { FiX, FiExternalLink } from 'svelte-icons-pack/fi';

	import { fade } from 'svelte/transition';
	import Carousel from './Carousel.svelte';

	const placeholderInfo = {
		title: '',
		images: [],
		description: '',
		date: '',
		badges: []
	};

	export let pixelated: boolean = false;

	let count = 0;
	let activeId = -1;
	let active: ProjectCardInfo = placeholderInfo;

	// Use a writable store for reactivity across context consumers
	const activeCardId = writable(-1);
	const activeCardInfo = writable<ProjectCardInfo>(placeholderInfo);

	let carousel: Carousel;

	activeCardId.subscribe(updateActiveId);
	activeCardInfo.subscribe(updateActiveInfo);

	function updateActiveId(id: number) {
		activeId = id;
	}

	function updateActiveInfo(info: ProjectCardInfo) {
		active = info;
	}

	/**
	 * returns an id for the registering card
	 */
	function registerSelf(): number {
		count += 1;
		return count - 1;
	}

	function select(id: number, cardInfo: ProjectCardInfo) {
		activeCardId.set(id);
		activeCardInfo.set(cardInfo);

		carousel?.resetIndex();
	}

	function deselect() {
		activeCardId.set(-1);
		activeCardInfo.set(placeholderInfo);

		carousel?.resetIndex();
	}

	setContext('projectSection', {
		registerSelf,
		select,
		deselect,
		activeCardId
	});
</script>

<!-- Display -->
{#if activeId === -1}
	<div in:fade={{ delay: 300, duration: 300 }} class="border-accent mb-3 rounded-xl border-1 p-1">
		<p class="text-secondary w-full text-center">Click a card to see more details.</p>
	</div>
{:else}
	<div
		class="border-accent mb-3 flex scale-y-100 flex-col items-center rounded-xl border-1 p-2"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
	>
		<button
			class="hover:border-accent absolute top-2 right-2 z-20 cursor-pointer rounded-full border-1 border-transparent p-1
transition-all duration-300 hover:scale-125"
			aria-label="Close"
			on:click={deselect}
		>
			<Icon src={FiX} color="var(--color-secondary)" />
		</button>

		<div class="flex w-full flex-col items-start p-3">
			<Carousel
				bind:this={carousel}
				images={active.images}
				alt={active.title}
				pixelArt={pixelated}
				className="rounded-lg overflow-clip"
			/>
			{#if active.link}
				<a
					class="text-secondary text-bold hover:border-secondary font-urbanist
								mt-1 flex w-fit flex-row items-start gap-1
								rounded-lg border-1 border-transparent p-0.5
								text-2xl transition-all duration-300 hover:scale-105"
					href={active.link}
					target="_blank"
				>
					{active.title}
					<Icon src={FiExternalLink} size="15px" />
				</a>
			{:else}
				<p class="text-secondary text-bold mt-1 border-1 border-transparent p-0.5 text-2xl">
					{active.title}
				</p>
			{/if}
			<p class="text-neutral">{active.date}</p>
			<p class="text-secondary">{active.description}</p>
			<div class="flex flex-row flex-wrap justify-start gap-1 self-start">
				{#each active.badges as badgeInfo}
					<Badge type={badgeInfo.type}>{badgeInfo.name}</Badge>
				{/each}
			</div>
		</div>
	</div>
{/if}

<slot />
