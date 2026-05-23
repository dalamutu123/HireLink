"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { useApiHealth } from "@/app/hooks/useApiHealth";
import { Tooltip } from "../ui/Tooltip";

interface ApiStatusBadgeProps {
  isExpanded: boolean;
}

export const ApiStatusBadge = React.memo(function ApiStatusBadge({
  isExpanded,
}: ApiStatusBadgeProps) {
  const { isApiOnline } = useApiHealth();

  if (isExpanded) {
    return (
      <div 
        className="mt-1 w-fit select-none"
        aria-label={`API Health: ${isApiOnline === null ? "Checking" : isApiOnline ? "Online" : "Offline"}`}
      >
        {isApiOnline === null ? (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
            <RefreshCw size={8} className="animate-spin text-slate-400" />
            <span>Checking API...</span>
          </div>
        ) : isApiOnline ? (
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50/60 border border-emerald-100/60 px-2.5 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>System Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold bg-rose-50/60 border border-rose-100/60 px-2.5 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
            <span>System Offline</span>
          </div>
        )}
      </div>
    );
  }

  // Collapsed Sidebar Dot with Tooltip
  return (
    <Tooltip content={isApiOnline === null ? "Checking API status..." : isApiOnline ? "API Status: Online" : "API Status: Offline"}>
      <div 
        className="w-5 h-5 flex items-center justify-center cursor-help select-none"
        aria-label={`API Health Dot: ${isApiOnline === null ? "Checking" : isApiOnline ? "Online" : "Offline"}`}
      >
        {isApiOnline === null ? (
          <RefreshCw size={12} className="animate-spin text-slate-400" />
        ) : isApiOnline ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        )}
      </div>
    </Tooltip>
  );
});
