"use client";

import Link from "next/link";
import { Search, Briefcase, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-gray-800">
        <nav className="flex justify-between items-center px-8 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <h1 className="text-2xl font-bold tracking-tight">HireLink</h1>
          </Link>

          <div className="space-x-6 hidden md:flex">
            <Link href="/jobs">Jobs</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/about">About</Link>
          </div>

          <button className="bg-black text-white px-4 py-2 rounded-xl">
            <Link href="/register">Sign Up</Link>
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
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 rounded-3xl h-[300px] mt-10 flex items-center justify-center"
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
        <h3 className="text-2xl font-semibold mb-6">Featured Jobs</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((job) => (
            <div key={job} className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-semibold">Frontend Developer</h4>

              <p className="text-gray-500 text-sm">Remote • Full-time</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to Start Your Career Journey?
        </h3>
        <button className="bg-black text-white px-8 py-3 rounded-xl">
          Get Started
        </button>
      </section>
    </>
  );
}
