<script lang="ts">
	export let id: string = '';
	export let header: string = 'Header';
	export let headerSubtitle: string = '';
</script>

<div class="bg-primary/75 border-accent/35 w-9/10 max-w-225 border-x-2 p-5 lg:w-4/5" {id}>
	<h2>{header}</h2>
	{#if headerSubtitle.length > 0}
		<p class="font-lexend text-neutral text-left text-xl font-bold">
			{headerSubtitle}
		</p>
	{/if}

	<div class="my-5"></div>

	<slot />
</div>
