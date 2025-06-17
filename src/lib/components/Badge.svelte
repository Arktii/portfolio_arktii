<script lang="ts">
	import { BadgeType } from '$lib/types/projectTypes';
	import { chooseBadgeColor } from '$lib/utils/BadgeColors';

	// export let bgColor: string = '#d8d9da';
	// export let textColor: string = '#171412';

	export let type: BadgeType = BadgeType.Language;

	const [bgColor, textColor] = chooseBadgeColor(type);
</script>

<!--Sheen effect modified from https://ibelick.com/blog/create-shine-effect-on-card-with-tailwind-css-->
<span
	class="shadow-primary/35 inline-block rounded-sm bg-[linear-gradient(100deg,transparent_25%,rgba(255,255,255,1)_50%,transparent_75%,transparent_100%)]
        bg-[length:250%_250%,100%_100%]
        bg-[position:200%_0,0_0] bg-no-repeat
        px-1 py-0.5 text-sm shadow-sm transition-[background-position_0s_ease]
        duration-1000 hover:bg-[position:-75%_0,0_0] hover:duration-[1000ms]"
	style="background-color: {bgColor}; color: {textColor};"
>
	<slot />
</span>
