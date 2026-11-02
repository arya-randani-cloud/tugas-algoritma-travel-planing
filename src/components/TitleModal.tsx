import React from 'react';
import { DifficultyLevel, LEVEL_CONFIGS, SUITCASE_CAPACITY_KG } from '../game/knapsack';

interface TitleModalProps {
  open: boolean;
  playerName: string;
  onPlayerNameChange: (val: string) => void;
  destination: string;
  onDestinationChange: (val: string) => void;
  level: DifficultyLevel;
  onLevelChange: (lv: DifficultyLevel) => void;
  errorText: string;
  onStart: () => void;
  onOpenReport: () => void;
}

const PRESET_DESTINATIONS = [
  'Kyoto, Jepang',
  'Raja Ampat, Papua',
  'Zermatt, Swiss',
  'Yogyakarta & Bromo',
];

export const TitleModal: React.FC<TitleModalProps> = ({
  open,
  playerName,
  onPlayerNameChange,
  destination,
  onDestinationChange,
  level,
  onLevelChange,
  errorText,
  onStart,
  onOpenReport,
}) => {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart();
  };

  return (
    <div
      id="startM"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[var(--pn)] border border-[var(--ln)] shadow-2xl p-6 sm:p-7 text-left transition-all">
        {/* Custom Inline SVG Travel Suitcase Emblem */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-2.5 inline-flex items-center justify-center">
            <svg
              viewBox="0 0 140 92"
              className="w-34 h-22 select-none"
              aria-hidden="true"
            >
              <rect
                x="14"
                y="8"
                width="112"
                height="76"
                rx="16"
                fill="var(--acs)"
                stroke="var(--ac)"
                strokeWidth="1.75"
              />
              {/* Suitcase telescoping handle */}
              <path
                d="M58 24 L58 14 L82 14 L82 24"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Suitcase body */}
              <rect
                x="42"
                y="23"
                width="56"
                height="48"
                rx="9"
                fill="var(--ac)"
              />
              {/* Suitcase ribs & straps */}
              <line x1="54" y1="23" x2="54" y2="71" stroke="var(--gold)" strokeWidth="3" />
              <line x1="86" y1="23" x2="86" y2="71" stroke="var(--gold)" strokeWidth="3" />
              {/* Wheels */}
              <circle cx="50" cy="74" r="3.5" fill="var(--ink)" />
              <circle cx="90" cy="74" r="3.5" fill="var(--ink)" />
              {/* Luggage tag */}
              <rect
                x="56"
                y="38"
                width="28"
                height="18"
                rx="4"
                fill="var(--pn)"
              />
              <text
                x="70"
                y="50"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="8.5"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                100 KG
              </text>
            </svg>
          </div>

          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--ac)] mb-1">
            Tugas Mata Kuliah Strategi Algoritma · Semester 3
          </p>
          <h2
            id="start-modal-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]"
          >
            Rencana Koper Perjalanan
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--mut)] max-w-md">
            Simulasi <strong className="text-[var(--ink)]">0/1 Knapsack Problem</strong>: pilih barang bawaan liburan
            berdasarkan kategori ke dalam koper berkapasitas{' '}
            <strong className="text-[var(--ink)]">{SUITCASE_CAPACITY_KG} kg</strong> untuk meraih profit tertinggi.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label
                htmlFor="nm"
                className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1"
              >
                Nama pemain / mahasiswa
              </label>
              <input
                id="nm"
                type="text"
                maxLength={20}
                value={playerName}
                onChange={(e) => onPlayerNameChange(e.target.value)}
                placeholder="Contoh: Budi"
                autoFocus
                className="w-full rounded-xl border border-[var(--ln)] bg-[var(--bg)] px-3.5 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--mut)]/70 focus:border-[var(--ac)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="dest"
                className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1"
              >
                Tujuan liburan
              </label>
              <select
                id="dest"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full rounded-xl border border-[var(--ln)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--ac)] focus:outline-none cursor-pointer"
              >
                {PRESET_DESTINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="mb-4">
            <legend className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-2">
              Skala perjalanan (Kapasitas Koper: {SUITCASE_CAPACITY_KG} kg)
            </legend>
            <div className="grid gap-2 lv">
              {(Object.keys(LEVEL_CONFIGS) as DifficultyLevel[]).map((lvKey) => {
                const cfg = LEVEL_CONFIGS[lvKey];
                const checked = level === lvKey;
                return (
                  <label
                    key={lvKey}
                    className={`group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-all ${
                      checked
                        ? 'border-[var(--ac)] bg-[var(--acs)]/80 shadow-xs'
                        : 'border-[var(--ln)] bg-[var(--bg)]/50 hover:border-[var(--ac)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="lv"
                        value={lvKey}
                        checked={checked}
                        onChange={() => onLevelChange(lvKey)}
                        className="h-4 w-4 accent-[var(--ac)]"
                      />
                      <div>
                        <span className="text-sm font-bold text-[var(--ink)] block">
                          {cfg.label}
                        </span>
                        <span className="block text-xs text-[var(--mut)]">
                          {cfg.n} pilihan barang · Bobot 4–{cfg.wmax} kg · Koper {cfg.cap} kg
                        </span>
                      </div>
                    </div>
                    <span className="font-mono-num text-xs font-bold text-[var(--ac)] shrink-0">
                      {cfg.cap} kg
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {errorText ? (
            <p
              id="err"
              role="alert"
              className="text-sm font-semibold text-[var(--bad)] mb-3 flex items-center gap-1.5"
            >
              <span aria-hidden="true">⚠</span> {errorText}
            </p>
          ) : (
            <p id="err" className="hidden" />
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
            <button
              id="go"
              type="submit"
              data-start="true"
              className="flex-1 rounded-xl bg-[var(--ac)] hover:opacity-95 active:scale-[0.99] px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Mulai Kemas Koper
            </button>
            <button
              type="button"
              onClick={onOpenReport}
              className="rounded-xl border border-[var(--ln)] bg-[var(--bg)] hover:border-[var(--ac)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
            >
              Baca Laporan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
