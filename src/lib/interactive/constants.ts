export const FLOAT_TOLERANCE = 0.001;

export const CANVAS_SIZE = {
	MIN_WIDTH: 300,
	MAX_WIDTH: 800,
	PADDING: 0.9
};

const SCALE_MULTIPLIER = 3;

export const BUILDING_SIZE = {
	WIDTH: 240 * SCALE_MULTIPLIER,
	HEIGHT: 700 * SCALE_MULTIPLIER,
	ASPECT_RATIO: 240 / 700
};

export const WORLD_SIZE = {
	REFERENCE_WIDTH: 720
};

export const PHYSICS = {
	GRAVITY: 500
};

export const PLAYER = {
	SPRITE_WIDTH: 32 * SCALE_MULTIPLIER,
	SPRITE_HEIGHT: 32 * SCALE_MULTIPLIER,

	WIDTH: 24 * SCALE_MULTIPLIER,
	HEIGHT: 16 * SCALE_MULTIPLIER,
	SPEED: 300,

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

export const POT = {
	SPRITE_WIDTH: 12 * SCALE_MULTIPLIER,
	SPRITE_HEIGHT: 12 * SCALE_MULTIPLIER,
	WIDTH: 8 * SCALE_MULTIPLIER,
	HEIGHT: 6 * SCALE_MULTIPLIER,
	FALLING_VELOCITY: 100 // if y velocity exceeds this amount, the pot will be considered falling, and will break on impact
};

export const POT_COMPUTED = {
	WIDTH_DIFF: POT.SPRITE_WIDTH - POT.WIDTH,
	WIDTH_DIFF_HALF: (POT.SPRITE_WIDTH - POT.WIDTH) / 2,
	HEIGHT_DIFF: POT.SPRITE_HEIGHT - POT.HEIGHT
};

let gridWidth = Math.ceil(BUILDING_SIZE.WIDTH / COLLISION_SPACE.CELL_SIZE);
let gridHeight = Math.ceil(BUILDING_SIZE.HEIGHT / COLLISION_SPACE.CELL_SIZE);

// TODO: consider other solutions?
export function makeColliderGrid() {
	let grid: boolean[][] = Array(gridWidth)
		.fill(null)
		.map(() => Array(gridHeight).fill(false));

	fillRow(grid, 4);

	// balcony
	fillX(grid, 2, 11, 7);
	fillX(grid, 2, 11, 10);

	// pipe
	fillY(grid, 5, 14, 21);
	fillRow(grid, 14);
	fillY(grid, 15, 28, 2);

	// right-overhanging things
	fillX(grid, 4, 21, 19);
	fillX(grid, 18, 21, 22);
	fillX(grid, 18, 21, 26);
	fillX(grid, 18, 21, 30);
	fillX(grid, 18, 21, 39);

	fillX(grid, 4, 16, 28);
	fillX(grid, 2, 19, 34);

	//pipe
	fillX(grid, 2, 15, 37);
	fillY(grid, 38, 42, 15);
	fillX(grid, 15, 21, 43);
	fillY(grid, 43, 61, 21);

	fillX(grid, 7, 19, 53);

	// balcony things
	fillX(grid, 2, 3, 41);
	fillX(grid, 2, 9, 44);
	fillX(grid, 2, 3, 47);
	fillX(grid, 2, 5, 50);
	fillX(grid, 2, 3, 53);
	fillX(grid, 2, 9, 56);
	fillX(grid, 2, 18, 59);
	fillX(grid, 2, 19, 62);

	// floor
	fillX(grid, 0, 21, 69);

	return grid;
}

function fillRow(grid: boolean[][], y: number) {
	for (let x = 2; x < gridWidth - 2; x++) {
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
