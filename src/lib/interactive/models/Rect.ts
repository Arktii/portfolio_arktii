export class Rect {
	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number
	) {}

	static copy(rect: Rect): Rect {
		return new Rect(rect.x, rect.y, rect.width, rect.height);
	}
}
