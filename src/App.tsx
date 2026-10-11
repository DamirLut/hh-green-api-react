import { useState } from "react";
import { RouterProvider } from "react-router/dom";
import {
	ApiClientContext,
	createClientFromEnv,
	type GreenApiClient,
} from "#/lib/green-api";
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

	const [client] = useState(createClientFromEnv);

	if (!client) return <AuthPage />;

	return <AuthenticatedApp client={client} />;
}

export default App;
