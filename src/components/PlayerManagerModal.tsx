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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0C10]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#14171D] border border-slate-800/80 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0A0C10] border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Gestione Colleghi & Partecipanti</h3>
              <p className="text-xs font-mono text-slate-500">Aggiungi o rimuovi utenti dalla classifica Neten</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <div className="p-6 border-b border-slate-800/80 bg-[#0A0C10]/40 shrink-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">
                {editingPlayerId ? 'Modifica Partecipante' : 'Aggiungi Nuovo Collega'}
              </h4>
              {editingPlayerId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Annulla Modifica
                </button>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-400">Nome e Cognome</label>
              <input
                type="text"
                placeholder="Es. Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Avatar color selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Colore Avatar Badge
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className={`w-7 h-7 rounded-lg ${c} flex items-center justify-center transition-transform cursor-pointer ${
                      avatarColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
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
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
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
          <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 mb-2">
            Elenco Colleghi Iscritti ({players.length})
          </h4>

          {players.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">Nessun giocatore registrato.</p>
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
                    className="p-3 bg-[#0A0C10] border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${p.avatarColor || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center text-xs shadow`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isDeleting ? (
                        <div className="flex items-center space-x-2 bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/30">
                          <span className="text-xs text-rose-300 font-bold">Confermi eliminazione?</span>
                          <button
                            onClick={() => {
                              onDeletePlayer(p);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer"
                          >
                            Sì
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Modifica"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
