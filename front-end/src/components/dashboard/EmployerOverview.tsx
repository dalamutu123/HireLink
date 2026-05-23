"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Bell, Plus, Loader2 } from "lucide-react";

import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";

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

  // AUTH PROTECTION
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  // LOAD DATA (FIXED - uses real API structure)
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadingDashboard(true);

        const [jobsResponse, applicationsResponse] = await Promise.all([
          apiService.jobs.getJobs(),
          apiService.applications.getMyApplications(),
        ]);

        const jobs = jobsResponse.jobs || [];
        const applications = applicationsResponse.applications || [];

        setStats({
          activeJobs: jobs.length,
          totalApplicants: applications.length,
          unreadNotifications: 0, // not available in current API
        });

        // take latest 5 applicants
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

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // BLOCK UNAUTHORIZED ACCESS
  if (!user || user.role !== "employer") {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || "Employer"}
          </p>
        </div>

        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Post a Job
        </Link>
      </div>

      {/* LOADING */}
      {loadingDashboard ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Briefcase className="text-blue-600" />
              <p className="text-gray-500 text-sm mt-4">
                Active Job Postings
              </p>
              <h2 className="text-3xl font-bold">
                {stats.activeJobs}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Users className="text-green-600" />
              <p className="text-gray-500 text-sm mt-4">
                Total Applicants
              </p>
              <h2 className="text-3xl font-bold">
                {stats.totalApplicants}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Bell className="text-yellow-600" />
              <p className="text-gray-500 text-sm mt-4">
                Unread Notifications
              </p>
              <h2 className="text-3xl font-bold">
                {stats.unreadNotifications}
              </h2>
            </div>
          </div>

          {/* RECENT APPLICANTS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Recent Applicants
              </h2>

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
              <div className="space-y-4">
                {recentApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex justify-between border p-4 rounded-xl hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">
                        {applicant.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {applicant.role}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
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