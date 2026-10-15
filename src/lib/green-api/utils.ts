import type {
	GreenApiChatItem,
	GreenApiMessageWebhookType,
	GreenApiNewNotification,
} from "./types";
import { GreenApiRateLimitError } from "./types";

export const MAX_BACKOFF_MS = 30_000;

const outgoingWebhookTypes: ReadonlySet<GreenApiMessageWebhookType> = new Set([
	"outgoingMessageReceived",
	"outgoingAPIMessageReceived",
]);

export function backoffDelayMs(failureCount: number, error: unknown): number {
	return error instanceof GreenApiRateLimitError
		? error.retryAfterMs
		: Math.min(1000 * 2 ** failureCount, MAX_BACKOFF_MS);
}

export function formatMessage(msg: GreenApiChatItem): string {
	if (msg.isDeleted) return "[Удалено]";
	if (msg.typeMessage !== "textMessage") return `[${msg.typeMessage}]`;
	return msg.textMessage;
}

export function notificationToChatItem(
	body: GreenApiNewNotification["body"],
): GreenApiChatItem {
	const { messageData } = body;
	return {
		chatId: body.senderData.chatId,
		chatType: body.senderData.chatType,
		forwardingScore: 0,
		idMessage: body.idMessage,
		isDeleted: false,
		isEdited: false,
		isForwarded: false,
		senderContactName: body.senderData.senderContactName,
		senderId: body.senderData.sender,
		senderName: body.senderData.senderName,
		senderType: body.senderData.senderType,
		textMessage:
			messageData.typeMessage === "textMessage"
				? messageData.textMessageData.textMessage
				: "",
		timestamp: body.timestamp,
		type: outgoingWebhookTypes.has(body.typeWebhook) ? "outgoing" : "incoming",
		typeMessage: messageData.typeMessage,
	};
}

export function createOptimisticMessage(
	chatId: string,
	text: string,
): GreenApiChatItem {
	return {
		chatId,
		chatType: "user",
		forwardingScore: 0,
		idMessage: crypto.randomUUID(),
		isDeleted: false,
		isEdited: false,
		isForwarded: false,
		senderContactName: "",
		senderId: "",
		senderName: "",
		senderType: "user",
		textMessage: text,
		timestamp: Math.floor(Date.now() / 1000),
		type: "outgoing",
		typeMessage: "textMessage",
	};
}
