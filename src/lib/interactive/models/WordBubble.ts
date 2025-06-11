export class WordBubble {
	text: string;
	duration: number;
	priority: number;
	wrap: 'word' | 'char';

	constructor(
		text: string,
		wrap: 'word' | 'char' = 'word',
		duration: number = 0,
		priority: number = 0
	) {
		this.text = text;
		this.wrap = wrap;
		this.duration = duration;
		this.priority = priority;
	}
}
