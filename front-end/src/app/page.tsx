"use client";

import { Search, Briefcase, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-gray-800">
      <nav className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight">HireLink</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#">Jobs</a>
          <a href="#">Companies</a>
          <a href="#">About</a>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-xl">
          Sign In
        </button>
      </nav>

      <section className="px-8 py-16">
        <h2 className="text-4xl font-bold mb-4">
          Find Work That Fits Your Life
        </h2>
        <p className="text-gray-500 mb-6">
          Discover remote, hybrid, and on-site opportunities.
        </p>
      </section>

      <div className="px-8">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 border p-2 rounded-xl w-full">
            <Briefcase size={18} />
            <input placeholder="Job title" className="outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded-xl w-full">
            <MapPin size={18} />
            <input placeholder="Location" className="outline-none w-full" />
          </div>

          <button className="bg-black text-white px-6 py-2 rounded-xl flex items-center gap-2">
            <Search size={18} /> Search
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-3xl h-[300px] mt-10 flex items-center justify-center">
        Illustration
      </div>
    </div>
  );
}