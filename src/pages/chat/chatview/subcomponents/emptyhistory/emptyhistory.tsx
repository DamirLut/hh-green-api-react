import WelcomSticker from "#/assets/stickers/welcome.webp?url";
import { Card } from "#/components/Card/card";
import Styles from "./emptyhistory.module.css";

export function EmptyHistory() {
	return (
		<div className={Styles.root}>
			<Card className={Styles.card}>
				<span>Еще нет сообщений</span>
				<p>Напишите первым</p>
				<img src={WelcomSticker} loading="lazy" alt="sticker" />
			</Card>
		</div>
	);
}
