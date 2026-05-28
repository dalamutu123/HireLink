"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { Loader2, Check, X, Users, ChevronLeft } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface Application {
  id: number;
  job_id: number;
  jobseeker_name?: string;
  jobseeker_email?: string;
  resume_url?: string | null;
  cover_letter?: string | null;
  applied_at: string;
  status: string;
}

const ApplicantsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const jobId = Number(searchParams.get("jobId"));

  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "applied" | "accepted" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filteredApplications = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
      )
      .filter((app) => {
        const statusMatches =
          filterStatus === "all" || app.status === filterStatus;
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const searchMatches =
          normalizedQuery.length === 0 ||
          app.jobseeker_name?.toLowerCase().includes(normalizedQuery) ||
          app.jobseeker_email?.toLowerCase().includes(normalizedQuery) ||
          app.cover_letter?.toLowerCase().includes(normalizedQuery);

        return statusMatches && searchMatches;
      });
  }, [applications, filterStatus, searchQuery]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!jobId) return;

        setLoading(true);

        const response =
          await apiService.applications.getJobApplications(jobId);

        setApplications(response.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "employer") {
      fetchApplications();
    }
  }, [user, jobId]);

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    try {
      setUpdatingId(id);

      await apiService.applications.updateStatus(id, status);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "employer") return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Job Applications"
          subtitle="Manage all applications from candidates"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Recent applicants
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Latest candidates
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Showing the newest applicants.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    Search candidates
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search name or email"
                      className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    Filter status
                    <select
                      value={filterStatus}
                      onChange={(event) =>
                        setFilterStatus(
                          event.target.value as
                            | "all"
                            | "applied"
                            | "accepted"
                            | "rejected",
                        )
                      }
                      className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    >
                      <option value="all">All statuses</option>
                      <option value="applied">Applied</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No applicants yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Check back after candidates submit applications.
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No matching applicants
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try resetting the filters or searching with a different
                  keyword.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-5 rounded-xl shadow-sm border"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                          {app.jobseeker_name?.charAt(0) || "U"}
                        </div>

                        <div>
                          <h2 className="font-semibold">
                            {app.jobseeker_name || "Unknown User"}
                          </h2>

                          <p className="text-sm text-gray-500">
                            {app.jobseeker_email}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Applied: {app.applied_at}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {app.cover_letter && (
                      <p className="mt-3 text-sm text-gray-700">
                        {app.cover_letter}
                      </p>
                    )}

                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        className="text-blue-600 text-sm underline block mt-2"
                      >
                        View Resume
                      </a>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        disabled={updatingId === app.id}
                        onClick={() => updateStatus(app.id, "accepted")}
                        className="flex items-center gap-1 text-green-600 text-sm hover:underline"
                      >
                        <Check size={16} />
                        Accept
                      </button>

                      <button
                        disabled={updatingId === app.id}
                        onClick={() => updateStatus(app.id, "rejected")}
                        className="flex items-center gap-1 text-red-600 text-sm hover:underline"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;
