import type { BoundingBox } from './BoundingBox';

export class ClickArea {
	aabb: BoundingBox;
	hoverText: string;

	onClick?: () => void;

	constructor(aabb: BoundingBox, hoverText: string = '', onClick?: () => void) {
		this.aabb = aabb;

		this.onClick = onClick;
		this.hoverText = hoverText;
	}

	hover() {
		// TODO: fire event via event bus so player can have thought bubble for hover text
		// TODO: handle highlighting

		console.log(this.hoverText);
	}

	click() {
		console.log("CLICK");
		if (this.onClick) {
			this.onClick();
		}
	}
}
