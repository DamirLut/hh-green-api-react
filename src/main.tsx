import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/vars.css";
import "./styles/global.css";
import App from "./App.tsx";

const root = document.getElementById("root") as HTMLElement;

if (!root) throw new Error("Where is the root element?");

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
