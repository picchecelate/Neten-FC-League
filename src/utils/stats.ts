import { Player, Match, QuickPoint, PlayerStats } from '../types';

export function calculatePlayerStats(
  players: Player[],
  matches: Match[],
  quickPoints: QuickPoint[] = []
): PlayerStats[] {
  const statsMap: Record<string, PlayerStats> = {};

  // Initialize stats for each player
  players.forEach((player) => {
    statsMap[player.id] = {
      player,
      played: 0,
      winsRegular: 0,
      winsPenalties: 0,
      losses: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      winRate: 0,
      recentForm: [],
    };
  });

  // Sort matches chronologically to track form correctly
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedMatches.forEach((match) => {
    const p1Stats = statsMap[match.player1Id];
    const p2Stats = statsMap[match.player2Id];

    if (p1Stats) {
      p1Stats.played += 1;
      p1Stats.goalsFor += match.score1;
      p1Stats.goalsAgainst += match.score2;
      if (match.winnerId === match.player1Id) {
        if (match.winType === 'REGULAR') {
          p1Stats.winsRegular += 1;
          p1Stats.points += 3;
          p1Stats.recentForm.push('W3');
        } else {
          p1Stats.winsPenalties += 1;
          p1Stats.points += 2;
          p1Stats.recentForm.push('W2');
        }
      } else {
        p1Stats.losses += 1;
        p1Stats.recentForm.push('L');
      }
    }

    if (p2Stats) {
      p2Stats.played += 1;
      p2Stats.goalsFor += match.score2;
      p2Stats.goalsAgainst += match.score1;
      if (match.winnerId === match.player2Id) {
        if (match.winType === 'REGULAR') {
          p2Stats.winsRegular += 1;
          p2Stats.points += 3;
          p2Stats.recentForm.push('W3');
        } else {
          p2Stats.winsPenalties += 1;
          p2Stats.points += 2;
          p2Stats.recentForm.push('W2');
        }
      } else {
        p2Stats.losses += 1;
        p2Stats.recentForm.push('L');
      }
    }
  });

  // Apply Quick Points if any exist
  quickPoints.forEach((qp) => {
    const pStats = statsMap[qp.playerId];
    if (pStats) {
      pStats.played += 1;
      if (qp.type === 'REGULAR') {
        pStats.winsRegular += 1;
        pStats.points += 3;
        pStats.recentForm.push('W3');
      } else if (qp.type === 'PENALTIES') {
        pStats.winsPenalties += 1;
        pStats.points += 2;
        pStats.recentForm.push('W2');
      } else {
        pStats.losses += 1;
        pStats.recentForm.push('L');
      }
    }
  });

  // Calculate final derived stats (Goal Diff, Win Rate, trim Form to last 5)
  return Object.values(statsMap)
    .map((s) => {
      s.goalDifference = s.goalsFor - s.goalsAgainst;
      const totalWins = s.winsRegular + s.winsPenalties;
      s.winRate = s.played > 0 ? Math.round((totalWins / s.played) * 100) : 0;
      s.recentForm = s.recentForm.slice(-5);
      return s;
    })
    .sort((a, b) => {
      // 1. Points
      if (b.points !== a.points) return b.points - a.points;
      // 2. Goal Difference
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      // 3. Goals For
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      // 4. Wins in Regular Time
      if (b.winsRegular !== a.winsRegular) return b.winsRegular - a.winsRegular;
      // 5. Total Wins
      const totalWinsB = b.winsRegular + b.winsPenalties;
      const totalWinsA = a.winsRegular + a.winsPenalties;
      if (totalWinsB !== totalWinsA) return totalWinsB - totalWinsA;
      // 6. Name
      return a.player.name.localeCompare(b.player.name);
    });
}
