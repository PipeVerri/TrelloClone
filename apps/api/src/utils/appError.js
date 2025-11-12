export class AppError extends Error {
    // Las variables de la clase que voy a crear (y no estan en Error)
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}
