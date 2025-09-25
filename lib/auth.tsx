// Authentication utilities and context
"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./types";
import { mockUsers } from "./mock-data";
import { supabase } from "./supabase";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  supabaseUser: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session (existing mock system)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Initialize Supabase auth listener
    const initializeSupabase = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setSupabaseUser(session.user);
          } else {
            setSupabaseUser(null);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.log(
          "Supabase initialization error (using mock auth as fallback):",
          error
        );
      }
    };

    initializeSupabase();
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Try Supabase authentication first (when properly configured)
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !==
          "https://your-project.supabase.co"
      ) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data.user && !error) {
          // Fetch user profile from our users table
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (userProfile) {
            setUser(userProfile as User);
            setSupabaseUser(data.user);
            localStorage.setItem("user", JSON.stringify(userProfile));
            setLoading(false);
            return true;
          }
        }
      }
    } catch (error) {
      console.log("Supabase auth error, falling back to mock auth:", error);
    }

    // Fallback to mock authentication for development/demo
    const foundUser = mockUsers.find((u) => u.email === email);

    if (foundUser && password === "password") {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = async () => {
    // Sign out from Supabase if authenticated
    if (supabaseUser) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setSupabaseUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, supabaseUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
