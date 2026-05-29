"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  Calendar,
  FileText,
  Eye,
  AlertTriangle,
  Bell,
  Check,
  Trash2,
  Search,
  Inbox,
  XCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  ArrowUpRight
} from "lucide-react";
import { apiService, Job } from "@/lib/api-service";
import { useAuth } from "@/app/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface NotificationItem {
  id: number;
  user_id: number;
  type:
    | "interview"
    | "application"
    | "view"
    | "system"
    | "new_application"
    | "application_accepted"
    | "application_rejected";
  message: string;
  read: boolean;
  created_at: string;
}
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "interview":
        return {
          icon: Calendar,
          label: "Interview Scheduled",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-amber-500",
          pingClass: "bg-amber-400",
          labelClass: "text-amber-600",
          isPriority: true,
        };
      case "application_accepted":
        return {
          icon: CheckCircle2,
          label: "Application Accepted",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-emerald-500",
          pingClass: "bg-emerald-400",
          labelClass: "text-emerald-600",
          isPriority: true,
        };
      case "application":
      case "new_application":
        return {
          icon: FileText,
          label: "New Application",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-indigo-500",
          pingClass: "bg-indigo-400",
          labelClass: "text-indigo-600",
        };
      case "view":
        return {
          icon: Eye,
          label: "Profile View",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-violet-500",
          pingClass: "bg-violet-400",
          labelClass: "text-violet-600",
        };
      case "application_rejected":
        return {
          icon: XCircle,
          label: "Application Declined",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-rose-500",
          pingClass: "bg-rose-400",
          labelClass: "text-rose-600",
        };
      case "system":
      default:
        return {
          icon: AlertTriangle,
          label: "System Alert",
          bgClass: "bg-slate-100 border-slate-200 text-slate-700",
          dotClass: "bg-rose-500",
          pingClass: "bg-rose-400",
          labelClass: "text-rose-600",
          isPriority: type === "system",
        };
    }
  };

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read" | "priority">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);

  const loadNotifications = async (showRefreshedToast = false) => {
    setIsRefreshing(showRefreshedToast);
    try {
      const response = await apiService.notifications.getAllNotifications();
      if (response && response.notifications) {
        setNotifications(response.notifications);
      }

      // Fetch Applications and Jobs for Smart Recommendations (Jobseeker only)
      if (user?.role === "jobseeker") {
        const appRes = await apiService.applications.getMyApplications();
        const jobRes = await apiService.jobs.getJobs();
        if (jobRes && jobRes.jobs) {
          const seekerSkills = (user as any)?.skills?.toLowerCase() || "";
          const matches = jobRes.jobs.filter((job) => {
            const alreadyApplied = appRes?.applications?.some((a) => a.job_id === job.id);
            if (alreadyApplied) return false;

            const titleMatch = seekerSkills.includes(job.title.toLowerCase());
            const industryMatch = seekerSkills.includes(job.industry.toLowerCase());
            const descMatch = job.description.toLowerCase().split(" ").some((word: string) => seekerSkills.includes(word));
            return titleMatch || industryMatch || descMatch;
          });
          setRecommendedJobs(matches.length > 0 ? matches.slice(0, 2) : jobRes.jobs.slice(0, 2));
        }
      }
      
      if (showRefreshedToast) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Quick Apply to matches
  const handleQuickApply = async (jobId: number) => {
    try {
      const applyRes = await apiService.applications.apply(
        jobId,
        "I am applying quickly using my pre-configured HireLink developer profile. Please review my skills and experience detailed on my resume.",
      );
      if (applyRes && applyRes.application) {
        setRecommendedJobs((prev) => prev.filter((j) => j.id !== jobId));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Quick apply failed:", err);
    }
  };

  // Active counter metrics
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const readCount = useMemo(() => {
    return notifications.filter((n) => n.read).length;
  }, [notifications]);

  const priorityCount = useMemo(() => {
    return notifications.filter((n) => !!getTypeConfig(n.type).isPriority).length;
  }, [notifications]);

  // Tab, search, and date filters
  const filteredNotifications = useMemo(() => {
    const filtered = notifications.filter((n) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unread" && !n.read) ||
        (activeTab === "read" && n.read) ||
        (activeTab === "priority" && !!getTypeConfig(n.type).isPriority);

      const matchesSearch =
        searchTerm === "" ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.type.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (dateFilter !== "all") {
        const notifDate = new Date(n.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - notifDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "today") {
          matchesDate = diffDays <= 1;
        } else if (dateFilter === "week") {
          matchesDate = diffDays <= 7;
        } else if (dateFilter === "month") {
          matchesDate = diffDays <= 30;
        }
      }

      return matchesTab && matchesSearch && matchesDate;
    });

    // Sort: Unread Priority first, then by date descending
    return filtered.sort((a, b) => {
      const aConfig = getTypeConfig(a.type);
      const bConfig = getTypeConfig(b.type);
      
      const aIsUnreadPriority = !a.read && aConfig.isPriority;
      const bIsUnreadPriority = !b.read && bConfig.isPriority;
      
      if (aIsUnreadPriority && !bIsUnreadPriority) return -1;
      if (!aIsUnreadPriority && bIsUnreadPriority) return 1;
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [notifications, activeTab, searchTerm, dateFilter]);

  // Mark an individual alert as read
  const markAsRead = async (id: number) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) return;

    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    
    try {
      await apiService.notifications.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Revert if failed
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter((n) => !n.read);
    if (unreadNotifs.length === 0) return;

    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await Promise.all(unreadNotifs.map((n) => apiService.notifications.markAsRead(n.id)));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Re-fetch to sync state if partial failure
      loadNotifications();
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    if (confirm("Are you sure you want to clear all your notifications?")) {
      setNotifications([]);
    }
  };



  // Helper for human-readable relative time
  const getRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffTime = Math.abs(Date.now() - date.getTime());
      const diffMins = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      
      if (isNaN(diffMins)) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d ago`;
    } catch {
      return "2h ago";
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col">
      {/* Toast popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl border border-slate-800"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-bounce" />
            <span>Alerts are fully up to date!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with page title */}
      <DashboardHeader
        icon={<Bell className="text-indigo-600" size={28} />}
        title="Notifications"
        subtitle={
          <>
            Stay connected and <span className="font-semibold text-rose-600">never miss a beat</span>.
          </>
        }
        description="View your recent alerts, application updates, and matching recommendations."
        action={
          notifications.length > 0 && (
            <div className="flex items-center gap-3 self-start md:self-auto">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100/50 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 duration-200"
                >
                  <Check size={14} strokeWidth={2.5} />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-100/50 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 duration-200"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>
          )
        }
      />

      {/* Toolbar Filters Panel (only shown when there are alerts) */}
      {notifications.length > 0 && !isLoading && (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {(["all", "unread", "read", "priority"] as const).map((tab) => {
              const count = tab === "all" ? notifications.length : tab === "unread" ? unreadCount : tab === "read" ? readCount : priorityCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab === "all" ? "All Alerts" : tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab 
                      ? "bg-slate-800 text-white border border-slate-700" 
                      : "bg-slate-200/70 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Search, and Date */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap md:flex-nowrap">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-700 rounded-xl text-sm font-medium transition-all outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
            
            <div className="relative w-full md:w-56 shrink-0 mt-2 md:mt-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-900 rounded-xl text-sm font-medium transition-all outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Board area */}
      <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
        {/* Left Column: Notifications Feed */}
        <div className="lg:col-span-2 flex flex-col min-w-0">
        {isLoading ? (
          /* Loading skeletons */
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-pulse flex gap-4 items-center"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-12 shrink-0"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Premium Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <motion.div
              animate={isRefreshing ? {
                scale: [1, 0.95, 1.02, 1],
                rotate: [0, -1, 1, 0],
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-64 h-64 md:w-80 md:h-80 mb-6 shrink-0 drop-shadow-md"
            >
              <Image
                src="/illustrations/notifications/undraw_unread-messages_hdpw.svg"
                alt="No unread messages"
                fill
                className="object-contain transition-opacity duration-300"
                style={{ opacity: isRefreshing ? 0.6 : 1 }}
                priority
              />
              {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-indigo-100 shadow-lg">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                </div>
              )}
            </motion.div>

            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                No unread notifications
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm mb-8">
                You don't have any alerts at the moment. We will notify you here when employers respond to your applications or when new positions matching your profile are posted.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/jobs"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 font-bold text-white shadow-md shadow-indigo-100 transition-all hover:shadow-lg active:scale-95 duration-200"
              >
                Browse Job Listings
              </Link>
              <button
                onClick={() => loadNotifications(true)}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Notifications"}
              </button>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty filter state */
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Inbox size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No matching alerts found
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              We couldn't find any notifications matching "{searchTerm}" under your active category tab.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
                setDateFilter("all");
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Notifications feed */
          <div className="space-y-4">
            {filteredNotifications.map((notif) => {
              const config = getTypeConfig(notif.type);
              const IconComp = config.icon;
              const relativeTime = getRelativeTime(notif.created_at);

              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 flex gap-4 items-center group cursor-pointer relative ${
                    !notif.read ? "bg-indigo-50/10 border-indigo-100/50" : ""
                  }`}
                >
                  {/* Read dot indicator */}
                  {!notif.read && (
                    <span className="absolute top-3 left-2 flex h-2 w-2 z-10">
                      <span className={` absolute inline-flex h-full w-full rounded-full ${config.pingClass || "bg-indigo-400"} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass || "bg-indigo-500"}`}></span>
                    </span>
                  )}

                  {/* Left Icon with tailored colors */}
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    !notif.read ? "scale-105 transition-transform" : ""
                  } ${config.bgClass}`}>
                    <IconComp size={20} strokeWidth={2.2} />
                  </div>

                  {/* Middle Text Details */}
                  <div className="grow min-w-0 pl-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs uppercase tracking-wider font-extrabold ${config.labelClass || "text-indigo-500"}`}>
                        {config.label}
                      </span>
                      {config.isPriority && (
                        <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className={`text-slate-700 text-sm leading-relaxed ${
                      !notif.read ? "font-semibold text-slate-900" : "font-medium"
                    }`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Right relative timestamp */}
                  <div className="text-[10px] font-bold text-slate-400 shrink-0 text-right self-start pt-1.5">
                    {relativeTime}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}