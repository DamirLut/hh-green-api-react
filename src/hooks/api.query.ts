import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "#/lib/green-api";

export function useAccountQuery() {
	const api = useApiClient();

	return useQuery({
		queryKey: ["green-api", "account"],
		queryFn: () => api.getAccountSettings(),
	});
}
