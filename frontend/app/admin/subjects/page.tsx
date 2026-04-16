"use client";
import { useEffect, useState } from "react";
import { 
  BookType, 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  LayoutGrid,
  X,
  Type,
  Link2,
  FileText,
  Tag
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New Subject Form State
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const [subRes, catRes] = await Promise.all([
      fetch("http://127.0.0.1:5000/api/admin/subjects", { headers: { "Authorization": `Bearer ${token}` } }),
      fetch("http://127.0.0.1:5000/api/categories")
    ]);
    const subData = await subRes.json();
    const catData = await catRes.json();
    setSubjects(subData);
    setCategories(catData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:5000/api/admin/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        slug: newSlug,
        description: newDesc,
        category_id: parseInt(selectedCat)
      })
    });
    if (res.ok) {
      setShowModal(false);
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this subject? This will remove all associated chapters.")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:5000/api/admin/subjects/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      fetchData();
    }
  };

  return (
    <div className="p-10 space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Subjects Management</h1>
          <p className="text-slate-500 font-medium">Create and organize your tutorial subjects.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5" /> Add Subject
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"></div>)
        ) : subjects.map((sub) => (
          <div key={sub.id} className="card p-8 group relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BookType className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-full">
                {sub.category_name}
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{sub.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 font-medium">
              {sub.description || "No description provided for this subject yet."}
            </p>

            <div className="mt-auto flex items-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(sub.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <h2 className="text-2xl font-black flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                 </div>
                 Add Subject
               </h2>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-10 space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                   <Type className="w-3 h-3" /> Subject Name
                 </label>
                 <input 
                   required
                   className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                   placeholder="e.g. Master React.js"
                   value={newName}
                   onChange={(e) => {
                     setNewName(e.target.value);
                     setNewSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
                   }}
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Link2 className="w-3 h-3" /> Slug
                   </label>
                   <input 
                     required
                     className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                     placeholder="react-js"
                     value={newSlug}
                     onChange={(e) => setNewSlug(e.target.value)}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Tag className="w-3 h-3" /> Category
                   </label>
                   <select 
                     required
                     className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none cursor-pointer"
                     value={selectedCat}
                     onChange={(e) => setSelectedCat(e.target.value)}
                   >
                     <option value="">Choose...</option>
                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                   <FileText className="w-3 h-3" /> Description
                 </label>
                 <textarea 
                   rows={3}
                   className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none resize-none"
                   placeholder="Briefly describe what students will learn..."
                   value={newDesc}
                   onChange={(e) => setNewDesc(e.target.value)}
                 />
              </div>

              <button className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all">
                Create Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
