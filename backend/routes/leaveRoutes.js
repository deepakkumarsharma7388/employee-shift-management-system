import express from "express";
import {
  applyLeave,
  getLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/leaves", authMiddleware, applyLeave);
router.get("/leaves", authMiddleware, getLeaves);
router.put("/leaves/:id/approve", authMiddleware, approveLeave);
router.put("/leaves/:id/reject", authMiddleware, rejectLeave);

export default router;