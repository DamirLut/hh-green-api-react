import { QueryClient } from "@tanstack/react-query";
import { backoffDelayMs } from "./utils";
import { GreenApiRateLimitError } from "./types";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			retry: (failureCount, error) =>
				error instanceof GreenApiRateLimitError
					? failureCount < 10
					: failureCount < 3,
			retryDelay: backoffDelayMs,
		},
	},
});
