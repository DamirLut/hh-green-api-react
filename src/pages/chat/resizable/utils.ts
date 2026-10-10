export const DEFAULT_WIDTH = 320;
export const MIN_WIDTH = 80;
export const MAX_WIDTH = 508;
export const EXPANDED_MIN_WIDTH = 300;
export const KEYBOARD_STEP = 10;

const SNAP_THRESHOLD = (MIN_WIDTH + EXPANDED_MIN_WIDTH) / 2;

export const clampWidth = (width: number) =>
	Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));

export const snapWidth = (width: number) => {
	const clamped = clampWidth(width);
	if (clamped >= EXPANDED_MIN_WIDTH) return clamped;
	return clamped < SNAP_THRESHOLD ? MIN_WIDTH : EXPANDED_MIN_WIDTH;
};

export const stepWidth = (width: number, delta: number) => {
	const next = clampWidth(width + delta);
	if (next < EXPANDED_MIN_WIDTH) return delta > 0 ? EXPANDED_MIN_WIDTH : MIN_WIDTH;
	return next;
};
