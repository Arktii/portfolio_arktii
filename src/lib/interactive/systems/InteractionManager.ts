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
	#player: Player;
	// TODO: move player out to Context

	constructor(colSpace: CollisionSpace, player: Player) {
		this.#player = player;
		this.#colSpace = colSpace;
	}

	async setup(context: Context) {
		let clickArea = this.addClickArea(new BoundingBox(41, 98, 161, 189), 'Hovering');
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

		if (this.#player.inputIsLocked) {
			return;
		}

		let p5 = context.p5;

		// check interact areas
		let playerAABB = this.#player.calculateAABB();
		for (let i = 0; i < this.#interactAreas.length; i++) {
			let interactArea = this.#interactAreas[i];
			if (interactArea.aabb.colliding(playerAABB)) {
				// TODO: handle logic

				// this.drawIndicator(context, target, false);

				// @ts-ignore (typescript definitions aren't up to date with p5 version)
				if (p5.keyIsDown('e')) {
					if (interactArea.clickArea) {
						interactArea.clickArea.click();
					} else if (interactArea.onClick) {
						interactArea.onClick();
					}
					break;
				}

				if (interactArea.clickArea) {
					interactArea.clickArea.hover();
				}

				break;
			}
		}

		// draw interaction areas
		this.#clickAreas.forEach((clickArea) => {
			context.drawing.rect(
				clickArea.aabb.left,
				clickArea.aabb.top,
				clickArea.aabb.right - clickArea.aabb.left,
				clickArea.aabb.bottom - clickArea.aabb.top,
				10
			);
		});

		// check click areas
		let worldMousePos = new Vec2(
			context.world.toWorld(p5.mouseX),
			context.world.toWorld(p5.mouseY)
		);
		for (let i = 0; i < this.#clickAreas.length; i++) {
			let clickArea = this.#clickAreas[i];

			if (clickArea.aabb.contains(worldMousePos)) {
				clickArea.hover();

				if (p5.mouseButton == p5.LEFT) {
					console.log('CLICKED');
					clickArea.click();
				}

				break;
			}
		}
	}
}
