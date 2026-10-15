export class GreenApiRateLimitError extends Error {
	readonly retryAfterMs: number;

	constructor(retryAfterMs: number) {
		super(`GreenApiRateLimitError: retry in ${retryAfterMs}ms`);
		this.name = "GreenApiRateLimitError";
		this.retryAfterMs = retryAfterMs;
	}
}

export class GreenApiError extends Error {
	readonly status: number;

	constructor(status: number, statusText: string) {
		super(`GreenApiError: ${statusText} [${status}]`);
		this.name = "GreenApiError";
		this.status = status;
	}
}

export interface GreenApiInstanceConfig {
	apiUrl: string;
	mediaUrl: string;
	idInstance: string;
	apiTokenInstance: string;
}

export type GreenApiInstanceState =
	| "notAuthorized"
	| "authorized"
	| "blocked"
	| "suspended"
	| "starting"
	| "pendingPassword";

export interface GreenApiAccountSettings {
	avatar: string;
	phone: string;
	stateInstance: GreenApiInstanceState;
	chatId?: string;
	suspendedUntil?: number;
	username: string;
	historySyncProgress: number;
}

type GreenApiUserType = "bot" | "user";

export interface GreenApiChat {
	chatId: string;
	name: string;
	phoneNumber: number;
	type: GreenApiUserType;
	username: string;
}

export interface GreenApiContact {
	avatar: string;
	chatId: string;
	chatType: GreenApiUserType;
	contactName: string;
	description: string;
	isPremium: boolean;
	isScam: boolean;
	isVerified: boolean;
	lastSeen: number;
	name: string;
	phoneNumber: number;
	phoneNumberTimestamp: string;
	username: string;
}

export type GreenApiMessageType = "incoming" | "outgoing";
export type GreenApiMessageSubType =
	| "textMessage"
	| "imageMessage"
	| "videoMessage"
	| "audioMessage"
	| "documentMessage"
	| "locationMessage"
	| "contactMessage"
	| "extendedTextMessage";

interface GreenApiChatRef {
	chatId: string;
	chatType: GreenApiUserType;
}

interface GreenApiSender {
	senderContactName: string;
	senderName: string;
	senderType: GreenApiUserType;
}

interface GreenApiMessageData {
	textMessage: string;
	typeMessage: GreenApiMessageSubType;
}

type GreenApiWebhookMessageData =
	| {
			typeMessage: "textMessage";
			textMessageData: {
				textMessage: string;
				forwardingScore: number;
				isForwarded: boolean;
			};
	  }
	| {
			typeMessage: Exclude<GreenApiMessageSubType, "textMessage">;
	  };

export interface GreenApiChatItem
	extends GreenApiChatRef,
		GreenApiSender,
		GreenApiMessageData {
	deletedMessageId?: string;
	editedMessageId?: string;
	forwardingScore: number;
	idMessage: string;
	isDeleted: boolean;
	isEdited: boolean;
	isForwarded: boolean;
	senderId: string;
	timestamp: number;
	type: GreenApiMessageType;
}

export interface GreenApiSendMessageParams {
	chatId: string;
	message: string;
	typingTime?: number;
	quotedMessageId?: string;
}

export interface GreenApiSendMessageResponse {
	idMessage: string;
}

export type GreenApiMessageWebhookType =
	| "incomingMessageReceived"
	| "outgoingMessageReceived"
	| "outgoingAPIMessageReceived";

export type GreenApiWebhookType = GreenApiMessageWebhookType;

export interface GreenApiNewNotification {
	receiptId: number;
	body: {
		typeWebhook: GreenApiWebhookType;
		instanceData: {
			idInstance: number;
			wid: string;
			typeInstance: string;
		};
		timestamp: number;
		idMessage: string;
		senderData: GreenApiChatRef &
			GreenApiSender & {
				chatName: string;
				sender: string;
				senderPhoneNumber: number;
			};
		messageData: GreenApiWebhookMessageData;
	};
}

export interface GreenApiCheckAccountResponse {
	exist: boolean;
	chatId: string;
	fromCache: boolean;
}
