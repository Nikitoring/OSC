import { Router } from "express";
import { catsController } from "./cats.controller.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { createCatSchema, updateCatSchema } from "./cats.schema.ts";

const router = Router();

router.get("/", catsController.getCats);
router.get("/last", catsController.getLastCats);
router.get("/statistics", catsController.getStatistics);

router.get("/:id", catsController.getCatById);

router.post(
  "/",
  authenticateToken,
  validateBody(createCatSchema),
  catsController.createCat,
);

router.patch(
  "/:id",
  authenticateToken,
  validateBody(updateCatSchema),
  catsController.updateCat,
);

export { router as catsRoutes };
