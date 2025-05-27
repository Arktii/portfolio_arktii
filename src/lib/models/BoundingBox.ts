class BoundingBox {
	left: number;
	right: number;
	top: number;
	bottom: number;

	constructor(left: number, right: number, top: number, bottom: number) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
	}

	/// x and y are the coordinates of the upper-left corner
	fromRect(x: number, y: number, width: number, height: number): BoundingBox {
		return new BoundingBox(x, x + width, y, y + height);
	}
}
