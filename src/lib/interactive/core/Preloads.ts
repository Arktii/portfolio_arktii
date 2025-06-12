export class Preloads {
	#images: { [name: string]: import('p5').Image } = {};
	#fonts: { [name: string]: import('p5').Font } = {};

	image(name: string) {
		return this.#images[name];
	}

	font(name: string) {
		return this.#fonts[name];
	}

	async loadImage(p5: import('p5'), name: string, img: string) {
		this.#images[name] = await p5.loadImage(img);
	}

	async loadFont(p5: import('p5'), name: string, font: string) {
		this.#fonts[name] = await p5.loadFont(font);
	}
}
