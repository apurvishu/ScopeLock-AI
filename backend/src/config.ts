// backend/src/config.ts
import * as dotenv from "dotenv";
import path from "path";

// Load .env.example by default if .env not present (development)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Ensure required env vars are present (optional during install)
const required = ["PORT", "DATABASE_PATH", "FRONTEND_ORIGIN"];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Warning: environment variable ${key} is not set; using default values.`);
  }
}



export const CONFIG = {
  port: Number(process.env.PORT),
  databasePath: path.resolve(process.cwd(), (process.env.DATABASE_PATH || "dev.db")),
  frontendOrigin: process.env.FRONTEND_ORIGIN as string,
  enableDemoIdentity: process.env.ENABLE_DEMO_IDENTITY === "true",
};
