import type { CollisionSpace } from '../core/CollisionSpace';
import type { Context } from '../core/Context';
import { BoundingBox } from '../models/BoundingBox';
import { ClickArea } from '../models/ClickArea';
import { InteractArea } from '../models/InteractArea';
import type { Player } from '../models/Player';
import { Vec2 } from '../models/Vec2';

/**
 * a class to handle both in-world buttons and interaction areas
 */
export class InteractionManager {
	#interactAreas: InteractArea[] = [];
	#clickAreas: ClickArea[] = [];

	#colSpace: CollisionSpace;

	constructor(colSpace: CollisionSpace) {
		this.#colSpace = colSpace;
	}

	async setup(context: Context) {
		this.addClickArea(new BoundingBox(121.5, 148.5, 51.5, 78.5), 'C#');
		this.addClickArea(new BoundingBox(151.5, 178.5, 51.5, 78.5), 'Python');
		this.addClickArea(new BoundingBox(181.5, 208.5, 51.5, 78.5), 'Rust');
		this.addClickArea(new BoundingBox(121.5, 148.5, 81.5, 108.5), 'Dart');
		this.addClickArea(new BoundingBox(151.5, 178.5, 81.5, 108.5), 'JavaScript/TypeScript');

		
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
		onClick?: () => void,
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

	addClickArea(aabb: BoundingBox, hoverText: string = '', onClick?: () => void): ClickArea {
		let newArea = new ClickArea(aabb, hoverText, onClick);
		this.#clickAreas.push(newArea);

		return newArea;
	}

	update(context: Context, deltaSecs: number) {
		// TODO: handle conflicting interact area and click area (store last hovered for each? if same, then replace with new)

		if (context.player.inputIsLocked) {
			return;
		}

		let p5 = context.p5;

		// check interact areas
		let playerAABB = context.player.calculateAABB();
		for (let i = 0; i < this.#interactAreas.length; i++) {
			let interactArea = this.#interactAreas[i];
			if (interactArea.aabb.colliding(playerAABB)) {
				// TODO: handle logic

				// this.drawIndicator(context, target, false);

				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (context.inputs.keyJustPressed('e')) {
					if (interactArea.clickArea) {
						interactArea.clickArea.click();
					} else if (interactArea.onClick) {
						interactArea.onClick();
					}
					break;
				}

				if (interactArea.clickArea) {
					interactArea.clickArea.hover(context);
				}

				break;
			}
		}

		// draw interaction areas
		// this.#clickAreas.forEach((clickArea) => {
		// 	context.drawing.rect(
		// 		clickArea.aabb.left,
		// 		clickArea.aabb.top,
		// 		clickArea.aabb.right - clickArea.aabb.left,
		// 		clickArea.aabb.bottom - clickArea.aabb.top,
		// 		0
		// 	);
		// });

		// check click areas
		let worldMousePos = new Vec2(
			context.world.toWorld(p5.mouseX),
			context.world.toWorld(p5.mouseY)
		);
		for (let i = 0; i < this.#clickAreas.length; i++) {
			let clickArea = this.#clickAreas[i];

			if (clickArea.aabb.contains(worldMousePos)) {
				clickArea.hover(context);

				if (context.inputs.mouseJustClicked()) {
					clickArea.click();
				}

				break;
			}
		}
	}
}
