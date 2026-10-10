import { Avatar } from "#/components/Avatar";
import { useChatHistoryQuery, useContactQuery } from "#/hooks/chats.query";
import { cn } from "#/lib/classname";
import type { GreenApiChat } from "#/lib/green-api";
import Styles from "./chatitem.module.css";

interface ChatItemProps {
	data: GreenApiChat;
}

export function ChatItem({ data }: ChatItemProps) {
	const { data: contact } = useContactQuery(data.chatId);
	const { data: history } = useChatHistoryQuery(data.chatId);

	const lastMessage = history?.at(0);

	return (
		<div className={Styles.item} title={`chatId: ${data.chatId}`}>
			<Avatar
				src={contact?.avatar}
				alt={contact?.name || "loading"}
				size={56}
			/>
			<div className={Styles.info}>
				<span className={Styles.name}>{contact?.name || "loading"}</span>
				<span
					className={cn(
						Styles.message,
						lastMessage?.isDeleted && Styles.deleted,
					)}
				>
					{lastMessage?.isDeleted ? "[Удалено]" : lastMessage?.textMessage}
				</span>
			</div>
		</div>
	);
}
