type MouseButton = {
	left: boolean;
	right: boolean;
	center: boolean;
};

type MouseButtonOptions = 'left' | 'right' | 'center';
/**
 * makes detecting inputs accessible to other classes that don't want to listen to events
 */
export class Inputs {
	#keyJustPressed: string | null = null;
	#keyJustReleased: string | null = null;

	lastMouseButton: MouseButton | null = null;
	#mouseClicked: boolean = false;

	#mouseJustReleased = false;

	#lastKeyPressed: string | null = null;

	newFrame() {
		this.#keyJustPressed = null;
		this.#keyJustReleased = null;

		this.#mouseJustReleased = false;

		this.#mouseClicked = false;
	}

	setMouseJustPressed(button: MouseButton) {
		this.lastMouseButton = { ...button };
	}

	setMouseJustReleased() {
		this.#mouseJustReleased = true;
	}

	setKeyJustPressed(key: string) {
		if (this.#lastKeyPressed === null || this.#lastKeyPressed !== key) {
			this.#keyJustPressed = key;
			this.#lastKeyPressed = key;
		}
	}

	setKeyJustReleased(key: string) {
		this.#keyJustReleased = key;
		this.#lastKeyPressed = null;
	}

	/**
	 * true if the mouse button was clicked then released
	 */
	setMouseClicked() {
		this.#mouseClicked = true;
	}

	keyJustPressed(key: string): boolean {
		if (this.#keyJustPressed) {
			return this.#keyJustPressed == key;
		} else {
			return false;
		}
	}

	keyJustReleased(key: string): boolean {
		if (this.#keyJustReleased) {
			return this.#keyJustReleased == key;
		} else {
			return false;
		}
	}

	mouseJustReleased(button: MouseButtonOptions): boolean {
		if (this.#mouseJustReleased && this.lastMouseButton) {
			return this.lastMouseButton[button];
		} else {
			return false;
		}
	}

	mouseJustClicked(button: MouseButtonOptions): boolean {
		if (this.#mouseJustReleased && this.lastMouseButton) {
			return this.lastMouseButton[button];
		} else {
			return false;
		}
	}

	leftMouseClicked(): boolean {
		return this.#mouseClicked;
	}
}
