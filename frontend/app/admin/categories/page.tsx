"use client";
import { useEffect, useState } from "react";
import { 
  FolderTree, 
  Plus, 
  Trash2, 
  Layers,
  CheckCircle2,
  XCircle,
  Hash
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: "Category created!" });
        setName(""); setSlug("");
        fetchCategories();
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Failed to connect." });
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure? This will only work if the category is empty.")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: "Category deleted." });
        fetchCategories();
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Failed to delete." });
    }
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Category Management</h1>
          <p className="text-slate-500 font-medium">Group your courses into logical domains.</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
          status.type === 'success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-bold text-sm">{status.message}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Create Form */}
        <div className="card p-8 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> New Category
          </h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Name</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="e.g. Computer Science"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Slug</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none font-bold"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
              Create Category
            </button>
          </form>
        </div>

        {/* List Table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Active Categories
            </h2>
            <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">
              {categories.length} TOTAL
            </span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-medium italic">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium italic">No categories created yet.</div>
            ) : categories.map((cat) => (
              <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                    <p className="text-xs font-mono text-slate-400 tracking-tight">/{cat.slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
