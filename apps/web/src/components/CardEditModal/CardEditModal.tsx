import React, { useEffect } from "react";
import type { Dispatch } from "react";
import type { BoardAction, BoardState } from "../CardContainer/reducer";
import Modal from "../Modal/Modal";

interface CardEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	state: BoardState;
	dispatch: Dispatch<BoardAction>;
	cardId: number;
}

export default function CardEditModal({ isOpen, onClose, state, dispatch, cardId }: CardEditModalProps) {
	const card = state.cards[cardId];
	const [localDescription, setLocalDescription] = React.useState(card?.description || "");

	useEffect(() => {
		if (isOpen) {
			setLocalDescription(card?.description || "");
		}
	}, [isOpen, card?.description]);

	const handleSave = () => {
		dispatch({
			type: "updateCard",
			cardId,
			param: "description",
			value: localDescription,
		});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Edit Card Description</h2>
			<div className="mb-4">
				<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
					Description
				</label>
				<textarea
					id="description"
					value={localDescription}
					onChange={(e) => setLocalDescription(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md resize-vertical min-h-24"
					placeholder="Enter card description..."
				/>
			</div>
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onClose}
					className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handleSave}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Save
				</button>
			</div>
		</Modal>
	);
}