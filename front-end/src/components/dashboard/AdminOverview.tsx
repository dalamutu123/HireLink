"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";

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
        // assumed api: apiService.metrics.getOverview()
        const resp = await (apiService as any).metrics.getOverview();
        if (!mounted) return;
        setMetrics({
          totalUsers: resp.totalUsers ?? 0,
          activeJobs: resp.activeJobs ?? 0,
          totalApplications: resp.totalApplications ?? 0,
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
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admin Overview</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Centralized system metrics and quick actions for administrators.
          </p>
        </div>
        <div className="hidden sm:block w-28 h-28 relative">
          <Image
            src="/illustrations/empty/Empty-cuate.png"
            alt="Admin overview illustration"
            width={112}
            height={112}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 font-semibold">
            Total Registered Users
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {loadingMetrics ? "—" : (metrics?.totalUsers ?? 0)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                All user accounts in the system
              </p>
            </div>
            <div className="w-14 h-14 relative">
              <Image
                src="/illustrations/auth/Login-amico.png"
                alt="users"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 font-semibold">
            Active Job Vacancies
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {loadingMetrics ? "—" : (metrics?.activeJobs ?? 0)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Currently published job listings
              </p>
            </div>
            <div className="w-14 h-14 relative">
              <Image
                src="/illustrations/empty/Empty-cuate.png"
                alt="jobs"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500 font-semibold">
            Total System Applications
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {loadingMetrics ? "—" : (metrics?.totalApplications ?? 0)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Applications submitted across listings
              </p>
            </div>
            <div className="w-14 h-14 relative">
              <Image
                src="/illustrations/empty/Empty-cuate.png"
                alt="applications"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
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
