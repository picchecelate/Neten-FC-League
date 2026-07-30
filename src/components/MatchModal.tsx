import React, { useState } from 'react';
import { Player, Match, QuickPoint } from '../types';
import { X, Trophy, Swords, Zap, Check, AlertCircle } from 'lucide-react';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddMatch: (match: Omit<Match, 'id'>) => void;
  onAddQuickPoint: (quickPoint: Omit<QuickPoint, 'id'>) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  players,
  onAddMatch,
  onAddQuickPoint,
}) => {
  const [tab, setTab] = useState<'1v1' | 'QUICK'>('1v1');

  // 1v1 state
  const [player1Id, setPlayer1Id] = useState<string>(players[0]?.id || '');
  const [player2Id, setPlayer2Id] = useState<string>(players[1]?.id || '');
  const [score1, setScore1] = useState<number>(2);
  const [score2, setScore2] = useState<number>(1);
  const [winType, setWinType] = useState<'REGULAR' | 'PENALTIES'>('REGULAR');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Quick point state
  const [quickPlayerId, setQuickPlayerId] = useState<string>(players[0]?.id || '');
  const [quickType, setQuickType] = useState<'REGULAR' | 'PENALTIES' | 'LOSS'>('REGULAR');
  const [quickNotes, setQuickNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSave1v1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!player1Id || !player2Id) {
      setError('Seleziona entrambi i giocatori.');
      return;
    }

    if (player1Id === player2Id) {
      setError('Un giocatore non può sfidare se stesso! Seleziona due colleghi differenti.');
      return;
    }

    let winnerId = '';
    let loserId = '';

    if (score1 > score2) {
      winnerId = player1Id;
      loserId = player2Id;
    } else if (score2 > score1) {
      winnerId = player2Id;
      loserId = player1Id;
    } else {
      // Tie score
      if (winType === 'REGULAR') {
        setError('In caso di pareggio nei gol, la partita deve essere vinta ai rigori!');
        return;
      }
    }

    onAddMatch({
      date: new Date().toISOString(),
      player1Id,
      player2Id,
      score1,
      score2,
      winType,
      winnerId: winnerId || player1Id,
      loserId: loserId || player2Id,
      notes,
    });

    onClose();
  };

  const handleSaveQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPlayerId) return;

    let points: 3 | 2 | 0 = 3;
    if (quickType === 'PENALTIES') points = 2;
    if (quickType === 'LOSS') points = 0;

    onAddQuickPoint({
      date: new Date().toISOString(),
      playerId: quickPlayerId,
      points,
      type: quickType,
      notes: quickNotes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0C10]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#14171D] border border-slate-800/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0A0C10] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Registra Risultato Partita</h3>
              <p className="text-xs font-mono text-slate-500">FC 2026 Neten League</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-2 bg-[#0A0C10]/60 border-b border-slate-800/80 text-sm font-bold text-center">
          <button
            type="button"
            onClick={() => setTab('1v1')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === '1v1'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Sfida 1 vs 1
          </button>
          <button
            type="button"
            onClick={() => setTab('QUICK')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'QUICK'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            Punti Rapidi Singoli
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form 1v1 */}
        {tab === '1v1' && (
          <form onSubmit={handleSave1v1} className="p-6 space-y-5">
            {/* Player 1 & Player 2 Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Giocatore 1</label>
                <select
                  value={player1Id}
                  onChange={(e) => setPlayer1Id(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm cursor-pointer"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Player 2 Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Giocatore 2</label>
                <select
                  value={player2Id}
                  onChange={(e) => setPlayer2Id(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm cursor-pointer"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score Entry */}
            <div className="bg-[#0A0C10] p-4 rounded-2xl border border-slate-800/80 text-center space-y-3">
              <div className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500">Punteggio Finale (Gol)</div>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={score1}
                    onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                    className="w-16 h-14 bg-[#14171D] border-2 border-blue-500/50 rounded-xl text-center text-2xl font-black text-white focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>
                <span className="text-2xl font-black text-slate-600">-</span>
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={score2}
                    onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                    className="w-16 h-14 bg-[#14171D] border-2 border-blue-500/50 rounded-xl text-center text-2xl font-black text-white focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Win Type Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Modalità Vittoria</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWinType('REGULAR')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    winType === 'REGULAR'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-blue-400 flex items-center justify-between">
                    <span>Tempi Regolamentari</span>
                    <span className="text-xs font-black bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">+3 PT</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Vittoria nei 90 min (3 pt al vincitore, 0 al perdente)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setWinType('PENALTIES')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    winType === 'PENALTIES'
                      ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-indigo-300 flex items-center justify-between">
                    <span>Ai Rigori</span>
                    <span className="text-xs font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded font-mono">+2 PT</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Vittoria ai calci di rigore (2 pt al vincitore, 0 al perdente)</p>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Note / Dettagli (opzionale)</label>
              <input
                type="text"
                placeholder="Es. Gol allo scadere, rigore decisivo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                Salva Partita
              </button>
            </div>
          </form>
        )}

        {/* Form Quick Points */}
        {tab === 'QUICK' && (
          <form onSubmit={handleSaveQuick} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Seleziona Giocatore</label>
              <select
                value={quickPlayerId}
                onChange={(e) => setQuickPlayerId(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Esito Partita</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setQuickType('REGULAR')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    quickType === 'REGULAR'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-blue-400">Vittoria Tempi Regolamentari</div>
                    <div className="text-xs text-slate-500">Vittoria standard nei 90 minuti</div>
                  </div>
                  <span className="font-mono font-bold text-sm bg-blue-600 text-white px-2 py-1 rounded-lg">
                    +3 PT
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickType('PENALTIES')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    quickType === 'PENALTIES'
                      ? 'bg-indigo-500/20 border-indigo-500 text-white'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-indigo-300">Vittoria ai Rigori</div>
                    <div className="text-xs text-slate-500">Vittoria dopo i calci di rigore</div>
                  </div>
                  <span className="font-mono font-bold text-sm bg-indigo-500 text-white px-2 py-1 rounded-lg">
                    +2 PT
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickType('LOSS')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    quickType === 'LOSS'
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-300">Sconfitta</div>
                    <div className="text-xs text-slate-500">Nessun punto assegnato</div>
                  </div>
                  <span className="font-mono font-bold text-sm bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">
                    0 PT
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Note (opzionale)</label>
              <input
                type="text"
                placeholder="Es. Sfida amichevole pausa pranzo"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Assegna Punti
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
