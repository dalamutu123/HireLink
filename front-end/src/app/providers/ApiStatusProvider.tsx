"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { apiService } from "@/lib/api-service";

interface ApiStatusContextType {
  isApiOnline: boolean | null;
  checkNow: () => Promise<void>;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export function ApiStatusProvider({ children }: { children: React.ReactNode }) {
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);
  const isCheckingRef = useRef(false);

  const checkHealth = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    try {
      const isOnline = await apiService.health.check();
      setIsApiOnline(isOnline);
    } catch {
      setIsApiOnline(false);
    } finally {
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll every 10 seconds and clean up on unmount
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ApiStatusContext.Provider value={{ isApiOnline, checkNow: checkHealth }}>
      {children}
    </ApiStatusContext.Provider>
  );
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error("useApiStatus must be used within an ApiStatusProvider");
  }
  return context;
}
