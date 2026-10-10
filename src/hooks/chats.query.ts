import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "#/lib/green-api";

export function useChatsQuery() {
	const api = useApiClient();

	return useQuery({
		queryKey: ["green-api", "chats"],
		queryFn: () => api.getChats(),
	});
}

export function useContactQuery(chatId: string) {
	const api = useApiClient();

	return useQuery({
		queryKey: ["green-api", "contact", chatId],
		queryFn: () => api.getContactInfo(chatId),
	});
}

export function useChatHistoryQuery(chatId: string, count = 1) {
	const api = useApiClient();

	return useQuery({
		queryKey: ["green-api", "history", chatId],
		queryFn: () => api.getChatHistory(chatId, count),
	});
}
