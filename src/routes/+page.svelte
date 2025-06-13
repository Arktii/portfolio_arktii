<script lang="ts">
	import Interactive from '$lib/components/interactive/Interactive.svelte';
</script>

<main class="bg-[url(src/lib/images/background/night-sky.png)] bg-repeat">
	<div class="flex flex-col items-center pt-10">
		<div class="my-8 max-w-7/10">
			<h1 class="font-lexend-giga text-4xl font-bold text-amber-50">Hi! I'm Emir.</h1>
			<h2 class="font-lexend mb-10 text-2xl font-bold text-gray-400">
				fresh grad, pls give job : >
			</h2>

			<p class="text-amber-50">
				Enjoy this interactive summary. Click around, catch some mice, then when you're done
				exploring, navigate to the other details below.
			</p>

			<p class="mt-10 text-center text-amber-50">Header Bar here</p>
		</div>

		<Interactive />

		<p>Bottom of the screen</p>
	</div>
</main>
