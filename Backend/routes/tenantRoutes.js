import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { upgradePlan, getTenant } from "../controllers/tenantController.js";

const router = express.Router();

router.get("/:slug", getTenant);
router.post("/:slug/upgrade", authenticate, authorizeRole(["admin"]), upgradePlan);

export default router;
