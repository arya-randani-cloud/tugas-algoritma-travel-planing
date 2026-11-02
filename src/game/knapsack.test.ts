import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEVEL_CONFIGS,
  SUITCASE_CAPACITY_KG,
  generateItems,
  solveKnapsackDP,
  computeGreedySteps,
  calculateBagStats,
  filterAndSortItems,
  formatProfit,
  KnapsackItem,
} from './knapsack';

test('all difficulty levels enforce 100 kg suitcase capacity and valid categories', () => {
  assert.equal(LEVEL_CONFIGS.easy.cap, 100);
  assert.equal(LEVEL_CONFIGS.medium.cap, 100);
  assert.equal(LEVEL_CONFIGS.hard.cap, 100);
  assert.equal(SUITCASE_CAPACITY_KG, 100);

  const easyItems = generateItems('easy');
  assert.equal(easyItems.length, 12);
  for (const item of easyItems) {
    assert.ok(item.w >= 4 && item.w <= 24);
    assert.ok(item.category.length > 0);
  }
});

test('solveKnapsackDP finds true optimal profit when Greedy by Profit is suboptimal', () => {
  const sampleItems: KnapsackItem[] = [
    { id: 1, ic: '📷', name: 'Kamera', category: 'Elektronik', w: 60, p10: 1000 },
    { id: 2, ic: '🧥', name: 'Jaket', category: 'Pakaian', w: 50, p10: 900 },
    { id: 3, ic: '⛺', name: 'Tenda', category: 'Perlengkapan Liburan', w: 50, p10: 900 },
  ];

  const dp = solveKnapsackDP(sampleItems, 100);
  assert.equal(dp.optimalProfitP10, 1800);
  assert.deepEqual(dp.optimalItemIds, [2, 3]);
  assert.equal(dp.optimalWeight, 100);

  const greedySteps = computeGreedySteps(sampleItems, 100, 'profit');
  assert.equal(greedySteps.length, 3);
  assert.equal(greedySteps[0].item.id, 1);
  assert.equal(greedySteps[0].accepted, true);
  assert.equal(greedySteps[1].accepted, false);
  assert.equal(greedySteps[2].accepted, false);
  assert.equal(greedySteps[2].profitAfterP10, 1000);
});

test('filterAndSortItems filters by travel category, bag status, capacity fit, and query', () => {
  const sampleItems: KnapsackItem[] = [
    { id: 1, ic: '🧥', name: 'Jaket Parka', category: 'Pakaian', w: 40, p10: 500 },
    { id: 2, ic: '📷', name: 'Kamera Mirrorless', category: 'Elektronik', w: 70, p10: 1200 },
    { id: 3, ic: '🍱', name: 'Kotak Bekal', category: 'Bekal & Konsumsi', w: 30, p10: 900 },
  ];
  const bag = new Set<number>([1]);
  const stats = calculateBagStats(sampleItems, bag, 100);
  assert.equal(stats.totalWeight, 40);
  assert.equal(stats.remainingWeight, 60);
  assert.equal(stats.totalProfitP10, 500);

  // Filter by fit (remaining 60 kg -> only #3 fits)
  const fitList = filterAndSortItems(sampleItems, bag, 100, stats.totalWeight, '', 'fit', 'id', true);
  assert.deepEqual(fitList.map((i) => i.id), [3]);

  // Filter by category 'Elektronik'
  const elektronikList = filterAndSortItems(
    sampleItems,
    bag,
    100,
    stats.totalWeight,
    '',
    'all',
    'id',
    true,
    'Elektronik'
  );
  assert.deepEqual(elektronikList.map((i) => i.id), [2]);

  assert.equal(formatProfit(125), '12.5');
});
