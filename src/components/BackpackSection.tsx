import React from 'react';
import {
  GameMode,
  GreedyStrategy,
  KnapsackItem,
  formatProfit,
} from '../game/knapsack';

interface BackpackSectionProps {
  mode: GameMode;
  onSelectMode: (m: GameMode) => void;
  greedyStrategy: GreedyStrategy;
  onSelectGreedyStrategy: (s: GreedyStrategy) => void;
  capacity: number;
  totalWeight: number;
  remainingWeight: number;
  totalProfitP10: number;
  isFull: boolean;
  utilizationPct: number;
  packedItems: KnapsackItem[];
  currentHighlightedId: number | null;
  logText: string;
  running: boolean;
  over: boolean;
  onRemoveItem: (id: number) => void;
  onRunGreedy: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const SEGMENT_COLORS = [
  '#0E7C7B',
  '#2E8B57',
  '#D99B16',
  '#3B6FD9',
  '#8B5CF6',
  '#D97706',
  '#0284C7',
];

export const BackpackSection: React.FC<BackpackSectionProps> = ({
  mode,
  onSelectMode,
  greedyStrategy,
  onSelectGreedyStrategy,
  capacity,
  totalWeight,
  remainingWeight,
  totalProfitP10,
  isFull,
  utilizationPct,
  packedItems,
  currentHighlightedId,
  logText,
  running,
  over,
  onRemoveItem,
  onRunGreedy,
  onReset,
  onFinish,
}) => {
  const isAuto = mode === 'auto';

  return (
    <section
      aria-label="Koper Perjalanan"
      className="rounded-2xl bg-[var(--pn)] border border-[var(--ln)] p-4 sm:p-6 shadow-xs lg:sticky lg:top-4"
    >
      {/* Header + SVG dynamic suitcase load gauge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] tracking-tight flex items-center gap-2">
            <span>Koper Perjalanan</span>
            <span aria-hidden="true">🧳</span>
          </h2>
          <p className="text-xs text-[var(--mut)]">
            Kapasitas maksimal koper:{' '}
            <b id="cap" className="font-mono-num text-[var(--ink)]">
              {capacity}
            </b>{' '}
            kg
          </p>
        </div>

        {/* Dynamic SVG Suitcase Load Indicator */}
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 48 48"
            className="w-11 h-11 shrink-0"
            aria-hidden="true"
          >
            {/* Suitcase handle */}
            <path
              d="M19 10 L19 5 L29 5 L29 10"
              fill="none"
              stroke="var(--ac)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <rect
              x="8"
              y="10"
              width="32"
              height="32"
              rx="6"
              fill="var(--bg)"
              stroke="var(--ln)"
              strokeWidth="2"
            />
            {/* Fill level inside suitcase */}
            <clipPath id="bagFillClip">
              <rect x="10" y="12" width="28" height="28" rx="4" />
            </clipPath>
            <g clipPath="url(#bagFillClip)">
              <rect
                x="10"
                y={40 - (28 * Math.min(100, utilizationPct)) / 100}
                width="28"
                height={(28 * Math.min(100, utilizationPct)) / 100}
                fill={isFull ? 'var(--gold)' : 'var(--ac)'}
                opacity="0.85"
              />
            </g>
            {/* Wheels */}
            <circle cx="14" cy="44" r="2" fill="var(--mut)" />
            <circle cx="34" cy="44" r="2" fill="var(--mut)" />
            <text
              x="24"
              y="29"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="var(--ink)"
              fontFamily="JetBrains Mono, monospace"
            >
              {Math.round(utilizationPct)}%
            </text>
          </svg>
        </div>
      </div>

      {/* Mode Switcher Segmented Control */}
      <div
        className="seg grid grid-cols-2 rounded-xl border border-[var(--ln)] bg-[var(--bg)] p-1 mb-3"
        role="group"
        aria-label="Mode Permainan"
      >
        <button
          id="mM"
          type="button"
          onClick={() => onSelectMode('manual')}
          className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            !isAuto
              ? 'on bg-[var(--ac)] text-white shadow-xs'
              : 'text-[var(--mut)] hover:text-[var(--ink)]'
          }`}
        >
          Manual Mode
        </button>
        <button
          id="mA"
          type="button"
          onClick={() => onSelectMode('auto')}
          className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            isAuto
              ? 'on bg-[var(--ac)] text-white shadow-xs'
              : 'text-[var(--mut)] hover:text-[var(--ink)]'
          }`}
        >
          Automatic Mode
        </button>
      </div>

      {/* Greedy Strategy Selector when in Automatic Mode */}
      {isAuto && (
        <div className="mb-3 rounded-xl bg-[var(--bg)] border border-[var(--ln)] p-2.5">
          <label
            htmlFor="greedy-strat"
            className="block text-xs font-semibold text-[var(--ink)] mb-1"
          >
            Pilih Strategi Algoritma Greedy:
          </label>
          <select
            id="greedy-strat"
            disabled={running}
            value={greedyStrategy}
            onChange={(e) => onSelectGreedyStrategy(e.target.value as GreedyStrategy)}
            className="w-full rounded-lg border border-[var(--ln)] bg-[var(--pn)] px-2.5 py-1.5 text-xs font-semibold text-[var(--ink)] focus:border-[var(--ac)] focus:outline-none cursor-pointer"
          >
            <option value="profit">Greedy by Profit (Profit Tertinggi Lebih Dulu)</option>
            <option value="weight">Greedy by Weight (Bobot Terkecil Lebih Dulu)</option>
            <option value="density">Greedy by Density (Rasio Profit/kg Tertinggi)</option>
          </select>
        </div>
      )}

      {/* Capacity Progress Bar (#bar) */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-[var(--mut)] mb-1">
          <span>Muatan Koper Perjalanan</span>
          <span className="font-mono-num font-semibold text-[var(--ink)]">
            {totalWeight} / {capacity} kg ({isFull ? 'PENUH' : `Sisa ${remainingWeight} kg`})
          </span>
        </div>
        <div
          id="bar"
          className={`bar h-4 rounded-full bg-[var(--bg)] border border-[var(--ln)] overflow-hidden relative ${
            isFull ? 'full' : ''
          }`}
        >
          <i
            className="block h-full transition-all duration-300"
            style={{
              width: `${utilizationPct}%`,
              backgroundColor: isFull ? 'var(--gold)' : 'var(--ac)',
            }}
          />
        </div>

        {/* Segmented Item Weight Breakdown Bar (shown when comparing 2+ packed items) */}
        {packedItems.length > 1 && (
          <div
            className="mt-1.5 flex h-1.5 w-full rounded-full overflow-hidden bg-[var(--bg)] gap-[1px]"
            title="Proporsi berat tiap barang di dalam koper"
          >
            {packedItems.map((it, idx) => (
              <div
                key={it.id}
                style={{
                  width: `${(it.w / capacity) * 100}%`,
                  backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
              />
            ))}
          </div>
        )}
      </div>

      {/* Key Stats Grid: Total Berat & Total Profit prominently shown per Assignment Note #4 */}
      <div className="stats grid grid-cols-2 gap-2.5 my-3">
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--ln)]/70 p-3">
          <span className="text-xs font-semibold text-[var(--mut)] block">
            Total Berat
          </span>
          <b
            id="tw"
            className="font-mono-num text-lg font-extrabold text-[var(--ink)] mt-0.5 block"
          >
            {totalWeight} kg
          </b>
          <span className="text-[11px] text-[var(--mut)] block">
            Sisa kapasitas: <strong id="rw" className="font-mono-num text-[var(--ink)]">{remainingWeight} kg</strong>
          </span>
        </div>
        <div className="rounded-xl bg-[var(--acs)]/55 border border-[var(--ac)]/40 p-3">
          <span className="text-xs font-semibold text-[var(--mut)] block">
            Total Profit
          </span>
          <b
            id="tp"
            className="font-mono-num text-xl font-extrabold text-[var(--ac)] mt-0.5 block"
          >
            {formatProfit(totalProfitP10)}
          </b>
          <span className="text-[11px] text-[var(--mut)] block">
            Isi koper: <strong className="font-mono-num text-[var(--ink)]">{packedItems.length} barang</strong>
          </span>
        </div>
      </div>

      {/* Live Step / Status Log */}
      <div
        id="log"
        aria-live="polite"
        className={`log min-h-[2.75rem] rounded-xl px-3 py-2 text-xs leading-relaxed mb-3 flex items-center border ${
          logText
            ? 'bg-[var(--bg)] border-[var(--ln)] text-[var(--ink)] font-medium'
            : 'bg-transparent border-transparent text-[var(--mut)]'
        }`}
      >
        {logText ||
          (isAuto
            ? 'Mode Otomatis: Tekan “Jalankan Greedy” untuk mengamati pemilihan barang secara otomatis ke koper 100 kg.'
            : 'Mode Manual: Pilih barang liburan dari katalog di kiri untuk dimasukkan ke dalam koper 100 kg.')}
      </div>

      {/* Packed Items List (#bag) */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--mut)] mb-1.5">
          <span>Daftar Barang di Koper ({packedItems.length})</span>
          {packedItems.length > 0 && (
            <span className="font-mono-num">
              Rata-rata {(totalProfitP10 / 10 / Math.max(1, totalWeight)).toFixed(1)} profit/kg
            </span>
          )}
        </div>
        <ul
          id="bag"
          className="bag list-none m-0 p-0 max-h-60 overflow-y-auto flex flex-col gap-1.5"
        >
          {packedItems.length > 0 ? (
            packedItems.map((item) => {
              const isCur = currentHighlightedId === item.id;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                    isCur
                      ? 'cur bg-[var(--cur)] border-[var(--gold)]'
                      : 'bg-[var(--bg)]/70 border-[var(--ln)]'
                  }`}
                >
                  <span className="text-xl leading-none select-none" aria-hidden="true">
                    {item.ic}
                  </span>
                  <div className="t flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-num font-bold text-xs text-[var(--ink)]">
                        #{item.id}
                      </span>
                      <span className="text-xs font-semibold text-[var(--ink)] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="font-mono-num text-[11px] text-[var(--mut)]">
                      {item.category} · {item.w} kg · <strong className="text-[var(--ac)]">Profit {formatProfit(item.p10)}</strong>
                    </div>
                  </div>
                  {!isAuto && !over && (
                    <button
                      type="button"
                      data-x={item.id}
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Keluarkan barang ${item.id} dari koper`}
                      className="x rounded-lg px-2 py-0.5 text-lg font-extrabold text-[var(--bad)] hover:bg-[var(--bad)]/10 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <li className="empty rounded-xl border border-dashed border-[var(--ln)] bg-[var(--bg)]/40 py-6 text-center text-xs text-[var(--mut)]">
              Koper masih kosong. Klik kartu barang untuk mulai mengemas koper liburanmu.
            </li>
          )}
        </ul>
      </div>

      {/* Action Buttons Row */}
      <div className="row flex flex-wrap gap-2">
        {isAuto && (
          <button
            id="run"
            type="button"
            disabled={running || over}
            onClick={onRunGreedy}
            className="btn pri flex-1 rounded-xl bg-[var(--ac)] hover:opacity-95 disabled:opacity-45 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap"
          >
            {running ? 'Menjalankan Greedy...' : 'Jalankan Greedy'}
          </button>
        )}
        <button
          id="rst"
          type="button"
          onClick={onReset}
          className="btn rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
        >
          Kosongkan Koper
        </button>
        <button
          id="fin"
          type="button"
          disabled={running || (isAuto && !over)}
          onClick={onFinish}
          className="btn pri flex-1 rounded-xl bg-[var(--ac)] hover:opacity-95 disabled:opacity-45 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Selesai Mengemas
        </button>
      </div>
    </section>
  );
};
