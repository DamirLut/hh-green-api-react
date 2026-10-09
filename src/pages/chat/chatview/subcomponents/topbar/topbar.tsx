import { Avatar } from "#/components/Avatar";
import Styles from "./topbar.module.css";

export function Topbar() {
	const avatarUrl = "https://github.com/damirlut.png";
	const username = "Damir Lut";

	return (
		<div className={Styles.topbar}>
			<Avatar src={avatarUrl} alt={username} size={48} />
			<div className={Styles.info}>
				<span className={Styles.username}>{username}</span>
				<span className={Styles.status}>status message</span>
			</div>
		</div>
	);
}
