export class Tween {
	private startValue: number;
	private endValue: number;
	private valueRange: number;

	private duration: number;

	private currentValue: number;
	private elapsed: number = 0;
	private finished: boolean = false;

	private onUpdate?: (value: number) => void;
	private onFinish?: () => void;

	constructor(startValue: number, endValue: number, duration: number) {
		this.startValue = startValue;
		this.endValue = endValue;
		this.duration = duration;

		this.valueRange = endValue - startValue;

		this.currentValue = startValue;
	}

	reset() {
		this.currentValue = this.startValue;
		this.elapsed = 0;
		this.finished = false;
	}

	setUpdateFunction(f: (value: number) => void): this {
		this.onUpdate = f;

		return this;
	}

	setFinishFunction(f: () => void): this {
		this.onFinish = f;

		return this;
	}

	//TODO?: add easing functions
	update(deltaSecs: number) {
		if (this.finished) {
			return;
		}
		this.elapsed = Math.min(this.elapsed + deltaSecs, this.duration);

		this.currentValue = this.startValue + (this.elapsed / this.duration) * this.valueRange;

		if (this.onUpdate) {
			this.onUpdate(this.currentValue);
		}

		if (this.elapsed >= this.duration) {
			this.finished = true;
			this.elapsed = this.duration;

			if (this.onFinish) {
				this.onFinish();
			}
		}
	}
}
