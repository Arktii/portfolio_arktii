export class TvDisplay {
	doubleGrowGlow: number;

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public glowGrow: number
	) {
		this.doubleGrowGlow = glowGrow * 2;
	}
}
