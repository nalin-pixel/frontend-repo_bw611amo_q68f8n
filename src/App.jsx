import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import WeeklyGrid from './components/WeeklyGrid';
import CalendarMini from './components/CalendarMini';
import ReminderPanel from './components/ReminderPanel';

const defaultItems = [
  { id: 'shalat', name: 'Sholat berjamaah', days: [false, false, false, false, false, false] },
  { id: 'tilawah', name: 'Tilawah 1 juz sepekan', days: [false, false, false, false, false, false] },
  { id: 'shaum', name: 'Shaum Sunnah', days: [false, false, false, false, false, false] },
  { id: 'almatsurat', name: 'Almatsurat', days: [false, false, false, false, false, false] },
  { id: 'dhuha', name: 'Dhuha', days: [false, false, false, false, false, false] },
  { id: 'tahajjud', name: 'Tahajjud', days: [false, false, false, false, false, false] },
];

// We use 6 columns (Mon-Sat), with the Thursday column serving as the weekly checkpoint.
const USED_DAY_COUNT = 6;

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('mutabaah_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize: ensure every item has at least 6 day slots
        return parsed.map((it) => ({
          ...it,
          days: Array.isArray(it.days)
            ? [...it.days.slice(0, USED_DAY_COUNT), ...Array(Math.max(0, USED_DAY_COUNT - it.days.length)).fill(false)]
            : Array(USED_DAY_COUNT).fill(false),
        }));
      } catch (_) {
        // fall through to defaults
      }
    }
    return defaultItems;
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
    const total = items.length * USED_DAY_COUNT;
    const done = items.reduce((acc, it) => acc + it.days.slice(0, USED_DAY_COUNT).filter(Boolean).length, 0);
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
