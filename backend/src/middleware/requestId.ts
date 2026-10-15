// backend/src/middleware/requestId.ts
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  // Generate a correlation/request ID for tracing. If client supplies one, respect it.
  const incoming = req.header("x-request-id");
  const requestId = incoming && incoming.trim().length > 0 ? incoming : uuidv4();
  // Attach to request object for later use (e.g., audit logging)
  (req as any).requestId = requestId;
  // Also expose as response header for visibility
  req.res?.setHeader("x-request-id", requestId);
  next();
}
