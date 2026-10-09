import type { CSSProperties } from "react";
import pattern from "#/assets/backgrounds/pattern_space.svg?url";
import { cn } from "#/lib/classname";
import Styles from "./pattern.module.css";

type BackgroundPatternProps = {
	alwaysShow?: boolean;
};

export function BackgroundPattern({ alwaysShow }: BackgroundPatternProps) {
	return (
		<div
			className={cn(
				Styles.layer,
				Styles.background,
				alwaysShow && Styles.alwaysShow,
			)}
			style={{ "--pattern-url": `url(${pattern})` } as CSSProperties}
		/>
	);
}
