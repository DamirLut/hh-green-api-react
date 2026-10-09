type Gradient = "red" | "orange" | "green" | "blue" | "purple";

const gradients: Gradient[] = ["red", "orange", "green", "blue", "purple"];

export function getGradient(alt: string): Gradient {
	let hash = 2166136261;
	for (let i = 0; i < alt.length; i++) {
		hash ^= alt.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return gradients[(hash >>> 0) % gradients.length];
}

export function getInitials(alt: string): string {
	const words = alt.trim().split(/\s+/).filter(Boolean);
	const initials = words
		.slice(0, 2)
		.map((word) => Array.from(word)[0] ?? "")
		.join("");
	return initials.toUpperCase();
}
