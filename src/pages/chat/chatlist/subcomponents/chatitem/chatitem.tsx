import { Link } from "react-router";
import { Avatar } from "#/components/Avatar";
import { useIsMobile } from "#/hooks/use-mobile";
import { useChatHistoryQuery, useContactQuery } from "#/hooks/chats.query";
import { cn } from "#/lib/classname";
import { formatMessage, type GreenApiChat } from "#/lib/green-api";
import { setNavDirection } from "#/lib/utils";
import Styles from "./chatitem.module.css";

interface ChatItemProps {
	data: GreenApiChat;
	selected: boolean;
}

export function ChatItem({ data, selected }: ChatItemProps) {
	const isMobile = useIsMobile();
	const { data: contact } = useContactQuery(data.chatId);
	const { data: history } = useChatHistoryQuery(data.chatId);

	const lastMessage = history?.at(0);

	const name = contact?.name || data.name || "loading";
	const avatar = contact?.avatar;

	return (
		<Link
			className={Styles.item}
			to={`/${data.chatId}`}
			viewTransition={isMobile || undefined}
			onClick={() => setNavDirection("forward")}
			data-selected={selected || undefined}
			title={JSON.stringify(data, null, 1)}
		>
			<Avatar src={avatar} alt={name} size={56} />
			<div className={Styles.info}>
				<span className={Styles.name}>{name}</span>
				<span
					className={cn(
						Styles.message,
						lastMessage?.isDeleted && Styles.deleted,
					)}
				>
					{lastMessage && formatMessage(lastMessage)}
				</span>
			</div>
		</Link>
	);
}
