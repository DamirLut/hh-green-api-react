import type { ReactNode } from "react";
import { create } from "zustand";

interface ModalStore {
	node: ReactNode | null;
	openModal: (node: ReactNode) => void;
	closeModal: () => void;
}

export const useModal = create<ModalStore>()((set) => ({
	node: null,
	openModal: (node) => set({ node }),
	closeModal: () => set({ node: null }),
}));
