import { COLORS } from './colors';

export const FIXED_FPS = 40;
export const FIXED_DELTA_TIME = 1000 / FIXED_FPS;
export const FIXED_DELTA_SECS = FIXED_DELTA_TIME / 1000;
export const MAX_DELTA_TIME = 1250;

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

	FONT_SIZE: 7,
	TEXT_COLOR: 'rgb(255, 255, 255)',
	TEXT_OUTLINE_COLOR: 'rgb(60, 64, 77)',
	TEXT_OUTLINE_WEIGHT: 2,

	Z_INDEX: -1,
	FOREGROUND_Z_INDEX: 10
};

export const WORLD_SIZE = {
	REFERENCE_WIDTH: 240
};

export const PHYSICS = {
	GRAVITY: 500
};

export const COLLISION_SPACE = {
	CELL_SIZE: 10
};

export const MOBILE = {
	EDGE_CHECK: 0.1,

	DOWN_JUMP_SPEED: 150,
	UP_JUMP_SPEED: 105,
	DOWN_LAUNCH_ANGLE: 0.349066, // 20 degrees
	UP_LAUNCH_ANGLE: 1.0472 // 60 degrees
	// UP_LAUNCH_ANGLE: 1.22173, // 70 degrees
};

export const PLAYER = {
	SPRITE_WIDTH: 32,
	SPRITE_HEIGHT: 32,

	WIDTH: 20,
	HEIGHT: 16,
	INTERACT_WIDTH: 6,

	SPEED: 135,

	WALK_ANIM_IDLE_THRESHOLD: 0.05, // how long the player needs to be idle to enter idle animation (to prevent switching between walking and idling too rapidly)
	CONTROLS_IDLE_THRESHOLD: 2, // how long the plaeyr needs to be idle before the controls are shown

	Z_INDEX: 5
};

export const PLAYER_COMPUTED = {
	HALF_WIDTH: PLAYER.WIDTH / 2,
	WIDTH_DIFF: PLAYER.SPRITE_WIDTH - PLAYER.WIDTH,
	HALF_WIDTH_DIFF: (PLAYER.SPRITE_WIDTH - PLAYER.WIDTH) / 2,

	HALF_HEIGHT: PLAYER.HEIGHT / 2,
	HEIGHT_DIFF: PLAYER.SPRITE_HEIGHT - PLAYER.HEIGHT,

	INTERACT_WIDTH_DIFF: PLAYER.WIDTH - PLAYER.INTERACT_WIDTH
};

export const INDICATORS = {
	MAX_OFFSET: 1,
	MOVE_SPEED: 4,
	WIDTH: 8,
	HEIGHT: 8,
	SPACING: 1,
	Z_INDEX: BUILDING.FOREGROUND_Z_INDEX + 1
};

export const POT = {
	SPRITE_WIDTH: 12,
	SPRITE_HEIGHT: 12,
	WIDTH: 8,
	HEIGHT: 6,
	MIN_FALLING_VELOCITY: 35, // if y velocity exceeds this amount, the pot will break on impact

	SHATTER_CELL_WIDTH: 36,
	SHATTER_CELL_HEIGHT: 36,

	Z_INDEX: PLAYER.Z_INDEX
};

export const POT_COMPUTED = {
	WIDTH_DIFF: POT.SPRITE_WIDTH - POT.WIDTH,
	WIDTH_DIFF_HALF: (POT.SPRITE_WIDTH - POT.WIDTH) / 2,
	HEIGHT_DIFF: POT.SPRITE_HEIGHT - POT.HEIGHT
};

export const INTERACTION = {
	BORDER_RADIUS: 2,
	STROKE_WEIGHT: 1.25,
	FILL_COLOR: 'rgba(255, 255, 255, 0.2)',
	STROKE_COLOR: 'rgb(187, 228, 255)',
	GLOW_COLOR: 'rgb(128, 184, 236)',

	SECONDARY_STROKE_COLOR: 'rgba(187, 228, 255, 0.5)',
	SECONDARY_GLOW_COLOR: 'rgba(245, 195, 139, 0.5)',

	SPEECH_BUBBLE_DURATION: 3,
	SPEECH_BUBBLE_PRIORITY: 2,

	Z_INDEX: PLAYER.Z_INDEX - 1
};

export const INTERACTION_DISPLAY = {
	WIDTH: 8,
	HEIGHT: 8,

	MOUSE_OFFSET_Y: -2,
	MOUSE_OFFSET_X: 6,
	MULTIPLE_OPTIONS_GAP: 10,

	TEXT_COLOR: 'rgb(255, 255, 255)',
	OUTLINE_COLOR: 'rgb(0, 0, 0)',
	FONT_SIZE: 6.5,
	OUTLINE_WEIGHT: 1,

	PLAYER_HOVER_Z_INDEX: BUILDING.FOREGROUND_Z_INDEX + 1,
	MOUSE_HOVER_Z_INDEX: PLAYER.Z_INDEX - 1
};

export const TV = {
	BG_FILL_COLOR: 'rgba(255, 255, 255, 0.06)',
	FG_FILL_COLOR: 'rgba(255, 255, 255, 0.04)',
	STROKE_COLOR: 'rgb(187, 228, 255)',
	GLOW_COLOR: 'rgb(255, 160, 207)',
	GLOW_BLUR: 45,

	GLOW_GROW: 7.5,
	GLOW_GROW_SMALL: 3,

	IMAGE_DURATION: 3,

	BG_GLOW_INDEX: 0,
	IMAGE_Z_INDEX: 1,
	FRONT_GLOW_Z_INDEX: PLAYER.Z_INDEX + 1
};

export const RAT = {
	SPRITE_WIDTH: 32,
	SPRITE_HEIGHT: 32,

	WIDTH: 16,
	HEIGHT: 8,
	INTERACT_WIDTH: PLAYER.INTERACT_WIDTH,

	WALK_SPEED: 80,
	RUN_SPEED: PLAYER.SPEED + 45,

	PLAYER_SAME_LEVEL_MARGIN: 5,
	PLAYER_DETECTION_Y: 50,
	PLAYER_DETECTION_X: 60,

	INDICATOR_WIDTH: 12,
	INDICATOR_HEIGHT: 12,
	INDICATOR_OFFSET_Y: 4,

	STOPPED_THRESHOLD: 0.1,
	PANIC_TIME: 0.65,

	JUMP_COOLDOWN: 0.15,

	MAX_RATS: 6,
	SPEECH_BUBBLE_DURATION: 2,
	SPEECH_BUBBLE_PRIORITY: INTERACTION.SPEECH_BUBBLE_PRIORITY,

	PARTICLES_CELL_HEIGHT: 48,
	PARTICLES_CELL_WIDTH: 48,

	Z_INDEX: PLAYER.Z_INDEX
};

export const RAT_COMPUTED = {
	WIDTH_DIFF: RAT.SPRITE_WIDTH - RAT.WIDTH,
	WIDTH_DIFF_HALF: (RAT.SPRITE_WIDTH - RAT.WIDTH) / 2,
	HEIGHT_DIFF: RAT.SPRITE_HEIGHT - RAT.HEIGHT,

	INTERACT_WIDTH_DIFF: PLAYER.WIDTH - PLAYER.INTERACT_WIDTH
};

export const WORD_BUBBLE = {
	BORDER_RADIUS: 7.5,
	IDEAL_TAIL_LENGTH: 15,
	TAIL_WIDTH: 4,
	TAIL_BOX_GAP: 1, // gap between the tail and text box

	TAIL_OFFSET_X: 6,
	TAIL_OFFSET_Y: 4,
	OFFSET_X: 12,
	OFFSET_Y: -10,

	MIN_VIEWPORT_OFFSET: 8, // bubble should be atleast this far from viewport

	WIDTH: 75,
	HEIGHT: 35,
	PADDING_X: 2,

	FONT_SIZE: 5,
	TAIL_COLOR: COLORS.OFF_WHITE,
	FILL_COLOR: COLORS.OFF_WHITE,
	FILL_ALPHA: 255,
	TEXT_COLOR: COLORS.OFF_BLACK,
	TEXT_ALPHA: 255,

	Z_INDEX: 15
};

let gridWidth = Math.ceil(BUILDING.WIDTH / COLLISION_SPACE.CELL_SIZE);
let gridHeight = Math.ceil(BUILDING.HEIGHT / COLLISION_SPACE.CELL_SIZE);

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

	// billboard
	fillX(grid, 4, 16, 29);

	// ledge
	fillX(grid, 2, 19, 34);

	// pipe
	fillX(grid, 2, 15, 37);
	fillY(grid, 38, 42, 15);
	fillX(grid, 15, 21, 43);
	fillY(grid, 43, 61, 21);

	// billboard
	fillX(grid, 9, 19, 53);

	// balcony things
	fillX(grid, 2, 3, 41);
	fillX(grid, 2, 7, 44);
	fillX(grid, 2, 3, 47);
	fillX(grid, 2, 7, 50);
	fillX(grid, 2, 3, 53);
	fillX(grid, 2, 9, 56);
	fillX(grid, 2, 18, 59);
	fillX(grid, 2, 19, 62);

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
