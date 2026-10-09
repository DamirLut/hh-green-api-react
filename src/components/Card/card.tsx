import { cn } from "#/lib/classname";
import Styles from "./card.module.css";

export interface CardProps {
	as?: React.ElementType;
}

type CardPropsWithAs<T extends React.ElementType> = Omit<CardProps, "as"> & {
	as?: T;
} & Omit<React.ComponentProps<T>, keyof CardProps>;

export function Card<T extends React.ElementType = "div">({
	as,
	className,
	...props
}: CardPropsWithAs<T>) {
	const Component: React.ElementType = as ?? "div";

	return <Component className={cn(Styles.card, className)} {...props} />;
}
