import express from "express";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";
import { getNotification, markAsRead } from "../controller/notification.controller.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../model/User.model.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), getNotification)
router.patch("/:id/read", requireAuth, markAsRead)

export default router;