"use client";

import {useEffect, useReducer, useState} from "react";
import Card from "@/components/Card/Card";
import CardContainer from "@/components/CardContainer/CardContainer";
import { type BoardState, boardReducer } from "@/components/CardContainer/reducer";
import MouseFollower from "@/components/MouseFollower/MouseFollower";
import {getApiLink} from "@/utils/apiHandler";
import {useParams} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function EditBoard() {
    const boardId = useParams()?.id as string
    if (!boardId) return <div>Missing board id</div>;

    const [state, dispatch] = useReducer(boardReducer, {
        cards: [],
        containers: [],
        containersOrder: [],
        userActions: {
            dragging: null,
            mouseOffset: null,
            mouseHoveringContainer: null,
            newIndex: null,
            originalCardPlace: null,
        },
        boardId: boardId
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBoard = async() => {
            const response = await fetch(`${getApiLink()}/boards/getBoard?id=${boardId}`)
            const {data} = await response.json()
            dispatch({type: "setBoard", data: data})
            setLoading(false)
        }
        loadBoard()
    }, []);

    const handleRelease = (currentState: BoardState) => {
        const { mouseHoveringContainer, newIndex, originalCardPlace, dragging } = currentState.userActions;
        if (
            mouseHoveringContainer != null &&
            dragging != null &&
            mouseHoveringContainer != originalCardPlace?.containerId
        ) {
            // Borrarla de su container original
            const originalContainerCards = currentState.containers[originalCardPlace.containerId].cards;
            const newOriginalContainerCards = originalContainerCards.toSpliced(
                originalCardPlace.index,
                1,
            );
            // Meterla donde deberia ser
            const destContainerCards = currentState.containers[mouseHoveringContainer].cards;
            const newDestContainerCards = [
                ...destContainerCards.slice(0, newIndex),
                dragging,
                ...destContainerCards.slice(newIndex),
            ];
            // Actualizar el dispatch
            dispatch({
                type: "updateContainerCards",
                containerId: originalCardPlace.containerId,
                newCards: newOriginalContainerCards,
            });
            dispatch({
                type: "updateContainerCards",
                containerId: mouseHoveringContainer,
                newCards: newDestContainerCards,
            });
        }
        dispatch({ type: "updateUserActions", param: "dragging", value: null });
        dispatch({ type: "updateUserActions", param: "originalCardPlace", value: null });
        dispatch({ type: "updateUserActions", param: "newIndex", value: null });
        dispatch({ type: "updateUserActions", param: "mouseOffset", value: null });
    };

    if (loading) return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="bg-gradient-to-br from-blue-800 to-teal-400 h-screen overflow-x-auto">
            {/* Container takes full height, scrolls horizontally */}
            <div className="flex flex-row gap-6 p-4 h-full min-w-fit">
                {state.containersOrder.map(
                    (containerId, _ /* TODO: no usar el index ya que el ordenamiento cambia */) => (
                        <CardContainer
                            id={containerId}
                            key={containerId}
                            state={state}
                            dispatch={dispatch}
                        />
                    ),
                )}
                {/* Fixed: Added flex-shrink-0 to prevent button from shrinking */}
                <button
                    className="w-card h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center"
                    onClick={() => dispatch({type: "createContainer"})}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <MouseFollower onRelease={() => handleRelease(state)} offset={state.userActions.mouseOffset ?? { x: 0, y: 0 }}>
                    {state.userActions.dragging != null && (
                        <Card
                            id={state.userActions.dragging}
                            state={state}
                            dispatch={dispatch}
                            dragging={true}
                            originalPlace={null}
                        />
                    )}
                </MouseFollower>
            </div>
        </div>
    );
}