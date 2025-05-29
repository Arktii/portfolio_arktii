export const CANVAS_SIZE = {
	MIN_WIDTH: 300,
	MAX_WIDTH: 500,
	PADDING: 0.9
};

const SCALE_MULTIPLIER = 3;

export const BUILDING_SIZE = {
	WIDTH: 180 * SCALE_MULTIPLIER,
	HEIGHT: 600 * SCALE_MULTIPLIER,
	ASPECT_RATIO: 180 / 600
};

export const WORLD_SIZE = {
	REFERENCE_WIDTH: 600
};

export const PLAYER = {
	SPRITE_WIDTH: 32 * 2,
	SPRITE_HEIGHT: 32 * 2,

	WIDTH: 32 * 2,
	HEIGHT: 32 * 2,
	SPEED: 200,
	GRAVITY: 300
};

export const COLLISION_SPACE = {
	CELL_SIZE: 10 * SCALE_MULTIPLIER
};

let gridWidth = Math.ceil(BUILDING_SIZE.WIDTH / COLLISION_SPACE.CELL_SIZE);
let gridHeight = Math.ceil(BUILDING_SIZE.HEIGHT / COLLISION_SPACE.CELL_SIZE);

// TODO: consider other solutions?
export function makeColliderGrid() {
	let grid = Array(gridWidth)
		.fill(null)
		.map(() => Array(gridHeight).fill(false));

	grid[0][2] = true;

	for (let x = 0; x < gridWidth; x++) {
		grid[x][3] = true;
	}

	return grid;
}
