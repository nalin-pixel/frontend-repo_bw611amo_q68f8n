import React from 'react';

// Use 6 columns: Mon-Sat, with Thursday as the weekly checkpoint
const days = [
  { key: 'Mon', label: 'Sen' },
  { key: 'Tue', label: 'Sel' },
  { key: 'Wed', label: 'Rab' },
  { key: 'Thu', label: 'Kam' },
  { key: 'Fri', label: 'Jum' },
  { key: 'Sat', label: 'Sab' },
];

export default function WeeklyGrid({ items, onToggle }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Mutaba'ah Pekanan (checkpoint Kamis)</h2>
        <span className="text-xs text-slate-500">Centang amalan yang selesai</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-slate-500 font-medium py-2 pr-2">Amalan</th>
              {days.map((d) => (
                <th key={d.key} className="text-center text-slate-500 font-medium px-2 py-2">{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id} className="border-t border-slate-100">
                <td className="py-3 pr-2 font-medium text-slate-800">{it.name}</td>
                {days.map((d, idx) => (
                  <td key={d.key} className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={Boolean(it.days?.[idx])}
                      onChange={() => onToggle(i, idx)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
