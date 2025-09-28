import "@testing-library/jest-dom";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import Card from "@/components/Card/Card";
import CardContainer from "@/components/CardContainer/CardContainer";
import {boardReducer, BoardState} from "@/components/CardContainer/reducer";

describe("Card", () => {
	test("correct rendering", () => {
		render(
			<Card
				id={0}
				dragging={true}
				// @ts-expect-error - no me importa pasarle el state entero
				state={{ cards: [{ title: "test" }], userActions: {mouseHoveringTrash: false}}}
			/>,
		);
		expect(screen.getByDisplayValue("test")).toBeInTheDocument();
	});
});

function TestBoard() {
	const initialState: BoardState = {
		cards: [{ title: "test1" }, { title: "test2" }, { title: "test3" }],
		containers: [
			{ title: "container0", cards: [0, 1, 2] },
			{ title: "container1", cards: [] },
		],
		containersOrder: [0, 1],
		userActions: {
			dragging: null,
			newIndex: null,
			mouseHoveringContainer: null,
			originalCardPlace: null,
            mouseHoveringTrash: false,
            mouseOffset: null
		},
        boardId: "TestBoard"
	};

	const [state, dispatch] = useReducer(boardReducer, initialState);
	return (
		<>
            <CardContainer id={0} state={state} dispatch={dispatch} />
            <CardContainer id={1} state={state} dispatch={dispatch} />
		</>
	);
}

describe("Container", () => {
	test("correct rendering", () => {
		render(<TestBoard />);
		expect(screen.getByDisplayValue("test1")).toBeInTheDocument();
		expect(screen.getByDisplayValue("test2")).toBeInTheDocument();
		expect(screen.getByDisplayValue("test3")).toBeInTheDocument();
	});

	test("card addition", async () => {
		render(<TestBoard />);
		const user = userEvent.setup();

		const btn = screen.getAllByRole("button", { name: "add button" })[0];
		await user.click(btn);

		await waitFor(() => {
			expect(screen.getByDisplayValue("")).toBeInTheDocument();
		});
	});

    test("container renaming", () => {
        render(<TestBoard />)

        const container = screen.getByTestId("container0")
        expect(within(container).getAllByRole("textbox")).toHaveLength(4); // 3 cards + container input
    })
});