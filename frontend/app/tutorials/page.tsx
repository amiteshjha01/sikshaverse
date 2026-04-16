"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Globe, Database, Terminal } from "lucide-react";

interface Subject {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function TutorialsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch subjects from 'programming' category for now
    fetch("http://127.0.0.1:5000/api/subjects/programming")
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container-custom py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
          Explore Our <span className="text-indigo-600">Tutorials</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Unlock your potential with our meticulously crafted learning paths, 
          designed to take you from zero to hero in modern technology.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => (
             <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          ))
        ) : (
          subjects.map((subject) => (
            <Link 
              href={`/tutorials/${subject.slug}/what-is-python`} // Static link for demo, should dynamic find first lesson
              key={subject.id} 
              className="card p-8 group flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Terminal className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {subject.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1">
                {subject.description}
              </p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                Start Learning <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-24 p-12 bg-indigo-600 rounded-[3rem] text-center text-on-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Want to contribute?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            SikshaVerse is built by learners for learners. If you're an expert in any technology, join us as an author!
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-all">
            Become an Author
          </button>
        </div>
      </div>
    </div>
  );
}
