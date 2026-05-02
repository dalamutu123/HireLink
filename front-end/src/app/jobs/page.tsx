"use client";

import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  days: string;
  description: string;
}

const FEATURED_JOBS: Job[] = [
  {
    id: 1,
    title: "Product Manager",
    company: "Facebook",
    location: "Vancouver",
    salary: "$10k-$15k",
    type: "On-site",
    logo: "👨‍💼",
    days: "4 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Google",
    location: "Silicon Valley",
    salary: "$150k",
    type: "Remote",
    logo: "🔍",
    days: "8 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "Twitter",
    location: "Vancouver",
    salary: "$8k-$8k",
    type: "Hybrid",
    logo: "🕊️",
    days: "12 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 4,
    title: "Business Analyst",
    company: "Stripe",
    location: "London",
    salary: "$10k",
    type: "Hybrid",
    logo: "💼",
    days: "4 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 5,
    title: "DevOps",
    company: "Microsoft",
    location: "Lagos",
    salary: "$1k-$1.5k",
    type: "Remote",
    logo: "⚙️",
    days: "13 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 6,
    title: "Visual Designer",
    company: "Twitter",
    location: "Vancouver",
    salary: "$10k-$15k",
    type: "Remote",
    logo: "🎨",
    days: "14 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
];

const COMPANIES = [
  { name: "Stripe", logo: "💳" },
  { name: "Facebook", logo: "👨‍💼" },
  { name: "Shopify", logo: "🛍️" },
  { name: "Microsoft", logo: "⚙️" },
  { name: "Google", logo: "🔍" },
];

const JobsPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = () => {
    console.log({ jobTitle, location, jobType });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-center sm:px-6 lg:px-8 lg:py-16">
        <span className="inline-block text-xs font-bold tracking-wide text-cyan-400 uppercase">
          OVER 2000+ JOBS LISTED
        </span>

        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mt-6 mb-4">
          Find your new Job in a Few Clicks
        </h1>

        <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          HireLink is a job search platform that helps employers and job seekers
          to find their perfect match in jobs and career.
        </p>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
            >
              <option value="" className="bg-gray-900">
                All Types
              </option>
              <option value="on-site" className="bg-gray-900">
                On-site
              </option>
              <option value="remote" className="bg-gray-900">
                Remote
              </option>
              <option value="hybrid" className="bg-gray-900">
                Hybrid
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Search
          </button>
        </div>

        {/* Trusted By Companies */}
        <div className="mb-16">
          <p className="text-gray-400 text-sm mb-4">
            Trusted by top tier companies
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {COMPANIES.map((company) => (
              <span key={company.name} className="text-4xl">
                {company.logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Offers Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured Offers</h2>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Explore the best job offers across several industries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_JOBS.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 border border-gray-600 rounded-lg p-6 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{job.logo}</span>
                  <span className="text-cyan-400 text-xs font-medium">
                    {job.days}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1">{job.title}</h3>

                <p className="text-gray-400 text-sm mb-3">
                  {job.company}, {job.location}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block bg-gray-700 text-white text-xs px-2 py-1 rounded">
                    {job.type}
                  </span>
                  <span className="inline-block border border-cyan-400 text-cyan-400 text-xs px-2 py-1 rounded">
                    {job.salary}
                  </span>
                </div>

                <p className="text-gray-400 text-sm">{job.description}</p>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
