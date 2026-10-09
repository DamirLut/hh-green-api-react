import { useId } from "react";
import { cn } from "#/lib/classname";
import Styles from "./input.module.css";

export interface InputProps extends React.ComponentProps<"input"> {
	label?: string;
}

export function Input({
	label,
	id,
	className,
	placeholder,
	...props
}: InputProps) {
	const inputId = useId();
	const htmlFor = id || inputId;

	return (
		<div className={cn(Styles.field, className)}>
			{label && (
				<label className={Styles.label} htmlFor={htmlFor}>
					{label}
				</label>
			)}
			<label className={Styles.control} htmlFor={htmlFor}>
				<input
					{...props}
					placeholder={placeholder}
					id={htmlFor}
					className={Styles.input}
				/>
				{placeholder && (
					<span className={Styles.placeholder} aria-hidden="true">
						{placeholder}
					</span>
				)}
			</label>
		</div>
	);
}
