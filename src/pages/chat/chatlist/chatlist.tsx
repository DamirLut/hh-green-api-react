import { useChatsQuery } from "#/hooks/chats.query";
import Styles from "./chatlist.module.css";
import { ChatItem } from "./subcomponents/chatitem/chatitem";
import { ChatHeader } from "./subcomponents/header";

export function ChatList() {
	const chatsQuery = useChatsQuery();

	return (
		<div className={Styles.root}>
			<ChatHeader />
			<div className={Styles.list}>
				{chatsQuery.data?.map((chat) => (
					<ChatItem key={chat.chatId} data={chat} />
				))}
			</div>
		</div>
	);
}
