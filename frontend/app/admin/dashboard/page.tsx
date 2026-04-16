"use client";
import { useEffect, useState } from "react";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Subject {
  id: number;
  name: string;
  slug: string;
}

export default function AdminDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/subjects/programming") // Fixed for demo, should fetch all
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: "Total Learners", value: "2.4k", icon: Users, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Active Subjects", value: subjects.length, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-600/10" },
    { label: "Lessons Published", value: "48", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Editor's Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your educational kingdom from here.</p>
        </div>
        <Link href="/admin/editor" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-500/30">
          <Plus className="w-5 h-5" /> Add New Lesson
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Subjects Management */}
      <div className="card overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage Subjects</h2>
          <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading subjects...</div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{subject.name}</h4>
                    <p className="text-sm text-slate-400">/{subject.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/tutorials/${subject.slug}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-all rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40">
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-all rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
