import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type Dispatch, useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import CardGhost from "./CardGhost";
import type { BoardAction, BoardState, CardInfo } from "./reducer";

interface CardContainerProps {
    id: number;
    state: BoardState;
    dispatch: Dispatch<BoardAction>;
}

/**
 * A vertical container of draggable {@link Card | cards}.
 *
 * Handles mouse enter/leave to know when the pointer is over this container,
 * computes the insertion index while dragging (to render a ghost placeholder),
 * and exposes an input to rename the container and a button to delete it.
 *
 * @param id - The container identifier (index in state.containers)
 * @param state - The full board state
 * @param dispatch - Reducer dispatch to mutate the board state
 */
export default function CardContainer({ id, state, dispatch }: CardContainerProps) {
    // Per-card DOM refs, used to compute midpoints while dragging
    const cardsRef = useRef<Record<number, HTMLDivElement | null>>({});
    const [mouseHovering, setMouseHovering] = useState(false);
    const [ghostIndex, setGhostIndex] = useState<number | null>(null);

    const handleMouseEnter = () => {
        setMouseHovering(true);
        dispatch({ type: "updateUserActions", param: "mouseHoveringContainer", value: id });
    };

    const handleMouseLeave = () => {
        setMouseHovering(false);
        dispatch({ type: "updateUserActions", param: "mouseHoveringContainer", value: null });
        setGhostIndex(null);
    };

    // Compute the insertion position against the list WITHOUT the dragged card
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const draggingId = state.userActions.dragging;
            if (!mouseHovering || draggingId == null) return;

            const cards = state.containers[id].cards;
            const displayCards = cards.filter((c) => c !== draggingId); // Calculation/render base
            let newIndex = 0;

            for (let i = 0; i < displayCards.length; i++) {
                const cardId = displayCards[i];
                const el = cardsRef.current[cardId];
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;

                // If the mouse is below the middle of this card, insert AFTER it
                if (e.clientY > midY) {
                    newIndex = i + 1;
                } else {
                    // Above the middle ⇒ insert BEFORE this card
                    break;
                }
            }

            dispatch({ type: "updateUserActions", param: "newIndex", value: newIndex });
            setGhostIndex(newIndex);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseHovering, state.userActions.dragging, state.containers, id, dispatch]);

    function createCard() {
        const defaultCard: CardInfo = { title: "" };
        dispatch({ type: "addCard", containerId: id, cardInfo: defaultCard });
    }

    const cards = state.containers[id].cards;
    const draggingId = state.userActions.dragging;

    // "Visible" list used both to compute positions and to render
    const displayCards = draggingId == null ? cards : cards.filter((c) => c !== draggingId);

    const shouldShowGhost = draggingId != null && state.userActions.mouseHoveringContainer === id;

    return (
        // Layout: limit height and prevent the column from stretching to full container height
        <div
            className="flex flex-col bg-amber-200 min-w-[300px] h-fit self-start gap-2 p-4 rounded-lg drop-shadow-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid={`container${id}`}
        >
            <div className="flex items-center gap-2">
                <input
                    type={"text"}
                    value={state.containers[id].title}
                    onChange={(e) => dispatch({type: "updateContainerName", containerId: id, newTitle: e.target.value})}
                    className={"bg-white/70 p-1 rounded-md px-2 flex-1"}
                    placeholder={"Container title"}
                />
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700"
                    aria-label="Delete container"
                    onClick={() => {
                        const conf = confirm("Do you want to delete this container and all its cards?");
                        if (conf) dispatch({ type: "deleteContainer", containerId: id });
                    }}
                    type="button"
                >
                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                </button>
            </div>
            {displayCards.map((cardId, i) => {
                const ghostHere = shouldShowGhost && ghostIndex === i;

                return (
                    <React.Fragment key={`row-${cardId}`}>
                        {ghostHere && <CardGhost key={-1} />}
                        <Card
                            id={cardId}
                            state={state}
                            dispatch={dispatch}
                            innerRef={(el: HTMLDivElement | null) => {
                                cardsRef.current[cardId] = el;
                            }}
                            // Index here is the "visible" index (without the dragged card)
                            originalPlace={{ containerId: id, index: i }}
                            key={cardId}
                        />
                    </React.Fragment>
                );
            })}

            {shouldShowGhost && ghostIndex === displayCards.length && <CardGhost key="ghost-end" />}

            <button
                className="bg-green-500 text-center text-lg py-2 font-semibold text-white rounded-lg shadow-lg"
                onClick={createCard}
                type="button"
                aria-label="add button"
            >
                <FontAwesomeIcon icon={faSquarePlus} size="lg" />
            </button>
        </div>
    );
}