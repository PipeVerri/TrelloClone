import express from "express"
import boards from "./routes/board.route"
import * as dotenv from "dotenv"
import {errorHandler} from "./middleware/errorHandler";
import {pinoHttp} from "pino-http";
import cors from "cors"
dotenv.config()

export function createServer() {
    const app = express()
    // Middleware
    app.use(express.json())
    app.use(pinoHttp())
    app.use(cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true // Permitir que se envien credenciales(auth, por ejemplo)
    }))
    // Rutas
    app.use("/boards", boards)
    // El error handler al final, para agarrar todo
    app.use(errorHandler)

    return app
}