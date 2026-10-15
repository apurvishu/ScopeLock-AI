// backend/src/routes/tools.ts
import { Router, Request, Response } from "express";
import { demoAuthMiddleware, requirePrincipal } from "../auth";
import { evaluatePolicy } from "../policy";

const router = Router();

router.use(demoAuthMiddleware);

router.post("/", (req: Request, res: Response) => {
  let principal: ReturnType<typeof requirePrincipal>;
  try {
    principal = requirePrincipal(req);
  } catch (e: any) {
    return res.status(401).json({ message: e.message });
  }

  const { action, resourceType, resourceId } = req.body as {
    action?: string;
    resourceType?: string;
    resourceId?: string;
  };

  if (!action || !resourceType || !resourceId) {
    return res.status(400).json({ message: "action, resourceType, and resourceId are required." });
  }

  const result = evaluatePolicy(principal, {
    action,
    resourceType: resourceType as any,
    resourceId,
  });

  res.json(result);
});

export default router;
