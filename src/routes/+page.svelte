<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Interactive from '$lib/components/interactive/Interactive.svelte';
	import LinkedIcon from '$lib/components/LinkedIcon.svelte';
	import ParallaxLayer from '$lib/components/ParallaxLayer.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectSection from '$lib/components/ProjectSection.svelte';
	import Section from '$lib/components/Section.svelte';

	// images
	import grid128 from '$lib/images/background/grid-128.png';
	import grid64 from '$lib/images/background/grid-64.png';
	import grid32 from '$lib/images/background/grid-32.png';
	import beastBonds from '$lib/images/projects/beast-bonds.png';
	import chasmsCall from '$lib/images/projects/chasms-call.png';
	import flickeringFlame from '$lib/images/projects/flickering-flame.png';
	import timeflowers from '$lib/images/projects/timeflowers.png';
	import wreckingWhiskers from '$lib/images/projects/wrecking-whiskers.png';

	import beastBonds1 from '$lib/images/projects/screenshots/beast-bonds-1.png';
	import beastBonds2 from '$lib/images/projects/screenshots/beast-bonds-2.png';
	import beastBonds3 from '$lib/images/projects/screenshots/beast-bonds-3.png';

	import chasmsCall1 from '$lib/images/projects/screenshots/chasms-call-1.png';
	import chasmsCall2 from '$lib/images/projects/screenshots/chasms-call-2.png';
	import chasmsCall3 from '$lib/images/projects/screenshots/chasms-call-3.png';

	import flickeringFlame1 from '$lib/images/projects/screenshots/flickering-flame-1.png';
	import flickeringFlame2 from '$lib/images/projects/screenshots/flickering-flame-2.png';
	import flickeringFlame3 from '$lib/images/projects/screenshots/flickering-flame-3.png';

	import timeflowers1 from '$lib/images/projects/screenshots/timeflowers-1.png';
	import timeflowers2 from '$lib/images/projects/screenshots/timeflowers-2.png';
	import timeflowers3 from '$lib/images/projects/screenshots/timeflowers-3.png';
	import timeflowers4 from '$lib/images/projects/screenshots/timeflowers-4.png';

	import wreckingWhiskers1 from '$lib/images/projects/screenshots/wrecking-whiskers-1.png';
	import wreckingWhiskers2 from '$lib/images/projects/screenshots/wrecking-whiskers-2.png';
	import wreckingWhiskers3 from '$lib/images/projects/screenshots/wrecking-whiskers-3.png';

	import charge1 from '$lib/images/projects/screenshots/charge-1.png';
	import charge2 from '$lib/images/projects/screenshots/charge-2.png';
	import charge3 from '$lib/images/projects/screenshots/charge-3.png';
	import charge4 from '$lib/images/projects/screenshots/charge-4.png';
	import charge5 from '$lib/images/projects/screenshots/charge-5.png';

	import subaybay1 from '$lib/images/projects/screenshots/subaybay-1.png';
	import subaybay2 from '$lib/images/projects/screenshots/subaybay-2.png';
	import subaybay3 from '$lib/images/projects/screenshots/subaybay-3.png';
	import subaybay4 from '$lib/images/projects/screenshots/subaybay-4.png';
	import subaybay5 from '$lib/images/projects/screenshots/subaybay-5.png';

	import specialProblem1 from '$lib/images/projects/screenshots/special-problem-1.png';

	import { BadgeType } from '$lib/types/projectTypes';

	import { SiMessenger, SiLinkedin, SiGithub, SiGmail } from 'svelte-icons-pack/si';
	import GradientLayer from '$lib/components/GradientLayer.svelte';
	import { onMount } from 'svelte';

	let interactiveEnabled = true;

	const preload = [
		beastBonds1,
		beastBonds2,
		beastBonds3,
		timeflowers1,
		timeflowers2,
		timeflowers3,
		timeflowers4,
		wreckingWhiskers1,
		wreckingWhiskers2,
		wreckingWhiskers3,
		charge1,
		charge2,
		charge3,
		subaybay1,
		subaybay2,
		subaybay3,
		subaybay4,
		subaybay5,
		specialProblem1
	];

	onMount(() => {
		preload.forEach((src) => {
			const img = new Image();
			img.src = src;
		});
	});
</script>

<main class="w-full overflow-clip">
	<ParallaxLayer zIndex={-15} scrollSpeed={0.1} />
	<ParallaxLayer
		source={grid32}
		zIndex={-14}
		scrollSpeed={0.15}
		mousePanSpeed={0.025}
		offsetY={32}
		offsetX={32}
		opacity={0.04}
	/>
	<ParallaxLayer
		source={grid64}
		zIndex={-13}
		scrollSpeed={0.25}
		mousePanSpeed={0.05}
		offsetY={64}
		offsetX={64}
		opacity={0.08}
	/>
	<ParallaxLayer
		source={grid128}
		zIndex={-12}
		scrollSpeed={0.5}
		mousePanSpeed={0.125}
		opacity={0.21}
	/>

	<GradientLayer zIndex={-11} mousePanSpeed={0.15} opacity={1.0} />

	<div class="flex flex-col items-center py-10">
		<div
			class="bg-primary/75 border-accent/35 w-9/10 max-w-225 rounded-t-lg border-x-2 border-t-2 p-5 lg:w-4/5"
		>
			<h1>Hi, I'm Emir. ≽^⎚˕⎚^≼</h1>
			<p class="font-lexend text-accent text-left text-2xl font-bold">Software Developer</p>

			<p class="my-5 text-lg">
				Hello. I'm Grandemir Baysa-Pee, a computer science graduate and programmer from the
				Philippines. While I enjoy software development in general, I have a particular interest in
				game dev. Apart from code, I like cats, reading fiction, and making art.
				<br />
				<br />
				Below, you'll find details of my skills and some projects I've completed. But first, enjoy an
				interactive summary—click around, catch some mice, then when you're done, explore the detailed
				sections below it.
			</p>
		</div>

		<HeaderBar />

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

			<div class="mt-3 -mb-5 flex w-full flex-col items-center">
				<p class="text-sm">
					{#if interactiveEnabled}
						If you find the interactive summary distracting, you can close it using the button
						below.
					{:else}
						To open the interactive summary again, click the button below.
					{/if}
				</p>
				<button
					onclick={() => (interactiveEnabled = !interactiveEnabled)}
					class="border-accent text-secondary-accent font-urbanist
								hover:bg-secondary hover:text-primary hover:border-secondary mt-2.5 w-fit
								cursor-pointer self-center rounded-lg border-1 px-5
								py-1 text-base transition-all duration-300 hover:font-black"
				>
					{#if interactiveEnabled}
						Close
					{:else}
						Open
					{/if}
				</button>
			</div>
		</Section>

		{#if interactiveEnabled}
			<hr class="border-accent w-full border-1" />

			<Interactive />

			<hr class="border-accent w-full border-1" />
		{/if}

		<Section header="Skills" id="skills">
			<h3 class="pt-3">Technologies</h3>
			<p class="font-lexend text-neutral pb-3 text-left text-lg font-bold">
				Languages, Engines, Frameworks, and Libraries
			</p>

			<h4 class="py-2">Favorites</h4>
			<Badge type={BadgeType.Language}>C#</Badge>
			<Badge type={BadgeType.Language}>Python</Badge>
			<Badge type={BadgeType.Language}>Rust</Badge>
			<Badge type={BadgeType.Framework}>Unity</Badge>
			<Badge type={BadgeType.Framework}>Godot</Badge>

			<h4 class="pt-2">Completed Projects Using</h4>
			<p class="font-lexend text-neutral pb-2 text-left">
				aside from the Favorites, I've completed projects with these technologies
			</p>
			<Badge type={BadgeType.Language}>TypeScript</Badge>
			<Badge type={BadgeType.Language}>JavaScript</Badge>
			<Badge type={BadgeType.Language}>Dart</Badge>
			<Badge type={BadgeType.Framework}>Bevy</Badge>
			<Badge type={BadgeType.Framework}>Svelte</Badge>
			<Badge type={BadgeType.Framework}>Flutter</Badge>

			<h4 class="pt-2">Exposed To</h4>
			<p class="font-lexend text-neutral pb-2 text-left">
				I've used these for smaller school and personal projects
			</p>
			<Badge type={BadgeType.Language}>C</Badge>
			<Badge type={BadgeType.Language}>C++</Badge>
			<Badge type={BadgeType.Language}>Java</Badge>
			<Badge type={BadgeType.Language}>Lua</Badge>
			<Badge type={BadgeType.Language}>Php</Badge>
			<Badge type={BadgeType.Language}>Assembly (NASM x86)</Badge>
			<Badge type={BadgeType.Framework}>Laravel</Badge>

			<h3 class="pt-15 pb-3">Education</h3>
			<h4>Degree</h4>
			<p class="text-lg">
				BS Computer Science | University of the Philippines, Baguio (UPB). <br />
				Graduation: July 23, 2025. <br />
			</p>

			<h4 class="mt-5">Academic Honors</h4>
			<p class="text-lg">Summa Cum Laude</p>
		</Section>

		<Section header="Internship" id="internship">
			<p class="text-secondary my-3">
				In 2024, I had a 6 week internship with the Department of Science and Technology (DOST),
				where I worked on a mobile application using Flutter for the frontend, and Laravel for the
				backend. I worked on both the frontend and backend.
			</p>

			<br />

			<Badge type={BadgeType.Language}>Dart</Badge>
			<Badge type={BadgeType.Language}>Php</Badge>
			<Badge type={BadgeType.Framework}>Flutter</Badge>
			<Badge type={BadgeType.Framework}>Laravel</Badge>
			<Badge type={BadgeType.Framework}>MariaDB</Badge>
			<Badge type={BadgeType.Platform}>Mobile</Badge>
		</Section>

		<Section header="Personal Projects" headerSubtitle="Selected Works" id="personal-projects">
			<p class="text-secondary my-5">
				Here are some selected projects that I've completed in my free time.
			</p>

			<ProjectSection pixelated={true}>
				<div
					class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-center justify-center gap-2"
				>
					<ProjectCard
						info={{
							title: "Chasm's Call",
							images: [chasmsCall, chasmsCall1, chasmsCall2, chasmsCall3],
							description:
								'"Chasm\'s Call" is a singleplayer turn-based strategy rougelike\
							that takes place on a hexagonal grid. Although the game\'s scope is quite small,\
							it is more complete than my previous games as it contains a progress-saving\
							system, unlike the previous ones which, at most, could save high-scores.',
							date: '2024',
							link: 'https://fluff-feli.itch.io/chasms-call',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Godot', type: BadgeType.Framework }
							]
						}}
						pixelated={true}
					/>

					<ProjectCard
						info={{
							title: 'Flickering Flame',
							images: [flickeringFlame, flickeringFlame1, flickeringFlame2, flickeringFlame3],
							description:
								'"Flickering Flame" was made almost entirely for the purpose of\
							studying Rust and Bevy, which uses an Entity-Component-System approach as opposed to\
							other game engines\' object-oriented approach. The game is a simple arcade platformer,\
							with the special mechanic that the player\'s size and abilities change at certain health\
							milestones.',
							date: '2025',
							link: 'https://fluff-feli.itch.io/flickering-flame',
							badges: [
								{ name: 'Rust', type: BadgeType.Language },
								{ name: 'Bevy', type: BadgeType.Framework }
							]
						}}
						pixelated={true}
					/>

					<ProjectCard
						info={{
							title: 'Wrecking Whiskers',
							images: [wreckingWhiskers, wreckingWhiskers1, wreckingWhiskers2, wreckingWhiskers3],
							description:
								'"Wrecking Whiskers" is a small arcade game based on the old game, Ricochet.\
							The game was made to learn the Godot game engine before moving on to more complex projects.',
							date: '2023',
							link: 'https://fluff-feli.itch.io/wrecking-whiskers',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Godot', type: BadgeType.Framework }
							]
						}}
						pixelated={true}
					/>

					<ProjectCard
						info={{
							title: 'Timeflowers',
							images: [timeflowers, timeflowers1, timeflowers2, timeflowers3, timeflowers4],
							description:
								'"Timeflowers" was the first game that I completed enough to publish on itch.io.\
								The tile-based strategy game features the special mechanic of certain flowers\
								affecting the rate at which time passes. Combat-wise, the game uses a trap-based system, where\
								the player can only indirectly deal damage through the placing of traps.',
							date: '2023',
							link: 'https://fluff-feli.itch.io/timeflowers',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Unity', type: BadgeType.Framework }
							]
						}}
						pixelated={true}
					/>

					<ProjectCard
						info={{
							title: 'Beast Bonds',
							images: [beastBonds, beastBonds1, beastBonds2, beastBonds3],
							description:
								'"Beast Bonds" is a simple card-game inspired by a mix of games like Spellstone\
							and Texas Hold \'Em Poker. As it was made during the school year, it was my first experience\
							having to juggle multiple projects. Admittedly, the game suffers from a lack of a proper tutorial, making the gameplay confusing,\
							and time to flesh out the game design, however, it still served as a useful learning experience.',
							date: '2023',
							link: 'https://fluff-feli.itch.io/beast-bonds',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Unity', type: BadgeType.Framework }
							]
						}}
						pixelated={true}
					/>

					<p></p>
				</div>
			</ProjectSection>
		</Section>

		<Section header="School Projects" headerSubtitle="Selected Works" id="school-projects">
			<p class="text-secondary my-5">
				Here are some selected projects that I've completed for different classes.
			</p>

			<ProjectSection>
				<div
					class="grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] items-center justify-center gap-2"
				>
					<ProjectCard
						info={{
							title: 'UPB Subaybay',
							images: [subaybay1, subaybay2, subaybay3, subaybay4, subaybay5],
							description:
								'"UPB Subaybay" is a request tracker made for the Office of the University Registrar.\
								The application allows staff members to synchronize the progress in processing various requests for documents,\
								and pass tasks between each other.',
							date: '2023',
							link: 'https://github.com/brymer-meneses/Subaybay',
							badges: [
								{ name: 'TypeScript', type: BadgeType.Language },
								{ name: 'Tailwind', type: BadgeType.Framework },
								{ name: 'Svelte', type: BadgeType.Framework },
								{ name: 'MongoDB', type: BadgeType.Platform }
							]
						}}
					/>

					<ProjectCard
						info={{
							title: 'Charge!',
							images: [charge1, charge2, charge3, charge4, charge5],
							description:
								'"Charge!" is a 3d, multiplayer, turn-based strategy game made in Unity.\
							The networking aspects and connections were managed using the third-party networking solution, FishNet.\
							The game was hosted remotely using Amazon Web Services\' (AWS) Elastic Cloud Compute (EC2) service.',
							date: '2024',
							link: 'https://github.com/Arktii/charge_game_releases',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Unity', type: BadgeType.Framework },
								{ name: 'FishNet', type: BadgeType.Framework },
								{ name: 'AWS', type: BadgeType.Platform }
							]
						}}
					/>

					<ProjectCard
						info={{
							title: 'Special Problem',
							images: [specialProblem1],
							description:
								'My Bachelor\'s degree course did not have a thesis, but it did have\
							a "Special Problem", which needs to be defended like a thesis. My "Special Problem",\
							which I did with a pair, was titled "Genetic Programming in the Synthesis of Algebraic\
							Heuristic Functions for Pathfinding. The algorithm itself was implemented in Rust, but\
							the statistical tests were done using Python.',
							date: '2025',
							badges: [
								{ name: 'Rust', type: BadgeType.Language },
								{ name: 'Python', type: BadgeType.Language }
							]
						}}
					/>

					<p></p>
				</div>
			</ProjectSection>
		</Section>

		<Section header="Contact" id="contact">
			<p class="font-lexend text-neutral pb-2 text-left">
				You can reach me here or through the contact form below. <br />
				Thank you in advance for any job offers ദ്ദി/ᐠ｡‸｡ᐟ\.
			</p>

			<div class="flex w-full flex-row items-center justify-center space-x-5 p-5">
				<LinkedIcon href={import.meta.env.VITE_LINKEDIN_LINK} icon={SiLinkedin} />
				<LinkedIcon href={import.meta.env.VITE_GITHUB_LINK} icon={SiGithub} />
				<LinkedIcon href={import.meta.env.VITE_MESSENGER_LINK} icon={SiMessenger} />
			</div>

			<div class="border-secondary-accent flex w-full flex-col rounded-xl border-1 p-5">
				<h4 id="contact-form">Contact Form</h4>
				<p class="font-lexend text-neutral mb-7 text-left">powered by Formspree</p>

				<form class="flex w-full flex-col" action="https://formspree.io/f/mzzgvpwk" method="POST">
					<!-- identification details-->
					<div class="flex flex-row flex-wrap justify-stretch gap-x-2.5">
						<label>
							<p class="text-secondary text-sm">Name / Organization</p>
							<input
								class="min-w-70"
								name="name"
								type="text"
								placeholder="John Doe (Company Name Corp.)"
								required
							/>
						</label>
						<label>
							<p class="text-secondary text-sm">Email (where I can reply)</p>
							<input
								class="min-w-70"
								name="email"
								type="email"
								placeholder="email@example.com"
								required
							/>
						</label>
					</div>
					<!-- actual message -->
					<label>
						<p class="text-secondary text-sm">Message</p>
						<textarea
							class="w-full"
							name="message"
							placeholder="Greetings! We at [Company Name] have a [Role] opportunity that we believe aligns with your skills
=^･ω･^=."
							required
						></textarea>
					</label>
					<button
						class="	border-accent text-secondary-accent font-urbanist
								hover:bg-secondary hover:text-primary hover:border-secondary mt-2.5 w-fit
								cursor-pointer self-center rounded-lg border-1 px-5
								py-1 text-lg transition-all duration-300 hover:font-black"
						type="submit"
					>
						Send
					</button>
				</form>
			</div>
		</Section>

		<div
			class="bg-primary/75 border-accent/35 w-9/10 max-w-225 rounded-b-lg border-x-2 border-b-2 p-5 lg:w-4/5"
		>
			<p class="text-secondary my-5 w-full text-center text-xl">(=^･ｪ･^=))ﾉ彡☆</p>
		</div>
	</div>
</main>
