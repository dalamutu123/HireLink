"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { useAuth } from "@/app/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // update the form states
  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await apiService.auth.login({
        email: form.email,
        password: form.password,
      });

      // Login using the context
      login(res.token, res.user);
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mt-12 lg:mt-0"
        >
          <div className="flex flex-col mb-10">
            <Link
              href="/"
              className="text-3xl font-black tracking-tight text-slate-900 mb-8 inline-block hover:text-indigo-600 transition-colors"
            >
              HireLink
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2.5 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500">
              Sign in to access your dashboard, applications, and saved jobs.
            </p>
          </div>

          {/* Styled Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-indigo-600 transition-all active:scale-[0.99] shadow-md mt-4 flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 font-medium">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Illustration with corrected styling */}
      <div className="hidden lg:flex w-1/2 bg-indigo-50/50 items-center justify-center p-12 relative overflow-hidden">
        {/* Visible blur blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/35 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full max-w-lg aspect-square z-10"
        >
          <Image
            src="/illustrations/auth/Login-amico.png"
            alt="Authentication Security"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}

