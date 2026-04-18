import express from "express";
import { createShift, getShifts } from "../controllers/shiftController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/shifts", authMiddleware, createShift);
router.get("/shifts", authMiddleware, getShifts);

export default router;