"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    const role = user.role || "jobseeker";

    // Shared allowed paths
    if (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/settings") ||
      pathname.startsWith("/dashboard/notifications")
    ) {
      setIsChecking(false);
      return;
    }

    let isAllowed = false;

    if (role === "admin") {
      if (pathname.startsWith("/dashboard/admin")) {
        isAllowed = true;
      }
    } else if (role === "employer") {
      if (
        pathname.startsWith("/dashboard/applicants") ||
        pathname.startsWith("/dashboard/jobs/new") ||
        pathname.startsWith("/dashboard/jobs/manage") ||
        (pathname.startsWith("/dashboard/jobs") && !pathname.startsWith("/dashboard/saved"))
      ) {
        isAllowed = true;
      }
    } else if (role === "jobseeker") {
      if (
        pathname.startsWith("/dashboard/jobs") &&
        !pathname.startsWith("/dashboard/jobs/new") &&
        !pathname.startsWith("/dashboard/jobs/manage") &&
        !pathname.startsWith("/dashboard/applicants")
      ) {
        isAllowed = true;
      } else if (pathname.startsWith("/dashboard/saved")) {
        isAllowed = true;
      }
    }

    if (!isAllowed) {
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return <>{children}</>;
}
