import { type KeyboardEvent, type PointerEvent, useState } from "react";
import { cn } from "#/lib/classname";
import Styles from "./separator.module.css";
import {
	clampWidth,
	KEYBOARD_STEP,
	MAX_WIDTH,
	MIN_WIDTH,
	snapWidth,
	stepWidth,
} from "./utils";

type SeparatorProps = {
	value: number;
	onResize: (width: number) => void;
};

export function Separator({ value, onResize }: SeparatorProps) {
	const [isDragging, setIsDragging] = useState(false);

	const startDrag = (e: PointerEvent) => {
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		setIsDragging(true);
	};

	const moveDrag = (e: PointerEvent) => {
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		const left = e.currentTarget.parentElement?.getBoundingClientRect().left;
		if (left !== undefined) onResize(clampWidth(e.clientX - left));
	};

	const endDrag = (e: PointerEvent) => {
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		setIsDragging(false);
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
		const snapped = snapWidth(value);
		if (snapped !== value) onResize(snapped);
	};

	const keyDown = (e: KeyboardEvent) => {
		if (e.key === "ArrowLeft") onResize(stepWidth(value, -KEYBOARD_STEP));
		if (e.key === "ArrowRight") onResize(stepWidth(value, KEYBOARD_STEP));
	};

	return (
		<hr
			className={cn(Styles.separator, isDragging && Styles.dragging)}
			tabIndex={0}
			aria-orientation="vertical"
			aria-label="Resize chat list"
			aria-valuenow={value}
			aria-valuemin={MIN_WIDTH}
			aria-valuemax={MAX_WIDTH}
			onKeyDown={keyDown}
			onPointerDown={startDrag}
			onPointerMove={moveDrag}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
			onLostPointerCapture={endDrag}
		/>
	);
}
