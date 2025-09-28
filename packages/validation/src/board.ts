// @my/validation/board/src/board.ts
import { z } from "zod";

export const BoardCardSchema = z.object({
    title: z.string(),
});

export const BoardContainerSchema = z.object({
    title: z.string(),
    // indices of cards that belong to this container
    cards: z.array(z.number().int().gte(0)),
});

export const BoardDataSchema = z.object({
    cards: z.array(BoardCardSchema),
    containers: z.array(BoardContainerSchema),
    containersOrder: z.array(z.number().int().gte(0)),
});

// --- Request DTOs, lo que uso para validar el request en si

export const CreateBoardReq = z.object({
    title: z.string().min(1).trim(),
});
export type CreateBoardReq = z.infer<typeof CreateBoardReq>;

export const UpdateBoardReq = z.object({
    id: z.string().min(1),
    data: BoardDataSchema,
});
export type UpdateBoardReq = z.infer<typeof UpdateBoardReq>;

export const QueryBoardReq = z.object({
    id: z.string().min(1),
})
export type QueryBoardReq = z.infer<typeof QueryBoardReq>;