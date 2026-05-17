"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Briefcase, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Job } from "@/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const searchUrl = `/jobs?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;

  const jobs: Partial<Job>[] = [
    {
      id: 1,
      title: "Frontend Developer",
      type: "Remote • Full-time",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      type: "Hybrid • Part-time",
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      type: "Remote • Full-time",
    },
    {
      id: 4,
      title: "Financial Analyst",
      type: "Onsite • Full-time",
    },
    {
      id: 5,
      title: "Restaurant Supervisor",
      type: "Hybrid • Part-time",
    },
    {
      id: 6,
      title: "Hotel Receptionist",
      type: "Onsite • Full-time",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-white text-gray-800">
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
              <input
                placeholder="Job title"
                className="outline-none w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 border p-2 rounded-xl w-full">
              <MapPin size={18} />
              <input
                placeholder="Location"
                className="outline-none w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Link
              href={searchUrl}
              className="bg-black text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Search
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 rounded-3xl h-[75] mt-10 flex items-center justify-center"
        >
          Illustration
        </motion.div>

        <section className="px-8 py-12">
          <h3 className="text-2xl font-semibold mb-6">Popular Categories</h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Design", "Development", "Marketing", "Finance"].map((cat, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow">
                <h4 className="font-semibold">{cat}</h4>
                <p className="text-sm text-gray-500">120+ jobs</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="px-8 py-12 bg-gray-50">
        <h3 className="text-black text-2xl font-semibold mb-6">
          Featured Jobs
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="text-black bg-white p-6 rounded-2xl shadow"
            >
              <h4 className="font-semibold">{job.title}</h4>

              <p className="text-gray-500 text-sm">{job.type}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
