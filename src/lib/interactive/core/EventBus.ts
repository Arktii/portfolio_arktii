// modified to be generic version of https://lwebapp.com/en/post/event-bus
export class EventBus {
	private eventsToSubscribers: { [eventName: string]: ((...args: any[]) => void)[] };

	constructor() {
		this.eventsToSubscribers = {};
	}

	subscribe<T extends any[]>(eventName: string, callback: (...args: T) => void) {
		if (!this.eventsToSubscribers[eventName]) {
			this.eventsToSubscribers[eventName] = [];
		}

		this.eventsToSubscribers[eventName].push(callback);
	}

	unsubscribe<T extends any[]>(eventName: string, callback: (...args: T) => void) {
		const subscribers = this.eventsToSubscribers[eventName];
		if (subscribers) {
			this.eventsToSubscribers[eventName] = this.eventsToSubscribers[eventName].filter(
				(c) => c !== callback
			);
		}
	}

	publish<T extends any[]>(eventName: string, ...args: T) {
		const subscribers = this.eventsToSubscribers[eventName];
		if (subscribers) {
			subscribers.forEach((callback) => callback(...args));
		}
	}
}
