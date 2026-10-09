import { cn } from "#/lib/classname";
import Styles from "./button.module.css";

export type ButtonSize = "xsmall" | "small" | "medium" | "large";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps {
	size?: ButtonSize;
	variant?: ButtonVariant;
	stretched?: boolean;
	as?: React.ElementType;
}

type ButtonPropsWithAs<T extends React.ElementType> = Omit<ButtonProps, "as"> & {
	as?: T;
} & Omit<React.ComponentProps<T>, keyof ButtonProps>;

export function Button<T extends React.ElementType = "button">({
	as,
	size = "medium",
	variant = "primary",
	stretched = false,
	className,
	children,
	...props
}: ButtonPropsWithAs<T>) {
	const Component: React.ElementType = as ?? "button";

	return (
		<Component
			{...props}
			className={cn(
				Styles.button,
				Styles[`size_${size}`],
				Styles[`variant_${variant}`],
				stretched && Styles.stretched,
				className,
			)}
		>
			<span className={Styles.content}>{children}</span>
		</Component>
	);
}
