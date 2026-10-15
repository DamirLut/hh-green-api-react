import { IconPlus } from "#/assets/icons";
import { IconButton } from "#/components/IconButton";
import { useModal } from "#/store/modal.store";
import { NewChatModal } from "../new-chat-modal";
import Styles from "./header.module.css";

export function ChatHeader() {
	const openModal = useModal((state) => state.openModal);

	return (
		<div className={Styles.root}>
			<span className={Styles.title}>Чаты</span>

			<IconButton
				size="small"
				variant="primary"
				aria-label="Новый чат"
				onClick={() => openModal(<NewChatModal />)}
			>
				<IconPlus />
			</IconButton>
		</div>
	);
}
