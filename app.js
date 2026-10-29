/* ==================================================================
   UTM Analytics prototype v4 — app
   State → render. Every number is computed by DATA.query() from the
   current range, trigger (All / Links / QR) and filters.
================================================================== */
(function () {
  'use strict';
  const D = window.DATA;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Icons (stroke, 24 box) ---------- */
  const I = {
    links: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/></svg>',
    qr: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v1M17 20h4M14 20v1"/></svg>',
    analytics: '<svg viewBox="0 0 24 24"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></svg>',
    templates: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 10v10"/></svg>',
    parameters: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16"/></svg>',
    attributes: '<svg viewBox="0 0 24 24"><path d="M5 5h14M5 12h14M5 19h14"/><circle cx="8" cy="5" r="1.2" fill="currentColor"/><circle cx="8" cy="12" r="1.2" fill="currentColor"/><circle cx="8" cy="19" r="1.2" fill="currentColor"/></svg>',
    shorteners: '<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M6 8.5v7M8.5 6h7M15.5 6c-6 0-9 5-9 9"/></svg>',
    rules: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
    members: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6.5 6.5-6.5S15.5 16 15.5 20"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c3 0 5.5 2 5.5 5.5"/></svg>',
    support: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l4 4M14.4 14.4l4 4M5.6 18.4l4-4M14.4 9.6l4-4"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    chevL: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/></svg>',
    expand: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/></svg>',
    external: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5a2 2 0 0 0-4-4L4 16z"/><path d="m13 7 4 4"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M8 18h10V8"/></svg>',
    flat: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2"/><circle cx="10" cy="16" r="2"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
    device: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/></svg>',
    referrer: '<svg viewBox="0 0 24 24"><path d="M4 12h12M11 7l5 5-5 5"/><path d="M20 5v14"/></svg>',
    trigger: '<svg viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6z"/></svg>',
    sort: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    swatch: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  };

  /* ---------- Formatting ---------- */
  const fmt = {
    n(v) { v = Math.round(v); if (v < 1000) return String(v); if (v < 10000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; if (v < 1e6) return Math.round(v / 1000) + 'k'; return (v / 1e6).toFixed(1) + 'M'; },
    full(v) { return Math.round(v).toLocaleString('en-US'); },
    pct(v) { if (v < .005) return '<1%'; return Math.round(v * 100) + '%'; },
    d(d, o) { return d.toLocaleDateString('en-US', o || { month: 'short', day: 'numeric' }); },
    range(r) {
      const sameY = r.start.getFullYear() === r.end.getFullYear(), sameM = sameY && r.start.getMonth() === r.end.getMonth();
      if (+D.stripTime(r.start) === +D.stripTime(r.end)) return fmt.d(r.start, { month: 'short', day: 'numeric', year: 'numeric' });
      if (sameM) return `${fmt.d(r.start, { month: 'short' })} ${r.start.getDate()}–${r.end.getDate()}, ${r.end.getFullYear()}`;
      return `${fmt.d(r.start)} – ${fmt.d(r.end)}, ${r.end.getFullYear()}`;
    },
  };
  const dkey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /* ---------- Date presets ---------- */
  const T = D.TODAY;
  const PRESETS = [
    { id: 'today', label: 'Today', kbd: 'D', get: () => ({ start: T, end: T }) },
    { id: 'yesterday', label: 'Yesterday', kbd: 'E', get: () => ({ start: addDays(T, -1), end: addDays(T, -1) }) },
    { id: '7d', label: 'Last 7 days', kbd: 'W', get: () => ({ start: addDays(T, -6), end: T }) },
    { id: '30d', label: 'Last 30 days', kbd: 'T', get: () => ({ start: addDays(T, -29), end: T }) },
    { id: 'month', label: 'This month', kbd: 'M', get: () => ({ start: new Date(T.getFullYear(), T.getMonth(), 1), end: T }) },
    { id: 'lastmonth', label: 'Last month', kbd: 'L', get: () => ({ start: new Date(T.getFullYear(), T.getMonth() - 1, 1), end: new Date(T.getFullYear(), T.getMonth(), 0) }) },
    { id: '90d', label: 'Last 90 days', kbd: 'Q', get: () => ({ start: addDays(T, -89), end: T }) },
    { id: '12m', label: 'Last 12 months', pro: true, get: null },
  ];

  /* ---------- State ---------- */
  const state = {
    view: 'overview', slug: null,
    preset: 'month', range: PRESETS[4].get(), compare: true,
    trigger: 'all', filters: [], metric: 'clicks', interval: 'day',
    sort: { key: 'clicks', dir: -1 }, showAll: false,
    tabs: { utm: 'campaign', loc: 'map', dev: 'device', ref: 'referrer' },
    // Links page
    from: 'overview', lq: '', groupBy: 'none', lsort: { key: 'created', dir: -1 }, sel: new Set(), collapsed: new Set(),
  };

  const METRICS = [
    { key: 'clicks', label: 'Total clicks', only: null },
    { key: 'unique', label: 'Unique clicks', only: null },
    { key: 'linkClicks', label: 'Link clicks', only: 'link' },
    { key: 'qr', label: 'QR scans', only: 'qr' },
  ];
  const CARD_BARS = { utm: 'var(--bar-blue)', links: 'var(--bar-orange)', loc: 'var(--bar-green)', dev: 'var(--bar-red)', ref: 'var(--bar-indigo)', modal: 'var(--bar-indigo)' };

  /* ---------- Derived data (memoised per render) ---------- */
  let Q = null;
  function compute() {
    const filters = state.view === 'link' ? [...state.filters, { dim: 'link', op: 'is', values: [state.slug] }] : state.filters;
    const cur = D.query({ range: state.range, trigger: state.trigger, filters });
    const prior = D.query({ range: D.priorRange(state.range), trigger: state.trigger, filters });
    const unfiltered = state.filters.length ? D.query({ range: state.range, trigger: state.trigger, filters: state.view === 'link' ? [{ dim: 'link', op: 'is', values: [state.slug] }] : [] }) : cur;
    const priorBySlug = Object.fromEntries(prior.rows.map(r => [r.link.slug, r]));
    Q = { cur, prior, unfiltered, priorBySlug, filters };
    if (state.view === 'links') {
      Q.links = D.query({ range: ALL_RANGE, trigger: 'all', filters: state.filters });
      Q.linksAll = state.filters.length ? D.query({ range: ALL_RANGE, trigger: 'all', filters: [] }) : Q.links;
    }
    return Q;
  }
  function delta(cur, prev) { if (!prev) return null; return (cur - prev) / prev; }

  /* ---------- Rendering helpers ---------- */
  function deltaHTML(d, isNew) {
    if (d == null || !isFinite(d)) return isNew ? `<span class="delta new">New</span>` : `<span class="delta flat" title="No data in the prior period">—</span>`;
    const cls = Math.abs(d) < .005 ? 'flat' : d > 0 ? 'up' : 'down';
    const ic = cls === 'up' ? I.up : cls === 'down' ? I.down : I.flat;
    return `<span class="delta ${cls}" title="vs ${fmt.range(D.priorRange(state.range))}">${ic}<span>${Math.abs(Math.round(d * 100))}%</span></span>`;
  }
  function countrySpan(code) { const c = D.COUNTRIES[code]; return c ? `<span class="flag">${c.flag}</span>${esc(c.name)}` : esc(code); }

  function rowsHTML(items, opts) {
    const { dim, bar, limit = 6, showPct = true, filterable = true } = opts;
    if (!items.length) return `<div class="empty"><strong>No ${esc(D.DIM[dim] ? D.DIM[dim].label.toLowerCase() : 'data')} in this range</strong>Try a wider date range or fewer filters.</div>`;
    const f = state.filters.find(x => x.dim === dim && x.op === 'is');
    const max = items[0].value || 1;
    return items.slice(0, limit).map(it => {
      const active = f && f.values.includes(it.label);
      const label = dim === 'country' ? countrySpan(it.label) : dim === 'link' ? `<span class="code">${esc(it.label)}</span>` : esc(it.label);
      return `<div class="row ${active ? 'active-filter' : ''}" data-dim="${dim}" data-val="${esc(it.label)}" role="button" tabindex="0" style="--bar:${bar}">
        <div class="track"><div class="bar" data-w="${(it.value / max * 100).toFixed(1)}"></div><span class="lbl">${label}</span>${filterable ? `<span class="filter-hint">${active ? 'Remove filter' : 'Filter'}</span>` : ''}</div>
        <span class="val num">${fmt.n(it.value)}</span>${showPct ? `<span class="pct num">${fmt.pct(it.share)}</span>` : ''}
      </div>`;
    }).join('');
  }

  function card(id, tabs, bodyHTML, opts = {}) {
    const cur = state.tabs[id];
    return `<section class="card" data-card="${id}">
      <div class="card-head"><div class="card-tabs" role="tablist">${tabs.map(t => `<button role="tab" aria-selected="${t.key === cur}" class="${t.key === cur ? 'on' : ''}" data-tab="${t.key}">${esc(t.label)}</button>`).join('')}</div>
      ${opts.noExpand ? '' : `<button class="expand" data-expand="${id}" title="Show all">${I.expand}</button>`}</div>
      <div class="card-body">${bodyHTML}</div></section>`;
  }
  function listCard(id, tabs, headers, items, dim, extra = {}) {
    const body = `<div class="cols"><span>${esc(headers[0])}</span><span class="r">${esc(headers[1])}</span><span class="r">%</span></div><div class="rows">${rowsHTML(items, { dim, bar: CARD_BARS[id], ...extra })}</div>`;
    return card(id, tabs, body);
  }

  /* ---------- Toolbar ---------- */
  function toolbarHTML(title) {
    const status = 'Updated 4 min ago · suspected bots excluded';
    const n = state.filters.length;
    return `<div class="toolbar">
      <div class="title"><h1>${esc(title)}</h1><span class="status" tabindex="0" data-tip="${esc(status)}" aria-label="${esc(status)}">4 min ago</span></div>
      <div class="controls">
        <div class="seg" role="radiogroup" aria-label="Trigger">
          <button data-trigger="all" class="${state.trigger === 'all' ? 'on' : ''}">All</button>
          <button data-trigger="link" class="${state.trigger === 'link' ? 'on' : ''}">${I.links}Links</button>
          <button data-trigger="qr" class="${state.trigger === 'qr' ? 'on' : ''}">${I.qr}QR</button>
        </div>
        <button class="tb-btn" id="filter-btn" aria-haspopup="menu" aria-expanded="false">${I.filter}Filter${n ? `<span class="badge">${n}</span>` : ''}</button>
        <button class="tb-btn" id="date-btn" aria-haspopup="dialog" aria-expanded="false">${I.calendar}<span>${esc(rangeLabel())}</span><span class="chev">${I.chev}</span></button>
        <button class="tb-btn icon" id="more-btn" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button>
      </div></div>`;
  }
  function rangeLabel() { const p = PRESETS.find(p => p.id === state.preset); return p ? p.label : fmt.range(state.range); }

  function chipsHTML() {
    if (!state.filters.length) return '<div class="chips"></div>';
    const total = Q.unfiltered.totals.clicks, cur = Q.cur.totals.clicks;
    const chips = state.filters.map((f, i) => {
      const d = D.DIM[f.dim];
      const vals = f.values.length > 2 ? `${esc(f.values[0])} <span class="op">+${f.values.length - 1} more</span>` : f.values.map(esc).join('<span class="op"> or </span>');
      return `<span class="chip"><span class="k">${esc(d.label)}</span><span class="op">${f.op}</span><span class="v"><button data-edit-filter="${i}" title="Edit">${vals}</button></span><button class="x" data-remove-filter="${i}" aria-label="Remove filter">${I.close}</button></span>`;
    }).join('');
    const ctx = state.view === 'links' ? `Showing <b>${Q.links.rows.length}</b> of ${Q.linksAll.rows.length} links` : `Showing <b>${fmt.n(cur)}</b> of ${fmt.n(total)} clicks (${fmt.pct(total ? cur / total : 0)})`;
    return `<div class="chips">${chips}<button class="clear" id="clear-filters">Clear all</button><span class="context num">${ctx}</span></div>`;
  }

  /* ---------- KPI + chart ---------- */
  function kpiChartHTML() {
    const t = Q.cur.totals, p = Q.prior.totals;
    const metrics = METRICS.filter(m => !m.only || state.trigger === 'all' || state.trigger === m.only);
    if (!metrics.find(m => m.key === state.metric)) state.metric = 'clicks';
    const kpis = metrics.map(m => `<button class="kpi ${state.metric === m.key ? 'on' : ''}" data-metric="${m.key}" role="tab" aria-selected="${state.metric === m.key}">
      <span class="k">${esc(m.label)}</span><span class="v"><span class="num" data-count="${Math.round(t[m.key])}">${fmt.n(t[m.key])}</span>${state.compare ? deltaHTML(delta(t[m.key], p[m.key])) : ''}</span></button>`).join('');
    const prior = D.priorRange(state.range);
    return `<section class="card">
      <div class="kpis n${metrics.length}">${kpis}</div>
      <div class="chart-wrap"><div class="chart-head"><div class="legend"><span><i></i>${esc(fmt.range(Q.cur.range))}</span>${state.compare ? `<span><i class="prev"></i>${esc(fmt.range(prior))}</span>` : ''}</div>
        <button class="tb-btn" id="interval-btn" style="height:30px;font-size:12px" aria-haspopup="menu" aria-expanded="false">${state.interval === 'day' ? 'Day' : 'Week'}<span class="chev">${I.chev}</span></button>
        <button class="tb-btn icon" id="csv-btn" style="height:30px;width:30px" title="Download CSV">${I.download}</button></div>
      <div class="chart" id="chart"><div class="tip" id="chart-tip"></div></div></div></section>`;
  }

  function bucket(series) {
    if (state.interval === 'day') return series;
    const out = [];
    for (let i = 0; i < series.length; i += 7) {
      const chunk = series.slice(i, i + 7);
      const p = { date: chunk[0].date, end: chunk[chunk.length - 1].date, clicks: 0, linkClicks: 0, qr: 0, unique: 0, partial: chunk.some(c => c.partial) };
      chunk.forEach(c => { p.clicks += c.clicks; p.linkClicks += c.linkClicks; p.qr += c.qr; p.unique += c.unique; });
      out.push(p);
    }
    return out;
  }
  function niceMax(v) { if (v <= 0) return 4; const e = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1, 2, 2.5, 4, 5, 8, 10]) if (m * e >= v) return m * e; return 10 * e; }

  function drawChart() {
    const host = $('#chart'); if (!host) return;
    const tip = $('#chart-tip');
    const W = host.clientWidth || 800, H = host.clientHeight || 300;
    const pad = { l: 40, r: 10, t: 12, b: 28 };
    const m = state.metric;
    const cur = bucket(Q.cur.series), prev = state.compare ? bucket(Q.prior.series) : [];
    const n = cur.length;
    const max = niceMax(Math.max(...cur.map(p => p[m]), ...prev.map(p => p[m]), 1));
    const x = i => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : i * (W - pad.l - pad.r) / (n - 1));
    const y = v => pad.t + (H - pad.t - pad.b) * (1 - v / max);
    const pts = cur.map((p, i) => [x(i), y(p[m])]);
    const line = (ps) => ps.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const lastPartial = cur[n - 1] && cur[n - 1].partial && n > 1;
    const solid = lastPartial ? pts.slice(0, n - 1) : pts;
    const ticks = 4; let g = '';
    for (let k = 0; k <= ticks; k++) { const v = max * k / ticks; const yy = y(v); g += `<line class="gridline" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/><text class="axis" x="${pad.l - 8}" y="${yy + 4}" text-anchor="end">${fmt.n(v)}</text>`; }
    const every = Math.max(1, Math.ceil(n / Math.max(3, Math.floor((W - pad.l) / 110))));
    let xl = '';
    cur.forEach((p, i) => { if (i % every === 0 || i === n - 1) { const isLast = i === n - 1 && +D.stripTime(p.date) === +T; xl += `<text class="axis ${isLast ? 'today' : ''}" x="${x(i)}" y="${H - 6}" text-anchor="${i === n - 1 ? 'end' : i === 0 ? 'start' : 'middle'}">${isLast ? 'Today' : fmt.d(p.date)}</text>`; } });
    const prevPts = prev.slice(0, n).map((p, i) => [x(i), y(p[m])]);
    const area = pts.length > 1 ? `${line(pts)} L${pts[n - 1][0].toFixed(1)} ${y(0)} L${pts[0][0].toFixed(1)} ${y(0)} Z` : '';
    const id = Math.random().toString(36).slice(2, 7);
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="${esc(METRICS.find(k => k.key === m).label)} over time">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--accent-rgb))" stop-opacity=".18"/><stop offset="1" stop-color="rgb(var(--accent-rgb))" stop-opacity="0"/></linearGradient></defs>
      ${g}${xl}
      ${area ? `<path class="area fade" d="${area}"/>` : ''}
      ${prevPts.length > 1 ? `<path class="prev fade" d="${line(prevPts)}"/>` : ''}
      <path class="line draw ${m === 'qr' ? 'qr' : ''}" d="${line(solid)}"/>
      ${lastPartial ? `<path class="partial fade" d="${line(pts.slice(n - 2))}"/>` : ''}
      <line class="crosshair" id="xh-${id}" x1="0" x2="0" y1="${pad.t}" y2="${H - pad.b}" visibility="hidden"/>
      <circle class="dot" id="dot-${id}" r="4" visibility="hidden"/>
      <rect class="hit" x="${pad.l}" y="0" width="${W - pad.l - pad.r}" height="${H}"/></svg>`;
    host.appendChild(tip);
    const svg = $('svg', host), xh = $(`#xh-${id}`), dot = $(`#dot-${id}`);
    // Fail-safe: if the CSS draw animation never runs (background tab, reduced motion), show the line anyway.
    setTimeout(() => $$('.draw', svg).forEach(p => { p.classList.remove('draw'); p.style.strokeDasharray = 'none'; }), 1000);
    const label = METRICS.find(k => k.key === m).label;
    svg.addEventListener('mousemove', e => {
      const r = svg.getBoundingClientRect(); const px = (e.clientX - r.left) * (W / r.width);
      const i = Math.max(0, Math.min(n - 1, Math.round((px - pad.l) / ((W - pad.l - pad.r) / Math.max(1, n - 1)))));
      const p = cur[i]; if (!p) return;
      xh.setAttribute('x1', x(i)); xh.setAttribute('x2', x(i)); xh.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(p[m])); dot.setAttribute('visibility', 'visible');
      const when = state.interval === 'week' ? `${fmt.d(p.date)} – ${fmt.d(p.end)}` : fmt.d(p.date, { weekday: 'short', month: 'short', day: 'numeric' });
      const pv = prev[i];
      tip.innerHTML = `<div class="m">${esc(when)}${p.partial ? ' · so far' : ''}</div><div class="row-t"><span><i></i>${esc(label)}</span><b class="num">${fmt.full(p[m])}</b></div>${pv ? `<div class="row-t"><span class="m"><i style="opacity:.4"></i>Prior period</span><span class="m num">${fmt.full(pv[m])}</span></div>` : ''}`;
      tip.style.left = (x(i) * r.width / W) + 'px'; tip.style.top = (y(p[m]) * r.height / H) + 'px'; tip.classList.add('show');
    });
    svg.addEventListener('mouseleave', () => { tip.classList.remove('show'); xh.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
  }

  /* ---------- Top links table ---------- */
  function sparkline(series, key) {
    const n = series.length; if (n < 2) return '';
    const vals = series.map(p => p[key]); const max = Math.max(...vals, 1);
    const px = i => (i * 96 / (n - 1)).toFixed(1), py = v => (26 - v / max * 24).toFixed(1);
    const d = vals.map((v, i) => (i ? 'L' : 'M') + px(i) + ' ' + py(v)).join(' ');
    return `<svg viewBox="0 0 96 28"><path class="fillp" d="${d} L96 28 L0 28 Z"/><path d="${d}"/><circle cx="96" cy="${py(vals[n - 1])}" r="2.2"/></svg>`;
  }
  function tableHTML() {
    const rows = [...Q.cur.rows];
    const { key, dir } = state.sort;
    const val = r => key === 'delta' ? (delta(r.clicks, Q.priorBySlug[r.link.slug] && Q.priorBySlug[r.link.slug].clicks) ?? -Infinity) : key === 'qrShare' ? (r.clicks ? r.qr / r.clicks : 0) : key === 'link' ? r.link.slug : r[key];
    rows.sort((a, b) => { const va = val(a), vb = val(b); return (va > vb ? 1 : va < vb ? -1 : 0) * dir; });
    const limit = state.showAll ? rows.length : 7;
    const cols = [['link', 'Link'], ['trend', 'Trend'], ['clicks', 'Clicks', 'r'], ['unique', 'Unique', 'r'], ['delta', 'Change', 'r'], ['qrShare', 'Link vs QR'], ['country', 'Top country']];
    const head = cols.map(([k, l, r]) => {
      const sortable = !['trend', 'country'].includes(k);
      return `<span class="${r || ''}">${sortable ? `<button data-sort="${k}" class="${key === k ? 'on' : ''} ${dir === 1 ? 'asc' : ''}">${l}${I.sort}</button>` : l}</span>`;
    }).join('') + '<span></span>';
    const body = rows.slice(0, limit).map((r, i) => {
      const pr = Q.priorBySlug[r.link.slug];
      const qrShare = r.clicks ? r.qr / r.clicks : 0;
      const top = Object.entries(r.link.geo).sort((a, b) => b[1] - a[1])[0];
      const hasQR = r.link.qr > 0;
      const typeTip = hasQR ? `Has a QR code · ${Math.round(qrShare * 100)}% of clicks from scans` : 'Link only · no QR code';
      return `<div class="trow data" data-link="${esc(r.link.slug)}" role="link" tabindex="0" style="animation-delay:${Math.min(i, 10) * 25}ms">
        <div class="lk"><span class="type ${hasQR ? 'qr' : ''}" data-tip="${typeTip}" aria-label="${typeTip}">${hasQR ? I.qr : I.links}</span><div class="txt"><span class="lk-name">${esc(r.link.slug)}</span><span class="lk-dest">${esc(r.link.dest)}${utmQuery(r.link)}</span></div></div>
        <div class="spark">${sparkline(r.series, 'clicks')}</div>
        <div class="r num" style="font-weight:600;color:var(--text-strong)">${fmt.n(r.clicks)}</div>
        <div class="r num">${fmt.n(r.unique)}</div>
        <div class="r">${state.compare ? deltaHTML(delta(r.clicks, pr && pr.clicks), new Date(r.link.created) >= state.range.start) : '<span class="delta flat">—</span>'}</div>
        <div class="split"><span class="bar2" title="${Math.round((1 - qrShare) * 100)}% link clicks · ${Math.round(qrShare * 100)}% QR scans"><i data-w="${(qrShare * 100).toFixed(1)}"></i></span><small class="num">${Math.round(qrShare * 100)}% QR</small></div>
        <div class="num"><span class="flag">${D.COUNTRIES[top[0]].flag}</span> ${top[0]} ${Math.round(top[1] * 100)}%</div>
        <span class="chev">${I.chevR}</span></div>`;
    }).join('');
    const sub = `Ranked by ${esc(cols.find(c => c[0] === key)?.[1].toLowerCase() || 'clicks')} · ${esc(rangeLabel())}${state.filters.length ? ' · filtered' : ''}`;
    return `<section class="card" id="top-links">
      <div class="tbl-head"><div class="grow"><h2>Top links</h2><div class="sub">${sub}</div></div><a class="link-out" href="#" id="open-links">Open in Links table ${I.external}</a></div>
      <div class="table"><div class="trow head">${head}</div>${body || `<div class="empty" style="min-height:120px"><strong>No links match</strong>Try a wider date range or fewer filters.</div>`}</div>
      <div class="tbl-foot"><span>${rows.length > limit ? `Showing top ${limit} of ${rows.length} links` : `Showing all ${rows.length} links`} · Click a row for link details</span>${rows.length > 7 ? `<button id="show-all">${state.showAll ? 'Show top 7' : `Show all ${rows.length}`}</button>` : ''}</div></section>`;
  }
  function utmQuery(l) {
    const parts = ['source', 'medium', 'campaign', 'content', 'term'].filter(k => l[k]).map(k => `utm_${k}=${l[k]}`);
    return parts.length ? `?${parts.join('&')}` : '';
  }

  /* ---------- Map ---------- */
  let mapPaths = null;
  function decodeMap() {
    if (mapPaths) return mapPaths;
    const dec = s => s.split(';').map(r => { const n = r.split(',').map(v => +v / 2); let mn = 1e9, mx = -1e9; for (let i = 0; i < n.length; i += 2) { mn = Math.min(mn, n[i]); mx = Math.max(mx, n[i]); } if (mx - mn > 450) return ''; let d = `M${n[0]} ${n[1]}`; for (let i = 2; i < n.length; i += 2) d += `L${n[i]} ${n[i + 1]}`; return d + 'Z'; }).join('');
    mapPaths = { land: dec(window.MAP_DATA.land), c: Object.fromEntries(Object.entries(window.MAP_DATA.c).map(([k, v]) => [k, dec(v)])) };
    return mapPaths;
  }
  function mapHTML(items) {
    const mp = decodeMap();
    const by = Object.fromEntries(items.map(i => [i.label, i]));
    const max = items[0] ? items[0].value : 1;
    const f = state.filters.find(x => x.dim === 'country' && x.op === 'is');
    const cs = Object.entries(mp.c).map(([code, d]) => {
      const it = by[code]; const op = it ? (0.18 + 0.82 * Math.pow(it.value / max, 0.6)).toFixed(2) : 0;
      return `<path class="c ${it ? '' : 'dim'}" d="${d}" style="opacity:${it ? op : 1}" data-country="${code}" data-val="${it ? it.value : 0}" data-share="${it ? it.share : 0}"></path>`;
    }).join('');
    return `<div class="map-area"><div class="map" id="map"><svg viewBox="0 0 500 198"><path d="${mp.land}"/>${cs}</svg><div class="tip" id="map-tip"></div></div>
      <div class="map-legend"><span>0</span><span class="scale"></span><span class="num">${fmt.n(max)} clicks</span><span class="hint">${f ? 'Click a country to change the filter' : 'Click a country to filter'}</span></div></div>`;
  }

  /* ---------- Views ---------- */
  // One builder per tabbed card, so a tab switch can redraw just that card.
  function cardFor(id) {
    const b = Q.cur.breakdown, t = state.tabs[id];
    const tabs = (list) => list.map(([key, label]) => ({ key, label }));
    switch (id) {
      case 'utm': return listCard('utm', tabs([['campaign', 'Campaign'], ['source', 'Source'], ['medium', 'Medium'], ['content', 'Content'], ['term', 'Term']]), [D.DIM[t].label, 'Clicks'], b(t), t);
      case 'loc': return locationsCard(b);
      case 'dev': return listCard('dev', tabs([['device', 'Device'], ['browser', 'Browser'], ['os', 'OS']]), [D.DIM[t].label + ' type', 'Clicks'], b(t), t);
      case 'ref': return listCard('ref', tabs([['referrer', 'Referrers'], ['trigger', 'Trigger']]), [t === 'trigger' ? 'Trigger' : 'Referrer', 'Clicks'], b(t), t);
    }
  }
  // Swap one section in place and replay only its own entry animation.
  function swapSection(oldEl, html) {
    const tmp = document.createElement('div'); tmp.innerHTML = html.trim();
    const el = tmp.firstElementChild; el.classList.add('swap'); oldEl.replaceWith(el);
    requestAnimationFrame(() => $$('[data-w]', el).forEach(x => { x.style.width = x.dataset.w + '%'; }));
    return el;
  }
  function overviewHTML() {
    const [utm, loc, dev, ref] = ['utm', 'loc', 'dev', 'ref'].map(cardFor);
    return `<div class="view">${toolbarHTML('Analytics')}</div>
      ${chipsHTML()}${kpiChartHTML()}${tableHTML()}
      <div class="grid-2">${utm}${loc}</div><div class="grid-2">${dev}${ref}</div>
      <p class="footnote">Clicks are successful redirects; suspected bots are excluded. Unique clicks reset each calendar month. Times in UTC.</p>`;
  }
  function locationsCard(b) {
    const tabs = [{ key: 'map', label: 'Map' }, { key: 'country', label: 'Countries' }, { key: 'region', label: 'Regions' }, { key: 'city', label: 'Cities' }];
    const t = state.tabs.loc;
    if (t === 'map') return card('loc', tabs, mapHTML(b('country')), { noExpand: true });
    return listCard('loc', tabs, [D.DIM[t].label, 'Clicks'], b(t), t);
  }
  function linkHTML() {
    const link = D.LINKS.find(l => l.slug === state.slug);
    if (!link) { state.view = 'overview'; return overviewHTML(); }
    const b = Q.cur.breakdown;
    const utms = ['source', 'medium', 'campaign', 'content', 'term'].filter(k => link[k]).map(k => `<button class="utm-chip" data-utm="${k}" data-val="${esc(link[k])}" title="Filter analytics by this value"><span class="k">utm_${k}</span>${esc(link[k])}</button>`).join('');
    const hasQR = link.qr > 0;
    const head = `<div class="crumbs"><a href="#" id="back">${I.arrowL}${state.from === 'links' ? 'Links' : 'Analytics'}</a><span>/</span><span class="cur">${esc(link.slug)}</span></div>
      <section class="card"><div class="link-head"><span class="type">${hasQR ? I.qr : I.links}</span><div class="info">
        <div class="t"><h2>${esc(link.title)}</h2><span class="status-pill">Active</span></div>
        <div class="urls"><span class="short">${esc(link.slug)}</span><button class="icon-btn" data-copy="https://${esc(link.slug)}" title="Copy short link">${I.copy}</button><span class="arrow">→</span><span class="dest">${esc(link.dest)}${esc(utmQuery(link))}</span><button class="icon-btn" data-copy="https://${esc(link.dest)}${esc(utmQuery(link))}" title="Copy destination">${I.external}</button></div>
        <div class="utms">${utms}</div>
        <div class="meta">Created ${fmt.d(new Date(link.created), { month: 'short', day: 'numeric', year: 'numeric' })} by <span class="by">${avatar(link.by, 'xs')}${esc(link.by)}</span> · ${link.qr > 0 ? 'QR code attached' : 'No QR code'} · Tags: ${link.tags.map(esc).join(', ')}</div></div>
        <div class="actions"><button class="btn" id="qr-btn">${I.qr}QR code</button><button class="btn" id="edit-btn">${I.edit}Edit link</button></div></div></section>`;
    const [loc, dev, ref] = ['loc', 'dev', 'ref'].map(cardFor);
    return `<div class="view">${head}</div>${toolbarHTML('Performance')}${chipsHTML()}${kpiChartHTML()}
      <div class="grid-2">${loc}${dev}</div>${ref}
      <p class="footnote">Clicks are successful redirects; suspected bots are excluded. Unique clicks reset each calendar month. Times in UTC.</p>`;
  }

  /* ---------- Links page ---------- */
  // Whole history: the Links table shows lifetime clicks, not the analytics date range.
  const ALL_RANGE = (() => { const end = D.stripTime(D.TODAY); const start = new Date(end); start.setDate(start.getDate() - (D.DAYS - 1)); return { start, end }; })();
  const TEMPLATES = { paid_social: 'Paid social', social: 'Organic social', cpc: 'Paid search', email: 'Email', print: 'Print · QR', referral: 'Partner', audio: 'Podcast', video: 'Creator' };
  const templateOf = l => TEMPLATES[l.medium] || '—';
  const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const AVATARS = { 'Dana Whitfield': 'dana', 'Marcus Lee': 'marcus' };
  const avatar = (name, size = '') => AVATARS[name]
    ? `<img class="av ${size}" src="assets/avatars/${AVATARS[name]}.jpg" alt="" title="${esc(name)}">`
    : `<span class="av ${size}" title="${esc(name)}">${initials(name)}</span>`;
  const GROUPS = [['none', 'No grouping'], ['campaign', 'Campaign'], ['source', 'Source'], ['medium', 'Medium'], ['by', 'Created by'], ['template', 'Template']];
  const LSORTS = [['created', 'Newest first'], ['clicks', 'Most clicks'], ['recent', 'Most clicks · 30 days'], ['link', 'Short link A–Z']];
  const groupValue = (l, g) => g === 'by' ? l.by : g === 'template' ? templateOf(l) : (l[g] || 'Not tagged');

  // Rows for the table: lifetime totals + last-30-day slice, filtered by the shared chips and the search box.
  function linkRows() {
    const q = state.lq.trim().toLowerCase();
    const rows = Q.links.rows.map(r => {
      const last30 = r.series.slice(-30), prev30 = r.series.slice(-60, -30);
      const recent = last30.reduce((a, p) => a + p.clicks, 0), before = prev30.reduce((a, p) => a + p.clicks, 0);
      return { ...r, last30, recent, recentDelta: delta(recent, before) };
    }).filter(r => !q || [r.link.slug, r.link.dest, r.link.title, r.link.campaign, r.link.source, r.link.medium, ...r.link.tags].some(s => s && s.toLowerCase().includes(q)));
    const { key, dir } = state.lsort;
    rows.sort((a, b) => {
      let v = 0;
      if (key === 'created') v = a.link.created < b.link.created ? -1 : a.link.created > b.link.created ? 1 : 0;
      else if (key === 'link') v = a.link.slug.localeCompare(b.link.slug);
      else if (key === 'campaign') v = (a.link.campaign || 'zz').localeCompare(b.link.campaign || 'zz');
      else v = a[key] - b[key];
      return v * dir;
    });
    return rows;
  }

  function linkRowHTML(r, i) {
    const l = r.link, hasQR = l.qr > 0, on = state.sel.has(l.slug);
    const typeTip = hasQR ? `Has a QR code · ${Math.round((r.clicks ? r.qr / r.clicks : 0) * 100)}% of clicks from scans` : 'Link only · no QR code';
    const created = new Date(l.created);
    return `<div class="lrow ${on ? 'sel' : ''}" data-link="${esc(l.slug)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
      <button class="cb ${on ? 'on' : ''}" data-sel="${esc(l.slug)}" role="checkbox" aria-checked="${on}" aria-label="Select ${esc(l.slug)}">${I.check}</button>
      <div class="lk"><span class="type ${hasQR ? 'qr' : ''}" data-tip="${typeTip}">${hasQR ? I.qr : I.links}</span>
        <div class="txt"><span class="lk-name">${esc(l.slug)}${l.tags.length ? l.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('') : ''}</span><span class="lk-dest" title="${esc(l.dest)}${esc(utmQuery(l))}">${esc(l.dest)}<span class="qs">${esc(utmQuery(l))}</span></span></div></div>
      <div class="camp">${l.campaign ? `<button class="utm-chip sm" data-utm="campaign" data-val="${esc(l.campaign)}" title="Filter by this campaign">${esc(l.campaign)}</button>` : '<span class="untagged">Not tagged</span>'}<span class="sm-muted">${esc(l.source)} · ${esc(l.medium)}</span></div>
      <div class="clk"><span class="spark">${sparkline(r.last30, 'clicks')}</span><span class="n"><b class="num">${fmt.n(r.clicks)}</b><span class="sm-muted num">${r.recentDelta == null ? '<span class="d new">New</span> · all in 30d' : `${fmt.n(r.recent)} <span class="d ${r.recentDelta > 0.005 ? 'up' : r.recentDelta < -0.005 ? 'down' : ''}">${(r.recentDelta > 0 ? '+' : '') + Math.round(r.recentDelta * 100)}%</span> 30d`}</span></span></div>
      <div class="who">${avatar(l.by)}<span class="txt"><span>${fmt.d(created, { month: 'short', day: 'numeric', year: 'numeric' })}</span><span class="sm-muted">${esc(l.by)}</span></span></div>
      <div><span class="tpl">${esc(templateOf(l))}</span></div>
      <div class="acts">
        <button class="icon-btn" data-copy="https://${esc(l.slug)}" title="Copy short link">${I.copy}</button>
        <button class="icon-btn" data-row-qr="${esc(l.slug)}" title="${hasQR ? 'QR code' : 'Create QR code'}">${I.qr}</button>
        <button class="icon-btn" data-row-analytics="${esc(l.slug)}" title="Analytics">${I.analytics}</button>
        <button class="icon-btn" data-row-more="${esc(l.slug)}" title="More" aria-haspopup="menu">${I.more}</button>
      </div></div>`;
  }

  function linksTableHTML() {
    const rows = linkRows(), total = Q.links.rows.length;
    const sortBtn = (key, label, cls = '') => `<button data-lsort="${key}" class="${state.lsort.key === key ? 'on' : ''} ${state.lsort.key === key && state.lsort.dir === 1 ? 'asc' : ''} ${cls}">${label}${I.sort}</button>`;
    const allOn = rows.length && rows.every(r => state.sel.has(r.link.slug));
    const head = `<div class="lrow head" role="row"><button class="cb ${allOn ? 'on' : ''}" id="sel-all" role="checkbox" aria-checked="${allOn}" aria-label="Select all">${I.check}</button>
      <div>${sortBtn('link', 'Link')}</div><div>${sortBtn('campaign', 'Campaign')}</div><div>${sortBtn('clicks', 'Clicks')}</div><div>${sortBtn('created', 'Created')}</div><div>Template</div><div></div></div>`;
    let body;
    if (!rows.length) body = `<div class="empty" style="min-height:200px"><strong>No links match</strong>${state.lq ? 'Try a different search' : 'Try fewer filters'}, or create a new link.<div style="margin-top:10px;display:flex;gap:8px"><button class="btn" id="clear-search">Clear search &amp; filters</button><button class="btn primary" id="create-btn-empty">Create link</button></div></div>`;
    else if (state.groupBy === 'none') body = rows.map(linkRowHTML).join('');
    else {
      const groups = new Map();
      rows.forEach(r => { const g = groupValue(r.link, state.groupBy); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(r); });
      body = [...groups.entries()].sort((a, b) => b[1].reduce((x, r) => x + r.clicks, 0) - a[1].reduce((x, r) => x + r.clicks, 0)).map(([g, rs]) => {
        const open = !state.collapsed.has(g), clicks = rs.reduce((a, r) => a + r.clicks, 0);
        return `<div class="grp ${open ? 'open' : ''}"><button class="grp-h" data-group="${esc(g)}" aria-expanded="${open}"><span class="chev">${I.chevR}</span>${state.groupBy === 'by' ? avatar(g, 'xs') : ''}<span class="g">${esc(g)}</span><span class="sm-muted">${rs.length} link${rs.length === 1 ? '' : 's'} · ${fmt.n(clicks)} clicks</span></button>${open ? rs.map(linkRowHTML).join('') : ''}</div>`;
      }).join('');
    }
    return `<section class="card" id="links-table"><div class="ltable">${head}${body}</div>
      <div class="tbl-foot"><span>Showing ${rows.length} of ${total} link${total === 1 ? '' : 's'}${state.lq ? ` matching “${esc(state.lq)}”` : ''}</span><span class="grow"></span><span>Lifetime clicks · 25 per page</span></div></section>`;
  }

  function bulkBarHTML() {
    const n = state.sel.size; if (!n) return '';
    return `<div class="bulk" role="toolbar" aria-label="Selected links"><span class="cnt"><b>${n}</b> selected</span>
      <button data-bulk="copy">${I.copy}Copy links</button><button data-bulk="csv">${I.download}Export CSV</button><button data-bulk="tag">${I.tag}Add tag</button><button data-bulk="archive">${I.reset}Archive</button><button data-bulk="delete" class="danger">${I.close}Delete</button>
      <button class="x" data-bulk="clear" aria-label="Clear selection">${I.close}</button></div>`;
  }

  function linksHTML() {
    const n = Q.links.rows.length, all = Q.linksAll.rows.length;
    const g = GROUPS.find(x => x[0] === state.groupBy), s = LSORTS.find(x => x[0] === state.lsort.key);
    const nf = state.filters.length;
    return `<div class="view"><div class="page-head"><div class="title"><h1>Links</h1><span class="status" tabindex="0" data-tip="${all} links in this workspace · updated 4 min ago">${all} links</span></div>
        <div class="actions"><button class="btn" id="import-btn">${I.download}Import CSV</button><button class="btn primary" id="create-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Create link</button></div></div></div>
      <div class="toolbar links-tb"><div class="search lq">${I.search}<input id="lq" placeholder="Search links, destinations, campaigns…" value="${esc(state.lq)}" aria-label="Search links"><button class="icon-btn" id="lq-clear" aria-label="Clear search" ${state.lq ? '' : 'hidden'}>${I.close}</button></div>
        <div class="controls">
          <button class="tb-btn" id="filter-btn" aria-haspopup="menu" aria-expanded="false">${I.filter}Filter${nf ? `<span class="badge">${nf}</span>` : ''}</button>
          <button class="tb-btn" id="group-btn" aria-haspopup="menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h6"/></svg>${state.groupBy === 'none' ? 'Group' : g[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn icon" id="links-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button></div></div>
      ${chipsHTML()}${linksTableHTML()}${bulkBarHTML()}`;
  }

  function groupMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:200px"><div class="group">Group by</div>${GROUPS.map(([k, l]) => `<button class="mi ${state.groupBy === k ? 'on' : ''}" data-g="${k}"><span class="check">${I.check}</span><span class="grow">${l}</span></button>`).join('')}</div>`, {
      onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; state.groupBy = b.dataset.g; state.collapsed.clear(); closePop(); render(); }); },
    });
  }
  function lsortMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:220px"><div class="group">Sort by</div>${LSORTS.map(([k, l]) => `<button class="mi ${state.lsort.key === k ? 'on' : ''}" data-s="${k}"><span class="check">${I.check}</span><span class="grow">${l}</span></button>`).join('')}</div>`, {
      onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const k = b.dataset.s; state.lsort = { key: k, dir: k === 'link' ? 1 : -1 }; closePop(); render(); }); },
    });
  }
  function linksMoreMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:230px">
      <button class="mi" data-act="links-csv">${I.download}<span class="grow">Export all as CSV</span></button>
      <button class="mi" data-act="columns">${I.sliders}<span class="grow">Columns…</span></button>
      <div class="sep"></div>
      <button class="mi" data-act="archived">${I.reset}<span class="grow">Show archived links</span></button>
      <button class="mi" data-act="about">${I.info}<span class="grow">Tips &amp; shortcuts</span></button></div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; closePop(); action(b.dataset.act); }); } });
  }
  function rowMenu(anchor, slug) {
    const l = D.LINKS.find(x => x.slug === slug);
    openPop(anchor, `<div class="menu" style="width:220px"><div class="group" style="font-family:var(--font-mono);text-transform:none;letter-spacing:0">${esc(slug)}</div>
      <button class="mi" data-r="analytics">${I.analytics}<span class="grow">View analytics</span></button>
      <button class="mi" data-r="edit">${I.edit}<span class="grow">Edit link</span></button>
      <button class="mi" data-r="copy-dest">${I.copy}<span class="grow">Copy destination URL</span></button>
      <button class="mi" data-r="open">${I.external}<span class="grow">Open destination</span></button>
      <div class="sep"></div>
      <button class="mi" data-r="dup"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg><span class="grow">Duplicate</span></button>
      <button class="mi" data-r="archive">${I.reset}<span class="grow">Archive</span></button>
      <button class="mi danger" data-r="delete">${I.close}<span class="grow">Delete</span></button></div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; closePop(); const r = b.dataset.r;
          if (r === 'analytics') goLink(slug); else if (r === 'copy-dest') copyText(`https://${l.dest}${utmQuery(l)}`, 'Destination copied'); else if (r === 'open') toast(`Would open ${l.dest} in a new tab`);
          else if (r === 'delete') confirmDelete([slug]); else toast(`${b.textContent.trim()} is outside this prototype`); });
      } });
  }
  function confirmDelete(slugs) {
    openModal(`<div class="modal-h"><h3>Delete ${slugs.length === 1 ? 'this link' : `${slugs.length} links`}?</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>${slugs.length === 1 ? `<b>${esc(slugs[0])}</b> will stop redirecting` : 'These links will stop redirecting'} and their click history will be removed from Analytics. This can't be undone.</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary danger" id="del-ok">Delete</button></div></div>`, { width: 440, onMount(s) {
        $('#del-ok', s).addEventListener('click', () => { closeModal(); state.sel.clear(); toast(`Deleted ${slugs.length} link${slugs.length === 1 ? '' : 's'} (prototype only — data is unchanged)`); render(); });
      } });
  }
  function bulk(act) {
    const slugs = [...state.sel];
    if (act === 'clear') { state.sel.clear(); render(); return; }
    if (act === 'copy') { copyText(slugs.map(s => 'https://' + s).join('\n'), `Copied ${slugs.length} links`); return; }
    if (act === 'csv') { toast(`Exported ${slugs.length} links as CSV`); return; }
    if (act === 'delete') { confirmDelete(slugs); return; }
    toast(`${act === 'tag' ? 'Add tag' : 'Archive'} is outside this prototype`);
  }
  function goLinks(opts = {}) { state.view = 'links'; state.slug = null; if (!opts.keepFilters) { state.filters = []; } state.sel.clear(); render({ top: true }); }

  /* ---------- Render + post-render effects ---------- */
  const prevCounts = {};
  function render(opts = {}) {
    closePop();
    compute();
    const view = $('#view');
    const y = window.scrollY;
    if (opts.busy) { view.classList.add('busy'); setTimeout(() => view.classList.remove('busy'), 500); }
    view.innerHTML = state.view === 'link' ? linkHTML() : state.view === 'links' ? linksHTML() : overviewHTML();
    if (opts.top) window.scrollTo({ top: 0, behavior: 'instant' }); else window.scrollTo(0, y);
    requestAnimationFrame(() => {
      $$('[data-w]', view).forEach(el => { el.style.width = el.dataset.w + '%'; });
      $$('[data-count]', view).forEach(el => {
        const key = el.closest('[data-metric]')?.dataset.metric; const to = +el.dataset.count; const from = prevCounts[key];
        prevCounts[key] = to;
        if (from == null || from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const t0 = performance.now(), dur = 450;
        const step = now => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); el.textContent = fmt.n(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      drawChart();
    });
    const section = state.view === 'links' || (state.view === 'link' && state.from === 'links') ? 'links' : 'analytics';
    $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === section));
    $('#topbar-title').textContent = state.view === 'link' ? state.slug : state.view === 'links' ? 'Links' : 'Acme Marketing';
    try { location.hash = state.view === 'link' ? 'link-' + state.slug.replace(/[^a-z0-9]+/gi, '-') : state.view; } catch (e) { /* ignore */ }
  }
  window.addEventListener('resize', (() => { let t; return () => { clearTimeout(t); t = setTimeout(drawChart, 120); }; })());

  /* ---------- Popover manager ---------- */
  const layer = $('#layer');
  let pop = null;
  function openPop(anchor, html, opts = {}) {
    closePop();
    const el = document.createElement('div'); el.className = 'popover' + (opts.align === 'right' ? ' left' : ''); el.innerHTML = html; el.setAttribute('role', opts.role || 'menu');
    layer.appendChild(el);
    const r = anchor.getBoundingClientRect(); const sx = window.scrollX, sy = window.scrollY;
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = opts.align === 'right' ? r.right - w : r.left; left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.bottom + 6; if (top + h > window.innerHeight - 8 && r.top - h - 6 > 8) { top = r.top - h - 6; el.style.transformOrigin = 'bottom'; }
    el.style.left = left + sx + 'px'; el.style.top = top + sy + 'px';
    anchor.setAttribute('aria-expanded', 'true');
    pop = { el, anchor, onClose: opts.onClose };
    if (opts.onMount) opts.onMount(el);
    const first = $('input', el); if (first) setTimeout(() => first.focus(), 30);
    return el;
  }
  function closePop() { if (!pop) return; pop.anchor.setAttribute('aria-expanded', 'false'); pop.el.remove(); if (pop.onClose) pop.onClose(); pop = null; }
  document.addEventListener('mousedown', e => { if (pop && !pop.el.contains(e.target) && !pop.anchor.contains(e.target)) closePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (pop) closePop(); else closeModal(); } });

  /* ---------- Filter menu ---------- */
  function filterMenu(anchor) {
    const groups = [...new Set(D.DIMS.map(d => d.group))];
    const icon = { link: I.links, trigger: I.trigger, campaign: I.tag, source: I.tag, medium: I.tag, content: I.tag, term: I.tag, referrer: I.referrer, country: I.globe, region: I.globe, city: I.globe, device: I.device, browser: I.device, os: I.device };
    const render = q => {
      const ql = q.toLowerCase();
      return groups.map(g => {
        const dims = D.DIMS.filter(d => d.group === g && (!ql || d.label.toLowerCase().includes(ql) || (d.utm || '').includes(ql)));
        if (!dims.length) return '';
        return `<div class="group">${esc(g)}</div>` + dims.map(d => { const active = state.filters.some(f => f.dim === d.key); return `<button class="mi ${active ? 'on' : ''}" data-dim="${d.key}">${icon[d.key]}<span class="grow">${esc(d.label)}</span>${d.utm ? `<span class="utm">${d.utm}</span>` : ''}${active ? `<span class="check">${I.check.replace('<svg', '<svg style="width:14px;height:14px"')}</span>` : ''}<span class="chev">${I.chevR}</span></button>`; }).join('');
      }).join('') || '<div class="group" style="padding:14px 10px">No matching dimensions</div>';
    };
    openPop(anchor, `<div class="search">${I.search}<input id="dim-q" placeholder="Filter by…" aria-label="Search dimensions"></div><div class="menu" id="dim-list" style="max-height:380px;overflow-y:auto;width:280px">${render('')}</div>`, {
      onMount(el) {
        const list = $('#dim-list', el), q = $('#dim-q', el);
        q.addEventListener('input', () => { list.innerHTML = render(q.value); });
        q.addEventListener('keydown', e => { if (e.key === 'Enter') { const b = $('.mi', list); if (b) b.click(); } });
        list.addEventListener('click', e => { const b = e.target.closest('[data-dim]'); if (b) valuePicker(anchor, b.dataset.dim, state.filters.findIndex(f => f.dim === b.dataset.dim), true); });
      },
    });
  }

  function valuePicker(anchor, dim, editIndex = -1, fromMenu = false) {
    const d = D.DIM[dim];
    const existing = editIndex > -1 ? state.filters[editIndex] : null;
    let op = existing ? existing.op : 'is';
    const sel = new Set(existing ? existing.values : []);
    const ctx = { range: state.view === 'links' ? ALL_RANGE : state.range, trigger: state.trigger, filters: state.view === 'link' ? [...state.filters, { dim: 'link', op: 'is', values: [state.slug] }] : state.filters };
    const values = dim === 'trigger' ? [{ label: 'Link click', value: Q.unfiltered.totals.linkClicks, share: 0 }, { label: 'QR scan', value: Q.unfiltered.totals.qr, share: 0 }] : D.valuesFor(dim, ctx);
    const list = q => {
      const ql = q.toLowerCase();
      const vs = values.filter(v => !ql || v.label.toLowerCase().includes(ql) || (dim === 'country' && D.COUNTRIES[v.label] && D.COUNTRIES[v.label].name.toLowerCase().includes(ql)));
      if (!vs.length) return `<div class="group" style="padding:14px 10px">No values match “${esc(q)}”</div>`;
      return vs.map(v => {
        let label = dim === 'country' ? countrySpan(v.label) : esc(v.label);
        if (ql && dim !== 'country') label = label.replace(new RegExp(`(${ql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<mark>$1</mark>');
        return `<label class="val ${sel.has(v.label) ? 'on' : ''}" data-v="${esc(v.label)}"><span class="box">${I.check}</span><span class="lbl">${label}</span><span class="cnt num">${fmt.n(v.value)}</span></label>`;
      }).join('');
    };
    const html = `<div class="pop-head">${fromMenu ? `<button class="back" id="vp-back" aria-label="Back">${I.arrowL}</button>` : ''}<span>${esc(d.label)}</span><span class="op-toggle" style="margin-left:auto"><button data-op="is" class="${op === 'is' ? 'on' : ''}">is</button><button data-op="is not" class="${op === 'is not' ? 'on' : ''}">is not</button></span></div>
      <div class="search">${I.search}<input id="vp-q" placeholder="Search ${esc(d.label.toLowerCase())}…" aria-label="Search values"></div>
      <div class="vals" id="vp-list" style="width:320px">${list('')}</div>
      <div class="pop-foot"><span class="grow" id="vp-count">${sel.size ? `${sel.size} selected` : 'Applies to this dashboard and the Links table'}</span><button class="btn ghost" id="vp-cancel">Cancel</button><button class="btn primary" id="vp-apply" ${sel.size ? '' : 'disabled'}>${existing ? 'Update' : 'Apply'} filter</button></div>`;
    openPop(anchor, html, {
      role: 'dialog',
      onMount(el) {
        const listEl = $('#vp-list', el), q = $('#vp-q', el), apply = $('#vp-apply', el), count = $('#vp-count', el);
        const sync = () => { apply.disabled = !sel.size; count.textContent = sel.size ? `${sel.size} selected` : 'Applies to this dashboard and the Links table'; };
        q.addEventListener('input', () => { listEl.innerHTML = list(q.value); });
        q.addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $('.val', listEl); if (first && !sel.size) { first.click(); } else if (sel.size) apply.click(); } });
        listEl.addEventListener('click', e => { const l = e.target.closest('.val'); if (!l) return; const v = l.dataset.v; if (sel.has(v)) sel.delete(v); else sel.add(v); l.classList.toggle('on', sel.has(v)); sync(); });
        $$('[data-op]', el).forEach(b => b.addEventListener('click', () => { op = b.dataset.op; $$('[data-op]', el).forEach(x => x.classList.toggle('on', x === b)); }));
        $('#vp-cancel', el).addEventListener('click', closePop);
        const back = $('#vp-back', el); if (back) back.addEventListener('click', () => filterMenu(anchor));
        apply.addEventListener('click', () => {
          const f = { dim, op, values: [...sel] };
          if (editIndex > -1) state.filters[editIndex] = f; else state.filters.push(f);
          closePop(); render({ busy: true }); toast(`${existing ? 'Updated' : 'Added'} filter: ${d.label} ${op} ${[...sel].slice(0, 2).join(', ')}${sel.size > 2 ? ` +${sel.size - 2}` : ''}`);
        });
      },
    });
  }

  /* ---------- Date picker ---------- */
  function datePicker(anchor) {
    let start = state.range.start, end = state.range.end, preset = state.preset, compare = state.compare, picking = null, hover = null;
    let view = new Date(end.getFullYear(), end.getMonth() - 1, 1);
    const dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const calHTML = (m) => {
      const first = new Date(m.getFullYear(), m.getMonth(), 1), startDow = first.getDay(), days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      let cells = '';
      for (let i = 0; i < startDow; i++) cells += '<span class="d muted"></span>';
      for (let d = 1; d <= days; d++) {
        const date = new Date(m.getFullYear(), m.getMonth(), d), t = +date;
        const s = D.stripTime(start), e = D.stripTime(end);
        const cls = ['d'];
        if (t > +T) cls.push('future');
        if (t === +T) cls.push('today');
        if (!picking) { if (t === +s) cls.push('start'); if (t === +e) cls.push('end'); if (t > +s && t < +e) cls.push('in'); }
        else { if (t === +picking) cls.push('start'); if (hover) { const a = Math.min(+picking, +hover), b = Math.max(+picking, +hover); if (t > a && t < b) cls.push('hover-in'); if (t === b && b !== +picking) cls.push('hover-end'); if (t === a && a !== +picking) cls.push('start'); } }
        cells += `<button class="${cls.join(' ')}" data-date="${t}" ${t > +T ? 'disabled' : ''}><span>${d}</span></button>`;
      }
      return `<div class="cal"><div class="cal-h"><span>${m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div><div class="dow">${dows.map(d => `<span>${d}</span>`).join('')}</div><div class="days">${cells}</div></div>`;
    };
    const body = () => {
      const m2 = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      const rangeTxt = picking ? `Pick an end date` : `<b>${esc(fmt.range({ start, end }))}</b> · ${Math.round((D.stripTime(end) - D.stripTime(start)) / 864e5) + 1} days${compare ? ` · vs ${esc(fmt.range(D.priorRange({ start, end })))}` : ''}`;
      return `<div class="datepick"><div class="presets">${PRESETS.map(p => `<button class="mi ${preset === p.id ? 'on' : ''}" data-preset="${p.id}" ${p.pro ? 'disabled style="opacity:.6;cursor:not-allowed"' : ''}><span class="grow">${esc(p.label)}</span>${p.pro ? '<span class="pro">PRO</span>' : `<span class="kbd">${p.kbd}</span>`}</button>`).join('')}<div class="sep"></div><button class="mi ${preset === 'custom' ? 'on' : ''}" data-preset="custom"><span class="grow">Custom range</span><span class="kbd">C</span></button></div>
        <div><div class="cal-wrap" id="cals" style="position:relative"><button class="nav-b" id="cal-prev" style="position:absolute;left:14px;top:12px" aria-label="Previous month">${I.chevL}</button><button class="nav-b" id="cal-next" style="position:absolute;right:14px;top:12px" aria-label="Next month">${I.chevR}</button>${calHTML(view)}${calHTML(m2)}</div>
        <div class="date-foot"><span class="range-txt" id="range-txt">${rangeTxt}</span><label class="switch ${compare ? 'on' : ''}" id="cmp"><i></i>Compare prior period</label><button class="btn primary" id="date-apply" ${picking ? 'disabled' : ''}>Apply</button></div></div></div>`;
    };
    const el = openPop(anchor, body(), { align: 'right', role: 'dialog' });
    const rerender = () => { el.innerHTML = body(); bind(); };
    const bind = () => {
      $$('[data-preset]', el).forEach(b => b.addEventListener('click', () => { const p = PRESETS.find(x => x.id === b.dataset.preset); if (b.dataset.preset === 'custom') { preset = 'custom'; picking = null; rerender(); return; } if (!p || p.pro) { toast('Longer ranges are on the Pro plan'); return; } preset = p.id; ({ start, end } = p.get()); picking = null; view = new Date(end.getFullYear(), end.getMonth() - 1, 1); rerender(); }));
      $('#cal-prev', el).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); rerender(); });
      $('#cal-next', el).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); rerender(); });
      const cals = $('#cals', el);
      cals.addEventListener('click', e => { const b = e.target.closest('[data-date]'); if (!b || b.disabled) return; const t = new Date(+b.dataset.date);
        if (!picking) { picking = t; hover = null; preset = 'custom'; } else { start = new Date(Math.min(+picking, +t)); end = new Date(Math.max(+picking, +t)); picking = null; }
        rerender(); });
      cals.addEventListener('mouseover', e => { const b = e.target.closest('[data-date]'); if (!b || !picking) return; hover = new Date(+b.dataset.date); $$('.d', cals).forEach(x => { x.classList.remove('hover-in', 'hover-end'); const t = +x.dataset.date; const a = Math.min(+picking, +hover), bb = Math.max(+picking, +hover); if (t > a && t < bb) x.classList.add('hover-in'); if (t === bb && bb !== +picking) x.classList.add('hover-end'); }); });
      $('#cmp', el).addEventListener('click', () => { compare = !compare; rerender(); });
      $('#date-apply', el).addEventListener('click', () => { state.range = { start, end }; state.preset = preset; state.compare = compare; closePop(); render({ busy: true }); });
      el.addEventListener('keydown', e => { const p = PRESETS.find(x => x.kbd && x.kbd.toLowerCase() === e.key.toLowerCase() && !x.pro); if (p && e.target.tagName !== 'INPUT') { preset = p.id; ({ start, end } = p.get()); picking = null; rerender(); } if (e.key === 'Enter' && !picking) $('#date-apply', el).click(); });
    };
    bind(); el.tabIndex = -1; el.focus();
  }

  /* ---------- Kebab + interval menus ---------- */
  function moreMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:240px">
      <button class="mi" data-act="csv">${I.download}<span class="grow">Export CSV</span></button>
      <button class="mi" data-act="copy-link">${I.copy}<span class="grow">Copy link to this view</span></button>
      <div class="sep"></div>
      <button class="mi" data-act="reset">${I.reset}<span class="grow">Reset prototype</span></button>
      <button class="mi" data-act="about">${I.info}<span class="grow">Tips &amp; shortcuts</span></button></div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; closePop(); action(b.dataset.act); }); } });
  }
  function intervalMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:140px">${['day', 'week'].map(k => `<button class="mi ${state.interval === k ? 'on' : ''}" data-int="${k}"><span class="check">${I.check}</span><span class="grow">${k === 'day' ? 'Day' : 'Week'}</span></button>`).join('')}</div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-int]'); if (b) { state.interval = b.dataset.int; closePop(); render(); } }); } });
  }
  function action(act) {
    switch (act) {
      case 'csv': exportCSV(); break;
      case 'copy-link': copyText(location.href, 'Link copied'); break;
      case 'reset': Object.assign(state, { view: 'overview', slug: null, preset: 'month', range: PRESETS[4].get(), compare: true, trigger: 'all', filters: [], metric: 'clicks', interval: 'day', sort: { key: 'clicks', dir: -1 }, showAll: false, tabs: { utm: 'campaign', loc: 'map', dev: 'device', ref: 'referrer' } }); render({ busy: true, top: true }); toast('Prototype reset'); break;
      case 'about': tipsModal(); break;
      case 'links-csv': toast(`Exported ${Q.links ? Q.links.rows.length : D.LINKS.length} links as CSV`); break;
      case 'columns': case 'archived': toast(`${act === 'columns' ? 'Column settings' : 'Archived links'} are outside this prototype`); break;
    }
  }
  function exportCSV() {
    const rows = Q.cur.rows.map(r => [r.link.slug, r.link.dest, Math.round(r.clicks), Math.round(r.unique), Math.round(r.linkClicks), Math.round(r.qr)]);
    const csv = [['short_link', 'destination', 'clicks', 'unique', 'link_clicks', 'qr_scans'], ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `utm-analytics-${state.preset}.csv`; a.click(); } catch (e) { /* sandboxed */ }
    toast(`Exported ${rows.length} links as CSV`);
  }
  function copyText(text, msg) {
    const done = () => toast(msg || 'Copied');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
  }

  /* ---------- Modals ---------- */
  function openModal(html, opts = {}) {
    closeModal();
    const s = document.createElement('div'); s.className = 'scrim'; s.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="${opts.width ? `width:min(${opts.width}px,100%)` : ''}">${html}</div>`;
    s.addEventListener('mousedown', e => { if (e.target === s) closeModal(); });
    layer.appendChild(s); $$('.close', s).forEach(b => b.addEventListener('click', closeModal));
    if (opts.onMount) opts.onMount(s);
    return s;
  }
  function closeModal() { const s = $('.scrim', layer); if (s) s.remove(); }
  function expandModal(id) {
    const dim = state.tabs[id]; const d = D.DIM[dim]; const items = Q.cur.breakdown(dim);
    const list = q => rowsHTML(items.filter(i => !q || i.label.toLowerCase().includes(q.toLowerCase()) || (dim === 'country' && D.COUNTRIES[i.label] && D.COUNTRIES[i.label].name.toLowerCase().includes(q.toLowerCase()))), { dim, bar: CARD_BARS[id], limit: 500 });
    openModal(`<div class="modal-h"><h3>${esc(d.label)}<span class="sub">${items.length} values · ${esc(rangeLabel())}</span></h3><div class="search" style="margin:0;width:220px">${I.search}<input id="exp-q" placeholder="Search…"></div><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="cols"><span>${esc(d.label)}</span><span class="r">Clicks</span><span class="r">%</span></div><div class="rows" id="exp-rows">${list('')}</div></div>`, {
      onMount(s) { const q = $('#exp-q', s), rows = $('#exp-rows', s); const grow = () => requestAnimationFrame(() => $$('[data-w]', rows).forEach(el => el.style.width = el.dataset.w + '%')); grow(); q.addEventListener('input', () => { rows.innerHTML = list(q.value); grow(); }); setTimeout(() => q.focus(), 50);
        rows.addEventListener('click', e => { const r = e.target.closest('.row'); if (r) { closeModal(); toggleFilter(r.dataset.dim, r.dataset.val); } }); },
    });
  }
  function qrModal(link) {
    openModal(`<div class="modal-h"><h3>QR code<span class="sub">${esc(link.slug)}</span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="qr-box"><canvas id="qr-canvas" width="33" height="33" aria-label="QR code preview"></canvas>
      <dl><dt>Short link</dt><dd>${esc(link.slug)}</dd><dt>Scans this range</dt><dd class="num">${fmt.full(Q.cur.totals.qr)}</dd><dt>Share of clicks</dt><dd class="num">${fmt.pct(Q.cur.totals.clicks ? Q.cur.totals.qr / Q.cur.totals.clicks : 0)}</dd><dt>Style</dt><dd>Default · black on white</dd><dt>Error correction</dt><dd>M (15%)</dd></dl>
      <div class="actions"><button class="btn primary" id="qr-dl">${I.download}Download PNG</button><button class="btn" id="qr-svg">${I.download}Download SVG</button><button class="btn ghost" id="qr-edit">${I.edit}Customise</button></div></div></div>`, {
      width: 560,
      onMount(s) {
        // Decorative QR-like pattern (not a real encoding) so the modal reads right.
        const c = $('#qr-canvas', s), ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 33, 33); ctx.fillStyle = '#111827';
        let seed = 7; for (const ch of link.slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
        const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        const finder = (x, y) => { ctx.fillRect(x, y, 7, 7); ctx.fillStyle = '#fff'; ctx.fillRect(x + 1, y + 1, 5, 5); ctx.fillStyle = '#111827'; ctx.fillRect(x + 2, y + 2, 3, 3); };
        for (let yy = 0; yy < 33; yy++) for (let xx = 0; xx < 33; xx++) { const inF = (xx < 8 && yy < 8) || (xx > 24 && yy < 8) || (xx < 8 && yy > 24); if (!inF && r() < .45) ctx.fillRect(xx, yy, 1, 1); }
        finder(0, 0); finder(26, 0); finder(0, 26);
        $('#qr-dl', s).addEventListener('click', () => toast('QR code PNG downloaded')); $('#qr-svg', s).addEventListener('click', () => toast('QR code SVG downloaded')); $('#qr-edit', s).addEventListener('click', () => toast('QR customisation lives in the QR codes section'));
      },
    });
  }
  function tipsModal() {
    openModal(`<div class="modal-h"><h3>Tips &amp; shortcuts</h3><button class="close" aria-label="Close">${I.close}</button></div><div class="modal-b about">
      <h4>What the numbers mean</h4><ul>
      <li><b>Clicks</b> are visits through your short links. Suspected bots are left out.</li>
      <li><b>Unique clicks</b> count each person once per calendar month, so they're most accurate for <i>This month</i> or <i>Last month</i>.</li>
      <li><b>QR</b> counts scans of your QR codes. <b>Links</b> counts everything else.</li>
      <li>Times are in UTC. Today's numbers are still coming in, so the chart shows today as a dotted line.</li></ul>
      <h4>Narrow it down</h4><ul>
      <li>Use <b>All / Links / QR</b> to see only link clicks or only QR scans.</li>
      <li>Click any row in a card (a campaign, a country, a device) to filter the whole page by it. Click it again to remove the filter.</li>
      <li><b>Filter</b> lets you pick any detail, choose <i>is</i> or <i>is not</i>, and select several values at once. Click a filter chip to change it.</li></ul>
      <h4>Compare and dig in</h4><ul>
      <li>Turn on <b>Compare</b> in the date menu to see the previous period as a dashed line and a % change on every number.</li>
      <li>Click a tile at the top (Total, Unique…) to switch what the chart shows. Hover the chart for exact numbers.</li>
      <li>Click a link in <b>Top links</b> to see its own report, UTM tags and QR code.</li>
      <li>Use ↗ on a card to see the full list with search.</li></ul>
      <h4>Links page</h4><ul>
      <li>Search, Filter and Group by work together. Click a row to open that link's analytics; hover a row for copy, QR and more.</li>
      <li>Tick links to copy, export, tag or delete them in one go.</li></ul>
      <h4>Keyboard shortcuts</h4><p>With the date menu open: <kbd>D</kbd> Today · <kbd>E</kbd> Yesterday · <kbd>W</kbd> Last 7 days · <kbd>T</kbd> Last 30 days · <kbd>M</kbd> This month · <kbd>L</kbd> Last month · <kbd>Q</kbd> Last 90 days. <kbd>Esc</kbd> closes any menu.</p></div>`, { width: 560 });
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    const w = $('#toasts'); const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `${I.check}${esc(msg)}`; w.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 220); }, 2200);
  }

  /* ---------- Filters ---------- */
  function toggleFilter(dim, val) {
    const i = state.filters.findIndex(f => f.dim === dim && f.op === 'is');
    if (i > -1 && state.filters[i].values.length === 1 && state.filters[i].values[0] === val) { state.filters.splice(i, 1); render({ busy: true }); toast(`Removed filter: ${D.DIM[dim].label}`); return; }
    if (i > -1) state.filters[i] = { dim, op: 'is', values: [val] }; else state.filters.push({ dim, op: 'is', values: [val] });
    render({ busy: true }); toast(`Filtered: ${D.DIM[dim].label} is ${val}`);
  }
  function goLink(slug) { if (state.view !== 'link') state.from = state.view; state.view = 'link'; state.slug = slug; render({ top: true }); }
  function goOverview() { state.view = 'overview'; state.slug = null; render({ top: true }); }
  function goBack() { if (state.from === 'links') goLinks({ keepFilters: true }); else goOverview(); }

  /* ---------- Global event delegation ---------- */
  $('#view').addEventListener('click', e => {
    const t = e.target;
    const hit = s => t.closest(s);
    let el;
    if ((el = hit('[data-trigger]'))) { state.trigger = el.dataset.trigger; render({ busy: true }); return; }
    if (hit('#filter-btn')) { filterMenu(hit('#filter-btn')); return; }
    if (hit('#date-btn')) { datePicker(hit('#date-btn')); return; }
    if (hit('#more-btn')) { moreMenu(hit('#more-btn')); return; }
    if (hit('#interval-btn')) { intervalMenu(hit('#interval-btn')); return; }
    if (hit('#csv-btn')) { exportCSV(); return; }
    if ((el = hit('[data-remove-filter]'))) { const f = state.filters.splice(+el.dataset.removeFilter, 1)[0]; render({ busy: true }); toast(`Removed filter: ${D.DIM[f.dim].label}`); return; }
    if ((el = hit('[data-edit-filter]'))) { const i = +el.dataset.editFilter; valuePicker(el.closest('.chip'), state.filters[i].dim, i); return; }
    if (hit('#clear-filters')) { state.filters = []; render({ busy: true }); toast('Filters cleared'); return; }
    if ((el = hit('[data-metric]'))) { state.metric = el.dataset.metric; $$('[data-metric]').forEach(k => { k.classList.toggle('on', k === el); k.setAttribute('aria-selected', k === el); }); drawChart(); return; }
    if ((el = hit('[data-sort]'))) { const k = el.dataset.sort; if (state.sort.key === k) state.sort.dir *= -1; else state.sort = { key: k, dir: k === 'link' ? 1 : -1 }; swapSection($('#top-links'), tableHTML()); return; }
    if (hit('#show-all')) { state.showAll = !state.showAll; swapSection($('#top-links'), tableHTML()); return; }
    if (hit('#open-links')) { e.preventDefault(); goLinks({ keepFilters: true }); return; }
    if ((el = hit('[data-utm]'))) { toggleFilter(el.dataset.utm, el.dataset.val); return; }
    if ((el = hit('[data-copy]'))) { copyText(el.dataset.copy, 'Copied to clipboard'); return; }
    // Links page
    if (hit('#create-btn') || hit('#create-btn-empty')) { toast('Create link opens the link builder (outside this prototype)'); return; }
    if (hit('#import-btn')) { toast('Import links via CSV is outside this prototype'); return; }
    if (hit('#group-btn')) { groupMenu(hit('#group-btn')); return; }
    if (hit('#lsort-btn')) { lsortMenu(hit('#lsort-btn')); return; }
    if (hit('#links-more')) { linksMoreMenu(hit('#links-more')); return; }
    if (hit('#lq-clear') || hit('#clear-search')) { state.lq = ''; if (hit('#clear-search')) state.filters = []; render(); return; }
    if ((el = hit('[data-lsort]'))) { const k = el.dataset.lsort; if (state.lsort.key === k) state.lsort.dir *= -1; else state.lsort = { key: k, dir: k === 'link' || k === 'campaign' ? 1 : -1 }; swapSection($('#links-table'), linksTableHTML()); return; }
    if ((el = hit('[data-sel]'))) { const sl = el.dataset.sel; if (state.sel.has(sl)) state.sel.delete(sl); else state.sel.add(sl); refreshSelection(); return; }
    if (hit('#sel-all')) { const rows = linkRows(); const all = rows.every(r => state.sel.has(r.link.slug)); rows.forEach(r => all ? state.sel.delete(r.link.slug) : state.sel.add(r.link.slug)); refreshSelection(); return; }
    if ((el = hit('[data-group]'))) { const g = el.dataset.group; if (state.collapsed.has(g)) state.collapsed.delete(g); else state.collapsed.add(g); swapSection($('#links-table'), linksTableHTML()); return; }
    if ((el = hit('[data-bulk]'))) { bulk(el.dataset.bulk); return; }
    if ((el = hit('[data-row-qr]'))) { qrModal(D.LINKS.find(l => l.slug === el.dataset.rowQr)); return; }
    if ((el = hit('[data-row-analytics]'))) { goLink(el.dataset.rowAnalytics); return; }
    if ((el = hit('[data-row-more]'))) { rowMenu(el, el.dataset.rowMore); return; }
    if ((el = hit('[data-link]'))) { goLink(el.dataset.link); return; }
    if ((el = hit('[data-tab]'))) { const cardEl = el.closest('[data-card]'); const id = cardEl.dataset.card; if (state.tabs[id] === el.dataset.tab) return; state.tabs[id] = el.dataset.tab; swapSection(cardEl, cardFor(id)); return; }
    if ((el = hit('[data-expand]'))) { expandModal(el.dataset.expand); return; }
    if ((el = hit('[data-country]'))) { if (+el.dataset.val > 0) toggleFilter('country', el.dataset.country); return; }
    if ((el = hit('.row[data-dim]'))) { toggleFilter(el.dataset.dim, el.dataset.val); return; }
    if (hit('#back')) { e.preventDefault(); goBack(); return; }
    if (hit('#qr-btn')) { qrModal(D.LINKS.find(l => l.slug === state.slug)); return; }
    if (hit('#edit-btn')) { toast('Edit link opens the link settings (not in this prototype)'); return; }
  });
  $('#view').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.row, .trow.data, .lrow')) { e.preventDefault(); e.target.click(); } });
  // Links search: redraw only the table, keep the caret where it is
  $('#view').addEventListener('input', (() => { let t; return e => { if (e.target.id !== 'lq') return; state.lq = e.target.value; const c = $('#lq-clear'); if (c) c.hidden = !state.lq; clearTimeout(t); t = setTimeout(() => swapSection($('#links-table'), linksTableHTML()), 120); }; })());
  // Selection: update checkboxes + bulk bar in place, no re-render
  function refreshSelection() {
    $$('.lrow[data-link]').forEach(r => { const on = state.sel.has(r.dataset.link); r.classList.toggle('sel', on); const cb = $('.cb', r); cb.classList.toggle('on', on); cb.setAttribute('aria-checked', on); });
    const rows = linkRows(), all = rows.length && rows.every(r => state.sel.has(r.link.slug)); const sa = $('#sel-all'); if (sa) { sa.classList.toggle('on', all); sa.setAttribute('aria-checked', all); }
    const old = $('.bulk'); const html = bulkBarHTML();
    if (old && !html) old.remove(); else if (!old && html) $('#view').insertAdjacentHTML('beforeend', html); else if (old) old.querySelector('.cnt b').textContent = state.sel.size;
  }

  // Map hover tooltip
  $('#view').addEventListener('mousemove', e => {
    const p = e.target.closest && e.target.closest('[data-country]'); const map = $('#map'); if (!map) return; const tip = $('#map-tip');
    if (!p) { tip.classList.remove('show'); return; }
    const c = D.COUNTRIES[p.dataset.country]; const r = map.getBoundingClientRect();
    tip.innerHTML = `<div><b>${c.flag} ${esc(c.name)}</b></div><div class="row-t"><span class="m">Clicks</span><b class="num">${fmt.full(+p.dataset.val)}</b></div><div class="row-t"><span class="m">Share</span><span class="num">${fmt.pct(+p.dataset.share)}</span></div>`;
    tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top - 4) + 'px'; tip.classList.add('show');
  });

  /* ---------- Shell ---------- */
  const NAV = [['links', 'Links'], ['qr', 'QR codes'], ['analytics', 'Analytics'], ['templates', 'Templates'], ['parameters', 'Parameters'], ['attributes', 'Attributes'], ['shorteners', 'Link shorteners'], ['rules', 'Rules'], ['members', 'Workspace members'], ['support', 'Support']];
  $('#nav').innerHTML = NAV.map(([k, l]) => `<a href="#" data-nav="${k}" class="${k === 'analytics' ? 'active' : ''}" title="${l}">${I[k]}<span class="nav-label">${l}</span></a>`).join('');
  $('#nav').addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); if (a.dataset.nav === 'analytics') goOverview(); else if (a.dataset.nav === 'links') goLinks(); else toast(`${a.title} is outside this prototype`); });
  $('#collapse-btn').addEventListener('click', () => { const c = $('#shell').classList.toggle('collapsed'); try { localStorage.setItem('utm-sidebar', c ? '1' : ''); } catch (e) { /* ignore */ } setTimeout(drawChart, 420); });
  try { if (localStorage.getItem('utm-sidebar') === '1') $('#shell').classList.add('collapsed'); } catch (e) { /* ignore */ }
  const topMenu = (btn, items) => openPop(btn, `<div class="menu" style="width:220px">${items.map(i => i === '-' ? '<div class="sep"></div>' : `<button class="mi"><span class="grow">${i}</span></button>`).join('')}</div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('.mi'); if (b) { closePop(); toast(`${b.textContent.trim()} is outside this prototype`); } }); } });
  $('#manage-btn').addEventListener('click', e => topMenu(e.currentTarget, ['Workspace settings', 'Billing', 'Integrations', '-', 'Audit log']));
  $('#user-btn').addEventListener('click', e => topMenu(e.currentTarget, ['Profile', 'Notifications', '-', 'Sign out']));
  $('#ws').addEventListener('click', e => openPop(e.currentTarget, `<div class="menu" style="width:240px"><div class="group">Workspaces</div><button class="mi on"><span class="check">${I.check}</span><span class="grow">Acme Marketing</span></button><button class="mi"><span class="check"></span><span class="grow">Acme EMEA</span></button><button class="mi"><span class="check"></span><span class="grow">Coffey &amp; Sons</span></button><div class="sep"></div><button class="mi"><span class="grow">Create workspace…</span></button></div>`, { onMount(el) { el.addEventListener('click', ev => { const b = ev.target.closest('.mi'); if (b) { closePop(); toast('Workspace switching is outside this prototype'); } }); } }));
  // Mobile drawer
  const setDrawer = open => { $('#shell').classList.toggle('drawer-open', open); $('#drawer-scrim').hidden = !open; $('#menu-btn').setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  $('#menu-btn').addEventListener('click', () => setDrawer(!$('#shell').classList.contains('drawer-open')));
  $('#drawer-scrim').addEventListener('click', () => setDrawer(false));
  $('#nav').addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });
  $('#ext-btn').addEventListener('click', () => toast('Chrome extension link is outside this prototype'));
  $('#plan-btn').addEventListener('click', () => toast('Plan management is outside this prototype'));
  $('#help-btn').addEventListener('click', () => tipsModal());

  /* ---------- Boot ---------- */
  (function boot() {
    const h = (location.hash || '').replace('#', '');
    if (h === 'links') state.view = 'links';
    if (h.startsWith('link-')) { const slug = D.LINKS.find(l => l.slug.replace(/[^a-z0-9]+/gi, '-') === h.slice(5)); if (slug) { state.view = 'link'; state.slug = slug.slug; } }
    render();
  })();
})();
