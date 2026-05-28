"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bookmark, 
  ArrowRight, 
  Search, 
  Trash2, 
  Sparkles 
} from "lucide-react";
import JobCard from "@/components/JobCard";
import { apiService, Job } from "@/lib/api-service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "full-time" | "part-time" | "contract">("all");

  // Load saved IDs and Job details
  const loadSavedData = async () => {
    if (typeof window === "undefined") return;

    try {
      // Fetch bookmarked job IDs from backend (with automatic localStorage fallback)
      const ids = await apiService.bookmarks.getBookmarkedJobIds();
      setSavedIds(ids);

      if (ids.length > 0) {
        const response = await apiService.jobs.getJobs();
        if (response && response.jobs) {
          // Filter jobs that are saved
          const filtered = response.jobs.filter((job) =>
            ids.map(Number).includes(Number(job.id))
          );
          setJobs(filtered);
        }
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Failed to load saved positions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedData();

    // Listen for bookmark toggle events from cards
    const handleSavedChanged = () => {
      loadSavedData();
    };

    window.addEventListener("saved_jobs_changed", handleSavedChanged);
    return () => {
      window.removeEventListener("saved_jobs_changed", handleSavedChanged);
    };
  }, []);

  // Clear all saved bookmarks
  const clearAllBookmarks = async () => {
    if (typeof window === "undefined") return;
    if (confirm("Are you sure you want to clear all your saved jobs?")) {
      try {
        // Parallel unsave requests to clear on backend
        await Promise.all(
          savedIds.map((id) => apiService.bookmarks.unsaveJob(Number(id)))
        );
        
        // Update UI
        setSavedIds([]);
        setJobs([]);
        window.dispatchEvent(new Event("saved_jobs_changed"));
      } catch (err) {
        console.error("Failed to clear bookmarks on backend:", err);
      }
    }
  };

  // Filter bookmarked jobs by search criteria and job type tabs
  const filteredSavedJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.employer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (job.job_type || "full-time").toLowerCase() === activeTab.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [jobs, searchTerm, activeTab]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      {/* Header */}
      <DashboardHeader
        icon={<Bookmark className="text-indigo-600" size={28} fill="currentColor" />}
        title="Saved Positions"
        subtitle={
          <>
            Keep track of roles you love and <span className="font-semibold text-rose-600">never miss an opportunity</span>.
          </>
        }
        description="Manage and review the positions you've bookmarked for future reference."
        action={
          savedIds.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 active:scale-95 duration-200"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )
        }
      />

      {/* Toolbar & Filters (Only when there are saved positions) */}
      {savedIds.length > 0 && !isLoading && (
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {(["all", "full-time", "part-time", "contract"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab === "all" ? "All Jobs" : tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search saved positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-900 rounded-xl text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Grid area */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-1/2 mt-2"></div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                <div className="h-5 bg-slate-100 rounded w-1/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : savedIds.length === 0 ? (
        /* Premium Empty State */
        <div className="flex-grow flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
          <div className="relative w-64 h-64 mb-6 drop-shadow-sm">
            <Image
              src="/illustrations/empty/Empty-cuate.png"
              alt="No saved jobs"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Your Bookmarks Board is Empty
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            You haven't bookmarked any jobs yet. When you browse listings and find jobs that match your skills, tap the bookmark icon to save them here.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3.5 rounded-xl font-bold transition-all hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] active:scale-95"
          >
            Explore Listings <ArrowRight size={18} />
          </Link>
        </div>
      ) : filteredSavedJobs.length === 0 ? (
        /* Empty Search/Filter State */
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            No matching saved positions found
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            We couldn't find any bookmarked jobs matching "{searchTerm}" {activeTab !== "all" && `with type "${activeTab}"`}. Try refining your filters or search terms.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Grid of Jobs */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSavedJobs.map((job) => (
            <div key={job.id} className="transition-all duration-300">
              <JobCard {...job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
