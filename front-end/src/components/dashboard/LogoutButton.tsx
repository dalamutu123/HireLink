"use client";

import React, { useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api-service";
import { Tooltip } from "../ui/Tooltip";

interface LogoutButtonProps {
  isExpanded: boolean;
}

export function LogoutButton({ isExpanded }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await apiService.auth.logout();
    } catch (err) {
      console.warn("Logout endpoint failed:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setIsLoggingOut(false);
      router.push("/");
    }
  };

  if (isExpanded) {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Log out of HireLink"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed select-none mt-2"
      >
        {isLoggingOut ? (
          <RefreshCw size={18} className="animate-spin shrink-0" />
        ) : (
          <LogOut size={18} className="shrink-0" />
        )}
        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
      </button>
    );
  }

  // Collapsed Sidebar Logout Icon Button wrapped in Tooltip
  return (
    <Tooltip content="Logout">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Log out of HireLink"
        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 select-none"
      >
        {isLoggingOut ? (
          <RefreshCw size={18} className="animate-spin" />
        ) : (
          <LogOut size={18} />
        )}
      </button>
    </Tooltip>
  );
}
