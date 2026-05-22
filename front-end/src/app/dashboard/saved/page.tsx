"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";

export default function SavedJobsPage() {
  const savedJobs: any[] = []; // empty array for now to show the premium empty state

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      <div className="mb-8 text-left max-w-2xl mt-2">
        <p className="text-2xl font-light text-slate-800 tracking-tight leading-snug">
          Keep track of roles you love and <span className="font-semibold text-rose-600">never miss an opportunity</span>.
        </p>
        <p className="text-slate-500 mt-2 text-sm">
          Manage and review the positions you've bookmarked for future reference.
        </p>
      </div>
      {savedJobs.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
          <div className="relative w-64 h-64 mb-6">
            <Image
              src="/illustrations/empty/Empty-cuate.png"
              alt="No saved jobs"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            You haven't saved any jobs yet
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            You haven't bookmarked any positions yet. Explore the job board and
            save openings you'd like to revisit later.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-indigo-600 transition-colors active:scale-95"
          >
            Explore Jobs <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* We will map saved jobs to JobCard here once integrated */}
        </div>
      )}
    </div>
  );
}
