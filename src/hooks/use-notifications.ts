import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
	backoffDelayMs,
	type GreenApiChatItem,
	type GreenApiClient,
	type GreenApiMessageWebhookType,
	GreenApiRateLimitError,
	notificationToChatItem,
	useApiClient,
} from "#/lib/green-api";
import { sleepWithSignal } from "#/lib/utils";

const messageWebhookTypes: ReadonlySet<GreenApiMessageWebhookType> = new Set([
	"incomingMessageReceived",
	"outgoingMessageReceived",
	"outgoingAPIMessageReceived",
]);

function applyMessage(queryClient: QueryClient, message: GreenApiChatItem) {
	queryClient.setQueryData<GreenApiChatItem[]>(
		["green-api", "history", message.chatId],
		(messages) => {
			if (!messages) return messages;
			if (messages.some((item) => item.idMessage === message.idMessage)) {
				return messages;
			}
			const optimisticIndex = messages.findLastIndex(
				(item) =>
					item.type === "outgoing" &&
					item.senderId === "" &&
					item.textMessage === message.textMessage,
			);
			if (optimisticIndex !== -1) {
				const confirmed = [...messages];
				confirmed[optimisticIndex] = message;
				return confirmed;
			}
			return [message, ...messages];
		},
	);
}

async function pollNotifications(
	api: GreenApiClient,
	queryClient: QueryClient,
	signal: AbortSignal,
) {
	let failureCount = 0;

	while (!signal.aborted) {
		try {
			const notification = await api.receiveNotification({ signal });

			if (notification) {
				if (messageWebhookTypes.has(notification.body.typeWebhook)) {
					applyMessage(queryClient, notificationToChatItem(notification.body));
				}
				await api.deleteNotification(notification.receiptId, { signal });
			}

			failureCount = 0;
		} catch (error) {
			if (signal.aborted) return;

			const waitMs = backoffDelayMs(failureCount, error);
			if (!(error instanceof GreenApiRateLimitError)) {
				failureCount += 1;
			}
			console.warn("[green-api] receiveNotification failed, retrying", error);
			await sleepWithSignal(waitMs, signal);
		}
	}
}

export function useNotificationsPoll() {
	const api = useApiClient();
	const queryClient = useQueryClient();

	useEffect(() => {
		const controller = new AbortController();
		void pollNotifications(api, queryClient, controller.signal);
		return () => controller.abort();
	}, [api, queryClient]);
}

export function NotificationsProvider() {
	useNotificationsPoll();
	return null;
}
