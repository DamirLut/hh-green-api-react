import { create } from "zustand";
import { createClientFromEnv, type GreenApiClient } from "#/lib/green-api";

interface AuthStore {
	client: GreenApiClient | null;
	signIn: (client: GreenApiClient) => void;
}

export const useAuth = create<AuthStore>()((set) => ({
	client: createClientFromEnv(),
	signIn: (client) => set({ client }),
}));
