"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ContentRendererProps {
  content: string;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-outfit prose-headings:font-bold 
      prose-h1:text-4xl prose-h1:mb-8
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
      prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
      prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
      prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-mono text-slate-500 uppercase">{match[1]}</span>
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Copy</button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
