"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiService, Application, Job } from "@/lib/api-service";
import { Loader2, Check, X, ChevronLeft, Users, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const JobApplicantsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const jobId = Number(id);
  const invalidJobId = !id || isNaN(jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "applied" | "accepted" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredApplications = useMemo(() => {
    const recentApps = [...applications]
      .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
      .slice(0, 15);

    return recentApps.filter((app) => {
      const statusMatches = filterStatus === "all" || app.status === filterStatus;
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
    const fetchData = async () => {
      try {
        setLoading(true);

        const [jobRes, appRes] = await Promise.all([
          apiService.jobs.getJob(jobId),
          apiService.applications.getJobApplications(jobId),
        ]);

        if (jobRes?.job) {
          setJob(jobRes.job);
        }

        setApplications(appRes.applications || []);
      } catch (error) {
        console.error("Failed to load applicants page:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!invalidJobId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [jobId, invalidJobId]);

  const updateStatus = async (
    applicationId: number,
    status: "accepted" | "rejected",
  ) => {
    try {
      setUpdatingId(applicationId);
      await apiService.applications.updateStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app,
        ),
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (invalidJobId || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Listing not found</h2>
          <p className="text-sm text-slate-500 mb-6">
            This job listing could not be loaded. It may have been removed or
            the URL is invalid.
          </p>
          <button
            onClick={() => router.push("/dashboard/jobs/manage")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
          >
            <ChevronLeft size={16} /> Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <DashboardHeader
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title={job.title}
          subtitle="Applicants"
          description="Review candidates for this listing and approve or decline each application."
          action={
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium hover:bg-slate-50 transition"
            >
              <ChevronLeft size={16} /> Back to My Listings
            </button>
          }

        />

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Recent applicants
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Latest candidates
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing the newest applicants for this listing.
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
                  onChange={(event) => setFilterStatus(event.target.value as "all" | "applied" | "accepted" | "rejected")}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
              Check back after candidates submit applications for this job.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No matching applicants
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try resetting the filters or searching with a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
              >
                <div 
                  className="flex flex-col sm:flex-row justify-between gap-4 cursor-pointer hover:bg-slate-50 transition p-2 -m-2 rounded-lg"
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
                      {app.jobseeker_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {app.jobseeker_name || "Unknown candidate"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {app.jobseeker_email || "No email provided"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400 mt-2">
                        Applied on{" "}
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <span
                      className={`inline-flex items-center rounded-lg h-10 px-3 py-1 text-xs font-semibold ${
                        app.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : app.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {app.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition">
                      {expandedId === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {expandedId === app.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    {app.cover_letter && (
                      <div className="mb-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900 mb-2">
                          Cover letter
                        </p>
                        <p>{app.cover_letter}</p>
                      </div>
                    )}

                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mb-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View resume
                      </a>
                    )}                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={updatingId === app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(app.id, "accepted");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                      >
                        <Check size={16} /> Approve
                      </button>

                      <button
                        disabled={updatingId === app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(app.id, "rejected");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicantsPage;
