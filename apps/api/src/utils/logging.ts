import {IncomingMessage, ServerResponse} from "node:http";

export const customLoggerLevel = (req: IncomingMessage, res: ServerResponse, err: unknown) => {
    // If an error object exists, log as error
    if (err) return 'error';
    // log only for 4xx or 5xx responses
    if (res.statusCode >= 400) return 'error';
    // otherwise don't log
    return 'silent';
}