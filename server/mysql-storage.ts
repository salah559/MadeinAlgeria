import mysql from 'mysql2/promise';
import type { Factory, InsertFactory, User, InsertUser } from '@shared/firebase-types';
import type { IStorage } from './firebase-storage';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'factory_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export class MySQLStorage implements IStorage {
  async getFactories(searchQuery?: string, wilaya?: string, category?: string): Promise<Factory[]> {
    let sql = 'SELECT * FROM factories WHERE 1=1';
    const params: any[] = [];

    if (wilaya) {
      sql += ' AND wilaya = ?';
      params.push(wilaya);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (searchQuery) {
      sql += ' AND (nameAr LIKE ? OR name LIKE ? OR descriptionAr LIKE ? OR description LIKE ?)';
      const searchPattern = `%${searchQuery}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(sql, params);
    return (rows as any[]).map(this.mapFactory);
  }

  async getFactory(id: string): Promise<Factory | undefined> {
    const [rows] = await pool.execute('SELECT * FROM factories WHERE id = ?', [id]);
    const results = rows as any[];
    if (results.length === 0) return undefined;
    return this.mapFactory(results[0]);
  }

  async createFactory(factory: InsertFactory): Promise<Factory> {
    const id = generateId();
    const now = new Date();
    
    const sql = `INSERT INTO factories (
      id, name, nameAr, description, descriptionAr, wilaya, category,
      products, productsAr, phone, email, address, addressAr,
      logoUrl, imageUrl, latitude, longitude, gallery,
      website, facebook, instagram, linkedin, twitter, whatsapp,
      certified, certifications, size, foundedYear, ownerId, verified,
      viewsCount, rating, reviewsCount, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await pool.execute(sql, [
      id,
      factory.name,
      factory.nameAr,
      factory.description,
      factory.descriptionAr,
      factory.wilaya,
      factory.category,
      JSON.stringify(factory.products),
      JSON.stringify(factory.productsAr),
      factory.phone,
      factory.email,
      factory.address,
      factory.addressAr,
      factory.logoUrl || null,
      factory.imageUrl || null,
      factory.latitude || null,
      factory.longitude || null,
      JSON.stringify(factory.gallery || []),
      factory.website || null,
      factory.facebook || null,
      factory.instagram || null,
      factory.linkedin || null,
      factory.twitter || null,
      factory.whatsapp || null,
      factory.certified || false,
      JSON.stringify(factory.certifications || []),
      factory.size || null,
      factory.foundedYear || null,
      factory.ownerId || null,
      factory.verified || false,
      0,
      0,
      0,
      now,
      now
    ]);

    return {
      id,
      ...factory,
      products: factory.products || [],
      productsAr: factory.productsAr || [],
      gallery: factory.gallery || [],
      certified: factory.certified || false,
      certifications: factory.certifications || [],
      verified: factory.verified || false,
      viewsCount: 0,
      rating: 0,
      reviewsCount: 0,
      createdAt: now,
      updatedAt: now
    };
  }

  async updateFactory(id: string, factory: Partial<InsertFactory>): Promise<Factory | undefined> {
    const existing = await this.getFactory(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];

    Object.entries(factory).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (Array.isArray(value)) {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    });

    updates.push('updatedAt = ?');
    params.push(new Date());
    params.push(id);

    await pool.execute(`UPDATE factories SET ${updates.join(', ')} WHERE id = ?`, params);
    
    return this.getFactory(id);
  }

  async deleteFactory(id: string): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM factories WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    const results = rows as any[];
    if (results.length === 0) return undefined;
    return this.mapUser(results[0]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const results = rows as any[];
    if (results.length === 0) return undefined;
    return this.mapUser(results[0]);
  }

  async createUser(user: InsertUser & { id?: string }): Promise<User> {
    const id = user.id || (user.googleId ? user.googleId : generateId());
    const now = new Date();

    await pool.execute(
      `INSERT INTO users (id, email, name, googleId, picture, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user.email, user.name || null, user.googleId || null, user.picture || null, user.role || 'user', now]
    );

    return {
      id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      picture: user.picture,
      role: user.role || 'user',
      createdAt: now
    };
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];

    Object.entries(user).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updates.length === 0) return existing;

    params.push(id);
    await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    
    return this.getUser(id);
  }

  private mapFactory(row: any): Factory {
    return {
      id: row.id,
      name: row.name,
      nameAr: row.nameAr,
      description: row.description,
      descriptionAr: row.descriptionAr,
      wilaya: row.wilaya,
      category: row.category,
      products: JSON.parse(row.products || '[]'),
      productsAr: JSON.parse(row.productsAr || '[]'),
      phone: row.phone,
      email: row.email,
      address: row.address,
      addressAr: row.addressAr,
      logoUrl: row.logoUrl,
      imageUrl: row.imageUrl,
      latitude: row.latitude,
      longitude: row.longitude,
      gallery: JSON.parse(row.gallery || '[]'),
      website: row.website,
      facebook: row.facebook,
      instagram: row.instagram,
      linkedin: row.linkedin,
      twitter: row.twitter,
      whatsapp: row.whatsapp,
      certified: Boolean(row.certified),
      certifications: JSON.parse(row.certifications || '[]'),
      size: row.size,
      foundedYear: row.foundedYear,
      viewsCount: row.viewsCount || 0,
      rating: row.rating || 0,
      reviewsCount: row.reviewsCount || 0,
      ownerId: row.ownerId,
      verified: Boolean(row.verified),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private mapUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      googleId: row.googleId,
      picture: row.picture,
      role: row.role,
      createdAt: new Date(row.createdAt)
    };
  }
}

export const mysqlStorage = new MySQLStorage();
