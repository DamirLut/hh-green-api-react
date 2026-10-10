import { createContext, useContext } from "react";
import type { GreenApiClient } from "./client";

export const ApiClientContext = createContext<GreenApiClient | null>(null);

export function useApiClient(): GreenApiClient {
	const client = useContext(ApiClientContext);
	if (!client) throw new Error("useApiClient: ApiClientContext has no client");
	return client;
}
