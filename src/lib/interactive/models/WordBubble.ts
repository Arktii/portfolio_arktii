export enum WordBubbleType {
	SPEECH,
	THOUGHT
}

export class WordBubble {
	text: string;
	bubbleType: WordBubbleType;
	duration: number;
	priority: number;

	constructor(
		bubbleType: WordBubbleType,
		text: string,
		duration: number = 0,
		priority: number = 0
	) {
		this.text = text;
		this.bubbleType = bubbleType;
		this.duration = duration;
		this.priority = priority;
	}
}
