import { Children, type ReactNode, useState } from "react";
import { useCurrentChatId } from "#/hooks/use-current-chat-id";
import { useIsMobile } from "#/hooks/use-mobile";
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
	const isMobile = useIsMobile();
	const chatOpen = useCurrentChatId() !== undefined;
	const collapsed = !isMobile && width <= MIN_WIDTH;
	const fade = isMobile
		? 1
		: Math.min(
				1,
				Math.max(0, (width - MIN_WIDTH) / (EXPANDED_MIN_WIDTH - MIN_WIDTH)),
			);

	return (
		<ResizableContext.Provider value={{ width, collapsed }}>
			<div className={Styles.root}>
				<div
					key={isMobile ? "mobile" : "desktop"}
					className={cn(Styles.pane, smooth && Styles.smooth)}
					style={
						{
							"--pane-width": `${width}px`,
							"--info-fade": fade,
						} as React.CSSProperties
					}
					data-collapsed={collapsed || undefined}
					data-chat-open={chatOpen || undefined}
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
