import { Router } from "express";
import * as ctrl from "../controllers/board.controller.ts";
import { validate } from "../middleware/validate.ts";
import { CreateBoardReq, QueryBoardReq, UpdateBoardReq } from "@my/validation/board";

const r = Router();

r.post("/createBoard", validate(CreateBoardReq), ctrl.createBoardHandler);
r.put("/updateBoard", validate(UpdateBoardReq), ctrl.updateBoardHandler);
r.get("/getBoard", validate(QueryBoardReq, "query"), ctrl.getBoardHandler);
r.delete("/deleteBoard", validate(QueryBoardReq), ctrl.deleteBoardHandler);
r.get("/getAllBoards", ctrl.getAllBoardsHandler);

export default r;
