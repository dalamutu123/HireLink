import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Bookmark, Clock, DollarSign } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { useAuth } from "@/app/providers/AuthProvider";

interface JobCardProps {
  id: string | number;
  title: string;
  company?: string;
  employer_name?: string;
  location: string;
  type?: string;
  job_type?: string;
  salary?: string | null;
  description: string;
  tags?: string[];
  created_at?: string;
}

const colors = [
  "bg-red-100 text-red-600 border-red-200",
  "bg-orange-100 text-orange-600 border-orange-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-green-100 text-green-600 border-green-200",
  "bg-emerald-100 text-emerald-600 border-emerald-200",
  "bg-teal-100 text-teal-600 border-teal-200",
  "bg-cyan-100 text-cyan-600 border-cyan-200",
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-indigo-100 text-indigo-600 border-indigo-200",
  "bg-violet-100 text-violet-600 border-violet-200",
  "bg-purple-100 text-purple-600 border-purple-200",
  "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200",
  "bg-pink-100 text-pink-600 border-pink-200",
  "bg-rose-100 text-rose-600 border-rose-200",
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getDaysAgo = (dateStr?: string) => {
  if (!dateStr) return "2d ago";
  try {
    const date = new Date(dateStr);
    const diffTime = Math.abs(Date.now() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || isNaN(diffDays)) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch {
    return "2d ago";
  }
};

export default function JobCard({
  id,
  title,
  company,
  employer_name,
  location,
  type,
  job_type,
  salary,
  description,
  tags = [],
  created_at,
}: JobCardProps) {
  const companyName = company || employer_name || "Enterprise Partner";
  const displayType = type || job_type || "full-time";
  
  const avatarColor = getAvatarColor(companyName);
  const initial = companyName.charAt(0).toUpperCase();
  const daysAgoText = getDaysAgo(created_at);

  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch saved status from backend
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let mounted = true;
    apiService.bookmarks.getBookmarkedJobIds()
      .then((savedIds) => {
        if (mounted) {
          setIsSaved(savedIds.map(Number).includes(Number(id)));
        }
      })
      .catch(() => {
        // Silently catch so unauthenticated or no-saved-jobs errors don't pop up in Next.js overlay
      });
    return () => { mounted = false; };
  }, [id, isAuthenticated]);

  // Toggle bookmark in backend
  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Could redirect to login or show a toast
      return;
    }
    
    const jobId = typeof id === "number" ? id : Number(id);
    const wasSaved = isSaved;
    
    // Optimistic UI update
    setIsSaved(!wasSaved);
    
    try {
      if (wasSaved) {
        await apiService.bookmarks.unsaveJob(jobId);
      } else {
        await apiService.bookmarks.saveJob(jobId);
      }
      window.dispatchEvent(new Event("saved_jobs_changed"));
    } catch (err) {
      // Revert state if something went wrong
      setIsSaved(wasSaved);
      console.error("Failed to sync bookmark action:", err);
    }
  };

  return (
    <Link href={`/dashboard/jobs/${id}`} className="block h-full group">
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 border border-slate-100 hover:border-slate-200/80 flex flex-col h-full -translate-y-0 hover:-translate-y-1">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 items-center min-w-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border shrink-0 ${avatarColor}`}>
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="text-[1.05rem] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate leading-snug">{title}</h3>
              <p className="text-slate-500 text-sm mt-0.5 truncate font-medium">{companyName}</p>
            </div>
          </div>
          <button 
            onClick={toggleSave} 
            className={`transition-colors shrink-0 ml-4 p-1 rounded-full hover:bg-indigo-50 ${
              isSaved ? "text-indigo-600" : "text-slate-300 hover:text-indigo-500"
            }`}
            title={isSaved ? "Remove Bookmark" : "Bookmark Job"}
          >
            <Bookmark size={20} strokeWidth={2} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Location & Salary inline */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 mb-4 font-medium">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={15} strokeWidth={2.5} className="text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{location}</span>
          </div>
          <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0 hidden sm:block"></span>
          <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
            <DollarSign size={15} strokeWidth={2.5} className="text-emerald-500 shrink-0" />
            <span className="truncate">{salary || "Competitive"}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{description}</p>

        {/* Footer info (Tags & Time) */}
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50 gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold">
              {displayType.split('•')[0].trim()}
            </span>
            {tags && tags.length > 0 && (
              <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold hidden sm:inline-block">
                {tags[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock size={13} strokeWidth={2.5} />
            {daysAgoText}
          </div>
        </div>
      </div>
    </Link>
  );
}
