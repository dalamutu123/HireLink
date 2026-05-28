"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { Loader2, Pencil, Trash2, Users , Briefcase} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface Job {
  id: number;
  title: string;
  location: string;
  job_type: string;
  created_at: string;
}

const ManageJobsPage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await apiService.jobs.getJobs({
          employer_id: user?.id,
        });

        setJobs(response.jobs || []);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "employer") {
      fetchJobs();
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);

      await apiService.jobs.deleteJob(id);

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setDeletingId(null);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <DashboardHeader
          icon={<Briefcase className="w-8 h-8 text-blue-600" />}
          title="Manage Jobs"
          subtitle="Manage your posted jobs"
          action={
            <Link
              href="/dashboard/jobs/new"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              Post New Job
            </Link>
          }
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No jobs posted yet.
          </p>
        ) : (
          <div className="space-y-4">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-xl shadow-sm  flex justify-between items-center hover:border"
              >

                <div>
                  <h2 className="font-semibold text-lg">
                    {job.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {job.location} • {job.job_type}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <Link
                    href={`/dashboard/jobs/${job.id}/applicants`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium text-sm border border-green-200"
                  >
                    <Users size={16} />
                    Applicants
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition font-medium text-sm border border-red-200 disabled:text-red-300 disabled:bg-red-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === job.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ManageJobsPage;