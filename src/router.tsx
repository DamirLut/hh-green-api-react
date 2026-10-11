import { createBrowserRouter, Navigate } from "react-router";
import { ChatPage } from "./pages/chat/chat.page";
import { ChatView } from "./pages/chat/chatview/chatview";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <ChatPage />,
		children: [{ path: ":chatId", element: <ChatView /> }],
	},
	{ path: "*", element: <Navigate to="/" replace /> },
]);
