import { BackgroundPattern } from "#/components/BackgroundPattern";
import { ChatList } from "./chatlist/chatlist";
import { ChatView } from "./chatview/chatview";
import Styles from "./сhat.module.css";

export function ChatPage() {
	return (
		<>
			<BackgroundPattern alwaysShow />
			<div className={Styles.root}>
				<ChatList />
				<ChatView />
			</div>
		</>
	);
}
