// Trade-In Price Database — Estimasi Harga Pasar Bekas Indonesia
// Harga dalam Rupiah, berdasarkan data pasar OLX/Tokopedia/Shopee
// Terakhir update: September 2026

export interface TradeInVariant {
  storage: string;
  min: number;
  max: number;
}

export interface TradeInEntry {
  keywords: string[];
  name: string;
  brand: string;
  variants: TradeInVariant[];
}

export const TRADE_IN_DB: TradeInEntry[] = [
  // ─── APPLE iPHONE ───────────────────────────────────────────────────────────
  {
    keywords: ['iphone 16 pro max', '16 pro max'],
    name: 'iPhone 16 Pro Max', brand: 'Apple',
    variants: [
      { storage: '256GB', min: 18_000_000, max: 22_000_000 },
      { storage: '512GB', min: 20_000_000, max: 24_000_000 },
      { storage: '1TB',   min: 22_000_000, max: 27_000_000 },
    ],
  },
  {
    keywords: ['iphone 16 pro', '16 pro'],
    name: 'iPhone 16 Pro', brand: 'Apple',
    variants: [
      { storage: '256GB', min: 16_000_000, max: 19_000_000 },
      { storage: '512GB', min: 17_500_000, max: 21_000_000 },
      { storage: '1TB',   min: 19_000_000, max: 23_000_000 },
    ],
  },
  {
    keywords: ['iphone 16 plus', '16 plus'],
    name: 'iPhone 16 Plus', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 12_500_000, max: 15_000_000 },
      { storage: '256GB', min: 13_500_000, max: 16_500_000 },
      { storage: '512GB', min: 15_000_000, max: 18_500_000 },
    ],
  },
  {
    keywords: ['iphone 16'],
    name: 'iPhone 16', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 13_000_000, max: 15_000_000 },
      { storage: '256GB', min: 14_000_000, max: 17_000_000 },
      { storage: '512GB', min: 15_500_000, max: 18_500_000 },
    ],
  },
  {
    keywords: ['iphone 15 pro max', '15 pro max'],
    name: 'iPhone 15 Pro Max', brand: 'Apple',
    variants: [
      { storage: '256GB', min: 14_000_000, max: 17_000_000 },
      { storage: '512GB', min: 16_000_000, max: 19_500_000 },
      { storage: '1TB',   min: 18_000_000, max: 22_000_000 },
    ],
  },
  {
    keywords: ['iphone 15 pro', '15 pro'],
    name: 'iPhone 15 Pro', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 13_000_000, max: 15_500_000 },
      { storage: '256GB', min: 14_500_000, max: 17_000_000 },
      { storage: '512GB', min: 16_000_000, max: 19_000_000 },
      { storage: '1TB',   min: 18_000_000, max: 22_000_000 },
    ],
  },
  {
    keywords: ['iphone 15 plus', '15 plus'],
    name: 'iPhone 15 Plus', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 10_500_000, max: 12_500_000 },
      { storage: '256GB', min: 11_500_000, max: 13_500_000 },
      { storage: '512GB', min: 12_500_000, max: 15_000_000 },
    ],
  },
  {
    keywords: ['iphone 15'],
    name: 'iPhone 15', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 11_000_000, max: 13_000_000 },
      { storage: '256GB', min: 12_000_000, max: 14_500_000 },
      { storage: '512GB', min: 13_500_000, max: 16_000_000 },
    ],
  },
  {
    keywords: ['iphone 14 pro max', '14 pro max'],
    name: 'iPhone 14 Pro Max', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 13_000_000, max: 15_000_000 },
      { storage: '256GB', min: 14_000_000, max: 17_000_000 },
      { storage: '512GB', min: 15_500_000, max: 19_000_000 },
      { storage: '1TB',   min: 17_000_000, max: 21_000_000 },
    ],
  },
  {
    keywords: ['iphone 14 pro', '14 pro'],
    name: 'iPhone 14 Pro', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 11_000_000, max: 13_000_000 },
      { storage: '256GB', min: 12_000_000, max: 14_500_000 },
      { storage: '512GB', min: 13_000_000, max: 16_000_000 },
      { storage: '1TB',   min: 15_000_000, max: 18_000_000 },
    ],
  },
  {
    keywords: ['iphone 14 plus', '14 plus'],
    name: 'iPhone 14 Plus', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 8_500_000, max: 10_000_000 },
      { storage: '256GB', min: 9_500_000, max: 11_000_000 },
      { storage: '512GB', min: 10_500_000, max: 12_500_000 },
    ],
  },
  {
    keywords: ['iphone 14'],
    name: 'iPhone 14', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 9_000_000, max: 10_500_000 },
      { storage: '256GB', min: 10_000_000, max: 12_000_000 },
      { storage: '512GB', min: 11_000_000, max: 13_000_000 },
    ],
  },
  {
    keywords: ['iphone 13 pro max', '13 pro max'],
    name: 'iPhone 13 Pro Max', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 9_000_000, max: 11_000_000 },
      { storage: '256GB', min: 10_000_000, max: 12_000_000 },
      { storage: '512GB', min: 11_000_000, max: 13_500_000 },
      { storage: '1TB',   min: 12_000_000, max: 15_000_000 },
    ],
  },
  {
    keywords: ['iphone 13 pro', '13 pro'],
    name: 'iPhone 13 Pro', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 8_000_000, max: 9_500_000 },
      { storage: '256GB', min: 8_500_000, max: 10_500_000 },
      { storage: '512GB', min: 9_500_000, max: 12_000_000 },
      { storage: '1TB',   min: 11_000_000, max: 13_000_000 },
    ],
  },
  {
    keywords: ['iphone 13 mini', '13 mini'],
    name: 'iPhone 13 Mini', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 5_500_000, max: 7_000_000 },
      { storage: '256GB', min: 6_500_000, max: 8_000_000 },
      { storage: '512GB', min: 7_500_000, max: 9_000_000 },
    ],
  },
  {
    keywords: ['iphone 13'],
    name: 'iPhone 13', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 6_500_000, max: 7_500_000 },
      { storage: '256GB', min: 7_000_000, max: 8_500_000 },
      { storage: '512GB', min: 8_000_000, max: 9_500_000 },
    ],
  },
  {
    keywords: ['iphone 12 pro max', '12 pro max'],
    name: 'iPhone 12 Pro Max', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 6_000_000, max: 7_000_000 },
      { storage: '256GB', min: 6_500_000, max: 8_000_000 },
      { storage: '512GB', min: 7_500_000, max: 9_000_000 },
    ],
  },
  {
    keywords: ['iphone 12 pro', '12 pro'],
    name: 'iPhone 12 Pro', brand: 'Apple',
    variants: [
      { storage: '128GB', min: 5_500_000, max: 6_500_000 },
      { storage: '256GB', min: 6_000_000, max: 7_500_000 },
      { storage: '512GB', min: 7_000_000, max: 8_500_000 },
    ],
  },
  {
    keywords: ['iphone 12 mini', '12 mini'],
    name: 'iPhone 12 Mini', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 3_000_000, max: 3_800_000 },
      { storage: '128GB', min: 3_500_000, max: 4_500_000 },
      { storage: '256GB', min: 4_000_000, max: 5_000_000 },
    ],
  },
  {
    keywords: ['iphone 12'],
    name: 'iPhone 12', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 3_500_000, max: 4_200_000 },
      { storage: '128GB', min: 4_000_000, max: 4_800_000 },
      { storage: '256GB', min: 4_500_000, max: 5_500_000 },
    ],
  },
  {
    keywords: ['iphone 11 pro max', '11 pro max'],
    name: 'iPhone 11 Pro Max', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 3_500_000, max: 4_500_000 },
      { storage: '256GB', min: 4_000_000, max: 5_000_000 },
      { storage: '512GB', min: 4_500_000, max: 5_800_000 },
    ],
  },
  {
    keywords: ['iphone 11 pro', '11 pro'],
    name: 'iPhone 11 Pro', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 3_000_000, max: 3_800_000 },
      { storage: '256GB', min: 3_500_000, max: 4_500_000 },
      { storage: '512GB', min: 4_000_000, max: 5_000_000 },
    ],
  },
  {
    keywords: ['iphone 11'],
    name: 'iPhone 11', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 2_500_000, max: 3_200_000 },
      { storage: '128GB', min: 2_800_000, max: 3_500_000 },
      { storage: '256GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['iphone se 3', 'iphone se 2022', 'se 3'],
    name: 'iPhone SE (Gen 3)', brand: 'Apple',
    variants: [
      { storage: '64GB',  min: 2_800_000, max: 3_500_000 },
      { storage: '128GB', min: 3_200_000, max: 4_000_000 },
      { storage: '256GB', min: 3_800_000, max: 4_800_000 },
    ],
  },

  // ─── SAMSUNG GALAXY S SERIES ────────────────────────────────────────────────
  {
    keywords: ['samsung s24 ultra', 'galaxy s24 ultra', 's24 ultra'],
    name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 10_500_000, max: 13_000_000 },
      { storage: '512GB', min: 12_000_000, max: 15_000_000 },
      { storage: '1TB',   min: 14_000_000, max: 17_000_000 },
    ],
  },
  {
    keywords: ['samsung s24+', 'galaxy s24+', 's24+', 'samsung s24 plus', 's24 plus'],
    name: 'Samsung Galaxy S24+', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 9_000_000, max: 11_000_000 },
      { storage: '512GB', min: 10_000_000, max: 12_500_000 },
    ],
  },
  {
    keywords: ['samsung s24', 'galaxy s24', 's24'],
    name: 'Samsung Galaxy S24', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 7_500_000, max: 9_500_000 },
      { storage: '256GB', min: 8_500_000, max: 10_500_000 },
    ],
  },
  {
    keywords: ['samsung s23 ultra', 'galaxy s23 ultra', 's23 ultra'],
    name: 'Samsung Galaxy S23 Ultra', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 9_000_000, max: 11_500_000 },
      { storage: '512GB', min: 10_500_000, max: 13_500_000 },
      { storage: '1TB',   min: 12_500_000, max: 16_000_000 },
    ],
  },
  {
    keywords: ['samsung s23+', 'galaxy s23+', 's23+', 'samsung s23 plus', 's23 plus'],
    name: 'Samsung Galaxy S23+', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 7_500_000, max: 9_500_000 },
      { storage: '512GB', min: 8_500_000, max: 11_000_000 },
    ],
  },
  {
    keywords: ['samsung s23', 'galaxy s23', 's23'],
    name: 'Samsung Galaxy S23', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 6_000_000, max: 7_500_000 },
      { storage: '256GB', min: 6_500_000, max: 8_500_000 },
    ],
  },
  {
    keywords: ['samsung s22 ultra', 'galaxy s22 ultra', 's22 ultra'],
    name: 'Samsung Galaxy S22 Ultra', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 7_000_000, max: 9_000_000 },
      { storage: '256GB', min: 8_000_000, max: 10_500_000 },
      { storage: '512GB', min: 9_000_000, max: 12_000_000 },
      { storage: '1TB',   min: 11_000_000, max: 14_000_000 },
    ],
  },
  {
    keywords: ['samsung s22+', 'galaxy s22+', 's22+', 'samsung s22 plus', 's22 plus'],
    name: 'Samsung Galaxy S22+', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 5_500_000, max: 7_000_000 },
      { storage: '256GB', min: 6_500_000, max: 8_500_000 },
    ],
  },
  {
    keywords: ['samsung s22', 'galaxy s22', 's22'],
    name: 'Samsung Galaxy S22', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 4_500_000, max: 5_500_000 },
      { storage: '256GB', min: 5_000_000, max: 6_500_000 },
    ],
  },
  {
    keywords: ['samsung s21 ultra', 'galaxy s21 ultra', 's21 ultra'],
    name: 'Samsung Galaxy S21 Ultra', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 5_500_000, max: 7_500_000 },
      { storage: '512GB', min: 6_500_000, max: 9_000_000 },
    ],
  },
  {
    keywords: ['samsung s21', 'galaxy s21', 's21'],
    name: 'Samsung Galaxy S21', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 3_500_000, max: 4_500_000 },
      { storage: '256GB', min: 4_000_000, max: 5_500_000 },
    ],
  },

  // ─── SAMSUNG Z FOLD / FLIP ──────────────────────────────────────────────────
  {
    keywords: ['samsung z fold5', 'galaxy z fold5', 'z fold5', 'z fold 5'],
    name: 'Samsung Galaxy Z Fold5', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 10_000_000, max: 13_000_000 },
      { storage: '512GB', min: 11_500_000, max: 15_000_000 },
      { storage: '1TB',   min: 13_000_000, max: 17_000_000 },
    ],
  },
  {
    keywords: ['samsung z fold4', 'galaxy z fold4', 'z fold4', 'z fold 4'],
    name: 'Samsung Galaxy Z Fold4', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 7_500_000, max: 10_000_000 },
      { storage: '512GB', min: 8_500_000, max: 11_500_000 },
      { storage: '1TB',   min: 10_000_000, max: 13_000_000 },
    ],
  },
  {
    keywords: ['samsung z flip5', 'galaxy z flip5', 'z flip5', 'z flip 5'],
    name: 'Samsung Galaxy Z Flip5', brand: 'Samsung',
    variants: [
      { storage: '256GB', min: 6_000_000, max: 8_000_000 },
      { storage: '512GB', min: 7_000_000, max: 9_500_000 },
    ],
  },
  {
    keywords: ['samsung z flip4', 'galaxy z flip4', 'z flip4', 'z flip 4'],
    name: 'Samsung Galaxy Z Flip4', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 4_500_000, max: 6_000_000 },
      { storage: '256GB', min: 5_000_000, max: 7_000_000 },
      { storage: '512GB', min: 6_000_000, max: 8_000_000 },
    ],
  },

  // ─── SAMSUNG GALAXY A SERIES ────────────────────────────────────────────────
  {
    keywords: ['samsung a55', 'galaxy a55', 'a55'],
    name: 'Samsung Galaxy A55', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 2_800_000, max: 3_500_000 },
      { storage: '256GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['samsung a54', 'galaxy a54', 'a54'],
    name: 'Samsung Galaxy A54', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 2_500_000, max: 3_000_000 },
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
    ],
  },
  {
    keywords: ['samsung a35', 'galaxy a35', 'a35'],
    name: 'Samsung Galaxy A35', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 1_800_000, max: 2_300_000 },
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
    ],
  },
  {
    keywords: ['samsung a34', 'galaxy a34', 'a34'],
    name: 'Samsung Galaxy A34', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 2_000_000, max: 2_600_000 },
      { storage: '256GB', min: 2_300_000, max: 3_000_000 },
    ],
  },
  {
    keywords: ['samsung a25', 'galaxy a25', 'a25'],
    name: 'Samsung Galaxy A25', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 1_500_000, max: 2_000_000 },
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['samsung a15', 'galaxy a15', 'a15'],
    name: 'Samsung Galaxy A15', brand: 'Samsung',
    variants: [
      { storage: '128GB', min: 1_000_000, max: 1_400_000 },
      { storage: '256GB', min: 1_300_000, max: 1_700_000 },
    ],
  },

  // ─── XIAOMI / REDMI / POCO ──────────────────────────────────────────────────
  {
    keywords: ['xiaomi 14 ultra', '14 ultra'],
    name: 'Xiaomi 14 Ultra', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 8_000_000, max: 10_500_000 },
      { storage: '512GB', min: 9_000_000, max: 12_000_000 },
    ],
  },
  {
    keywords: ['xiaomi 14', 'mi 14'],
    name: 'Xiaomi 14', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 6_500_000, max: 8_000_000 },
      { storage: '512GB', min: 7_500_000, max: 9_500_000 },
    ],
  },
  {
    keywords: ['xiaomi 13', 'mi 13'],
    name: 'Xiaomi 13', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 4_500_000, max: 5_500_000 },
      { storage: '512GB', min: 5_000_000, max: 6_500_000 },
    ],
  },
  {
    keywords: ['redmi note 13 pro+', 'note 13 pro plus', 'redmi note 13 pro plus'],
    name: 'Redmi Note 13 Pro+', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
      { storage: '512GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['redmi note 13 pro', 'note 13 pro'],
    name: 'Redmi Note 13 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 2_200_000, max: 2_800_000 },
      { storage: '256GB', min: 2_500_000, max: 3_200_000 },
    ],
  },
  {
    keywords: ['redmi note 13', 'note 13'],
    name: 'Redmi Note 13', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_500_000, max: 2_000_000 },
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['redmi note 12 pro+', 'note 12 pro plus'],
    name: 'Redmi Note 12 Pro+', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_600_000 },
    ],
  },
  {
    keywords: ['redmi note 12 pro', 'note 12 pro'],
    name: 'Redmi Note 12 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_600_000, max: 2_100_000 },
      { storage: '256GB', min: 1_900_000, max: 2_500_000 },
    ],
  },
  {
    keywords: ['redmi note 12', 'note 12'],
    name: 'Redmi Note 12', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_200_000, max: 1_600_000 },
      { storage: '256GB', min: 1_500_000, max: 2_000_000 },
    ],
  },
  {
    keywords: ['poco x6 pro', 'x6 pro'],
    name: 'POCO X6 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
      { storage: '512GB', min: 3_300_000, max: 4_200_000 },
    ],
  },
  {
    keywords: ['poco x6', 'x6'],
    name: 'POCO X6', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
      { storage: '512GB', min: 2_600_000, max: 3_200_000 },
    ],
  },
  {
    keywords: ['poco x5 pro', 'x5 pro'],
    name: 'POCO X5 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_700_000 },
    ],
  },
  {
    keywords: ['poco f5 pro', 'f5 pro'],
    name: 'POCO F5 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 3_200_000, max: 4_000_000 },
      { storage: '512GB', min: 3_800_000, max: 4_800_000 },
    ],
  },
  {
    keywords: ['poco f5', 'f5'],
    name: 'POCO F5', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 2_600_000, max: 3_200_000 },
      { storage: '512GB', min: 3_000_000, max: 3_800_000 },
    ],
  },

  // ─── OPPO ───────────────────────────────────────────────────────────────────
  {
    keywords: ['oppo find x7 ultra', 'find x7 ultra'],
    name: 'OPPO Find X7 Ultra', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 7_000_000, max: 9_000_000 },
      { storage: '512GB', min: 8_000_000, max: 10_500_000 },
    ],
  },
  {
    keywords: ['oppo reno 12 pro', 'reno 12 pro'],
    name: 'OPPO Reno 12 Pro', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 4_000_000, max: 5_000_000 },
      { storage: '512GB', min: 4_500_000, max: 5_800_000 },
    ],
  },
  {
    keywords: ['oppo reno 12', 'reno 12'],
    name: 'OPPO Reno 12', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['oppo reno 11 pro', 'reno 11 pro'],
    name: 'OPPO Reno 11 Pro', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 3_500_000, max: 4_500_000 },
      { storage: '512GB', min: 4_000_000, max: 5_000_000 },
    ],
  },
  {
    keywords: ['oppo reno 11', 'reno 11'],
    name: 'OPPO Reno 11', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
    ],
  },
  {
    keywords: ['oppo reno 10 pro+', 'reno 10 pro plus'],
    name: 'OPPO Reno 10 Pro+', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 3_500_000, max: 4_500_000 },
    ],
  },
  {
    keywords: ['oppo reno 10 pro', 'reno 10 pro'],
    name: 'OPPO Reno 10 Pro', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
    ],
  },
  {
    keywords: ['oppo reno 10', 'reno 10'],
    name: 'OPPO Reno 10', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
    ],
  },
  {
    keywords: ['oppo reno 8 pro', 'reno 8 pro'],
    name: 'OPPO Reno 8 Pro', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_700_000 },
    ],
  },
  {
    keywords: ['oppo reno 8', 'reno 8'],
    name: 'OPPO Reno 8', brand: 'OPPO',
    variants: [
      { storage: '128GB', min: 1_600_000, max: 2_100_000 },
      { storage: '256GB', min: 1_900_000, max: 2_500_000 },
    ],
  },
  {
    keywords: ['oppo a98', 'a98'],
    name: 'OPPO A98', brand: 'OPPO',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_600_000 },
    ],
  },

  // ─── VIVO ───────────────────────────────────────────────────────────────────
  {
    keywords: ['vivo x100 pro', 'x100 pro'],
    name: 'Vivo X100 Pro', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 7_000_000, max: 9_000_000 },
      { storage: '512GB', min: 8_000_000, max: 10_500_000 },
    ],
  },
  {
    keywords: ['vivo x100', 'x100'],
    name: 'Vivo X100', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 5_500_000, max: 7_000_000 },
      { storage: '512GB', min: 6_500_000, max: 8_500_000 },
    ],
  },
  {
    keywords: ['vivo v30 pro', 'v30 pro'],
    name: 'Vivo V30 Pro', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 3_200_000, max: 4_000_000 },
      { storage: '512GB', min: 3_800_000, max: 4_800_000 },
    ],
  },
  {
    keywords: ['vivo v30', 'v30'],
    name: 'Vivo V30', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
    ],
  },
  {
    keywords: ['vivo v29 pro', 'v29 pro'],
    name: 'Vivo V29 Pro', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
      { storage: '512GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['vivo v29', 'v29'],
    name: 'Vivo V29', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
    ],
  },
  {
    keywords: ['vivo v27 pro', 'v27 pro'],
    name: 'Vivo V27 Pro', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_600_000 },
    ],
  },
  {
    keywords: ['vivo v27', 'v27'],
    name: 'Vivo V27', brand: 'Vivo',
    variants: [
      { storage: '256GB', min: 1_700_000, max: 2_200_000 },
    ],
  },

  // ─── REALME ─────────────────────────────────────────────────────────────────
  {
    keywords: ['realme gt 6', 'gt 6'],
    name: 'Realme GT 6', brand: 'Realme',
    variants: [
      { storage: '256GB', min: 3_500_000, max: 4_500_000 },
      { storage: '512GB', min: 4_200_000, max: 5_200_000 },
    ],
  },
  {
    keywords: ['realme 12 pro+', 'realme 12 pro plus', '12 pro+'],
    name: 'Realme 12 Pro+', brand: 'Realme',
    variants: [
      { storage: '256GB', min: 2_800_000, max: 3_500_000 },
      { storage: '512GB', min: 3_200_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['realme 12 pro', '12 pro'],
    name: 'Realme 12 Pro', brand: 'Realme',
    variants: [
      { storage: '256GB', min: 2_300_000, max: 2_900_000 },
    ],
  },
  {
    keywords: ['realme 11 pro+', 'realme 11 pro plus', '11 pro+'],
    name: 'Realme 11 Pro+', brand: 'Realme',
    variants: [
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
      { storage: '512GB', min: 2_600_000, max: 3_200_000 },
    ],
  },
  {
    keywords: ['realme 11 pro', '11 pro'],
    name: 'Realme 11 Pro', brand: 'Realme',
    variants: [
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['realme c55', 'c55'],
    name: 'Realme C55', brand: 'Realme',
    variants: [
      { storage: '128GB', min: 1_100_000, max: 1_500_000 },
      { storage: '256GB', min: 1_400_000, max: 1_800_000 },
    ],
  },
  {
    keywords: ['realme c65', 'c65'],
    name: 'Realme C65', brand: 'Realme',
    variants: [
      { storage: '128GB', min: 1_000_000, max: 1_400_000 },
      { storage: '256GB', min: 1_200_000, max: 1_600_000 },
    ],
  },
];

// Brands yang dikenal untuk brand-level fallback
export const KNOWN_BRANDS = ['apple', 'iphone', 'samsung', 'galaxy', 'xiaomi', 'redmi', 'poco', 'oppo', 'reno', 'vivo', 'realme', 'huawei', 'honor'];

/**
 * Token-based matching yang lebih akurat.
 * Menghindari false positive seperti "iphone 1" → "iPhone 15 Pro Max"
 */
export function scoreMatch(query: string, entry: TradeInEntry): number {
  const q = query.toLowerCase().trim();
  const qTokens = q.split(/[\s\-]+/).filter(t => t.length >= 2);
  if (qTokens.length === 0) return 0;

  let bestScore = 0;
  for (const kw of entry.keywords) {
    const kwTokens = kw.split(/[\s\-+]+/);
    // Every query token must exactly match or be a prefix of a keyword token
    const matched = qTokens.filter(qt =>
      kwTokens.some(kt => kt === qt || (kt.startsWith(qt) && qt.length >= 3))
    );
    // Require at least 60% of query tokens to match
    const ratio = matched.length / qTokens.length;
    if (ratio >= 0.6) {
      // Bonus score for exact full match
      const score = ratio + (kw === q ? 1 : 0) + matched.length * 0.1;
      if (score > bestScore) bestScore = score;
    }
  }
  return bestScore;
}

/**
 * Auto-detect storage dari query (misal "iphone 15 256" atau "iphone 15 256gb")
 */
export function detectStorageFromQuery(query: string): string | null {
  const match = query.match(/\b(64|128|256|512|1tb|1024)\s*gb?\b/i);
  if (!match) return null;
  const val = match[1].toLowerCase();
  if (val === '1tb' || val === '1024') return '1TB';
  return `${match[1]}GB`;
}
