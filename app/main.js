// Router hash + pengendali interaktif: pemilih rentang tahun, pengalih jenis
// grafik, dan pencarian/pengurutan tabel provinsi. Tidak ada network request.

import { PROVINCES } from './data.js';
import {
  gdpChartHtml,
  popChartHtml,
  provinceRows,
  viewEkonomi,
  viewHome,
  viewKesehatan,
  viewKerja,
  viewPendidikan,
  viewPenduduk,
  viewProvinsi,
  viewTentang,
} from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('.nav a')];

const state = {
  popRange: 'all',
  popType: 'bar',
  gdpType: 'bar',
  provQuery: '',
  provSortKey: 'pop',
  provSortDir: -1,
};

const ROUTES = {
  '/': { title: 'Statistik Indonesia — Angka resmi Indonesia dalam satu halaman', render: () => viewHome(state) },
  '/penduduk': { title: 'Penduduk — Statistik Indonesia', render: () => viewPenduduk(state) },
  '/ekonomi': { title: 'Ekonomi — Statistik Indonesia', render: () => viewEkonomi(state) },
  '/ketenagakerjaan': { title: 'Ketenagakerjaan — Statistik Indonesia', render: () => viewKerja() },
  '/pendidikan': { title: 'Pendidikan — Statistik Indonesia', render: () => viewPendidikan() },
  '/kesehatan': { title: 'Kesehatan — Statistik Indonesia', render: () => viewKesehatan() },
  '/provinsi': { title: '38 Provinsi — Statistik Indonesia', render: () => viewProvinsi() },
  '/tentang': { title: 'Tentang & Sumber Data — Statistik Indonesia', render: () => viewTentang() },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  document.title = page.title;
  app.innerHTML = page.render();
  navLinks.forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + route);
    if (href === '#' + route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (route === '/provinsi') {
    renderProvRows();
    const input = document.getElementById('prov-search');
    if (input) input.value = state.provQuery;
  }
  window.scrollTo(0, 0);
}

// ---- Tabel provinsi: saring + urutkan ----
function sortedProvinces() {
  const q = state.provQuery.trim().toLowerCase();
  let rows = PROVINCES.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q),
  );
  const key = state.provSortKey;
  const dir = state.provSortDir;
  const share = (p) => (p.pop / 281603.8) * 100;
  rows = [...rows].sort((a, b) => {
    if (key === 'name') return dir * a.name.localeCompare(b.name, 'id');
    if (key === 'region') return dir * (a.region.localeCompare(b.region, 'id') || a.name.localeCompare(b.name, 'id'));
    if (key === 'share') return dir * (share(a) - share(b));
    return dir * (a.pop - b.pop); // 'rank', 'pop', dan 'popjt' sama-sama mengurutkan menurut penduduk
  });
  return rows;
}

function renderProvRows() {
  const rows = sortedProvinces();
  const tbody = document.getElementById('prov-rows');
  const count = document.getElementById('prov-count');
  if (!tbody) return;
  tbody.innerHTML = rows.length
    ? provinceRows(rows, state.provSortKey, state.provSortDir)
    : '<tr><td colspan="6" class="empty">Tidak ada provinsi yang cocok dengan pencarian itu.</td></tr>';
  if (count) {
    count.textContent = rows.length === PROVINCES.length
      ? `Menampilkan ${PROVINCES.length} provinsi.`
      : `Menampilkan ${rows.length} dari ${PROVINCES.length} provinsi.`;
  }
  document.querySelectorAll('.prov-table th[data-sort]').forEach((th) => {
    const key = th.getAttribute('data-sort');
    const active = key === state.provSortKey;
    th.classList.toggle('sorted', active);
    th.textContent = th.textContent.replace(/ [▲▼]$/, '');
    if (active) th.textContent += state.provSortDir === 1 ? ' ▲' : ' ▼';
  });
}

// ---- Peta petak: klik petak -> info provinsi ----
app.addEventListener('click', (event) => {
  const tile = event.target.closest('.tile');
  if (tile) {
    const name = tile.getAttribute('data-prov');
    const p = PROVINCES.find((x) => x.name === name);
    const readout = document.getElementById('map-readout');
    if (p && readout) {
      const share = ((p.pop / 281603.8) * 100).toFixed(2).replace('.', ',');
      const jt = (p.pop / 1000).toFixed(2).replace('.', ',');
      readout.innerHTML = `<strong>${p.name}</strong> — ${jt} juta jiwa (${share}% penduduk Indonesia), wilayah ${p.region}. Peringkat ${PROVINCES.indexOf(p) + 1} dari 38 provinsi.`;
      document.querySelectorAll('.tile').forEach((t) => t.classList.toggle('selected', t === tile));
    }
    return;
  }
  const rangeBtn = event.target.closest('[data-range]');
  if (rangeBtn) {
    state.popRange = rangeBtn.getAttribute('data-range');
    const box = document.getElementById('pop-chart');
    if (box) box.innerHTML = popChartHtml(state.popRange, state.popType);
    syncToggleGroup(rangeBtn);
    return;
  }
  const typeBtn = event.target.closest('[data-chart]');
  if (typeBtn) {
    const key = typeBtn.getAttribute('data-chart');
    const type = typeBtn.getAttribute('data-type');
    if (key === 'pop') {
      state.popType = type;
      const box = document.getElementById('pop-chart');
      if (box) box.innerHTML = popChartHtml(state.popRange, state.popType);
    } else if (key === 'gdp') {
      state.gdpType = type;
      const box = document.getElementById('gdp-chart');
      if (box) box.innerHTML = gdpChartHtml(state.gdpType);
    }
    syncToggleGroup(typeBtn);
    return;
  }
  const th = event.target.closest('th[data-sort]');
  if (th) {
    const key = th.getAttribute('data-sort');
    if (key === state.provSortKey) state.provSortDir *= -1;
    else {
      state.provSortKey = key;
      state.provSortDir = key === 'name' || key === 'region' ? 1 : -1;
    }
    renderProvRows();
  }
});

function syncToggleGroup(btn) {
  const group = btn.closest('.toggle');
  if (!group) return;
  group.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
}

app.addEventListener('input', (event) => {
  if (event.target.id === 'prov-search') {
    state.provQuery = event.target.value;
    renderProvRows();
  }
});

window.addEventListener('hashchange', render);
render();
