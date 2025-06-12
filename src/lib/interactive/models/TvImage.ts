export class TvImageInfo {
	constructor(
		public imagePath: string,
		public hoverText: string
	) {}
}

export class TvImage {
	constructor(
		public image: import('p5').Image,
		public hoverText: string
	) {}
}
