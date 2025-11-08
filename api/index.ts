import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool, neonConfig } from "@neondatabase/serverless";
import passport from "../server/auth";
import { storage } from "../server/storage";
import { insertFactorySchema } from "../shared/schema";
import { fromError } from "zod-validation-error";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const app = express();
const PgSession = connectPgSimple(session);

app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

const sessionStore = process.env.DATABASE_URL
  ? new PgSession({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      tableName: 'session',
      createTableIfMissing: true,
    })
  : undefined;

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const ADMIN_EMAIL = "bouazzasalah120120@gmail.com";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user && (req.user as any).email === ADMIN_EMAIL) {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Admin access required" });
}

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (_req, res) => {
    res.redirect("/");
  }
);

app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

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

app.post("/factories", requireAdmin, async (req, res) => {
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

app.patch("/factories/:id", requireAdmin, async (req, res) => {
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

app.delete("/factories/:id", requireAdmin, async (req, res) => {
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
