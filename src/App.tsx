import { AuthPage } from "./pages/auth/auth.page";
import { useSyncSystemTheme } from "./store/theme.store";

function App() {
	useSyncSystemTheme();

	return <AuthPage />;
}

export default App;
