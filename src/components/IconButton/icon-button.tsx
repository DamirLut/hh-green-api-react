import { cn } from "#/lib/classname";
import Styles from "./icon-button.module.css";

export type IconButtonSize = "xsmall" | "small" | "medium" | "large";

export interface IconButtonProps {
	size?: IconButtonSize;
	as?: React.ElementType;
}

type IconButtonPropsWithAs<T extends React.ElementType> = Omit<IconButtonProps, "as"> & {
	as?: T;
} & Omit<React.ComponentProps<T>, keyof IconButtonProps>;

export function IconButton<T extends React.ElementType = "button">({
	as,
	size = "medium",
	className,
	children,
	...props
}: IconButtonPropsWithAs<T>) {
	const Component: React.ElementType = as ?? "button";

	return (
		<Component
			{...props}
			className={cn(Styles.iconButton, Styles[`size_${size}`], className)}
		>
			<span className={Styles.content}>{children}</span>
		</Component>
	);
}
