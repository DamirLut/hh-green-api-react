import { IconMoon, IconSun } from "#/assets/icons";
import { IconButton } from "#/components/IconButton";
import { useTheme } from "#/store/theme.store";
import Styles from "./footer.module.css";

export function ChatFooter() {
	const { theme, setPreference } = useTheme();

	const Icon = theme === "dark" ? IconMoon : IconSun;

	return (
		<div className={Styles.root}>
			<IconButton
				size="small"
				aria-label="Переключить тему"
				onClick={() => {
					setPreference(theme === "dark" ? "light" : "dark");
				}}
			>
				<Icon />
			</IconButton>
		</div>
	);
}
