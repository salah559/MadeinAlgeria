import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { type Factory, type InsertFactory, factories, type User, type InsertUser, users } from "@shared/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

export interface IStorage {
  getFactories(searchQuery?: string, wilaya?: string, category?: string): Promise<Factory[]>;
  getFactory(id: string): Promise<Factory | undefined>;
  createFactory(factory: InsertFactory): Promise<Factory>;
  updateFactory(id: string, factory: Partial<InsertFactory>): Promise<Factory | undefined>;
  deleteFactory(id: string): Promise<boolean>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
}

export class DbStorage implements IStorage {
  async getFactories(searchQuery?: string, wilaya?: string, category?: string): Promise<Factory[]> {
    const conditions = [];
    
    if (searchQuery) {
      conditions.push(
        or(
          ilike(factories.nameAr, `%${searchQuery}%`),
          ilike(factories.name, `%${searchQuery}%`),
          ilike(factories.descriptionAr, `%${searchQuery}%`)
        )!
      );
    }
    
    if (wilaya) {
      conditions.push(eq(factories.wilaya, wilaya));
    }
    
    if (category) {
      conditions.push(eq(factories.category, category));
    }
    
    if (conditions.length === 0) {
      return await db.select().from(factories);
    }
    
    if (conditions.length === 1) {
      return await db.select().from(factories).where(conditions[0]);
    }
    
    return await db.select().from(factories).where(and(...conditions));
  }

  async getFactory(id: string): Promise<Factory | undefined> {
    const result = await db.select().from(factories).where(eq(factories.id, id));
    return result[0];
  }

  async createFactory(factory: InsertFactory): Promise<Factory> {
    const result = await db.insert(factories).values(factory).returning();
    return result[0];
  }

  async updateFactory(id: string, factory: Partial<InsertFactory>): Promise<Factory | undefined> {
    const result = await db
      .update(factories)
      .set(factory)
      .where(eq(factories.id, id))
      .returning();
    return result[0];
  }

  async deleteFactory(id: string): Promise<boolean> {
    const result = await db.delete(factories).where(eq(factories.id, id)).returning();
    return result.length > 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
