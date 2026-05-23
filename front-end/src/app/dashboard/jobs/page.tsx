"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Briefcase, MapPin, Filter, X } from "lucide-react";
import JobCard from "@/components/JobCard";
import { apiService, Job } from "@/lib/api-service";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [locationTerm, setLocationTerm] = useState(initialLocation);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Job Listings
  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const response = await apiService.jobs.getJobs();
        if (response && response.jobs) {
          setJobs(response.jobs);
        }
      } catch (err) {
        console.error("Failed to retrieve listings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, []);

  useEffect(() => {
    setSearchTerm(initialSearch);
    setLocationTerm(initialLocation);
  }, [initialSearch, initialLocation]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    location: [] as string[],
    salaryRange: "",
    experienceLevel: [] as string[],
  });

  // Filter options
  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];
  const locations = ["Remote", "Hybrid", "On-site"];
  const salaryRanges = [
    "Under $50k",
    "$50k - $80k",
    "$80k - $120k",
    "$120k - $150k",
    "$150k+",
  ];
  const experienceLevels = ["Junior", "Mid-level", "Senior"];

  // Filtered jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term filter (title, employer_name, description, etc.)
      const companyName = job.employer_name || "";
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Location filter
      const matchesLocation =
        locationTerm === "" ||
        job.location.toLowerCase().includes(locationTerm.toLowerCase());

      // Job type filter
      const jobTypeProp = job.job_type || "full-time";
      const matchesJobType =
        filters.jobType.length === 0 ||
        filters.jobType.some(
          (t) => t.toLowerCase() === jobTypeProp.toLowerCase()
        );

      // Location type filter (Remote / Hybrid / On-site)
      const matchesLocationType =
        filters.location.length === 0 ||
        filters.location.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        );

      // Salary range filter
      const matchesSalary = (() => {
        if (!filters.salaryRange) return true;
        const sMin = job.salary_min || 0;
        
        switch (filters.salaryRange) {
          case "Under $50k":
            return sMin < 50000;
          case "$50k - $80k":
            return sMin >= 50000 && sMin <= 80000;
          case "$80k - $120k":
            return sMin >= 80000 && sMin <= 120000;
          case "$120k - $150k":
            return sMin >= 120000 && sMin <= 150000;
          case "$150k+":
            return sMin >= 150000;
          default:
            return true;
        }
      })();

      // Experience level filter (based on title keywords)
      const matchesExperience =
        filters.experienceLevel.length === 0 ||
        filters.experienceLevel.some((level) => {
          const title = job.title.toLowerCase();
          if (level === "Junior")
            return title.includes("junior") || title.includes("entry");
          if (level === "Mid-level")
            return title.includes("mid") || title.includes("intermediate");
          if (level === "Senior")
            return (
              title.includes("senior") ||
              title.includes("lead") ||
              title.includes("principal")
            );
          return false;
        });

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesLocationType &&
        matchesSalary &&
        matchesExperience
      );
    });
  }, [jobs, searchTerm, locationTerm, filters]);

  const handleFilterChange = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType as keyof typeof prev] as string[]), value]
        : (prev[filterType as keyof typeof prev] as string[]).filter(
            (item) => item !== value
          ),
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      location: [],
      salaryRange: "",
      experienceLevel: [],
    });
    setSearchTerm("");
    setLocationTerm("");
  };

  const activeFiltersCount =
    filters.jobType.length +
    filters.location.length +
    filters.experienceLevel.length +
    (filters.salaryRange ? 1 : 0);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse mt-2">
        <div className="h-16 bg-slate-200 rounded-xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-800 font-sans pb-16">
      
      {/* Title Segment */}
      <div className="mb-8 text-left max-w-2xl mt-2 space-y-2">
        <p className="text-2xl font-light text-slate-800 tracking-tight leading-snug">
          Discover opportunities that <span className="font-extrabold text-indigo-600">match your ambition</span>.
        </p>
        <p className="text-slate-500 text-sm">
          Browse thousands of tailored job postings and find the perfect role for your next career move.
        </p>
      </div>

      {/* Header Search Section */}
      <section className="pb-8 pt-2">
        
        {/* Search Input Box */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 border border-slate-100 p-3 rounded-lg w-full">
            <Briefcase size={18} className="text-slate-400" />
            <input
              placeholder="Job title or keyword"
              className="outline-none w-full text-sm text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-100 p-3 rounded-lg w-full">
            <MapPin size={18} className="text-slate-400" />
            <input
              placeholder="Location"
              className="outline-none w-full text-sm text-slate-800"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-lg flex items-center gap-2 text-sm font-semibold transition ${
                showFilters
                  ? "bg-slate-200 text-slate-800"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Filter size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button className="bg-slate-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-black hover:bg-slate-800 transition shadow-sm shrink-0">
              <Search size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Filters Toggleable Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
              >
                <X size={14} />
                Clear all
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Job Type */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Job Type</h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={(e) =>
                          handleFilterChange("jobType", type, e.target.checked)
                        }
                        className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Type */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Work Location</h4>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <label key={loc} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(loc)}
                        onChange={(e) =>
                          handleFilterChange("location", loc, e.target.checked)
                        }
                        className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Salary Range</h4>
                <div className="space-y-2">
                  {salaryRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryRange"
                        value={range}
                        checked={filters.salaryRange === range}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            salaryRange: e.target.value,
                          }))
                        }
                        className="border-slate-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevel.includes(level)}
                        onChange={(e) =>
                          handleFilterChange(
                            "experienceLevel",
                            level,
                            e.target.checked
                          )
                        }
                        className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Jobs Grid Section */}
      <section className="py-2">
        <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4">
          <h3 className="text-md font-black text-slate-800 tracking-tight">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Available
          </h3>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 space-y-4">
            <div className="relative w-64 h-48">
              <div className="absolute inset-0 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-slate-300">
                <Briefcase size={64} className="stroke-1" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                No matching jobs found
              </h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                We couldn't find any jobs matching your current search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black px-5 py-3 rounded-lg uppercase tracking-wider transition-colors active:scale-95 shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-sm font-semibold text-slate-400 animate-pulse">
            Loading Listings...
          </div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}

