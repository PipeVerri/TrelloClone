import { createBoard, deleteBoard, getAllBoards, getBoardData, updateBoard, } from "../services/board.service";
export async function createBoardHandler(_req, res) {
    const { title } = res.locals.validated_body;
    const id = await createBoard(title);
    res.status(201).json({ id: id });
}
export async function updateBoardHandler(_req, res) {
    const { id, data } = res.locals.validated_body;
    await updateBoard(id, data);
    res.status(201).json({ status: "success" });
}
export async function getBoardHandler(_req, res) {
    const { id } = res.locals.validated_query;
    const board = await getBoardData(id);
    res.status(200).json({ data: board.data });
}
export async function deleteBoardHandler(_req, res) {
    const { id } = res.locals.validated_body;
    await deleteBoard(id);
    res.status(200).json({ status: "success" });
}
export async function getAllBoardsHandler(_req, res) {
    const boards = await getAllBoards();
    res.status(200).json(boards);
}
