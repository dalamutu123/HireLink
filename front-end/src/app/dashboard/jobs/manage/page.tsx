"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { Loader2, Pencil, Trash2, Users } from "lucide-react";

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Jobs</h1>

          <Link
            href="/dashboard/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post New Job
          </Link>
        </div>

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
                className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center"
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
                    className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                  >
                    <Users size={16} />
                    Applicants
                  </Link>

                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="flex items-center gap-1 text-sm text-red-600 hover:underline"
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