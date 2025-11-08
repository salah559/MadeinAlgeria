import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { insertFactorySchema } from "../shared/schema";
import { fromError } from "zod-validation-error";

const app = express();

app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.options("*", (_req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.status(200).end();
});

app.get("/factories", async (req, res) => {
  try {
    const { search, wilaya, category } = req.query;
    const factories = await storage.getFactories(
      search as string,
      wilaya as string,
      category as string
    );
    res.json(factories);
  } catch (error) {
    console.error("Error fetching factories:", error);
    res.status(500).json({ error: "Failed to fetch factories" });
  }
});

app.get("/factories/:id", async (req, res) => {
  try {
    const factory = await storage.getFactory(req.params.id);
    if (!factory) {
      return res.status(404).json({ error: "Factory not found" });
    }
    res.json(factory);
  } catch (error) {
    console.error("Error fetching factory:", error);
    res.status(500).json({ error: "Failed to fetch factory" });
  }
});

app.post("/factories", async (req, res) => {
  try {
    const validatedData = insertFactorySchema.parse(req.body);
    const factory = await storage.createFactory(validatedData);
    res.status(201).json(factory);
  } catch (error: any) {
    if (error.name === "ZodError") {
      const validationError = fromError(error);
      return res.status(400).json({ error: validationError.toString() });
    }
    console.error("Error creating factory:", error);
    res.status(500).json({ error: "Failed to create factory" });
  }
});

app.patch("/factories/:id", async (req, res) => {
  try {
    const partialSchema = insertFactorySchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const factory = await storage.updateFactory(req.params.id, validatedData);
    if (!factory) {
      return res.status(404).json({ error: "Factory not found" });
    }
    res.json(factory);
  } catch (error: any) {
    if (error.name === "ZodError") {
      const validationError = fromError(error);
      return res.status(400).json({ error: validationError.toString() });
    }
    console.error("Error updating factory:", error);
    res.status(500).json({ error: "Failed to update factory" });
  }
});

app.delete("/factories/:id", async (req, res) => {
  try {
    const success = await storage.deleteFactory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Factory not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting factory:", error);
    res.status(500).json({ error: "Failed to delete factory" });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless function
export default app;
