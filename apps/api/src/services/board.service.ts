import { prisma } from "@my/db";
import { AppError } from "../utils/appError.ts";
import { Prisma } from "@my/db";

/**
 * Creates a new board with default data.
 * @param title - The title of the board.
 * @returns The ID of the created board.
 */
export async function createBoard(title: string) {
	const defaultBoard: Prisma.JsonObject = {
		cards: [{ title: "Test card", description: "" }],
		containers: [{ title: "Test container", cards: [0] }],
		containersOrder: [0],
	};

	const board = await prisma.board.create({ data: { title: title, data: defaultBoard } });
	return board.id;
}

/**
 * Updates the data of an existing board.
 * @param boardId - The ID of the board to update.
 * @param newData - The new data for the board.
 * @throws {AppError} If the board does not exist.
 */
export async function updateBoard(boardId: string, newData: Prisma.JsonObject) {
	try {
		await prisma.board.update({
			where: { id: boardId },
			data: { data: newData },
		});
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			throw new AppError("Board doesn't exist", 404);
		}
		throw err;
	}
}

/**
 * Retrieves the data of a board by ID.
 * @param boardId - The ID of the board.
 * @returns The board object.
 * @throws {AppError} If the board does not exist.
 */
export async function getBoardData(boardId: string) {
	const board = await prisma.board.findUnique({
		where: { id: boardId },
	});
	if (!board) throw new AppError("Board doesn't exist", 404);
	return board;
}

/**
 * Deletes a board by ID.
 * @param boardId - The ID of the board to delete.
 * @throws {AppError} If the board does not exist.
 */
export async function deleteBoard(boardId: string) {
	try {
		await prisma.board.delete({
			where: { id: boardId },
		});
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			throw new AppError("Board doesn't exist", 404);
		}
		throw err;
	}
}

/**
 * Retrieves all boards with their IDs and titles.
 * @returns An array of board objects with id and title.
 */
export async function getAllBoards() {
	return prisma.board.findMany({
		select: { id: true, title: true },
	});
}
