import express from "express";
import { requireAuth, requireRole } from "../middleware/clerkAuth.js";
import { allDocuments, createDocument, deleteDoc, editDoc } from "../controller/document.controller.js";

const router = express.Router();

router.post("/create", requireAuth, requireRole("admin"), createDocument);
router.get("/allDocuments", requireAuth, allDocuments);
router.delete("/:id", requireAuth, requireRole("admin"), deleteDoc)
router.patch("/:id", requireAuth, requireRole("admin"), editDoc)

export default router;
