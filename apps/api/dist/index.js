// src/app.ts
import express from "express";

// src/routes/board.route.ts
import { Router } from "express";

// src/services/board.service.ts
import { prisma } from "@my/db";

// src/utils/appError.ts
var AppError = class extends Error {
  // Las variables de la clase que voy a crear (y no estan en Error)
  statusCode;
  constructor(message, statusCode) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
};

// src/services/board.service.ts
import { Prisma } from "@my/db";
async function createBoard(title) {
  const defaultBoard = {
    cards: [{ title: "Test card" }],
    containers: [{ title: "Test container", cards: [0] }],
    containersOrder: [0]
  };
  const board = await prisma.board.create({ data: { title, data: defaultBoard } });
  return board.id;
}
async function updateBoard(boardId, newData) {
  try {
    await prisma.board.update({
      where: { id: boardId },
      data: { data: newData }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError("Board doesn't exist", 404);
    }
    throw err;
  }
}
async function getBoardData(boardId) {
  const board = await prisma.board.findUnique({
    where: { id: boardId }
  });
  if (!board) throw new AppError("Board doesn't exist", 404);
  return board;
}
async function deleteBoard(boardId) {
  try {
    await prisma.board.delete({
      where: { id: boardId }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError("Board doesn't exist", 404);
    }
    throw err;
  }
}
async function getAllBoards() {
  return prisma.board.findMany({
    select: { id: true, title: true }
  });
}

// src/controllers/board.controller.ts
async function createBoardHandler(_req, res) {
  const { title } = res.locals.validated_body;
  const id = await createBoard(title);
  res.status(201).json({ id });
}
async function updateBoardHandler(_req, res) {
  const { id, data } = res.locals.validated_body;
  await updateBoard(id, data);
  res.status(201).json({ status: "success" });
}
async function getBoardHandler(_req, res) {
  const { id } = res.locals.validated_query;
  const board = await getBoardData(id);
  res.status(200).json({ data: board.data });
}
async function deleteBoardHandler(_req, res) {
  const { id } = res.locals.validated_body;
  await deleteBoard(id);
  res.status(200).json({ status: "success" });
}
async function getAllBoardsHandler(_req, res) {
  const boards = await getAllBoards();
  res.status(200).json(boards);
}

// src/middleware/validate.ts
import { z } from "zod";
function validate(schema, where = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[where]);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        issues: z.treeifyError(result.error)
      });
    }
    res.locals[`validated_${where}`] = result.data;
    next();
  };
}

// ../../packages/validation/src/board.ts
import { z as z2 } from "zod";
var BoardCardSchema = z2.object({
  title: z2.string()
});
var BoardContainerSchema = z2.object({
  title: z2.string(),
  // indices of cards that belong to this container
  cards: z2.array(z2.number().int().gte(0))
});
var BoardDataSchema = z2.object({
  cards: z2.array(BoardCardSchema),
  containers: z2.array(BoardContainerSchema),
  containersOrder: z2.array(z2.number().int().gte(0))
});
var CreateBoardReq = z2.object({
  title: z2.string().min(1).trim()
});
var UpdateBoardReq = z2.object({
  id: z2.string().min(1),
  data: BoardDataSchema
});
var QueryBoardReq = z2.object({
  id: z2.string().min(1)
});

// src/routes/board.route.ts
var r = Router();
r.post("/createBoard", validate(CreateBoardReq), createBoardHandler);
r.put("/updateBoard", validate(UpdateBoardReq), updateBoardHandler);
r.get("/getBoard", validate(QueryBoardReq, "query"), getBoardHandler);
r.delete("/deleteBoard", validate(QueryBoardReq), deleteBoardHandler);
r.get("/getAllBoards", getAllBoardsHandler);
var board_route_default = r;

// src/app.ts
import * as dotenv from "dotenv";

// src/middleware/errorHandler.ts
var errorHandler = (err, req, res, _next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: "ValidationError", issues: err.issues });
  }
  const status = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  req.log.error(message);
  return res.status(status).json({ error: message });
};

// src/app.ts
import { pinoHttp } from "pino-http";
import cors from "cors";

// src/utils/logging.ts
var customLoggerLevel = (req, res, err) => {
  if (err) return "error";
  if (res.statusCode >= 400) return "error";
  return "silent";
};

// src/app.ts
dotenv.config();
function createServer() {
  const app2 = express();
  app2.use(express.json());
  app2.use(pinoHttp({ customLogLevel: customLoggerLevel }));
  app2.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true
      // Permitir que se envien credenciales(auth, por ejemplo)
    })
  );
  app2.use("/boards", board_route_default);
  app2.use(errorHandler);
  return app2;
}

// src/index.ts
var port = process.env.PORT;
var app = createServer();
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
