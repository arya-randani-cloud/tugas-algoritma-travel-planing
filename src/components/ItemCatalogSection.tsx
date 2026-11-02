import React from 'react';
import {
  FilterMode,
  GameMode,
  KnapsackItem,
  SortKey,
  TRAVEL_CATEGORIES,
  TravelCategory,
  formatProfit,
  formatRatio,
} from '../game/knapsack';

interface ItemCatalogSectionProps {
  items: KnapsackItem[];
  paginatedItems: KnapsackItem[];
  bagIds: Set<number>;
  capacity: number;
  currentWeight: number;
  mode: GameMode;
  over: boolean;
  currentHighlightedId: number | null;
  shakingId: number | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  categoryFilter: TravelCategory;
  onCategoryFilterChange: (c: TravelCategory) => void;
  sortKey: SortKey;
  onSortKeyChange: (s: SortKey) => void;
  asc: boolean;
  onToggleAsc: () => void;
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectItem: (id: number) => void;
  filteredCount: number;
}

export const ItemCatalogSection: React.FC<ItemCatalogSectionProps> = ({
  items,
  paginatedItems,
  bagIds,
  capacity,
  currentWeight,
  mode,
  over,
  currentHighlightedId,
  shakingId,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortKey,
  onSortKeyChange,
  asc,
  onToggleAsc,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onSelectItem,
  filteredCount,
}) => {
  const remainingCap = Math.max(0, capacity - currentWeight);
  const maxProfitP10 = items.reduce((m, it) => Math.max(m, it.p10), 100);

  return (
    <section
      aria-label="Daftar barang"
      className="rounded-2xl bg-[var(--pn)] border border-[var(--ln)] p-4 sm:p-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] tracking-tight">
            Daftar Barang Bawaan Liburan
          </h2>
          <p className="text-xs text-[var(--mut)]">
            Menampilkan <span className="font-mono-num font-semibold text-[var(--ink)]">{filteredCount}</span> dari{' '}
            <span className="font-mono-num font-semibold text-[var(--ink)]">{items.length}</span> barang · Sisa ruang koper{' '}
            <span className="font-mono-num font-semibold text-[var(--ac)]">{remainingCap} kg</span> (dari {capacity} kg)
          </p>
        </div>
        <div className="text-xs text-[var(--mut)]">
          <strong className="text-[var(--ink)]">Klik kartu barang</strong> untuk memasukkan ke koper
        </div>
      </div>

      {/* Interactive Category Filter Bar */}
      <div
        role="group"
        aria-label="Filter Kategori Barang"
        className="flex flex-wrap items-center gap-1.5 mb-3.5 pb-3 border-b border-[var(--ln)]/60"
      >
        {TRAVEL_CATEGORIES.map((cat) => {
          const active = categoryFilter === cat;
          const count =
            cat === 'Semua Kategori'
              ? items.length
              : items.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryFilterChange(cat)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[var(--ac)] text-white shadow-xs'
                  : 'bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--ink)] border border-[var(--ln)]/70'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="tools flex flex-wrap items-center gap-2.5 mb-4 pb-3.5 border-b border-[var(--ln)]/70">
        <div className="relative">
          <input
            id="q"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ID / nama"
            aria-label="Cari ID atau nama barang"
            className="w-36 rounded-xl border border-[var(--ln)] bg-[var(--bg)] px-3 py-1.5 text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--mut)] focus:border-[var(--ac)] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Bersihkan pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--mut)] hover:text-[var(--ink)] cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <select
          id="fil"
          aria-label="Filter status barang"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as FilterMode)}
          className="rounded-xl border border-[var(--ln)] bg-[var(--bg)] px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--ink)] focus:border-[var(--ac)] focus:outline-none cursor-pointer"
        >
          <option value="all">Semua Status</option>
          <option value="free">Belum di Koper</option>
          <option value="in">Sudah di Koper</option>
          <option value="fit">Muat di Sisa Koper</option>
        </select>

        <select
          id="srt"
          aria-label="Urutkan"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
          className="rounded-xl border border-[var(--ln)] bg-[var(--bg)] px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--ink)] focus:border-[var(--ac)] focus:outline-none cursor-pointer"
        >
          <option value="id">Urut ID Barang</option>
          <option value="w">Urut Bobot (kg)</option>
          <option value="p">Urut Profit</option>
          <option value="ratio">Urut Rasio (Profit/kg)</option>
        </select>

        <button
          id="dir"
          type="button"
          onClick={onToggleAsc}
          aria-label="Arah urutan"
          className="rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {asc ? '↑ Naik' : '↓ Turun'}
        </button>
      </div>

      {/* Item Cards Grid */}
      {paginatedItems.length > 0 ? (
        <div
          id="grid"
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {paginatedItems.map((item) => {
            const inBag = bagIds.has(item.id);
            const tooHeavy = !inBag && item.w > remainingCap;
            const isCurrent = currentHighlightedId === item.id;
            const isShaking = shakingId === item.id;
            const isDisabled = mode !== 'manual' || over;
            const profitPct = Math.min(100, Math.round((item.p10 / maxProfitP10) * 100));

            let stateClasses =
              'border-[var(--ln)] bg-[var(--bg)]/80 hover:border-[var(--ac)] hover:-translate-y-0.5';
            let statusLabel = 'Tersedia';

            if (isCurrent) {
              stateClasses =
                'bg-[var(--cur)] border-[var(--gold)] ring-3 ring-[var(--gold)]/60 cur';
              statusLabel = 'Dievaluasi';
            } else if (inBag) {
              stateClasses =
                'bg-[var(--acs)]/85 border-[var(--ac)] opacity-85 in';
              statusLabel = 'Di Koper ✓';
            } else if (tooHeavy) {
              stateClasses =
                'bg-[var(--bg)]/40 border-[var(--ln)] opacity-45 cursor-not-allowed big';
              statusLabel = 'Melebihi Sisa';
            }

            return (
              <button
                key={item.id}
                type="button"
                data-id={item.id}
                disabled={isDisabled}
                onClick={() => onSelectItem(item.id)}
                aria-label={`Barang ${item.id} ${item.name}, Kategori ${item.category}, Bobot ${item.w} kg, Profit ${formatProfit(
                  item.p10
                )}`}
                className={`card group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer disabled:cursor-not-allowed ${stateClasses} ${
                  isShaking ? 'animate-shake shake' : ''
                }`}
              >
                {/* Top row: Icon & ID + Status */}
                <div className="flex items-start justify-between gap-2 w-full mb-2">
                  <span
                    className="ic text-3xl leading-none select-none transition-transform group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {item.ic}
                  </span>
                  <div className="text-right">
                    <span className="id font-mono-num text-xs font-bold text-[var(--mut)] block">
                      #{item.id}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        inBag
                          ? 'text-[var(--ac)]'
                          : tooHeavy
                          ? 'text-[var(--bad)]'
                          : 'text-[var(--mut)]'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Item Name & Travel Category (Unboxed clean metadata) */}
                <div className="mb-2.5">
                  <div className="text-xs font-bold text-[var(--ink)] truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[var(--mut)] truncate">
                    {item.category} · {formatRatio(item.p10, item.w)} /kg
                  </div>
                </div>

                {/* Explicit Bobot & Profit Row per Assignment Requirement #3 */}
                <div className="w-full pt-2 border-t border-[var(--ln)]/60 flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[var(--mut)] block">Bobot</span>
                    <span className="w font-mono-num text-xs font-bold text-[var(--ink)]">
                      {item.w} kg
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--mut)] block">Profit</span>
                    <span className="p font-mono-num text-sm font-extrabold text-[var(--ac)]">
                      {formatProfit(item.p10)}
                    </span>
                  </div>
                </div>

                {/* Subtle relative profit bar */}
                <div
                  className="mt-1.5 h-1 w-full rounded-full bg-[var(--ln)]/60 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-[var(--ac)] transition-all duration-200"
                    style={{ width: `${profitPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          id="grid"
          className="empty rounded-xl border border-dashed border-[var(--ln)] bg-[var(--bg)]/40 py-12 text-center text-sm text-[var(--mut)]"
        >
          Tidak ada barang pada kategori atau filter ini.
        </div>
      )}

      {/* Pagination Bar */}
      <div className="pg mt-5 pt-4 border-t border-[var(--ln)]/70 flex items-center justify-between sm:justify-center gap-4">
        <button
          id="pv"
          type="button"
          disabled={page <= 1}
          onClick={onPrevPage}
          className="btn rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] disabled:opacity-45 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
        >
          ← Sebelumnya
        </button>
        <span
          id="pn"
          className="font-mono-num text-xs sm:text-sm font-semibold text-[var(--mut)] whitespace-nowrap"
        >
          Hal {page} / {totalPages}
        </span>
        <button
          id="nx"
          type="button"
          disabled={page >= totalPages}
          onClick={onNextPage}
          className="btn rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] disabled:opacity-45 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
        >
          Berikutnya →
        </button>
      </div>
    </section>
  );
};
