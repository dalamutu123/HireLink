"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Briefcase, MapPin, Filter, X } from "lucide-react";
import JobCard from "@/components/JobCard";

// Sample job data - replace with actual API call
const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "Remote",
    type: "Full-time" as const,
    salary: "$120k - $150k",
    description:
      "We're looking for an experienced frontend developer to lead our React migration project. Must have 5+ years experience.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "New York, NY",
    type: "Full-time" as const,
    salary: "$90k - $120k",
    description:
      "Join our design team to create beautiful and intuitive user interfaces for web and mobile applications.",
    tags: ["Figma", "UI/UX", "Prototyping"],
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "DataStream Systems",
    location: "San Francisco, CA",
    type: "Full-time" as const,
    salary: "$130k - $160k",
    description:
      "Build scalable backend systems with Node.js and PostgreSQL. Experience with microservices required.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "4",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Hybrid",
    type: "Full-time" as const,
    salary: "$100k - $140k",
    description:
      "Lead product strategy and development for our SaaS platform serving enterprise customers.",
    tags: ["Product Strategy", "Agile", "Analytics"],
  },
  {
    id: "5",
    title: "Marketing Manager",
    company: "BrandMax",
    location: "Chicago, IL",
    type: "Full-time" as const,
    salary: "$85k - $110k",
    description:
      "Develop and execute marketing campaigns for B2B SaaS products targeting enterprise clients.",
    tags: ["Digital Marketing", "SEO", "Content"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudNine",
    location: "Remote",
    type: "Full-time" as const,
    salary: "$125k - $155k",
    description:
      "Manage infrastructure and deployment pipelines. Experience with AWS, Kubernetes, and CI/CD required.",
    tags: ["AWS", "Kubernetes", "CI/CD"],
  },
  {
    id: "7",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Boston, MA",
    type: "Full-time" as const,
    salary: "$110k - $145k",
    description:
      "Build machine learning models and data pipelines to drive business insights and optimization.",
    tags: ["Python", "Machine Learning", "SQL"],
  },
  {
    id: "8",
    title: "Junior Developer",
    company: "Learning Labs",
    location: "Remote",
    type: "Full-time" as const,
    salary: "$60k - $80k",
    description:
      "Great opportunity for early-career developers. We provide mentorship and training while you build real projects.",
    tags: ["JavaScript", "React", "CSS"],
  },
  {
    id: "9",
    title: "Mobile Developer",
    company: "App Innovations",
    location: "Austin, TX",
    type: "Full-time" as const,
    salary: "$105k - $135k",
    description:
      "Develop iOS and Android applications using React Native. Portfolio of published apps required.",
    tags: ["React Native", "Mobile", "TypeScript"],
  },
  {
    id: "10",
    title: "QA Automation Engineer",
    company: "QualityFirst",
    location: "Hybrid",
    type: "Full-time" as const,
    salary: "$95k - $125k",
    description:
      "Create automated test suites and ensure product quality across all platforms and browsers.",
    tags: ["Selenium", "Testing", "Python"],
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
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
    return MOCK_JOBS.filter((job) => {
      // Search term filter (title, company, description, tags)
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      // Location filter
      const matchesLocation =
        locationTerm === "" ||
        job.location.toLowerCase().includes(locationTerm.toLowerCase());

      // Job type filter
      const matchesJobType =
        filters.jobType.length === 0 || filters.jobType.includes(job.type);

      // Location type filter
      const matchesLocationType =
        filters.location.length === 0 ||
        filters.location.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase()),
        );

      // Salary range filter
      const matchesSalary = (() => {
        if (!filters.salaryRange) return true;
        const salary = job.salary?.replace(/[$,k]/g, "") || "";
        const [min, max] = salary.split(" - ").map((s) => parseInt(s));

        switch (filters.salaryRange) {
          case "Under $50k":
            return min < 50;
          case "$50k - $80k":
            return min >= 50 && min <= 80;
          case "$80k - $120k":
            return min >= 80 && min <= 120;
          case "$120k - $150k":
            return min >= 120 && min <= 150;
          case "$150k+":
            return min >= 150;
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
  }, [searchTerm, locationTerm, filters]);

  const handleFilterChange = (
    filterType: string,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType as keyof typeof prev] as string[]), value]
        : (prev[filterType as keyof typeof prev] as string[]).filter(
            (item) => item !== value,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-gray-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          HireLink
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

      {/* Header */}
      <section className="px-8 py-12">
        <h2 className="text-4xl font-bold mb-3">Job Opportunities</h2>
        <p className="text-gray-500 mb-8">
          Browse our latest job postings across all industries.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 border border-gray-200 p-3 rounded-xl w-full">
            <Briefcase size={18} className="text-gray-600" />
            <input
              placeholder="Job title or keyword"
              className="outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 p-3 rounded-xl w-full">
            <MapPin size={18} className="text-gray-600" />
            <input
              placeholder="Location"
              className="outline-none w-full"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
              showFilters
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap hover:bg-gray-800 transition">
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                <X size={16} />
                Clear all
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Job Type */}
              <div>
                <h4 className="font-medium mb-3">Job Type</h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={(e) =>
                          handleFilterChange("jobType", type, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Type */}
              <div>
                <h4 className="font-medium mb-3">Work Location</h4>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={(e) =>
                          handleFilterChange(
                            "location",
                            location,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h4 className="font-medium mb-3">Salary Range</h4>
                <div className="space-y-2">
                  {salaryRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2">
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
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="font-medium mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevel.includes(level)}
                        onChange={(e) =>
                          handleFilterChange(
                            "experienceLevel",
                            level,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Jobs Grid */}
      <section className="px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            Found
          </h3>
          <select className="border border-gray-200 rounded-lg px-4 py-2 bg-white">
            <option>Most Recent</option>
            <option>Most Relevant</option>
            <option>Salary: High to Low</option>
            <option>Salary: Low to High</option>
          </select>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
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

      {/* Load More */}
      <section className="px-8 py-12 text-center">
        <button className="border border-gray-300 text-gray-800 px-8 py-3 rounded-xl hover:bg-gray-50 transition">
          Load More Jobs
        </button>
      </section>
    </div>
  );
}
