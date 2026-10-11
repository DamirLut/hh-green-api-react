import { useLayoutEffect, useMemo, useRef } from "react";
import { useChatHistoryQuery } from "#/hooks/chats.query";
import { useRequiredChatId } from "#/hooks/use-current-chat-id";
import { cn } from "#/lib/classname";
import { EmptyHistory } from "../emptyhistory";
import { Message } from "../message/message";
import Styles from "./messatelist.module.css";

/// distance from the bottom within which the view still counts as
/// pinned to the latest message
const STICK_THRESHOLD_PX = 60;

interface SkeletonMessage {
	width: string;
	outgoing?: boolean;
	tall?: boolean;
}

const SKELETON_MESSAGES: SkeletonMessage[] = [
	{ width: "56%" },
	{ width: "34%", outgoing: true },
	{ width: "68%", tall: true },
	{ width: "45%", outgoing: true },
	{ width: "30%" },
	{ width: "52%", outgoing: true },
];

export function MessageList() {
	const chatId = useRequiredChatId();
	const {
		data: history,
		isPending,
	} = useChatHistoryQuery(chatId);
	const listRef = useRef<HTMLDivElement>(null);
	const stickRef = useRef(true);

	// history arrives newest-first, the feed renders chronologically
	const messages = useMemo(() => history?.toReversed(), [history]);

	useLayoutEffect(() => {
		const el = listRef.current;
		if (!el || !stickRef.current) return;
		el.scrollTop = el.scrollHeight;
	}, [messages]);

	const handleScroll = () => {
		const el = listRef.current;
		if (!el) return;
		stickRef.current =
			el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD_PX;
	};

	if (isPending) {
		return (
			<div className={Styles.list} aria-hidden>
				<div className={Styles.inner}>
					{SKELETON_MESSAGES.map((skeleton, index) => (
						<div
							key={index}
							className={cn(
								Styles.skeleton,
								skeleton.outgoing && Styles.skeletonOutgoing,
								skeleton.tall && Styles.skeletonTall,
							)}
							style={{ width: skeleton.width }}
						/>
					))}
				</div>
			</div>
		);
	}

	if (!messages) return null;
	if (messages.length === 0) return <EmptyHistory />;

	return (
		<div ref={listRef} className={Styles.list} onScroll={handleScroll}>
			<div className={Styles.inner}>
				{messages.map((message) => (
					<Message key={message.idMessage} message={message} />
				))}
			</div>
		</div>
	);
}
