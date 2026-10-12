import { useEffect, useRef } from "react";
import { cn } from "#/lib/classname";
import Styles from "./dialog.module.css";

export interface DialogProps extends React.ComponentProps<"dialog"> {
	open: boolean;
	title?: string;
}

export function Dialog({
	open,
	onClose,
	title,
	className,
	children,
	...props
}: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (open) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}
	}, [open]);

	const rest = {
		...props,
	};
	if (title) {
		rest["aria-label"] = title;
	}

	return (
		<dialog
			{...rest}
			ref={ref}
			className={cn(Styles.dialog, className)}
			onClose={onClose}
			onPointerDown={(event) => {
				if (event.target === event.currentTarget) onClose?.(event);
			}}
		>
			{title && <h2 className={Styles.title}>{title}</h2>}
			{children}
		</dialog>
	);
}
