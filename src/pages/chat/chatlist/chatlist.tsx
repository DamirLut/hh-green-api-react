import { useChatList } from "#/hooks/chats.query";
import { useCurrentChatId } from "#/hooks/use-current-chat-id";
import Styles from "./chatlist.module.css";
import { ChatItem } from "./subcomponents/chatitem/chatitem";
import { ChatFooter } from "./subcomponents/footer";
import { ChatHeader } from "./subcomponents/header";

export function ChatList() {
	const chats = useChatList();
	const currentChatId = useCurrentChatId();

	return (
		<div className={Styles.root}>
			<ChatHeader />
			<div className={Styles.list}>
				{chats.map((chat) => (
					<ChatItem
						key={chat.chatId}
						data={chat}
						selected={chat.chatId === currentChatId}
					/>
				))}
			</div>
			<ChatFooter />
		</div>
	);
}
