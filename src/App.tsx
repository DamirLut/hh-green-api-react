import { RouterProvider } from "react-router/dom";
import {
	ApiClientContext,
	type GreenApiClient,
} from "#/lib/green-api";
import { useAuth } from "#/store/auth.store";
import { NotificationsProvider } from "./hooks/use-notifications";
import { AuthPage } from "./pages/auth/auth.page";
import { router } from "./router";
import { useSyncSystemTheme } from "./store/theme.store";

function AuthenticatedApp({ client }: { client: GreenApiClient }) {
	return (
		<ApiClientContext value={client}>
			<NotificationsProvider />
			<RouterProvider router={router} />
		</ApiClientContext>
	);
}

function App() {
	useSyncSystemTheme();

	const client = useAuth((state) => state.client);

	if (!client) return <AuthPage />;

	return <AuthenticatedApp client={client} />;
}

export default App;
