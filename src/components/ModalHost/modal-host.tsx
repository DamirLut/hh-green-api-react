import { useModal } from "#/store/modal.store";

export function ModalHost() {
	const node = useModal((state) => state.node);
	return node;
}
