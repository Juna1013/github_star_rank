export type Rank = {
  name: string;
  color: string;
  min: number;
  max: number | null;
};

export const RANKS: Rank[] = [
  { name: '灰', color: '#808080', min: 0,    max: 399  },
  { name: '茶', color: '#804000', min: 400,  max: 799  },
  { name: '緑', color: '#008000', min: 800,  max: 1199 },
  { name: '水', color: '#00C0C0', min: 1200, max: 1599 },
  { name: '青', color: '#0000FF', min: 1600, max: 1999 },
  { name: '黄', color: '#C0C000', min: 2000, max: 2399 },
  { name: '橙', color: '#FF8000', min: 2400, max: 2799 },
  { name: '赤', color: '#FF0000', min: 2800, max: null },
];

export function getRank(stars: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (stars >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRank(stars: number): Rank | null {
  const current = getRank(stars);
  const idx = RANKS.findIndex(r => r.name === current.name);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function calcProgress(stars: number): number {
  const rank = getRank(stars);
  const next = getNextRank(stars);
  if (!next) return 100;
  return Math.floor(((stars - rank.min) / (next.min - rank.min)) * 100);
}
