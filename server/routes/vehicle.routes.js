import express from "express";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";
import {
  createVehicle,
  deleteVehicle,
  editVehicle,
  getVehicles,
} from "../controller/vehicle.controller.js";

const router = express.Router();

// Define your vehicle routes here
router.post("/create", requireAuth, requireRole("admin"), createVehicle);
router.get("/vehicles", requireAuth, getVehicles);
router.delete("/:id", requireAuth, requireRole("admin"), deleteVehicle)
router.patch("/:id", requireAuth, requireRole("admin"), editVehicle)

export default router;
