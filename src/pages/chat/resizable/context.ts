import { createContext, useContext } from "react";

export interface ResizableContextValue {
	width: number;
	collapsed: boolean;
}

export const ResizableContext = createContext<ResizableContextValue | null>(
	null,
);

export function useResizable(): ResizableContextValue {
	const value = useContext(ResizableContext);
	if (!value) throw new Error("useResizable: ResizableContext has no value");
	return value;
}
