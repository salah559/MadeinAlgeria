
import { Express } from "express";

declare global {
  namespace Express {
    interface User {
      uid: string;
      email?: string;
      name?: string;
      picture?: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}
