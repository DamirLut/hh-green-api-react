import { useNavigate } from "react-router";
import { IconChevronLeft } from "#/assets/icons";
import { Avatar } from "#/components/Avatar";
import { IconButton } from "#/components/IconButton";
import { useContactQuery } from "#/hooks/chats.query";
import { formatLastSeen } from "#/lib/utils";
import Styles from "./topbar.module.css";

interface TopbarProps {
	chatId: string;
}

export function Topbar({ chatId }: TopbarProps) {
	const navigate = useNavigate();
	const { data: contact } = useContactQuery(chatId);

	return (
		<div className={Styles.topbar}>
			<IconButton
				size="small"
				type="button"
				aria-label="Назад"
				onClick={() => navigate("/")}
			>
				<IconChevronLeft />
			</IconButton>
			<Avatar
				src={contact?.avatar}
				alt={contact?.name || "loading"}
				size={48}
			/>
			<div className={Styles.info}>
				<span className={Styles.username}>{contact?.name || "loading"}</span>
				<span className={Styles.status}>
					{contact ? formatLastSeen(contact.lastSeen) : ""}
				</span>
			</div>
		</div>
	);
}
