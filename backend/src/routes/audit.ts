// backend/src/routes/audit.ts
import { Router, Request, Response } from "express";
import { db } from "../database";

const router = Router();

/**
 * GET /api/audit
 * Supports pagination and simple filters.
 */
router.get("/", (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(100, Math.max(10, parseInt(req.query.pageSize as string) || 20));
  const offset = (page - 1) * pageSize;

  const filters: string[] = [];
  const params: any[] = [];

  if (req.query.decision) {
    filters.push("decision = ?");
    params.push(req.query.decision as string);
  }
  if (req.query.action) {
    filters.push("action = ?");
    params.push(req.query.action as string);
  }
  if (req.query.principal) {
    filters.push("principal_id = ?");
    params.push(req.query.principal as string);
  }
  if (req.query.resourceId) {
    filters.push("resource_id = ?");
    params.push(req.query.resourceId as string);
  }
  if (req.query.from) {
    filters.push("timestamp >= ?");
    params.push(req.query.from as string);
  }
  if (req.query.to) {
    filters.push("timestamp <= ?");
    params.push(req.query.to as string);
  }

  const whereClause = filters.length ? "WHERE " + filters.join(" AND ") : "";

  const totalStmt = db.prepare(`SELECT COUNT(*) AS cnt FROM audit_events ${whereClause}`);
  const total = (totalStmt.get(...params) as any).cnt as number;

  const stmt = db.prepare(
    `SELECT * FROM audit_events ${whereClause} ORDER BY timestamp DESC LIMIT ? OFFSET ?`
  );
  const rows = stmt.all(...params, pageSize, offset);

  res.json({ items: rows, pagination: { page, pageSize, total } });
});

export default router;
