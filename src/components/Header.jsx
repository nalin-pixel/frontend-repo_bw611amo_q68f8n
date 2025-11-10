import React from 'react';
import { Calendar, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full pb-6 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Mutaba'ah Mingguan</h1>
            <p className="text-slate-500 text-sm">Dasbor sederhana untuk memantau amalan pekanan & pengingat</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="text-sm">Pengingat via notifikasi browser</span>
        </div>
      </div>
    </header>
  );
}
