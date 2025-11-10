import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import WeeklyGrid from './components/WeeklyGrid';
import CalendarMini from './components/CalendarMini';
import ReminderPanel from './components/ReminderPanel';

const defaultItems = [
  { id: 'quran', name: 'Tilawah Al-Qur\'an', days: [false, false, false, false, false, false, false] },
  { id: 'dzikr', name: 'Dzikir Pagi & Petang', days: [false, false, false, false, false, false, false] },
  { id: 'shalat', name: 'Shalat Berjamaah', days: [false, false, false, false, false, false, false] },
  { id: 'sedekah', name: 'Sedekah', days: [false, false, false, false, false, false, false] },
];

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('mutabaah_items');
    return saved ? JSON.parse(saved) : defaultItems;
  });
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('mutabaah_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mutabaah_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('mutabaah_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const onToggle = (rowIndex, dayIndex) => {
    setItems((prev) => {
      const next = prev.map((it) => ({ ...it, days: [...it.days] }));
      next[rowIndex].days[dayIndex] = !next[rowIndex].days[dayIndex];
      return next;
    });
  };

  const progress = useMemo(() => {
    const total = items.length * 7;
    const done = items.reduce((acc, it) => acc + it.days.filter(Boolean).length, 0);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [items]);

  const addReminder = (r) => setReminders((p) => [r, ...p]);
  const removeReminder = (id) => setReminders((p) => p.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-500 text-sm">Progres pekanan</p>
                  <p className="text-xl font-semibold text-slate-900">{progress.pct}% selesai</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  {progress.done}/{progress.total} poin
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>

            <WeeklyGrid items={items} onToggle={onToggle} />
          </div>
          <div className="space-y-6">
            <CalendarMini selectedDate={selectedDate} onSelect={setSelectedDate} />
            <ReminderPanel
              reminders={reminders}
              onAddReminder={addReminder}
              onRemoveReminder={removeReminder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
