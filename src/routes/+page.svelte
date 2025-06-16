<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Interactive from '$lib/components/interactive/Interactive.svelte';
	import ParallaxLayer from '$lib/components/ParallaxLayer.svelte';
	import Section from '$lib/components/Section.svelte';

	import grid128 from '$lib/images/background/grid-128.png';
	import grid64 from '$lib/images/background/grid-64.png';

	let currentSection: number = -1;

	const languageBadgeColor = '#d8d9da';
	const frameworkBadgeColor = '#e2d9be';
	const platformBadgeColor = '#8a7f71';
</script>

<main>
	<ParallaxLayer zIndex={-15} scrollSpeed={0.1} />
	<ParallaxLayer
		source={grid64}
		zIndex={-13}
		scrollSpeed={0.25}
		mousePanSpeed={0.05}
		offsetY={64}
		offsetX={64}
		opacity={0.05}
	/>
	<ParallaxLayer
		source={grid128}
		zIndex={-12}
		scrollSpeed={0.5}
		mousePanSpeed={0.1}
		opacity={0.15}
	/>

	<div class="flex flex-col items-center pt-10">
		<div class="bg-primary w-7/10 max-w-200 p-5">
			<h1>Hi, I'm Emir.</h1>
			<p class="font-lexend text-accent text-left text-2xl font-bold">
				Software Developer (Fresh Graduate)
			</p>

			<p class="text-secondary my-15 text-xl">
				Welcome to my portfolio. First, enjoy an interactive summary of everything. Click around,
				catch some mice, then when you're done exploring, navigate to the more detailed sections
				below it.
			</p>
		</div>

		<HeaderBar {currentSection} />

		<Section header="Interactive Summary" id="summary">
			<div class="flex w-full flex-col items-center">
				<h3 class="mb-3">Controls</h3>

				<div class="mb-5 flex w-600 flex-row space-x-5">
					<div class="flex w-full flex-col items-end">
						<strong>A/D</strong>
						<strong>W/S</strong>
						<strong>Q/E</strong>
						<strong>Mouse Buttons</strong>
					</div>
					<div class="flex w-full flex-col">
						<p>Move left / right</p>
						<p>Jump up / down</p>
						<p>Interact</p>
						<p>Interact</p>
					</div>
				</div>
			</div>
		</Section>

		<hr class="border-accent w-full border-1" />

		<Interactive />

		<hr class="border-accent w-full border-1" />

		<Section header="About Me" id="about">
			<p class="my-10">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>

			<h3 class="pt-3">Skills</h3>
			<p class="font-lexend text-neutral pb-3 text-left text-lg font-bold">
				Languages, Engines, Frameworks, and Libraries
			</p>

			<h4 class="py-2">Favorites</h4>
			<Badge bgColor={languageBadgeColor}>C#</Badge>
			<Badge bgColor={languageBadgeColor}>Python</Badge>
			<Badge bgColor={languageBadgeColor}>Rust</Badge>
			<Badge bgColor={frameworkBadgeColor}>Unity</Badge>
			<Badge bgColor={frameworkBadgeColor}>Godot</Badge>

			<h4 class="pt-2">Completed Projects Using</h4>
			<p class="font-lexend text-neutral pb-2 text-left">(aside from the Favorites)</p>
			<Badge bgColor={languageBadgeColor}>TypeScript</Badge>
			<Badge bgColor={languageBadgeColor}>JavaScript</Badge>
			<Badge bgColor={languageBadgeColor}>Dart</Badge>
			<Badge bgColor={frameworkBadgeColor}>Bevy</Badge>
			<Badge bgColor={frameworkBadgeColor}>Svelte</Badge>
			<Badge bgColor={frameworkBadgeColor}>Flutter</Badge>

			<h4 class="pt-2">Exposed To</h4>
			<p class="font-lexend text-neutral pb-2 text-left">
				Used for smaller school and personal projects
			</p>
			<Badge bgColor={languageBadgeColor}>C</Badge>
			<Badge bgColor={languageBadgeColor}>C++</Badge>
			<Badge bgColor={languageBadgeColor}>Php</Badge>
			<Badge bgColor={languageBadgeColor}>Lua</Badge>
			<Badge bgColor={languageBadgeColor}>Assembly (NASM x86)</Badge>
			<Badge bgColor={frameworkBadgeColor}>Laravel</Badge>

			<h3 class="py-3">Education</h3>

			<p>Short section</p>
		</Section>

		<Section header="Internship" id="internship">
			<p class="text-secondary my-10">
				Although I cannot disclose the specific details, for my internship at DOST, I worked on a
				mobile application using Flutter for the frontend, and Laravel for the backend. I worked on
				both the frontend and backend.
			</p>

			<br />

			<Badge bgColor={languageBadgeColor}>Dart</Badge>
			<Badge bgColor={languageBadgeColor}>Php</Badge>
			<Badge bgColor={frameworkBadgeColor}>Flutter</Badge>
			<Badge bgColor={frameworkBadgeColor}>Laravel</Badge>
			<Badge bgColor={platformBadgeColor}>Mobile</Badge>
		</Section>

		<Section header="Personal Projects" headerSubtitle="Selected Works" id="projects">
			<p class="text-secondary my-10">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>

		<Section header="School Projects" headerSubtitle="Selected Works">
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>

		<Section header="Relevant Links" headerSubtitle="and contact information" id="links">
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie erat risus, quis
				sollicitudin leo lacinia in. Nam iaculis libero non arcu rutrum, vulputate aliquam neque
				egestas. Nulla facilisi. Nullam vel metus quis ligula bibendum mattis a eget diam. Vivamus
				viverra ex at nunc mattis, et elementum eros mattis. Pellentesque in nisl non dui commodo
				posuere vitae vel sem. Quisque ut gravida ante.
			</p>
		</Section>
		<p>Bottom of the screen</p>
	</div>
</main>
