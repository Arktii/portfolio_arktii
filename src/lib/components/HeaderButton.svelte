<script lang="ts">
	export let link: string = '';
</script>

<a
	class="	font-economica text-primary text-base font-bold transition-all duration-300
			ease-in-out hover:text-2xl hover:font-black"
	href={link}
>
	<slot />
</a>
