import { useState } from "react";
import { Separator } from "../separator";
import { DEFAULT_WIDTH } from "../separator/utils";
import Styles from "./chatlist.module.css";
import { ChatHeader } from "./subcomponents/header";

export function ChatList() {
	const [width, setWidth] = useState(DEFAULT_WIDTH);

	return (
		<div className={Styles.root} style={{ width }}>
			<ChatHeader />
			<Separator value={width} onResize={setWidth} />
		</div>
	);
}
