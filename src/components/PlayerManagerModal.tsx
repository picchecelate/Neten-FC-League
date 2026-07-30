import React, { useState } from 'react';
import { Player } from '../types';
import { AVATAR_COLORS } from '../data/initialData';
import { X, UserPlus, Trash2, Edit2, Check, Shield, Users, AlertTriangle } from 'lucide-react';

interface PlayerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
}

export const PlayerManagerModal: React.FC<PlayerManagerModalProps> = ({
  isOpen,
  onClose,
  players,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
}) => {
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Inserisci il nome del collega.');
      return;
    }

    if (editingPlayerId) {
      const existing = players.find((p) => p.id === editingPlayerId);
      if (existing) {
        onUpdatePlayer({
          ...existing,
          name: name.trim(),
          avatarColor,
        });
      }
      setEditingPlayerId(null);
    } else {
      // Check duplicate name
      if (players.some((p) => p.name.toLowerCase() === name.trim().toLowerCase())) {
        setError('Esiste già un partecipante con questo nome.');
        return;
      }
      onAddPlayer({
        name: name.trim(),
        avatarColor,
      });
    }

    setName('');
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
  };

  const startEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setName(player.name);
    setAvatarColor(player.avatarColor || AVATAR_COLORS[0]);
  };

  const cancelEdit = () => {
    setEditingPlayerId(null);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight font-mono">Gestione Colleghi & Partecipanti</h3>
              <p className="text-xs font-mono text-slate-500 font-bold">Aggiungi o rimuovi utenti dalla classifica Neten</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">
                {editingPlayerId ? 'Modifica Partecipante' : 'Aggiungi Nuovo Collega'}
              </h4>
              {editingPlayerId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer font-semibold"
                >
                  Annulla Modifica
                </button>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-600">Nome e Cognome</label>
              <input
                type="text"
                placeholder="Es. Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs font-medium"
              />
            </div>

            {/* Avatar color selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Colore Avatar Badge
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className={`w-7 h-7 rounded-lg ${c} flex items-center justify-center transition-transform cursor-pointer shadow-xs ${
                      avatarColor === c ? 'ring-2 ring-emerald-600 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {avatarColor === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {editingPlayerId ? (
                  <>
                    <Check className="w-4 h-4" /> Aggiorna Giocatore
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Aggiungi a Neten FC
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Players List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <h4 className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500 mb-2">
            Elenco Colleghi Iscritti ({players.length})
          </h4>

          {players.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Nessun giocatore registrato.</p>
          ) : (
            <div className="space-y-2">
              {players.map((p) => {
                const initials = p.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                const isDeleting = confirmDeleteId === p.id;

                return (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${p.avatarColor || 'bg-emerald-600'} text-white font-extrabold flex items-center justify-center text-xs shadow-xs border border-white`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isDeleting ? (
                        <div className="flex items-center space-x-2 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                          <span className="text-xs text-rose-700 font-bold">Confermi eliminazione?</span>
                          <button
                            onClick={() => {
                              onDeletePlayer(p);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                          >
                            Sì
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Modifica"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Elimina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
