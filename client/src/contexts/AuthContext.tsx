import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/firebase-types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function verifyAndFetchUser(fbUser: FirebaseUser) {
    try {
      const token = await fbUser.getIdToken();
      const response = await apiRequest("POST", "/api/auth/verify", { token });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error verifying user:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await verifyAndFetchUser(fbUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await verifyAndFetchUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await verifyAndFetchUser(result.user);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  }

  async function signUpWithEmail(email: string, password: string, name?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await verifyAndFetchUser(result.user);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  const isAdmin = user?.email === "bouazzasalah120120@gmail.com";

  const value = {
    user,
    firebaseUser,
    isLoading,
    isAdmin,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
