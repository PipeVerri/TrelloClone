import type { ErrorRequestHandler } from "express";

/**
 * Global error handler middleware for Express.
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param _next - The next function (unused).
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	if (err?.name === "ZodError") {
		return res.status(400).json({ error: "ValidationError", issues: err.issues });
	}

	const status = err?.statusCode || 500;
	const message = err?.message || "Internal Server Error";
	req.log.error(message);

	return res.status(status).json({ error: message });
};
