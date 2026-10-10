import { Children, useState, type ReactNode } from "react";
import { cn } from "#/lib/classname";
import { ResizableContext } from "./context";
import Styles from "./resizable.module.css";
import { Separator } from "./separator";
import { DEFAULT_WIDTH, EXPANDED_MIN_WIDTH, MIN_WIDTH } from "./utils";

interface ResizableProps {
	/** first child fills the resizable pane, the rest take the remaining space */
	children: ReactNode;
}

export function Resizable({ children }: ResizableProps) {
	const [width, setWidth] = useState(DEFAULT_WIDTH);
	const [smooth, setSmooth] = useState(false);

	const onResize = (next: number) => {
		const isSnapPoint = next === MIN_WIDTH || next === EXPANDED_MIN_WIDTH;
		setSmooth(isSnapPoint && next !== width);
		setWidth(next);
	};

	const [pane, ...rest] = Children.toArray(children);
	const collapsed = width <= MIN_WIDTH;
	const fade = Math.min(
		1,
		Math.max(0, (width - MIN_WIDTH) / (EXPANDED_MIN_WIDTH - MIN_WIDTH)),
	);

	return (
		<ResizableContext.Provider value={{ width, collapsed }}>
			<div className={Styles.root}>
				<div
					className={cn(Styles.pane, smooth && Styles.smooth)}
					style={{ width, "--info-fade": fade } as React.CSSProperties}
					data-collapsed={collapsed || undefined}
					onTransitionEnd={(e) => {
						if (e.target === e.currentTarget) setSmooth(false);
					}}
				>
					{pane}
					<Separator value={width} onResize={onResize} />
				</div>
				{rest}
			</div>
		</ResizableContext.Provider>
	);
}
