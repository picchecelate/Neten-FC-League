import React, { useState } from 'react';
import { Player, Match } from '../types';
import { Swords, Trophy, Flame, Shield } from 'lucide-react';

interface HeadToHeadProps {
  players: Player[];
  matches: Match[];
}

export const HeadToHead: React.FC<HeadToHeadProps> = ({ players, matches }) => {
  const [p1Id, setP1Id] = useState<string>(players[0]?.id || '');
  const [p2Id, setP2Id] = useState<string>(players[1]?.id || '');

  const p1 = players.find((p) => p.id === p1Id);
  const p2 = players.find((p) => p.id === p2Id);

  // Filter matches between these 2 players
  const h2hMatches = matches.filter(
    (m) =>
      (m.player1Id === p1Id && m.player2Id === p2Id) ||
      (m.player1Id === p2Id && m.player2Id === p1Id)
  );

  let p1Wins = 0;
  let p2Wins = 0;
  let p1Goals = 0;
  let p2Goals = 0;

  h2hMatches.forEach((m) => {
    if (m.winnerId === p1Id) p1Wins += 1;
    if (m.winnerId === p2Id) p2Wins += 1;

    if (m.player1Id === p1Id) {
      p1Goals += m.score1;
      p2Goals += m.score2;
    } else if (m.player2Id === p1Id) {
      p1Goals += m.score2;
      p2Goals += m.score1;
    }
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-2">
        <Swords className="w-5 h-5 text-emerald-600" />
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono">Scontri Diretti FC 2026 (Head to Head)</h2>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-500 shrink-0">Giocatore A:</span>
            <select
              value={p1Id}
              onChange={(e) => setP1Id(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-500 shrink-0">Giocatore B:</span>
            <select
              value={p2Id}
              onChange={(e) => setP2Id(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Board */}
        {p1 && p2 && p1.id !== p2.id ? (
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between text-center">
              {/* Player 1 Card */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl ${p1.avatarColor || 'bg-emerald-600'} text-white font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-white`}
                >
                  {p1.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">{p1.name}</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 mt-1">{p1Wins} V</div>
              </div>

              {/* VS Divider */}
              <div className="px-3 sm:px-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-300 flex items-center justify-center font-mono font-black text-slate-700 text-sm shadow-xs">
                  VS
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-bold mt-2">
                  {h2hMatches.length} Sfide
                </span>
              </div>

              {/* Player 2 Card */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl ${p2.avatarColor || 'bg-indigo-600'} text-white font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-white`}
                >
                  {p2.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">{p2.name}</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 mt-1">{p2Wins} V</div>
              </div>
            </div>

            {/* Goals stats bar */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-700 uppercase">
                <span>{p1.name}: {p1Goals} Gol</span>
                <span className="text-slate-400">Totale Gol Diretti</span>
                <span>{p2.name}: {p2Goals} Gol</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex border border-slate-300">
                <div
                  className="bg-emerald-600 h-full transition-all"
                  style={{
                    width: `${
                      p1Goals + p2Goals > 0
                        ? (p1Goals / (p1Goals + p2Goals)) * 100
                        : 50
                    }%`,
                  }}
                />
                <div
                  className="bg-indigo-600 h-full transition-all"
                  style={{
                    width: `${
                      p1Goals + p2Goals > 0
                        ? (p2Goals / (p1Goals + p2Goals)) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Recent H2H Match list */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-400">Storico Scontri Diretti</h4>
              {h2hMatches.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Nessuno scontro diretto registrato tra questi due colleghi.</p>
              ) : (
                <div className="space-y-2">
                  {h2hMatches.map((m) => {
                    const isP1Winner = m.winnerId === p1.id;
                    return (
                      <div
                        key={m.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                      >
                        <span className={isP1Winner ? 'font-black text-emerald-700' : 'text-slate-500'}>
                          {m.player1Id === p1.id ? p1.name : p2.name}
                        </span>
                        <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-sm">
                          {m.score1} - {m.score2}
                        </span>
                        <span className={!isP1Winner ? 'font-black text-emerald-700' : 'text-slate-500'}>
                          {m.player2Id === p1.id ? p1.name : p2.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            Seleziona due colleghi differenti per confrontare i loro scontri diretti.
          </div>
        )}
      </div>
    </div>
  );
};
