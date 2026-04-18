import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/employees", authMiddleware, createEmployee);
router.get("/employees", authMiddleware, getEmployees);
router.put("/employees/:id", authMiddleware, updateEmployee);
router.delete("/employees/:id", authMiddleware, deleteEmployee);

export default router;