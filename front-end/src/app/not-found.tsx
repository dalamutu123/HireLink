"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="text-[12rem] font-black text-slate-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-slate-500 mb-10 leading-relaxed"
        >
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track to finding your dream job.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 pt-8 border-t border-slate-200 flex justify-center gap-8 text-sm text-slate-400 font-medium"
        >
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Browse Jobs</Link>
          <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          <Link href="/register" className="hover:text-blue-600 transition-colors">Register</Link>
        </motion.div>
      </div>
    </div>
  );
}
