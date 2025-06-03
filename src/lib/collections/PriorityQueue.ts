// TODO: Make into Min Heap
export class PriorityQueue<T> {
	private data: (T | null)[];
	private size: number;

	constructor() {
		this.data = [null];
		this.size = 0;
	}

	isEmpty(): boolean {
		return this.size === 0;
	}

	insert(data: T): void {
		const index = this.size;
		this.size += 1;

		this.ensureIndexInBounds(index);
		this.data[index] = data;

		this.siftUp(index);
	}

	pop(): T | null {
		if (this.size === 0) {
			return null;
		} else {
			let result = this.data[0];

			this.size -= 1;
			this.data[0] = this.data[this.size];
			this.siftDown(0);

			return result;
		}
	}

	private ensureIndexInBounds(index: number): void {
		if (index >= this.data.length) {
			const newLength = index + 1;
			this.data.length = newLength;
			this.data.fill(null, newLength);
		}
	}

	private siftUp(index: number) {
		while (index > 0) {
			let parent = PriorityQueue.parentIndex(index);
			// These should never be null in practice
			// @ts-expect-error
			if (this.data[parent] > this.data[index]) {
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
			if (left < this.size && this.data[left] < this.data[maxIndex]) {
				maxIndex = left;
			}

			let right = PriorityQueue.rightIndex(index);
			// These should never be null in practice
			// @ts-expect-error
			if (right < this.size && this.data[right] < this.data[maxIndex]) {
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
		[this.data[a], this.data[b]] = [this.data[b], this.data[a]];
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

// Test
// TODO: convert to a proper test
export function testPriorityQueue() {
	console.log('TESTING PRIORITY QUEUE');
	const queue = new PriorityQueue<number>();

	queue.insert(6);
	queue.insert(2);
	queue.insert(4);
	queue.insert(7);
	queue.insert(9);
	queue.insert(5);
	queue.insert(0);
	queue.insert(1);
	queue.insert(3);
	queue.insert(8);

	for (let i = 0; i <= 9; i++) {
		const value = queue.pop();
		console.assert(value === i, `Expected ${i}, got ${value}`);
		console.log(value);
	}
}
