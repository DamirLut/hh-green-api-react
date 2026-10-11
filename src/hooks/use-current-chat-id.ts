import { useMatch } from "react-router";

export function useCurrentChatId() {
	const match = useMatch("/:chatId");
	return match?.params.chatId;
}

export function useRequiredChatId() {
	const chatId = useCurrentChatId();
	if (!chatId) throw new Error("Chat is not open");
	return chatId;
}
