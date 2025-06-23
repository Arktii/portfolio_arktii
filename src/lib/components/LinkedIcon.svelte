<script lang="ts">
	import { Icon, type IconType } from 'svelte-icons-pack';

	export let href: string;
	export let icon: IconType;
</script>

<a
	{href}
	target="_blank"
	class="hover:border-secondary-accent overflow-hidden rounded-2xl border-transparent p-1 transition-all duration-300 hover:border-1 hover:p-2"
>
	<Icon src={icon} size={'35px'} color={'var(--color-secondary-accent)'} />
</a>
