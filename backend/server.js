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

/* =====================================================
   CORS
===================================================== */

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =====================================================
   BODY PARSER
===================================================== */

app.use(express.json());

/* =====================================================
   MONGODB CONNECTION
   - Reuses existing connection
   - Important for Vercel/serverless
===================================================== */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined");
}

/*
  Store MongoDB connection globally.

  Vercel can create multiple serverless instances.
  Global caching helps reuse an existing connection
  instead of creating a new connection every request.
*/

let cached = globalThis.mongooseConnection;

if (!cached) {
  cached = globalThis.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

/* =====================================================
   CONNECT DATABASE FUNCTION
===================================================== */

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection is already in progress
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB Connection Error:", error);

        // Allow next request to try again
        cached.promise = null;

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

/* =====================================================
   HEALTH / TEST ROUTE
===================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend API Running...",
  });
});

/* =====================================================
   DATABASE TEST ROUTE
===================================================== */

app.get("/db-test", async (req, res) => {
  try {
    await connectDB();

    const state = mongoose.connection.readyState;

    res.status(200).json({
      mongodbState: state,
      message:
        state === 1
          ? "MongoDB Connected"
          : "MongoDB Not Connected",
    });
  } catch (error) {
    console.error("DB Test Error:", error);

    res.status(500).json({
      mongodbState: mongoose.connection.readyState,
      message: "MongoDB Connection Failed",
      error: error.message,
    });
  }
});

/* =====================================================
   DATABASE MIDDLEWARE
   Every API request waits for MongoDB connection
===================================================== */

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Middleware Error:", error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

/* =====================================================
   API ROUTES
===================================================== */

app.use("/api", authRoutes);
app.use("/api", employeeRoutes);
app.use("/api", shiftRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", leaveRoutes);

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* =====================================================
   LOCAL DEVELOPMENT
===================================================== */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  const startServer = async () => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error(
        "Server could not start because MongoDB connection failed:",
        error
      );
    }
  };

  startServer();
}

/* =====================================================
   VERCEL
===================================================== */

export default app;