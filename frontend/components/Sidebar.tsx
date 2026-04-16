"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Lesson {
  id: number;
  title: string;
  slug: string;
}

interface Chapter {
  id: number;
  title: string;
  slug: string;
  lessons: Lesson[];
}

export default function Sidebar() {
  const { subject, lesson: currentLessonSlug } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subject) {
      fetch(`http://127.0.0.1:5000/api/chapters/${subject}`)
        .then((res) => res.json())
        .then((data) => {
          setChapters(data);
          setLoading(false);
        })
        .catch((err) => console.error("Error fetching chapters:", err));
    }
  }, [subject]);

  if (loading) return <div className="p-6 text-slate-400">Loading chapters...</div>;

  return (
    <aside className="w-80 h-[calc(100vh-76px)] overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-[76px]">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-6">
          Course Content
        </h2>
        
        <div className="space-y-8">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-2">
                {chapter.title}
              </h3>
              <ul className="space-y-1">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/tutorials/${subject}/${lesson.slug}`}
                      className={`block px-3 py-2 text-sm rounded-md transition-all ${
                        currentLessonSlug === lesson.slug
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium border-l-2 border-indigo-600"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
