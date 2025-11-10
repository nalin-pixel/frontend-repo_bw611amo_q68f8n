import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, Save, RefreshCw, ListChecks } from 'lucide-react';

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const AmalanManager = ({ items, onAdd, onRename, onRemove, onResetWeek, onBulkReplace }) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [bulk, setBulk] = useState('');

  const canAdd = useMemo(() => newName.trim().length > 0, [newName]);
  const parsedBulk = useMemo(() => {
    return bulk
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [bulk]);

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ id: uid(), name: newName.trim() });
    setNewName('');
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const saveEdit = () => {
    const name = editValue.trim();
    if (editingId && name) {
      onRename(editingId, name);
    }
    setEditingId(null);
    setEditValue('');
  };

  const doBulkReplace = () => {
    if (parsedBulk.length === 0) return;
    onBulkReplace(parsedBulk);
    setBulk('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Kelola Amalan</h2>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama amalan baru"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
        <button
          onClick={onResetWeek}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 text-sm hover:bg-slate-200"
        >
          <RefreshCw className="h-4 w-4" /> Reset Pekan
        </button>
      </div>

      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
        {items.length === 0 && (
          <li className="p-4 text-slate-500 text-sm">Belum ada amalan. Tambahkan di atas atau gunakan ganti massal.</li>
        )}
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 p-3">
            {editingId === it.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={saveEdit} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white text-sm">
                  <Save className="h-4 w-4" /> Simpan
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-slate-800 text-sm">{it.name}</span>
                <button onClick={() => startEdit(it.id, it.name)} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 text-sm hover:bg-slate-200">
                  <Edit2 className="h-4 w-4" /> Ubah
                </button>
                <button onClick={() => onRemove(it.id)} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-white text-sm">
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Ganti daftar massal (satu amalan per baris)</label>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={"Contoh:\nShalat Dhuha\nMuraja'ah\nOlahraga"}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end">
          <button
            onClick={doBulkReplace}
            disabled={parsedBulk.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm disabled:opacity-50"
          >
            Ganti Daftar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmalanManager;
