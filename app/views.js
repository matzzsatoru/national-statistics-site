// Templat halaman: setiap rute mengembalikan string HTML untuk <main>.
// Angka berasal dari data.js; grafik dari charts.js. Semua data bersifat statis.

import {
  AGE_STRUCTURE,
  GENERATIONS,
  GDP_GROWTH,
  GDP_NOMINAL,
  GDP_SECTORS,
  HDI,
  HEADLINE,
  INFLATION,
  LITERACY,
  POPULATION_BY_YEAR,
  POVERTY,
  PROVINCES,
  STUNTING,
  TILEMAP,
  UNEMPLOYMENT,
  UPDATE_2025,
  fmtId,
  fmtPopThousands,
  popByName,
} from './data.js';
import { barChart, donutChart, hbarChart, lineChart, sparkline, stackedBar, tileLegend, tileMap } from './charts.js';

const SRC = (text) => `<p class="src">Sumber: ${text}</p>`;

function kpiCard(h) {
  const delta = h.delta
    ? `<div class="kpi-delta ${h.deltaDir || ''}">${h.delta}</div>`
    : '';
  const spark = h.spark ? `<div class="kpi-spark">${sparkline(h.spark, { color: h.sparkColor || '#14684f' })}</div>` : '';
  return `<div class="kpi${h.accent ? ' accent-' + h.accent : ''}"><div class="kpi-value">${h.value}</div><div class="kpi-label">${h.label}</div>${delta}${spark}<div class="kpi-src">${h.source}</div></div>`;
}

// Peta petak 38 provinsi + baris info provinsi yang diklik.
// tiles: [{name, col, row, pop}]; dark = di atas latar gelap.
export function tileMapBlock(dark = false) {
  const tiles = TILEMAP.map((t) => ({ ...t, pop: popByName(t.name) }));
  return `<div class="map-block">
    <div class="map-wrap">${tileMap(tiles, { dark, cell: 40 })}</div>
    ${tileLegend(dark)}
    <p class="map-readout" id="map-readout">Klik salah satu petak untuk melihat provinsinya — warna menunjukkan jumlah penduduk: terakota berarti di atas 30 juta jiwa.</p>
  </div>`;
}

function sectionHead(title, blurb) {
  return `<div class="sec-head"><h2>${title}</h2><p>${blurb}</p></div>`;
}

function chartCard(id, title, blurb, chartHtml, source, controls = '') {
  return `<section class="card chart-card" aria-label="${title}">
    <div class="card-head"><h3>${title}</h3>${controls}</div>
    <p class="card-blurb">${blurb}</p>
    <div id="${id}" class="chart-wrap">${chartHtml}</div>
    ${SRC(source)}
  </section>`;
}

function toggleButtons(chartKey, current) {
  const bar = current === 'bar' ? 'active' : '';
  const line = current === 'line' ? 'active' : '';
  return `<div class="toggle" role="group" aria-label="Jenis grafik">
    <button type="button" data-chart="${chartKey}" data-type="bar" class="${bar}">Batang</button>
    <button type="button" data-chart="${chartKey}" data-type="line" class="${line}">Garis</button>
  </div>`;
}

function rangeButtons(current) {
  const ranges = [
    ['all', '2015–2024'],
    ['early', '2015–2019'],
    ['late', '2020–2024'],
  ];
  return `<div class="toggle" role="group" aria-label="Rentang tahun">
    ${ranges.map(([k, label]) => `<button type="button" data-range="${k}" class="${current === k ? 'active' : ''}">${label}</button>`).join('')}
  </div>`;
}

export function popChartHtml(range, type) {
  let rows = POPULATION_BY_YEAR;
  if (range === 'early') rows = rows.filter((r) => r.year <= 2019);
  if (range === 'late') rows = rows.filter((r) => r.year >= 2020);
  const points = rows.map((r) => ({ label: String(r.year), value: r.pop }));
  const fmt = (v) => fmtId(v, 1);
  return type === 'line'
    ? lineChart(points, { title: 'Jumlah penduduk Indonesia', format: fmt })
    : barChart(points, { title: 'Jumlah penduduk Indonesia', format: fmt, highlightLast: true });
}

export function gdpChartHtml(type) {
  const points = GDP_NOMINAL.map((r) => ({ label: String(r.year), value: r.value }));
  const fmt = (v) => 'Rp' + fmtId(v, 0) + ' T';
  return type === 'line'
    ? lineChart(points, { title: 'PDB Indonesia', format: fmt })
    : barChart(points, { title: 'PDB Indonesia', format: fmt, highlightLast: true });
}

// ---- Beranda ----
export function viewHome(state) {
  // Selisih 2024 vs 2023, dihitung dari deret di data.js (bukan angka baru).
  const perCapita = GDP_NOMINAL.map((g) => {
    const p = POPULATION_BY_YEAR.find((x) => x.year === g.year);
    return g.value / p.pop;
  });
  const homeKpis = [
    { ...HEADLINE.population, delta: '▲ +1,04% dari 2023', deltaDir: 'good', spark: POPULATION_BY_YEAR.map((r) => r.pop), accent: 'teal' },
    { ...HEADLINE.gdp, delta: '▲ +5,98% dari 2023', deltaDir: 'good', spark: GDP_NOMINAL.map((r) => r.value), sparkColor: '#c96f2e', accent: 'amber' },
    { ...HEADLINE.growth, delta: '▼ 0,02 poin dari 2023', deltaDir: 'bad', spark: GDP_GROWTH.map((r) => r.value), sparkColor: '#b4452f', accent: 'green' },
    { ...HEADLINE.gdpPerCapita, delta: '▲ +4,87% dari 2023', deltaDir: 'good', spark: perCapita, sparkColor: '#c96f2e', accent: 'amber' },
    { ...HEADLINE.poverty, delta: '▼ 0,79 poin — terendah sepanjang sejarah BPS', deltaDir: 'good', spark: POVERTY.map((r) => r.value), sparkColor: '#14684f', accent: 'green' },
    { ...HEADLINE.unemployment, delta: '▼ 0,41 poin dari 2023', deltaDir: 'good', spark: UNEMPLOYMENT.map((r) => r.value), accent: 'green' },
    { ...HEADLINE.inflation, delta: '▼ 1,04 poin dari 2023', deltaDir: 'good', spark: INFLATION.map((r) => r.value), sparkColor: '#c96f2e', accent: 'amber' },
    { ...HEADLINE.hdi, delta: '▲ +0,63 poin dari 2023', deltaDir: 'good', spark: HDI.map((r) => r.value), accent: 'teal' },
  ];
  const kpis = homeKpis.map(kpiCard).join('');
  const updates = UPDATE_2025.map((u) => `<li><strong>${u.value}</strong> — ${u.label}</li>`).join('');
  return `
  <section class="hero-dark">
    <div class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Indonesia dalam angka · Edisi 2024 · BPS &amp; Kemenkes</p>
        <h1>281,6 juta jiwa.<br>Satu peta.<br>Semua angkanya.</h1>
        <p class="lede">Penduduk, ekonomi, pekerjaan, pendidikan, dan kesehatan — angka resmi
        dari BPS dan Kemenkes, lengkap dengan tahun dan sumbernya. Tanpa iklan, tanpa
        login, bisa dibuka offline.</p>
        <div class="hero-links">
          <a class="btn amber" href="#/provinsi">Jelajahi 38 provinsi</a>
          <a class="btn" href="#/ekonomi">Lihat ekonomi</a>
          <a class="btn ghost-light" href="#/tentang">Sumber data</a>
        </div>
        <p class="hero-chips">8 halaman · 38 provinsi · 0 iklan · Bisa offline</p>
      </div>
      <div class="hero-map">
        ${tileMapBlock(true)}
      </div>
    </div>
  </section>

  <section class="story-strip" aria-label="Indonesia dalam tiga angka">
    <div class="story"><div class="story-num">56%</div><div class="story-text">penduduk tinggal di Pulau Jawa — Jawa Barat sendiri 50,35 juta jiwa</div></div>
    <div class="story"><div class="story-num">7 dari 10</div><div class="story-text">penduduk berusia produktif (15–64 tahun) — bonus demografi masih berjalan</div></div>
    <div class="story"><div class="story-num">1 dari 5</div><div class="story-text">balita masih mengalami stunting — turun dari 21,5% (2023) ke 19,8% (2024)</div></div>
  </section>

  <section class="kpi-grid" aria-label="Angka kunci 2024">${kpis}</section>

  ${chartCard('pop-chart', 'Penduduk terus bertambah', 'Jumlah penduduk pertengahan tahun, 2015–2024. Dalam sepuluh tahun terakhir penduduk bertambah sekitar 26 juta jiwa.', popChartHtml(state.popRange, state.popType), 'BPS, Proyeksi Penduduk &amp; Sensus Penduduk 2020', `<div class="controls">${rangeButtons(state.popRange)}${toggleButtons('pop', state.popType)}</div>`)}

  <section class="split">
    <div class="card">
      <h3>Sekilas 2024</h3>
      <ul class="fact-list">
        <li><strong>56%</strong> penduduk tinggal di Pulau Jawa — Jawa Barat sendiri 50,35 juta jiwa.</li>
        <li><strong>68,94%</strong> penduduk berusia produktif (15–64 tahun) menurut SUPAS 2025 — bonus demografi masih berjalan.</li>
        <li><strong>24,06 juta</strong> orang hidup di bawah garis kemiskinan Rp595.242 per kapita per bulan.</li>
        <li><strong>152,11 juta</strong> orang angkatan kerja; 7,47 juta di antaranya menganggur.</li>
        <li><strong>19,8%</strong> balita mengalami stunting — turun dari 21,5% pada 2023.</li>
      </ul>
      ${SRC('BPS; Kemenkes (SSGI 2024)')}
    </div>
    <div class="card update">
      <h3>Pembaruan 2025</h3>
      <p>Angka-angka terbaru yang sudah dirilis BPS setelah edisi 2024 ini disusun:</p>
      <ul class="fact-list">${updates}</ul>
      ${SRC('BPS, Berita Resmi Statistik 2025–2026')}
    </div>
  </section>

  <section class="card">
    <h3>Jelajahi berdasarkan topik</h3>
    <div class="topic-grid">
      <a href="#/penduduk"><strong>Penduduk</strong><span>Pertumbuhan, struktur umur &amp; generasi</span></a>
      <a href="#/ekonomi"><strong>Ekonomi</strong><span>PDB, pertumbuhan, sektor &amp; inflasi</span></a>
      <a href="#/ketenagakerjaan"><strong>Ketenagakerjaan</strong><span>Pengangguran, angkatan kerja &amp; upah</span></a>
      <a href="#/pendidikan"><strong>Pendidikan</strong><span>Melek aksara, lama sekolah &amp; IPM</span></a>
      <a href="#/kesehatan"><strong>Kesehatan</strong><span>Harapan hidup &amp; stunting balita</span></a>
      <a href="#/provinsi"><strong>Provinsi</strong><span>Tabel 38 provinsi, bisa dicari &amp; diurutkan</span></a>
    </div>
  </section>`;
}

// ---- Penduduk ----
export function viewPenduduk(state) {
  const ageSegs = [
    { label: '0–14 tahun', pct: AGE_STRUCTURE[0].pct, color: '#2a7f6f' },
    { label: '15–64 tahun', pct: AGE_STRUCTURE[1].pct, color: '#14684f' },
    { label: '65+ tahun', pct: AGE_STRUCTURE[2].pct, color: '#c96f2e' },
  ];
  const ageRows = AGE_STRUCTURE.map((a) => `<li><strong>${fmtId(a.pct, 2)}%</strong> — ${a.group} <span class="muted">(${a.note})</span></li>`).join('');
  const genRows = GENERATIONS.map((g) => `<li><strong>${fmtId(g.pct, 2)}%</strong> — ${g.gen}</li>`).join('');
  const top5 = PROVINCES.slice(0, 5).map((p) => ({ label: p.name, value: p.pop / 1000 }));
  return `
  ${sectionHead('Penduduk', 'Siapa saja 281,6 juta penduduk Indonesia, di mana mereka tinggal, dan bagaimana komposisinya.')}
  <section class="kpi-grid small">
    ${kpiCard({ value: '281,6 jt', label: 'Penduduk pertengahan 2024', source: 'BPS', delta: '▲ +1,04% dari 2023', deltaDir: 'good', spark: POPULATION_BY_YEAR.map((r) => r.pop), accent: 'teal' })}
    ${kpiCard({ value: '+1,04%', label: 'Laju pertumbuhan 2024', source: 'BPS', delta: '▼ 0,02 poin dari 2023', deltaDir: 'bad', spark: POPULATION_BY_YEAR.map((r) => r.pop), accent: 'teal' })}
    ${kpiCard({ value: '149', label: 'Kepadatan (jiwa/km²)', source: 'BPS', spark: POPULATION_BY_YEAR.map((r) => r.pop), accent: 'teal' })}
    ${kpiCard({ value: '45,05', label: 'Rasio ketergantungan (SUPAS 2025)', source: 'BPS', accent: 'teal' })}
  </section>
  ${chartCard('pop-chart', 'Jumlah penduduk 2015–2024', 'Penduduk pertengahan tahun dalam juta jiwa. Pilih rentang tahun atau ubah jenis grafiknya.', popChartHtml(state.popRange, state.popType), 'BPS, Proyeksi Penduduk &amp; Sensus Penduduk 2020', `<div class="controls">${rangeButtons(state.popRange)}${toggleButtons('pop', state.popType)}</div>`)}
  <section class="split">
    <div class="card">
      <h3>Struktur umur (SUPAS 2025)</h3>
      <p class="card-blurb">Indonesia masih menikmati bonus demografi: hampir 7 dari 10 penduduk berusia produktif.</p>
      ${stackedBar(ageSegs, { title: 'Struktur umur penduduk' })}
      <ul class="fact-list">${ageRows}</ul>
      <p class="card-blurb">Rasio ketergantungan 45,05 — setiap 100 orang usia produktif menanggung 45 orang usia nonproduktif. Angka kelahiran total (TFR) 2,13, nyaris di level pengganti.</p>
      ${SRC('BPS, SUPAS 2025')}
    </div>
    <div class="card">
      <h3>Menurut generasi (SUPAS 2025)</h3>
      <p class="card-blurb">Milenial, Gen Z, dan Post Gen Z mencakup 68,92% penduduk — hampir 7 dari 10 orang Indonesia lahir setelah 1980.</p>
      <ul class="fact-list">${genRows}</ul>
      ${SRC('BPS, SUPAS 2025')}
    </div>
  </section>
  <section class="card">
    <h3>Lima provinsi terpadat</h3>
    <p class="card-blurb">Tiga provinsi di Pulau Jawa menampung sekitar 46% penduduk Indonesia.</p>
    ${hbarChart(top5, { title: 'Provinsi terpadat 2024', format: (v) => fmtId(v, 2) + ' jt' })}
    ${SRC('BPS, Proyeksi Penduduk Interim 2020–2023 (pertengahan 2024)')}
    <p><a href="#/provinsi">Lihat tabel lengkap 38 provinsi →</a></p>
  </section>`;
}

// ---- Ekonomi ----
export function viewEkonomi(state) {
  const growth = GDP_GROWTH.map((r) => ({ label: String(r.year), value: r.value }));
  const infl = INFLATION.map((r) => ({ label: String(r.year), value: r.value }));
  const sectors = GDP_SECTORS.map((s) => ({ label: s.sector, value: s.pct }));
  const sectorRows = GDP_SECTORS.map((s) => `<li><strong>${fmtId(s.pct, 2)}%</strong> — ${s.sector}</li>`).join('');
  return `
  ${sectionHead('Ekonomi', 'Seberapa besar ekonomi Indonesia, seberapa cepat tumbuhnya, dan sektor apa yang menopangnya.')}
  <section class="kpi-grid small">
    ${kpiCard({ value: 'Rp22.139 T', label: 'PDB harga berlaku 2024', source: 'BPS', delta: '▲ +5,98% dari 2023', deltaDir: 'good', spark: GDP_NOMINAL.map((r) => r.value), sparkColor: '#c96f2e', accent: 'amber' })}
    ${kpiCard({ value: '5,03%', label: 'Pertumbuhan ekonomi 2024', source: 'BPS', delta: '▼ 0,02 poin dari 2023', deltaDir: 'bad', spark: GDP_GROWTH.map((r) => r.value), sparkColor: '#b4452f', accent: 'green' })}
    ${kpiCard({ value: 'Rp78,6 jt', label: 'PDB per kapita 2024', source: 'BPS', delta: '▲ +4,87% dari 2023', deltaDir: 'good', spark: GDP_NOMINAL.map((g) => g.value / POPULATION_BY_YEAR.find((x) => x.year === g.year).pop), sparkColor: '#c96f2e', accent: 'amber' })}
    ${kpiCard({ value: 'US$4.960', label: 'PDB per kapita 2024 (dolar AS)', source: 'BPS', spark: GDP_NOMINAL.map((g) => g.value / POPULATION_BY_YEAR.find((x) => x.year === g.year).pop), sparkColor: '#c96f2e', accent: 'amber' })}
  </section>
  ${chartCard('gdp-chart', 'PDB 2019–2024', 'Produk Domestik Bruto atas dasar harga berlaku, triliun rupiah. Sempat turun pada 2020 karena pandemi, lalu pulih dan menembus Rp22 ribu triliun pada 2024.', gdpChartHtml(state.gdpType), 'BPS, Berita Resmi Statistik', toggleButtons('gdp', state.gdpType))}
  <section class="split">
    <div class="card chart-card">
      <div class="card-head"><h3>Pertumbuhan ekonomi 2015–2024</h3></div>
      <p class="card-blurb">Setelah kontraksi −2,07% pada 2020, ekonomi tumbuh di atas 5% tiga tahun beruntun.</p>
      ${lineChart(growth, { title: 'Pertumbuhan ekonomi', format: (v) => fmtId(v, 2) + '%', annotations: [{ index: 5, text: 'COVID-19: −2,07%' }] })}
      ${SRC('BPS, Berita Resmi Statistik')}
    </div>
    <div class="card chart-card">
      <div class="card-head"><h3>Inflasi 2019–2024</h3></div>
      <p class="card-blurb">Inflasi Desember (year-on-year). Lonjakan 2022 ke 5,51% lalu kembali ke 1,57% pada 2024.</p>
      ${lineChart(infl, { title: 'Inflasi tahunan', format: (v) => fmtId(v, 2) + '%' })}
      ${SRC('BPS, Berita Resmi Statistik')}
    </div>
  </section>
  <section class="card">
    <h3>Lima sektor terbesar dalam PDB 2024</h3>
    <p class="card-blurb">Industri pengolahan tetap tulang punggung ekonomi dengan pangsa 18,98%. Lima sektor terbesar mencakup 63,90% PDB.</p>
    <div class="donut-wrap">
      ${donutChart(GDP_SECTORS.map((s, i) => ({ label: s.sector, value: s.pct, color: ['#0e4d3a', '#14684f', '#2a7f6f', '#5cb58a', '#f2b25c', '#c96f2e'][i] })), { title: 'Pangsa PDB menurut lapangan usaha', center: '63,90%', centerSub: '5 sektor terbesar' })}
      <ul class="donut-legend">
        ${GDP_SECTORS.map((s, i) => `<li><i style="background:${['#0e4d3a', '#14684f', '#2a7f6f', '#5cb58a', '#f2b25c', '#c96f2e'][i]}"></i><strong>${fmtId(s.pct, 2)}%</strong> — ${s.sector}</li>`).join('')}
      </ul>
    </div>
    ${SRC('BPS, Berita Resmi Statistik 5 Februari 2025')}
  </section>`;
}

// ---- Ketenagakerjaan ----
export function viewKerja() {
  const tpt = UNEMPLOYMENT.map((r) => ({ label: String(r.year), value: r.value }));
  const pov = POVERTY.map((r) => ({ label: String(r.year), value: r.value }));
  return `
  ${sectionHead('Ketenagakerjaan', 'Siapa yang bekerja, siapa yang menganggur, dan berapa upah mereka — Agustus 2024.')}
  <section class="kpi-grid small">
    ${kpiCard({ value: '152,11 jt', label: 'Angkatan kerja, Agu 2024', source: 'BPS' })}
    ${kpiCard({ value: '144,64 jt', label: 'Penduduk bekerja', source: 'BPS' })}
    ${kpiCard({ value: '7,47 jt', label: 'Penganggur', source: 'BPS' })}
    ${kpiCard({ value: '70,63%', label: 'Tingkat partisipasi angkatan kerja', source: 'BPS' })}
  </section>
  <section class="split">
    <div class="card chart-card">
      <div class="card-head"><h3>Pengangguran terbuka 2019–2024</h3></div>
      <p class="card-blurb">Tingkat Pengangguran Terbuka (TPT) bulan Agustus. Tertinggi saat pandemi (7,07% pada 2020), terendah dalam enam tahun terakhir pada 2024.</p>
      ${lineChart(tpt, { title: 'Tingkat pengangguran terbuka', format: (v) => fmtId(v, 2) + '%' })}
      ${SRC('BPS, Sakernas Agustus 2024')}
    </div>
    <div class="card chart-card">
      <div class="card-head"><h3>Kemiskinan 2019–2024</h3></div>
      <p class="card-blurb">Persentase penduduk miskin bulan September. Terendah sepanjang sejarah pencatatan BPS pada September 2024: 8,57%.</p>
      ${lineChart(pov, { title: 'Tingkat kemiskinan', format: (v) => fmtId(v, 2) + '%' })}
      ${SRC('BPS, Berita Resmi Statistik')}
    </div>
  </section>
  <section class="split">
    <div class="card">
      <h3>Di mana orang bekerja</h3>
      <ul class="fact-list">
        <li><strong>28,18%</strong> pekerja berada di pertanian, kehutanan &amp; perikanan — 40,76 juta orang.</li>
        <li><strong>18,89%</strong> pekerja berada di perdagangan besar &amp; eceran.</li>
        <li><strong>57,5%</strong> pekerja berada di sektor informal (Agustus 2024).</li>
        <li><strong>17,32%</strong> pengangguran di kalangan muda usia 15–24 tahun — tertinggi di antara kelompok umur.</li>
      </ul>
      ${SRC('BPS, Sakernas Agustus 2024')}
    </div>
    <div class="card">
      <h3>Upah &amp; garis kemiskinan</h3>
      <ul class="fact-list">
        <li><strong>Rp3,27 juta/bulan</strong> — rata-rata upah buruh, Agustus 2024.</li>
        <li><strong>Rp595.242/kapita/bulan</strong> — garis kemiskinan, September 2024.</li>
        <li><strong>24,06 juta</strong> penduduk miskin, September 2024.</li>
        <li><strong>6,66%</strong> kemiskinan perkotaan vs <strong>11,34%</strong> perdesaan.</li>
      </ul>
      ${SRC('BPS, Berita Resmi Statistik')}
    </div>
  </section>`;
}

// ---- Pendidikan ----
export function viewPendidikan() {
  const lit = LITERACY.map((r) => ({ label: String(r.year), value: r.value }));
  const hdi = HDI.map((r) => ({ label: String(r.year), value: r.value }));
  return `
  ${sectionHead('Pendidikan', 'Seberapa jauh pendidikan Indonesia melangkah: melek aksara, lama sekolah, dan IPM.')}
  <section class="kpi-grid small">
    ${kpiCard({ value: '96,67%', label: 'Melek aksara 15+ tahun, 2024', source: 'BPS', delta: '▲ +0,14 poin dari 2023', deltaDir: 'good', spark: LITERACY.map((r) => r.value), accent: 'teal' })}
    ${kpiCard({ value: '13,21 thn', label: 'Harapan lama sekolah, 2024', source: 'BPS', accent: 'teal' })}
    ${kpiCard({ value: '8,85 thn', label: 'Rata-rata lama sekolah, 2024', source: 'BPS', accent: 'teal' })}
    ${kpiCard({ value: '75,02', label: 'IPM 2024 (kategori Tinggi)', source: 'BPS', delta: '▲ +0,63 poin dari 2023', deltaDir: 'good', spark: HDI.map((r) => r.value), accent: 'teal' })}
  </section>
  <section class="split">
    <div class="card chart-card">
      <div class="card-head"><h3>Melek aksara 2021–2024</h3></div>
      <p class="card-blurb">Persentase penduduk 15 tahun ke atas yang bisa membaca dan menulis. Naik perlahan tapi konsisten.</p>
      ${lineChart(lit, { title: 'Angka melek aksara', format: (v) => fmtId(v, 2) + '%' })}
      ${SRC('BPS, Tabel Statistik Angka Melek Aksara')}
    </div>
    <div class="card chart-card">
      <div class="card-head"><h3>IPM 2021–2024</h3></div>
      <p class="card-blurb">Indeks Pembangunan Manusia naik 0,63 poin pada 2024 — didorong semua dimensinya: kesehatan, pendidikan, dan standar hidup.</p>
      ${lineChart(hdi, { title: 'Indeks Pembangunan Manusia', format: (v) => fmtId(v, 2) })}
      ${SRC('BPS, Berita Resmi Statistik')}
    </div>
  </section>
  <section class="card">
    <h3>Tiga dimensi IPM 2024</h3>
    <ul class="fact-list">
      <li><strong>Kesehatan</strong> — umur harapan hidup saat lahir 74,15 tahun.</li>
      <li><strong>Pendidikan</strong> — harapan lama sekolah 13,21 tahun; rata-rata lama sekolah 8,85 tahun.</li>
      <li><strong>Standar hidup layak</strong> — pengeluaran riil per kapita Rp12,34 juta per tahun.</li>
    </ul>
    <p class="card-blurb">IPM 2025 sudah dirilis BPS: naik lagi ke 75,90. DKI Jakarta memimpin antarprovinsi dengan 85,05 pada 2025.</p>
    ${SRC('BPS, Berita Resmi Statistik')}
  </section>`;
}

// ---- Kesehatan ----
export function viewKesehatan() {
  const st = STUNTING.map((r) => ({ label: String(r.year), value: r.value }));
  return `
  ${sectionHead('Kesehatan', 'Harapan hidup makin panjang, stunting makin turun — tapi pekerjaan rumah masih besar.')}
  <section class="kpi-grid small">
    ${kpiCard({ value: '74,15 thn', label: 'Umur harapan hidup saat lahir, 2024', source: 'BPS', accent: 'teal' })}
    ${kpiCard({ value: '19,8%', label: 'Stunting balita, 2024', source: 'Kemenkes', delta: '▼ 1,7 poin dari 2023 — melampaui target 20,1%', deltaDir: 'good', spark: STUNTING.map((r) => r.value), sparkColor: '#14684f', accent: 'green' })}
    ${kpiCard({ value: '7,4%', label: 'Wasting balita, 2024', source: 'Kemenkes', accent: 'green' })}
    ${kpiCard({ value: '3,4%', label: 'Balita gizi lebih, 2024', source: 'Kemenkes', accent: 'green' })}
  </section>
  <section class="split">
    <div class="card chart-card">
      <div class="card-head"><h3>Stunting balita 2019–2024</h3></div>
      <p class="card-blurb">Prevalensi stunting turun dari 27,7% (2019) menjadi 19,8% (2024) — melampaui target 20,1% pemerintah. Target RPJMN 2029: 14,2%.</p>
      ${lineChart(st, { title: 'Prevalensi stunting', format: (v) => fmtId(v, 1) + '%' })}
      ${SRC('Kemenkes, Survei Status Gizi Indonesia (SSGI) 2019–2024')}
    </div>
    <div class="card">
      <h3>Apa artinya</h3>
      <ul class="fact-list">
        <li><strong>4,48 juta</strong> balita masih mengalami stunting pada 2024 — sekitar 1 dari 5 balita.</li>
        <li><strong>29,8%</strong> stunting di kuintil termiskin — kesenjangan gizi antar kelompok ekonomi masih lebar.</li>
        <li><strong>11%</strong> stunting pada bayi di bawah 1 tahun, memuncak <strong>24,2%</strong> pada usia 2,5 tahun.</li>
        <li><strong>337 ribu</strong> balita dicegah dari stunting sepanjang 2024, melampaui target tahunan 325 ribu.</li>
      </ul>
      ${SRC('Kemenkes, SSGI 2024')}
    </div>
  </section>
  <section class="card">
    <h3>Bonus demografi, penduduk menua</h3>
    <p class="card-blurb">Menurut SUPAS 2025, penduduk lansia (60 tahun ke atas) sudah 11,97% — Indonesia resmi memasuki fase penduduk menua (ageing population), meski rasio ketergantungan 45,05 masih di bawah 50 sehingga bonus demografi belum berakhir.</p>
    ${SRC('BPS, SUPAS 2025')}
  </section>`;
}

// ---- Provinsi ----
export function provinceRows(rows, sortKey, sortDir) {
  return rows
    .map((p, i) => {
      const share = (p.pop / 281603.8) * 100;
      return `<tr><td class="num">${i + 1}</td><td>${p.name}</td><td>${p.region}</td><td class="num">${fmtId(p.pop, 1)}</td><td class="num">${fmtPopThousands(p.pop)}</td><td class="num">${fmtId(share, 2)}%</td></tr>`;
    })
    .join('');
}

export function viewProvinsi() {
  return `
  ${sectionHead('38 Provinsi', 'Semua provinsi, dari Jawa Barat yang 50,35 juta jiwa sampai Papua Selatan yang 542 ribu jiwa. Ketik untuk mencari, klik judul kolom untuk mengurutkan.')}
  <section class="card">
    <h3>Peta penduduk 2024</h3>
    <p class="card-blurb">Satu petak untuk satu provinsi, disusun mengikuti letak geografisnya dan diwarnai menurut jumlah penduduk. Tiga petak terakota adalah tiga provinsi terpadat: Jawa Barat, Jawa Timur, dan Jawa Tengah.</p>
    ${tileMapBlock(false)}
  </section>
  <section class="card">
    <div class="prov-tools">
      <label class="search-box">Cari provinsi
        <input type="search" id="prov-search" placeholder="Contoh: Jawa, Papua, Kalimantan…" autocomplete="off">
      </label>
      <p class="muted" id="prov-count"></p>
    </div>
    <div class="table-wrap">
      <table class="prov-table">
        <thead>
          <tr>
            <th data-sort="rank" class="num">#</th>
            <th data-sort="name">Provinsi</th>
            <th data-sort="region">Pulau / Wilayah</th>
            <th data-sort="pop" class="num">Penduduk (ribu jiwa)</th>
            <th data-sort="popjt" class="num">Penduduk</th>
            <th data-sort="share" class="num">Pangsa</th>
          </tr>
        </thead>
        <tbody id="prov-rows"></tbody>
      </table>
    </div>
    <p class="card-blurb">Urutan awal: penduduk terbanyak. Klik judul kolom untuk mengurutkan naik/turun.</p>
    ${SRC('BPS, Proyeksi Penduduk Interim 2020–2023 (pertengahan 2024). Total nasional 281.603,8 ribu jiwa; jumlah provinsi dibulatkan ke 0,1 ribu.')}
  </section>`;
}

// ---- Tentang ----
export function viewTentang() {
  return `
  ${sectionHead('Tentang &amp; Sumber Data', 'Dari mana angka-angka di situs ini berasal, dan bagaimana situs ini dibuat.')}
  <section class="card">
    <h3>Tentang situs ini</h3>
    <p><strong>Statistik Indonesia</strong> adalah situs rangkuman angka resmi Indonesia — bukan situs
    resmi pemerintah. Situs ini independen, tidak berafiliasi dengan BPS atau kementerian mana pun,
    dan dibuat sebagai alat bantu warga yang ingin cepat menemukan angka-angka kunci beserta
    sumbernya. Setiap angka menampilkan tahun dan sumbernya; angka yang tidak bisa diverifikasi
    dari sumber resmi tidak dipakai.</p>
    <p>Situs ini statis dan bekerja offline: seluruh data tersimpan di dalam berkas situs sendiri,
    tanpa mengambil data dari internet saat dibuka.</p>
  </section>
  <section class="card">
    <h3>Sumber data</h3>
    <ul class="fact-list">
      <li><strong>Badan Pusat Statistik (BPS)</strong> — Jumlah penduduk &amp; proyeksi penduduk 2015–2024; PDB, pertumbuhan ekonomi &amp; pangsa sektor (Berita Resmi Statistik 5 Feb 2025); inflasi Desember y-on-y; kemiskinan September; Sakernas Agustus 2024 (TPT, angkatan kerja, upah); IPM &amp; komponennya 2021–2024; angka melek aksara 2021–2024; penduduk menurut provinsi pertengahan 2024.</li>
      <li><strong>BPS, Survei Penduduk Antar Sensus (SUPAS) 2025</strong> — struktur umur, generasi, rasio ketergantungan 45,05, TFR 2,13.</li>
      <li><strong>Kementerian Kesehatan, Survei Status Gizi Indonesia (SSGI) 2019–2024</strong> — prevalensi stunting, wasting, dan gizi lebih balita.</li>
      <li><strong>Pembaruan 2025</strong> — BPS, Berita Resmi Statistik 2025–2026 (penduduk 2025, PDB 2025, IPM 2025, kemiskinan September 2025).</li>
    </ul>
    <p>Periksa angka aslinya di situs resmi: <a href="https://www.bps.go.id">bps.go.id</a> dan <a href="https://www.kemkes.go.id">kemkes.go.id</a>.</p>
  </section>
  <section class="card">
    <h3>Metodologi &amp; catatan</h3>
    <ul class="fact-list">
      <li>Angka penduduk adalah <strong>pertengahan tahun</strong> (Juni) dari proyeksi penduduk BPS, kecuali SUPAS 2025.</li>
      <li>Kemiskinan diukur tiap Maret dan September; grafik memakai angka <strong>September</strong>.</li>
      <li>Pengangguran memakai <strong>Tingkat Pengangguran Terbuka (TPT) Agustus</strong> dari Sakernas.</li>
      <li>Inflasi memakai angka <strong>Desember year-on-year</strong>.</li>
      <li>Pembulatan: jumlah penduduk provinsi dijumlahkan bisa berbeda 0,1 ribu jiwa dari total nasional karena pembulatan.</li>
      <li>Data terakhir diperbarui: November 2026. Edisi angka utama: 2024.</li>
    </ul>
  </section>`;
}
