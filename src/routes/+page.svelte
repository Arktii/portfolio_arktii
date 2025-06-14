<script lang="ts">
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Interactive from '$lib/components/interactive/Interactive.svelte';
	import ObservedPoint from '$lib/components/ObservedPoint.svelte';
	import Section from '$lib/components/Section.svelte';
</script>

<main class="bg-primary">
	<div class="flex flex-col items-center pt-10">
		<div class="max-w-7/10 py-8">
			<h1>Hi, I'm Emir.</h1>
			<p class="font-lexend text-accent text-left text-2xl font-bold">
				Software Developer (Fresh Graduate)
			</p>

			<p class="text-secondary my-20 text-xl">
				Welcome to my portfolio. First, enjoy an interactive summary of everything. Click around,
				catch some mice, then when you're done exploring, navigate to the more detailed sections
				below it.
			</p>
		</div>

		<HeaderBar />

		<ObservedPoint />

		<Section header="Interactive Summary">
			<h3 class="my-3">Controls</h3>
		</Section>

		<Interactive />

		<hr class="border-accent w-full border-2" />

		<Section header="About Me">
			<p class="my-10">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>

			<h3>Skills</h3>

			<p>TODO: add languages here</p>

			<h3>Education</h3>

			<p>Short section</p>
		</Section>

		<Section header="Personal Projects">
			<p class="text-secondary my-10 text-xl">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>

		<Section header="School Projects">
			<p class="my-10">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>

		<Section header="Contact Information">
			<p class="my-10">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>
		<p>Bottom of the screen</p>
	</div>
</main>
