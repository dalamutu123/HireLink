"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService, Job } from "@/lib/api-service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function AdminJobsPage() {
  const { user, isLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      if (!user || user.role !== "admin") {
        setLoadingJobs(false);
        return;
      }

      try {
        setLoadingJobs(true);
        const response = await apiService.jobs.getJobs();
        setJobs(response.jobs ?? []);
      } catch (err) {
        console.error("Failed to load jobs", err);
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, [user]);

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm(
      "Delete this job listing? This action cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      await apiService.jobs.deleteJob(jobId);
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Failed to delete job", err);
      setError("Unable to delete job. Please try again.");
    } finally {
      setDeletingJobId(null);
    }
  };

  if (isLoading || loadingJobs) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500 font-semibold animate-pulse">
          Loading admin job management...
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-xl rounded-3xl border border-rose-100 bg-rose-50/70 p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-rose-700">Access Denied</h1>
          <p className="mt-3 text-sm text-rose-600">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const hasJobs = jobs && jobs.length > 0;

  if (!hasJobs) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          title="Job Management"
          subtitle={
            <>
              Manage published jobs, review listings, and remove outdated
              postings.
            </>
          }
        />

        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md">
            <Image
              src="/illustrations/empty/Empty-cuate.png"
              alt="No jobs found"
              width={320}
              height={240}
              className="mx-auto"
            />
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              No jobs found.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no job postings in the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Job Management"
        subtitle={
          <>
            Manage published jobs, review listings, and remove outdated
            postings.
          </>
        }
      />

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Job title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date posted
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {job.employer_name ?? "Unknown company"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(job.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingJobId === job.id}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      deletingJobId === job.id
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : "bg-rose-600 text-white hover:bg-rose-700"
                    }`}
                  >
                    {deletingJobId === job.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
