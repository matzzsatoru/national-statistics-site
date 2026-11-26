// Angka resmi Indonesia, dirangkum dari rilis Badan Pusat Statistik (BPS),
// Kementerian Kesehatan (SSGI) dan publikasi "Statistik Indonesia".
// Setiap angka di situs ini memakai tahun dan sumber yang tercantum di halaman
// Tentang. Tidak ada angka yang ditebak: yang belum terverifikasi tidak dipakai.

export const SOURCES = {
  bps: 'Badan Pusat Statistik (BPS)',
  bpsBrs: 'BPS, Berita Resmi Statistik',
  bpsStat: 'BPS, Statistik Indonesia 2025',
  ssgi: 'Kemenkes, Survei Status Gizi Indonesia (SSGI)',
  supas: 'BPS, Survei Penduduk Antar Sensus (SUPAS) 2025',
};

// Penduduk pertengahan tahun, juta jiwa (BPS, Proyeksi Penduduk).
export const POPULATION_BY_YEAR = [
  { year: 2015, pop: 255.59 },
  { year: 2016, pop: 258.50 },
  { year: 2017, pop: 261.36 },
  { year: 2018, pop: 264.16 },
  { year: 2019, pop: 266.91 },
  { year: 2020, pop: 270.20 },
  { year: 2021, pop: 272.68 },
  { year: 2022, pop: 275.77 },
  { year: 2023, pop: 278.70 },
  { year: 2024, pop: 281.60 },
];

// Struktur umur, SUPAS 2025 (BPS): persen dari total penduduk.
export const AGE_STRUCTURE = [
  { group: '0–14 tahun (anak)', pct: 23.44, note: '66,7 juta jiwa' },
  { group: '15–64 tahun (produktif)', pct: 68.94, note: '196,3 juta jiwa' },
  { group: '65 tahun ke atas (lansia)', pct: 7.62, note: '21,7 juta jiwa' },
];

// Generasi menurut SUPAS 2025 (BPS), persen dari total penduduk.
export const GENERATIONS = [
  { gen: 'Post Gen Z (lahir 2013 ke atas)', pct: 19.65 },
  { gen: 'Gen Z (1997–2012)', pct: 24.93 },
  { gen: 'Milenial (1981–1996)', pct: 24.34 },
  { gen: 'Gen X (1965–1980)', pct: 19.70 },
  { gen: 'Baby Boomer (1945–1964)', pct: 10.31 },
  { gen: 'Pre-Boomer (sebelum 1945)', pct: 1.07 },
];

// PDB atas dasar harga berlaku, triliun rupiah (BPS).
export const GDP_NOMINAL = [
  { year: 2019, value: 15833.9 },
  { year: 2020, value: 15434.2 },
  { year: 2021, value: 16976.7 },
  { year: 2022, value: 19588.4 },
  { year: 2023, value: 20892.4 },
  { year: 2024, value: 22139.0 },
];

// Pertumbuhan ekonomi tahunan, persen (BPS).
export const GDP_GROWTH = [
  { year: 2015, value: 4.88 },
  { year: 2016, value: 5.03 },
  { year: 2017, value: 5.07 },
  { year: 2018, value: 5.17 },
  { year: 2019, value: 5.02 },
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.70 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

// Pangsa PDB menurut lapangan usaha, 2024, persen (BPS, BRS 5 Feb 2025).
export const GDP_SECTORS = [
  { sector: 'Industri pengolahan', pct: 18.98 },
  { sector: 'Perdagangan besar & eceran', pct: 13.07 },
  { sector: 'Pertanian, kehutanan & perikanan', pct: 12.61 },
  { sector: 'Konstruksi', pct: 10.09 },
  { sector: 'Pertambangan & penggalian', pct: 9.15 },
  { sector: 'Lapangan usaha lainnya', pct: 36.10 },
];

// Inflasi Desember year-on-year, persen (BPS).
export const INFLATION = [
  { year: 2019, value: 2.72 },
  { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

// Tingkat kemiskinan bulan September, persen (BPS).
export const POVERTY = [
  { year: 2019, value: 9.22 },
  { year: 2020, value: 10.19 },
  { year: 2021, value: 9.71 },
  { year: 2022, value: 9.57 },
  { year: 2023, value: 9.36 },
  { year: 2024, value: 8.57 },
];

// Tingkat Pengangguran Terbuka bulan Agustus, persen (BPS, Sakernas).
export const UNEMPLOYMENT = [
  { year: 2019, value: 5.23 },
  { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 },
  { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 },
  { year: 2024, value: 4.91 },
];

// Indeks Pembangunan Manusia (BPS).
export const HDI = [
  { year: 2021, value: 73.16 },
  { year: 2022, value: 73.77 },
  { year: 2023, value: 74.39 },
  { year: 2024, value: 75.02 },
];

// Angka melek aksara penduduk 15 tahun ke atas, persen (BPS).
export const LITERACY = [
  { year: 2021, value: 96.04 },
  { year: 2022, value: 96.35 },
  { year: 2023, value: 96.53 },
  { year: 2024, value: 96.67 },
];

// Prevalensi stunting balita, persen (SSGI, Kemenkes).
export const STUNTING = [
  { year: 2019, value: 27.7 },
  { year: 2021, value: 24.4 },
  { year: 2022, value: 21.6 },
  { year: 2023, value: 21.5 },
  { year: 2024, value: 19.8 },
];

// Penduduk menurut provinsi, pertengahan 2024, ribu jiwa
// (BPS, Proyeksi Penduduk Interim 2020–2023; total nasional 281.603,8 ribu).
export const PROVINCES = [
  { name: 'Jawa Barat', region: 'Jawa', pop: 50345.2 },
  { name: 'Jawa Timur', region: 'Jawa', pop: 41814.5 },
  { name: 'Jawa Tengah', region: 'Jawa', pop: 37892.3 },
  { name: 'Sumatera Utara', region: 'Sumatera', pop: 15588.5 },
  { name: 'Banten', region: 'Jawa', pop: 12431.4 },
  { name: 'DKI Jakarta', region: 'Jawa', pop: 10684.9 },
  { name: 'Sulawesi Selatan', region: 'Sulawesi', pop: 9463.4 },
  { name: 'Lampung', region: 'Sumatera', pop: 9419.6 },
  { name: 'Sumatera Selatan', region: 'Sumatera', pop: 8837.3 },
  { name: 'Riau', region: 'Sumatera', pop: 6728.1 },
  { name: 'Sumatera Barat', region: 'Sumatera', pop: 5836.2 },
  { name: 'Kalimantan Barat', region: 'Kalimantan', pop: 5695.5 },
  { name: 'Nusa Tenggara Timur', region: 'Bali & Nusa Tenggara', pop: 5656.0 },
  { name: 'Nusa Tenggara Barat', region: 'Bali & Nusa Tenggara', pop: 5646.0 },
  { name: 'Aceh', region: 'Sumatera', pop: 5554.8 },
  { name: 'Bali', region: 'Bali & Nusa Tenggara', pop: 4433.3 },
  { name: 'Kalimantan Selatan', region: 'Kalimantan', pop: 4273.4 },
  { name: 'Kalimantan Timur', region: 'Kalimantan', pop: 4045.9 },
  { name: 'DI Yogyakarta', region: 'Jawa', pop: 3759.5 },
  { name: 'Jambi', region: 'Sumatera', pop: 3724.3 },
  { name: 'Sulawesi Tengah', region: 'Sulawesi', pop: 3121.8 },
  { name: 'Kalimantan Tengah', region: 'Kalimantan', pop: 2809.7 },
  { name: 'Sulawesi Tenggara', region: 'Sulawesi', pop: 2793.1 },
  { name: 'Sulawesi Utara', region: 'Sulawesi', pop: 2701.8 },
  { name: 'Kepulauan Riau', region: 'Sumatera', pop: 2183.3 },
  { name: 'Bengkulu', region: 'Sumatera', pop: 2112.2 },
  { name: 'Maluku', region: 'Maluku & Papua', pop: 1945.6 },
  { name: 'Kepulauan Bangka Belitung', region: 'Sumatera', pop: 1531.5 },
  { name: 'Sulawesi Barat', region: 'Sulawesi', pop: 1503.2 },
  { name: 'Papua Tengah', region: 'Maluku & Papua', pop: 1472.9 },
  { name: 'Papua Pegunungan', region: 'Maluku & Papua', pop: 1467.0 },
  { name: 'Maluku Utara', region: 'Maluku & Papua', pop: 1355.6 },
  { name: 'Gorontalo', region: 'Sulawesi', pop: 1227.8 },
  { name: 'Papua', region: 'Maluku & Papua', pop: 1060.6 },
  { name: 'Kalimantan Utara', region: 'Kalimantan', pop: 739.8 },
  { name: 'Papua Barat Daya', region: 'Maluku & Papua', pop: 627.1 },
  { name: 'Papua Barat', region: 'Maluku & Papua', pop: 578.7 },
  { name: 'Papua Selatan', region: 'Maluku & Papua', pop: 542.1 },
];

export const NATIONAL_POP_2024 = 281603.8; // ribu jiwa, BPS

// Angka kunci 2024 untuk kartu ringkasan di beranda.
export const HEADLINE = {
  population: { value: '281,6 jt', label: 'Penduduk (pertengahan 2024)', source: 'BPS' },
  gdp: { value: 'Rp22.139 T', label: 'PDB harga berlaku 2024', source: 'BPS' },
  growth: { value: '5,03%', label: 'Pertumbuhan ekonomi 2024', source: 'BPS' },
  gdpPerCapita: { value: 'Rp78,6 jt', label: 'PDB per kapita 2024', source: 'BPS' },
  poverty: { value: '8,57%', label: 'Kemiskinan, Sep 2024', source: 'BPS' },
  unemployment: { value: '4,91%', label: 'Pengangguran terbuka, Agu 2024', source: 'BPS' },
  inflation: { value: '1,57%', label: 'Inflasi, Des 2024 (y-on-y)', source: 'BPS' },
  hdi: { value: '75,02', label: 'Indeks Pembangunan Manusia 2024', source: 'BPS' },
};

// Pembaruan setahun kemudian, dari rilis BPS 2025/2026.
export const UPDATE_2025 = [
  { label: 'Penduduk 2025', value: '284,44 juta jiwa' },
  { label: 'PDB 2025', value: 'Rp23.821,1 triliun (+5,11%)' },
  { label: 'IPM 2025', value: '75,90' },
  { label: 'Kemiskinan Sep 2025', value: '8,25%' },
];

// Format angka gaya Indonesia: 1.234,56
export function fmtId(n, decimals = 0) {
  return n.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Ribu jiwa -> "50,35 jt jiwa"
export function fmtPopThousands(thousands) {
  return fmtId(thousands / 1000, 2) + ' jt';
}
