import { INTERACTION } from '../constants';
import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { BoundingBox } from '../models/BoundingBox';
import { ClickArea } from '../models/ClickArea';
import { InteractArea } from '../models/InteractArea';
import { Vec2 } from '../models/Vec2';
import { WordBubble, WordBubbleType } from '../models/WordBubble';

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
		// TODO: move this out? it's very long
		// languages
		var clickArea = this.addClickArea(
			new BoundingBox(120.5, 147.5, 52.5, 79.5),
			'C#',
			InteractionManager.makeSpeechBubbleFunc('Console.Log("Meow")')
		);
		this.addInteractArea(12, 13, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(135.5, 162.5, 81.5, 108.5),
			'Dart',
			InteractionManager.makeSpeechBubbleFunc('print("Meow")')
		);
		this.addInteractArea(14, 14.5, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(150.5, 177.5, 52.5, 79.5),
			'Python',
			InteractionManager.makeSpeechBubbleFunc('print("Meow")')
		);
		this.addInteractArea(15.5, 16.5, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(165.5, 192.5, 81.5, 108.5),
			'JavaScript / TypeScript',
			InteractionManager.makeSpeechBubbleFunc('console.log("Meow")')
		);
		this.addInteractArea(17.5, 18, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(180.5, 207.5, 52.5, 79.5),
			'Rust',
			InteractionManager.makeSpeechBubbleFunc('print!("Meow")')
		);
		this.addInteractArea(19, 20, 3, clickArea);

		var clickArea = this.addClickArea(
			new BoundingBox(221.5, 233.5, 46.5, 90.5),
			'More Languages (will redirect)'
		);
		this.addInteractArea(21, 21, 3, clickArea);

		// engines
		var clickArea = this.addClickArea(new BoundingBox(33.5, 89.5, 111.5, 138.5), 'Unity');
		var clickArea = this.addClickArea(new BoundingBox(92.5, 148.5, 111.5, 138.5), 'Godot');
		var clickArea = this.addClickArea(new BoundingBox(151.5, 207.5, 111.5, 138.5), 'Bevy');

		var clickArea = this.addClickArea(new BoundingBox(41.5, 97.5, 161.5, 188.5), 'DOST');
		this.addInteractArea(4, 9, 18, clickArea);
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
		hoverText: string = '',
		onClick?: (context: Context) => void
	): ClickArea {
		let newArea = new ClickArea(aabb, hoverText, onClick);
		this.#clickAreas.push(newArea);

		return newArea;
	}

	private static makeSpeechBubbleFunc(text: string): (c: Context) => void {
		return (c: Context) =>
			c.eventBus.publish(
				'wordBubble',
				c,
				new WordBubble(WordBubbleType.SPEECH, text, INTERACTION.SPEECH_BUBBLE_DURATION, 2)
			);
	}

	update(context: Context, deltaSecs: number) {
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
						interactArea.clickArea.click(context);
					} else if (interactArea.onClick) {
						interactArea.onClick(context);
					}
					break;
				}

				if (interactArea.clickArea) {
					playerClickArea = interactArea.clickArea;
				}

				break;
			}
		}

		// check click areas
		let worldMousePos = new Vec2(
			context.world.toWorld(p5.mouseX),
			context.world.toWorld(p5.mouseY)
		);
		for (let i = 0; i < this.#clickAreas.length; i++) {
			let clickArea = this.#clickAreas[i];

			if (clickArea.aabb.contains(worldMousePos)) {
				mouseClickArea = clickArea;

				// Handle Click
				if (context.inputs.mouseJustClicked()) {
					clickArea.click(context);
				}

				break;
			}
		}

		let startHover = false;
		if (mouseClickArea && playerClickArea) {
			// Note: if both are changed, player is prioritized
			// Player moving (but not mouse moving) counts as a change
			if (Math.abs(context.player.velocity.x) > 0) {
				this.primaryClickArea = playerClickArea;
				this.secondaryClickArea = mouseClickArea;

				startHover = playerClickArea !== this.#prevPlayerClickArea;
			}
			// Mouse moves a lot, so unless it leaves the area, it does not count as a change
			else if (mouseClickArea !== this.#prevMouseClickArea) {
				this.primaryClickArea = mouseClickArea;
				this.secondaryClickArea = playerClickArea;
				startHover = true;
			}
		} else if (mouseClickArea) {
			this.primaryClickArea = mouseClickArea;
			this.secondaryClickArea = null;

			startHover = mouseClickArea !== this.#prevMouseClickArea;
		} else if (playerClickArea) {
			this.primaryClickArea = playerClickArea;
			this.secondaryClickArea = null;

			startHover = playerClickArea !== this.#prevPlayerClickArea;
		} else {
			this.primaryClickArea = null;
			this.secondaryClickArea = null;
		}

		if (this.primaryClickArea) {
			this.primaryClickArea.hover(context);

			if (startHover) {
				this.primaryClickArea?.startHover(context);
			}
		}

		if (this.secondaryClickArea && this.secondaryClickArea !== this.primaryClickArea) {
			this.secondaryClickArea.secondaryHover(context);
		}

		this.#prevMouseClickArea = mouseClickArea;
		this.#prevPlayerClickArea = playerClickArea;
	}
}
