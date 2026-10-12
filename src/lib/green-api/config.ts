import { GreenApiClient } from "./client";
import type { GreenApiInstanceConfig } from "./types";

export const GREEN_API_RATE_LIMIT_TABLE: Record<string, number> = {
	getAccountSettings: 1,
	getChats: 1,
	getContactInfo: 1,
	getChatHistory: 1,
	checkAccount: 1,
	receiveNotification: 1,
	deleteNotification: 1,
};

const DEFAULT_API_URL = "https://4100.api.green-api.com";

export function createClientFromEnv(): GreenApiClient | null {
	const idInstance = import.meta.env.VITE_GREEN_API_ID_INSTANCE;
	const apiTokenInstance = import.meta.env.VITE_GREEN_API_TOKEN_INSTANCE;
	if (!idInstance || !apiTokenInstance) return null;

	const config: GreenApiInstanceConfig = {
		idInstance,
		apiTokenInstance,
		apiUrl: import.meta.env.VITE_GREEN_API_URL ?? DEFAULT_API_URL,
		mediaUrl: import.meta.env.VITE_GREEN_MEDIA_URL ?? DEFAULT_API_URL,
	};
	return new GreenApiClient(config);
}
