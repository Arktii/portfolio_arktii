export const EasingFunctions = Object.freeze({
	linear: (t: number) => t,
	easeInQuad: (t: number) => t * t,
	easeInCubic: (t: number) => t * t * t,
	easeInQuartic: (t: number) => {
		var t2 = t * t;
		return t2 * t2;
	},
	easeInQuintic: (t: number) => {
		var t2 = t * t;
		return t2 * t2 * t;
	}
});

export class Tween {
	#startValue: number;
	#endValue: number;
	#valueRange: number;

	#duration: number;

	#currentValue: number;
	#elapsed: number = 0;
	#finished: boolean = false;

	#easingFunction: (t: number) => number;
	#onUpdate?: (value: number) => void;
	#onFinish?: () => void;

	constructor(
		startValue: number,
		endValue: number,
		duration: number,
		easingFunction?: (t: number) => number
	) {
		this.#startValue = startValue;
		this.#endValue = endValue;
		this.#duration = duration;

		this.#valueRange = endValue - startValue;

		this.#currentValue = startValue;

		if (easingFunction) {
			this.#easingFunction = easingFunction;
		} else {
			this.#easingFunction = (t) => t; // linear
		}
	}

	get currentValue(): number {
		return this.#currentValue;
	}

	reset() {
		this.#currentValue = this.#startValue;
		this.#elapsed = 0;
		this.#finished = false;
	}

	setUpdateFunction(f: (value: number) => void): this {
		this.#onUpdate = f;

		return this;
	}

	setFinishFunction(f: () => void): this {
		this.#onFinish = f;

		return this;
	}

	update(deltaSecs: number) {
		if (this.#finished) {
			return;
		}
		this.#elapsed = Math.min(this.#elapsed + deltaSecs, this.#duration);

		const progress = this.#easingFunction(this.#elapsed / this.#duration);
		this.#currentValue = this.#startValue + progress * this.#valueRange;

		if (this.#onUpdate) {
			this.#onUpdate(this.#currentValue);
		}

		if (this.#elapsed >= this.#duration) {
			this.#finished = true;
			this.#elapsed = this.#duration;
			this.#currentValue = this.#endValue;

			if (this.#onFinish) {
				this.#onFinish();
			}
		}
	}
}
