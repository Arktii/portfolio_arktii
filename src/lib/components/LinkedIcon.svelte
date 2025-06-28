<script lang="ts">
	import { Icon, type IconType } from 'svelte-icons-pack';

	export let href: string;
	export let icon: IconType;
</script>

<a
	{href}
	target="_blank"
	class="hover:border-secondary-accent overflow-hidden rounded-2xl border-1 border-transparent p-2 transition-all duration-300"
>
	<Icon src={icon} size={'35px'} color={'var(--color-secondary-accent)'} />
</a>
