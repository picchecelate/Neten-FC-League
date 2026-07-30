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
  const [penaltyWinnerId, setPenaltyWinnerId] = useState<string>(players[0]?.id || '');
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

    if (winType === 'PENALTIES') {
      const pWinner = penaltyWinnerId === player2Id ? player2Id : player1Id;
      winnerId = pWinner;
      loserId = pWinner === player1Id ? player2Id : player1Id;
    } else {
      if (score1 > score2) {
        winnerId = player1Id;
        loserId = player2Id;
      } else if (score2 > score1) {
        winnerId = player2Id;
        loserId = player1Id;
      } else {
        setError('I tempi regolamentari sono finiti in pareggio! Seleziona la modalità "Ai Rigori" e indica il vincitore dei rigori.');
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
      winnerId,
      loserId,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-mono">Registra Risultato Partita</h3>
              <p className="text-[11px] sm:text-xs font-mono text-slate-500 font-bold">EA SPORTS FC 2026 Neten League</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setTab('1v1')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === '1v1'
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Swords className="w-4 h-4" />
            Sfida 1 vs 1
          </button>
          <button
            type="button"
            onClick={() => setTab('QUICK')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'QUICK'
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            Punti Rapidi Singoli
          </button>
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form 1v1 */}
        {tab === '1v1' && (
          <form onSubmit={handleSave1v1} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Player 1 & Player 2 Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">Giocatore 1</label>
                  <select
                    value={player1Id}
                    onChange={(e) => setPlayer1Id(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm cursor-pointer shadow-xs"
                  >
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Player 2 Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">Giocatore 2</label>
                  <select
                    value={player2Id}
                    onChange={(e) => setPlayer2Id(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm cursor-pointer shadow-xs"
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
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center space-y-2.5">
                <div className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-600">
                  Punteggio Tempi Regolamentari (Gol)
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-1">
                  Questi gol faranno fede per le statistiche di GF, GS e DG.
                </p>
                <div className="flex items-center justify-center space-x-4 pt-1">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 font-bold mb-1 truncate max-w-[100px]">
                      {players.find((p) => p.id === player1Id)?.name || 'Giocatore 1'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={score1}
                      onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                      className="w-14 h-12 sm:w-16 sm:h-14 bg-white border-2 border-emerald-500 rounded-xl text-center text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
                    />
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-400 self-end mb-2 sm:mb-3">-</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 font-bold mb-1 truncate max-w-[100px]">
                      {players.find((p) => p.id === player2Id)?.name || 'Giocatore 2'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={score2}
                      onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                      className="w-14 h-12 sm:w-16 sm:h-14 bg-white border-2 border-emerald-500 rounded-xl text-center text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Win Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">Modalità Esito</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setWinType('REGULAR')}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      winType === 'REGULAR'
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-emerald-800 flex items-center justify-between">
                      <span>Tempi Regolamentari</span>
                      <span className="text-[10px] sm:text-xs font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">+3 PT</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">Vittoria nei 90 min (3 pt al vincitore)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWinType('PENALTIES');
                      if (!penaltyWinnerId || (penaltyWinnerId !== player1Id && penaltyWinnerId !== player2Id)) {
                        setPenaltyWinnerId(player1Id);
                      }
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      winType === 'PENALTIES'
                        ? 'bg-indigo-50 border-indigo-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-indigo-700 flex items-center justify-between">
                      <span>Ai Rigori</span>
                      <span className="text-[10px] sm:text-xs font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded font-mono">+2 PT</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">Vittoria ai rigori (2 pt al vincitore)</p>
                  </button>
                </div>
              </div>

              {/* Penalty Winner Selector (Visible when WinType is PENALTIES) */}
              {winType === 'PENALTIES' && (
                <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider font-black text-indigo-900 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-indigo-600" />
                      Vincitore ai Rigori (+2 PT)
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPenaltyWinnerId(player1Id)}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        penaltyWinnerId === player1Id || (penaltyWinnerId !== player2Id)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-black'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {penaltyWinnerId === player1Id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span className="truncate">{players.find((p) => p.id === player1Id)?.name || 'Giocatore 1'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPenaltyWinnerId(player2Id)}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        penaltyWinnerId === player2Id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-black'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {penaltyWinnerId === player2Id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span className="truncate">{players.find((p) => p.id === player2Id)?.name || 'Giocatore 2'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Note / Dettagli (opzionale)</label>
                <input
                  type="text"
                  placeholder="Es. Gol allo scadere, rigore decisivo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Salva Partita
              </button>
            </div>
          </form>
        )}

        {/* Form Quick Points */}
        {tab === 'QUICK' && (
          <form onSubmit={handleSaveQuick} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">Seleziona Giocatore</label>
                <select
                  value={quickPlayerId}
                  onChange={(e) => setQuickPlayerId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-sm shadow-xs"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500">Esito Partita</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setQuickType('REGULAR')}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      quickType === 'REGULAR'
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-emerald-800">Vittoria Tempi Regolamentari</div>
                      <div className="text-[10px] sm:text-xs text-slate-500">Vittoria standard nei 90 minuti</div>
                    </div>
                    <span className="font-mono font-black text-xs sm:text-sm bg-emerald-600 text-white px-2 py-1 rounded-lg">
                      +3 PT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickType('PENALTIES')}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      quickType === 'PENALTIES'
                        ? 'bg-indigo-50 border-indigo-500 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-indigo-700">Vittoria ai Rigori</div>
                      <div className="text-[10px] sm:text-xs text-slate-500">Vittoria dopo i calci di rigore</div>
                    </div>
                    <span className="font-mono font-black text-xs sm:text-sm bg-indigo-600 text-white px-2 py-1 rounded-lg">
                      +2 PT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickType('LOSS')}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      quickType === 'LOSS'
                        ? 'bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-700">Sconfitta</div>
                      <div className="text-[10px] sm:text-xs text-slate-500">Nessun punto assegnato</div>
                    </div>
                    <span className="font-mono font-black text-xs sm:text-sm bg-slate-300 text-slate-700 px-2 py-1 rounded-lg">
                      0 PT
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Note (opzionale)</label>
                <input
                  type="text"
                  placeholder="Es. Sfida amichevole pausa pranzo"
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
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
