import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppShellState,
  DifficultyLevel,
  FilterMode,
  GameMode,
  GreedyStrategy,
  ITEMS_PER_PAGE,
  KnapsackItem,
  LEVEL_CONFIGS,
  SortKey,
  TravelCategory,
  calculateBagStats,
  computeGreedySteps,
  filterAndSortItems,
  formatProfit,
  generateItems,
  solveKnapsackDP,
} from './game/knapsack';
import { TitleModal } from './components/TitleModal';
import { ResultModal } from './components/ResultModal';
import { PauseModal } from './components/PauseModal';
import { AcademicReportModal } from './components/AcademicReportModal';
import { ItemCatalogSection } from './components/ItemCatalogSection';
import { BackpackSection } from './components/BackpackSection';
import { soundFX } from './utils/sound';

const CONFETTI_COLORS = ['#D99B16', '#0E7C7B', '#C43B3B', '#3B6FD9', '#2E8B57'];

export default function App() {
  const isAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [muted, setMuted] = useState(false);
  const [shellState, setShellState] = useState<AppShellState>(() =>
    isAutostart ? 'playing' : 'title'
  );
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Player & Travel Setup State
  const [playerNameInput, setPlayerNameInput] = useState(() =>
    isAutostart ? 'Mahasiswa' : ''
  );
  const [activePlayerName, setActivePlayerName] = useState(() =>
    isAutostart ? 'Mahasiswa' : ''
  );
  const [destination, setDestination] = useState('Kyoto, Jepang');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('easy');
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>('easy');
  const [nameError, setNameError] = useState('');

  // Core Knapsack State (100 kg suitcase capacity)
  const [items, setItems] = useState<KnapsackItem[]>(() =>
    generateItems('easy')
  );
  const [bagIds, setBagIds] = useState<Set<number>>(() => new Set());
  const [mode, setMode] = useState<GameMode>('manual');
  const [greedyStrategy, setGreedyStrategy] = useState<GreedyStrategy>('profit');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [asc, setAsc] = useState(true);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [categoryFilter, setCategoryFilter] = useState<TravelCategory>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentHighlightedId, setCurrentHighlightedId] = useState<number | null>(null);
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [logText, setLogText] = useState('');

  // Result Modal State
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultWinFlag, setResultWinFlag] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  // Greedy cancellation token
  const runTokenRef = useRef(0);

  // Sync theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Sync shell state to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = shellState;
  }, [shellState]);

  const capacity = LEVEL_CONFIGS[activeLevel].cap; // 100 kg

  const dpSolution = useMemo(
    () => solveKnapsackDP(items, capacity),
    [items, capacity]
  );

  const bagStats = useMemo(
    () => calculateBagStats(items, bagIds, capacity),
    [items, bagIds, capacity]
  );

  const filteredItems = useMemo(
    () =>
      filterAndSortItems(
        items,
        bagIds,
        capacity,
        bagStats.totalWeight,
        searchQuery,
        filter,
        sortKey,
        asc,
        categoryFilter
      ),
    [items, bagIds, capacity, bagStats.totalWeight, searchQuery, filter, sortKey, asc, categoryFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, safePage]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  }, []);

  const spawnConfetti = useCallback(() => {
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('i');
      el.className = 'confetti-piece cf';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      el.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;
      document.body.appendChild(el);
      window.setTimeout(() => el.remove(), 3600);
    }
  }, []);

  const resetBag = useCallback((keepModeLog = false, targetMode?: GameMode) => {
    runTokenRef.current += 1;
    setRunning(false);
    setOver(false);
    setBagIds(new Set());
    setCurrentHighlightedId(null);
    const activeM = targetMode ?? mode;
    setLogText(
      keepModeLog && activeM === 'auto'
        ? 'Tekan “Jalankan Greedy” untuk melihat proses pengemasan koper 100 kg.'
        : ''
    );
  }, [mode]);

  const openFinishModal = useCallback(
    (win: boolean, currentBagIds?: Set<number>) => {
      const effectiveBag = currentBagIds ?? bagIds;
      const stats = calculateBagStats(items, effectiveBag, capacity);
      const isBest = stats.totalProfitP10 === dpSolution.optimalProfitP10;

      if (win === true) {
        setOver(true);
        spawnConfetti();
        soundFX.playVictory();
      } else if (mode === 'manual') {
        setOver(!isBest ? false : true);
      }

      setResultWinFlag(win);
      setResultModalOpen(true);
      setShellState('gameover');
    },
    [bagIds, items, capacity, dpSolution.optimalProfitP10, mode, spawnConfetti]
  );

  const handleStartGame = useCallback(() => {
    const trimmed = playerNameInput.trim();
    if (!trimmed) {
      setNameError('Nama pemain wajib diisi.');
      soundFX.playError();
      return;
    }
    setNameError('');
    setActivePlayerName(trimmed);
    setActiveLevel(selectedLevel);
    const freshItems = generateItems(selectedLevel);
    setItems(freshItems);
    setMode('manual');
    setPage(1);
    setSearchQuery('');
    setFilter('all');
    setCategoryFilter('Semua Kategori');
    setSortKey('id');
    setAsc(true);
    runTokenRef.current += 1;
    setRunning(false);
    setOver(false);
    setBagIds(new Set());
    setCurrentHighlightedId(null);
    setLogText('');
    setResultModalOpen(false);
    setShellState('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [playerNameInput, selectedLevel]);

  const handleSelectItem = useCallback(
    (id: number) => {
      if (over || mode !== 'manual' || bagIds.has(id)) return;
      const item = items.find((i) => i.id === id);
      if (!item) return;

      if (bagStats.totalWeight + item.w > capacity) {
        soundFX.playError();
        showToast(`Barang #${id} ${item.name} (${item.w} kg) melebihi sisa ruang koper.`);
        setShakingId(id);
        window.setTimeout(() => {
          setShakingId((prev) => (prev === id ? null : prev));
        }, 360);
        return;
      }

      soundFX.playPickup();
      const nextBag = new Set(bagIds);
      nextBag.add(id);
      setBagIds(nextBag);

      const nextStats = calculateBagStats(items, nextBag, capacity);
      if (nextStats.totalProfitP10 === dpSolution.optimalProfitP10) {
        openFinishModal(true, nextBag);
      }
    },
    [over, mode, bagIds, items, bagStats.totalWeight, capacity, showToast, dpSolution.optimalProfitP10, openFinishModal]
  );

  const handleRemoveItem = useCallback(
    (id: number) => {
      if (over || running || mode !== 'manual') return;
      if (!bagIds.has(id)) return;
      soundFX.playRemove();
      const nextBag = new Set(bagIds);
      nextBag.delete(id);
      setBagIds(nextBag);
    },
    [over, running, mode, bagIds]
  );

  const handleSwitchMode = useCallback(
    (nextMode: GameMode) => {
      if (mode === nextMode) return;
      setMode(nextMode);
      resetBag(true, nextMode);
    },
    [mode, resetBag]
  );

  const handleRunGreedy = useCallback(async () => {
    if (running || over) return;
    runTokenRef.current += 1;
    const myRun = runTokenRef.current;

    setRunning(true);
    setOver(false);
    setBagIds(new Set());
    setCurrentHighlightedId(null);

    const steps = computeGreedySteps(items, capacity, greedyStrategy);
    const delayMs = items.length > 25 ? 300 : 520;
    const workingBag = new Set<number>();

    for (const step of steps) {
      if (runTokenRef.current !== myRun) return;
      setCurrentHighlightedId(step.item.id);
      if (step.accepted) {
        workingBag.add(step.item.id);
        setBagIds(new Set(workingBag));
      }
      soundFX.playGreedyStep(step.accepted);
      setLogText(step.logText);

      await new Promise((resolve) =>
        window.setTimeout(resolve, step.accepted ? delayMs : Math.round(delayMs / 3))
      );
    }

    if (runTokenRef.current !== myRun) return;
    setRunning(false);
    setCurrentHighlightedId(null);
    setOver(true);
    setLogText('Simulasi Greedy selesai.');
    openFinishModal(false, workingBag);
  }, [running, over, items, capacity, greedyStrategy, openFinishModal]);

  const handleApplyOptimalSet = useCallback(() => {
    runTokenRef.current += 1;
    setRunning(false);
    setMode('manual');
    const optSet = new Set<number>(dpSolution.optimalItemIds);
    setBagIds(optSet);
    setResultModalOpen(false);
    setOver(false);
    setShellState('playing');
    setLogText('Kombinasi optimal Dynamic Programming diterapkan ke dalam koper 100 kg.');
    showToast('Solusi Optimal DP diterapkan ke koper.');
  }, [dpSolution.optimalItemIds, showToast]);

  // Global keyboard bindings
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA');

      if (reportModalOpen) {
        if (e.key === 'Escape') {
          setReportModalOpen(false);
        }
        return;
      }

      if (shellState === 'title') {
        if (e.key === 'Enter' && !isInput) {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (isInput) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const nextMuted = soundFX.toggleMute();
        setMuted(nextMuted);
        showToast(nextMuted ? 'Suara dimatikan' : 'Suara diaktifkan');
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (resultModalOpen) {
          if (e.key === 'Escape') {
            setResultModalOpen(false);
            setShellState('playing');
          }
          return;
        }
        e.preventDefault();
        setShellState((prev) => (prev === 'paused' ? 'playing' : 'paused'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shellState, resultModalOpen, reportModalOpen, handleStartGame, showToast]);

  const levelCapitalized =
    activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col">
      {/* Compact Game Shell HUD Bar */}
      <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ln)]/80">
        {/* Zone 1: Brand Title & Session Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--ac)] text-white flex items-center justify-center font-display font-extrabold text-sm shadow-xs select-none">
            🧳
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] leading-none">
              Travel Knapsack Game
            </h1>
            <div
              id="who"
              className="who text-xs sm:text-sm font-medium text-[var(--mut)] mt-0.5"
            >
              {activePlayerName
                ? `${activePlayerName} · Tujuan: ${destination} · ${levelCapitalized} (${items.length} barang · Koper ${capacity} kg)`
                : `Tugas Strategi Algoritma · Koper Liburan ${capacity} kg`}
            </div>
          </div>
        </div>

        {/* Zone 2: Live Total Berat & Total Profit Header Readout */}
        <div className="hidden xl:flex items-center gap-6 text-xs text-[var(--mut)]">
          <div>
            <span>Total Berat Koper</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <strong className="font-mono-num text-[var(--ink)]">
              {bagStats.totalWeight} / {capacity} kg
            </strong>
          </div>
          <div>
            <span>Total Profit</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <strong className="font-mono-num text-[var(--ac)]">
              {formatProfit(bagStats.totalProfitP10)}
            </strong>
          </div>
          <div>
            <span>Mode</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <strong className="text-[var(--ink)]">
              {mode === 'auto' ? 'Automatic (Greedy)' : 'Manual'}
            </strong>
          </div>
        </div>

        {/* Zone 3: Utility, Academic Report & New Trip Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="reportBtn"
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="rounded-xl border border-[var(--ac)]/50 bg-[var(--acs)]/60 hover:border-[var(--ac)] px-3 py-2 text-xs sm:text-sm font-bold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
          >
            📄 Laporan Tugas
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              const nextMuted = soundFX.toggleMute();
              setMuted(nextMuted);
            }}
            aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
            title="Suara [M]"
            className="w-9 h-9 rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] flex items-center justify-center text-[var(--ink)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              {muted ? (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
            }}
            aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
            title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
            className="w-9 h-9 rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] flex items-center justify-center text-[var(--ink)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              {theme === 'dark' ? (
                <>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
          </button>

          <button
            id="newBtn"
            type="button"
            onClick={() => {
              runTokenRef.current += 1;
              setRunning(false);
              setResultModalOpen(false);
              setShellState('title');
            }}
            className="btn rounded-xl border border-[var(--ln)] bg-[var(--pn)] hover:border-[var(--ac)] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Rencana Baru
          </button>
        </div>
      </header>

      {/* Main Two-Column Sandbox Workspace */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start flex-1">
        <ItemCatalogSection
          items={items}
          paginatedItems={paginatedItems}
          bagIds={bagIds}
          capacity={capacity}
          currentWeight={bagStats.totalWeight}
          mode={mode}
          over={over}
          currentHighlightedId={currentHighlightedId}
          shakingId={shakingId}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          filter={filter}
          onFilterChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(c) => {
            setCategoryFilter(c);
            setPage(1);
          }}
          sortKey={sortKey}
          onSortKeyChange={(s) => {
            setSortKey(s);
            setPage(1);
          }}
          asc={asc}
          onToggleAsc={() => setAsc((a) => !a)}
          page={safePage}
          totalPages={totalPages}
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
          onSelectItem={handleSelectItem}
          filteredCount={filteredItems.length}
        />

        <BackpackSection
          mode={mode}
          onSelectMode={handleSwitchMode}
          greedyStrategy={greedyStrategy}
          onSelectGreedyStrategy={(s) => {
            setGreedyStrategy(s);
            resetBag(true, 'auto');
          }}
          capacity={capacity}
          totalWeight={bagStats.totalWeight}
          remainingWeight={bagStats.remainingWeight}
          totalProfitP10={bagStats.totalProfitP10}
          isFull={bagStats.isFull}
          utilizationPct={bagStats.utilizationPct}
          packedItems={bagStats.packedItems}
          currentHighlightedId={currentHighlightedId}
          logText={logText}
          running={running}
          over={over}
          onRemoveItem={handleRemoveItem}
          onRunGreedy={handleRunGreedy}
          onReset={() => resetBag(true)}
          onFinish={() => openFinishModal(false)}
        />
      </main>

      {/* Modals */}
      <TitleModal
        open={shellState === 'title'}
        playerName={playerNameInput}
        onPlayerNameChange={(v) => {
          setPlayerNameInput(v);
          if (nameError) setNameError('');
        }}
        destination={destination}
        onDestinationChange={setDestination}
        level={selectedLevel}
        onLevelChange={setSelectedLevel}
        errorText={nameError}
        onStart={handleStartGame}
        onOpenReport={() => setReportModalOpen(true)}
      />

      <PauseModal
        open={shellState === 'paused'}
        playerName={activePlayerName || 'Mahasiswa'}
        levelLabel={`${LEVEL_CONFIGS[activeLevel].label} (Koper ${capacity} kg)`}
        totalWeight={bagStats.totalWeight}
        capacity={capacity}
        totalProfitFormatted={formatProfit(bagStats.totalProfitP10)}
        onResume={() => setShellState('playing')}
        onResetBag={() => resetBag(true)}
        onNewPlayer={() => {
          runTokenRef.current += 1;
          setRunning(false);
          setShellState('title');
        }}
      />

      <ResultModal
        open={resultModalOpen}
        winFlag={resultWinFlag}
        playerName={activePlayerName}
        destination={destination}
        mode={mode}
        greedyStrategy={greedyStrategy}
        totalWeight={bagStats.totalWeight}
        capacity={capacity}
        totalProfitP10={bagStats.totalProfitP10}
        dpSolution={dpSolution}
        items={items}
        bagIds={bagIds}
        onContinue={() => {
          setOver(false);
          setResultModalOpen(false);
          setShellState('playing');
        }}
        onPlayAgain={() => {
          setResultModalOpen(false);
          setShellState('title');
        }}
        onClose={() => {
          setResultModalOpen(false);
          setShellState('playing');
        }}
        onApplyOptimalSet={handleApplyOptimalSet}
      />

      <AcademicReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Toast Notification (#toast) */}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 bottom-6 -translate-x-1/2 z-50 rounded-full bg-[var(--ink)] text-[var(--bg)] px-4 py-2 text-xs sm:text-sm font-semibold shadow-lg transition-opacity duration-200 pointer-events-none ${
          toastVisible ? 'on opacity-100' : 'opacity-0'
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}
