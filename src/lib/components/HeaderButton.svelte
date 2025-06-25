<script lang="ts">
	export let link: string = '';
</script>

<a
	class=" font-urbanist text-secondary text-base font-bold transition-all
			duration-300 ease-in-out hover:font-black hover:underline md:text-lg"
	href={link}
>
	<slot />
</a>
