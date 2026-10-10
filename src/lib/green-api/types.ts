export class GreenApiRateLimitError extends Error {
	readonly retryAfterMs: number;

	constructor(retryAfterMs: number) {
		super(`GreenApiRateLimitError: retry in ${retryAfterMs}ms`);
		this.name = "GreenApiRateLimitError";
		this.retryAfterMs = retryAfterMs;
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

export type GreenApiMessageType = "incoming";
export type GreenApiMessageSubType = "textMessage";

export interface GreenApiChatItem {
	chatId: string;
	chatType: GreenApiUserType;
	deletedMessageId?: string;
	editedMessageId?: string;
	forwardingScore: number;
	idMessage: string;
	isDeleted: boolean;
	isEdited: boolean;
	isForwarded: boolean;
	senderContactName: string;
	senderId: string;
	senderName: string;
	senderType: GreenApiUserType;
	textMessage: string;
	timestamp: number;
	type: GreenApiMessageType;
	typeMessage: GreenApiMessageSubType;
}
