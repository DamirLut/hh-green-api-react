import { BackgroundPattern } from "#/components/BackgroundPattern";

import { ChatList } from "./chatlist/chatlist";
import { ChatView } from "./chatview/chatview";
import { Resizable } from "./resizable";

export function ChatPage() {
	return (
		<>
			<BackgroundPattern alwaysShow />
			<Resizable>
				<ChatList />
				<ChatView />
			</Resizable>
		</>
	);
}
