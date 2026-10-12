import { Outlet } from "react-router";
import { ModalHost } from "#/components/ModalHost";

export function RootLayout() {
	return (
		<>
			<ModalHost />
			<Outlet />
		</>
	);
}
