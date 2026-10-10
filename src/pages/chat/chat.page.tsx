import { Outlet } from "react-router";
import { BackgroundPattern } from "#/components/BackgroundPattern";

import { ChatList } from "./chatlist/chatlist";
import { Resizable } from "./resizable";

export function ChatPage() {
	return (
		<>
			<BackgroundPattern alwaysShow />
			<Resizable>
				<ChatList />
				<Outlet />
			</Resizable>
		</>
	);
}
