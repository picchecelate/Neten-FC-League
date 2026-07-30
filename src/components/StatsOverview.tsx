import React from 'react';
import { PlayerStats } from '../types';
import { Target, Trophy, Percent, ShieldAlert, Award, Zap } from 'lucide-react';

interface StatsOverviewProps {
  stats: PlayerStats[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  if (stats.length === 0) return null;

  // Top Scorer (GF)
  const topScorer = [...stats].sort((a, b) => b.goalsFor - a.goalsFor)[0];

  // Penalty King (winsPenalties)
  const penaltyKing = [...stats].sort((a, b) => b.winsPenalties - a.winsPenalties)[0];

  // Best Win Rate (must have played at least 1 match)
  const bestWinRate = [...stats]
    .filter((s) => s.played > 0)
    .sort((a, b) => b.winRate - a.winRate)[0];

  // Best Goal Difference
  const bestGoalDiff = [...stats].sort((a, b) => b.goalDifference - a.goalDifference)[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Top Scorer */}
      <div className="bg-[#14171D] border border-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:border-amber-500/50 transition-all flex items-center space-x-2.5 sm:space-x-3.5">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest font-bold text-slate-500 truncate">
            Capocannoniere
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {topScorer?.goalsFor ? topScorer.player.name : 'Nessun gol'}
          </div>
          <div className="text-[11px] sm:text-xs text-amber-400 font-bold font-mono">
            {topScorer?.goalsFor || 0} Gol
          </div>
        </div>
      </div>

      {/* Penalty King */}
      <div className="bg-[#14171D] border border-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:border-indigo-500/50 transition-all flex items-center space-x-2.5 sm:space-x-3.5">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shrink-0">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest font-bold text-slate-500 truncate">
            Re dei Rigori
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {penaltyKing?.winsPenalties ? penaltyKing.player.name : 'Nessuno'}
          </div>
          <div className="text-[11px] sm:text-xs text-indigo-300 font-bold font-mono">
            {penaltyKing?.winsPenalties || 0} Vittorie
          </div>
        </div>
      </div>

      {/* Best Win Rate */}
      <div className="bg-[#14171D] border border-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:border-blue-500/50 transition-all flex items-center space-x-2.5 sm:space-x-3.5">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30 shrink-0">
          <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest font-bold text-slate-500 truncate">
            % Vittorie
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {bestWinRate ? bestWinRate.player.name : '-'}
          </div>
          <div className="text-[11px] sm:text-xs text-blue-400 font-bold font-mono">
            {bestWinRate?.winRate || 0}%
          </div>
        </div>
      </div>

      {/* Best Goal Difference */}
      <div className="bg-[#14171D] border border-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:border-blue-500/50 transition-all flex items-center space-x-2.5 sm:space-x-3.5">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30 shrink-0">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest font-bold text-slate-500 truncate">
            Diff. Gol
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {bestGoalDiff ? bestGoalDiff.player.name : '-'}
          </div>
          <div className="text-[11px] sm:text-xs text-blue-400 font-bold font-mono">
            {bestGoalDiff && bestGoalDiff.goalDifference > 0
              ? `+${bestGoalDiff.goalDifference}`
              : bestGoalDiff?.goalDifference || 0}{' '}
            DG
          </div>
        </div>
      </div>
    </div>
  );
};
