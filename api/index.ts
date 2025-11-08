import type { Request, Response } from "express";
import { registerRoutes } from "../server/routes";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
registerRoutes(app);

// Export for Vercel
export default app;