import request from "supertest";
import { createServer } from "../src/app.ts";

describe("API e2e", () => {
	const app = createServer();
	let boardId: string;
	const boardData = {
		cards: [{ title: "card1" }],
		containers: [{ title: "container1", cards: [0] }],
		containersOrder: [0],
	};

	test("Create board", async () => {
		const res = await request(app).post(`/boards/createBoard`).send({ title: "Testing board" });
		expect(res.status).toBe(201);
		expect(res.body).toEqual(expect.objectContaining({ id: expect.any(String) }));
		boardId = res.body.id;
	});

	test("Set board data", async () => {
		const res = await request(app).put(`/boards/updateBoard`).send({
			id: boardId,
			data: boardData,
		});

		expect(res.status).toBe(201);
	});

	test("Get board data", async () => {
		const res = await request(app).get(`/boards/getBoard?id=${boardId}`);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			data: boardData,
		});
	});

	test("Get all boards", async () => {
		const res = await request(app).get("/boards/getAllBoards");
		expect(res.status).toBe(200);
		expect(res.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: boardId,
					title: "Testing board",
				}),
			]),
		);
	});

	test("Delete a board", async () => {
		const res = await request(app).delete(`/boards/deleteBoard`).send({ id: boardId });
		expect(res.status).toBe(200);
		const getRes = await request(app).get(`/boards/getBoard?id=${boardId}`);
		expect(getRes.status).toBe(404);
	});
});
