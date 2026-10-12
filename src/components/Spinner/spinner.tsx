import { cn } from "#/lib/classname";
import Styles from "./spinner.module.css";

export function Spinner({ className }: { className?: string }) {
	return (
		<span role="status" aria-label="Загрузка" className={cn(Styles.spinner, className)} />
	);
}
