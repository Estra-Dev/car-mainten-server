import express from "express";
import { allMaintenance, createMaintenance } from "../controller/maintenance.controller.js";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/create", requireAuth, requireRole("admin"), createMaintenance);
router.get("/allMaintenance", requireAuth, allMaintenance);

export default router;
