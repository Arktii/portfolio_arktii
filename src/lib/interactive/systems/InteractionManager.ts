import { INTERACTION, RAT } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { BoundingBox } from '../models/BoundingBox';
import { ClickArea } from '../models/ClickArea';
import { InteractArea } from '../models/InteractArea';
import { Vec2 } from '../models/Vec2';
import { WordBubble } from '../models/WordBubble';

/**
 * a class to handle both in-world buttons and interaction areas
 */
export class InteractionManager {
	#interactAreas: InteractArea[] = [];
	#clickAreas: ClickArea[] = [];

	#colSpace: CollisionSpace;

	#prevPlayerClickArea: ClickArea | null = null;
	#prevMouseClickArea: ClickArea | null = null;
	primaryClickArea: ClickArea | null = null;
	secondaryClickArea: ClickArea | null = null;

	constructor(colSpace: CollisionSpace) {
		this.#colSpace = colSpace;
	}

	async setup(context: Context) {
		this.setupInteractionAreas();
	}

	addInteractArea(
		xStart: number,
		xEnd: number,
		y: number,
		clickArea?: ClickArea,
		onClick?: (context: Context) => void,
		whileInside?: () => void
	): InteractArea {
		let newArea = new InteractArea(
			this.#colSpace.cellSize,
			xStart,
			xEnd,
			y,
			clickArea,
			onClick,
			whileInside
		);
		this.#interactAreas.push(newArea);

		return newArea;
	}

	addClickArea(
		aabb: BoundingBox,
		mainText: string = '',
		mainAction?: (context: Context) => void,
		secondaryText: string = '',
		secondaryAction?: (context: Context) => void
	): ClickArea {
		let newArea = new ClickArea(aabb, mainText, mainAction, secondaryText, secondaryAction);
		this.#clickAreas.push(newArea);

		return newArea;
	}

	private static makeSpeechBubbleFunc(
		text: string,
		wrap: 'word' | 'char' = 'word'
	): (c: Context) => void {
		return (c: Context) =>
			c.eventBus.publish(
				'wordBubble',
				c,
				new WordBubble(text, wrap, INTERACTION.SPEECH_BUBBLE_DURATION, 2)
			);
	}

	private static makeRatSpawnFunc(imageName: string) {
		return (context: Context) => {
			context.eventBus.publish('ratRequested', context, context.preloads.image(imageName));
		};
	}

	fixedUpdate(context: Context) {
		if (context.player.inputIsLocked) {
			return;
		}

		let playerClickArea: ClickArea | null = null;
		let mouseClickArea: ClickArea | null = null;

		let p5 = context.p5;

		// check interact areas
		let playerAABB = context.player.calculateInteractAABB();
		for (let i = 0; i < this.#interactAreas.length; i++) {
			let interactArea = this.#interactAreas[i];
			if (interactArea.aabb.colliding(playerAABB)) {
				// Handle Interact Key Pressed
				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (context.inputs.keyJustPressed('e')) {
					if (interactArea.clickArea) {
						interactArea.clickArea.mainInteract(context);
					} else if (interactArea.onClick) {
						interactArea.onClick(context);
					}
					break;
				} else if (context.inputs.keyJustPressed('q')) {
					interactArea.clickArea?.secondaryInteract(context);
				}

				if (interactArea.clickArea) {
					playerClickArea = interactArea.clickArea;
				}

				break;
			}
		}

		// check click areas
		let worldMousePos = new Vec2(
			context.world.toWorldX(p5.mouseX),
			context.world.toWorldY(p5.mouseY)
		);
		for (let i = 0; i < this.#clickAreas.length; i++) {
			let clickArea = this.#clickAreas[i];

			if (clickArea.aabb.contains(worldMousePos)) {
				mouseClickArea = clickArea;

				// Handle Click
				if (context.inputs.leftMouseClicked()) {
					clickArea.mainInteract(context);
				} else if (context.inputs.mouseJustClicked(context.p5.RIGHT)) {
					clickArea.secondaryInteract(context);
				}

				break;
			}
		}

		if (mouseClickArea && playerClickArea) {
			// Note: if both are changed, player is prioritized
			// Player moving (but not mouse moving) counts as a change
			if (Math.abs(context.player.velocity.x) > 0) {
				this.primaryClickArea = playerClickArea;
				this.secondaryClickArea = mouseClickArea;
			}
			// Mouse moves a lot, so unless it leaves the area, it does not count as a change
			else if (mouseClickArea !== this.#prevMouseClickArea) {
				this.primaryClickArea = mouseClickArea;
				this.secondaryClickArea = playerClickArea;
			}
		} else if (mouseClickArea) {
			this.primaryClickArea = mouseClickArea;
			this.secondaryClickArea = null;
		} else if (playerClickArea) {
			this.primaryClickArea = playerClickArea;
			this.secondaryClickArea = null;
		} else {
			this.primaryClickArea = null;
			this.secondaryClickArea = null;
		}

		if (this.secondaryClickArea && this.secondaryClickArea !== this.primaryClickArea) {
			this.secondaryClickArea.secondaryHover(context);
		}
		this.primaryClickArea?.primaryHover(context);
		playerClickArea?.playerHover(context);
		mouseClickArea?.mouseHover(context);

		this.#prevMouseClickArea = mouseClickArea;
		this.#prevPlayerClickArea = playerClickArea;
	}

	private setupInteractionAreas() {
		var clickArea = this.addClickArea(
			new BoundingBox(120.5, 147.5, 52.5, 79.5),
			'View Code',
			InteractionManager.makeSpeechBubbleFunc(
				'// C#\nConsole.WriteLine(\n(int)1.6==Convert.ToInt32(1.6)\n)'
			),
			'Run Script',
			InteractionManager.makeSpeechBubbleFunc('False')
		);
		this.addInteractArea(12, 13, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(135.5, 162.5, 81.5, 108.5),
			'View Code',
			InteractionManager.makeSpeechBubbleFunc('// Dart\nprint(0.1 + 0.2)'),
			'Run Script',
			InteractionManager.makeSpeechBubbleFunc('0.30000000000000004')
		);
		this.addInteractArea(14, 14.5, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(150.5, 177.5, 52.5, 79.5),
			'View Code',
			InteractionManager.makeSpeechBubbleFunc('# Python\nprint(True + True)'),
			'Run Script',
			InteractionManager.makeSpeechBubbleFunc('2')
		);
		this.addInteractArea(15.5, 16.5, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(165.5, 192.5, 81.5, 108.5),
			'View Code',
			InteractionManager.makeSpeechBubbleFunc(
				'// JavaScript / TypeScript\nconsole.log(typeof(NaN))'
			),
			'Run Script',
			InteractionManager.makeSpeechBubbleFunc('number')
		);
		this.addInteractArea(17.5, 18, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(180.5, 207.5, 52.5, 79.5),
			'View Code',
			InteractionManager.makeSpeechBubbleFunc('// Rust\nprint!("{}", "🦀")'),
			'Run Script',
			InteractionManager.makeSpeechBubbleFunc('🦀')
		);
		this.addInteractArea(19, 20, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(221.5, 233.5, 46.5, 90.5),
			'More (Jump)',
			(context) => {
				location.hash = '#skills';
			}
		);
		this.addInteractArea(21, 21, 3, clickArea);

		// engines
		var clickArea = this.addClickArea(
			new BoundingBox(33.5, 89.5, 110.5, 137.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc('// Unity\nInstantiate(ratPrefab)'),
			'Spawn Rat',
			InteractionManager.makeRatSpawnFunc('ratUnity')
		);
		this.addInteractArea(3, 8, 13, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(92.5, 148.5, 110.5, 137.5),
			'Inspect',
			// TODO: add details about the engine instead?
			InteractionManager.makeSpeechBubbleFunc('# Godot\nratScene.instantiate()'),
			'Spawn Rat',
			InteractionManager.makeRatSpawnFunc('ratGodot')
		);
		this.addInteractArea(9, 14, 13, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(151.5, 207.5, 110.5, 137.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc('// Bevy\ncommands.spawn(\nRat::default()\n)'),
			'Spawn Rat',
			InteractionManager.makeRatSpawnFunc('ratBevy')
		);
		this.addInteractArea(15, 20, 13, clickArea);

		// internship
		var clickArea = this.addClickArea(
			new BoundingBox(41.5, 97.5, 161.5, 188.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc('Internship with DOST from June 24 to August 7, 2024')
		);
		this.addInteractArea(4, 9, 18, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(100.5, 138.5, 161.5, 188.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc(
				'Flutter (uses Dart) was used for the frontend of the app'
			)
		);
		this.addInteractArea(10, 13, 18, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(141.5, 179.5, 161.5, 188.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc(
				'Laravel (uses php) was used for the backend alongside MariaDB'
			)
		);
		this.addInteractArea(14, 17, 18, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(181.5, 208.5, 161.5, 188.5),
			'Inspect',
			InteractionManager.makeSpeechBubbleFunc(
				'The project was a mobile app;\nI worked on both the frontend and the backend'
			)
		);
		this.addInteractArea(18, 20, 18, clickArea);

		// personal projects TVs
		var clickArea = this.addClickArea(
			new BoundingBox(53.5, 155.5, 209.5, 290.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 0);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 0);
			}
		);
		this.addInteractArea(5, 15, 28, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(39.5, 80.5, 302.5, 335.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 1);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 1);
			}
		);
		this.addInteractArea(4, 7, 33, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(84.5, 125.5, 302.5, 335.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 2);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 2);
			}
		);
		this.addInteractArea(8, 12, 33, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(129.5, 170.5, 302.5, 335.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 3);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 3);
			}
		);
		this.addInteractArea(13, 16, 33, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(185.5, 228.5, 268.5, 282.5),
			'More Details (Jump)',
			(context) => {
				location.hash = '#personal-projects';
			}
		);
		this.addInteractArea(18, 21, 25, clickArea);

		// school project TVs
		var clickArea = this.addClickArea(
			new BoundingBox(94.5, 195.5, 459.5, 530.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 4);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 4);
			}
		);
		this.addInteractArea(9, 14, 52, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(94.5, 141.5, 421.5, 454.5),
			'Inspect',
			(context) => {
				context.eventBus.publish('tvClick', context, 5);
			},
			'Next',
			(context) => {
				context.eventBus.publish('tvNext', 5);
			}
		);
		this.addInteractArea(7, 7, 43, clickArea);
		this.addInteractArea(16, 16, 42, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(151.5, 196.5, 544.5, 556.5),
			'More Details (Jump)',
			(context) => {
				location.hash = '#school-projects';
			}
		);
		this.addInteractArea(15, 19, 52, clickArea);

		// links
		var clickArea = this.addClickArea(
			new BoundingBox(42.5, 67.5, 635.5, 660.5),
			'Show Link',
			InteractionManager.makeSpeechBubbleFunc(import.meta.env.VITE_LINKEDIN_LINK, 'char'),
			'Visit LinkedIn (New Tab)',
			(context) => {
				window.open(import.meta.env.VITE_LINKEDIN_LINK, '_blank');
			}
		);
		this.addInteractArea(4, 6, 61, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(72.5, 97.5, 635.5, 660.5),
			'Show Link',
			InteractionManager.makeSpeechBubbleFunc(import.meta.env.VITE_MESSENGER_LINK, 'char'),
			'Messenger (New Tab)',
			(context) => {
				window.open(import.meta.env.VITE_MESSENGER_LINK, '_blank');
			}
		);
		this.addInteractArea(7, 9, 61, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(102.5, 127.5, 635.5, 660.5),
			'Show Link',
			InteractionManager.makeSpeechBubbleFunc(import.meta.env.VITE_GITHUB_LINK, 'char'),
			'GitHub (New Tab)',
			(context) => {
				window.open(import.meta.env.VITE_GITHUB_LINK, '_blank');
			}
		);
		this.addInteractArea(10, 12, 61, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(132.5, 157.5, 635.5, 660.5),
			'Email Contact Form (Jump)',
			(context) => {
				location.hash = '#contact-form';
			}
		);
		this.addInteractArea(13, 15, 61, clickArea);

		// var clickArea = this.addClickArea(
		// 	new BoundingBox(162.5, 187.5, 635.5, 660.5),
		// 	'Show Link',
		// 	InteractionManager.makeSpeechBubbleFunc(import.meta.env.VITE_RESUME_LINK, 'char'),
		// 	'Resume (New Tab)',
		// 	(context) => {
		// 		window.open(import.meta.env.VITE_RESUME_LINK, '_blank');
		// 	}
		// );
		// this.addInteractArea(16, 18, 61, clickArea);
	}
}
