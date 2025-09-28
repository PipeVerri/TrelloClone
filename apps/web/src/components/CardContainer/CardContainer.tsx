import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
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
 * Un contenedor de {@link Card | cards}
 * @param id - El id del contenedor
 * @param state - El BoardState
 * @param dispatch - El dispatch para BoardState
 */
export default function CardContainer({ id, state, dispatch }: CardContainerProps) {
	// Refs por cardId
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

	// Calcula la posición de inserción contra la lista SIN la tarjeta arrastrada
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const draggingId = state.userActions.dragging;
			if (!mouseHovering || draggingId == null) return;

			const cards = state.containers[id].cards;
			const displayCards = cards.filter((c) => c !== draggingId); // base de cálculo y render
			let newIndex = 0;

			for (let i = 0; i < displayCards.length; i++) {
				const cardId = displayCards[i];
				const el = cardsRef.current[cardId];
				if (!el) continue;

				const rect = el.getBoundingClientRect();
				const midY = rect.top + rect.height / 2;

				// Si el mouse está por debajo de la mitad de esta carta, insertar después
				if (e.clientY > midY) {
					newIndex = i + 1;
				} else {
					// Por encima de la mitad ⇒ insertar antes de esta carta
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

	// Lista "visible" que usamos tanto para calcular como para renderizar
	const displayCards = draggingId == null ? cards : cards.filter((c) => c !== draggingId);

	const shouldShowGhost = draggingId != null && state.userActions.mouseHoveringContainer === id;

	return (
		// biome-ignore lint: no es interactivo, solo quiero ver si hay un hover o no
		<div
			className="flex flex-col bg-amber-200 min-w-[300px] gap-2 p-4 rounded-lg drop-shadow-lg"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			data-testid={`container${id}`}
		>
            <input
                type={"text"}
                value={state.containers[id].title}
                onChange={(e) => dispatch({type: "updateContainerName", containerId: id, newTitle: e.target.value})}
                className={"bg-white/70 p-1 rounded-md px-2"}
            />
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
							// index aquí es el índice "visible" (sin la arrastrada)
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
