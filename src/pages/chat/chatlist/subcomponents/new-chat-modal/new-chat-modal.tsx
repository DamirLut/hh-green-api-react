import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { Input } from "#/components/Input";
import { useModal } from "#/store/modal.store";
import Styles from "./new-chat-modal.module.css";

export function NewChatModal() {
	const navigate = useNavigate();
	const closeModal = useModal((state) => state.closeModal);
	const [digits, setDigits] = useState("");

	return (
		<Dialog open onClose={closeModal} title="Найти по номеру телефона">
			<form
				className={Styles.form}
				onSubmit={(event) => {
					event.preventDefault();
					document.documentElement.dataset.navDirection = "forward";
					navigate(`/${digits}@c.us`);
					closeModal();
				}}
			>
				<Input
					placeholder="Номер телефона"
					aria-label="Номер телефона"
					inputMode="tel"
					autoComplete="off"
					value={digits}
					onChange={(event) => setDigits(event.target.value.replace(/\D/g, ""))}
				/>
				<Button type="submit" stretched disabled={digits.length === 0}>
					Найти контакт
				</Button>
			</form>
		</Dialog>
	);
}
