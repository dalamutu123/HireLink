"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatSalary } from "@/lib/utils";
import {
  Search,
  Briefcase,
  MapPin,
  ArrowRight,
  UserPlus,
  FileCheck,
  Building,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { Job } from "@/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const searchUrl = `/dashboard/jobs?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Linear",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      type: "Full-time • Remote",
      description:
        "We are looking for a Senior Product Designer to join our team. You will be responsible for designing new features and improving the overall user experience of our product.",
      tags: ["Figma", "UI/UX"],
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "Vercel",
      location: "Remote",
      salary: "$120k - $160k",
      type: "Full-time • Remote",
      description:
        "Join our frontend team to build the future of the web. You will work on core features of our platform and help improve our developer experience.",
      tags: ["React", "Next.js"],
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Stripe",
      location: "New York, NY",
      salary: "$130k - $170k",
      type: "Full-time • Hybrid",
      description:
        "We are looking for a Product Manager to lead our payments team. You will be responsible for defining the product roadmap and working closely with engineering.",
      tags: ["Payments", "Strategy"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-50 via-white to-cyan-50 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-200 h-200 bg-indigo-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-150 h-150 bg-cyan-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Find Work That <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500">
                Fits Your Life
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Discover the best remote, hybrid, and on-site opportunities
              tailored to your skills. Your next career move is just a search
              away.
            </p>

            {/* Glassmorphism Search Bar */}
            <div className="bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl flex-1 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <Briefcase size={20} className="text-slate-400" />
                <input
                  placeholder="Job title or keyword"
                  className="outline-none w-full bg-transparent placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl flex-1 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <MapPin size={20} className="text-slate-400" />
                <input
                  placeholder="Location"
                  className="outline-none w-full bg-transparent placeholder:text-slate-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Link
                href={searchUrl}
                className="bg-slate-900 hover:bg-indigo-600 transition-colors text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-medium shadow-md"
              >
                <Search size={18} />
                Search
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-100 lg:h-150 w-full"
          >
            <Image
              src="/Job hunt-cuate.png"
              alt="Job Hunt Illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How HireLink Works
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              A quick, three-step path to find, apply, and get hired.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-indigo-100 via-indigo-200 to-indigo-100 -translate-y-1/2 z-0" />

            {[
              {
                icon: UserPlus,
                title: "1. Create Account",
                desc: "Sign up and build your professional profile in minutes.",
              },
              {
                icon: Search,
                title: "2. Search Jobs",
                desc: "Browse thousands of opportunities that match your skills.",
              },
              {
                icon: FileCheck,
                title: "3. Apply & Get Hired",
                desc: "Submit applications with a single click and get hired.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-slate-500">
                Explore jobs across top industries.
              </p>
            </div>
            <Link
              href="/dashboard/jobs"
              className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              View all <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Design",
                image: "/Design team-rafiki.png",
                jobs: "120+ jobs",
              },
              {
                name: "Development",
                image: "/Software engineer-amico.png",
                jobs: "300+ jobs",
              },
              {
                name: "Marketing",
                image: "/Marketing consulting-pana.png",
                jobs: "85+ jobs",
              },
              {
                name: "Finance",
                image: "/Accountant-rafiki.png",
                jobs: "50+ jobs",
              },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer border border-slate-100 group"
              >
                <div className="w-32 h-32 relative mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                  {cat.jobs}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="lg:w-1/2 relative z-10 text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Why Choose HireLink?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-xl">
                We bridge the gap between world-class talent and innovative
                companies. Whether you are looking for your next big career leap
                or searching for the perfect candidate, HireLink provides a
                seamless, intuitive, and powerful platform to make it happen.
              </p>
              <ul className="space-y-4 mb-10 text-indigo-50">
                {[
                  "Verified companies and candidates",
                  "Advanced matching algorithms",
                  "Dedicated support every step of the way",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-cyan-400" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Learn More About Us <ArrowRight size={18} />
              </Link>
            </div>

            <div className="lg:w-1/2 relative z-10 w-full aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="/about-hero.png"
                alt="About HireLink"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Featured Jobs
              </h2>
              <p className="text-slate-500">
                Hand-picked opportunities from top employers.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id}>
                <JobCard
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={formatSalary(job.salary)}
                  type={job.type}
                  description={job.description}
                  tags={job.tags}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
