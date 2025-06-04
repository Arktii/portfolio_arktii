export class PriorityQueue<T extends Ord> {
	#data: (T | null)[];
	#size: number;

	constructor() {
		this.#data = [null];
		this.#size = 0;
	}

	get size() {
		return this.#size;
	}

	isEmpty(): boolean {
		return this.#size === 0;
	}

	isNotEmpty(): boolean {
		return this.#size > 0;
	}

	insert(value: T): void {
		const index = this.#size;
		this.#size += 1;

		this.ensureIndexInBounds(index);
		this.#data[index] = value;

		this.siftUp(index);
	}

	pop(): T | null {
		if (this.#size === 0) {
			return null;
		} else {
			let result = this.#data[0];

			this.#size -= 1;
			this.#data[0] = this.#data[this.#size];
			this.siftDown(0);

			return result;
		}
	}

	private ensureIndexInBounds(index: number): void {
		if (index >= this.#data.length) {
			const newLength = index + 1;
			this.#data.length = newLength;
			this.#data.fill(null, newLength);
		}
	}

	private siftUp(index: number) {
		while (index > 0) {
			let parent = PriorityQueue.parentIndex(index);
			// These should never be null in practice
			// @ts-expect-error
			if (this.#data[parent].greaterThan(this.#data[index])) {
				this.swap(parent, index);
			} else {
				break;
			}

			index = parent;
		}
	}

	private siftDown(index: number) {
		let maxIndex = index;

		while (true) {
			maxIndex = index;

			let left = PriorityQueue.leftIndex(index);
			// These should never be null in practice
			// @ts-expect-error
			if (left < this.#size && this.#data[left].lessThan(this.#data[maxIndex])) {
				maxIndex = left;
			}

			let right = PriorityQueue.rightIndex(index);
			// These should never be null in practice
			// @ts-expect-error
			if (right < this.#size && this.#data[right].lessThan(this.#data[maxIndex])) {
				maxIndex = right;
			}

			// If index is less than either its right or left index
			if (index != maxIndex) {
				this.swap(index, maxIndex);
				index = maxIndex;
			} else {
				break;
			}
		}
	}

	private swap(a: number, b: number): void {
		[this.#data[a], this.#data[b]] = [this.#data[b], this.#data[a]];
	}

	private static parentIndex(childIndex: number): number {
		return Math.floor((childIndex - 1) / 2);
	}

	private static leftIndex(index: number): number {
		return 2 * index + 1;
	}

	private static rightIndex(index: number): number {
		return 2 * index + 2;
	}
}

class SimpleNumber implements Ord {
	constructor(public value: number) {}
	lessThan(other: this): boolean {
		return this.value < other.value;
	}
	greaterThan(other: this): boolean {
		return this.value > other.value;
	}
	equalTo(other: this): boolean {
		return this.value === other.value;
	}
}

// Test
// TODO: convert to a proper test
export function testPriorityQueue() {
	console.log('TESTING PRIORITY QUEUE');
	const queue = new PriorityQueue<SimpleNumber>();

	queue.insert(new SimpleNumber(6));
	queue.insert(new SimpleNumber(2));
	queue.insert(new SimpleNumber(4));
	queue.insert(new SimpleNumber(7));
	queue.insert(new SimpleNumber(9));
	queue.insert(new SimpleNumber(5));
	queue.insert(new SimpleNumber(0));
	queue.insert(new SimpleNumber(1));
	queue.insert(new SimpleNumber(3));
	queue.insert(new SimpleNumber(8));

	for (let i = 0; i <= 9; i++) {
		const popped = queue.pop();
		//@ts-expect-error (ignore possible null error)
		console.assert(popped.value === i, `Expected ${i}, got ${popped.value}`);
		//@ts-expect-error (ignore possible null error)
		console.log(popped.value);
	}
}
