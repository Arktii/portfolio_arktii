import type { BoundingBox } from '$lib/interactive/models/BoundingBox';
import { Vec2 } from '$lib/interactive/models/Vec2';

/**
 * Assumes the two bounding boxes are colliding
 */
export function calculateSingleDisplacement(
	staticAABB: BoundingBox,
	pushedAABB: BoundingBox
): Vec2 {
	let left = pushedAABB.right - staticAABB.left;
	let right = staticAABB.right - pushedAABB.left;

	// normally, these two are reversed,
	// but canvas coordinates have lower values up and higher values going down
	let down = staticAABB.bottom - pushedAABB.top;
	let up = pushedAABB.bottom - staticAABB.top;

	if (Math.min(left, right) < Math.min(up, down)) {
		if (left < right) {
			return new Vec2(-left, 0);
		} else {
			return new Vec2(right, 0);
		}
	} else {
		if (up < down) {
			return new Vec2(0, -up);
		} else {
			return new Vec2(0, down);
		}
	}
}

/**
 * Assumes the two bounding boxes are colliding. Assumes the displacement MUST be in the x-axis
 */
export function calculateSingleDisplacementX(
	staticAABB: BoundingBox,
	pushedAABB: BoundingBox
): Vec2 {
	let left = pushedAABB.right - staticAABB.left;
	let right = staticAABB.right - pushedAABB.left;

	if (left < right) {
		return new Vec2(-left, 0);
	} else {
		return new Vec2(right, 0);
	}
}

/**
 * Assumes the two bounding boxes are colliding
 */
export function calculateOverlap(a: BoundingBox, b: BoundingBox): Vec2 {
	let left = b.right - a.left;
	let right = a.right - b.left;

	// normally, these two are reversed,
	// but canvas coordinates have lower values up and higher values going down
	let down = a.bottom - b.top;
	let up = b.bottom - a.top;

	return new Vec2(Math.min(left, right), Math.min(down, up));
}
