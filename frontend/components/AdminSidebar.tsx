"use client";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FilePlus2, 
  BookType, 
  FolderTree, 
  PieChart, 
  Settings,
  LogOut,
  Brain
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Subjects", href: "/admin/subjects", icon: BookType },
    { name: "Lessons", href: "/admin/editor", icon: FilePlus2 },
    { name: "Quizzes", href: "/admin/quiz-builder", icon: Brain },
    { name: "Stats", href: "/admin/stats", icon: PieChart },
  ];

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col p-6 sticky top-0">
      <div className="mb-12">
        <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
          <span className="text-indigo-400">Siksha</span>Verse <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded tracking-normal">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-600" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
