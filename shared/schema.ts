import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  googleId: text("google_id").unique(),
  picture: text("picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const factories = pgTable("factories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  wilaya: text("wilaya").notNull(),
  category: text("category").notNull(),
  products: text("products").array().notNull(),
  productsAr: text("products_ar").array().notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  addressAr: text("address_ar").notNull(),
  logoUrl: text("logo_url"),
  imageUrl: text("image_url"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const insertFactorySchema = createInsertSchema(factories).omit({
  id: true,
});

export type InsertFactory = z.infer<typeof insertFactorySchema>;
export type Factory = typeof factories.$inferSelect;

export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { mode: 'date' }).notNull(),
});

export type Session = typeof sessions.$inferSelect;
