"use client";

import { useState } from "react";
import { User, Shield, Bell, UploadCloud, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full min-h-[80vh]">
      <div className="mb-8 text-left max-w-2xl mt-2">
        <p className="text-2xl font-light text-slate-800 tracking-tight leading-snug">
          Fine-tune your experience and <span className="font-semibold text-emerald-600">stay in control</span>.
        </p>
        <p className="text-slate-500 mt-2 text-sm">
          Manage your account preferences, update your personal information, and configure your notification alerts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-2">
            {[
              { id: "profile", label: "Profile Information", icon: User },
              { id: "security", label: "Security & Passwords", icon: Shield },
              { id: "notifications", label: "Notification Alerts", icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all text-sm text-left ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-indigo-600" : "text-slate-400"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 bg-slate-50/50 rounded-2xl p-6 md:p-8 border border-slate-100">
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">Personal Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah Jenkins"
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    defaultValue="sarah@example.com"
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Professional Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Experienced UI/UX designer passionate about creating intuitive digital experiences."
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Resume / CV</h3>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="w-14 h-14 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF, DOCX, or RTF (max. 5MB)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">Security Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-semibold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { title: "Job Alerts", desc: "Receive emails for new jobs matching your profile." },
                  { title: "Application Updates", desc: "Get notified when an employer reviews your application." },
                  { title: "Marketing & Newsletter", desc: "Weekly updates, tips, and promotional content." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors active:scale-95">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
