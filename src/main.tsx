import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./styles/vars.css";
import "./styles/global.css";
import App from "./App.tsx";
import { queryClient } from "./lib/green-api/query";

const root = document.getElementById("root") as HTMLElement;

if (!root) throw new Error("Where is the root element?");

createRoot(root).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>,
);
