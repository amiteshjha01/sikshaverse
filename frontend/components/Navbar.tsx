"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          Siksha<span className="text-slate-900 dark:text-white">Verse</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/tutorials" className="hover:text-indigo-600 transition-colors">Tutorials</Link>
          <Link href="/questions" className="hover:text-indigo-600 transition-colors">Practice</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
           <input 
            type="text" 
            placeholder="Search tutorials..." 
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
           />
        </div>
        <Link href="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all">
          Login
        </Link>
      </div>
    </nav>
  );
}
