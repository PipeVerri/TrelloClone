/**
 * Custom error class for application errors.
 */
export class AppError extends Error {
	// Las variables de la clase que voy a crear (y no estan en Error)
	statusCode: number;

	/**
	 * Creates an instance of AppError.
	 * @param message - The error message.
	 * @param statusCode - The HTTP status code.
	 */
	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
	}
}
