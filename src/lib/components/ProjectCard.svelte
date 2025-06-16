<script lang="ts">
	import type { ProjectCardInfo } from '$lib/types/projectDisplay';
	import { getContext, onDestroy } from 'svelte';
	import { type Readable } from 'svelte/store';
	import Badge from './Badge.svelte';
	import { chooseBadgeColor } from '$lib/utils/BadgeColors';

	export let cardHeight: number = 40;
	export let cardWidth: number = 50;

	export let info: ProjectCardInfo;

	let isActive = false;

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
	class="flex cursor-pointer flex-col justify-end
        overflow-hidden rounded-sm bg-cover bg-top
        shadow-[inset_0_35px_35px_rgba(0,0,0,1.0)]"
	style="background-image: url('{info.image}'); 
        height: calc(var(--spacing) * {cardHeight}); 
        width: calc(var(--spacing) * {cardWidth});"
	on:click={selectThis}
>
	<!-- Footer Slot (badges, description, etc) -->
	<div
		class="bg-secondary-accent z-2 flex h-17.5 flex-col items-start justify-between px-2 py-1 shadow-white"
	>
		<p class="font-lexend text-primary text-xl">{info.title}</p>
		<div class="flex-row items-start space-x-1">
			{#each info.badges as badgeInfo}
				<Badge bgColor={chooseBadgeColor(badgeInfo.type)}>{badgeInfo.name}</Badge>
			{/each}
			<slot />
		</div>
	</div>
</button>
