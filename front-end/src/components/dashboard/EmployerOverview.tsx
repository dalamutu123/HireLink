"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Bell, Plus, Loader2, LayoutPanelLeft } from "lucide-react";
import { DashboardTallyCard } from "./DashboardTallyCard";

import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardStats {
  activeJobs: number;
  totalApplicants: number;
  unreadNotifications: number;
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  appliedAt: string;
}

const EmployerOverview: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalApplicants: 0,
    unreadNotifications: 0,
  });

  const [recentApplicants, setRecentApplicants] = useState<Applicant[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadingDashboard(true);

        // Fetch dashboard stats
        const employerStats = await apiService.jobs.getEmployerStats();
        setStats({
          activeJobs: employerStats.activeJobs || 0,
          totalApplicants: employerStats.totalApplicants || 0,
          unreadNotifications: employerStats.unreadNotifications || 0,
        });

        // Fetch Recent Jobs/Applications
        const applicationsResponse = await apiService.applications.getEmployerApplications();
        const applications = applicationsResponse.applications || [];

        const formattedApplicants: Applicant[] = applications
          .slice(0, 5)
          .map((app: any) => ({
            id: String(app.id),
            name: app.jobseeker_name || "Applicant",
            role: app.job_title || "Job Application",
            appliedAt: app.applied_at || "Recently",
          }));

        setRecentApplicants(formattedApplicants);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (user?.role === "employer") {
      loadDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <DashboardHeader icon={<LayoutPanelLeft/>} title="Employer Dashboard" subtitle={`Welcome back, ${user?.name || "Employer"}`} />
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Post a Job
        </Link>
      </div>

      {loadingDashboard ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <DashboardTallyCard label="Job Postings" value={stats.activeJobs} icon={<Briefcase/>} description="All active job postings"/>

            <DashboardTallyCard label="Total Applicants" value={stats.totalApplicants} icon={<Users/>} description="Total number of candidates"/>

            <DashboardTallyCard label="Unread Notifications" value={stats.unreadNotifications} icon={<Bell/>} description="New alerts and application updates awaiting review"/>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Applicants</h2>

              <Link
                href="/dashboard/applicants"
                className="text-blue-600 text-sm"
              >
                View All
              </Link>
            </div>

            {recentApplicants.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No recent applicants yet.
              </p>
            ) : (
<div className="space-y-3">
  {recentApplicants.map((applicant) => (
    <div
      key={applicant.id}
      className="
        flex items-center justify-between
        rounded-2xl
        border border-gray-100
        bg-white
        px-5 py-4
        shadow-sm
        transition-all duration-200
        hover:border-gray-200
        hover:shadow-md
      "
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {applicant.name}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {applicant.role}
        </p>
      </div>

      <p className="text-xs font-medium text-gray-400">
        {applicant.appliedAt}
      </p>
    </div>
  ))}
</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployerOverview;
