// backend/src/routes/demo.ts
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Demo endpoint reachable" });
});

export default router;
