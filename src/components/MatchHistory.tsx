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
    <div className="bg-[#14171D] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden space-y-4">
      {/* Header & Filter */}
      <div className="px-6 py-4 bg-[#0A0C10]/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Storico Partite & Inserimenti</h2>
          <span className="text-xs font-mono bg-blue-950/60 text-blue-400 px-2.5 py-0.5 rounded-full font-bold border border-blue-800/50">
            {totalEntries}
          </span>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedPlayerFilter}
            onChange={(e) => setSelectedPlayerFilter(e.target.value)}
            className="bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
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

      <div className="px-6 pb-6 space-y-3">
        {totalEntries === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
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
                  className="p-4 bg-[#0A0C10] border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0">
                      <Swords className="w-5 h-5" />
                    </div>

                    <div>
                      {/* Players */}
                      <div className="flex items-center space-x-2 text-base font-bold text-white">
                        <span className={m.winnerId === m.player1Id ? 'text-blue-400 font-extrabold' : 'text-slate-300'}>
                          {p1Name}
                        </span>
                        
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-bold">
                          {m.score1} - {m.score2}
                        </span>

                        <span className={m.winnerId === m.player2Id ? 'text-blue-400 font-extrabold' : 'text-slate-300'}>
                          {p2Name}
                        </span>
                      </div>

                      {/* Details badge & date */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            m.winType === 'REGULAR'
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {m.winType === 'REGULAR'
                            ? `Vittoria Regolare (+3 PT a ${winnerName})`
                            : `Vittoria ai Rigori (+2 PT a ${winnerName})`}
                        </span>

                        {m.notes && <span className="italic text-slate-500">"{m.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteMatch(m.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
                  className="p-4 bg-[#0A0C10] border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-sm font-bold text-white">
                        <span>Punti Rapidi: <strong className="text-blue-400 font-extrabold">{playerName}</strong></span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            qp.type === 'REGULAR'
                              ? 'bg-blue-600 text-white'
                              : qp.type === 'PENALTIES'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          +{qp.points} PT
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                        {qp.notes && <span className="italic text-slate-500">"{qp.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteQuickPoint(qp.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
