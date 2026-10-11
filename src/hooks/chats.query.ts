import {
	queryOptions,
	type UseQueryResult,
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
	createOptimisticMessage,
	type GreenApiChatItem,
	type GreenApiClient,
	useApiClient,
} from "#/lib/green-api";

export const HISTORY_LIMIT = 100;

export function chatHistoryQuery(api: GreenApiClient, chatId: string) {
	return queryOptions({
		queryKey: ["green-api", "history", chatId],
		queryFn: () => api.getChatHistory(chatId, HISTORY_LIMIT),
	});
}

export function useChatList() {
	const api = useApiClient();
	const { data: chats = [] } = useChatsQuery();

	const combine = useCallback(
		(results: UseQueryResult<number>[]) => {
			const lastMessageAt = new Map(
				chats.map((chat, index) => [chat.chatId, results[index]?.data ?? 0]),
			);
			return [...chats].sort(
				(a, b) =>
					(lastMessageAt.get(b.chatId) ?? 0) -
					(lastMessageAt.get(a.chatId) ?? 0),
			);
		},
		[chats],
	);

	return useQueries({
		queries: chats.map((chat) =>
			queryOptions({
				...chatHistoryQuery(api, chat.chatId),
				select: (history) => history.at(0)?.timestamp ?? 0,
			}),
		),
		combine,
	});
}

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

export function useChatHistoryQuery(chatId: string) {
	const api = useApiClient();

	return useQuery(chatHistoryQuery(api, chatId));
}

export function useSendMessageMutation(chatId: string) {
	const api = useApiClient();
	const queryClient = useQueryClient();
	const historyKey = ["green-api", "history", chatId] as const;

	return useMutation({
		mutationFn: (message: string) => api.sendMessage({ chatId, message }),
		onMutate: async (message) => {
			await queryClient.cancelQueries({ queryKey: historyKey });

			const previous = queryClient.getQueryData<GreenApiChatItem[]>(historyKey);
			const optimistic = createOptimisticMessage(chatId, message);
			queryClient.setQueryData<GreenApiChatItem[]>(historyKey, (messages) =>
				messages ? [optimistic, ...messages] : messages,
			);

			return { previous };
		},
		onError: (_error, _message, context) => {
			queryClient.setQueryData(historyKey, context?.previous);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: historyKey });
			void queryClient.invalidateQueries({ queryKey: ["green-api", "chats"] });
		},
	});
}
