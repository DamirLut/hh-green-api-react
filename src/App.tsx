import { ChatPage } from "./pages/chat/chat.page";
import { useSyncSystemTheme } from "./store/theme.store";

function App() {
	useSyncSystemTheme();

	return <ChatPage />;
}

export default App;
