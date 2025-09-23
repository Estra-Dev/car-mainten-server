import express from "express";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";
import {
  createVehicle,
  getVehicles,
} from "../controller/vehicle.controller.js";

const router = express.Router();

// Define your vehicle routes here
router.post("/create", requireAuth, requireRole("admin"), createVehicle);
router.get("/vehicles", requireAuth, getVehicles);

export default router;
