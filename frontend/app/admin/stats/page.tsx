"use client";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Award,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminStats() {
  const kpis = [
    { label: "Active Learners", value: "1,284", change: "+12.5%", trending: "up", icon: Users },
    { label: "Avg. Completion", value: "68%", change: "+2.3%", trending: "up", icon: Award },
    { label: "Time on Site", value: "24m", change: "-1.5%", trending: "down", icon: Clock },
  ];

  const topSubjects = [
    { name: "Python Tutorial", learners: 842, growth: "+18%" },
    { name: "JavaScript Guide", learners: 624, growth: "+12%" },
    { name: "Web Dev Basics", learners: 312, growth: "+5%" },
  ];

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Platform Analytics</h1>
          <p className="text-slate-500 font-medium">Deep dive into SikshaVerse performance metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold transition-all hover:bg-slate-50">
          Download Report
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${kpi.trending === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.change} {kpi.trending === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Top Subjects Chart Mock */}
         <div className="card p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" /> Popular Subjects
            </h3>
            <div className="space-y-6">
               {topSubjects.map(sub => (
                 <div key={sub.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span>{sub.name}</span>
                       <span className="text-slate-400">{sub.learners} Users</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(sub.learners / 1000) * 100}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Weekly Engagement Mock */}
         <div className="card p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" /> Weekly Engagement
            </h3>
            <div className="flex items-end justify-between h-48 gap-2">
               {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                 <div key={i} className="flex-1 space-y-2">
                    <div className="bg-indigo-600 rounded-t-lg transition-all hover:bg-indigo-700" style={{ height: `${h}%` }}></div>
                    <div className="text-[10px] font-bold text-slate-400 text-center uppercase">Day {i+1}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
