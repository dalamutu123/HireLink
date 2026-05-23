"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function NotificationsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const notifications = [
    {
      title: "Application Viewed",
      message:
        "Google reviewed your Frontend Developer application.",
      time: "2 hours ago",
    },
    {
      title: "New Job Match",
      message:
        "12 new UI/UX Designer roles match your profile.",
      time: "5 hours ago",
    },
    {
      title: "Interview Invitation",
      message:
        "Meta invited you for a virtual interview next week.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-xl"
          >
            <CheckCircle2 className="h-5 w-5 animate-bounce" />
            <span>Notifications are fully up to date!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-10 max-w-4xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Notifications
        </h1>

        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          Stay connected and{" "}
          <span className="font-semibold text-indigo-600">
            never miss a beat
          </span>
          . View your recent alerts, application updates,
          and new job matches.
        </p>
      </motion.div>

      {/* Notifications Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="space-y-5">
          {notifications.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.message}
                  </p>
                </div>

                <span className="text-xs whitespace-nowrap text-slate-400">
                  {item.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-3.5 font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-indigo-600"
          >
            Browse Job Listings
          </Link>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-100"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />

            <span>
              {isRefreshing
                ? "Refreshing..."
                : "Refresh Notifications"}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}