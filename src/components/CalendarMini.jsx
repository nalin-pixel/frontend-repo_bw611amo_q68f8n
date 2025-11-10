import React from 'react';

function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0-6, Sun=0
  const diffToMonday = (day + 6) % 7; // Monday index
  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);
  const days = Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return x;
  });
  return days;
}

export default function CalendarMini({ selectedDate, onSelect }) {
  const days = getWeekRange(selectedDate);
  const isToday = (dt) => {
    const a = new Date();
    return (
      a.getFullYear() === dt.getFullYear() &&
      a.getMonth() === dt.getMonth() &&
      a.getDate() === dt.getDate()
    );
  };
  const formatDay = (dt) => dt.toLocaleDateString('id-ID', { weekday: 'short' });
  const formatNum = (dt) => dt.getDate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Pekan Ini</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const selected = selectedDate &&
            d.getFullYear() === selectedDate.getFullYear() &&
            d.getMonth() === selectedDate.getMonth() &&
            d.getDate() === selectedDate.getDate();
          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelect(d)}
              className={[
                'flex flex-col items-center justify-center rounded-lg py-2 border',
                selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
                isToday(d) && !selected ? 'ring-2 ring-indigo-500' : ''
              ].join(' ')}
            >
              <span className="text-xs">{formatDay(d)}</span>
              <span className="text-lg font-semibold">{formatNum(d)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
