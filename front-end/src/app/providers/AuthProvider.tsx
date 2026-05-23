"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiService, User, JobseekerProfile, EmployerProfile } from "@/lib/api-service";

interface AuthContextType {
  user: User | JobseekerProfile | EmployerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userDetails: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | JobseekerProfile | EmployerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiService.users.getMe();
      if (response && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn("Failed to fetch user profile:", err);
      setUser(null);
      // If the profile fetch fails (e.g. token expired), clean up
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          await fetchProfile();
          return;
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchProfile]);

  const login = useCallback((token: string, userDetails: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    setUser(userDetails);
    fetchProfile(); // Load full profile asynchronously
  }, [fetchProfile]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
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
