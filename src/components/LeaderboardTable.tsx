import React from 'react';
import { PlayerStats } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  stats: PlayerStats[];
  onSelectPlayerDetail?: (playerId: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  stats,
}) => {
  return (
    <div className="bg-[#14171D] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Info Banner */}
      <div className="px-6 py-4 bg-[#0A0C10]/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Classifica Generale</h2>
          <span className="text-xs font-mono bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-800/50">
            {stats.length} Giocatori
          </span>
        </div>
        
        {/* Rules legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <strong className="text-blue-400 font-bold">+3 Pt</strong> Vittoria Regolare
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
            <strong className="text-indigo-300 font-bold">+2 Pt</strong> Vittoria Rigori
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-slate-600 inline-block"></span>
            <strong className="text-slate-400 font-bold">0 Pt</strong> Sconfitta
          </span>
        </div>
      </div>

      {/* Responsive Table (Tablet/Desktop) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0C10]/40 text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold border-b border-slate-800/80">
              <th className="py-3.5 px-4 text-center w-12">Pos</th>
              <th className="py-3.5 px-4">Giocatore</th>
              <th className="py-3.5 px-4 text-center font-bold text-blue-400 bg-blue-950/10 border-x border-slate-800/80">Punti</th>
              <th className="py-3.5 px-4 text-center">PG</th>
              <th className="py-3.5 px-4 text-center text-blue-400" title="Vittorie nei tempi regolamentari (+3 pt)">V (+3)</th>
              <th className="py-3.5 px-4 text-center text-indigo-300" title="Vittorie ai rigori (+2 pt)">VR (+2)</th>
              <th className="py-3.5 px-4 text-center text-slate-400" title="Sconfitte (0 pt)">S (0)</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">GF:GS</th>
              <th className="py-3.5 px-4 text-center">DG</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell">% Win</th>
              <th className="py-3.5 px-4 text-center hidden sm:table-cell">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {stats.map((item, index) => {
              const rank = index + 1;
              const initials = item.player.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <tr
                  key={item.player.id}
                  className={`hover:bg-slate-800/30 transition-colors group ${
                    rank === 1 ? 'bg-gradient-to-r from-amber-500/5 via-transparent to-transparent' : ''
                  }`}
                >
                  {/* Position Badge */}
                  <td className="py-4 px-4 text-center font-black">
                    <div className="flex items-center justify-center">
                      {rank === 1 && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50">
                          1°
                        </div>
                      )}
                      {rank === 2 && (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-sm">
                          2°
                        </div>
                      )}
                      {rank === 3 && (
                        <div className="w-8 h-8 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center justify-center font-bold text-sm">
                          3°
                        </div>
                      )}
                      {rank > 3 && (
                        <span className="text-slate-500 font-mono text-xs font-bold">
                          {rank}°
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Player Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${item.player.avatarColor || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center shadow-md text-xs border border-white/20`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 text-base flex items-center gap-2">
                          <span>{item.player.name}</span>
                          {rank === 1 && (
                            <span className="inline-flex items-center text-[9px] font-mono bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/30 uppercase tracking-widest">
                              Capolista
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Points (Main Focus) */}
                  <td className="py-4 px-4 text-center font-black text-xl text-blue-400 bg-blue-950/10 border-x border-slate-800/80 font-mono">
                    <span className="inline-block bg-blue-600/10 px-3 py-1 rounded-xl border border-blue-500/30 shadow-inner">
                      {item.points}
                    </span>
                  </td>

                  {/* Played */}
                  <td className="py-4 px-4 text-center font-bold text-slate-200 font-mono">
                    {item.played}
                  </td>

                  {/* Wins Regular (+3) */}
                  <td className="py-4 px-4 text-center font-bold text-blue-400 font-mono">
                    {item.winsRegular}
                  </td>

                  {/* Wins Penalties (+2) */}
                  <td className="py-4 px-4 text-center font-bold text-indigo-300 font-mono">
                    {item.winsPenalties}
                  </td>

                  {/* Losses */}
                  <td className="py-4 px-4 text-center font-medium text-slate-500 font-mono">
                    {item.losses}
                  </td>

                  {/* GF:GS */}
                  <td className="py-4 px-4 text-center text-slate-400 font-mono text-xs hidden md:table-cell">
                    {item.goalsFor} : {item.goalsAgainst}
                  </td>

                  {/* Goal Difference */}
                  <td className="py-4 px-4 text-center font-bold font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-md ${
                        item.goalDifference > 0
                          ? 'bg-blue-500/10 text-blue-400 font-bold'
                          : item.goalDifference < 0
                          ? 'bg-rose-500/10 text-rose-400 font-bold'
                          : 'bg-slate-800/50 text-slate-500'
                      }`}
                    >
                      {item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference}
                    </span>
                  </td>

                  {/* Win Rate */}
                  <td className="py-4 px-4 text-center font-semibold text-slate-400 text-xs font-mono hidden lg:table-cell">
                    {item.winRate}%
                  </td>

                  {/* Form Icons (Last 5) */}
                  <td className="py-4 px-4 text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {item.recentForm.length === 0 ? (
                        <span className="text-slate-600 text-xs font-mono">-</span>
                      ) : (
                        item.recentForm.map((f, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                              f === 'W3'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : f === 'W2'
                                ? 'bg-indigo-500 text-white shadow-sm'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                            title={
                              f === 'W3'
                                ? 'Vittoria Regolare (+3)'
                                : f === 'W2'
                                ? 'Vittoria ai Rigori (+2)'
                                : 'Sconfitta (0)'
                            }
                          >
                            {f === 'W3' ? 'V' : f === 'W2' ? 'VR' : 'S'}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Smartphone Optimized View */}
      <div className="sm:hidden divide-y divide-slate-800/60">
        {stats.map((item, index) => {
          const rank = index + 1;
          const initials = item.player.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={item.player.id}
              className={`p-3.5 space-y-2.5 transition-colors ${
                rank === 1 ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent' : ''
              }`}
            >
              {/* Row Top: Pos + Avatar + Name + Points */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="shrink-0">
                    {rank === 1 && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/20">
                        1°
                      </div>
                    )}
                    {rank === 2 && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs">
                        2°
                      </div>
                    )}
                    {rank === 3 && (
                      <div className="w-7 h-7 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center justify-center font-bold text-xs">
                        3°
                      </div>
                    )}
                    {rank > 3 && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold">
                        {rank}°
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-lg ${item.player.avatarColor || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center shadow-sm text-xs border border-white/20 shrink-0`}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 text-sm truncate flex items-center gap-1.5">
                      <span>{item.player.name}</span>
                      {rank === 1 && (
                        <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 font-bold px-1 rounded border border-amber-500/30 uppercase">
                          1°
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.played} Partite &bull; {item.winRate}% Win
                    </div>
                  </div>
                </div>

                {/* Points Pill */}
                <div className="shrink-0 text-right">
                  <span className="inline-block bg-blue-600/20 text-blue-400 font-mono font-black text-lg px-3 py-1 rounded-xl border border-blue-500/40 shadow-sm">
                    {item.points} <span className="text-[10px] font-bold">PT</span>
                  </span>
                </div>
              </div>

              {/* Row Bottom: Stats Breakdown Chips */}
              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold" title="Vittorie Regolari (+3)">
                    {item.winsRegular}V (+3)
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-indigo-300 font-bold" title="Vittorie Rigori (+2)">
                    {item.winsPenalties}VR (+2)
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-400" title="Sconfitte">
                    {item.losses}S
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[10px]">DG:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                      item.goalDifference > 0
                        ? 'bg-blue-500/10 text-blue-400'
                        : item.goalDifference < 0
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
