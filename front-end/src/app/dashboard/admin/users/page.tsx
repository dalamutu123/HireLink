"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService, User } from "@/lib/api-service";

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!user || user.role !== "admin") {
        setLoadingUsers(false);
        return;
      }

      try {
        setLoadingUsers(true);
        const response = await apiService.users.getUsers();
        setUsers(response.users ?? []);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Unable to load user list.");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [user]);

  const handleDelete = async (userId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingUserId(userId);
    try {
      await apiService.users.deleteUser(userId);
      setUsers((current) => current.filter((item) => item.id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
      setError("Unable to delete user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (isLoading || loadingUsers) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500 font-semibold animate-pulse">
          Loading admin user management...
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-xl text-center rounded-3xl border border-rose-100 bg-rose-50/70 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-rose-700">Access Denied</h1>
          <p className="mt-3 text-sm text-rose-600">
            You do not have permission to view the admin user management page.
          </p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <Image
            src="/illustrations/empty/Empty-cuate.png"
            alt="No users available"
            width={320}
            height={240}
            className="mx-auto"
          />
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            No users found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The system does not contain any registered users yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage registered users, review roles, and maintain the system
              directory.
            </p>
          </div>
        </div>
      </div>

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
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((item) => {
              const isSelf = user?.id === item.id;
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        item.role === "admin"
                          ? "bg-rose-100 text-rose-700"
                          : item.role === "employer"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.role === "jobseeker"
                        ? "Job Seeker"
                        : item.role === "employer"
                          ? "Employer"
                          : "Administrator"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      disabled={isSelf || deletingUserId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                        isSelf
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-rose-600 text-white hover:bg-rose-700"
                      } ${deletingUserId === item.id ? "opacity-70" : ""}`}
                    >
                      {isSelf
                        ? "Cannot delete self"
                        : deletingUserId === item.id
                          ? "Deleting..."
                          : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
