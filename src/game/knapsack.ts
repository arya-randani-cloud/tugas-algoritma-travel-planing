export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameMode = 'manual' | 'auto';
export type FilterMode = 'all' | 'free' | 'in' | 'fit';
export type SortKey = 'id' | 'w' | 'p' | 'ratio';
export type GreedyStrategy = 'profit' | 'weight' | 'density';
export type AppShellState = 'title' | 'playing' | 'paused' | 'gameover';

export const TRAVEL_CATEGORIES = [
  'Semua Kategori',
  'Pakaian',
  'Elektronik',
  'Perlengkapan Liburan',
  'Toiletries & Obat',
  'Bekal & Konsumsi',
  'Aksesori & Dokumen',
] as const;

export type TravelCategory = (typeof TRAVEL_CATEGORIES)[number];

export interface LevelConfig {
  label: string;
  subtitle: string;
  tripType: string;
  n: number;
  cap: number; // Always 100 kg suitcase capacity per assignment spec
  wmax: number;
}

export interface KnapsackItem {
  id: number;
  ic: string;
  name: string;
  category: Exclude<TravelCategory, 'Semua Kategori'>;
  w: number;
  p10: number; // Profit stored as integer * 10 (1 decimal place)
}

export interface DPSolution {
  optimalProfitP10: number;
  optimalItemIds: number[];
  optimalWeight: number;
}

export interface GreedyStep {
  stepNumber: number;
  totalSteps: number;
  item: KnapsackItem;
  accepted: boolean;
  weightAfter: number;
  profitAfterP10: number;
  remainingCapAfter: number;
  logText: string;
}

export const SUITCASE_CAPACITY_KG = 100;

export const LEVEL_CONFIGS: Record<DifficultyLevel, LevelConfig> = {
  easy: {
    label: 'Easy (Liburan Singkat)',
    subtitle: '12 barang pilihan · Koper 100 kg',
    tripType: 'Liburan Akhir Pekan',
    n: 12,
    cap: SUITCASE_CAPACITY_KG,
    wmax: 24,
  },
  medium: {
    label: 'Medium (Perjalanan Antar-Kota)',
    subtitle: '25 barang pilihan · Koper 100 kg',
    tripType: 'Tur Dalam Negeri 1 Minggu',
    n: 25,
    cap: SUITCASE_CAPACITY_KG,
    wmax: 28,
  },
  hard: {
    label: 'Hard (Perjalanan Jauh / Lintas Negara)',
    subtitle: '40 barang pilihan · Koper 100 kg',
    tripType: 'Ekspedisi Liburan Panjang',
    n: 40,
    cap: SUITCASE_CAPACITY_KG,
    wmax: 30,
  },
};

export const ITEM_CATALOG: Array<{
  ic: string;
  name: string;
  category: Exclude<TravelCategory, 'Semua Kategori'>;
}> = [
  // Pakaian
  { ic: '🧥', name: 'Jaket Parka Musim Dingin', category: 'Pakaian' },
  { ic: '👕', name: 'Set Kaos & Kemeja Santai', category: 'Pakaian' },
  { ic: '👖', name: 'Celana Panjang Cargo', category: 'Pakaian' },
  { ic: '👟', name: 'Sepatu Sneakers Jalan', category: 'Pakaian' },
  { ic: '🧣', name: 'Syal & Sarung Tangan Wol', category: 'Pakaian' },
  { ic: '🧦', name: 'Paket Kaus Kaki Hangat', category: 'Pakaian' },
  { ic: '🥾', name: 'Sepatu Gunung Waterproof', category: 'Pakaian' },
  { ic: '🧢', name: 'Topi Pelindung Matahari', category: 'Pakaian' },

  // Elektronik
  { ic: '📷', name: 'Kamera Mirrorless + Lensa', category: 'Elektronik' },
  { ic: '💻', name: 'Laptop & Charger', category: 'Elektronik' },
  { ic: '📱', name: 'Smartphone Cadangan', category: 'Elektronik' },
  { ic: '🎧', name: 'Headphone Peredam Bising', category: 'Elektronik' },
  { ic: '🔋', name: 'Powerbank 20.000 mAh', category: 'Elektronik' },
  { ic: '🎮', name: 'Konsol Game Portabel', category: 'Elektronik' },
  { ic: '🔦', name: 'Senter LED Isi Ulang', category: 'Elektronik' },
  { ic: '📻', name: 'Speaker Bluetooth Mini', category: 'Elektronik' },

  // Perlengkapan Liburan
  { ic: '⛺', name: 'Tenda Piknik Lipat', category: 'Perlengkapan Liburan' },
  { ic: '🛌', name: 'Sleeping Bag Hangat', category: 'Perlengkapan Liburan' },
  { ic: '☂️', name: 'Payung Lipat Anti-Angin', category: 'Perlengkapan Liburan' },
  { ic: '🔭', name: 'Teropong Pemandangan', category: 'Perlengkapan Liburan' },
  { ic: '🎸', name: 'Ukulele / Gitar Travel', category: 'Perlengkapan Liburan' },
  { ic: '🪁', name: 'Hammock Santai Lipat', category: 'Perlengkapan Liburan' },
  { ic: '🧭', name: 'Kompas & Peta Wisata', category: 'Perlengkapan Liburan' },
  { ic: '🛟', name: 'Pelampung & Alat Snorkeling', category: 'Perlengkapan Liburan' },

  // Toiletries & Obat
  { ic: '🧴', name: 'Tas Perlengkapan Mandi', category: 'Toiletries & Obat' },
  { ic: '🩹', name: 'Kotak P3K & Obat Pribadi', category: 'Toiletries & Obat' },
  { ic: '🪥', name: 'Set Sikat Gigi & Handuk', category: 'Toiletries & Obat' },
  { ic: '☀️', name: 'Sunscreen & Pelembap Kulit', category: 'Toiletries & Obat' },
  { ic: '💨', name: 'Hairdryer Lipat Mini', category: 'Toiletries & Obat' },
  { ic: '🧼', name: 'Sabun & Sampo Travel Pack', category: 'Toiletries & Obat' },

  // Bekal & Konsumsi
  { ic: '🍱', name: 'Kotak Bekal Makanan Kering', category: 'Bekal & Konsumsi' },
  { ic: '☕', name: 'Termos Air Panas Stainless', category: 'Bekal & Konsumsi' },
  { ic: '🍎', name: 'Paket Buah & Camilan Sehat', category: 'Bekal & Konsumsi' },
  { ic: '🥫', name: 'Makanan Kaleng Siap Saji', category: 'Bekal & Konsumsi' },
  { ic: '🧀', name: 'Roti Lapis & Keju Bekal', category: 'Bekal & Konsumsi' },
  { ic: '🍫', name: 'Cokelat & Energy Bar', category: 'Bekal & Konsumsi' },

  // Aksesori & Dokumen
  { ic: '🛂', name: 'Dompet Paspor & Tiket', category: 'Aksesori & Dokumen' },
  { ic: '🕶️', name: 'Kacamata Hitam UV400', category: 'Aksesori & Dokumen' },
  { ic: '⌚', name: 'Jam Tangan Dual-Time', category: 'Aksesori & Dokumen' },
  { ic: '📚', name: 'Buku Bacaan & Jurnal Travel', category: 'Aksesori & Dokumen' },
  { ic: '🎁', name: 'Kotak Oleh-Oleh Keluarga', category: 'Aksesori & Dokumen' },
  { ic: '🔑', name: 'Gembok Koper TSA & Tag', category: 'Aksesori & Dokumen' },
];

export const ITEMS_PER_PAGE = 12;

export function formatProfit(p10: number): string {
  return (p10 / 10).toFixed(1);
}

export function formatRatio(p10: number, w: number): string {
  return (p10 / 10 / Math.max(1, w)).toFixed(1);
}

export function randomInt(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function generateItems(
  level: DifficultyLevel,
  rng: () => number = Math.random
): KnapsackItem[] {
  const cfg = LEVEL_CONFIGS[level];
  const pool = [...ITEM_CATALOG].sort(() => rng() - 0.5);

  return Array.from({ length: cfg.n }, (_, i) => {
    // Ensure total weight of all items exceeds 100 kg so the 0/1 Knapsack choice is non-trivial
    const w = randomInt(4, cfg.wmax, rng);
    const p10 = w * randomInt(10, 55, rng) + randomInt(10, 150, rng);
    const entry = pool[i % pool.length];
    return {
      id: i + 1,
      ic: entry.ic,
      name: entry.name,
      category: entry.category,
      w,
      p10,
    };
  });
}

/**
 * Exact 0/1 Knapsack Dynamic Programming solver O(n * W).
 */
export function solveKnapsackDP(items: KnapsackItem[], capacity: number): DPSolution {
  const n = items.length;
  const W = Math.max(0, Math.floor(capacity));
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const it = items[i - 1];
    for (let c = 0; c <= W; c++) {
      if (it.w <= c) {
        const take = dp[i - 1][c - it.w] + it.p10;
        const skip = dp[i - 1][c];
        dp[i][c] = take > skip ? take : skip;
      } else {
        dp[i][c] = dp[i - 1][c];
      }
    }
  }

  const optimalProfitP10 = dp[n][W];
  const optimalItemIds: number[] = [];
  let remCap = W;

  for (let i = n; i >= 1; i--) {
    if (dp[i][remCap] !== dp[i - 1][remCap]) {
      const it = items[i - 1];
      optimalItemIds.push(it.id);
      remCap -= it.w;
    }
  }

  optimalItemIds.reverse();
  const optimalWeight = W - remCap;

  return {
    optimalProfitP10,
    optimalItemIds,
    optimalWeight,
  };
}

/**
 * Generates step-by-step sequence of Greedy algorithm:
 * - 'profit': Greedy by Profit (sort profit descending)
 * - 'weight': Greedy by Weight (sort weight ascending)
 * - 'density': Greedy by Density (sort profit/weight descending)
 */
export function computeGreedySteps(
  items: KnapsackItem[],
  capacity: number,
  strategy: GreedyStrategy = 'profit'
): GreedyStep[] {
  const ordered = [...items].sort((a, b) => {
    if (strategy === 'weight') {
      return a.w - b.w || b.p10 - a.p10 || a.id - b.id;
    }
    if (strategy === 'density') {
      const da = a.p10 / Math.max(1, a.w);
      const db = b.p10 / Math.max(1, b.w);
      return db - da || b.p10 - a.p10 || a.id - b.id;
    }
    return b.p10 - a.p10 || a.id - b.id;
  });

  const steps: GreedyStep[] = [];
  let currentWeight = 0;
  let currentProfitP10 = 0;

  for (let idx = 0; idx < ordered.length; idx++) {
    const it = ordered[idx];
    const remainingBefore = capacity - currentWeight;
    const accepted = currentWeight + it.w <= capacity;

    if (accepted) {
      currentWeight += it.w;
      currentProfitP10 += it.p10;
    }

    const remainingAfter = capacity - currentWeight;
    const logText = `Langkah ${idx + 1}/${ordered.length}: #${it.id} ${it.name} (${it.w} kg, profit ${formatProfit(
      it.p10
    )}) ${
      accepted
        ? '→ dimasukkan ke koper.'
        : `→ dilewati (sisa kapasitas ${remainingBefore} kg tidak cukup).`
    }`;

    steps.push({
      stepNumber: idx + 1,
      totalSteps: ordered.length,
      item: it,
      accepted,
      weightAfter: currentWeight,
      profitAfterP10: currentProfitP10,
      remainingCapAfter: remainingAfter,
      logText,
    });
  }

  return steps;
}

export function calculateBagStats(
  items: KnapsackItem[],
  bagIds: Set<number>,
  capacity: number
) {
  let totalWeight = 0;
  let totalProfitP10 = 0;
  const packedItems: KnapsackItem[] = [];

  for (const id of bagIds) {
    const found = items.find((i) => i.id === id);
    if (found) {
      totalWeight += found.w;
      totalProfitP10 += found.p10;
      packedItems.push(found);
    }
  }

  const remainingWeight = Math.max(0, capacity - totalWeight);
  const isFull = capacity > 0 && totalWeight === capacity;
  const utilizationPct = capacity > 0 ? Math.min(100, (totalWeight / capacity) * 100) : 0;

  return {
    totalWeight,
    remainingWeight,
    totalProfitP10,
    isFull,
    utilizationPct,
    packedItems,
  };
}

export function filterAndSortItems(
  items: KnapsackItem[],
  bagIds: Set<number>,
  capacity: number,
  currentWeight: number,
  query: string,
  filter: FilterMode,
  sortKey: SortKey,
  asc: boolean,
  categoryFilter: TravelCategory = 'Semua Kategori'
): KnapsackItem[] {
  const trimmedQuery = query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (trimmedQuery) {
      const matchId = String(item.id) === trimmedQuery;
      const matchName = item.name.toLowerCase().includes(trimmedQuery);
      if (!matchId && !matchName) return false;
    }
    if (
      categoryFilter !== 'Semua Kategori' &&
      item.category !== categoryFilter
    ) {
      return false;
    }
    const inBag = bagIds.has(item.id);
    if (filter === 'all') return true;
    if (filter === 'free') return !inBag;
    if (filter === 'in') return inBag;
    if (filter === 'fit') return !inBag && item.w <= capacity - currentWeight;
    return true;
  });

  const metric = (it: KnapsackItem): number => {
    switch (sortKey) {
      case 'id':
        return it.id;
      case 'w':
        return it.w;
      case 'p':
        return it.p10;
      case 'ratio':
        return it.p10 / Math.max(1, it.w);
    }
  };

  return filtered.sort((a, b) => {
    const diff = metric(a) - metric(b) || a.id - b.id;
    return asc ? diff : -diff;
  });
}
