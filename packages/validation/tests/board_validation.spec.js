import { CreateBoardReq, QueryBoardReq, UpdateBoardReq } from "../src/board.ts";
describe("Test CreateBoardReq", () => {
    test("Should accept a valid board", () => {
        const input = { title: "Test board" };
        const result = CreateBoardReq.safeParse(input);
        expect(result.success).toBe(true);
    });
    test("Should not accept an invalid board", () => {
        const input = { title: 2 };
        const result = CreateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept an invalid format", () => {
        const input = "testBoard";
        const result = CreateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
});
describe("Test UpdateBoardReq", () => {
    let board;
    beforeEach(() => {
        board = {
            cards: [{ title: "testCard" }],
            containers: [{ title: "testContainer", cards: [0] }],
            containersOrder: [0],
        };
    });
    test("Should accept a valid board", () => {
        const input = { id: "testId", data: board };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(true);
    });
    test("Should not accept when id is missing", () => {
        const input = { data: board };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept when data is missing", () => {
        const input = { id: "testId" };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept when id is not a string", () => {
        const input = { id: 123, data: board };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept when data is not an object", () => {
        const input = { id: "testId", data: "not-an-object" };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept when board shape is invalid (bad cards)", () => {
        const badData = {
            // title should be a string, not a number
            cards: [{ title: 1 }],
            containers: [{ title: "ok", cards: [0] }],
            // should be an array of numbers; keep valid here so failure is clearly from cards
            containersOrder: [0],
        };
        const input = { id: "testId", data: badData };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Should not accept when board shape is invalid (bad containersOrder)", () => {
        const badData = {
            cards: [{ title: "ok" }],
            containers: [{ title: "ok", cards: [0] }],
            // string instead of number
            containersOrder: ["0"],
        };
        const input = { id: "testId", data: badData };
        const result = UpdateBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
});
describe("Test QueryBoardReq", () => {
    test("Test with valid id", () => {
        const input = { id: "testId" };
        const result = QueryBoardReq.safeParse(input);
        expect(result.success).toBe(true);
    });
    test("Test with invalid id", () => {
        const input = { id: 123 };
        const result = QueryBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
    test("Test with invalid format", () => {
        const input = "testId";
        const result = QueryBoardReq.safeParse(input);
        expect(result.success).toBe(false);
    });
});
