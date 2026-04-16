"use client";
import { useState } from "react";
import { 
  Puzzle, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Circle,
  HelpCircle,
  Brain
} from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

export default function QuizBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "What is Python?", options: [
      { id: "1-1", text: "A snake", isCorrect: false },
      { id: "1-2", text: "A programming language", isCorrect: true },
    ]}
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
    setQuestions([...questions, { 
      id: newId, 
      text: "", 
      options: [
        { id: `${newId}-1`, text: "", isCorrect: false },
        { id: `${newId}-2`, text: "", isCorrect: false },
      ] 
    }]);
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { 
          ...q, 
          options: [...q.options, { id: `${q.id}-${q.options.length + 1}`, text: "", isCorrect: false }] 
        };
      }
      return q;
    }));
  };

  const updateQuestionText = (qId: string, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, text } : q));
  };

  const updateOptionText = (qId: string, oId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => o.id === oId ? { ...o, text } : o)
        };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId: string, oId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => ({ ...o, isCorrect: o.id === oId }))
        };
      }
      return q;
    }));
  };

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  return (
    <div className="p-10 container-custom">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Quiz Builder</h1>
          <p className="text-slate-500 font-medium">Create interactive challenges for your learners.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all">
          <Save className="w-5 h-5" /> Save Quiz
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="card p-8 bg-white dark:bg-slate-900 border-l-8 border-indigo-600">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                     {idx + 1}
                   </div>
                   <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Question</h3>
                </div>
                <button 
                  onClick={() => removeQuestion(q.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <input 
                type="text"
                placeholder="Type your question here..."
                className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 mb-8 p-0"
                value={q.text}
                onChange={(e) => updateQuestionText(q.id, e.target.value)}
              />

              <div className="space-y-4">
                 <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Options</p>
                 <div className="grid md:grid-cols-2 gap-4">
                    {q.options.map((o) => (
                      <div 
                        key={o.id} 
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                          o.isCorrect 
                            ? "bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20" 
                            : "bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <button 
                          onClick={() => setCorrectOption(q.id, o.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            o.isCorrect ? "bg-emerald-500 text-white" : "text-slate-300 border-2 border-slate-300"
                          }`}
                        >
                          {o.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <input 
                          type="text"
                          placeholder="Option text..."
                          className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-semibold"
                          value={o.text}
                          onChange={(e) => updateOptionText(q.id, o.id, e.target.value)}
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => addOption(q.id)}
                      className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Add Option
                    </button>
                 </div>
              </div>
            </div>
          ))}

          <button 
            onClick={addQuestion}
            className="w-full py-6 rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-black text-xl flex items-center justify-center gap-3"
          >
            <Plus className="w-8 h-8" /> Add New Question
          </button>
        </div>

        <div className="space-y-8">
           <div className="card p-8 bg-white dark:bg-slate-900 space-y-6 text-center">
              <div className="w-20 h-20 bg-indigo-600/10 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                 <Brain className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Quiz Performance</h3>
                <p className="text-sm text-slate-500">Learners find interactive quizzes 3x more engaging than text.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                 <p className="text-3xl font-black text-slate-900 dark:text-white">{questions.length}</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Questions Added</p>
              </div>
           </div>

           <div className="card p-8 bg-slate-900 text-white space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                <HelpCircle className="w-5 h-5" /> Quick Guide
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                 <li>• Every question must have at least one correct answer.</li>
                 <li>• Aim for 4 options per question for balance.</li>
                 <li>• Use images in options to make it visual.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
