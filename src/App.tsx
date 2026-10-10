import { useState } from "react";
import { ApiClientContext, createClientFromEnv } from "#/lib/green-api";
import { AuthPage } from "./pages/auth/auth.page";
import { ChatPage } from "./pages/chat/chat.page";
import { useSyncSystemTheme } from "./store/theme.store";

function App() {
	useSyncSystemTheme();

	const [client] = useState(createClientFromEnv);

	if (!client) return <AuthPage />;

	return (
		<ApiClientContext value={client}>
			<ChatPage />
		</ApiClientContext>
	);
}

export default App;
