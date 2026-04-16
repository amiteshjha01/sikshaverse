"use client";
import Link from "react-router-dom"; // Actually, should use Next.js link
import NextLink from "next/link";
import { ArrowRight, BookOpen, Users, Rocket, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-8 animate-bounce">
              <Sparkles className="w-4 h-4" /> The future of learning is here
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              Elevate Your Knowledge <br/> With <span className="text-indigo-600">SikshaVerse</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The ultimate educational platform for developers. High-quality tutorials, 
              expert insights, and a community of passionate learners—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <NextLink 
                href="/tutorials" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 text-white text-lg font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3"
              >
                Explorer Tutorials <ArrowRight className="w-6 h-6" />
              </NextLink>
              <NextLink 
                href="/about" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                Learn More
              </NextLink>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/20 to-transparent -z-10 blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-indigo-600">500+</h3>
            <p className="text-slate-500 font-medium">Free Tutorials</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-indigo-600">50k+</h3>
            <p className="text-slate-500 font-medium">Active Learners</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-indigo-600">100%</h3>
            <p className="text-slate-500 font-medium">Free Access</p>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 container-custom">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-8">Why choice SikshaVerse?</h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Expert-Led Content</h4>
                  <p className="text-slate-500 dark:text-slate-400">Our tutorials are written by industry experts with years of real-world experience.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Community Driven</h4>
                  <p className="text-slate-500 dark:text-slate-400">Join a network of thousands of learners and grow together through peer support.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Stay Ahead</h4>
                  <p className="text-slate-500 dark:text-slate-400">We constantly update our content to keep up with the fast-paced tech world.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-indigo-600 rounded-[4rem] flex items-center justify-center text-white text-[12rem] font-black transform -rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl overflow-hidden">
               <span className="opacity-10 absolute inset-0 text-[30rem] select-none">S</span>
               SV
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent rounded-[3rem] -z-10 blur-2xl opacity-50"></div>
          </div>
        </div>
      </section>
    </div>
  );
}