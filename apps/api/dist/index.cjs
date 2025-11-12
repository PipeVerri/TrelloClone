"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express2 = __toESM(require("express"), 1);

// src/routes/board.route.ts
var import_express = require("express");

// src/services/board.service.ts
var import_db = require("@my/db");

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
var import_db2 = require("@my/db");
async function createBoard(title) {
  const defaultBoard = {
    cards: [{ title: "Test card" }],
    containers: [{ title: "Test container", cards: [0] }],
    containersOrder: [0]
  };
  const board = await import_db.prisma.board.create({ data: { title, data: defaultBoard } });
  return board.id;
}
async function updateBoard(boardId, newData) {
  try {
    await import_db.prisma.board.update({
      where: { id: boardId },
      data: { data: newData }
    });
  } catch (err) {
    if (err instanceof import_db2.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError("Board doesn't exist", 404);
    }
    throw err;
  }
}
async function getBoardData(boardId) {
  const board = await import_db.prisma.board.findUnique({
    where: { id: boardId }
  });
  if (!board) throw new AppError("Board doesn't exist", 404);
  return board;
}
async function deleteBoard(boardId) {
  try {
    await import_db.prisma.board.delete({
      where: { id: boardId }
    });
  } catch (err) {
    if (err instanceof import_db2.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError("Board doesn't exist", 404);
    }
    throw err;
  }
}
async function getAllBoards() {
  return import_db.prisma.board.findMany({
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
var import_zod = require("zod");
function validate(schema, where = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[where]);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        issues: import_zod.z.treeifyError(result.error)
      });
    }
    res.locals[`validated_${where}`] = result.data;
    next();
  };
}

// ../../packages/validation/src/board.ts
var import_zod2 = require("zod");
var BoardCardSchema = import_zod2.z.object({
  title: import_zod2.z.string()
});
var BoardContainerSchema = import_zod2.z.object({
  title: import_zod2.z.string(),
  // indices of cards that belong to this container
  cards: import_zod2.z.array(import_zod2.z.number().int().gte(0))
});
var BoardDataSchema = import_zod2.z.object({
  cards: import_zod2.z.array(BoardCardSchema),
  containers: import_zod2.z.array(BoardContainerSchema),
  containersOrder: import_zod2.z.array(import_zod2.z.number().int().gte(0))
});
var CreateBoardReq = import_zod2.z.object({
  title: import_zod2.z.string().min(1).trim()
});
var UpdateBoardReq = import_zod2.z.object({
  id: import_zod2.z.string().min(1),
  data: BoardDataSchema
});
var QueryBoardReq = import_zod2.z.object({
  id: import_zod2.z.string().min(1)
});

// src/routes/board.route.ts
var r = (0, import_express.Router)();
r.post("/createBoard", validate(CreateBoardReq), createBoardHandler);
r.put("/updateBoard", validate(UpdateBoardReq), updateBoardHandler);
r.get("/getBoard", validate(QueryBoardReq, "query"), getBoardHandler);
r.delete("/deleteBoard", validate(QueryBoardReq), deleteBoardHandler);
r.get("/getAllBoards", getAllBoardsHandler);
var board_route_default = r;

// src/app.ts
var dotenv = __toESM(require("dotenv"), 1);

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
var import_pino_http = require("pino-http");
var import_cors = __toESM(require("cors"), 1);

// src/utils/logging.ts
var customLoggerLevel = (req, res, err) => {
  if (err) return "error";
  if (res.statusCode >= 400) return "error";
  return "silent";
};

// src/app.ts
dotenv.config();
function createServer() {
  const app2 = (0, import_express2.default)();
  app2.use(import_express2.default.json());
  app2.use((0, import_pino_http.pinoHttp)({ customLogLevel: customLoggerLevel }));
  app2.use(
    (0, import_cors.default)({
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
