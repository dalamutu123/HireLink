"use client";

import React from "react";
import { Tooltip } from "../ui/Tooltip";

import { useAuth } from "@/app/hooks/useAuth";

interface UserProfileProps {
  isExpanded: boolean;
}

export function UserProfile({ isExpanded }: UserProfileProps) {
  const { user } = useAuth();
  
  const displayName = user?.name || "Guest User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  
  const formatRole = (role?: string) => {
    if (!role) return "Loading Session";
    if (role === "jobseeker") return "Job Seeker";
    if (role === "employer") return "Employer";
    if (role === "admin") return "Administrator";
    return role;
  };

  const displayRole = formatRole(user?.role);

  if (isExpanded) {
    return (
      <div 
        className="flex items-center gap-3 p-3 mb-1"
        aria-label="User Profile details"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0 select-none">
          {avatarInitial}
        </div>
        <div className="min-w-0 flex-grow">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">
            {displayName}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">
            {displayRole}
          </p>
        </div>
      </div>
    );
  }

  // Collapsed Sidebar User Profile Avatar wrapped in Tooltip
  return (
    <Tooltip content={`${displayName} (${displayRole})`}>
      <div 
        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0 cursor-pointer select-none mb-1"
        aria-label="User Profile details"
      >
        {avatarInitial}
      </div>
    </Tooltip>
  );
}
