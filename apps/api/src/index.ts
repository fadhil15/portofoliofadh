import express from "express";
import cors from "cors";
import morgan from "morgan";
import { db } from "./db/client";
import projectRoutes from "./routes/projects";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(morgan("combined"));
app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://vercel.app",
            process.env.FRONTEND_URL || "",
        ].filter(Boolean),
        credentials: true,
    })
);

// Routes
app.use("/api", projectRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        code: err.code || "INTERNAL_ERROR",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`📦 API: http://localhost:${PORT}/api/projects`);
});

export default app;
