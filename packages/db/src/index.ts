import { PrismaClient } from "./generated/prisma/client";

export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
})
export {Prisma} from "./generated/prisma/client"

/**
 * Disconnects from the database.
 */
export async function disconnect(): Promise<void> {
    await prisma.$disconnect()
}