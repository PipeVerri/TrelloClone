export class AppError extends Error {
	// Las variables de la clase que voy a crear (y no estan en Error)
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
	}
}
