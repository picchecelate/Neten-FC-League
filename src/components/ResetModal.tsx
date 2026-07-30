import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleFirstStep = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirmReset();
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0C10]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#14171D] border border-rose-500/30 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0A0C10] border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Azzeramento Classifica</h3>
              <p className="text-xs font-mono text-rose-400">
                Conferma di sicurezza: Passaggio {step} di 2
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-300 block mb-1">
                    Primo passaggio di conferma
                  </strong>
                  Sei sicuro di voler azzerare la classifica? Questa operazione svuoterà le partite giocate e riporterà a zero il punteggio di tutti i colleghi.
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <p>&bull; Tutti i partecipanti rimaerranno registrati.</p>
                <p>&bull; I punti totali, i gol e le statistiche verranno azzerati.</p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleFirstStep}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Procedi al Passaggio 2 &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-300 block mb-1">
                    Seconda conferma definitiva!
                  </strong>
                  Stai per effettuare l'azzeramento definitivo di tutti i punti e delle partite del torneo Neten FC 2026. L'azione non può essere annullata.
                </div>
              </div>

              <div className="p-3 bg-[#0A0C10] rounded-xl border border-slate-800 text-center">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Confermi l'azzeramento della classifica per tutti a 0 punti?
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  &larr; Indietro
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  SÌ, AZZERA CLASSIFICA A 0
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
