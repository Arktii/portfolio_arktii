export class WordBubble {
	text: string;
	duration: number;
	priority: number;

	constructor(text: string, duration: number = 0, priority: number = 0) {
		this.text = text;
		this.duration = duration;
		this.priority = priority;
	}
}
