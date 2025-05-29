export class DirectionFlags {
	left: boolean;
	right: boolean;
	up: boolean;
	bottom: boolean;

	constructor() {
		this.left = false;
		this.right = false;
		this.up = false;
		this.bottom = false;
	}

	xAxis(): number {
		return (this.left ? -1 : 0) + (this.right ? 1 : 0);
	}
}
