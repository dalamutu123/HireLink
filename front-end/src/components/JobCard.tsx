import Link from "next/link";
import { MapPin, Briefcase, Clock } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  salary?: string;
  description: string;
  tags?: string[];
}

export default function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary,
  description,
  tags = [],
}: JobCardProps) {
  return (
    <Link href={`/jobs/${id}`}>
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{company}</p>
          </div>
          {salary && (
            <div className="text-right">
              <p className="font-semibold text-gray-900">{salary}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} />
            {location}
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Briefcase size={16} />
            {type}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-gray-500 text-xs">Posted recently</p>
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
}
