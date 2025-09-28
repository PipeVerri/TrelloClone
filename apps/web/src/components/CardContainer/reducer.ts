import type { Update } from "@/utils/types";
import {getApiLink} from "@/utils/apiHandler";

export interface CardInfo {
	title: string;
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
	| ({ type: "updateContainerCards"; containerId: number; newCards: number[] })
    | ({ type: "setBoard", data: {cards: CardInfo[], containers: Container[], containersOrder: number[] } })
    | ({ type: "updateContainerName", containerId: number, newTitle: string })
    | ({ type: "createContainer" })

/**
 * Reducer dedicado a cambiar el boardState
 * @param state - Pasado por react al usar useReducer
 * @param action - Lo que se quiere cambiar en el estado
 * @returns El nuevo boardState
 *
 * @remarks
 * Las acciones y sus argumentos son:
 * - "addCard": Agrega una nueva tarjeta, sus argumentos son:
 *      - "containerId": El ID del container a agregarla
 *      - "cardInfo": La tarjeta por defecto a agregar
 * - "updateCard": Edita una tarjeta, sus argumentos son:
 *      - "cardId": El ID de la carta a editar
 *      - "param": El parametro a editar
 *      - "value": El nuevo valor a setear
 * - "updateUserActions": Sus argumentos son iguales que updateCard pero sin el cardId
 * - "updateContainerCards": Su unico argumento es "newContainerCards", el objeto entero reemplazado
 */
export function boardReducer(state: BoardState, action: BoardAction) {
	switch (action.type) {
		case "addCard": {
			const newCardId = state.cards.length;
			const newState = {
				...state,
				cards: [...state.cards, action.cardInfo],
				containers: state.containers.map((c, i) =>
					i === action.containerId ? { ...c, cards: [...c.cards, newCardId] } : c,
				),
			};
            saveBoardState(newState);
            return newState;
		}
		case "updateCard": {
			const newState = {
				...state,
				cards: state.cards.map((c, i) =>
					i === action.cardId ? { ...state.cards[i], [action.param]: action.value } : c,
				),
			};
            saveBoardState(newState);
            return newState;
		}
		case "updateContainerCards": {
			const newState = {
				...state,
				containers: state.containers.map((c, i) =>
					i === action.containerId ? { ...c, cards: action.newCards } : c,
				),
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
            return {
                ...state,
                ...action.data,
            }
        }
        case "updateContainerName": {
            const newState = {
                ...state,
                containers: state.containers.map((c, i) =>
                    (i === action.containerId) ? {...c, title: action.newTitle } : c,
                )
            }
            saveBoardState(newState)
            return newState
        }
        case "createContainer": {
            const newState = {
                ...state,
                containers: [...state.containers, {title: "New container", cards: []}],
                containersOrder: [...state.containersOrder, state.containersOrder.length],
            }
            saveBoardState(newState)
            return newState
        }
    }
}

async function saveBoardState(newState: BoardState) {
    await fetch(`${getApiLink()}/boards/updateBoard`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            id: newState.boardId,
            data: {
                cards: newState.cards,
                containers: newState.containers,
                containersOrder: newState.containersOrder,
            }
        }),
    })
}