import { adminDb } from './firebase-admin';
import type { Factory, InsertFactory, User, InsertUser } from '@shared/firebase-types';

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

export class FirebaseStorage implements IStorage {
  async getFactories(searchQuery?: string, wilaya?: string, category?: string): Promise<Factory[]> {
    let query = adminDb.collection('factories').orderBy('createdAt', 'desc');
    
    if (wilaya) {
      query = query.where('wilaya', '==', wilaya) as any;
    }
    
    if (category) {
      query = query.where('category', '==', category) as any;
    }
    
    const snapshot = await query.get();
    let factories = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Factory[];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      factories = factories.filter(factory => 
        factory.nameAr.toLowerCase().includes(lowerQuery) ||
        factory.name.toLowerCase().includes(lowerQuery) ||
        factory.descriptionAr.toLowerCase().includes(lowerQuery) ||
        factory.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    return factories;
  }

  async getFactory(id: string): Promise<Factory | undefined> {
    const doc = await adminDb.collection('factories').doc(id).get();
    if (!doc.exists) return undefined;
    
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
      updatedAt: doc.data()?.updatedAt?.toDate() || new Date(),
    } as Factory;
  }

  async createFactory(factory: InsertFactory): Promise<Factory> {
    const now = new Date();
    const docRef = adminDb.collection('factories').doc();
    
    const data = {
      ...factory,
      viewsCount: 0,
      rating: 0,
      reviewsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(data);
    
    return {
      id: docRef.id,
      ...data,
    } as Factory;
  }

  async updateFactory(id: string, factory: Partial<InsertFactory>): Promise<Factory | undefined> {
    const docRef = adminDb.collection('factories').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return undefined;
    
    const updateData = {
      ...factory,
      updatedAt: new Date(),
    };
    
    await docRef.update(updateData);
    
    const updated = await docRef.get();
    return {
      id: updated.id,
      ...updated.data(),
      createdAt: updated.data()?.createdAt?.toDate() || new Date(),
      updatedAt: updated.data()?.updatedAt?.toDate() || new Date(),
    } as Factory;
  }

  async deleteFactory(id: string): Promise<boolean> {
    const docRef = adminDb.collection('factories').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return false;
    
    await docRef.delete();
    return true;
  }

  async getUser(id: string): Promise<User | undefined> {
    const doc = await adminDb.collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await adminDb.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    } as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const docRef = adminDb.collection('users').doc();
    
    const data = {
      ...user,
      role: user.role || 'user',
      createdAt: new Date(),
    };
    
    await docRef.set(data);
    
    return {
      id: docRef.id,
      ...data,
    } as User;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const docRef = adminDb.collection('users').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return undefined;
    
    await docRef.update(user);
    
    const updated = await docRef.get();
    return {
      id: updated.id,
      ...updated.data(),
      createdAt: updated.data()?.createdAt?.toDate() || new Date(),
    } as User;
  }
}

export const storage = new FirebaseStorage();
