import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { Input } from "#/components/Input";
import { Spinner } from "#/components/Spinner";
import { useCheckAccountMutation } from "#/hooks/chats.query";
import { setNavDirection } from "#/lib/utils";
import { useModal } from "#/store/modal.store";
import Styles from "./new-chat-modal.module.css";

export function NewChatModal() {
	const navigate = useNavigate();
	const closeModal = useModal((state) => state.closeModal);
	const checkAccount = useCheckAccountMutation();
	const [digits, setDigits] = useState("");
	const [error, setError] = useState<string | null>(null);

	const search = async () => {
		setError(null);
		const result = await checkAccount.mutateAsync(digits).catch(console.warn);
		if (!result) {
			setError("Контакт не найден");
			return;
		}
		setNavDirection("forward");
		navigate(`/${result.chatId}`);
		closeModal();
	};

	return (
		<Dialog open onClose={closeModal} title="Найти по номеру телефона">
			<form
				className={Styles.form}
				onSubmit={(event) => {
					event.preventDefault();
					search();
				}}
			>
				<Input
					placeholder="Номер телефона"
					aria-label="Номер телефона"
					inputMode="tel"
					autoComplete="off"
					value={digits}
					disabled={checkAccount.isPending}
					onChange={(event) => setDigits(event.target.value.replace(/\D/g, ""))}
				/>
				{error && (
					<p role="alert" className={Styles.error}>
						{error}
					</p>
				)}
				<Button
					type="submit"
					stretched
					disabled={digits.length === 0 || checkAccount.isPending}
				>
					{checkAccount.isPending ? <Spinner /> : "Найти контакт"}
				</Button>
			</form>
		</Dialog>
	);
}
