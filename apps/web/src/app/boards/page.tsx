"use client";

import { useEffect, useState } from "react";
import {BoardData, BoardPreview} from "@/components/BoardPreview/BoardPreview";
import BoardCreation from "@/components/BoardCreation/BoardCreation";
import {getApiLink} from "@/utils/apiHandler";

export default function Page() {
	const [boards, setBoards] = useState<BoardData[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const data = await fetch(`${getApiLink()}/boards/getAllBoards`, {
				headers: { "Content-type": "application/json" },
			});
			const json = await data.json();
            console.log(json)
			setBoards(json);
		}
		loadData();
	}, []);

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
			<BoardCreation setBoards={setBoards}/>
		</div>
	);
}
