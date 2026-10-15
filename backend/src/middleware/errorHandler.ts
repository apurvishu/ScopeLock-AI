// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

// Centralized error handler – hides stack traces from clients
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.expose ? err.message : "Internal server error";
  res.status(status).json({ error: message });
}

// Helper to create HttpError instances (optional)
export function createHttpError(status: number, message: string, expose = false) {
  const error: HttpError = new Error(message) as any;
  error.status = status;
  error.expose = expose;
  return error;
}
