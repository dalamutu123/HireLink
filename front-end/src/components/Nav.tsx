"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        HireLink
      </Link>

      <div className="space-x-6 hidden md:flex">
        <Link href="/jobs">Jobs</Link>
        <Link href="/companies">Companies</Link>
        <Link href="/about">About</Link>
      </div>

      <Link
        href="/register"
        className="bg-white text-black px-4 py-2 rounded-xl"
      >
        Sign Up
      </Link>
    </nav>
  );
}