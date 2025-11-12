import { createServer } from "./app";
const port = process.env.PORT;
const app = createServer();
app.listen(port, () => {
    // biome-ignore lint/suspicious/noConsole: No afecta
    console.log(`Listening on port ${port}`);
});
