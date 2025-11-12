import type React from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
				{children}
				<button
					type="button"
					onClick={onClose}
					className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
				>
					Close
				</button>
			</div>
		</div>
	);
}