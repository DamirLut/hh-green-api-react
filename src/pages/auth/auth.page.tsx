import { useState } from "react";
import { BackgroundPattern } from "#/components/BackgroundPattern";
import { Button } from "#/components/Button";
import { Card } from "#/components/Card/card";
import { Input } from "#/components/Input";
import { Spinner } from "#/components/Spinner";
import { GreenApiClient, GreenApiError, instanceApiUrl } from "#/lib/green-api";
import { useAuth } from "#/store/auth.store";
import Styles from "./auth.module.css";

export function AuthPage() {
	const signIn = useAuth((state) => state.signIn);
	const [idInstance, setIdInstance] = useState("");
	const [apiTokenInstance, setApiTokenInstance] = useState("");
	const [apiUrl, setApiUrl] = useState("");
	const [mediaUrl, setMediaUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const changeIdInstance = (value: string) => {
		const id = value.replace(/\D/g, "");
		setIdInstance(id);
		if (id.length < 4) return;
		const previousUrl = instanceApiUrl(idInstance);
		const nextUrl = instanceApiUrl(id);
		setApiUrl((url) => (url === "" || url === previousUrl ? nextUrl : url));
		setMediaUrl((url) => (url === "" || url === previousUrl ? nextUrl : url));
	};

	const submit = async () => {
		setPending(true);
		setError(null);
		const client = new GreenApiClient({
			idInstance,
			apiTokenInstance,
			apiUrl,
			mediaUrl,
		});
		try {
			await client.getAccountSettings();
			signIn(client);
		} catch (cause) {
			setError(
				cause instanceof GreenApiError
					? `Не удалось войти (${cause.status})`
					: "Не удалось войти: сервер недоступен",
			);
		} finally {
			setPending(false);
		}
	};

	return (
		<>
			<BackgroundPattern />
			<div className={Styles.root}>
				<Card
					className={Styles.card}
					as="form"
					onSubmit={(event) => {
						event.preventDefault();
						void submit();
					}}
				>
					<h1 className={Styles.card__title}>GREEN-API</h1>
					<h3 className={Styles.card__subtitle}>Войти в систему</h3>

					<div className={Styles.fields}>
						<Input
							label="idInstance"
							placeholder="0000000000"
							inputMode="numeric"
							autoComplete="off"
							value={idInstance}
							disabled={pending}
							onChange={(event) => changeIdInstance(event.target.value)}
						/>
						<Input
							label="apiTokenInstance"
							placeholder="0000000000"
							autoComplete="off"
							value={apiTokenInstance}
							disabled={pending}
							onChange={(event) => setApiTokenInstance(event.target.value)}
						/>
						<Input
							label="apiUrl"
							placeholder={instanceApiUrl("0000")}
							autoComplete="off"
							value={apiUrl}
							disabled={pending}
							onChange={(event) => setApiUrl(event.target.value)}
						/>
						<Input
							label="mediaUrl"
							placeholder={instanceApiUrl("0000")}
							autoComplete="off"
							value={mediaUrl}
							disabled={pending}
							onChange={(event) => setMediaUrl(event.target.value)}
						/>
					</div>

					{error && (
						<p role="alert" className={Styles.error}>
							{error}
						</p>
					)}

					<div className={Styles.actions}>
						<Button
							size="medium"
							stretched
							type="submit"
							disabled={
								pending ||
								!idInstance ||
								!apiTokenInstance ||
								!apiUrl ||
								!mediaUrl
							}
						>
							{pending ? <Spinner /> : "Войти"}
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
