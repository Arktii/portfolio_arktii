<script lang="ts">
	import { BadgeType, type ProjectCardInfo } from '$lib/types/projectTypes';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Badge from './Badge.svelte';
	import { chooseBadgeColor } from '$lib/utils/BadgeColors';

	const placeholderInfo = {
		title: '',
		image: '',
		description: '',
		badges: []
	};

	let count = 0;
	let activeId = -1;
	let active: ProjectCardInfo = placeholderInfo;

	// Use a writable store for reactivity across context consumers
	const activeCardId = writable(-1);
	const activeCardInfo = writable<ProjectCardInfo>(placeholderInfo);

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
	}

	function deselect() {
		activeCardId.set(-1);
		activeCardInfo.set(placeholderInfo);
	}

	setContext('projectSection', {
		registerSelf,
		select,
		deselect,
		activeCardId
	});
</script>

<!-- Display -->
<div
	hidden={activeId === -1}
	class="border-accent mb-3 flex flex-col items-stretch rounded-xl border-1 p-2 transition-all duration-500 md:flex-row"
>
	<img
		src={active.image}
		alt={active.title}
		class="aspect-[1.264] w-200 rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg"
	/>
	<div class="flex w-full flex-col items-start">
		<div class="flex grow p-5">
			<p class="text-secondary">Description{active.description}</p>
		</div>
		<div class="flex flex-row-reverse items-end justify-between self-stretch pl-2">
			<div class="flex flex-row justify-end space-x-1 self-end">
				{#each active.badges as badgeInfo}
					<Badge bgColor={chooseBadgeColor(badgeInfo.type)}>{badgeInfo.name}</Badge>
				{/each}
			</div>

			{#if active.link}
				<div
					class="border-secondary-accent inline-block scale-100 rounded-sm border-1 px-2 py-1 text-center text-sm transition-[scale] duration-250 hover:scale-120"
				>
					<a href={active.link!} target="_blank" class="text-secondary-accent text-sm">Visit</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<slot />
