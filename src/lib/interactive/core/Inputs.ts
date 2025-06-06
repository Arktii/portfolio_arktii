/**
 * makes detecting inputs accessible to other classes that don't want to listen to events
 */
export class Inputs {
	#keyJustPressed: string | null = null;
	#keyJustReleased: string | null = null;
	#mouseClicked: boolean = false;

	#lastPressed: string | null = null;

	newFrame() {
		this.#keyJustPressed = null;
		this.#mouseClicked = false;
	}

	setKeyJustPressed(key: string) {
		if (this.#lastPressed === null || this.#lastPressed !== key) {
			this.#keyJustPressed = key;
			this.#lastPressed = key;
		}
	}

	setKeyJustReleased(key: string) {
		this.#keyJustReleased = key;
		this.#lastPressed = null;
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

	mouseJustClicked(): boolean {
		return this.#mouseClicked;
	}
}
