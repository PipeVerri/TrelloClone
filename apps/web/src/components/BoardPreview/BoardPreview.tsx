import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getApiLink } from "@/utils/apiHandler";
import { generateGradient } from "@/utils/gradients";
import type { Setter } from "@/utils/types";

export interface BoardData {
    id: string,
    title: string
}

type BoardPreviewType = BoardData & {
	state: BoardData[];
	setter: Setter<BoardData[]>;
	index: number;
}

export function BoardPreview({ id, title, state, setter, index }: BoardPreviewType) {
	const deleteBoard = async () => {
		const conf = confirm("¿Queres borrar este board?");
		if (conf) {
			const url = `${getApiLink()}/boards/deleteBoard`;
			setter((oldState) => {
				return oldState.toSpliced(index, 1);
			});
			await fetch(url, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: id,
				}),
			});
		}
	};

	return (
		<div
			className="
        bg-white rounded-2xl shadow-md
        p-4 mb-4
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-200 w-preview-w h-preview-h flex flex-col"
		>
			<div
				className="w-full h-full flex-shrink mb-4 rounded-xl"
				style={{ background: generateGradient({ seed: id, mode: "triadic" }) }}
			/>
			<div className="flex flex-1 items-center justify-between bg-white rounded-lg p-3">
				<p className="text-lg font-semibold text-gray-800 truncate pr-4">{title}</p>

				<button
					className="
          flex items-center justify-center
          w-10 h-10
          rounded-full
          bg-red-500 hover:bg-red-600 active:bg-red-700
          transition-colors duration-200
        "
					aria-label="Delete board" onClick={deleteBoard}
				>
					<FontAwesomeIcon icon={faTrash} className="text-white" />
				</button>
			</div>
		</div>
	);
}
