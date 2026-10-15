// backend/src/routes/me.ts
import { Router, Request, Response } from "express";
import { demoAuthMiddleware } from "../auth";
import { getUserById } from "../database";

const router = Router();
router.use(demoAuthMiddleware);

router.get("/", (req: Request, res: Response) => {
  const principal = (req as any).principal;
  if (!principal) return res.status(401).json({ message: "Not authenticated" });
  const user = getUserById(principal.id);
  res.json({ user });
});

export default router;
