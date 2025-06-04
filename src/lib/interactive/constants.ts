export const FLOAT_TOLERANCE = 0.001;

export const CANVAS_SIZE = {
	MIN_WIDTH: 300,
	MAX_WIDTH: 800,
	PADDING: 0.9
};

const SCALE_MULTIPLIER = 3;

export const BUILDING_SIZE = {
	WIDTH: 220 * SCALE_MULTIPLIER,
	HEIGHT: 700 * SCALE_MULTIPLIER,
	ASPECT_RATIO: 220 / 700
};

export const WORLD_SIZE = {
	REFERENCE_WIDTH: 660
};

export const PLAYER = {
	SPRITE_WIDTH: 32 * SCALE_MULTIPLIER,
	SPRITE_HEIGHT: 32 * SCALE_MULTIPLIER,

	WIDTH: 24 * SCALE_MULTIPLIER,
	HEIGHT: 16 * SCALE_MULTIPLIER,
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

	fillRow(grid, 4);

	fillX(grid, 1, 10, 7);
	fillX(grid, 1, 10, 10);

	// pipe
	fillY(grid, 5, 14, 20);
	fillRow(grid, 14);
	fillY(grid, 15, 28, 1);

	// right-overhanging things
	fillX(grid, 3, 20, 19);
	fillX(grid, 17, 20, 22);
	fillX(grid, 17, 20, 26);
	fillX(grid, 17, 20, 30);
	fillX(grid, 17, 20, 39);

	fillX(grid, 3, 15, 28);
	fillX(grid, 1, 18, 34);

	//pipe
	fillX(grid, 1, 14, 37);
	fillY(grid, 38, 42, 14);
	fillX(grid, 14, 20, 43);
	fillY(grid, 43, 61, 20);

	fillX(grid, 6, 18, 53);

	// balcony things
	fillX(grid, 1, 2, 41);
	fillX(grid, 1, 8, 44);
	fillX(grid, 1, 2, 47);
	fillX(grid, 1, 4, 50);
	fillX(grid, 1, 2, 53);
	fillX(grid, 1, 8, 56);
	fillX(grid, 1, 17, 59);
	fillX(grid, 1, 18, 62);

	return grid;
}

function fillRow(grid: boolean[][], y: number) {
	for (let x = 1; x < gridWidth - 1; x++) {
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
