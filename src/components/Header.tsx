import React from 'react';
import { Trophy, PlusCircle, Users, RotateCcw, Download, Upload, Shield, Swords } from 'lucide-react';

interface HeaderProps {
  onOpenMatchModal: () => void;
  onOpenPlayerModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalMatches: number;
  totalPlayers: number;
  topPlayerName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMatchModal,
  onOpenPlayerModal,
  onResetData,
  onExportData,
  onImportData,
  totalMatches,
  totalPlayers,
  topPlayerName,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="bg-[#0A0C10]/95 border-b border-slate-800/80 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-2.5">
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40">
                <span className="font-extrabold text-lg sm:text-xl text-white">N</span>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#0A0C10] text-blue-400 font-extrabold text-[8px] sm:text-[9px] px-1 py-0.2 rounded border border-blue-500/40 uppercase tracking-widest font-mono">
                2026
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-slate-500 font-semibold font-mono">
                  Neten Internal League
                </span>
              </div>
              <h1 className="text-base sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-none">
                FC 2026 LEADERBOARD
              </h1>
            </div>
          </div>

          {/* Stat Badges (Desktop/Tablet) */}
          <div className="hidden lg:flex items-center space-x-4 bg-[#14171D] p-2 rounded-xl border border-slate-800/80">
            <div className="px-3 py-1 border-r border-slate-800">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-mono">Colleghi</div>
              <div className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" /> {totalPlayers}
              </div>
            </div>
            <div className="px-3 py-1 border-r border-slate-800">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-mono">Partite</div>
              <div className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-blue-400" /> {totalMatches}
              </div>
            </div>
            <div className="px-3 py-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-mono">Capolista</div>
              <div className="text-sm font-extrabold text-amber-400 truncate max-w-[120px] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> {topPlayerName || '-'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              id="btn-registra-partita"
              onClick={onOpenMatchModal}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Aggiungi Punti / Partita</span>
            </button>

            <button
              id="btn-gestisci-giocatori"
              onClick={onOpenPlayerModal}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg bg-[#14171D] hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-800 transition-all cursor-pointer"
              title="Gestisci i colleghi partecipanti"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Giocatori</span>
            </button>

            <button
              id="btn-reset-data"
              onClick={onResetData}
              className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/30 transition-all cursor-pointer"
              title="Azzera la classifica a 0 punti (con doppia conferma)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline font-mono">Azzera Classifica</span>
            </button>

            {/* Additional Tools Dropdown or Direct Buttons */}
            <div className="flex items-center gap-0.5 bg-[#14171D] border border-slate-800/80 p-0.5 sm:p-1 rounded-lg">
              <button
                id="btn-export-json"
                onClick={onExportData}
                className="p-1.5 sm:p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Esporta dati in JSON"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              
              <button
                id="btn-import-json"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 sm:p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Importa dati da JSON"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onImportData}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
