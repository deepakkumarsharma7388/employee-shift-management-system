import express from "express";
import {
  checkIn,
  checkOut,
  getAttendance
} from "../controllers/attendanceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/attendance/checkin", authMiddleware, checkIn);
router.post("/attendance/checkout", authMiddleware, checkOut);
router.get("/attendance", authMiddleware, getAttendance);

export default router;