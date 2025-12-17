import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { mysqlStorage as storage } from "./mysql-storage";
import { insertFactorySchema } from "@shared/firebase-types";
import { fromError } from "zod-validation-error";
import { verifyToken } from "./auth-utils";
import { uploadImageBufferToImgBB } from "./imgbb-upload";
import multer from "multer";
import crypto from "crypto";

const ADMIN_EMAILS = ["bouazzasalah120120@gmail.com", "madimoh44@gmail.com"];

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    if (!ADMIN_EMAILS.includes(decoded.email || '')) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
  });

  app.post("/api/upload/image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageName = req.body.name || `factory_${Date.now()}`;
      const imageUrl = await uploadImageBufferToImgBB(req.file.buffer, imageName);
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: false, message: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ status: false, message: "البريد الإلكتروني مستخدم بالفعل" });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      const user = await storage.createUser({
        email,
        name: name || "",
        password: hashedPassword,
        role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
      });

      res.json({ status: true, message: "تم التسجيل بنجاح" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ status: false, message: "فشل التسجيل" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: false, message: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ status: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ status: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const { generateToken } = await import('./auth-utils');
      const token = generateToken({
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({
        status: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ status: false, message: "فشل تسجيل الدخول" });
    }
  });

  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        status: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", async (_req, res) => {
    res.json({ status: true, message: "تم تسجيل الخروج بنجاح" });
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const factories = await storage.getFactories();
      const stats = {
        totalFactories: factories.length,
        categories: Array.from(new Set(factories.map(f => f.category))).length,
        wilayas: Array.from(new Set(factories.map(f => f.wilaya))).length,
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
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
