// Pembangun grafik SVG tanpa pustaka: batang, garis, dan batang horizontal.
// Semua grafik memakai viewBox sehingga responsif di desktop dan HP.

const COLORS = {
  bar: '#14684f',
  barAlt: '#2a7f6f',
  line: '#c96f2e',
  grid: '#e7e0cd',
  axis: '#8a9484',
  text: '#44503f',
  negative: '#b4452f',
};

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

// Grafik batang vertikal. points: [{label, value}], valueLabel: format angka.
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
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik batang')}" class="chart">`;
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
    const color = p.value < 0 ? COLORS.negative : i === points.length - 1 ? COLORS.barAlt : COLORS.bar;
    s += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="3" fill="${color}"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>`;
    const lx = Math.min(Math.max(cx, 36), W - 36);
    s += `<text x="${lx.toFixed(1)}" y="${(top - 7).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="${COLORS.text}">${esc(fmt(p.value))}</text>`;
    s += `<text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="12" fill="${COLORS.text}">${esc(p.label)}</text>`;
  });
  s += '</svg>';
  return s;
}

// Grafik garis dengan titik dan label nilai. points: [{label, value}].
export function lineChart(points, opts = {}) {
  const W = 640;
  const H = 340;
  const padL = 68;
  const padR = 16;
  const padT = 30;
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
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik garis')}" class="chart">`;
  // Garis grid pada 4 nilai yang tersebar merata antara min dan max.
  for (let i = 0; i <= 4; i++) {
    const t = min + (range * i) / 4;
    const yy = y(t);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="${COLORS.grid}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="12" fill="${COLORS.text}">${esc(fmt(Math.round(t * 100) / 100))}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  s += `<path d="${path}" fill="none" stroke="${COLORS.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  points.forEach((p, i) => {
    s += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4.5" fill="#fff" stroke="${COLORS.line}" stroke-width="2.5"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></circle>`;
    const lx = Math.min(Math.max(x(i), 36), W - 36);
    s += `<text x="${lx.toFixed(1)}" y="${(y(p.value) - 11).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="${COLORS.text}">${esc(fmt(p.value))}</text>`;
    s += `<text x="${x(i).toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="12" fill="${COLORS.text}">${esc(p.label)}</text>`;
  });
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
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.title || 'Grafik batang horizontal')}" class="chart">`;
  items.forEach((p, i) => {
    const y = padT + i * rowH;
    const w = (p.value / max) * iw;
    const color = i === 0 ? COLORS.barAlt : COLORS.bar;
    s += `<text x="${padL - 10}" y="${y + 17}" text-anchor="end" font-size="13" fill="${COLORS.text}">${esc(p.label)}</text>`;
    s += `<rect x="${padL}" y="${y + 4}" width="${Math.max(2, w).toFixed(1)}" height="18" rx="3" fill="${color}"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>`;
    s += `<text x="${(padL + w + 8).toFixed(1)}" y="${y + 18}" font-size="12" font-weight="600" fill="${COLORS.text}">${esc(fmt(p.value))}</text>`;
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
