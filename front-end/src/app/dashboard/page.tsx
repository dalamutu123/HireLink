"use client";

import {
  Home,
  Briefcase,
  Bookmark,
  Settings,
  Bell,
  UserCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">HireLink</h2>

        <nav className="space-y-6">
          <a href="#" className="flex items-center gap-3">
            <Home size={18} />
            <span>Overview</span>
          </a>

          <a href="/jobs" className="flex items-center gap-3">
            <Briefcase size={18} />
            <span>Jobs</span>
          </a>

          <a href="#" className="flex items-center gap-3">
            <Bookmark size={18} />
            <span>Saved</span>
          </a>

          <a href="#" className="flex items-center gap-3">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">Track jobs and applications</p>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="cursor-pointer" />
            <UserCircle size={32} className="cursor-pointer" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Applications Sent</h3>
            <p className="text-3xl font-bold mt-2">24</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Interviews</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Saved Jobs</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
        </div>

        <section className="bg-white p-6 rounded-2xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            Recent Job Listings
          </h2>

          <div className="space-y-4">
            {["Frontend Developer", "UI/UX Designer", "Product Manager"].map(
              (job, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <h4 className="font-semibold">{job}</h4>
                    <p className="text-sm text-gray-500">
                      Remote • Full-time
                    </p>
                  </div>

                  <button className="bg-black text-white px-4 py-2 rounded-xl">
                    Apply
                  </button>
                </div>
              )
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-6">
            Application Progress
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2">Google - UI Designer</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-black h-3 rounded-full w-3/4"></div>
              </div>
            </div>

            <div>
              <p className="mb-2">Meta - Frontend Engineer</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-black h-3 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}