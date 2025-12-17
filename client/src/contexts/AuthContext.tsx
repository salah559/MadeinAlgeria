import { createContext, useContext, useEffect, useState } from "react";

// API Base URL - uses Express backend
const API_BASE = "";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  async function checkAuth() {
    try {
      console.log("Checking authentication status...");
      
      const response = await fetch(`${API_BASE}/api/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status && data.user) {
          console.log("User authenticated:", data.user.email);
          setUser(data.user);
        } else {
          console.log("No active session");
          setUser(null);
        }
      } else {
        console.log("Auth check failed, user not logged in");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function signInWithEmail(email: string, password: string): Promise<void> {
    try {
      console.log("Signing in with email...");
      
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      console.log("Login successful:", data.user?.email);
      setUser(data.user);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  async function signUpWithEmail(email: string, password: string, name?: string): Promise<void> {
    try {
      console.log("Registering new user...");
      
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: name || "" }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "فشل التسجيل");
      }

      console.log("Registration successful");
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      console.log("Logging out...");
      
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Logout request failed:", data);
      }

      setUser(null);
      console.log("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      setUser(null);
      window.location.href = "/";
    }
  }

  async function resetPassword(email: string): Promise<void> {
    try {
      console.log("Requesting password reset for:", email);
      
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "فشل إرسال رابط إعادة تعيين كلمة المرور");
      }

      console.log("Password reset email sent");
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  const ADMIN_EMAILS = ["bouazzasalah120120@gmail.com", "madimoh44@gmail.com"];
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  const value = {
    user,
    isLoading,
    isAdmin,
    signInWithEmail,
    signUpWithEmail,
    logout,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
