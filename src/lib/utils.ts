const timeFormat = new Intl.DateTimeFormat("ru-RU", {
	hour: "2-digit",
	minute: "2-digit",
});

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
});

export function formatTime(timestampSeconds: number): string {
	return timeFormat.format(new Date(timestampSeconds * 1000));
}

export function formatLastSeen(timestampSeconds: number): string {
	const date = new Date(timestampSeconds * 1000);
	const dayStart = (d: Date) =>
		new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	const days = Math.round((dayStart(new Date()) - dayStart(date)) / 86_400_000);

	if (days === 0) return `был(а) в ${timeFormat.format(date)}`;
	if (days === 1) return `был(а) вчера в ${timeFormat.format(date)}`;
	return `был(а) ${dateFormat.format(date)}`;
}

export function setNavDirection(direction: "forward" | "back") {
	document.documentElement.dataset.navDirection = direction;
}

export function sleepWithSignal(ms: number, signal: AbortSignal) {
	return new Promise<void>((resolve, reject) => {
		const timer = setTimeout(resolve, ms);
		signal.addEventListener(
			"abort",
			() => {
				clearTimeout(timer);
				reject(signal.reason);
			},
			{ once: true },
		);
	});
}
