import React, { useState } from 'react';
import { Match, QuickPoint, Player } from '../types';
import { History, Swords, Zap, Trash2, Calendar, Shield, Filter } from 'lucide-react';

interface MatchHistoryProps {
  matches: Match[];
  quickPoints: QuickPoint[];
  players: Player[];
  onDeleteMatch: (matchId: string) => void;
  onDeleteQuickPoint: (pointId: string) => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  matches,
  quickPoints,
  players,
  onDeleteMatch,
  onDeleteQuickPoint,
}) => {
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string>('ALL');

  const getPlayerName = (id: string) => {
    return players.find((p) => p.id === id)?.name || 'Giocatore Sconosciuto';
  };

  const filteredMatches = matches.filter((m) => {
    if (selectedPlayerFilter === 'ALL') return true;
    return m.player1Id === selectedPlayerFilter || m.player2Id === selectedPlayerFilter;
  });

  const filteredQuickPoints = quickPoints.filter((qp) => {
    if (selectedPlayerFilter === 'ALL') return true;
    return qp.playerId === selectedPlayerFilter;
  });

  const totalEntries = filteredMatches.length + filteredQuickPoints.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4">
      {/* Header & Filter */}
      <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono">Storico Partite & Inserimenti</h2>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            {totalEntries}
          </span>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedPlayerFilter}
            onChange={(e) => setSelectedPlayerFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
          >
            <option value="ALL">Tutti i Colleghi</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-6 space-y-3">
        {totalEntries === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Nessuna partita o inserimento registrato per questo filtro.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Render 1v1 Matches */}
            {filteredMatches.map((m) => {
              const p1Name = getPlayerName(m.player1Id);
              const p2Name = getPlayerName(m.player2Id);
              const winnerName = getPlayerName(m.winnerId);
              const dateStr = new Date(m.date).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={m.id}
                  className="p-3.5 sm:p-4 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-700 border border-emerald-200 shrink-0">
                      <Swords className="w-5 h-5" />
                    </div>

                    <div>
                      {/* Players */}
                      <div className="flex items-center space-x-2 text-sm sm:text-base font-bold text-slate-900">
                        <span className={m.winnerId === m.player1Id ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}>
                          {p1Name}
                        </span>
                        
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-mono font-black shadow-2xs">
                          {m.score1} - {m.score2}
                        </span>

                        <span className={m.winnerId === m.player2Id ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}>
                          {p2Name}
                        </span>
                      </div>

                      {/* Details badge & date */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            m.winType === 'REGULAR'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {m.winType === 'REGULAR'
                            ? `Vittoria Regolare (+3 PT a ${winnerName})`
                            : `Vittoria ai Rigori (+2 PT a ${winnerName})`}
                        </span>

                        {m.notes && <span className="italic text-slate-400">"{m.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteMatch(m.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Elimina partita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Render Quick Points */}
            {filteredQuickPoints.map((qp) => {
              const playerName = getPlayerName(qp.playerId);
              const dateStr = new Date(qp.date).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={qp.id}
                  className="p-3.5 sm:p-4 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-100/70 text-indigo-700 border border-indigo-200 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-900">
                        <span>Punti Rapidi: <strong className="text-emerald-700 font-extrabold">{playerName}</strong></span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            qp.type === 'REGULAR'
                              ? 'bg-emerald-600 text-white'
                              : qp.type === 'PENALTIES'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          +{qp.points} PT
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                        {qp.notes && <span className="italic text-slate-400">"{qp.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteQuickPoint(qp.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Elimina punto rapido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
