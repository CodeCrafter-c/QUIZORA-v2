import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { NotFoundError } from "./shared/errors/app-error.js";
import { sendSuccess } from "./shared/responses/response.js";
import database from "./shared/db/prisma.js";
import { globalErrorHandler } from "./shared/middlewares/globalErrorHandler.js";
import authRouter from "./src/modules/auth/routes/authRoutes.js";
import quizRouter from "./src/modules/quiz/routes/quizRoutes.js";
import liveQuizRouter from "./src/modules/live-quiz-sessions/routes/liveQuizRoutes.js";

const app = express();

// Core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Health check
app.get("/health", async (req, res, next) => {
  try {
    const dbHealthy = await database.healthCheck();

    if (!dbHealthy) {
      return res.status(503).json({
        success: false,
        message: "Database is unhealthy",
        data: null,
      });
    }

    return sendSuccess(res, {
      message: "Server is healthy",
      data: {
        database: "healthy",
      },
    });
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/quiz",quizRouter);
app.use("/api/v1/live-quiz",liveQuizRouter);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(globalErrorHandler);

// Server startup
const PORT = process.env.PORT || 3000;
let server;

const start = async () => {
  try {
    await database.connect();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);

  server?.close(async () => {
    await database.disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Unexpected process-level error
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION 💥", error);
  shutdown("UNCAUGHT_EXCEPTION");
});