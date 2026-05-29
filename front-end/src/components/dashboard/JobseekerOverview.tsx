"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTallyCard } from "@/components/dashboard/DashboardTallyCard";
import { apiService, Job, Application } from "@/lib/api-service";
import { formatSalary } from "@/lib/utils";

export interface ActivityLog {
  id: number;
  text: string;
  timestamp: string;
  type: string;
}
import {
  FileText,
  Calendar,
  Bookmark,
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  ChevronRight,
  XCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Mail,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationTracker from "./ApplicationTracker";

export default function JobseekerOverview() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({ total: 0, applied: 0, accepted: 0, rejected: 0, interview: 0 });
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWithdrawingId, setIsWithdrawingId] = useState<number | null>(null);

  // Load Dashboard Data
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const notifRes = await apiService.notifications.getAllNotifications();
        if (notifRes && notifRes.notifications) {
          const unread = notifRes.notifications.filter(
            (n: any) => !n.read,
          ).length;
          setUnreadCount(unread);
          
          // Map notifications to ActivityLog format
          const mappedLogs = notifRes.notifications.slice(0, 6).map((n: any) => ({
            id: n.id,
            text: n.message,
            timestamp: new Date(n.created_at).toLocaleString(),
            type: n.type || "system"
          }));
          setActivities(mappedLogs);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Fetch applications stats
        const statsRes = await apiService.applications.getStats();
        setStatsData(statsRes);

        // Fetch My Applications
        const appRes = await apiService.applications.getMyApplications();
        if (appRes && appRes.applications) {
          setApplications(appRes.applications);
        }

        // Fetch All Jobs to recommend smart matches
        const jobRes = await apiService.jobs.getJobs();
        if (jobRes && jobRes.jobs) {
          const unappliedJobs = jobRes.jobs.filter(
            (job) => !appRes.applications?.some((a) => a.job_id === job.id)
          );

          // Recommend jobs based on matching industry or skills
          const seekerSkills = (user as any)?.skills?.toLowerCase() || "";
          const matches = unappliedJobs.filter((job) => {
            const titleMatch = seekerSkills.includes(job.title.toLowerCase());
            const industryMatch = seekerSkills.includes(
              job.industry.toLowerCase(),
            );
            const descMatch = job.description
              .toLowerCase()
              .split(" ")
              .some((word) => seekerSkills.includes(word));
            return titleMatch || industryMatch || descMatch;
          });

          // Fallback to top 2 listings if no matches
          setRecommendedJobs(
            matches.length > 0 ? matches.slice(0, 2) : unappliedJobs.slice(0, 2),
          );
        }

        // Fetch Notifications and Activity Logs
        await fetchUnreadCount();
      } catch (err) {
        console.error("Failed to load seeker overview data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();

    window.addEventListener("notificationsUpdated", fetchUnreadCount);
    return () => {
      window.removeEventListener("notificationsUpdated", fetchUnreadCount);
    };
  }, [user]);

  // Withdraw from job application
  const handleWithdraw = async (appId: number) => {
    setIsWithdrawingId(appId);
    try {
      await apiService.applications.withdraw(appId);
      setApplications((prev) => prev.filter((app) => app.id !== appId));

      // Append a withdrawal log to activities
      const newLog: ActivityLog = {
        id: Date.now(),
        text: "You withdrew your application for a position.",
        timestamp: "Just now",
        type: "system",
      };
      setActivities((prev) => [newLog, ...prev].slice(0, 6));
    } catch (err) {
      console.error("Failed to withdraw application:", err);
    } finally {
      setIsWithdrawingId(null);
    }
  };

  // Quick Apply to matches
  const handleQuickApply = async (jobId: number) => {
    try {
      const applyRes = await apiService.applications.apply(
        jobId,
        "I am applying quickly using my pre-configured HireLink developer profile. Please review my skills and experience detailed on my resume.",
      );
      if (applyRes && applyRes.application) {
        setApplications((prev) => [applyRes.application, ...prev]);
        setRecommendedJobs((prev) => prev.filter((j) => j.id !== jobId));

        const newLog: ActivityLog = {
          id: Date.now(),
          text: `Quick-applied to: ${applyRes.application.job_title} at ${applyRes.application.employer_name}`,
          timestamp: "Just now",
          type: "application",
        };
        setActivities((prev) => [newLog, ...prev].slice(0, 6));
      }
    } catch (err) {
      console.error("Quick apply failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Derive Seeker Statistics
  const stats = [
    {
      label: "Applications Sent",
      value: statsData.total,
      icon: FileText,
      color: "text-slate-700 bg-slate-100",
      description: "Active submissions",
    },
    {
      label: "Interviews Booked",
      value: statsData.interview || 0,
      icon: Calendar,
      color: "text-slate-700 bg-slate-100",
      description: "Awaiting your chat",
    },
    {
      label: "Pending Review",
      value: statsData.applied,
      icon: Clock,
      color: "text-slate-700 bg-slate-100",
      description: "Under consideration",
    },
    {
      label: "Accepted",
      value: statsData.accepted,
      icon: CheckCircle2,
      color: "text-slate-700 bg-slate-100",
      description: "Approved by employers",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800 pb-16">
      {/* Welcome Greeting Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="space-y-2 z-10">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || "Job Seeker"}!
          </h1>
          <p className="text-slate-300 text-sm max-w-xl font-medium">
            Your profile looks amazing! Keep applying to achieve your career
            goals.
          </p>
        </div>
        <div className="z-10 relative group">
          <Link
            href="/dashboard/notifications"
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Bell size={24} className="text-indigo-100" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-slate-900"></span>
              </span>
            )}
          </Link>
          {unreadCount > 0 && (
            <div className="absolute top-full right-0 mt-3 whitespace-nowrap bg-white text-slate-800 border border-slate-100 shadow-xl text-xs font-bold py-2 px-3.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <DashboardTallyCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={<stat.icon size={20} />}
            colorClass={stat.color}
            description={stat.description}
            delay={idx * 0.05}
          />
        ))}
      </div>

      {/* Main Core Dashboard Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Column: Applications & Matches */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Application Timeline List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Active Applications
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Track your interview progress pipelines
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {applications.length} Active
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {applications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                >
                  <Briefcase size={36} className="text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">
                    No active applications found
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Use our custom jobs search directory to apply for frontend
                    listings!
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => {
                    return (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="p-5 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-colors bg-slate-50/30 space-y-4 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug truncate">
                              {app.job_title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-semibold">
                              <span className="flex items-center gap-1 text-slate-600">
                                <Building2 size={13} />
                                {app.employer_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {app.location}
                              </span>
                              {app.salary && (
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-md">
                                  <DollarSign size={13} />
                                  {formatSalary(app.salary)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="shrink-0 flex items-center gap-2">
                            {app.status === "accepted" && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 size={11} /> Interview
                              </span>
                            )}
                            {app.status === "rejected" && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                                <XCircle size={11} /> Declined
                              </span>
                            )}
                            {app.status === "applied" && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                                <Clock size={11} /> Applied
                              </span>
                            )}

                            <button
                              disabled={isWithdrawingId === app.id}
                              onClick={() => handleWithdraw(app.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Withdraw Application"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Timeline Graphic Steps */}
                        <ApplicationTracker status={app.status as any} />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Smart Vacancy Matches Recommendation Carousel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Recommended for You
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Custom fits matched directly to your skillsets
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedJobs.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-semibold">
                  All matches successfully applied for! Check back tomorrow.
                </div>
              ) : (
                recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-all bg-slate-50/10 flex flex-col justify-between hover:shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold tracking-widest text-indigo-600 uppercase">
                          {job.industry}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Building2 size={13} className="text-slate-400" />
                          {job.employer_name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-0.5">
                          <MapPin size={10} />
                          {job.location}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 uppercase">
                          {job.job_type}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                      <span className="text-xs font-bold text-emerald-600">
                        {formatSalary(job.salary)}
                      </span>
                      <button
                        onClick={() => handleQuickApply(job.id)}
                        className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-indigo-600 text-white text-[10px] font-black tracking-wider uppercase hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
                      >
                        Quick Apply
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side Column: Activity Timeline logs */}
        <div className="space-y-8">
          {/* Timeline Feed Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-50 pb-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Updates on your application statuses
              </p>
            </div>

            <div className="relative border-l-2 border-slate-100 pl-4 space-y-6 ml-2">
              <AnimatePresence>
                {activities.map((act) => {
                  let dotColor = "bg-slate-400 border-slate-200";
                  if (
                    act.type === "interview" ||
                    act.type === "application_accepted"
                  )
                    dotColor = "bg-emerald-500 border-emerald-100";
                  if (
                    act.type === "application" ||
                    act.type === "new_application"
                  )
                    dotColor = "bg-indigo-500 border-indigo-100";
                  if (act.type === "view")
                    dotColor = "bg-amber-500 border-amber-100";
                  if (
                    act.type === "application_rejected" ||
                    act.type === "system"
                  )
                    dotColor = "bg-rose-500 border-rose-100";

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="relative space-y-1"
                    >
                      {/* Timeline Dot Indicator */}
                      <div
                        className={`absolute -left-[25px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${dotColor}`}
                      />
                      <p className="text-xs font-semibold text-slate-700 leading-snug">
                        {act.text}
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        {act.timestamp}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Platform Help Card */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
            <h3 className="text-sm font-black tracking-wider uppercase text-indigo-400">
              Need Assistance?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Have any questions or encountered an issue? Drop our support team
              a direct email, and we will get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@hirelink.com?subject=HireLink%20Jobseeker%20Support%20Request"
              className="w-full flex items-center justify-between py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-bold transition-all text-white"
            >
              <span>Send Support Email</span>
              <Mail size={14} className="text-indigo-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
