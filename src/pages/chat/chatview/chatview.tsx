import { Input } from "#/components/Input";
import { cn } from "#/lib/classname";
import Styles from "./chatview.module.css";
import { EmptyHistory } from "./subcomponents/emptyhistory";
import { Topbar } from "./subcomponents/topbar";

export function ChatView() {
	return (
		<div className={cn(Styles.root)}>
			<Topbar />
			<div className={Styles.messages}>
				<EmptyHistory />
			</div>
			<div className={cn(Styles.inputWrapper)}>
				<Input placeholder="Type a message..." />
			</div>
		</div>
	);
}
