import { Vec2 } from './models/Vec2';

export const FLOAT_TOLERANCE = 0.001;

export const CANVAS_SIZE = {
	MIN_WIDTH: 300,
	MAX_WIDTH: 800,
	PADDING: 0.9
};

export const BUILDING = {
	WIDTH: 240,
	HEIGHT: 700,
	ASPECT_RATIO: 240 / 700,

	Z_INDEX: -1,
	FOREGROUND_Z_INDEX: 10
};

export const WORLD_SIZE = {
	REFERENCE_WIDTH: 240
};

export const PHYSICS = {
	GRAVITY: 500
};

export const PLAYER = {
	SPRITE_WIDTH: 32,
	SPRITE_HEIGHT: 32,

	WIDTH: 20,
	HEIGHT: 16,
	SPEED: 100,

	EDGE_CHECK: 0.1,

	DOWN_JUMP_SPEED: 150,
	UP_JUMP_SPEED: 85,
	DOWN_LAUNCH_ANGLE: 0.349066, // 20 degrees
	UP_LAUNCH_ANGLE: 1.0472, // 60 degrees
	// UP_LAUNCH_ANGLE: 1.22173, // 70 degrees

	IDLETIME_THRESHOLD: 0.05 // how long the player needs to be idle to enter idle animation (to prevent switching between walking and idling too rapidly)
};

// TODO: PLAYER_COMPUTED, which contains commonly used things like SPRITE_WIDTH - WIDTH

export const COLLISION_SPACE = {
	CELL_SIZE: 10
};

export const INDICATORS = {
	MAX_OFFSET: 1,
	MOVE_SPEED: 4,
	WIDTH: 16 / 3,
	HEIGHT: 16 / 3,
	SPACING: 1,
	Z_INDEX: 15
};

export const POT = {
	SPRITE_WIDTH: 12,
	SPRITE_HEIGHT: 12,
	WIDTH: 8,
	HEIGHT: 6,
	FALLING_VELOCITY: 35 // if y velocity exceeds this amount, the pot will be considered falling, and will break on impact
};

export const POT_COMPUTED = {
	WIDTH_DIFF: POT.SPRITE_WIDTH - POT.WIDTH,
	WIDTH_DIFF_HALF: (POT.SPRITE_WIDTH - POT.WIDTH) / 2,
	HEIGHT_DIFF: POT.SPRITE_HEIGHT - POT.HEIGHT
};

let gridWidth = Math.ceil(BUILDING.WIDTH / COLLISION_SPACE.CELL_SIZE);
let gridHeight = Math.ceil(BUILDING.HEIGHT / COLLISION_SPACE.CELL_SIZE);

export const INTERACTION = {
	BORDER_RADIUS: 2,
	STROKE_WEIGHT: 1.25,
	FILL_COLOR: 'rgba(255, 255, 255, 0.2)',
	STROKE_COLOR: 'rgb(187, 228, 255)',
	GLOW_COLOR: 'rgb(128, 184, 236)',

	SECONDARY_STROKE_COLOR: 'rgba(187, 228, 255, 0.5)',
	SECONDARY_GLOW_COLOR: 'rgba(245, 195, 139, 0.5)',

	THOUGHT_BUBBLE_DURATION: 1.5,
	SPEECH_BUBBLE_DURATION: 1.75
};

export const WORD_BUBBLE = {
	BORDER_RADIUS: 1,
	STROKE_WIDTH: 0,

	OFFSET_X: 7,
	OFFSET_Y: -12,

	WIDTH: 60,
	HEIGHT: 20,

	FONT_SIZE: 5,
	FILL_COLOR: 'rgb(250, 228, 186)',
	FILL_ALPHA: 255 * 0.8,
	TEXT_COLOR: 'rgb(19, 15, 13)',
	TEXT_ALPHA: 255,

	Z_INDEX: INDICATORS.Z_INDEX + 1
};

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
