"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full space-y-10">
      <div className="mb-8 text-left max-w-2xl">
        <p className="text-2xl font-light text-slate-800 tracking-tight leading-snug">
          Track your applications and <span className="font-semibold text-indigo-600">accelerate your career</span>.
        </p>
        <p className="text-slate-500 mt-2 text-sm">
          Here is a summary of everything happening with your job search today.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
          <h3 className="text-indigo-600/80 font-medium text-sm">
            Applications Sent
          </h3>
          <p className="text-4xl font-bold mt-2 text-indigo-900">24</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-2xl border border-cyan-100/50 shadow-sm">
          <h3 className="text-cyan-700/80 font-medium text-sm">Interviews</h3>
          <p className="text-4xl font-bold mt-2 text-cyan-900">8</p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl border border-rose-100/50 shadow-sm">
          <h3 className="text-rose-600/80 font-medium text-sm">Saved Jobs</h3>
          <p className="text-4xl font-bold mt-2 text-rose-900">12</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800">
            Recent Job Listings
          </h2>

          <div className="space-y-4">
            {["Frontend Developer", "UI/UX Designer", "Product Manager"].map(
              (job, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{job}</h4>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      Remote • Full-time
                    </p>
                  </div>

                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors text-sm">
                    Apply
                  </button>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800">
            Application Progress
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <p className="font-bold text-slate-800">Google</p>
                <span className="text-sm font-medium text-indigo-600">
                  UI Designer
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full w-3/4"></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <p className="font-bold text-slate-800">Meta</p>
                <span className="text-sm font-medium text-cyan-600">
                  Frontend Engineer
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
