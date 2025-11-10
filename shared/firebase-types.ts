import { z } from "zod";

export const insertUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  googleId: z.string().optional(),
  picture: z.string().optional(),
  role: z.string().default("user"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User {
  id: string;
  email: string;
  name?: string;
  googleId?: string;
  picture?: string;
  role: string;
  createdAt: Date;
}

export const insertFactorySchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  description: z.string().min(1),
  descriptionAr: z.string().min(1),
  wilaya: z.string().min(1),
  category: z.string().min(1),
  products: z.array(z.string()),
  productsAr: z.array(z.string()),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  addressAr: z.string().min(1),
  logoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  whatsapp: z.string().optional(),
  certified: z.boolean().default(false),
  certifications: z.array(z.string()).default([]),
  size: z.string().optional(),
  foundedYear: z.number().optional(),
  ownerId: z.string().optional(),
  verified: z.boolean().default(false),
});

export type InsertFactory = z.infer<typeof insertFactorySchema>;

export interface Factory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  wilaya: string;
  category: string;
  products: string[];
  productsAr: string[];
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  logoUrl?: string;
  imageUrl?: string;
  latitude?: string;
  longitude?: string;
  gallery: string[];
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  certified: boolean;
  certifications: string[];
  size?: string;
  foundedYear?: number;
  viewsCount: number;
  rating: number;
  reviewsCount: number;
  ownerId?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const insertReviewSchema = z.object({
  factoryId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  commentAr: z.string().optional(),
});

export type InsertReview = z.infer<typeof insertReviewSchema>;

export interface Review {
  id: string;
  factoryId: string;
  userId: string;
  rating: number;
  comment?: string;
  commentAr?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  factoryId: string;
  date: Date;
  views: number;
  clicks: number;
  searches: number;
}

export const insertNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  titleAr: z.string(),
  message: z.string(),
  messageAr: z.string(),
  type: z.string(),
  link: z.string().optional(),
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

export const insertBlogPostSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  slug: z.string(),
  content: z.string(),
  contentAr: z.string(),
  excerpt: z.string(),
  excerptAr: z.string(),
  coverImage: z.string().optional(),
  authorId: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export interface BlogPost {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  content: string;
  contentAr: string;
  excerpt: string;
  excerptAr: string;
  coverImage?: string;
  authorId: string;
  category: string;
  tags: string[];
  published: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
