import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./firebase-storage";
import { insertFactorySchema } from "@shared/firebase-types";
import { fromError } from "zod-validation-error";
import { adminAuth } from "./firebase-admin";

const ADMIN_EMAIL = "bouazzasalah120120@gmail.com";

interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (decodedToken.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
    
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/verify", async (req: AuthRequest, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      
      let user = await storage.getUserByEmail(decodedToken.email!);
      
      if (!user) {
        user = await storage.createUser({
          email: decodedToken.email!,
          name: decodedToken.name,
          picture: decodedToken.picture,
          role: decodedToken.email === ADMIN_EMAIL ? "admin" : "user",
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.get("/api/auth/user", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/factories", async (req, res) => {
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

  app.get("/api/factories/:id", async (req, res) => {
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

  app.post("/api/factories", requireAdmin, async (req, res) => {
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

  app.patch("/api/factories/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/factories/:id", requireAdmin, async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
