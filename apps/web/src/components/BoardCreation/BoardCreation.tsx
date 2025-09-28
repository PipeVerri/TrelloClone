import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Setter} from "@/utils/types";
import {useState} from "react";
import {getApiLink} from "@/utils/apiHandler";
import {BoardData} from "@/components/BoardPreview/BoardPreview";

interface Props {
    /** Setter for the array of boards displayed on the listing page */
    setBoards: Setter<BoardData[]>
}

/**
 * Small form to create a new board by title. Posts to the API and updates local state on success.
 */
export default function BoardCreation({setBoards}: Props) {
    const [newBoardTitle, setNewBoardTitle] = useState("")

    const createBoard = async () => {
        const response = await fetch(`${getApiLink()}/boards/createBoard`, {
            method: "POST",
            headers: {"Content-type": "application/json" },
            body: JSON.stringify({
                title: newBoardTitle,
            }),
        })

        const json = await response.json()
        setBoards(oldVal => {
            const newBoards = [...oldVal]
            newBoards.push({
                id: json.id,
                title: newBoardTitle
            })
            return newBoards
        })

        setNewBoardTitle("")
    }

    return (
        <div className="bg-green-400 rounded-2xl items-center justify-center flex w-preview-w h-preview-h p-4">
            <div className="box-border flex items-center justify-center p-4 w-full bg-gray-200 rounded-xl">
                <input
                    type="text"
                    className="flex-1 min-w-0 bg-white rounded-xl text-center text-lg font-semibold h-10 px-4 border-w-0"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            createBoard();
                        }
                    }}
                />
                <button className="ml-3 flex-none h-10 w-10 flex items-center justify-center bg-blue-500 rounded-xl" onClick={createBoard}>
                    <FontAwesomeIcon icon={faCheck} size="lg" color="white" />
                </button>
            </div>
        </div>
    )
}