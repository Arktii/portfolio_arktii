export const FLOAT_TOLERANCE = 0.001;

export const CANVAS_SIZE = {
	MIN_WIDTH: 300,
	MAX_WIDTH: 800,
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

	WIDTH: 28 * 2,
	HEIGHT: 32,
	SPEED: 200,
	GRAVITY: 300,

	EDGE_CHECK: 0.1,

	DOWN_JUMP_SPEED: 400,
	UP_JUMP_SPEED: 300,
	DOWN_LAUNCH_ANGLE: 0.349066, // 20 degrees
	UP_LAUNCH_ANGLE: 1.0472 // 60 degrees
};

export const COLLISION_SPACE = {
	CELL_SIZE: 10 * SCALE_MULTIPLIER
};

export const INDICATORS = {
	MAX_OFFSET: 3,
	MOVE_SPEED: 20,
	WIDTH: 16,
	HEIGHT: 16,
	SPACING: 4,
	Z_INDEX: 5
};

let gridWidth = Math.ceil(BUILDING_SIZE.WIDTH / COLLISION_SPACE.CELL_SIZE);
let gridHeight = Math.ceil(BUILDING_SIZE.HEIGHT / COLLISION_SPACE.CELL_SIZE);

// TODO: consider other solutions?
export function makeColliderGrid() {
	let grid: boolean[][] = Array(gridWidth)
		.fill(null)
		.map(() => Array(gridHeight).fill(false));

	fillRow(grid, 3);

	fillX(grid, 0, 6, 8);

	fillX(grid, 10, 14, 9);

	fillY(grid, 4, 12, 17);

	fillRow(grid, 13);

	return grid;
}

function fillRow(grid: boolean[][], y: number) {
	for (let x = 0; x < gridWidth; x++) {
		grid[x][y] = true;
	}
}

function fillX(grid: boolean[][], startX: number, endX: number, y: number) {
	for (let x = startX; x <= endX; x++) {
		grid[x][y] = true;
	}
}

function fillY(grid: boolean[][], startY: number, endY: number, x: number) {
	for (let y = startY; y <= endY; y++) {
		grid[x][y] = true;
	}
}
