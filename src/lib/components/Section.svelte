<script lang="ts">
	export let id: string = '';
	export let header: string = 'Header';
	export let headerSubtitle: string = '';
</script>

<div class="w-7/10 max-w-200 py-5" {id}>
	<h2>{header}</h2>
	{#if headerSubtitle.length > 0}
		<p class="font-lexend text-neutral text-left text-xl font-bold">
			{headerSubtitle}
		</p>
	{/if}

	<div class="my-12"></div>

	<slot />
</div>
