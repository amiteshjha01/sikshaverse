"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContentRenderer from "@/components/ContentRenderer";
import { ChevronLeft, ChevronRight, BookOpen, Clock, BarChart } from "lucide-react";

interface LessonContent {
  title: string;
  content: string;
}

export default function LessonPage() {
  const { subject, lesson } = useParams();
  const [data, setData] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subject && lesson) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/api/lesson/${subject}/${lesson}`)
        .then((res) => res.json())
        .then((resp) => {
          setData(resp);
          setLoading(false);
          window.scrollTo(0, 0);
        })
        .catch((err) => console.error("Error fetching lesson:", err));
    }
  }, [subject, lesson]);

  if (loading) {
    return (
      <div className="p-12 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-12 text-center text-slate-500">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Breadcrumbs / Meta */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {subject}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10 min read</span>
        <span>•</span>
        <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> Beginner</span>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {data.title}
        </h1>
        <div className="mt-4 h-1.5 w-20 bg-indigo-600 rounded-full"></div>
      </header>

      <main>
        <ContentRenderer content={data.content} />
      </main>

      {/* Navigation Buttons */}
      <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
          Next Lesson <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
