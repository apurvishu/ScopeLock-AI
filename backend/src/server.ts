// backend/src/server.ts
import { CONFIG } from "./config";
import app from "./app";
import pino from "pino";

const logger = pino({ level: "info" });

const port = CONFIG.port || 4000;
app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
});
