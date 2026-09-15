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
    keywords: ['poco f6 pro', 'f6 pro', 'poco f6 pro 5g'],
    name: 'POCO F6 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 4_500_000, max: 5_500_000 },
      { storage: '512GB', min: 5_200_000, max: 6_200_000 },
      { storage: '1TB',   min: 6_000_000, max: 7_200_000 },
    ],
  },
  {
    keywords: ['poco f6', 'f6', 'poco f6 5g'],
    name: 'POCO F6', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 3_800_000, max: 4_600_000 },
      { storage: '512GB', min: 4_300_000, max: 5_200_000 },
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
  {
    keywords: ['poco f4 gt', 'f4 gt'],
    name: 'POCO F4 GT', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 2_800_000, max: 3_500_000 },
      { storage: '256GB', min: 3_300_000, max: 4_000_000 },
    ],
  },
  {
    keywords: ['poco f4', 'f4'],
    name: 'POCO F4', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 2_100_000, max: 2_700_000 },
      { storage: '256GB', min: 2_400_000, max: 3_100_000 },
    ],
  },
  {
    keywords: ['poco x5', 'x5', 'poco x5 5g'],
    name: 'POCO X5 5G', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_500_000, max: 2_000_000 },
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['poco m6 pro', 'm6 pro'],
    name: 'POCO M6 Pro', brand: 'Xiaomi',
    variants: [
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
      { storage: '512GB', min: 2_100_000, max: 2_700_000 },
    ],
  },
  {
    keywords: ['poco m6', 'm6'],
    name: 'POCO M6', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_300_000, max: 1_700_000 },
      { storage: '256GB', min: 1_500_000, max: 1_900_000 },
    ],
  },
  {
    keywords: ['poco m5s', 'm5s'],
    name: 'POCO M5s', brand: 'Xiaomi',
    variants: [
      { storage: '64GB',  min: 1_000_000, max: 1_300_000 },
      { storage: '128GB', min: 1_200_000, max: 1_500_000 },
    ],
  },
  {
    keywords: ['poco m5', 'm5'],
    name: 'POCO M5', brand: 'Xiaomi',
    variants: [
      { storage: '64GB',  min: 900_000, max: 1_200_000 },
      { storage: '128GB', min: 1_100_000, max: 1_400_000 },
    ],
  },
  {
    keywords: ['poco c75', 'c75'],
    name: 'POCO C75', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 1_000_000, max: 1_300_000 },
      { storage: '256GB', min: 1_200_000, max: 1_500_000 },
    ],
  },
  {
    keywords: ['poco c65', 'c65'],
    name: 'POCO C65', brand: 'Xiaomi',
    variants: [
      { storage: '128GB', min: 900_000, max: 1_200_000 },
      { storage: '256GB', min: 1_100_000, max: 1_400_000 },
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

  // ─── INFINIX ─────────────────────────────────────────────────────────────
  // ── HOT 50 SERIES (GEN 50 TERBARU) ──
  {
    keywords: ['infinix hot 50 pro+', 'hot 50 pro+', 'hot 50 pro plus', 'infinix hot 50 pro plus', 'hot 50+'],
    name: 'Infinix Hot 50 Pro+', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_000_000, max: 2_500_000 },
    ],
  },
  {
    keywords: ['infinix hot 50 pro', 'hot 50 pro'],
    name: 'Infinix Hot 50 Pro', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_600_000, max: 2_000_000 },
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['infinix hot 50 5g', 'hot 50 5g', 'infinix hot 50'],
    name: 'Infinix Hot 50 5G', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_500_000, max: 1_900_000 },
      { storage: '256GB', min: 1_700_000, max: 2_100_000 },
    ],
  },
  {
    keywords: ['infinix hot 50', 'hot 50', 'hot 50 4g'],
    name: 'Infinix Hot 50', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_300_000, max: 1_700_000 },
      { storage: '256GB', min: 1_500_000, max: 1_900_000 },
    ],
  },
  {
    keywords: ['infinix hot 50i', 'hot 50i'],
    name: 'Infinix Hot 50i', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_000_000, max: 1_350_000 },
      { storage: '256GB', min: 1_200_000, max: 1_550_000 },
    ],
  },

  // ── NOTE 50 & 40 SERIES ──
  {
    keywords: ['infinix note 50 pro', 'note 50 pro', 'infinix note 50 pro 5g', 'note 50'],
    name: 'Infinix Note 50 Pro', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_600_000, max: 3_300_000 },
      { storage: '512GB', min: 3_000_000, max: 3_800_000 },
    ],
  },
  {
    keywords: ['infinix note 50', 'note 50'],
    name: 'Infinix Note 50', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_100_000, max: 2_700_000 },
    ],
  },
  {
    keywords: ['infinix note 40 pro+', 'note 40 pro+', 'note 40 pro plus', 'infinix note 40 pro plus', 'infinix note 40 pro+ 5g'],
    name: 'Infinix Note 40 Pro+ 5G', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_500_000, max: 3_200_000 },
    ],
  },
  {
    keywords: ['infinix note 40 pro', 'note 40 pro', 'infinix note 40 pro 5g'],
    name: 'Infinix Note 40 Pro', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_100_000, max: 2_700_000 },
      { storage: '512GB', min: 2_500_000, max: 3_100_000 },
    ],
  },
  {
    keywords: ['infinix note 40s', 'note 40s'],
    name: 'Infinix Note 40s', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 1_800_000, max: 2_300_000 },
    ],
  },
  {
    keywords: ['infinix note 40', 'note 40'],
    name: 'Infinix Note 40', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 1_600_000, max: 2_100_000 },
    ],
  },
  {
    keywords: ['infinix note 30 pro', 'note 30 pro'],
    name: 'Infinix Note 30 Pro', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 1_600_000, max: 2_100_000 },
    ],
  },
  {
    keywords: ['infinix note 30', 'note 30'],
    name: 'Infinix Note 30', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_200_000, max: 1_600_000 },
      { storage: '256GB', min: 1_400_000, max: 1_800_000 },
    ],
  },

  // ── ZERO & GT SERIES ──
  {
    keywords: ['infinix zero 40 5g', 'zero 40 5g', 'infinix zero 40', 'zero 40'],
    name: 'Infinix Zero 40 5G', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 3_300_000, max: 4_200_000 },
      { storage: '512GB', min: 3_800_000, max: 4_800_000 },
    ],
  },
  {
    keywords: ['infinix zero 40', 'zero 40 4g', 'infinix zero 40 4g'],
    name: 'Infinix Zero 40', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_700_000, max: 3_500_000 },
    ],
  },
  {
    keywords: ['infinix zero 30 5g', 'zero 30 5g', 'infinix zero 30', 'zero 30'],
    name: 'Infinix Zero 30', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_200_000, max: 2_800_000 },
    ],
  },
  {
    keywords: ['infinix gt 20 pro', 'gt 20 pro', 'infinix gt 20 pro 5g'],
    name: 'Infinix GT 20 Pro', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 2_600_000, max: 3_300_000 },
    ],
  },
  {
    keywords: ['infinix gt 10 pro', 'gt 10 pro'],
    name: 'Infinix GT 10 Pro', brand: 'Infinix',
    variants: [
      { storage: '256GB', min: 1_900_000, max: 2_500_000 },
    ],
  },

  // ── HOT 40 & 30 & 20 SERIES ──
  {
    keywords: ['infinix hot 40 pro', 'hot 40 pro'],
    name: 'Infinix Hot 40 Pro', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 1_100_000, max: 1_500_000 },
      { storage: '256GB', min: 1_300_000, max: 1_700_000 },
    ],
  },
  {
    keywords: ['infinix hot 40i', 'hot 40i'],
    name: 'Infinix Hot 40i', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 900_000, max: 1_200_000 },
      { storage: '256GB', min: 1_100_000, max: 1_400_000 },
    ],
  },
  {
    keywords: ['infinix hot 30', 'hot 30'],
    name: 'Infinix Hot 30', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 800_000, max: 1_100_000 },
      { storage: '256GB', min: 1_000_000, max: 1_300_000 },
    ],
  },
  {
    keywords: ['infinix hot 30i', 'hot 30i'],
    name: 'Infinix Hot 30i', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 700_000, max: 1_000_000 },
    ],
  },
  {
    keywords: ['infinix hot 30 play', 'hot 30 play'],
    name: 'Infinix Hot 30 Play', brand: 'Infinix',
    variants: [
      { storage: '64GB',  min: 650_000, max: 900_000 },
      { storage: '128GB', min: 750_000, max: 1_050_000 },
    ],
  },
  {
    keywords: ['infinix hot 20s', 'hot 20s'],
    name: 'Infinix Hot 20s', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 700_000, max: 1_000_000 },
    ],
  },
  {
    keywords: ['infinix hot 20 5g', 'hot 20 5g'],
    name: 'Infinix Hot 20 5G', brand: 'Infinix',
    variants: [
      { storage: '128GB', min: 800_000, max: 1_100_000 },
    ],
  },

  // ── SMART SERIES ──
  {
    keywords: ['infinix smart 9', 'smart 9'],
    name: 'Infinix Smart 9', brand: 'Infinix',
    variants: [
      { storage: '64GB',  min: 700_000, max: 950_000 },
      { storage: '128GB', min: 850_000, max: 1_150_000 },
    ],
  },
  {
    keywords: ['infinix smart 8', 'smart 8'],
    name: 'Infinix Smart 8', brand: 'Infinix',
    variants: [
      { storage: '64GB',  min: 600_000, max: 850_000 },
      { storage: '128GB', min: 750_000, max: 1_000_000 },
    ],
  },
];

// Brands yang dikenal untuk brand-level fallback
export const KNOWN_BRANDS = ['apple', 'iphone', 'samsung', 'galaxy', 'xiaomi', 'redmi', 'poco', 'oppo', 'reno', 'vivo', 'realme', 'infinix', 'huawei', 'honor'];

/**
 * Token-based matching yang cerdas & adaptif untuk HP Trade-In database.
 * Mendukung:
 * - Pencarian nama lengkap: "Samsung Galaxy S24 Ultra", "iPhone 15 Pro Max", "Infinix Note 40 Pro"
 * - Pencarian parsial/prefix: "samsung ga", "ip 15", "infinix note", "infinix"
 * - Pencarian brand umum: "galaxy", "samsung", "infinix", "iphone"
 * - Toleransi terhadap token noise: "5g", "4g", "hp", "resmi", kapasitas "256gb"
 */
export function scoreMatch(query: string, entry: TradeInEntry): number {
  if (!query || query.trim().length < 2) return 0;

  // 1. Bersihkan noise words dan deteksi storage
  let cleaned = query.toLowerCase().trim();
  // Hilangkan noise: 5g, 4g, lte, hp, bekas, second, dll
  cleaned = cleaned.replace(/\b(5g|4g|lte|hp|handphone|bekas|second|resmi|sein|garansi|series|seri)\b/gi, ' ');
  // Hilangkan storage dari query agar tidak menurunkan skor pencarian model
  cleaned = cleaned.replace(/\b(64|128|256|512|1tb|1024)\s*gb?\b/gi, ' ');
  cleaned = cleaned.replace(/[^\w\s+]/g, ' ').replace(/\s+/g, ' ').trim();

  if (cleaned.length < 2) {
    cleaned = query.toLowerCase().trim();
  }

  const qTokens = cleaned.split(/[\s\-]+/).filter(t => t.length >= 2 || /^\d+$/.test(t));
  if (qTokens.length === 0) return 0;

  const entryNameLower = entry.name.toLowerCase();
  const entryBrandLower = entry.brand.toLowerCase();

  // 2. Direct Exact Full Matches
  if (entryNameLower === cleaned) return 100;
  if (entryNameLower.startsWith(cleaned)) return 80 + (cleaned.length / entryNameLower.length) * 10;
  if (entryNameLower.includes(cleaned)) return 70 + (cleaned.length / entryNameLower.length) * 10;
  if (cleaned.includes(entryNameLower)) return 75;

  // 3. Gabungkan seluruh pool keyword & token yang dimiliki entry
  const allKeywordPhrases = [
    entryNameLower,
    `${entryBrandLower} ${entryNameLower}`,
    ...entry.keywords.map(k => k.toLowerCase())
  ];

  const entryWords = new Set<string>();
  for (const phrase of allKeywordPhrases) {
    const words = phrase.split(/[\s\-+]+/).filter(Boolean);
    for (const w of words) entryWords.add(w);
  }

  // 4. Token-by-token matching
  let matchedCount = 0;
  let scoreAccumulator = 0;

  for (const qt of qTokens) {
    let tokenMatched = false;
    let tokenScore = 0;

    for (const ew of entryWords) {
      if (ew === qt) {
        tokenMatched = true;
        tokenScore = Math.max(tokenScore, 1.0);
      } else if (ew.startsWith(qt) && qt.length >= 2) {
        tokenMatched = true;
        tokenScore = Math.max(tokenScore, 0.85);
      } else if (qt.startsWith(ew) && ew.length >= 3) {
        tokenMatched = true;
        tokenScore = Math.max(tokenScore, 0.8);
      }
    }

    if (tokenMatched) {
      matchedCount++;
      scoreAccumulator += tokenScore;
    }
  }

  const matchRatio = matchedCount / qTokens.length;

  if (matchedCount === 0 || matchRatio < 0.4) {
    return 0;
  }

  let finalScore = (scoreAccumulator / qTokens.length) * 40 + (matchedCount * 5);

  // Bonus besar jika seluruh token yang diketik cocok
  if (matchRatio === 1) {
    finalScore += 30;
  }

  // Bonus jika nomor model numerik cocok persis
  for (const qt of qTokens) {
    if (/\d+/.test(qt)) {
      for (const ew of entryWords) {
        if (ew.includes(qt)) {
          finalScore += 15;
          break;
        }
      }
    }
  }

  return finalScore;
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
