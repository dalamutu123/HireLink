"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTallyCard } from "@/components/dashboard/DashboardTallyCard";
import { User, Briefcase, FileText } from "lucide-react";

type Metrics = {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
};

export default function AdminOverview() {
  const { user, isLoading } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);

        // No dedicated `metrics` service exists in `apiService`.
        // Safely fetch totals from existing endpoints where possible.
        const [usersRes, jobsRes] = await Promise.all([
          apiService.users.getUsers().catch((e) => {
            console.error("users.getUsers failed", e);
            return null;
          }),
          apiService.jobs.getJobs().catch((e) => {
            console.error("jobs.getJobs failed", e);
            return null;
          }),
        ]);

        if (!mounted) return;

        const totalUsers =
          usersRes?.pagination?.total ?? usersRes?.users?.length ?? 0;
        const activeJobs =
          jobsRes?.pagination?.total ?? jobsRes?.jobs?.length ?? 0;

        // No system-wide applications endpoint in apiService; use placeholder 0 for now.
        const totalApplications = 0;

        setMetrics({
          totalUsers,
          activeJobs,
          totalApplications,
        });
      } catch (err) {
        console.error("Failed to load admin metrics", err);
        if (mounted) setError("Failed to load metrics");
      } finally {
        if (mounted) setLoadingMetrics(false);
      }
    };

    loadMetrics();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-slate-500 font-semibold animate-pulse">
          Loading dashboard session...
        </div>
      </div>
    );
  }

  // Only render dashboard content for admin users
  if (user?.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Overview"
        subtitle={
          <>Centralized system metrics and quick actions for administrators.</>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardTallyCard
          label="Total Registered Users"
          value={loadingMetrics ? "—" : (metrics?.totalUsers ?? 0)}
          icon={<User size={18} />}
          colorClass="text-slate-700 bg-slate-100"
          description="All user accounts in the system"
          delay={0}
        />

        <DashboardTallyCard
          label="Active Job Vacancies"
          value={loadingMetrics ? "—" : (metrics?.activeJobs ?? 0)}
          icon={<Briefcase size={18} />}
          colorClass="text-slate-700 bg-slate-100"
          description="Currently published job listings"
          delay={0.05}
        />

        <DashboardTallyCard
          label="Total System Applications"
          value={loadingMetrics ? "—" : (metrics?.totalApplications ?? 0)}
          icon={<FileText size={18} />}
          colorClass="text-slate-700 bg-slate-100"
          description="Applications submitted across listings"
          delay={0.1}
        />
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard/admin/users"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          Manage Users
        </Link>
        <Link
          href="/dashboard/admin/jobs"
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-100"
        >
          Job Audit
        </Link>
        {error && <div className="text-rose-500 text-sm ml-4">{error}</div>}
      </div>
    </div>
  );
}
