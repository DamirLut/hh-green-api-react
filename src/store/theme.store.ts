import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type ThemePreference = "light" | "dark" | "system";

interface ThemeStore {
	preference: ThemePreference;
	theme: Theme;
	setPreference: (theme: ThemePreference) => void;
	syncSystemTheme: () => void;
}

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const getSystemTheme = () => (mediaQuery.matches ? "dark" : "light");
const selectTheme = (preference: ThemePreference) =>
	preference === "system" ? getSystemTheme() : preference;
const applyTheme = (theme: Theme) => {
	document.documentElement.dataset.theme = theme;
};

export const useTheme = create<ThemeStore>()(
	persist(
		(set, get) => ({
			preference: "system",
			theme: getSystemTheme(),
			setPreference: (preference: ThemePreference) => {
				const theme = selectTheme(preference);
				set({ preference, theme });
				applyTheme(theme);
			},
			syncSystemTheme: () => {
				if (get().preference !== "system") return;
				const theme = getSystemTheme();
				set({ theme });
				applyTheme(theme);
			},
		}),
		{
			name: "theme-storage",
			partialize: (state) => ({ preference: state.preference }),
			onRehydrateStorage: () => (state) => {
				if (!state) return;
				const theme = selectTheme(state.preference);
				state.theme = theme;
				applyTheme(theme);
			},
		},
	),
);

export function useSyncSystemTheme() {
	const syncSystemTheme = useTheme((state) => state.syncSystemTheme);

	useEffect(() => {
		const handleChange = () => syncSystemTheme();
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [syncSystemTheme]);
}
