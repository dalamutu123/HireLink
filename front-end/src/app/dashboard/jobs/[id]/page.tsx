"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService, Job, Application } from "@/lib/api-service";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  Bookmark,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link as LinkIcon, Twitter, Linkedin, Copy } from "lucide-react";
import { formatSalary } from "@/lib/utils";
import ApplicationTracker from "@/components/dashboard/ApplicationTracker";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { user } = useAuth();

  // Guard against non-numeric parameters (like "manage" or "new") mapping into the dynamic [id] route, trigger true 404
  if (id && isNaN(Number(id))) {
    notFound();
  }

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load Job details and Candidacy Status
  useEffect(() => {
    if (!id) return;
    
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch Job Details
        const jobRes = await apiService.jobs.getJob(Number(id));
        if (jobRes && jobRes.job) {
          setJob(jobRes.job);
        }

        // Fetch User Applications and Saved Status (jobseeker only)
        if (user?.role === "jobseeker") {
          const appRes = await apiService.applications.getMyApplications();
          if (appRes && appRes.applications) {
            setApplications(appRes.applications);
          }

          // Fetch Bookmarked status from backend
          const savedIds = await apiService.bookmarks.getBookmarkedJobIds();
          setIsSaved(savedIds.map(Number).includes(Number(id)));
        }
      } catch (err) {
        console.error("Failed to load details payload:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [id, user]);

  // Check if seeker already applied to this specific job
  const existingApplication = useMemo(() => {
    return applications.find((a) => Number(a.job_id) === Number(id));
  }, [applications, id]);

  function useMemo(fn: () => Application | undefined, deps: any[]) {
    return React.useMemo(fn, deps);
  }

  // Handle Cover Letter Application Submit
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const applyRes = await apiService.applications.apply(Number(id), coverLetter);
      if (applyRes && applyRes.application) {
        setApplications((prev) => [applyRes.application, ...prev]);
        setCoverLetter("");
      }
    } catch (err) {
      console.error("Application submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Job Bookmark
  const toggleSave = async () => {
    if (!id) return;
    const jobId = Number(id);
    const wasSaved = isSaved;
    
    setIsSaved(!wasSaved);
    try {
      if (wasSaved) {
        await apiService.bookmarks.unsaveJob(jobId);
      } else {
        await apiService.bookmarks.saveJob(jobId);
      }
      window.dispatchEvent(new Event("saved_jobs_changed"));
    } catch (err) {
      setIsSaved(wasSaved);
      console.error("Failed to toggle save status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse mt-4 max-w-5xl mx-auto">
        <div className="h-10 w-24 bg-slate-200 rounded-lg" />
        <div className="h-44 bg-slate-200 rounded-xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
        <AlertCircle size={48} className="text-rose-500" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">Listing not found</h2>
          <p className="text-slate-500 text-sm mt-1">This job listing may have been filled, deleted, or you might have incorrect credentials.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/jobs")}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase hover:bg-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  // Formatting dates
  const deadlineDate = job.deadline ? new Date(job.deadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : "Open / Rolling";

  const companyName = job.employer_name || "Enterprise Partner";

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans text-slate-800 pb-16">
      
      {/* Back Button & Action Controls */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => router.push("/dashboard/jobs")}
          className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-white border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all shadow-sm group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Search
        </button>

        <button
          onClick={toggleSave}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg border text-xs font-bold transition-all shadow-sm bg-white ${
            isSaved
              ? "border-indigo-100 text-indigo-600 hover:bg-indigo-50/20"
              : "border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
          }`}
        >
          <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved Position" : "Save Vacancy"}
        </button>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white p-6 lg:p-8 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center min-w-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-extrabold text-slate-700 border border-slate-200/50 shrink-0 select-none">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {job.industry}
              </span>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug truncate">
                {job.title}
              </h1>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                <Building2 size={15} className="text-slate-400" />
                {companyName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Column: Description & Cover Letter */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Job Description Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-md font-black text-slate-900 tracking-tight uppercase border-b border-slate-50 pb-3">
              Description & Requirements
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line font-medium">
              {job.description}
            </div>
          </div>

          {/* Candidacy Action Center (Form or Timeline status) */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-md font-black text-slate-900 tracking-tight uppercase border-b border-slate-50 pb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-500" />
              Candidacy Status
            </h2>

            {existingApplication ? (
              <div className="space-y-6">
                
                {/* Application alert banner */}
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                  <CheckCircle2 className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Application Submitted</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      You applied for this vacancy on {new Date(existingApplication.applied_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}.
                    </p>
                  </div>
                </div>

                {/* Candidate review progress timeline */}
                <ApplicationTracker status={existingApplication.status as any} className="px-2" />

                {/* Dynamic Status message details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-500 leading-relaxed">
                  {existingApplication.status === "accepted" && (
                    <span className="text-emerald-700 font-bold block">
                      🎉 Congratulations! {companyName} has officially accepted your application. You have been selected for the role!
                    </span>
                  )}
                  {existingApplication.status === "interview" && (
                    <span className="text-indigo-700 font-bold block">
                      🗓️ Good news! {companyName} wants to interview you. Your interview is scheduled for {existingApplication.interview_date ? new Date(existingApplication.interview_date).toLocaleString() : "a future date"}. Keep an eye on your email inbox for meeting links!
                    </span>
                  )}
                  {existingApplication.status === "rejected" && (
                    <span className="text-rose-700 font-bold block">
                      Thank you for applying. {companyName} decided not to proceed with your application at this time. Keep exploring matches!
                    </span>
                  )}
                  {existingApplication.status === "applied" && (
                    <span>
                      Your application has been received and is currently under review by the {companyName} Talent Acquisition team. We will notify you here as soon as there is an update.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              
              // Apply Form
              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Draft Cover Letter (Optional)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Briefly pitch why you are the perfect match for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-4 border border-slate-100 rounded-lg outline-none text-slate-800 text-sm font-medium focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 transition-all bg-slate-50/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side Column: Job Metadata Sidebar Card */}
        <div className="space-y-8">
          
          {/* Metadata Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
              Position Details
            </h2>

            <div className="space-y-5">
              
              {/* Salary */}
              <div className="flex gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <DollarSign size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                    Salary Range
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {formatSalary(job.salary)}
                  </p>
                </div>
              </div>

              {/* Location Type */}
              <div className="flex gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                    Location Type
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                    {job.location}
                  </span>
                </div>
              </div>

              {/* Contract Type */}
              <div className="flex gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                    Job Category
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block uppercase tracking-wide">
                    {job.job_type || "Full-time"}
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                    Application Deadline
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                    {deadlineDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Highlights Badge */}
          <div className="p-6 bg-slate-900 rounded-xl text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">About {companyName}</h3>
            <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
              <strong className="text-white">{companyName}</strong> is actively recruiting for the <strong className="text-white">{job.title}</strong> position in the {job.industry} sector. Submit your application before the deadline to be considered for this opportunity!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
