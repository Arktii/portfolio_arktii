<script lang="ts">
	export let isCurrent: boolean = false;
	export let link: string = '';
</script>

<a
	href={link}
	class="transition-all duration-300 ease-in-out {isCurrent
		? 'font-lexend-giga text-xl font-bold'
		: 'font-economica text-base font-bold'}"
>
	<slot />
</a>
