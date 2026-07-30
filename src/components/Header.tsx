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
    <header className="bg-white/95 border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* EA SPORTS FC 2026 Logo and Title */}
          <div className="flex items-center space-x-2.5">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/30">
                <span className="font-black text-lg sm:text-xl text-white tracking-tighter">FC</span>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-900 text-emerald-300 font-extrabold text-[8px] sm:text-[9px] px-1 py-0.2 rounded border border-emerald-500/40 uppercase tracking-wider font-mono">
                2026
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-700 font-extrabold font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  EA SPORTS FC 2026
                </span>
              </div>
              <h1 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 leading-none font-mono">
                NETEN LEAGUE
              </h1>
            </div>
          </div>

          {/* Stat Badges (Desktop/Tablet) */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div className="px-3 py-1 border-r border-slate-200">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">Colleghi</div>
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> {totalPlayers}
              </div>
            </div>
            <div className="px-3 py-1 border-r border-slate-200">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">Partite</div>
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-emerald-600" /> {totalMatches}
              </div>
            </div>
            <div className="px-3 py-1">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">Capolista</div>
              <div className="text-sm font-extrabold text-amber-600 truncate max-w-[120px] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> {topPlayerName || '-'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              id="btn-registra-partita"
              onClick={onOpenMatchModal}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Aggiungi Punti / Partita</span>
            </button>

            <button
              id="btn-gestisci-giocatori"
              onClick={onOpenPlayerModal}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer shadow-sm"
              title="Gestisci i colleghi partecipanti"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Giocatori</span>
            </button>

            <button
              id="btn-reset-data"
              onClick={onResetData}
              className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer"
              title="Azzera la classifica a 0 punti (con doppia conferma)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline font-mono">Azzera Classifica</span>
            </button>

            {/* Additional Tools Dropdown or Direct Buttons */}
            <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 p-0.5 sm:p-1 rounded-xl">
              <button
                id="btn-export-json"
                onClick={onExportData}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Esporta dati in JSON"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              
              <button
                id="btn-import-json"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
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
