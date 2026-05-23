"use client";

import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg shadow-xl border border-slate-800 hidden group-hover:block whitespace-nowrap z-[100] pointer-events-none transition-all duration-200 select-none">
        {content}
      </div>
    </div>
  );
}
