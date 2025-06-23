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
	import beastBonds from '$lib/images/projects/beast-bonds.png';
	import chasmsCall from '$lib/images/projects/chasms-call.png';
	import flickeringFlame from '$lib/images/projects/flickering-flame.png';
	import timeflowers from '$lib/images/projects/timeflowers.png';
	import wreckingWhiskers from '$lib/images/projects/wrecking-whiskers.png';

	import charge from '$lib/images/projects/charge.png';
	import specialProblem from '$lib/images/projects/special-problem.png';
	import subaybay from '$lib/images/projects/subaybay.png';

	import { BadgeType } from '$lib/types/projectTypes';

	import { SiMessenger, SiLinkedin, SiGithub, SiGmail } from 'svelte-icons-pack/si';
	import GradientLayer from '$lib/components/GradientLayer.svelte';

	let currentSection: number = -1;
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
		opacity={0.075}
	/>
	<ParallaxLayer
		source={grid128}
		zIndex={-12}
		scrollSpeed={0.5}
		mousePanSpeed={0.1}
		opacity={0.2}
	/>

	<GradientLayer zIndex={-11} mousePanSpeed={0.15} opacity={1.0} />

	<div class="flex flex-col items-center py-10">
		<div
			class="bg-primary/75 border-accent/35 w-9/10 max-w-225 rounded-t-lg border-x-2 border-t-2 p-5 lg:w-4/5"
		>
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
			<p class="my-5">
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

			<h3 class="py-3">Education</h3>

			<p>Short section</p>
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

			<ProjectSection>
				<div
					class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-center justify-center gap-2"
				>
					<ProjectCard
						info={{
							title: "Chasm's Call",
							image: chasmsCall,
							description:
								'"Chasm\'s Call" is a singleplayer turn-based strategy rougelike\
							that takes place on a hexagonal grid. Although the game\'s scope is quite small,\
							it is more complete that my previous games as it contains a progress-saving\
							system, unlike the previous ones which at most could save high-scores.',
							date: '2024',
							link: 'https://fluff-feli.itch.io/chasms-call',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Godot', type: BadgeType.Framework }
							]
						}}
					/>

					<ProjectCard
						info={{
							title: 'Flickering Flame',
							image: flickeringFlame,
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
					/>

					<ProjectCard
						info={{
							title: 'Wrecking Whiskers',
							image: wreckingWhiskers,
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
					/>

					<ProjectCard
						info={{
							title: 'Timeflowers',
							image: timeflowers,
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
					/>

					<ProjectCard
						info={{
							title: 'Beast Bonds',
							image: beastBonds,
							description:
								'"Beast Bonds" is a simple card-game inspired by a mix of games like Spellstone\
							and Texas Hold \'Em Poker. As it was made during the school year, it was my first experience\
							having to juggle multiple projects. Admittedly, the game suffers from a lack of a proper tutorial\
							and time to flesh out the game design, however, it still served as a useful learning experience.',
							date: '2023',
							link: 'https://fluff-feli.itch.io/beast-bonds',
							badges: [
								{ name: 'C#', type: BadgeType.Language },
								{ name: 'Unity', type: BadgeType.Framework }
							]
						}}
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
							// TODO: swap this with actual screenshot
							image: subaybay,
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
							// TODO: swap this with actual screenshot
							image: charge,
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
							// TODO: swap this with actual screenshot
							image: specialProblem,
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

		<Section header="Relevant Links" headerSubtitle="and contact information" id="links">
			<p class="text-secondary mb-5">
				Here is where you can send me your 6-figure-pay entry-level job offer. ദ്ദി/ᐠ｡‸｡ᐟ\ Thank
				you.
			</p>

			<div class="flex w-full flex-row items-center justify-center space-x-5">
				<LinkedIcon href={import.meta.env.VITE_LINKEDIN_LINK} icon={SiLinkedin} />
				<LinkedIcon href={import.meta.env.VITE_GITHUB_LINK} icon={SiGithub} />
				<LinkedIcon href={import.meta.env.VITE_MESSENGER_LINK} icon={SiMessenger} />
			</div>

			<h3>Contact Form</h3>
			<p class="font-lexend text-neutral pb-2 text-left">
				If you prefer to reach out via email, feel free to use this contact form, which will pass
				your message to me through Formspree.
			</p>
			<div class="border-secondary-accent flex w-full rounded-xl border-1 p-5">
				<form class="flex w-full flex-col" action="https://formspree.io/f/mzzgvpwk" method="POST">
					<!-- identification details-->
					<div class="flex flex-row flex-wrap justify-start gap-x-2.5">
						<label>
							<p class="text-secondary text-sm">Your name / organization:</p>
							<input name="name" type="text" placeholder="Name / Organization" required />
						</label>
						<label>
							<p class="text-secondary text-sm">Your email (where I can reply):</p>
							<input type="email" name="email" placeholder="Email" required />
						</label>
					</div>
					<!-- actual message -->
					<label>
						<p class="text-secondary text-sm">Your message:</p>
						<textarea
							class="w-full"
							name="message"
							placeholder="Good aftermorning! We would like to offer you a job that pays 1,000,000Php per month. By the way, don't worry about an interview, there is none, you just have to accept : )."
							required
						></textarea>
					</label>
					<button
						class="	border-accent text-secondary-accent font-urbanist
								hover:bg-secondary hover:text-primary hover:text-bold hover:border-secondary mt-2.5
								w-fit cursor-pointer self-center rounded-lg border-1
								px-1.5 text-lg transition-all duration-300 hover:px-5 hover:py-0.5"
						type="submit"
					>
						Send
					</button>
				</form>
			</div>
		</Section>

		<div
			id="contact-form"
			class="bg-primary/75 border-accent/35 w-9/10 max-w-225 rounded-b-lg border-x-2 border-b-2 p-5 lg:w-4/5"
		>
			<p class="text-secondary my-5 w-full text-center text-xl">(=^･ｪ･^=))ﾉ彡☆</p>
		</div>
	</div>
</main>
