import type { CSSProperties } from "react";
import pattern from "#/assets/backgrounds/pattern_space.svg?url";
import { cn } from "#/lib/classname";
import Styles from "./pattern.module.css";

export function BackgroundPattern() {
	return (
		<div
			className={cn(Styles.layer, Styles.background)}
			style={{ "--pattern-url": `url(${pattern})` } as CSSProperties}
		/>
	);
}
