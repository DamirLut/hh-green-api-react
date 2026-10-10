import { useSyncExternalStore } from "react";

const query = matchMedia("(width < 926px)");

function subscribe(callback: () => void) {
	query.addEventListener("change", callback);
	return () => query.removeEventListener("change", callback);
}

export function useIsMobile() {
	return useSyncExternalStore(
		subscribe,
		() => query.matches,
		() => false,
	);
}
