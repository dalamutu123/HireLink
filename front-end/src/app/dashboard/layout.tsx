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
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/dashboard";
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: "Discover",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutPanelLeft, description: "Track your jobs and application progress." },
        { name: "Jobs", href: "/dashboard/jobs", icon: Search, description: "Browse our latest job postings across all industries." },
      ]
    },
    {
      title: "Activities",
      items: [
        { name: "Saved", href: "/dashboard/saved", icon: Bookmark, description: "Manage and track the positions you've bookmarked." },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell, description: "View your recent alerts and updates." },
      ]
    },
    {
      title: "Preferences",
      items: [
        { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Manage your account preferences and personal information." },
      ]
    }
  ];

  const allNavItems = navSections.flatMap((section) => section.items);

  const activeItem: NavItem =
    allNavItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    ) || { name: "Dashboard", href: "/dashboard", icon: LayoutPanelLeft, description: "Track your jobs and application progress." };

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
              sectionIdx > 0 && <div className="border-t border-slate-100 my-4 mx-2" />
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
                        isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                    
                    {isExpanded && isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {isExpanded && (
        <div className="p-4 border-t border-slate-50 whitespace-nowrap">
          <div className="flex items-center gap-3 p-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0">
              U
            </div>
            <div className="min-w-0 grow">
              <h4 className="text-sm font-bold text-slate-800">Profile</h4>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      )}
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
    </div>
  );
}
