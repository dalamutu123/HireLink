import React from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { Search, Briefcase, Users, Globe, ShieldCheck } from "lucide-react";

export default function about() {
  return (
    <div className="bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 mt-25">
        <div className="grid md:grid-cols-2 gap-10 items-center bg-white border border-gray-200 rounded-[30px] p-10">
          {/* Left Side */}
          <div>
            <span className="bg-[#F3EEE8] text-gray-800 px-4 py-2 rounded-full text-sm">
              Our story
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mt-6 text-gray-900">
              We connect talented people
              <br /> with meaningful opportunities
            </h1>

            <p className="text-gray-600 text-lg leading-8 mt-6 max-w-xl">
              At HireLink we help you discover remote, hybrid, and on-site roles
              at companies that value thoughtful hiring. We focus on making job
              search straightforward, fair, and — most importantly — human.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mt-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#F7F4EF] p-4 rounded-2xl">
                  <Briefcase className="h-6 w-6 text-black" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800">1000+</h3>
                  <p className="text-gray-500">Job Opportunities</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#F7F4EF] p-4 rounded-2xl">
                  <Users className="h-6 w-6 text-black" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800">200+</h3>
                  <p className="text-gray-500">Trusted Companies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <Users className="h-75 w-75 text-black" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 pb-12">
        <div className="bg-white border border-gray-200 rounded-[30px] p-10">
          <h2 className="text-4xl font-bold mb-10 text-gray-800">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div>
              <div className="bg-[#F7F4EF] w-fit p-4 rounded-2xl">
                <Search className="h-6 w-6 text-black" />
              </div>

              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                Smart Job Search
              </h3>

              <p className="text-gray-500 leading-7 mt-2">
                Find jobs that match your skills, experience, and preferred work
                style.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="bg-[#F7F4EF] w-fit p-4 rounded-2xl">
                <Users className="h-6 w-6 text-black" />
              </div>

              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                Top Companies
              </h3>

              <p className="text-gray-500 leading-7 mt-2">
                Explore opportunities from verified and trusted companies
                worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="bg-[#F7F4EF] w-fit p-4 rounded-2xl">
                <Globe className="h-6 w-6 text-black" />
              </div>

              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                Flexible Options
              </h3>

              <p className="text-gray-500 leading-7 mt-2">
                Discover remote, hybrid, and on-site roles that fit your
                lifestyle.
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <div className="bg-[#F7F4EF] w-fit p-4 rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-black" />
              </div>

              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                Safe & Reliable
              </h3>

              <p className="text-gray-500 leading-7 mt-2">
                We ensure a secure and reliable experience for all job seekers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
