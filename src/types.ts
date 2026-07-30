export type WinType = 'REGULAR' | 'PENALTIES' | 'LOSS';

export interface Player {
  id: string;
  name: string;
  avatarColor?: string;
  createdAt: string;
}

export interface Match {
  id: string;
  date: string;
  player1Id: string;
  player2Id: string;
  score1: number;
  score2: number;
  winType: 'REGULAR' | 'PENALTIES'; // REGULAR = +3 for winner, PENALTIES = +2 for winner, 0 for loser
  winnerId: string;
  loserId: string;
  notes?: string;
}

export interface QuickPoint {
  id: string;
  date: string;
  playerId: string;
  points: 3 | 2 | 0;
  type: WinType;
  opponentName?: string;
  notes?: string;
}

export interface PlayerStats {
  player: Player;
  played: number;
  winsRegular: number; // +3 pts
  winsPenalties: number; // +2 pts
  losses: number; // 0 pts
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  winRate: number;
  recentForm: ('W3' | 'W2' | 'L')[];
}
