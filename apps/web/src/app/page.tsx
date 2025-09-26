"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { BoardPreview, type BoardPreviewType } from "@/components/BoardPreview/BoardPreview";
import BoardCreation from "@/components/BoardCreation/BoardCreation";
import {getApiLink} from "@/utils/apiHandler";

export default function Page() {
	const [boards, setBoards] = useState<BoardPreviewType[]>([]);
    const [newBoardTitle, setNewBoardTitle] = useState("")

	useEffect(() => {
		const loadData = async () => {
			const data = await fetch(`${getApiLink()}/boards/getAllBoards`, {
				headers: { "Content-type": "application/json" },
			});
			const json = await data.json();
			setBoards(json);
		}
		loadData();
	}, []);

    const createBoard = async () => {
        const response = await fetch(`${getApiLink()}/boards`, {
            method: "POST",
            headers: {"Content-type": "application/json" },
            body: JSON.stringify({
                title: newBoardTitle,
            }),
        })
    }

	return (
		<div className="flex flex-row gap-8 p-8 flex-wrap">
			{boards.map((board, idx) => (
				<BoardPreview
					id={board.id}
					key={board.id}
					title={board.title}
					state={boards}
					setter={setBoards}
					index={idx}
				/>
			))}
			<BoardCreation createFunc={createBoard} name={newBoardTitle} setter={setNewBoardTitle} />
		</div>
	);
}
