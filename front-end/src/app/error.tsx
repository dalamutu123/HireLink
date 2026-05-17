"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="p-4 bg-red-50 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 mb-4"
        >
          Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-slate-500 mb-10 leading-relaxed"
        >
          An unexpected error occurred. Don't worry, our team has been notified.
          In the meantime, you can try refreshing the page or head back home.
        </motion.p>

        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-slate-400 mb-8 font-mono"
          >
            Error ID: {error.digest}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
