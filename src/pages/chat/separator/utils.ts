export const DEFAULT_WIDTH = 320;
export const MIN_WIDTH = 82;
export const MAX_WIDTH = 508;
export const KEYBOARD_STEP = 10;

export const clampWidth = (width: number) =>
	Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));
