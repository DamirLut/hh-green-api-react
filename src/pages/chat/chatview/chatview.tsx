import { useEffect, useState } from "react";
import { Input } from "#/components/Input";
import { useIsMobile } from "#/hooks/use-mobile";
import { cn } from "#/lib/classname";
import { useSelectedChatId } from "../use-selected-chat-id";
import Styles from "./chatview.module.css";
import { EmptyHistory } from "./subcomponents/emptyhistory";
import { Topbar } from "./subcomponents/topbar";

const SLIDE_MS = 250;

export function ChatView() {
	const chatId = useSelectedChatId();
	const isMobile = useIsMobile();
	const [shownChatId, setShownChatId] = useState(chatId);

	useEffect(() => {
		if (chatId) {
			setShownChatId(chatId);
			return;
		}
		if (shownChatId && isMobile) {
			const timer = setTimeout(() => setShownChatId(undefined), SLIDE_MS);
			return () => clearTimeout(timer);
		}
		setShownChatId(undefined);
	}, [chatId, shownChatId, isMobile]);

	if (!shownChatId) return null;

	return (
		<div className={cn(Styles.root)} key={shownChatId}>
			<Topbar chatId={shownChatId} />
			<div className={Styles.messages}>
				<EmptyHistory />
			</div>
			<div className={cn(Styles.inputWrapper)}>
				<Input placeholder="Type a message..." />
			</div>
		</div>
	);
}
