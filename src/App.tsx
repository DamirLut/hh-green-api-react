import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ApiClientContext, createClientFromEnv } from "#/lib/green-api";
import { AuthPage } from "./pages/auth/auth.page";
import { ChatPage } from "./pages/chat/chat.page";
import { ChatView } from "./pages/chat/chatview/chatview";
import { useSyncSystemTheme } from "./store/theme.store";

function App() {
	useSyncSystemTheme();

	const [client] = useState(createClientFromEnv);

	if (!client) return <AuthPage />;

	return (
		<ApiClientContext value={client}>
			<Routes>
				<Route path="/" element={<ChatPage />}>
					<Route path=":chatId" element={<ChatView />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</ApiClientContext>
	);
}

export default App;
