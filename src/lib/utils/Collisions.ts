import type { BoundingBox } from '$lib/interactive/models/BoundingBox';
import { Vec2 } from '$lib/interactive/models/Vec2';

/**
 * Calculates the displacement required to push one box out of another
 *
 * Assumes the two bounding boxes are colliding.
 */
export function calculateSingleDisplacement(
	staticAABB: BoundingBox,
	pushedAABB: BoundingBox
): Vec2 {
	const left = pushedAABB.right - staticAABB.left;
	const right = staticAABB.right - pushedAABB.left;

	// normally, these two are reversed,
	// but canvas coordinates have lower values up and higher values going down
	const down = staticAABB.bottom - pushedAABB.top;
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
 * Calculates the displacement required to push one box out of another
 *
 * Assumes the two bounding boxes are colliding. Assumes the displacement MUST be in the x-axis
 */
export function calculateSingleDisplacementX(
	staticAABB: BoundingBox,
	pushedAABB: BoundingBox
): Vec2 {
	const left = pushedAABB.right - staticAABB.left;
	const right = staticAABB.right - pushedAABB.left;

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
	const left = b.right - a.left;
	const right = a.right - b.left;

	// normally, these two are reversed,
	// but canvas coordinates have lower values up and higher values going down
	const down = a.bottom - b.top;
	const up = b.bottom - a.top;

	return new Vec2(Math.min(left, right), Math.min(down, up));
}
