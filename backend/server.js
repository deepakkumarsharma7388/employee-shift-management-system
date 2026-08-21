import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   Body Parser
========================= */

app.use(express.json());

/* =========================
   Routes
========================= */

app.use("/api", authRoutes);
app.use("/api", employeeRoutes);
app.use("/api", shiftRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", leaveRoutes);

/* =========================
   Test Route
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Employee Management Backend API is running"
  });
});

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("Database Error:", error);
  });

/* =========================
   Local Development
========================= */

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

/* =========================
   Export for Vercel
========================= */

export default app;