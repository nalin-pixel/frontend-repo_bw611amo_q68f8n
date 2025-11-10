import React, { useEffect, useState } from 'react';
import { BellRing, Clock } from 'lucide-react';

export default function ReminderPanel({ reminders, onAddReminder, onRemoveReminder }) {
  const [time, setTime] = useState('05:00');
  const [label, setLabel] = useState('Tilawah Pagi');

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scheduleNext = (t) => {
    const [h, m] = t.split(':').map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const ms = next - now;
    return ms;
  };

  const handleAdd = () => {
    if (!time) return;
    const id = `${time}-${Date.now()}`;
    onAddReminder({ id, time, label });

    const ms = scheduleNext(time);
    window.setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pengingat Mutaba\'ah', { body: `${label} • ${time}` });
      } else {
        alert(`${label} • ${time}`);
      }
    }, ms);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Pengingat Harian</h2>
        </div>
        <span className="text-xs text-slate-500">Notifikasi lokal perangkat</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full sm:w-32 rounded-lg border border-slate-300 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nama pengingat"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 transition"
        >
          Tambah
        </button>
      </div>

      {reminders.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {reminders.map((r) => (
            <li key={r.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{r.label}</p>
                  <p className="text-slate-500 text-sm">{r.time}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveReminder(r.id)}
                className="text-slate-500 hover:text-rose-600 text-sm"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Belum ada pengingat. Tambahkan waktu dan nama, lalu tekan Tambah.</p>
      )}
    </div>
  );
}
