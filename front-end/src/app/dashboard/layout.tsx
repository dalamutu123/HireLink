"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutPanelLeft,
  Search,
  Bookmark,
  Settings,
  Bell,
  UserCircle,
  Menu,
  ChevronRight,
  PlusCircle,
  Briefcase,
  Users,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiStatusProvider } from "@/app/providers/ApiStatusProvider";
import { AuthProvider, useAuth } from "@/app/providers/AuthProvider";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { ApiStatusBadge } from "@/components/dashboard/ApiStatusBadge";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { DevRoleSwitcher } from "@/components/dashboard/DevRoleSwitcher";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/dashboard";
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useAuth();

  const getNavSections = (role?: string): NavSection[] => {
    if (role === "employer") {
      return [
        {
          title: "Recruiting",
          items: [
            {
              name: "Overview",
              href: "/dashboard",
              icon: LayoutPanelLeft,
              description: "Track your active listings and quick metrics.",
            },
            {
              name: "Post a Job",
              href: "/dashboard/jobs/new",
              icon: PlusCircle,
              description: "Create and publish a new job posting.",
            },
            {
              name: "My Listings",
              href: "/dashboard/jobs/manage",
              icon: Briefcase,
              description: "Manage your active and historical postings.",
            },
          ],
        },
        {
          title: "Talent Pool",
          items: [
            {
              name: "Applicants",
              href: "/dashboard/applicants",
              icon: Users,
              description: "Review and manage job seeker applications.",
            },
            {
              name: "Notifications",
              href: "/dashboard/notifications",
              icon: Bell,
              description: "View alerts regarding your listings.",
            },
          ],
        },
        {
          title: "Preferences",
          items: [
            {
              name: "Settings",
              href: "/dashboard/settings",
              icon: Settings,
              description: "Manage your company profile details.",
            },
          ],
        },
      ];
    }

    if (role === "admin") {
      return [
        {
          title: "System Control",
          items: [
            {
              name: "Overview",
              href: "/dashboard",
              icon: LayoutPanelLeft,
              description: "View system-wide activity, users, and jobs.",
            },
            {
              name: "Manage Users",
              href: "/dashboard/admin/users",
              icon: Users,
              description: "Monitor and manage user accounts.",
            },
            {
              name: "Manage Jobs",
              href: "/dashboard/admin/jobs",
              icon: ShieldAlert,
              description: "Audit and verify job listings.",
            },
          ],
        },
        {
          title: "Activities",
          items: [
            {
              name: "Notifications",
              href: "/dashboard/notifications",
              icon: Bell,
              description: "System logs and security alerts.",
            },
          ],
        },
        {
          title: "Preferences",
          items: [
            {
              name: "Settings",
              href: "/dashboard/settings",
              icon: Settings,
              description: "Manage global administrator preferences.",
            },
          ],
        },
      ];
    }

    // Default Job Seeker Nav
    return [
      {
        title: "Discover",
        items: [
          {
            name: "Overview",
            href: "/dashboard",
            icon: LayoutPanelLeft,
            description: "Track your jobs and application progress.",
          },
          {
            name: "Jobs",
            href: "/dashboard/jobs",
            icon: Search,
            description: "Browse our latest job postings across all industries.",
          },
        ],
      },
      {
        title: "Activities",
        items: [
          {
            name: "Saved",
            href: "/dashboard/saved",
            icon: Bookmark,
            description: "Manage and track the positions you've bookmarked.",
          },
          {
            name: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            description: "View your recent alerts and updates.",
          },
        ],
      },
      {
        title: "Preferences",
        items: [
          {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            description: "Manage your account preferences and personal information.",
          },
        ],
      },
    ];
  };

  const navSections = getNavSections(user?.role);

  const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => (
    <div className="flex flex-col h-full w-full bg-white border-r border-slate-100">
      <div
        className={`h-20 flex items-center border-b border-slate-50 transition-all duration-300 ${
          isExpanded ? "px-8" : "px-4 justify-center"
        }`}
      >
        <Link
          href="/"
          className={`font-black tracking-tight text-slate-900 hover:text-indigo-600 transition-colors ${
            isExpanded ? "text-2xl" : "text-xl"
          }`}
        >
          {isExpanded ? "HireLink" : "H"}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto overflow-x-hidden">
        {navSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-2">
            {/* Section Title */}
            {isExpanded ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 mt-2 first:mt-0"
              >
                {section.title}
              </motion.p>
            ) : (
              sectionIdx > 0 && (
                <div className="border-t border-slate-100 my-4 mx-2" />
              )
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all group relative whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`transition-colors duration-200 shrink-0 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span
                      className={`transition-all duration-300 ${
                        isExpanded
                          ? "opacity-100 w-auto"
                          : "opacity-0 w-0 overflow-hidden"
                      }`}
                    >
                      {item.name}
                    </span>

                    {isExpanded && isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-slate-50 p-3 flex flex-col gap-3.5 ${isExpanded ? "items-stretch" : "items-center"}`}>
        <UserProfile isExpanded={isExpanded} />
        <ApiStatusBadge isExpanded={isExpanded} />
        <LogoutButton isExpanded={isExpanded} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex h-screen sticky top-0 shrink-0 z-30"
        initial={{ width: 80 }}
        animate={{ width: isSidebarExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <SidebarContent isExpanded={isSidebarExpanded} />
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Floating Mobile Menu Button */}
        <button
          className="md:hidden absolute top-6 right-6 z-20 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:bg-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Route Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full pt-20 md:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-white"
            >
              <SidebarContent isExpanded={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Developer Preview Controls */}
      <DevRoleSwitcher />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiStatusProvider>
      <AuthProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </AuthProvider>
    </ApiStatusProvider>
  );
}
