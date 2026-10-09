import { IconMoon, IconSun } from "#/assets/icons";
import { IconButton } from "#/components/IconButton";
import { useTheme } from "#/store/theme.store";
import Styles from "./header.module.css";

export function ChatHeader() {
	const { theme, setPreference } = useTheme();

	const Icon = theme === "dark" ? IconMoon : IconSun;

	return (
		<div className={Styles.root}>
			<span className={Styles.title}>Chats</span>

			<IconButton
				size="small"
				onClick={() => {
					setPreference(theme === "dark" ? "light" : "dark");
				}}
			>
				<Icon />
			</IconButton>
		</div>
	);
}
