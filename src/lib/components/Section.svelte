<script lang="ts">
	export let header: string = 'Header';
	export let headerSubtitle: string = '';
</script>

<div class="w-full max-w-7/10 py-8">
	<h2>{header}</h2>
	{#if headerSubtitle.length > 0}
		<p class="font-lexend text-neutral text-left text-xl font-bold">
			{headerSubtitle}
		</p>
	{/if}

	<div class="my-15"></div>

	<slot />
</div>
