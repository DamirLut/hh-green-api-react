import { useLayoutEffect, useRef, useState } from "react";
import { IconArrowUp } from "#/assets/icons";
import { IconButton } from "#/components/IconButton";
import { useSendMessageMutation } from "#/hooks/chats.query";
import { useRequiredChatId } from "#/hooks/use-current-chat-id";
import { cn } from "#/lib/classname";
import Styles from "./chatinput.module.css";

const MAX_MESSAGE_LENGTH = 4000;

export function ChatInput() {
	const chatId = useRequiredChatId();
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const sendMessage = useSendMessageMutation(chatId);
	const hasText = value.trim().length > 0;

	useLayoutEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [value]);

	const submit = () => {
		const message = value.trim();
		if (!message || sendMessage.isPending) return;
		sendMessage.mutate(message, { onSuccess: () => setValue("") });
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (
			event.key !== "Enter" ||
			event.shiftKey ||
			event.nativeEvent.isComposing
		) {
			return;
		}
		event.preventDefault();
		submit();
	};

	return (
		<div className={cn(Styles.inputWrapper)}>
			<div className={Styles.control}>
				<textarea
					ref={textareaRef}
					className={Styles.textarea}
					rows={1}
					maxLength={MAX_MESSAGE_LENGTH}
					placeholder="Type a message..."
					aria-label="Сообщение"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={handleKeyDown}
				/>
				{hasText && (
					<IconButton
						size="small"
						variant="primary"
						type="button"
						className={Styles.send}
						aria-label="Отправить"
						disabled={sendMessage.isPending}
						onClick={submit}
					>
						<IconArrowUp />
					</IconButton>
				)}
			</div>
		</div>
	);
}
