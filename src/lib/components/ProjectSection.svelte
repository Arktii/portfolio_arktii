<script lang="ts">
	import type { BadgeType, ProjectCardInfo } from '$lib/types/projectDisplay';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Badge from './Badge.svelte';
	import { chooseBadgeColor } from '$lib/utils/BadgeColors';

	let count = 0;
	let activeId = -1;
	let active: ProjectCardInfo | null = null;

	// Use a writable store for reactivity across context consumers
	const activeCardId = writable(0);
	const activeCardInfo = writable<ProjectCardInfo | null>(null);

	activeCardId.subscribe(updateActiveId);
	activeCardInfo.subscribe(updateActiveInfo);

	function updateActiveId(id: number) {
		activeId = id;
	}

	function updateActiveInfo(info: ProjectCardInfo | null) {
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
		activeCardInfo.set(null);
	}

	setContext('projectSection', {
		registerSelf,
		select,
		deselect,
		activeCardId
	});
</script>

<!-- Display -->
{#if active != null}
	<div class="bg-secondary mb-3 flex flex-col items-start p-2 md:flex-row">
		<img src={active.image} alt={active.title} class="h-auto w-full max-w-xs" />
		<div class="flex flex-col items-start">
			<div class="p-5">
				<p class="text-primary">
					This is a short description of the project. You can put any text here.
				</p>
			</div>
			<div class="flex flex-row items-end justify-end gap-2 self-end">
				{#each active.badges as badgeInfo}
					<Badge bgColor={chooseBadgeColor(badgeInfo.type)}>{badgeInfo.name}</Badge>
				{/each}
			</div>
		</div>
	</div>
{/if}

<slot />
