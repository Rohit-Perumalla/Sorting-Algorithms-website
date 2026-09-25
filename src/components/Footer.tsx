import React from 'react';
import { BarChart3, Code2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-850 bg-slate-950 py-10 mt-16 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-200">
              Interactive Visualization of Sorting Algorithms
            </span>
          </div>
          <p className="text-slate-400">
            Educational Project – Data Structures &amp; Algorithms
          </p>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Bubble · Selection · Insertion</span>
          <span>·</span>
          <span>Merge · Quick · Heap</span>
        </div>
      </div>
    </footer>
  );
};
