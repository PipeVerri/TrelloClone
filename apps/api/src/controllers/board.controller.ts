import type { Request, Response } from "express";
import {
	createBoard,
	deleteBoard,
	getAllBoards,
	getBoardData,
	updateBoard,
} from "../services/board.service.ts";

export async function createBoardHandler(_req: Request, res: Response) {
	const { title } = res.locals.validated_body;
	const id = await createBoard(title);
	res.status(201).json({ id: id });
}

export async function updateBoardHandler(_req: Request, res: Response) {
	const { id, data } = res.locals.validated_body;
	await updateBoard(id, data);
	res.status(201).json({ status: "success" });
}

export async function getBoardHandler(_req: Request, res: Response) {
	const { id } = res.locals.validated_query;
	const board = await getBoardData(id);
	res.status(200).json({ data: board.data });
}

export async function deleteBoardHandler(_req: Request, res: Response) {
	const { id } = res.locals.validated_body;
	await deleteBoard(id);
	res.status(200).json({ status: "success" });
}

export async function getAllBoardsHandler(_req: Request, res: Response) {
	const boards = await getAllBoards();
	res.status(200).json(boards);
}
