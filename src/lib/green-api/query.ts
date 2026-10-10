import { QueryClient } from "@tanstack/react-query";
import { GreenApiRateLimitError } from "./types";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			retry: (failureCount, error) =>
				error instanceof GreenApiRateLimitError
					? failureCount < 10
					: failureCount < 3,
			retryDelay: (failureCount, error) =>
				error instanceof GreenApiRateLimitError
					? error.retryAfterMs
					: Math.min(1000 * 2 ** failureCount, 30_000),
		},
	},
});
