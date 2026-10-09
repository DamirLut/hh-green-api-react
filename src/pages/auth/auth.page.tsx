import { BackgroundPattern } from "#/components/BackgroundPattern";
import { Button } from "#/components/Button";
import { Card } from "#/components/Card/card";
import { Input } from "#/components/Input";
import Styles from "./auth.module.css";

export function AuthPage() {
	return (
		<>
			<BackgroundPattern />
			<div className={Styles.root}>
				<Card className={Styles.card} as="form">
					<h1 className={Styles.card__title}>GREEN-API</h1>
					<h3 className={Styles.card__subtitle}>Войти в систему</h3>

					<div className={Styles.fields}>
						<Input label="idInstance" placeholder="0000000000" />
						<Input label="apiTokenInstance" placeholder="0000000000" />
						<Input label="apiUrl" placeholder="https://api.green-api.com" />
						<Input label="mediaUrl" placeholder="https://api.green-api.com" />
					</div>

					<div className={Styles.actions}>
						<Button size="medium" stretched>
							Войти
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
