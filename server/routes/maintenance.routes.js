import express from "express";
import { allMaintenance, createMaintenance, deleteMaintenance, editMaintenance } from "../controller/maintenance.controller.js";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/create", requireAuth, requireRole("admin"), createMaintenance);
router.get("/allMaintenance", requireAuth, allMaintenance);
router.delete("/:id", requireAuth, requireRole("admin"), deleteMaintenance)
router.patch("/:id", requireAuth, requireRole("admin"), editMaintenance)

export default router;
