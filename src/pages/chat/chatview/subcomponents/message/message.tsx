import { useState } from "react";
import { cn } from "#/lib/classname";
import { formatMessage, type GreenApiChatItem } from "#/lib/green-api";
import { formatTime } from "#/lib/utils";
import Styles from "./message.module.css";

interface MessageProps {
	message: GreenApiChatItem;
}

export function Message({ message }: MessageProps) {
	const [revealed, setRevealed] = useState(false);
	const isOutgoing = message.type === "outgoing";
	const isDeleted = message.isDeleted;
	const canReveal = isDeleted && message.textMessage?.length > 0;
	const revealing = canReveal && revealed;
	const text = revealing ? (message.textMessage ?? "") : formatMessage(message);
	const isPlaceholder =
		!revealing && (isDeleted || message.typeMessage !== "textMessage");
	const rawBody = JSON.stringify(message, null, 1);

	const content = (
		<p className={cn(Styles.text, isPlaceholder && Styles.placeholder)}>
			{text}
		</p>
	);

	const time = (
		<time
			className={Styles.time}
			dateTime={new Date(message.timestamp * 1000).toISOString()}
		>
			{revealing && <span className={Styles.deletedMark}>удалено</span>}
			{formatTime(message.timestamp)}
		</time>
	);

	if (canReveal) {
		return (
			<button
				type="button"
				className={cn(
					Styles.message,
					Styles.revealable,
					isOutgoing && Styles.outgoing,
				)}
				title={rawBody}
				aria-expanded={revealed}
				onClick={() => setRevealed((value) => !value)}
			>
				{content}
				{time}
			</button>
		);
	}

	return (
		<div
			className={cn(Styles.message, isOutgoing && Styles.outgoing)}
			title={rawBody}
		>
			{content}
			{time}
		</div>
	);
}
