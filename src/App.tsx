import React, { useState, useEffect } from 'react';
import { Player, Match, QuickPoint } from './types';
import { INITIAL_PLAYERS, INITIAL_MATCHES } from './data/initialData';
import { calculatePlayerStats } from './utils/stats';
import { Header } from './components/Header';
import { LeaderboardTable } from './components/LeaderboardTable';
import { StatsOverview } from './components/StatsOverview';
import { MatchModal } from './components/MatchModal';
import { PlayerManagerModal } from './components/PlayerManagerModal';
import { ResetModal } from './components/ResetModal';
import { MatchHistory } from './components/MatchHistory';
import { HeadToHead } from './components/HeadToHead';
import { Trophy, History, Swords, Plus, RotateCcw, Shield, PlusCircle } from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'neten_fc_players_v1';
const STORAGE_KEY_MATCHES = 'neten_fc_matches_v1';
const STORAGE_KEY_QUICKPOINTS = 'neten_fc_quickpoints_v1';

export default function App() {
  // Load initial state from LocalStorage or Fallbacks
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [quickPoints, setQuickPoints] = useState<QuickPoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUICKPOINTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'HISTORY' | 'H2H'>('LEADERBOARD');

  // Modals state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUICKPOINTS, JSON.stringify(quickPoints));
  }, [quickPoints]);

  // Compute live statistics
  const stats = calculatePlayerStats(players, matches, quickPoints);
  const topPlayer = stats[0]?.player.name;

  // Handlers for Match & Points
  const handleAddMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleAddQuickPoint = (quickData: Omit<QuickPoint, 'id'>) => {
    const newPoint: QuickPoint = {
      ...quickData,
      id: `qp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setQuickPoints((prev) => [newPoint, ...prev]);
  };

  const handleQuickAddPointsDirect = (
    playerId: string,
    points: 3 | 2 | 0,
    type: 'REGULAR' | 'PENALTIES' | 'LOSS'
  ) => {
    handleAddQuickPoint({
      date: new Date().toISOString(),
      playerId,
      points,
      type,
      notes: 'Inserimento rapido da classifica',
    });
  };

  const handleDeleteMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const handleDeleteQuickPoint = (pointId: string) => {
    setQuickPoints((prev) => prev.filter((qp) => qp.id !== pointId));
  };

  // Handlers for Players
  const handleAddPlayer = (playerData: Omit<Player, 'id' | 'createdAt'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
  };

  const handleDeletePlayer = (playerToDelete: Player) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerToDelete.id));
    // Optionally filter matches where player participated or leave as is
    setMatches((prev) =>
      prev.filter(
        (m) => m.player1Id !== playerToDelete.id && m.player2Id !== playerToDelete.id
      )
    );
    setQuickPoints((prev) => prev.filter((qp) => qp.playerId !== playerToDelete.id));
  };

  // Reset & Export/Import
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setPlayers(INITIAL_PLAYERS);
    setMatches([]);
    setQuickPoints([]);
    localStorage.removeItem(STORAGE_KEY_MATCHES);
    localStorage.removeItem(STORAGE_KEY_QUICKPOINTS);
  };

  const handleExportData = () => {
    const data = {
      players,
      matches,
      quickPoints,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neten-fc-2026-classifica-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.players && Array.isArray(parsed.players)) {
          setPlayers(parsed.players);
        }
        if (parsed.matches && Array.isArray(parsed.matches)) {
          setMatches(parsed.matches);
        }
        if (parsed.quickPoints && Array.isArray(parsed.quickPoints)) {
          setQuickPoints(parsed.quickPoints);
        }
        alert('Dati importati con successo!');
      } catch (err) {
        alert('Errore durante il caricamento del file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white flex flex-col">
      {/* Top Header Navigation */}
      <Header
        onOpenMatchModal={() => setIsMatchModalOpen(true)}
        onOpenPlayerModal={() => setIsPlayerModalOpen(true)}
        onResetData={handleOpenResetModal}
        onExportData={handleExportData}
        onImportData={handleImportData}
        totalMatches={matches.length + quickPoints.length}
        totalPlayers={players.length}
        topPlayerName={topPlayer}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-24 sm:pb-6 space-y-4 sm:space-y-6">
        
        {/* Navigation Tabs (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Classifica FC 2026
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <History className="w-4 h-4 text-blue-500" />
              Storico Partite
            </button>

            <button
              onClick={() => setActiveTab('H2H')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'H2H'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Swords className="w-4 h-4 text-indigo-500" />
              Scontri Diretti
            </button>
          </div>

          <div className="flex items-center text-xs text-slate-500 font-mono uppercase tracking-widest bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60 font-semibold">
            EA SPORTS FC 2026 &bull; Neten League
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'LEADERBOARD' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <StatsOverview stats={stats} />

            <LeaderboardTable stats={stats} />
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="animate-fadeIn">
            <MatchHistory
              matches={matches}
              quickPoints={quickPoints}
              players={players}
              onDeleteMatch={handleDeleteMatch}
              onDeleteQuickPoint={handleDeleteQuickPoint}
            />
          </div>
        )}

        {activeTab === 'H2H' && (
          <div className="animate-fadeIn">
            <HeadToHead players={players} matches={matches} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">EA SPORTS FC 2026 &bull; Neten League &bull; Regolamento: +3 Tempi Regolamentari, +2 Rigori, 0 Sconfitta</span>
          <span className="text-slate-400 font-mono">Powered for Neten FC 2026</span>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">
          {/* Action Button: Inserisci Risultato / Nuova Partita (Far Left) */}
          <button
            id="btn-mobile-add-match"
            onClick={() => setIsMatchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
            title="Inserisci nuovo risultato partita o punti"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span className="text-[10px] font-black tracking-tight mt-0.5 whitespace-nowrap">+ Partita</span>
          </button>

          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'LEADERBOARD' ? 'text-emerald-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <Trophy className={`w-5 h-5 ${activeTab === 'LEADERBOARD' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">Classifica</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'HISTORY' ? 'text-emerald-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <History className={`w-5 h-5 ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">Storico</span>
          </button>

          <button
            onClick={() => setActiveTab('H2H')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'H2H' ? 'text-emerald-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <Swords className={`w-5 h-5 ${activeTab === 'H2H' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">Scontri</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        players={players}
        onAddMatch={handleAddMatch}
        onAddQuickPoint={handleAddQuickPoint}
      />

      <PlayerManagerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        players={players}
        onAddPlayer={handleAddPlayer}
        onUpdatePlayer={handleUpdatePlayer}
        onDeletePlayer={handleDeletePlayer}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
