import express from "express";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";
import { allDocuments, createDocument } from "../controller/document.controller.js";

const router = express.Router();

router.post("/create", requireAuth, requireRole("admin"), createDocument);
router.get("/allDocuments", requireAuth, allDocuments);

export default router;
