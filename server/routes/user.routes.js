import express from "express";
import { registerUser } from "../controller/user.controller.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
  "/register",
  bodyParser.raw({ type: "application/json" }),
  registerUser
);

export default router;
