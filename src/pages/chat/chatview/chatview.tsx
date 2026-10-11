import { useCurrentChatId } from "#/hooks/use-current-chat-id";
import { cn } from "#/lib/classname";
import Styles from "./chatview.module.css";
import { ChatInput } from "./subcomponents/chatinput/chatinput";
import { MessageList } from "./subcomponents/messagelist/messagelist";
import { Topbar } from "./subcomponents/topbar";

export function ChatView() {
	const chatId = useCurrentChatId();

	if (!chatId) return null;

	return (
		<div className={cn(Styles.root)} key={chatId}>
			<Topbar />
			<div className={Styles.messages}>
				<MessageList />
			</div>
			<ChatInput />
		</div>
	);
}
