import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "#/components/RootLayout";
import { ChatPage } from "./pages/chat/chat.page";
import { ChatView } from "./pages/chat/chatview/chatview";

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				path: "/",
				element: <ChatPage />,
				children: [{ path: ":chatId", element: <ChatView /> }],
			},
			{ path: "*", element: <Navigate to="/" replace /> },
		],
	},
]);
