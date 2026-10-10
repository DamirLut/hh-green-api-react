import { GREEN_API_RATE_LIMIT_TABLE } from "./config";
import {
	type GreenApiAccountSettings,
	type GreenApiChat,
	type GreenApiChatItem,
	type GreenApiContact,
	type GreenApiInstanceConfig,
	GreenApiRateLimitError,
} from "./types";

export class GreenApiClient {
	#config: GreenApiInstanceConfig;
	constructor(config: GreenApiInstanceConfig) {
		this.#config = config;
	}

	async getAccountSettings() {
		return this.request<GreenApiAccountSettings>("getAccountSettings");
	}

	async getChats() {
		return this.request<GreenApiChat[]>("getChats");
	}

	async getContactInfo(chatId: string) {
		return this.post<GreenApiContact>("getContactInfo", {
			chatId,
		});
	}

	async getChatHistory(chatId: string, count = 1) {
		return this.post<GreenApiChatItem[]>("getChatHistory", {
			chatId,
			count,
		});
	}

	/// POST alias for request
	async post<T>(
		method: string,
		params: Record<string, unknown> = {},
		init: RequestInit = {},
	) {
		return this.request<T>(method, {
			method: "POST",
			body: JSON.stringify(params),
			...init,
		});
	}

	/// raw api request
	async request<T>(method: string, init: RequestInit = {}): Promise<T> {
		const url = new URL(
			`waInstance${this.#config.idInstance}/${method}/${this.#config.apiTokenInstance}`,
			this.#config.apiUrl,
		);

		const headers = new Headers(init.headers);
		if (init.body && !headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}

		const response = await fetch(url, { ...init, headers });

		if (response.status === 429) {
			let replenishRate = GREEN_API_RATE_LIMIT_TABLE[method];
			if (replenishRate === undefined) {
				console.warn(`[GREEN-API] unknown rate limit for '${method}'`);
				replenishRate = 1;
			}
			const retryAfter = 1000 / replenishRate;
			throw new GreenApiRateLimitError(retryAfter);
		}

		if (!response.ok) {
			const body = await response.json();
			console.warn(body);
			throw new Error(
				`GreenApiError: ${response.statusText} [${response.status}]`,
			);
		}

		if (response.status === 204) return undefined as T;

		return response.json() as T;
	}
}
