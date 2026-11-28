// Pembangun grafik SVG tanpa pustaka: batang, garis, donat, sparkline, dan
// peta petak (tile grid map). Semua grafik memakai viewBox sehingga responsif.

const COLORS = {
  bar: '#14684f',
  barAlt: '#2a7f6f',
  barHi: '#c96f2e',
  line: '#c96f2e',
  grid: '#e7e0cd',
  axis: '#8a9484',
  text: '#44503f',
  negative: '#b4452f',
};

let __uid = 0;
function uid() {
  __uid += 1;
  return `g${__uid}`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Skala "cantik" untuk sumbu Y: bulatkan batas atas ke kelipatan yang rapi.
function niceMax(max) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

function yTicks(max, count = 4) {
  const ticks = [];
  for (let i = 0; i <= count; i++) ticks.push((max * i) / count);
  return ticks;
}

// Grafik batang vertikal dengan gradien. points: [{label, value}].
export function barChart(points, opts = {}) {
  const W = 640;
  const H = 340;
  const padL = 68;
  const padR = 12;
  const padT = 30;
  const padB = 38;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const max = niceMax(Math.max(...points.map((p) => p.value), 0));
  const min = Math.min(0, ...points.map((p) => p.value));
  const floor = min < 0 ? niceMax(-min) * -1 : 0;
  const range = max - floor;
  const y = (v) => padT + ih - ((v - floor) / range) * ih;
  const slot = iw / points.length;
  const barW = Math.min(44, slot * 0.62);
  const fmt = opts.format || ((v) => String(v));
  const gid = uid();
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik batang')}" class="chart">`;
  s += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1d8a68"/><stop offset="100%" stop-color="#0e4d3a"/></linearGradient></defs>`;
  for (const t of yTicks(max, 4)) {
    const yy = y(t);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="${COLORS.grid}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="12" fill="${COLORS.text}">${esc(fmt(t))}</text>`;
  }
  if (floor < 0) {
    s += `<line x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}" stroke="${COLORS.axis}" stroke-width="1.5"/>`;
  }
  points.forEach((p, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(p.value, 0));
    const bottom = y(Math.min(p.value, 0));
    const isLast = i === points.length - 1;
    const fill = p.value < 0 ? COLORS.negative : isLast && opts.highlightLast ? COLORS.barHi : `url(#${gid})`;
    s += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="4" fill="${fill}"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>`;
    const lx = Math.min(Math.max(cx, 36), W - 36);
    s += `<text x="${lx.toFixed(1)}" y="${(top - 7).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${isLast && opts.highlightLast ? COLORS.barHi : COLORS.text}">${esc(fmt(p.value))}</text>`;
    s += `<text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="12" fill="${COLORS.text}">${esc(p.label)}</text>`;
  });
  s += '</svg>';
  return s;
}

// Grafik garis dengan area di bawah garis dan anotasi opsional.
// opts.annotations: [{index, text}] — label di atas titik tertentu.
export function lineChart(points, opts = {}) {
  const W = 640;
  const H = 340;
  const padL = 68;
  const padR = 16;
  const padT = 34;
  const padB = 38;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const vals = points.map((p) => p.value);
  const rawMax = Math.max(...vals);
  const rawMin = Math.min(...vals);
  const max = niceMax(rawMax + (rawMax - rawMin) * 0.15);
  const min = Math.floor((rawMin - (rawMax - rawMin) * 0.15) * 10) / 10;
  const range = max - min || 1;
  const x = (i) => padL + (iw * i) / (points.length - 1);
  const y = (v) => padT + ih - ((v - min) / range) * ih;
  const fmt = opts.format || ((v) => String(v));
  const gid = uid();
  const aid = `${gid}a`;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik garis')}" class="chart">`;
  s += `<defs><linearGradient id="${aid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c96f2e" stop-opacity="0.28"/><stop offset="100%" stop-color="#c96f2e" stop-opacity="0.02"/></linearGradient></defs>`;
  for (let i = 0; i <= 4; i++) {
    const t = min + (range * i) / 4;
    const yy = y(t);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="${COLORS.grid}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="12" fill="${COLORS.text}">${esc(fmt(Math.round(t * 100) / 100))}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const base = y(min);
  s += `<path d="${path} L${x(points.length - 1).toFixed(1)},${base.toFixed(1)} L${x(0).toFixed(1)},${base.toFixed(1)} Z" fill="url(#${aid})"/>`;
  s += `<path d="${path}" fill="none" stroke="${COLORS.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  points.forEach((p, i) => {
    const isLast = i === points.length - 1;
    s += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="${isLast ? 6 : 4.5}" fill="${isLast ? COLORS.line : '#fff'}" stroke="${COLORS.line}" stroke-width="2.5"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></circle>`;
    const lx = Math.min(Math.max(x(i), 36), W - 36);
    s += `<text x="${lx.toFixed(1)}" y="${(y(p.value) - 11).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="${isLast ? 700 : 600}" fill="${COLORS.text}">${esc(fmt(p.value))}</text>`;
    s += `<text x="${x(i).toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="12" fill="${COLORS.text}">${esc(p.label)}</text>`;
  });
  // Anotasi: label kecil di atas titik yang ditandai.
  for (const a of opts.annotations || []) {
    const i = a.index;
    if (i < 0 || i >= points.length) continue;
    const ax = Math.min(Math.max(x(i), 70), W - 70);
    s += `<text x="${ax.toFixed(1)}" y="${(y(points[i].value) - 30).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${COLORS.negative}">${esc(a.text)}</text>`;
  }
  s += '</svg>';
  return s;
}

// Grafik batang horizontal, cocok untuk peringkat. items: [{label, value}].
export function hbarChart(items, opts = {}) {
  const rowH = 34;
  const H = 46 + items.length * rowH;
  const W = 640;
  const padL = opts.labelWidth || 210;
  const padR = 64;
  const padT = 10;
  const iw = W - padL - padR;
  const max = niceMax(Math.max(...items.map((p) => p.value)));
  const fmt = opts.format || ((v) => String(v));
  const gid = uid();
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik batang horizontal')}" class="chart">`;
  s += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1d8a68"/><stop offset="100%" stop-color="#0e4d3a"/></linearGradient></defs>`;
  items.forEach((p, i) => {
    const y = padT + i * rowH;
    const w = (p.value / max) * iw;
    const color = i === 0 ? '#c96f2e' : `url(#${gid})`;
    s += `<text x="${padL - 10}" y="${y + 17}" text-anchor="end" font-size="13" fill="${COLORS.text}">${esc(p.label)}</text>`;
    s += `<rect x="${padL}" y="${y + 4}" width="${Math.max(2, w).toFixed(1)}" height="18" rx="4" fill="${color}"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>`;
    s += `<text x="${(padL + w + 8).toFixed(1)}" y="${y + 18}" font-size="12" font-weight="700" fill="${COLORS.text}">${esc(fmt(p.value))}</text>`;
  });
  s += '</svg>';
  return s;
}

// Bilah proporsi bertumpuk untuk struktur umur: [{label, pct, color}].
export function stackedBar(segments, opts = {}) {
  const W = 640;
  const H = 96;
  const padL = 8;
  const iw = W - padL * 2;
  let x = padL;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Bilah proporsi')}" class="chart">`;
  for (const seg of segments) {
    const w = (seg.pct / 100) * iw;
    s += `<rect x="${x.toFixed(1)}" y="8" width="${w.toFixed(1)}" height="34" fill="${seg.color}"><title>${esc(seg.label)}: ${esc(String(seg.pct).replace('.', ','))}%</title></rect>`;
    if (w > 46) {
      s += `<text x="${(x + w / 2).toFixed(1)}" y="29" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${esc(String(seg.pct).replace('.', ','))}%</text>`;
    }
    x += w;
  }
  let lx = padL;
  for (const seg of segments) {
    s += `<rect x="${lx}" y="56" width="12" height="12" fill="${seg.color}"/>`;
    s += `<text x="${lx + 18}" y="66" font-size="12" fill="${COLORS.text}">${esc(seg.label)}</text>`;
    lx += 18 + seg.label.length * 6.6 + 26;
  }
  s += '</svg>';
  return s;
}

// Grafik donat: [{label, value, color}], dengan total di tengah.
export function donutChart(items, opts = {}) {
  const W = 300;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2;
  const R = 118;
  const r = 78;
  const total = items.reduce((a, b) => a + b.value, 0);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik donat')}" class="donut">`;
  let angle = -Math.PI / 2;
  for (const it of items) {
    const frac = it.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const xi1 = cx + r * Math.cos(a1);
    const yi1 = cy + r * Math.sin(a1);
    const xi0 = cx + r * Math.cos(a0);
    const yi0 = cy + r * Math.sin(a0);
    s += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${r},${r} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${it.color}"><title>${esc(it.label)}: ${esc(String(it.value).replace('.', ','))}%</title></path>`;
    angle = a1;
  }
  s += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="26" font-weight="700" fill="#0e4d3a" font-family="Georgia, serif">${esc(opts.center || '')}</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#5c6b60">${esc(opts.centerSub || '')}</text>`;
  s += '</svg>';
  return s;
}

// Sparkline kecil untuk kartu KPI: values = angka berurutan.
export function sparkline(values, opts = {}) {
  const W = opts.w || 120;
  const H = opts.h || 36;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const x = (i) => pad + ((W - pad * 2) * i) / (values.length - 1);
  const y = (v) => pad + (H - pad * 2) - ((v - min) / range) * (H - pad * 2);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const color = opts.color || '#14684f';
  const last = values[values.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" class="spark" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(values.length - 1).toFixed(1)}" cy="${y(last).toFixed(1)}" r="3.5" fill="${color}"/></svg>`;
}

// ---- Peta petak Indonesia ----
// tiles: [{name, col, row, pop}] — pop dalam ribu jiwa.
// Pewarnaan: 5 jenjang hijau berdasarkan jumlah penduduk; tiga provinsi
// terpadat (>30 jt) memakai terakota supaya langsung terlihat.
export const TILE_COLORS = ['#b7dcc4', '#7cc0a0', '#3a9e7d', '#14684f', '#c96f2e'];
export const TILE_COLORS_DARK = ['#2c5f46', '#3f8a63', '#5cb58a', '#8fd0ae', '#f2b25c'];

export function tileBucket(popThousands) {
  if (popThousands >= 30000) return 4;
  if (popThousands >= 10000) return 3;
  if (popThousands >= 5000) return 2;
  if (popThousands >= 3000) return 1;
  return 0;
}

export function tileMap(tiles, opts = {}) {
  const cols = 14;
  const rows = 7;
  const cell = opts.cell || 40;
  const gap = opts.gap || 4;
  const W = cols * cell + (cols - 1) * gap;
  const H = rows * cell + (rows - 1) * gap;
  const dark = !!opts.dark;
  const colors = dark ? TILE_COLORS_DARK : TILE_COLORS;
  const stroke = dark ? '#0e4d3a' : '#faf6ee';
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Peta petak 38 provinsi Indonesia, diwarnai menurut jumlah penduduk" class="tilemap">`;
  for (const t of tiles) {
    const x = t.col * (cell + gap);
    const y = t.row * (cell + gap);
    const bucket = tileBucket(t.pop);
    const fill = colors[bucket];
    const label = `${t.name}: ${(t.pop / 1000).toFixed(2).replace('.', ',')} jt jiwa (${((t.pop / 281603.8) * 100).toFixed(1).replace('.', ',')}% Indonesia)`;
    s += `<rect class="tile" data-prov="${esc(t.name)}" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"><title>${esc(label)}</title></rect>`;
  }
  s += '</svg>';
  return s;
}

export function tileLegend(dark = false) {
  const colors = dark ? TILE_COLORS_DARK : TILE_COLORS;
  const labels = ['< 3 jt', '3–5 jt', '5–10 jt', '10–30 jt', '> 30 jt'];
  return `<div class="tile-legend">${colors.map((c, i) => `<span class="tile-leg"><i style="background:${c}"></i>${labels[i]}</span>`).join('')}<span class="tile-leg-note">jiwa per provinsi, 2024</span></div>`;
}
