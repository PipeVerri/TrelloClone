import { getApiLink } from "@/utils/apiHandler";
import type { Update } from "@/utils/types";

export interface CardInfo {
	title: string;
	description: string;
}

export interface OriginalCardPlace {
	containerId: number;
	index: number;
}

interface BaseUserActions {
	dragging: number | null;
	mouseOffset: { x: number; y: number } | null;
	mouseHoveringTrash: boolean;
}
type UserActions = BaseUserActions &
	(
		| { mouseHoveringContainer: number; newIndex: number; originalCardPlace: OriginalCardPlace }
		| { mouseHoveringContainer: null; newIndex: null; originalCardPlace: null }
	);

interface Container {
	title: string;
	cards: number[];
}

export interface BoardState {
	cards: CardInfo[];
	containers: Container[];
	containersOrder: number[];
	userActions: UserActions;
	boardId: string;
}

export type BoardAction =
	| { type: "addCard"; containerId: number; cardInfo: CardInfo }
	| ({ type: "updateCard"; cardId: number } & Update<CardInfo>)
	| ({ type: "updateUserActions" } & Update<UserActions>)
	| { type: "updateContainerCards"; containerId: number; newCards: number[] }
	| {
			type: "setBoard";
			data: { cards: CardInfo[]; containers: Container[]; containersOrder: number[] };
	  }
	| { type: "updateContainerName"; containerId: number; newTitle: string }
	| { type: "createContainer" }
	| { type: "deleteContainer"; containerId: number };

/**
 * Reducer in charge of mutating the board state.
 * @param state - Current state provided by React useReducer
 * @param action - Requested change to apply to the state
 * @returns The new board state
 *
 * @remarks
 * Supported actions and their arguments:
 * - "addCard": Add a new card
 *      - containerId: Destination container index
 *      - cardInfo: Default card data
 * - "updateCard": Edit a card field
 *      - cardId: Card index
 *      - param: Field to update
 *      - value: New value for the field
 * - "updateUserActions": Same shape as updateCard but applies to userActions (no cardId)
 * - "updateContainerCards": Replace the cards array for a given container (newCards)
 * - "setBoard": Replace cards, containers and containersOrder from persisted data
 * - "updateContainerName": Rename a container
 * - "createContainer": Create a new empty container and append it to containersOrder
 * - "deleteContainer": Remove a container and update containersOrder accordingly
 */
export function boardReducer(state: BoardState, action: BoardAction) {
	switch (action.type) {
		case "addCard": {
			const newCardId = state.cards.length;
			const newState = {
				...state,
				cards: [...state.cards, action.cardInfo],
				containers: state.containers.map((c, i) => (i === action.containerId ? { ...c, cards: [...c.cards, newCardId] } : c)),
			};
			saveBoardState(newState);
			return newState;
		}
		case "updateCard": {
			const newState = {
				...state,
				cards: state.cards.map((c, i) => (i === action.cardId ? { ...state.cards[i], [action.param]: action.value } : c)),
			};
			saveBoardState(newState);
			return newState;
		}
		case "updateContainerCards": {
			const newState = {
				...state,
				containers: state.containers.map((c, i) => (i === action.containerId ? { ...c, cards: action.newCards } : c)),
			};
			saveBoardState(newState);
			return newState;
		}
		case "updateUserActions": {
			return {
				...state,
				userActions: {
					...state.userActions,
					[action.param]: action.value,
				},
			};
		}
		case "setBoard": {
			// Ensure backward compatibility: add description to cards that don't have it
			const cardsWithDescription = action.data.cards.map((card: CardInfo) => ({
				...card,
				description: card.description || "",
			}));
			return {
				...state,
				cards: cardsWithDescription,
				containers: action.data.containers,
				containersOrder: action.data.containersOrder,
			};
		}
		case "updateContainerName": {
			const newState = {
				...state,
				containers: state.containers.map((c, i) => (i === action.containerId ? { ...c, title: action.newTitle } : c)),
			};
			saveBoardState(newState);
			return newState;
		}
		case "createContainer": {
			const newState = {
				...state,
				containers: [...state.containers, { title: "New container", cards: [] }],
				containersOrder: [...state.containersOrder, state.containersOrder.length],
			};
			saveBoardState(newState);
			return newState;
		}
		case "deleteContainer": {
			// Remove container and its card references; card data array is kept (server may prune later)
			const newContainers = state.containers.toSpliced(action.containerId, 1);
			// Remove from order and remap indices since container ids are array indices
			const newOrder = state.containersOrder
				.filter((cid) => cid !== action.containerId)
				.map((cid) => (cid > action.containerId ? cid - 1 : cid));
			const newState = {
				...state,
				containers: newContainers,
				containersOrder: newOrder,
			};
			saveBoardState(newState);
			return newState;
		}
	}
}

async function saveBoardState(newState: BoardState) {
    // Do nothing when doing unit tests
    if (typeof fetch === "undefined") return;

    await fetch(`${getApiLink()}/boards/updateBoard`, {
		method: "PUT",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			id: newState.boardId,
			data: {
				cards: newState.cards,
				containers: newState.containers,
				containersOrder: newState.containersOrder,
			},
		}),
	});
}
