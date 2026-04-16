"use client";
import { useEffect, useState } from "react";
import { 
  Save, 
  Upload, 
  FilePlus2, 
  FileText, 
  Paperclip, 
  Eye, 
  Edit3,
  CheckCircle2,
  XCircle,
  Settings,
  Sparkles,
  Layers,
  BookType,
  FolderTree
} from "lucide-react";
import ContentRenderer from "@/components/ContentRenderer";

interface Category {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  title: string;
}

export default function LessonEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedCh, setSelectedCh] = useState("");
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Initial load: Fetch all categories
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch Subjects when Category changes
  useEffect(() => {
    if (selectedCat) {
      const cat = categories.find(c => c.id === parseInt(selectedCat));
      if (cat) {
        // We use the slug for the public subjects API
        // In a real app with slug conflict potential, we'd use a dedicated admin ID API
        const catSlug = (cat as any).slug || cat.name.toLowerCase().replace(/ /g, '-');
        fetch(`http://127.0.0.1:5000/api/subjects/${catSlug}`)
          .then((res) => res.json())
          .then((data) => {
            setSubjects(Array.isArray(data) ? data : []);
            setChapters([]); // Reset chapters
            setSelectedSub(""); setSelectedCh("");
          });
      }
    } else {
      setSubjects([]);
      setChapters([]);
    }
  }, [selectedCat, categories]);

  // Fetch Chapters when Subject changes
  useEffect(() => {
    if (selectedSub) {
      const token = localStorage.getItem("token");
      fetch(`http://127.0.0.1:5000/api/admin/chapters/${selectedSub}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        setSelectedCh("");
      });
    } else {
      setChapters([]);
    }
  }, [selectedSub]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCh || !title || !content) {
      setStatus({ type: 'error', message: "Please fill in all fields and select a chapter." });
      return;
    }

    setLoading(true);
    setStatus(null);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          chapter_id: parseInt(selectedCh),
          order: 1
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: "Lesson published successfully!" });
        setTitle(""); setSlug(""); setContent("");
      } else {
        setStatus({ type: 'error', message: data.message || "Failed to save lesson." });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files?.[0]) return;
     const file = e.target.files[0];
     const token = localStorage.getItem("token");

     const formData = new FormData();
     formData.append("file", file);

     try {
       const res = await fetch("http://127.0.0.1:5000/api/admin/upload", {
         method: "POST",
         headers: { "Authorization": `Bearer ${token}` },
         body: formData
       });
       const data = await res.json();
       if (res.ok) {
         const linkText = file.type.startsWith('image/') 
           ? `\n![${file.name}](${data.url})` 
           : `\n[Download ${file.name}](${data.url})`;
         setContent(prev => prev + linkText);
       }
     } catch (err) {
       console.error("Upload failed", err);
     }
  };

  return (
    <div className="p-10 container-custom">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Create Lesson</h1>
          <p className="text-slate-500 font-medium">Draft your next masterpiece in Markdown.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            {isPreview ? <><Edit3 className="w-5 h-5" /> Edit</> : <><Eye className="w-5 h-5" /> Preview</>}
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {loading ? "Publishing..." : "Publish Lesson"}
          </button>
        </div>
      </div>

      {status && (
        <div className={`mb-8 p-6 rounded-[2rem] flex items-center gap-4 border ${
          status.type === 'success' 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" 
            : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-8 h-8 flex-shrink-0" /> : <XCircle className="w-8 h-8 flex-shrink-0" />}
          <div className="flex flex-col">
             <span className="font-black text-lg">{status.type === 'success' ? "Win!" : "Hold on..."}</span>
             <span className="font-semibold text-sm opacity-80">{status.message}</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {isPreview ? (
             <div className="card p-12 min-h-[700px] bg-white dark:bg-slate-900 shadow-2xl">
               <ContentRenderer content={content || "*No content yet. Start typing to see the preview...*"} />
             </div>
           ) : (
             <div className="space-y-6">
               <input 
                 type="text" 
                 placeholder="Lesson Title (e.g. Intro to Hooks)"
                 className="w-full text-5xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800"
                 value={title}
                 onChange={(e) => {
                   setTitle(e.target.value);
                   setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
                 }}
               />
               
               <div className="relative group">
                 <textarea 
                   rows={25}
                   className="w-full p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-[12px] focus:ring-indigo-600/5 transition-all font-mono text-lg leading-relaxed shadow-2xl resize-none"
                   placeholder="Start writing your tutorial in Markdown..."
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                 ></textarea>
                 
                 <div className="absolute top-6 right-6 flex gap-2">
                    <label className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                       <Paperclip className="w-6 h-6" />
                       <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                 </div>
               </div>
             </div>
           )}
        </div>

        <div className="space-y-8">
          <div className="card p-10 space-y-8 shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Settings className="w-6 h-6 text-indigo-600" /> Structure
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <FolderTree className="w-3 h-3" /> Category
                 </label>
                 <select 
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer"
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                  >
                   <option value="">Select Category</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <BookType className="w-3 h-3" /> Subject
                 </label>
                 <select 
                   disabled={!selectedCat}
                   className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer disabled:opacity-50"
                   value={selectedSub}
                   onChange={(e) => setSelectedSub(e.target.value)}
                  >
                   <option value="">Select Subject</option>
                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Chapter
                 </label>
                 <select 
                   disabled={!selectedSub}
                   className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer disabled:opacity-50"
                   value={selectedCh}
                   onChange={(e) => setSelectedCh(e.target.value)}
                  >
                   <option value="">Select Chapter</option>
                   {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
                 </select>
               </div>
            </div>
          </div>

          <div className="card p-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
               <Sparkles className="w-6 h-6" /> Markdown Tips
            </h3>
            <ul className="space-y-4 text-sm font-bold text-indigo-50">
              <li className="flex gap-4">
                 <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">1</div>
                 Use `#` for main titles.
              </li>
              <li className="flex gap-4">
                 <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">2</div>
                 Surround code with ` ``` ` for syntax coloring.
              </li>
              <li className="flex gap-4">
                 <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">3</div>
                 Upload attachments using the paperclip icon.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
