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
    <div className="bg-[#14171D] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-6 py-4 bg-[#0A0C10]/60 border-b border-slate-800/80 flex items-center space-x-2">
        <Swords className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">Scontri Diretti (Head to Head)</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Player Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0A0C10] p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-400">Giocatore A:</span>
            <select
              value={p1Id}
              onChange={(e) => setP1Id(e.target.value)}
              className="flex-1 bg-[#14171D] border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#0A0C10] p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-400">Giocatore B:</span>
            <select
              value={p2Id}
              onChange={(e) => setP2Id(e.target.value)}
              className="flex-1 bg-[#14171D] border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
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
          <div className="bg-[#0A0C10] rounded-2xl border border-slate-800/80 p-6 space-y-6">
            <div className="flex items-center justify-between text-center">
              {/* Player 1 Card */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl ${p1.avatarColor || 'bg-blue-600'} text-white font-extrabold text-xl flex items-center justify-center shadow-lg border-2 border-white/20`}
                >
                  {p1.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="font-bold text-white text-base">{p1.name}</div>
                <div className="text-3xl font-mono font-black text-blue-400 mt-2">{p1Wins} V</div>
              </div>

              {/* VS Divider */}
              <div className="px-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#14171D] border border-slate-800 flex items-center justify-center font-mono font-black text-slate-400 text-sm">
                  VS
                </div>
                <span className="text-xs font-mono text-slate-500 font-bold mt-2">
                  {h2hMatches.length} Sfide
                </span>
              </div>

              {/* Player 2 Card */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl ${p2.avatarColor || 'bg-indigo-600'} text-white font-extrabold text-xl flex items-center justify-center shadow-lg border-2 border-white/20`}
                >
                  {p2.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="font-bold text-white text-base">{p2.name}</div>
                <div className="text-3xl font-mono font-black text-blue-400 mt-2">{p2Wins} V</div>
              </div>
            </div>

            {/* Goals stats bar */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300 uppercase">
                <span>{p1.name}: {p1Goals} Gol</span>
                <span className="text-slate-500">Totale Gol Diretti</span>
                <span>{p2.name}: {p2Goals} Gol</span>
              </div>
              <div className="w-full bg-[#14171D] h-3 rounded-full overflow-hidden flex border border-slate-800/60">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{
                    width: `${
                      p1Goals + p2Goals > 0
                        ? (p1Goals / (p1Goals + p2Goals)) * 100
                        : 50
                    }%`,
                  }}
                />
                <div
                  className="bg-indigo-500 h-full transition-all"
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
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500">Storico Scontri Diretti</h4>
              {h2hMatches.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">Nessuno scontro diretto registrato tra questi due colleghi.</p>
              ) : (
                <div className="space-y-2">
                  {h2hMatches.map((m) => {
                    const isP1Winner = m.winnerId === p1.id;
                    return (
                      <div
                        key={m.id}
                        className="p-3 bg-[#14171D] border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className={isP1Winner ? 'font-bold text-blue-400' : 'text-slate-400'}>
                          {m.player1Id === p1.id ? p1.name : p2.name}
                        </span>
                        <span className="font-mono font-bold text-white bg-[#0A0C10] px-2.5 py-1 rounded border border-slate-800 text-sm">
                          {m.score1} - {m.score2}
                        </span>
                        <span className={!isP1Winner ? 'font-bold text-blue-400' : 'text-slate-400'}>
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
          <div className="text-center py-8 text-slate-500 text-sm">
            Seleziona due colleghi differenti per confrontare i loro scontri diretti.
          </div>
        )}
      </div>
    </div>
  );
};
