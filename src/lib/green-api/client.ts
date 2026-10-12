import { GREEN_API_RATE_LIMIT_TABLE } from "./config";
import {
	type GreenApiAccountSettings,
	type GreenApiChat,
	type GreenApiChatItem,
	type GreenApiContact,
	GreenApiError,
	type GreenApiInstanceConfig,
	type GreenApiNewNotification,
	GreenApiRateLimitError,
	type GreenApiSendMessageParams,
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

	async sendMessage(params: GreenApiSendMessageParams) {
		return this.post("sendMessage", params);
	}

	async receiveNotification(init: RequestInit = {}) {
		const response = await this.request<GreenApiNewNotification | null>(
			"receiveNotification",
			init,
		).catch((error) => {
			if (error instanceof GreenApiError && error.status === 408) return null;
			throw new Error("[GREEN-API] unexpected receiveNotification payload", {
				cause: error,
			});
		});
		if (response && typeof response === "object" && "receiptId" in response) {
			return response;
		}
		if (response !== null) {
			console.warn(
				"[GREEN-API] unexpected receiveNotification payload",
				typeof response,
				response,
			);
		}
		return null;
	}

	async deleteNotification(receiptId: number, init: RequestInit = {}) {
		return this.request(
			"deleteNotification",
			{
				method: "DELETE",
				...init,
			},
			`/${receiptId}`,
		);
	}

	/// POST alias for request
	async post<T>(method: string, params: object = {}, init: RequestInit = {}) {
		return this.request<T>(method, {
			method: "POST",
			body: JSON.stringify(params),
			...init,
		});
	}

	/// raw api request
	async request<T>(
		method: string,
		init: RequestInit = {},
		extendedPath: string = "",
	): Promise<T> {
		const url = new URL(
			`waInstance${this.#config.idInstance}/${method}/${this.#config.apiTokenInstance}${extendedPath}`,
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
			const body = await response.json().catch(() => null);
			console.warn(body);
			throw new GreenApiError(response.status, response.statusText);
		}

		if (response.status === 204) return undefined as T;

		return response.json() as T;
	}
}
