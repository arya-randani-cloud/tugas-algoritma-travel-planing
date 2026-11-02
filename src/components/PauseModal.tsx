import React from 'react';

interface PauseModalProps {
  open: boolean;
  playerName: string;
  levelLabel: string;
  totalWeight: number;
  capacity: number;
  totalProfitFormatted: string;
  onResume: () => void;
  onResetBag: () => void;
  onNewPlayer: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  open,
  playerName,
  levelLabel,
  totalWeight,
  capacity,
  totalProfitFormatted,
  onResume,
  onResetBag,
  onNewPlayer,
}) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[var(--pn)] border border-[var(--ln)] shadow-2xl p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ac)] mb-1">
          Permainan Dijeda
        </p>
        <h2
          id="pause-modal-title"
          className="text-2xl font-extrabold text-[var(--ink)] mb-4"
        >
          Status Ekspedisi
        </h2>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-3 mb-5 text-xs">
          <div>
            <span className="block text-[var(--mut)]">Pemain</span>
            <b className="text-sm text-[var(--ink)] truncate block">{playerName}</b>
          </div>
          <div>
            <span className="block text-[var(--mut)]">Beban Tas</span>
            <b className="font-mono-num text-sm text-[var(--ink)]">
              {totalWeight}/{capacity} kg
            </b>
          </div>
          <div>
            <span className="block text-[var(--mut)]">Profit Saat Ini</span>
            <b className="font-mono-num text-sm text-[var(--ac)]">
              {totalProfitFormatted}
            </b>
          </div>
        </div>

        <p className="text-xs text-[var(--mut)] mb-5">
          Level aktif: <strong className="text-[var(--ink)]">{levelLabel}</strong>. Tekan{' '}
          <span className="font-mono-num">Esc</span> atau <span className="font-mono-num">P</span> untuk melanjutkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            type="button"
            onClick={onResume}
            className="rounded-xl bg-[var(--ac)] hover:opacity-95 px-5 py-2.5 text-sm font-bold text-white cursor-pointer whitespace-nowrap"
          >
            Lanjutkan
          </button>
          <button
            type="button"
            onClick={() => {
              onResetBag();
              onResume();
            }}
            className="rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] cursor-pointer whitespace-nowrap"
          >
            Reset Tas
          </button>
          <button
            type="button"
            onClick={onNewPlayer}
            className="rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] cursor-pointer whitespace-nowrap"
          >
            Pemain baru
          </button>
        </div>
      </div>
    </div>
  );
};
