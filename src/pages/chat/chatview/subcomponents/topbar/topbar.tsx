import { useNavigate } from "react-router";
import { IconChevronLeft } from "#/assets/icons";
import { Avatar } from "#/components/Avatar";
import { IconButton } from "#/components/IconButton";
import { useRequiredChatId } from "#/hooks/use-current-chat-id";
import { useChatsQuery, useContactQuery } from "#/hooks/chats.query";
import { useIsMobile } from "#/hooks/use-mobile";
import { formatLastSeen } from "#/lib/utils";
import Styles from "./topbar.module.css";

export function Topbar() {
	const navigate = useNavigate();
	const isMobile = useIsMobile();
	const chatId = useRequiredChatId();
	const { data: contact } = useContactQuery(chatId);
	const { data: chats } = useChatsQuery();

	const chat = chats?.find((chat) => chat.chatId === chatId);
	const name = contact?.name || chat?.name || "loading";

	const back = () => {
		document.documentElement.dataset.navDirection = "back";
		navigate("/", { viewTransition: isMobile });
	};

	return (
		<div className={Styles.topbar}>
			<IconButton
				size="small"
				type="button"
				aria-label="Назад"
				onClick={back}
			>
				<IconChevronLeft />
			</IconButton>
			<Avatar src={contact?.avatar} alt={name} size={48} />
			<div className={Styles.info}>
				<span className={Styles.username}>{name}</span>
				<span className={Styles.status}>
					{contact ? formatLastSeen(contact.lastSeen) : ""}
				</span>
			</div>
		</div>
	);
}
