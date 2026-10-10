import { useMatch } from "react-router";

export function useSelectedChatId() {
	const match = useMatch("/:chatId");
	return match?.params.chatId;
}
