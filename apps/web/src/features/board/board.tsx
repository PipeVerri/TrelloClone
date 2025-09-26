"use client";

import { useReducer } from "react";
import Card from "@/components/Card/Card";
import CardContainer from "@/components/CardContainer/CardContainer";
import { type BoardState, boardReducer } from "@/components/CardContainer/reducer";
import MouseFollower from "@/components/MouseFollower/MouseFollower";

export default function Board() {
	const [state, dispatch] = useReducer(boardReducer, {
		cards: [{ title: "test1" }, { title: "test2" }, { title: "test3" }],
		containers: [
			{ title: "container0", cards: [0, 1] },
			{ title: "container1", cards: [2] },
		],
		containersOrder: [0, 1],
		userActions: {
			dragging: null,
			mouseHoveringContainer: null,
			newIndex: null,
			originalCardPlace: null,
		},
	});

	const handleRelease = (currentState: BoardState) => {
		const { mouseHoveringContainer, newIndex, originalCardPlace, dragging } =
			currentState.userActions;
		if (
			mouseHoveringContainer != null &&
			dragging != null &&
			mouseHoveringContainer != originalCardPlace?.containerId
		) {
			// Borrarla de su container original
			const originalContainerCards =
				currentState.containers[originalCardPlace.containerId].cards;
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
	};

	return (
		<div className="bg-gradient-to-br from-blue-800 to-teal-400 min-h-screen">
			<div className="flex flex-row gap-6 p-4">
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
				<MouseFollower onRelease={() => handleRelease(state)}>
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
