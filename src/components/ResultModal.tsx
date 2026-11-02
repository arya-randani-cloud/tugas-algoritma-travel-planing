import React, { useState } from 'react';
import {
  DPSolution,
  GameMode,
  GreedyStrategy,
  KnapsackItem,
  formatProfit,
} from '../game/knapsack';

interface ResultModalProps {
  open: boolean;
  winFlag: boolean;
  playerName: string;
  destination: string;
  mode: GameMode;
  greedyStrategy: GreedyStrategy;
  totalWeight: number;
  capacity: number;
  totalProfitP10: number;
  dpSolution: DPSolution;
  items: KnapsackItem[];
  bagIds: Set<number>;
  onContinue: () => void;
  onPlayAgain: () => void;
  onClose: () => void;
  onApplyOptimalSet: () => void;
}

const STRATEGY_NAMES: Record<GreedyStrategy, string> = {
  profit: 'Greedy by Profit',
  weight: 'Greedy by Weight',
  density: 'Greedy by Density (Profit/kg)',
};

export const ResultModal: React.FC<ResultModalProps> = ({
  open,
  winFlag,
  playerName,
  destination,
  mode,
  greedyStrategy,
  totalWeight,
  capacity,
  totalProfitP10,
  dpSolution,
  items,
  bagIds,
  onContinue,
  onPlayAgain,
  onClose,
  onApplyOptimalSet,
}) => {
  const [showOptimalBreakdown, setShowOptimalBreakdown] = useState(false);

  if (!open) return null;

  const isAuto = mode === 'auto';
  const optP10 = dpSolution.optimalProfitP10;
  const isBest = totalProfitP10 === optP10;
  const diffP10 = Math.max(0, optP10 - totalProfitP10);
  const diffPct = optP10 > 0 ? ((diffP10 / optP10) * 100).toFixed(1) : '0.0';
  const efficiencyPct =
    optP10 > 0 ? Math.min(100, Math.round((totalProfitP10 / optP10) * 100)) : 100;

  const stratLabel = STRATEGY_NAMES[greedyStrategy];
  let headingTitle = '';
  let noteText = '';

  if (winFlag === true) {
    headingTitle = `Selamat, ${playerName}!`;
    noteText = 'Kombinasi barang di kopermu mencapai profit maksimal untuk perjalanan ini.';
  } else if (isAuto) {
    headingTitle = `Hasil ${stratLabel}`;
    noteText = isBest
      ? `Kebetulan ${stratLabel} menghasilkan solusi optimal pada data barang perjalanan ini.`
      : `${stratLabel} belum optimal di sini: selisih ${formatProfit(diffP10)} (${diffPct}%). Ini membuktikan bahwa pendekatan heuristik Greedy tidak selalu menjamin solusi terbaik pada 0/1 Knapsack Problem.`;
  } else {
    headingTitle = 'Evaluasi Koper Perjalanan';
    noteText = isBest
      ? 'Profit maksimal tercapai! Koper perjalananmu telah terisi dengan kombinasi paling optimal.'
      : `Belum optimal, masih kurang ${formatProfit(diffP10)} dari profit maksimal. Kamu bisa lanjut memperbaiki isi koper atau melihat solusi Dynamic Programming di bawah.`;
  }

  const optimalItems = dpSolution.optimalItemIds
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is KnapsackItem => Boolean(i));

  return (
    <div
      id="resM"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto"
    >
      <div
        id="resB"
        className="w-full max-w-lg rounded-2xl bg-[var(--pn)] border border-[var(--ln)] shadow-2xl p-6 sm:p-7 text-center max-h-[92vh] overflow-y-auto"
      >
        {/* Status Emblem */}
        <div className="mb-3 flex justify-center">
          {winFlag || isBest ? (
            <div className="trophy animate-trophy text-6xl select-none" aria-hidden="true">
              🏆
            </div>
          ) : isAuto ? (
            <div className="text-5xl select-none" aria-hidden="true">
              🤖
            </div>
          ) : (
            <div className="text-5xl select-none" aria-hidden="true">
              🧳
            </div>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ac)] mb-1">
          {winFlag || isBest
            ? 'Solusi Optimal 0/1 Knapsack Tercapai'
            : isAuto
            ? 'Evaluasi Algoritma Greedy'
            : 'Evaluasi Koper Liburan'}
        </p>
        <h2
          id="result-modal-title"
          className="text-2xl font-extrabold text-[var(--ink)] tracking-tight"
        >
          {headingTitle}
        </h2>

        {/* Summary Metrics Box */}
        <div className="res mt-4 mb-4 rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-4 text-left space-y-2 text-sm">
          <div className="flex items-center justify-between py-1 border-b border-[var(--ln)]/60">
            <span className="text-[var(--mut)]">Wisatawan &amp; Tujuan</span>
            <b className="font-semibold text-[var(--ink)]">
              {playerName} · {destination}
            </b>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[var(--ln)]/60">
            <span className="text-[var(--mut)]">Total Berat Koper</span>
            <b className="font-mono-num font-bold text-[var(--ink)]">
              {totalWeight} / {capacity} kg
            </b>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[var(--ln)]/60">
            <span className="text-[var(--mut)]">Total Profit Koper</span>
            <b className="font-mono-num font-bold text-[var(--ac)] text-base">
              {formatProfit(totalProfitP10)}
            </b>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--mut)]">Profit Maksimal (Solusi DP)</span>
            <b className="font-mono-num font-bold text-[var(--ink)] text-base">
              {formatProfit(optP10)}
            </b>
          </div>

          {/* Visual Efficiency Comparison Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
              <span>Efisiensi terhadap Solusi Optimal DP</span>
              <span className="font-mono-num font-bold text-[var(--ink)]">
                {efficiencyPct}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[var(--pn)] border border-[var(--ln)] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${efficiencyPct}%`,
                  backgroundColor: isBest ? 'var(--gold)' : 'var(--ac)',
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-[var(--mut)] leading-relaxed mb-4">{noteText}</p>

        {/* Interactive DP Optimal Combination Inspector */}
        <div className="mb-5 text-left">
          <button
            type="button"
            onClick={() => setShowOptimalBreakdown((v) => !v)}
            className="w-full flex items-center justify-between rounded-xl border border-[var(--ln)] bg-[var(--bg)]/60 hover:border-[var(--ac)] px-3.5 py-2.5 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
          >
            <span>
              {showOptimalBreakdown
                ? 'Sembunyikan Kunci Jawaban Optimal (Dynamic Programming)'
                : `Lihat Kunci Jawaban Optimal DP (${optimalItems.length} barang · ${dpSolution.optimalWeight} kg)`}
            </span>
            <span className="font-mono-num text-[var(--ac)]">
              {showOptimalBreakdown ? '▲' : '▼'}
            </span>
          </button>

          {showOptimalBreakdown && (
            <div className="mt-2 rounded-xl border border-[var(--ln)] bg-[var(--bg)] p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--mut)]">
                <span>
                  Kombinasi Optimal DP: <b>{optimalItems.length} barang</b> ({dpSolution.optimalWeight} / {capacity} kg)
                </span>
                {!isBest && (
                  <button
                    type="button"
                    onClick={onApplyOptimalSet}
                    className="text-[var(--ac)] font-bold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Masukkan ke Koper
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {optimalItems.map((it) => {
                  const alsoInPlayerBag = bagIds.has(it.id);
                  return (
                    <span
                      key={it.id}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono-num ${
                        alsoInPlayerBag
                          ? 'border-[var(--ac)] bg-[var(--acs)] text-[var(--ink)]'
                          : 'border-[var(--ln)] bg-[var(--pn)] text-[var(--mut)]'
                      }`}
                    >
                      <span>{it.ic}</span>
                      <b>#{it.id}</b>
                      <span>
                        {it.name} ({it.w}kg · {formatProfit(it.p10)})
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="row flex flex-wrap items-center justify-center gap-2.5">
          {!isAuto && !isBest && (
            <button
              id="cont"
              type="button"
              onClick={onContinue}
              className="rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
            >
              Lanjut Mengemas
            </button>
          )}
          <button
            id="again"
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="rounded-xl bg-[var(--ac)] hover:opacity-95 px-5 py-2.5 text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap"
          >
            Rencana Baru
          </button>
          <button
            id="cls"
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
