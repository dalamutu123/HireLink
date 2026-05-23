"use client";

import { useAuth } from "@/app/hooks/useAuth";
import JobseekerOverview from "@/components/dashboard/JobseekerOverview";
import EmployerOverview from "@/components/dashboard/EmployerOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500 font-semibold animate-pulse text-lg">
          Loading dashboard session...
        </div>
      </div>
    );
  }

  if (user?.role === "employer") {
    return <EmployerOverview />;
  }

  if (user?.role === "admin") {
    return <AdminOverview />;
  }

  // Default Seeker Overview
  return <JobseekerOverview />;
}
