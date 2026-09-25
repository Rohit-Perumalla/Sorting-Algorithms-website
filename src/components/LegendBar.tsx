import React from 'react';

export const LegendBar: React.FC = () => {
  const legendItems = [
    { label: 'Unsorted', color: 'bg-slate-700 border-slate-600', textColor: 'text-slate-300' },
    { label: 'Comparing', color: 'bg-amber-400 border-amber-300 shadow-sm shadow-amber-500/30', textColor: 'text-amber-300' },
    { label: 'Swapping / Writing', color: 'bg-rose-500 border-rose-400 shadow-sm shadow-rose-500/30', textColor: 'text-rose-300' },
    { label: 'Selected / Min / Key', color: 'bg-purple-500 border-purple-400', textColor: 'text-purple-300' },
    { label: 'Pivot', color: 'bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400/30', textColor: 'text-cyan-300' },
    { label: 'Sorted', color: 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/30', textColor: 'text-emerald-300' },
    { label: 'Heap Parent/Child', color: 'bg-indigo-500 border-indigo-400', textColor: 'text-indigo-300' },
    { label: 'Merging', color: 'bg-fuchsia-500 border-fuchsia-400', textColor: 'text-fuchsia-300' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
      <div className="text-slate-400 font-medium">Element States:</div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`inline-block w-3 h-3 rounded-sm border ${item.color}`} />
            <span className={item.textColor}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
