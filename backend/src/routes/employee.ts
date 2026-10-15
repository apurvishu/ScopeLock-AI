// backend/src/routes/employee.ts
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Employee endpoint" });
});

export default router;
