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
		this.addClickArea(
			new BoundingBox(121.5, 148.5, 51.5, 78.5),
			'C#',
			InteractionManager.makeSpeechBubbleFunc('Console.Log("Meow")')
		);
		this.addClickArea(
			new BoundingBox(151.5, 178.5, 51.5, 78.5),
			'Python',
			InteractionManager.makeSpeechBubbleFunc('print("Meow")')
		);
		this.addClickArea(
			new BoundingBox(181.5, 208.5, 51.5, 78.5),
			'Rust',
			InteractionManager.makeSpeechBubbleFunc('print!("Meow")')
		);
		this.addClickArea(
			new BoundingBox(121.5, 148.5, 81.5, 108.5),
			'Dart',
			InteractionManager.makeSpeechBubbleFunc('print("Meow")')
		);
		this.addClickArea(
			new BoundingBox(151.5, 178.5, 81.5, 108.5),
			'JavaScript / TypeScript',
			InteractionManager.makeSpeechBubbleFunc('console.log("Meow")')
		);

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
		let playerAABB = context.player.calculateAABB();
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

		if (this.secondaryClickArea) {
			this.secondaryClickArea.secondaryHover(context);
		}

		this.#prevMouseClickArea = mouseClickArea;
		this.#prevPlayerClickArea = playerClickArea;
	}
}
