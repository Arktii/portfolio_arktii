<script lang="ts">
	import type { ProjectCardInfo } from '$lib/types/projectTypes';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { type Readable } from 'svelte/store';
	import Badge from './Badge.svelte';

	export let cardHeight: number = 65;

	export let info: ProjectCardInfo;

	let isActive = false;

	let scrollContainer: Element;

	const { registerSelf, select, deselect, activeCardId } = getContext<{
		registerSelf: () => number;
		select: (id: number, cardInfo: ProjectCardInfo) => void;
		deselect: () => void;
		activeCardId: Readable<number>;
	}>('projectSection');
	const cardId = registerSelf();

	const unsubscribe = activeCardId.subscribe((activeId: number) => {
		isActive = activeId == cardId;
	});

	function selectThis() {
		select(cardId, info);
	}

	onDestroy(unsubscribe);
</script>

<button
	class="hover:border-secondary w-full overflow-hidden rounded-sm transition-all duration-500 hover:border-1 hover:p-1.5"
	style="	height: calc(var(--spacing) * {cardHeight}); image-rendering: pixelated;"
	on:click={selectThis}
>
	<div
		class="flex h-full flex-col justify-end overflow-hidden rounded-sm bg-cover bg-top shadow-[inset_0_15px_15px_rgba(0,0,0,0.7)] transition-all duration-500"
		style="background-image: url('{info.images[0]}');"
	>
		<!-- Footer Slot (badges, description, etc) -->
		<div
			class="bg-secondary z-2 flex h-24.5 flex-col items-start justify-between px-2 py-1 shadow-white"
		>
			<p class="font-lexend text-primary text-lg">{info.title}</p>
			<div
				bind:this={scrollContainer}
				class="flex w-full flex-row flex-wrap items-start justify-start gap-1 py-0.5"
			>
				{#each info.badges as badgeInfo}
					<Badge type={badgeInfo.type}>{badgeInfo.name}</Badge>
				{/each}
				<slot />
			</div>
		</div>
	</div>
</button>
