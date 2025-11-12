import type { Request, Response } from "express";
import {
	createBoard,
	deleteBoard,
	getAllBoards,
	getBoardData,
	updateBoard,
} from "../services/board.service.ts";

/**
 * Handles the creation of a new board.
 * @param _req - The request object (unused).
 * @param res - The response object containing validated body.
 */
export async function createBoardHandler(_req: Request, res: Response) {
	const { title } = res.locals.validated_body;
	const id = await createBoard(title);
	res.status(201).json({ id: id });
}

/**
 * Handles updating an existing board.
 * @param _req - The request object (unused).
 * @param res - The response object containing validated body.
 */
export async function updateBoardHandler(_req: Request, res: Response) {
	const { id, data } = res.locals.validated_body;
	await updateBoard(id, data);
	res.status(201).json({ status: "success" });
}

/**
 * Handles retrieving a board's data.
 * @param _req - The request object (unused).
 * @param res - The response object containing validated query.
 */
export async function getBoardHandler(_req: Request, res: Response) {
	const { id } = res.locals.validated_query;
	const board = await getBoardData(id);
	res.status(200).json({ data: board.data });
}

/**
 * Handles deleting a board.
 * @param _req - The request object (unused).
 * @param res - The response object containing validated body.
 */
export async function deleteBoardHandler(_req: Request, res: Response) {
	const { id } = res.locals.validated_body;
	await deleteBoard(id);
	res.status(200).json({ status: "success" });
}

/**
 * Handles retrieving all boards.
 * @param _req - The request object (unused).
 * @param res - The response object.
 */
export async function getAllBoardsHandler(_req: Request, res: Response) {
	const boards = await getAllBoards();
	res.status(200).json(boards);
}
