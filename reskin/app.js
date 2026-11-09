/* ==================================================================
   UTM prototype vReskin — app (v4 analytics engine)
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
    rules: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>',
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
    swatch: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-1 1.3-2l-.3-.7c-.6-1.2.3-2.5 1.6-2.5H17a4 4 0 0 0 4-4c0-4.9-4-8.8-9-8.8z"/><circle cx="7.5" cy="11.5" r="1.2"/><circle cx="10" cy="7.2" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/></svg>',
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
    // Links page (lq / lsort / sel are shared by the QR codes, Templates and Shorteners pages)
    from: 'overview', lq: '', groupBy: 'none', lsort: { key: 'created', dir: -1 }, sel: new Set(), collapsed: new Set(),
    disabledDomains: new Set(),
    // Parameters page
    param: 'medium', ptab: 'values', pview: 'board', psel: null, padd: null,
  };
  const LIST_VIEWS = ['links', 'qr', 'templates', 'shorteners', 'parameters'];

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
    if (LIST_VIEWS.includes(state.view)) {
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
  // Region / city label with its country's flag; cities also name their region.
  function placeSpan(dim, label) {
    const p = D.PLACE[dim][label]; if (!p) return esc(label);
    const c = D.COUNTRIES[p.cc], where = label.startsWith('Other') ? '' : dim === 'city' && p.region ? `${p.region}, ${p.cc}` : c.name;
    return `<span class="flag" title="${esc(c.name)}">${c.flag}</span>${esc(label)}<span class="where">${esc(where)}</span>`;
  }
  const geoLabel = (dim, label) => dim === 'country' ? countrySpan(label) : dim === 'region' || dim === 'city' ? placeSpan(dim, label) : null;

  function rowsHTML(items, opts) {
    const { dim, bar, limit = 6, showPct = true, filterable = true } = opts;
    if (!items.length) return `<div class="empty"><strong>No ${esc(D.DIM[dim] ? D.DIM[dim].label.toLowerCase() : 'data')} in this range</strong>Try a wider date range or fewer filters.</div>`;
    const f = state.filters.find(x => x.dim === dim && x.op === 'is');
    const max = items[0].value || 1;
    return items.slice(0, limit).map(it => {
      const active = f && f.values.includes(it.label);
      const label = geoLabel(dim, it.label) || (dim === 'link' ? `<span class="code">${esc(it.label)}</span>` : esc(it.label));
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
    const body = `<div class="cols"><span>${esc(headers[0])}</span><span class="r">${esc(headers[1])}</span><span class="r">%</span></div><div class="rows">${rowsHTML(items, { dim, bar: CARD_BARS[id], ...extra })}</div>${extra.note || ''}`;
    return card(id, tabs, body);
  }

  /* ---------- Toolbar ---------- */
  function toolbarHTML(title) {
    const status = 'Updated 4 min ago · suspected bots excluded';
    return `<div class="tb-wrap"><div class="toolbar">
      <div class="title"><h1>${esc(title)}</h1><span class="status" tabindex="0" data-tip="${esc(status)}" aria-label="${esc(status)}">4 min ago</span></div></div>${filterBarHTML()}</div>`;
  }
  // Analytics filter: a wide bar that holds the chips, first in the row: filter, date, All / Links / QR, ⋮ (2026-10-29 review).
  function filterBarHTML() {
    const n = state.filters.length;
    const total = Q.unfiltered.totals.clicks, cur = Q.cur.totals.clicks;
    const ctx = n ? `<span class="fbar-ctx num" title="Clicks that match these filters">${fmt.n(cur)} of ${fmt.n(total)} clicks</span><button class="clear" id="clear-filters">Clear</button>` : '';
    return `<div class="fbar-row">
      ${filterFieldHTML('Search values: fall_sale, linkedin, London…', n, state.filters.map(chipHTML).join(''), ctx)}
      <button class="tb-btn date" id="date-btn" aria-haspopup="dialog" aria-expanded="false">${I.calendar}<span>${esc(rangeLabel())}</span><span class="chev">${I.chev}</span></button>
      <div class="seg trig" role="radiogroup" aria-label="Clicks to show">
        <button data-trigger="all" class="${state.trigger === 'all' ? 'on' : ''}" title="Links and QR codes">All</button>
        <button data-trigger="link" class="${state.trigger === 'link' ? 'on' : ''}" title="Link clicks only" aria-label="Links">${I.links}</button>
        <button data-trigger="qr" class="${state.trigger === 'qr' ? 'on' : ''}" title="QR scans only" aria-label="QR">${I.qr}</button>
      </div>
      <button class="tb-btn icon" id="more-btn" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button></div>`;
  }
  // The filter field: a clear "Filter" button (browse fields) + chips + a real search box.
  // Typing in the box (or anywhere on the page) drops down matching values; focusing it alone opens nothing.
  function filterFieldHTML(placeholder, n, chips, ctx, quick = false) {
    const nf = state.filters.length;
    // quick = list pages: typing filters the list immediately (text search), no dropdown.
    const box = quick ? `<input id="lq" class="fbar-input" placeholder="${esc(placeholder)}" value="${esc(state.lq)}" autocomplete="off" spellcheck="false" aria-label="${esc(placeholder)}"><button class="icon-btn" id="lq-clear" aria-label="Clear search" ${state.lq ? '' : 'hidden'}>${I.close}</button>` : '';
    return `<div class="fbar ${n ? 'has' : ''}" id="fbar"><button class="fbar-fbtn" id="filter-btn" aria-haspopup="menu" aria-expanded="false" title="Browse fields to filter by">${I.filter}<span>Filter</span>${nf ? `<span class="badge">${nf}</span>` : ''}<span class="chev">${I.chev}</span></button>${chips}${quick ? box : `<input id="fq" class="fbar-input" placeholder="${esc(n ? 'Type to add another…' : placeholder)}" autocomplete="off" spellcheck="false" aria-label="Search values to filter by">`}${ctx || '<span class="kbd" title="Or just start typing">/</span>'}</div>`;
  }
  // List pages (Links, QR codes, Templates, Shorteners, Parameters) use the Analytics bar too: one 44px field
  // holding Filter + chips + search text, then the page's own buttons in the same style.
  function listBarHTML(placeholder, controls, opts = {}) {
    if (opts.filter) {
      const n = state.filters.length;
      const end = n ? `<span class="fbar-ctx num">${opts.ctx || ''}</span><button class="clear" id="clear-search">Clear</button>` : '';
      return `<div class="fbar-row lbar-row">${filterFieldHTML(placeholder, n, state.filters.map(chipHTML).join(''), end, true)}${controls}</div>`;
    }
    const n = opts.filter ? state.filters.length : 0;
    const lead = opts.filter ? `<button class="fbar-fbtn" id="filter-btn" aria-haspopup="menu" aria-expanded="false">${I.filter}<span>Filter</span></button><span class="fbar-sep"></span>${state.filters.map(chipHTML).join('')}` : `<span class="fbar-ic">${I.search}</span>`;
    const end = n ? `<span class="fbar-ctx num">${opts.ctx || ''}</span><button class="clear" id="clear-filters">Clear</button>` : '';
    return `<div class="fbar-row lbar-row"><div class="fbar lbar ${n ? 'has' : ''}">${lead}<input id="lq" class="fbar-input" placeholder="${esc(n ? 'Search…' : placeholder)}" value="${esc(state.lq)}" aria-label="${esc(placeholder)}"><button class="icon-btn" id="lq-clear" aria-label="Clear search" ${state.lq ? '' : 'hidden'}>${I.close}</button>${end}</div>${controls}${opts.after || ''}</div>`;
  }
  function rangeLabel() { const p = PRESETS.find(p => p.id === state.preset); return p ? p.label : fmt.range(state.range); }

  function chipHTML(f, i) {
    const d = D.DIM[f.dim];
    const vals = f.op === 'contains' ? `“${esc(f.values[0])}”` : f.values.length > 2 ? `${esc(f.values[0])} <span class="op">+${f.values.length - 1} more</span>` : f.values.map(esc).join('<span class="op"> or </span>');
    return `<span class="chip"><span class="k">${esc(d.label)}</span><span class="op">${f.op}</span><span class="v"><button data-edit-filter="${i}" title="Edit">${vals}</button></span><button class="x" data-remove-filter="${i}" aria-label="Remove filter">${I.close}</button></span>`;
  }
  function chipsHTML() {
    if (!state.filters.length) return '<div class="chips"></div>';
    const total = Q.unfiltered.totals.clicks, cur = Q.cur.totals.clicks;
    const chips = state.filters.map(chipHTML).join('');
    const ctx = state.view === 'links' ? `Showing <b>${Q.links.rows.length}</b> of ${Q.linksAll.rows.length} links` : state.view === 'qr' ? `Showing <b>${qrRows().length}</b> of ${Q.linksAll.rows.filter(r => r.link.qr > 0).length} QR codes` : `Showing <b>${fmt.n(cur)}</b> of ${fmt.n(total)} clicks (${fmt.pct(total ? cur / total : 0)})`;
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
      const top = Object.entries(D.linkCountries(r.link, state.filters)).sort((a, b) => b[1] - a[1])[0];
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
      <div class="map-legend"><span>0</span><span class="scale"></span><span class="num">${fmt.n(max)} clicks</span>${f && f.values.length === 1 && D.COUNTRIES[f.values[0]] ? `<button class="link-btn hint" data-tab="city">See cities in ${esc(D.COUNTRIES[f.values[0]].name)} →</button>` : `<span class="hint">${f ? 'Click a country to change the filter' : 'Click a country to filter'}</span>`}</div></div>`;
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
      ${kpiChartHTML()}${tableHTML()}
      <div class="grid-2">${utm}${loc}</div><div class="grid-2">${dev}${ref}</div>
      <p class="footnote">Clicks are successful redirects; suspected bots are excluded. Unique clicks reset each calendar month. Times in UTC.</p>`;
  }
  function locationsCard(b) {
    const tabs = [{ key: 'map', label: 'Map' }, { key: 'country', label: 'Countries' }, { key: 'region', label: 'Regions' }, { key: 'city', label: 'Cities' }];
    const t = state.tabs.loc;
    if (t === 'map') return card('loc', tabs, mapHTML(b('country')), { noExpand: true });
    const note = t === 'country' ? '' : `<p class="loc-note">${I.globe}Estimated from the visitor's IP address. ${t === 'city' ? 'Cities are approximate; "Other" is clicks we couldn\'t place.' : 'Regions are states, provinces or counties.'}</p>`;
    return listCard('loc', tabs, [D.DIM[t].label, 'Clicks'], b(t), t, { note });
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
    return `<div class="view">${head}</div>${toolbarHTML('Performance')}${kpiChartHTML()}
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
    }).filter(r => !q || [r.link.slug, r.link.dest, r.link.title, r.link.campaign, r.link.source, r.link.medium, r.link.by, ...r.link.tags].some(s => s && s.toLowerCase().includes(q)));
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
    return `<div class="lrow ${on ? 'sel' : ''} ${state.fresh && state.fresh.has(l.slug) ? 'fresh' : ''}" data-link="${esc(l.slug)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
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
    return `<section class="card" id="links-table">${bulkBarHTML()}<div class="ltable">${head}${body}</div>
      <div class="tbl-foot"><span>Showing ${rows.length} of ${total} link${total === 1 ? '' : 's'}${state.lq ? ` matching “${esc(state.lq)}”` : ''}</span><span class="grow"></span><span>Lifetime clicks · 25 per page</span></div></section>`;
  }

  // Selection bar: when rows are ticked, the table's header row turns into this bar (Gmail / GitHub pattern),
  // pinned under the top bar while you scroll, so the actions sit right above what you selected.
  function bulkBarHTML() {
    const n = state.sel.size; if (!n) return '';
    const ids = selectableIds(), all = ids.length > 0 && ids.every(i => state.sel.has(i));
    const b = (act, icon, label, extra = '') => `<button class="btn sm ${act.includes('delete') ? 'danger' : ''}" data-bulk="${act}" ${extra}>${icon}${label}</button>`;
    const acts = state.view === 'parameters'
      ? b('merge', PI.merge, 'Merge', n < 2 ? 'disabled title="Select 2 or more values to merge"' : '') + b('pcsv', I.download, 'Export CSV') + b('pdelete', PI.trash, 'Delete')
      : state.view === 'qr'
      ? b('png', I.download, 'Download PNGs') + b('copy', I.copy, 'Copy links') + b('csv', I.download, 'Export CSV') + b('design', I.swatch, 'Change design') + b('delete', PI.trash, 'Delete')
      : b('copy', I.copy, 'Copy links') + b('csv', I.download, 'Export CSV') + b('tag', I.tag, 'Add tag') + b('archive', I.reset, 'Archive') + b('delete', PI.trash, 'Delete');
    const noun = state.view === 'parameters' ? 'value' : state.view === 'qr' ? 'QR code' : 'link';
    return `<div class="selbar" role="toolbar" aria-label="Selected items">
      <button class="cb on ${all ? '' : 'part'}" data-bulk="${all ? 'clear' : 'all'}" role="checkbox" aria-checked="${all ? 'true' : 'mixed'}" aria-label="${all ? 'Clear selection' : 'Select all'}">${all ? I.check : '<svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg>'}</button>
      <span class="cnt"><b>${n}</b> ${noun}${n === 1 ? '' : 's'} selected</span>${all ? '' : `<button class="link-btn" data-bulk="all">Select all ${ids.length}</button>`}
      <span class="sep"></span><div class="acts">${acts}</div><span class="grow"></span>
      <button class="link-btn clr" data-bulk="clear">Clear</button></div>`;
  }


  function linksHTML() {
    const n = Q.links.rows.length, all = Q.linksAll.rows.length;
    const g = GROUPS.find(x => x[0] === state.groupBy), s = LSORTS.find(x => x[0] === state.lsort.key);
    const nf = state.filters.length;
    return `<div class="view"><div class="page-head"><div class="title"><h1>Links</h1><span class="status" tabindex="0" data-tip="${all} links in this workspace · updated 4 min ago">${all} links</span></div>
        <div class="actions"><button class="btn primary" id="create-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Create link</button></div></div></div>
      ${listBarHTML('Search links, campaigns, people…', `
          <button class="tb-btn" id="group-btn" aria-haspopup="menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h6"/></svg>${state.groupBy === 'none' ? 'Group' : g[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn icon" id="links-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button>`, { filter: true, ctx: `${linkRows().length} of ${Q.linksAll.rows.length} links` })}
      ${linksTableHTML()}`;
  }

  function groupMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:200px"><div class="group">Group by</div>${GROUPS.map(([k, l]) => `<button class="mi ${state.groupBy === k ? 'on' : ''}" data-g="${k}"><span class="check">${I.check}</span><span class="grow">${l}</span></button>`).join('')}</div>`, {
      onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; state.groupBy = b.dataset.g; state.collapsed.clear(); closePop(); render(); }); },
    });
  }
  function lsortMenu(anchor, sorts) {
    sorts = sorts || ({ qr: QSORTS, templates: TSORTS, shorteners: SSORTS, parameters: PSORTS })[state.view] || LSORTS;
    openPop(anchor, `<div class="menu" style="width:220px"><div class="group">Sort by</div>${sorts.map(([k, l]) => `<button class="mi ${state.lsort.key === k ? 'on' : ''}" data-s="${k}"><span class="check">${I.check}</span><span class="grow">${l}</span></button>`).join('')}</div>`, {
      onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const k = b.dataset.s; state.lsort = { key: k, dir: ['link', 'name', 'domain', 'value'].includes(k) ? 1 : -1 }; closePop(); render(); }); },
    });
  }
  function linksMoreMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:230px">
      <button class="mi" data-act="links-import">${PI.upload}<span class="grow">Import CSV</span></button>
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
          else if (r === 'edit') openBuilder({ edit: slug }); else if (r === 'dup') openBuilder({ dup: slug });
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
    if (act === 'clear') { state.sel.clear(); refreshSelection(); return; }
    if (act === 'all') { selectableIds().forEach(id => state.sel.add(id)); refreshSelection(); return; }
    if (act === 'copy') { copyText(slugs.map(s => 'https://' + s).join('\n'), `Copied ${slugs.length} links`); return; }
    if (act === 'csv') { toast(`Exported ${slugs.length} ${state.view === 'qr' ? 'QR codes' : 'links'} as CSV`); return; }
    if (act === 'png') { toast(`Downloading ${slugs.length} QR codes as PNG`); return; }
    if (act === 'design') { qrDesignsModal(slugs); return; }
    if (act === 'delete') { confirmDelete(slugs); return; }
    if (state.view === 'parameters') { const p = curParam(); const vs = slugs.map(s => s.slice(p.key.length + 1));
      if (act === 'merge') { if (vs.length >= 2) mergeModal(p, vs); return; }
      if (act === 'pcsv') { toast(`Exported ${vs.length} values as CSV`); return; }
      if (act === 'pdelete') { openModal(`<div class="modal-h"><h3>Delete ${vs.length} values?</h3><button class="close" aria-label="Close">${I.close}</button></div><div class="modal-b about"><p>Links that use them keep working, but the values leave the builder and any grouping. This can't be undone.</p><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary danger" id="bd-ok">Delete</button></div></div>`, { width: 440, onMount(s) {
          $('#bd-ok', s).addEventListener('click', () => { closeModal(); vs.forEach(v => { const j = p.values.findIndex(x => x.v === v); if (j > -1) p.values.splice(j, 1); if (p.deps) Object.values(p.deps.allow).forEach(a => { const k = a.indexOf(v); if (k > -1) a.splice(k, 1); }); const c = childOf(p); if (c) delete c.deps.allow[v]; }); state.sel.clear(); render(); toast(`Deleted ${vs.length} values`); }); } }); return; } }
    toast(`${act === 'tag' ? 'Add tag' : 'Archive'} is outside this prototype`);
  }
  function goLinks(opts = {}) { state.view = 'links'; state.slug = null; if (!opts.keepFilters) { state.filters = []; } state.sel.clear(); state.lq = ''; state.lsort = { key: 'created', dir: -1 }; render({ top: true }); }
  // Other list pages: fresh search, sort and selection each time you arrive.
  function goPage(view, opts = {}) {
    state.view = view; state.slug = null; state.sel.clear(); state.lq = opts.q || '';
    if (!opts.keepFilters) state.filters = [];
    state.lsort = view === 'qr' ? { key: 'clicks', dir: -1 } : view === 'templates' ? { key: 'uses', dir: -1 } : { key: 'links', dir: -1 };
    if (view === 'parameters') { state.ptab = 'values'; }
    render({ top: true });
  }

  /* ---------- QR codes page ---------- */
  // A QR code is a link that has scans. Design = the QR template applied to it.
  const QR_DESIGNS = [
    { id: 'default', name: 'Default', fg: '#111827', bg: '#ffffff', desc: 'Black on white, no logo' },
    { id: 'brand', name: 'Acme brand', fg: '#8a64c0', bg: '#ffffff', logo: true, desc: 'Purple modules, logo in the centre' },
    { id: 'dark', name: 'Dark', fg: '#ffffff', bg: '#111827', desc: 'White on dark, for packaging' },
  ];
  const QR_DESIGN_OF = { 'acme.co/fall-sale': 'brand', 'acme.co/bf-teaser': 'dark', 'acme.co/q4-launch': 'default', 'acme.co/store-poster': 'brand', 'acme.co/fall-qr': 'brand', 'acme.co/event-badge': 'dark' };
  const designOf = slug => QR_DESIGNS.find(d => d.id === (QR_DESIGN_OF[slug] || 'default'));
  const QSORTS = [['clicks', 'Most scans'], ['recent', 'Most scans · 30 days'], ['created', 'Newest first'], ['link', 'Short link A–Z']];

  // Decorative QR-like module grid (not a real encoding), seeded by the slug so each code looks different but stable.
  function qrSVG(slug, design, size = 40) {
    const n = 21; let seed = 7; for (const ch of slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    let d = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); const inLogo = design.logo && x > 7 && x < 13 && y > 7 && y < 13; if (!inF && !inLogo && r() < .45) d += `M${x} ${y}h1v1h-1z`; }
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="${design.fg}"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="${design.bg}"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="${design.fg}"/>`;
    return `<svg class="qr-svg" viewBox="0 0 ${n} ${n}" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true"><rect width="${n}" height="${n}" fill="${design.bg}"/><path d="${d}" fill="${design.fg}"/>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}${design.logo ? `<rect x="8" y="8" width="5" height="5" rx="1" fill="${design.bg}"/><path d="M9.2 12 10.5 8.8 11.8 12M9.8 10.6h1.4" fill="none" stroke="${design.fg}" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</svg>`;
  }
  function qrRows() {
    const q = state.lq.trim().toLowerCase();
    const rows = Q.links.rows.filter(r => r.link.qr > 0).map(r => {
      const last30 = r.series.slice(-30), prev30 = r.series.slice(-60, -30);
      const recent = last30.reduce((a, p) => a + p.qr, 0), before = prev30.reduce((a, p) => a + p.qr, 0);
      return { ...r, last30, recent, recentDelta: delta(recent, before), design: designOf(r.link.slug) };
    }).filter(r => !q || [r.link.slug, r.link.dest, r.link.title, r.link.campaign, r.link.source, r.link.medium, r.link.by, r.design.name, ...r.link.tags].some(s => s && s.toLowerCase().includes(q)));
    const { key, dir } = state.lsort;
    rows.sort((a, b) => {
      let v = 0;
      if (key === 'created') v = a.link.created < b.link.created ? -1 : a.link.created > b.link.created ? 1 : 0;
      else if (key === 'link') v = a.link.slug.localeCompare(b.link.slug);
      else if (key === 'campaign') v = (a.link.campaign || 'zz').localeCompare(b.link.campaign || 'zz');
      else if (key === 'clicks') v = a.qr - b.qr;
      else v = a[key] - b[key];
      return v * dir;
    });
    return rows;
  }
  function qrRowHTML(r, i) {
    const l = r.link, on = state.sel.has(l.slug), created = new Date(l.created);
    const share = r.clicks ? r.qr / r.clicks : 0;
    return `<div class="lrow qrow ${on ? 'sel' : ''}" data-qr-open="${esc(l.slug)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
      <button class="cb ${on ? 'on' : ''}" data-sel="${esc(l.slug)}" role="checkbox" aria-checked="${on}" aria-label="Select ${esc(l.slug)}">${I.check}</button>
      <div class="lk"><span class="qr-thumb">${qrSVG(l.slug, r.design)}</span>
        <div class="txt"><span class="lk-name">${esc(l.title)}${l.tags.length ? l.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('') : ''}</span><span class="lk-dest"><span class="short">${esc(l.slug)}</span> → ${esc(l.dest)}</span></div></div>
      <div class="camp">${l.campaign ? `<button class="utm-chip sm" data-utm="campaign" data-val="${esc(l.campaign)}" title="Filter by this campaign">${esc(l.campaign)}</button>` : '<span class="untagged">Not tagged</span>'}<span class="sm-muted">${esc(l.source)} · ${esc(l.medium)}</span></div>
      <div class="clk"><span class="spark qr">${sparkline(r.last30, 'qr')}</span><span class="n"><b class="num">${fmt.n(r.qr)}</b><span class="sm-muted num">${r.recentDelta == null ? '<span class="d new">New</span> · all in 30d' : `${fmt.n(r.recent)} <span class="d ${r.recentDelta > 0.005 ? 'up' : r.recentDelta < -0.005 ? 'down' : ''}">${(r.recentDelta > 0 ? '+' : '') + Math.round(r.recentDelta * 100)}%</span> 30d`}</span></span></div>
      <div class="who">${avatar(l.by)}<span class="txt"><span>${fmt.d(created, { month: 'short', day: 'numeric', year: 'numeric' })}</span><span class="sm-muted">${esc(l.by)}</span></span></div>
      <div><span class="tpl design" title="${esc(r.design.desc)}"><i style="background:${r.design.fg};box-shadow:0 0 0 1px ${r.design.bg === '#ffffff' ? 'var(--border)' : r.design.bg}"></i>${esc(r.design.name)}</span><span class="sm-muted" style="display:block;margin-top:3px">${Math.round(share * 100)}% of clicks</span></div>
      <div class="acts">
        <button class="icon-btn" data-qr-dl="${esc(l.slug)}" title="Download PNG">${I.download}</button>
        <button class="icon-btn" data-copy="https://${esc(l.slug)}" title="Copy short link">${I.copy}</button>
        <button class="icon-btn" data-row-analytics="${esc(l.slug)}" title="Analytics">${I.analytics}</button>
        <button class="icon-btn" data-qr-more="${esc(l.slug)}" title="More" aria-haspopup="menu">${I.more}</button>
      </div></div>`;
  }
  function qrTableHTML() {
    const rows = qrRows(), total = Q.linksAll.rows.filter(r => r.link.qr > 0).length;
    const sortBtn = (key, label) => `<button data-lsort="${key}" class="${state.lsort.key === key ? 'on' : ''} ${state.lsort.key === key && state.lsort.dir === 1 ? 'asc' : ''}">${label}${I.sort}</button>`;
    const allOn = rows.length && rows.every(r => state.sel.has(r.link.slug));
    const head = `<div class="lrow qrow head" role="row"><button class="cb ${allOn ? 'on' : ''}" id="sel-all" role="checkbox" aria-checked="${allOn}" aria-label="Select all">${I.check}</button>
      <div>${sortBtn('link', 'QR code')}</div><div>${sortBtn('campaign', 'Campaign')}</div><div>${sortBtn('clicks', 'Scans')}</div><div>${sortBtn('created', 'Created')}</div><div>Design</div><div></div></div>`;
    const body = rows.length ? rows.map(qrRowHTML).join('')
      : `<div class="empty" style="min-height:200px"><strong>No QR codes match</strong>${state.lq ? 'Try a different search' : 'Try fewer filters'}, or create one from any link.<div style="margin-top:10px;display:flex;gap:8px"><button class="btn" id="clear-search">Clear search &amp; filters</button><button class="btn primary" id="create-qr-empty">Create QR code</button></div></div>`;
    return `<section class="card" id="list-table">${bulkBarHTML()}<div class="ltable">${head}${body}</div>
      <div class="tbl-foot"><span>Showing ${rows.length} of ${total} QR code${total === 1 ? '' : 's'}${state.lq ? ` matching “${esc(state.lq)}”` : ''}</span><span class="grow"></span><span>Lifetime scans · Click a row to preview and download</span></div></section>`;
  }
  function qrHTML() {
    const all = Q.linksAll.rows.filter(r => r.link.qr > 0), scans = all.reduce((a, r) => a + r.qr, 0);
    const s = QSORTS.find(x => x[0] === state.lsort.key) || QSORTS[0], nf = state.filters.length;
    return `<div class="view"><div class="page-head"><div class="title"><h1>QR codes</h1><span class="status" tabindex="0" data-tip="${all.length} QR codes · ${fmt.full(scans)} scans all time · updated 4 min ago">${all.length} codes · ${fmt.n(scans)} scans</span></div>
        <div class="actions"><button class="btn" id="qr-designs-btn">${I.swatch}QR designs</button><button class="btn primary" id="create-qr-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Create QR code</button></div></div></div>
      ${listBarHTML('Search QR codes, campaigns, people…', `
          <button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn icon" id="list-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button>`, { filter: true, ctx: `${qrRows().length} of ${all.length} QR codes` })}
      ${qrTableHTML()}`;
  }
  function qrDesignsModal(slugs) {
    const picking = !!(slugs && slugs.length);
    const counts = Object.fromEntries(QR_DESIGNS.map(d => [d.id, D.LINKS.filter(l => l.qr > 0 && designOf(l.slug).id === d.id).length]));
    openModal(`<div class="modal-h"><h3>${picking ? `Change design for ${slugs.length} QR code${slugs.length === 1 ? '' : 's'}` : 'QR designs'}<span class="sub">${picking ? 'Pick a design' : 'Templates every QR code in this workspace can use'}</span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="design-grid">${QR_DESIGNS.map(d => `<button class="design-card" data-design="${d.id}"><span class="prev" style="background:${d.bg}">${qrSVG('acme.co/' + d.id, d, 88)}</span><span class="name">${esc(d.name)}${d.id === 'brand' ? '<span class="tag">Default</span>' : ''}</span><span class="sm-muted">${esc(d.desc)}</span><span class="sm-muted">${counts[d.id]} QR code${counts[d.id] === 1 ? '' : 's'}</span></button>`).join('')}
        <button class="design-card new" id="design-new"><span class="prev"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span><span class="name">New design</span><span class="sm-muted">Colours, logo, corners and error correction</span></button></div>
      ${picking ? '' : '<p class="footnote" style="margin:14px 0 0">Workspace admins can set the default design and whether members may customise it, under Rules.</p>'}</div>`, { width: 640, onMount(s) {
        s.addEventListener('click', e => { const b = e.target.closest('[data-design]'); if (b) { closeModal(); if (picking) { slugs.forEach(sl => { QR_DESIGN_OF[sl] = b.dataset.design; }); state.sel.clear(); render(); toast(`Applied “${QR_DESIGNS.find(d => d.id === b.dataset.design).name}” to ${slugs.length} QR code${slugs.length === 1 ? '' : 's'}`); } else toast('The QR design editor is outside this prototype'); }
          if (e.target.closest('#design-new')) { closeModal(); toast('The QR design editor is outside this prototype'); } });
      } });
  }
  function qrMenu(anchor, slug) {
    const l = D.LINKS.find(x => x.slug === slug);
    openPop(anchor, `<div class="menu" style="width:230px"><div class="group" style="font-family:var(--font-mono);text-transform:none;letter-spacing:0">${esc(slug)}</div>
      <button class="mi" data-r="preview">${I.qr}<span class="grow">Preview &amp; download</span></button>
      <button class="mi" data-r="design">${I.swatch}<span class="grow">Change design</span></button>
      <button class="mi" data-r="analytics">${I.analytics}<span class="grow">View scan analytics</span></button>
      <button class="mi" data-r="edit">${I.edit}<span class="grow">Edit link</span></button>
      <div class="sep"></div>
      <button class="mi danger" data-r="delete">${I.close}<span class="grow">Delete QR code</span></button></div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; closePop(); const r = b.dataset.r;
          if (r === 'preview') qrModal(l); else if (r === 'design') qrDesignsModal([slug]); else if (r === 'analytics') goLink(slug); else if (r === 'edit') openBuilder({ edit: slug }); else if (r === 'delete') confirmDelete([slug]); else toast(`${b.textContent.trim()} is outside this prototype`); });
      } });
  }

  /* ---------- Templates page ---------- */
  // A UTM template = the parameter defaults the link builder fills in. {{…}} values are asked for at build time.
  const TEMPLATE_LIST = [
    { key: 'paid_social', name: 'Paid social', slug: 'paid-social', desc: 'Meta, LinkedIn and TikTok ads', source: '{{platform}}', medium: 'paid_social', campaign: '{{campaign}}', content: '{{creative}}', term: '', by: 'Dana Whitfield', created: '2026-06-12', shortener: 'acme.co' },
    { key: 'social', name: 'Organic social', slug: 'organic-social', desc: 'Posts from our own accounts', source: '{{platform}}', medium: 'social', campaign: '{{campaign}}', content: 'organic_post', term: '', by: 'Marcus Lee', created: '2026-06-12', shortener: 'acme.co' },
    { key: 'cpc', name: 'Paid search', slug: 'paid-search', desc: 'Google and Bing search campaigns', source: 'google', medium: 'cpc', campaign: '{{campaign}}', content: '{{ad_group}}', term: '{{keyword}}', by: 'Priya Natarajan', created: '2026-07-02', shortener: 'acme.co' },
    { key: 'email', name: 'Email', slug: 'email', desc: 'Newsletter and lifecycle sends', source: 'newsletter', medium: 'email', campaign: '{{campaign}}', content: '{{position}}', term: '', promo: '{{promo}}', by: 'Dana Whitfield', created: '2026-06-20', shortener: 'acme.co' },
    { key: 'print', name: 'Print · QR', slug: 'print-qr', desc: 'Posters, packaging and badges', source: '{{placement}}', medium: 'print', campaign: '{{campaign}}', content: '', term: '', region: '{{region}}', by: 'Priya Natarajan', created: '2026-08-01', shortener: 'acme.co', qr: 'brand' },
    { key: 'referral', name: 'Partner', slug: 'partner', desc: 'Referral links for partners', source: '{{partner}}', medium: 'referral', campaign: 'partner_referral', content: '', term: '', by: 'Marcus Lee', created: '2026-08-10', shortener: 'utm.io' },
    { key: 'audio', name: 'Podcast', slug: 'podcast', desc: 'Host-read ads and show notes', source: '{{show}}', medium: 'audio', campaign: '{{campaign}}', content: '', term: '', by: 'Marcus Lee', created: '2026-09-02', shortener: 'acme.co' },
    { key: 'video', name: 'Creator', slug: 'creator', desc: 'YouTube and creator sponsorships', source: 'youtube', medium: 'video', campaign: '{{campaign}}', content: '{{creator}}', term: '', by: 'Dana Whitfield', created: '2026-09-15', shortener: 'acme.co' },
  ];
  const TSORTS = [['uses', 'Most used'], ['clicks', 'Most clicks'], ['created', 'Newest first'], ['name', 'Name A–Z']];
  const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];
  const isDyn = v => /^\{\{.*\}\}$/.test(v);
  const paramChip = (k, v, key = 'utm_' + k) => v ? `<span class="utm-chip ${isDyn(v) ? 'dyn' : ''}" title="${isDyn(v) ? 'Asked for when the link is built' : 'Fixed value'}"><span class="k">${esc(key)}</span>${esc(isDyn(v) ? v.slice(2, -2) : v)}</span>` : '';
  function templateRows() {
    const q = state.lq.trim().toLowerCase();
    const rows = TEMPLATE_LIST.map(t => {
      const links = Q.linksAll.rows.filter(r => r.link.medium === t.key);
      return { t, uses: links.length, clicks: links.reduce((a, r) => a + r.clicks, 0) };
    }).filter(({ t }) => !q || [t.name, t.slug, t.desc, t.by, ...UTM_KEYS.map(k => t[k])].some(s => s && s.toLowerCase().includes(q)));
    const { key, dir } = state.lsort;
    rows.sort((a, b) => { let v = 0; if (key === 'name') v = a.t.name.localeCompare(b.t.name); else if (key === 'created') v = a.t.created < b.t.created ? -1 : a.t.created > b.t.created ? 1 : 0; else v = a[key] - b[key]; return v * dir; });
    return rows;
  }
  function templateRowHTML({ t, uses, clicks }, i) {
    return `<div class="lrow trow-t" data-tpl="${esc(t.key)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
      <div class="lk"><span class="type">${I.templates}</span><div class="txt"><span class="lk-name">${esc(t.name)}${t.qr ? `<span class="tag">QR</span>` : ''}</span><span class="lk-dest"><span class="code">${esc(t.slug)}</span> ${esc(t.desc)}</span></div></div>
      <div class="params">${UTM_KEYS.map(k => paramChip(k, t[k])).join('')}${PARAMS.filter(p => p.custom && t[p.key]).map(p => paramChip(p.key, t[p.key], p.utm)).join('')}</div>
      <div class="uses">${uses ? `<button class="n" data-tpl-links="${esc(t.key)}" title="Show these links"><b class="num">${uses}</b> link${uses === 1 ? '' : 's'}</button><span class="sm-muted num">${fmt.n(clicks)} clicks</span>` : '<span class="untagged">Not used yet</span>'}</div>
      <div class="who">${avatar(t.by)}<span class="txt"><span>${fmt.d(new Date(t.created), { month: 'short', day: 'numeric', year: 'numeric' })}</span><span class="sm-muted">${esc(t.by)}</span></span></div>
      <div class="acts">
        <button class="icon-btn" data-tpl-use="${esc(t.key)}" title="Build a link with this template">${I.links}</button>
        <button class="icon-btn" data-tpl-edit="${esc(t.key)}" title="Edit">${I.edit}</button>
        <button class="icon-btn" data-tpl-more="${esc(t.key)}" title="More" aria-haspopup="menu">${I.more}</button>
      </div></div>`;
  }
  function templatesTableHTML() {
    const rows = templateRows();
    const sortBtn = (key, label) => `<button data-lsort="${key}" class="${state.lsort.key === key ? 'on' : ''} ${state.lsort.key === key && state.lsort.dir === 1 ? 'asc' : ''}">${label}${I.sort}</button>`;
    const head = `<div class="lrow trow-t head" role="row"><div>${sortBtn('name', 'Template')}</div><div>Parameters <span class="sm-muted" style="font-weight:400">· dashed = asked for in the builder</span></div><div>${sortBtn('uses', 'Used by')}</div><div>${sortBtn('created', 'Created')}</div><div></div></div>`;
    const body = rows.length ? rows.map(templateRowHTML).join('')
      : `<div class="empty" style="min-height:200px"><strong>No templates match</strong>Try a different search, or create a new template.<div style="margin-top:10px;display:flex;gap:8px"><button class="btn" id="clear-search">Clear search</button><button class="btn primary" id="create-tpl-empty">Create template</button></div></div>`;
    return `<section class="card" id="list-table">${bulkBarHTML()}<div class="ltable">${head}${body}</div>
      <div class="tbl-foot"><span>Showing ${rows.length} of ${TEMPLATE_LIST.length} templates${state.lq ? ` matching “${esc(state.lq)}”` : ''}</span><span class="grow"></span><span>Click a row to see the full template</span></div></section>`;
  }
  function templatesHTML() {
    const s = TSORTS.find(x => x[0] === state.lsort.key) || TSORTS[0];
    return `<div class="view"><div class="page-head"><div class="title"><h1>Templates</h1><span class="status" tabindex="0" data-tip="${TEMPLATE_LIST.length} UTM templates · template selection is required in the link builder">${TEMPLATE_LIST.length} templates · required in builder</span></div>
        <div class="actions"><button class="btn primary" id="create-tpl-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Create template</button></div></div></div>
      ${listBarHTML('Search templates, parameters, people…', `
          <button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn icon" id="list-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button>`)}
      ${templatesTableHTML()}`;
  }
  function templateModal(key) {
    const t = TEMPLATE_LIST.find(x => x.key === key); const row = templateRows().find(r => r.t.key === key) || { uses: 0, clicks: 0 };
    const example = `https://${t.shortener}/{{slug}}  →  acme.com/…?${UTM_KEYS.filter(k => t[k]).map(k => `utm_${k}=${isDyn(t[k]) ? '…' : t[k]}`).join('&')}`;
    openModal(`<div class="modal-h"><h3>${esc(t.name)}<span class="sub"><span class="code">${esc(t.slug)}</span></span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><p class="sm-muted" style="white-space:normal;margin:4px 0 14px">${esc(t.desc)}. Created ${fmt.d(new Date(t.created), { month: 'short', day: 'numeric', year: 'numeric' })} by ${esc(t.by)}.</p>
        <dl class="tpl-dl">${UTM_KEYS.map(k => `<dt>utm_${k}</dt><dd>${t[k] ? (isDyn(t[k]) ? `<span class="utm-chip dyn">${esc(t[k].slice(2, -2))}</span><span class="sm-muted" style="margin-left:8px">asked for in the builder</span>` : `<b>${esc(t[k])}</b>`) : '<span class="untagged">not set</span>'}</dd>`).join('')}
        ${PARAMS.filter(p => p.custom && t[p.key]).map(p => `<dt>${esc(p.utm)}</dt><dd>${isDyn(t[p.key]) ? `<span class="utm-chip dyn">${esc(t[p.key].slice(2, -2))}</span><span class="sm-muted" style="margin-left:8px">asked for in the builder</span>` : `<b>${esc(t[p.key])}</b>`}</dd>`).join('')}
        <dt>Shortener</dt><dd>${esc(t.shortener)}</dd><dt>QR design</dt><dd>${t.qr ? esc(QR_DESIGNS.find(d => d.id === t.qr).name) : '<span class="untagged">workspace default</span>'}</dd></dl>
        <div class="tpl-example"><span class="sm-muted">Example</span><code>${esc(example)}</code></div>
        <div class="tpl-foot"><span class="sm-muted">${row.uses ? `Used by <b>${row.uses}</b> link${row.uses === 1 ? '' : 's'} · ${fmt.n(row.clicks)} clicks` : 'Not used by any link yet'}</span><span class="grow"></span>${row.uses ? `<button class="btn" id="tpl-links">${I.links}View links</button>` : ''}<button class="btn" id="tpl-edit">${I.edit}Edit</button><button class="btn primary" id="tpl-use">Build a link</button></div></div>`, { width: 600, onMount(s) {
        const tl = $('#tpl-links', s); if (tl) tl.addEventListener('click', () => { closeModal(); goLinks(); state.lq = t.medium; render(); });
        $('#tpl-edit', s).addEventListener('click', () => { closeModal(); toast('Template editing is outside this prototype'); });
        $('#tpl-use', s).addEventListener('click', () => { closeModal(); openBuilder({ tpl: t.key }); });
      } });
  }
  function templateMenu(anchor, key) {
    const t = TEMPLATE_LIST.find(x => x.key === key);
    openPop(anchor, `<div class="menu" style="width:230px"><div class="group">${esc(t.name)}</div>
      <button class="mi" data-r="open">${I.templates}<span class="grow">View template</span></button>
      <button class="mi" data-r="use">${I.links}<span class="grow">Build a link with it</span></button>
      <button class="mi" data-r="links">${I.analytics}<span class="grow">Show its links</span></button>
      <div class="sep"></div>
      <button class="mi" data-r="dup"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg><span class="grow">Duplicate</span></button>
      <button class="mi" data-r="default">${I.check}<span class="grow">Make workspace default</span></button>
      <button class="mi danger" data-r="delete">${I.close}<span class="grow">Delete</span></button></div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; closePop(); const r = b.dataset.r;
          if (r === 'open') templateModal(key); else if (r === 'use') openBuilder({ tpl: key }); else if (r === 'links') { goLinks(); state.lq = t.medium; render(); } else if (r === 'delete') confirmDeleteTemplate(t); else toast(`${b.textContent.trim()} is outside this prototype`); });
      } });
  }
  function confirmDeleteTemplate(t) {
    const uses = D.LINKS.filter(l => l.medium === t.key).length;
    openModal(`<div class="modal-h"><h3>Delete “${esc(t.name)}”?</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>${uses ? `<b>${uses}</b> existing link${uses === 1 ? ' keeps' : 's keep'} their parameters; only the template goes away.` : 'This template is not used by any link.'} Members won't be able to pick it in the link builder any more.</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary danger" id="del-ok">Delete template</button></div></div>`, { width: 440, onMount(s) { $('#del-ok', s).addEventListener('click', () => { closeModal(); toast(`Deleted “${t.name}” (prototype only — data is unchanged)`); }); } });
  }

  /* ---------- Link shorteners page ---------- */
  const SHORTENERS = [
    { domain: 'utm.io', kind: 'UTM.io shared domain', status: 'active', redirect: '', note: 'Available to every workspace', default: false, locked: true },
    { domain: 'acme.co', kind: 'Custom domain', status: 'verified', redirect: 'acme.com', note: 'DNS verified Jun 3, 2026', default: true },
    { domain: 'go.acme.com', kind: 'Custom domain', status: 'pending', redirect: 'acme.com', note: 'Waiting for the CNAME record', default: false },
    { domain: 'bit.ly', kind: 'Bitly integration', status: 'connected', redirect: '', note: 'Connected as acme-marketing', default: false },
  ];
  const SH_STATUS = { active: ['Active', ''], verified: ['Verified', ''], pending: ['Needs DNS', 'warn'], connected: ['Connected', ''], off: ['Disabled', 'off'] };
  const SSORTS = [['links', 'Most links'], ['clicks', 'Most clicks'], ['domain', 'Domain A–Z']];
  function shortenerRows() {
    const q = state.lq.trim().toLowerCase();
    const rows = SHORTENERS.map(s => {
      const links = Q.linksAll.rows.filter(r => r.link.slug.split('/')[0] === s.domain);
      return { s, links: links.length, clicks: links.reduce((a, r) => a + r.clicks, 0), off: state.disabledDomains.has(s.domain) };
    }).filter(({ s }) => !q || [s.domain, s.kind, s.redirect, SH_STATUS[s.status][0]].some(x => x && x.toLowerCase().includes(q)));
    const { key, dir } = state.lsort;
    rows.sort((a, b) => { const v = key === 'domain' ? a.s.domain.localeCompare(b.s.domain) : a[key] - b[key]; return v * dir; });
    return rows;
  }
  function shortenerRowHTML({ s, links, clicks, off }, i) {
    const st = off ? SH_STATUS.off : SH_STATUS[s.status];
    return `<div class="lrow srow ${off ? 'off' : ''}" data-domain="${esc(s.domain)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
      <div class="lk"><span class="type">${I.shorteners}</span><div class="txt"><span class="lk-name"><span class="short">${esc(s.domain)}</span>${s.default ? '<span class="tag">Default</span>' : ''}</span><span class="lk-dest">${esc(s.kind)} · ${esc(s.note)}</span></div></div>
      <div>${s.status === 'pending' && !off ? `<button class="status-pill ${st[1]}" data-dns="${esc(s.domain)}" title="Show DNS instructions">${st[0]}</button>` : `<span class="status-pill ${st[1]}">${st[0]}</span>`}</div>
      <div class="redir">${s.redirect ? `<span class="sm-muted">Root goes to</span><span>${esc(s.redirect)}</span>` : '<span class="untagged">No root redirect</span>'}</div>
      <div class="uses">${links ? `<button class="n" data-dom-links="${esc(s.domain)}" title="Show these links"><b class="num">${links}</b> link${links === 1 ? '' : 's'}</button><span class="sm-muted num">${fmt.n(clicks)} clicks</span>` : '<span class="untagged">No links yet</span>'}</div>
      <div><label class="switch ${off ? '' : 'on'}" data-toggle-dom="${esc(s.domain)}" title="${off ? 'Enable' : 'Disable'} for new links"><i></i><span class="sm-muted">${off ? 'Off' : 'On'}</span></label></div>
      <div class="acts">
        <button class="icon-btn" data-dom-edit="${esc(s.domain)}" title="Settings">${I.sliders}</button>
        ${s.locked ? '' : `<button class="icon-btn" data-dom-delete="${esc(s.domain)}" title="Remove">${I.close}</button>`}
      </div></div>`;
  }
  function shortenersTableHTML() {
    const rows = shortenerRows();
    const sortBtn = (key, label) => `<button data-lsort="${key}" class="${state.lsort.key === key ? 'on' : ''} ${state.lsort.key === key && state.lsort.dir === 1 ? 'asc' : ''}">${label}${I.sort}</button>`;
    const head = `<div class="lrow srow head" role="row"><div>${sortBtn('domain', 'Shortener')}</div><div>Status</div><div>Default redirect</div><div>${sortBtn('links', 'Used by')}</div><div>New links</div><div></div></div>`;
    const body = rows.length ? rows.map(shortenerRowHTML).join('') : `<div class="empty" style="min-height:160px"><strong>No shorteners match</strong>Try a different search.<div style="margin-top:10px"><button class="btn" id="clear-search">Clear search</button></div></div>`;
    return `<section class="card" id="list-table">${bulkBarHTML()}<div class="ltable">${head}${body}</div>
      <div class="tbl-foot"><span>${SHORTENERS.length} shorteners · the default is pre-selected in the link builder</span><span class="grow"></span><span>Turning one off keeps existing links working</span></div></section>`;
  }
  function shortenersHTML() {
    const s = SSORTS.find(x => x[0] === state.lsort.key) || SSORTS[0];
    return `<div class="view"><div class="page-head"><div class="title"><h1>Link shorteners</h1><span class="status" tabindex="0" data-tip="${SHORTENERS.length} shorteners · ${SHORTENERS.filter(x => x.status === 'pending').length} waiting for DNS">${SHORTENERS.length} domains · 1 needs DNS</span></div>
        <div class="actions"><button class="btn" id="cleaner-btn">${I.sliders}UTM Page Cleaner</button><button class="btn primary" id="add-dom-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add shortener</button></div></div></div>
      ${listBarHTML('Search domains…', `
          <button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>
          <button class="tb-btn icon" id="list-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button>`)}
      ${shortenersTableHTML()}
      <p class="footnote">Short links keep redirecting even if you turn a shortener off; it only disappears from the link builder. Custom domains need a CNAME record pointing at <span class="code">redirect.utm.io</span>.</p>`;
  }
  function dnsModal(domain) {
    openModal(`<div class="modal-h"><h3>Connect ${esc(domain)}<span class="sub">DNS not found yet</span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>Add this record at your DNS provider, then check again. Changes usually show up within an hour.</p>
        <dl class="tpl-dl dns"><dt>Type</dt><dd><b>CNAME</b></dd><dt>Host</dt><dd><b>${esc(domain.split('.')[0])}</b><button class="icon-btn" data-copy="${esc(domain.split('.')[0])}" title="Copy">${I.copy}</button></dd><dt>Points to</dt><dd><b>redirect.utm.io</b><button class="icon-btn" data-copy="redirect.utm.io" title="Copy">${I.copy}</button></dd><dt>TTL</dt><dd>Automatic</dd></dl>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Close</button><button class="btn primary" id="dns-check">${I.reset}Check again</button></div></div>`, { width: 480, onMount(s) {
        s.addEventListener('click', e => { const c = e.target.closest('[data-copy]'); if (c) copyText(c.dataset.copy, 'Copied'); });
        $('#dns-check', s).addEventListener('click', () => { closeModal(); toast(`Still waiting for the CNAME on ${domain}`); });
      } });
  }
  function addShortenerModal() {
    openModal(`<div class="modal-h"><h3>Add a link shortener</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><div class="choice-list">
        <label class="choice on"><input type="radio" name="kind" value="custom" checked><span class="t"><b>Custom domain</b><span class="sm-muted" style="white-space:normal">Use your own domain, e.g. go.acme.com. Needs a CNAME record.</span></span></label>
        <label class="choice"><input type="radio" name="kind" value="bitly"><span class="t"><b>Bitly</b><span class="sm-muted" style="white-space:normal">Connect a Bitly account and use its domains.</span></span></label></div>
        <div class="field"><label for="dom-in">Domain</label><div class="search" style="margin:0"><input id="dom-in" placeholder="go.acme.com" autocomplete="off"></div></div>
        <div class="field"><label for="redir-in">Where should the root (<span class="code">go.acme.com/</span>) go?</label><div class="search" style="margin:0"><input id="redir-in" placeholder="https://acme.com" autocomplete="off"></div></div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary" id="dom-add" disabled>Add domain</button></div></div>`, { width: 480, onMount(s) {
        const inp = $('#dom-in', s), add = $('#dom-add', s);
        inp.addEventListener('input', () => { add.disabled = !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(inp.value.trim()); });
        $$('.choice', s).forEach(c => c.addEventListener('click', () => $$('.choice', s).forEach(x => x.classList.toggle('on', x === c))));
        add.addEventListener('click', () => { const d = inp.value.trim().toLowerCase(); closeModal(); if (!SHORTENERS.some(x => x.domain === d)) SHORTENERS.push({ domain: d, kind: 'Custom domain', status: 'pending', redirect: ($('#redir-in', s).value || '').replace(/^https?:\/\//, ''), note: 'Added just now', default: false }); render(); dnsModal(d); });
        setTimeout(() => inp.focus(), 50);
      } });
  }
  function shortenerMenu(anchor, domain) {
    const s = SHORTENERS.find(x => x.domain === domain);
    openPop(anchor, `<div class="menu" style="width:230px"><div class="group" style="text-transform:none;letter-spacing:0">${esc(domain)}</div>
      <button class="mi ${s.default ? 'on' : ''}" data-r="default"><span class="check">${I.check}</span><span class="grow">Default for new links</span></button>
      <button class="mi" data-r="redirect">${I.referrer}<span class="grow">Change root redirect</span></button>
      ${s.status === 'pending' ? `<button class="mi" data-r="dns">${I.info}<span class="grow">DNS instructions</span></button>` : ''}
      <div class="sep"></div>
      ${s.locked ? '' : `<button class="mi danger" data-r="delete">${I.close}<span class="grow">Remove shortener</span></button>`}</div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; closePop(); const r = b.dataset.r;
          if (r === 'default') { SHORTENERS.forEach(x => { x.default = x.domain === domain; }); render(); toast(`${domain} is now the default shortener`); }
          else if (r === 'dns') dnsModal(domain);
          else if (r === 'delete') confirmRemoveShortener(s);
          else toast(`${b.textContent.trim()} is outside this prototype`); });
      } });
  }
  function confirmRemoveShortener(s) {
    const n = D.LINKS.filter(l => l.slug.split('/')[0] === s.domain).length;
    openModal(`<div class="modal-h"><h3>Remove ${esc(s.domain)}?</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>${n ? `<b>${n}</b> link${n === 1 ? '' : 's'} use this domain and would <b>stop redirecting</b>. Turn the shortener off instead if you only want to hide it from the link builder.` : 'No links use this domain yet.'}</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button>${n ? `<button class="btn" id="dom-off">Turn off instead</button>` : ''}<button class="btn primary danger" id="del-ok">Remove</button></div></div>`, { width: 460, onMount(m) {
        $('#del-ok', m).addEventListener('click', () => { closeModal(); const i = SHORTENERS.indexOf(s); if (i > -1) SHORTENERS.splice(i, 1); render(); toast(`Removed ${s.domain} (prototype only)`); });
        const off = $('#dom-off', m); if (off) off.addEventListener('click', () => { closeModal(); state.disabledDomains.add(s.domain); render(); toast(`${s.domain} turned off for new links`); });
      } });
  }

  /* ---------- Parameters page ---------- */
  // The workspace vocabulary: which values the link builder offers for each parameter, how each parameter behaves,
  // and which parent values narrow which child values ("groupings"). Usage comes from the same dataset as Analytics,
  // so "used by 4 links" here agrees with the Links page.
  const PI = {
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M6.7 6.7C4 8.3 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.2M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7s-.8 1.6-2.4 3.3"/></svg>',
    branch: '<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 7.2v9.6M18 11.2c0 3-3 4-6 4.5-2.5.4-4.5 1-6 1.1"/></svg>',
    merge: '<svg viewBox="0 0 24 24"><path d="M5 5v4a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4v2M5 19v-4a4 4 0 0 1 4-4"/><path d="m16 16 3 3 3-3"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>',
    archive: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/></svg>',
    warn: '<svg viewBox="0 0 24 24"><path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    grip: '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };
  // Effective builder rules, as set on the Rules page (read-only here; Rules is where you change them).
  const RULE_LABEL = { required: ['Required', 'Members must fill this in'], lowercase: ['Lowercase', 'Typed values are forced to lowercase'], dropdown: ['Dropdown only', 'Members pick from this list; they can\'t type a new value'], unique: ['Unique', 'Each link needs a value no other link has'] };
  const FORMATS = { text: 'Text', date: 'Date', number: 'Number' };
  const PARAM_SEED = [
    { key: 'campaign', label: 'Campaign', utm: 'utm_campaign', format: 'text', desc: 'Which promotion, launch or initiative the link belongs to', hint: 'e.g. fall_sale_2026', rules: ['required', 'lowercase', 'dropdown'], values: [
      ['fall_sale_2026', 'Fall sale 2026', 'Sept–Oct sitewide sale', 'Dana Whitfield', '2026-09-01'], ['black_friday_teaser', 'Black Friday teaser', '', 'Dana Whitfield', '2026-10-12'], ['webinar_oct29', 'October webinar', '', 'Marcus Lee', '2026-08-18'],
      ['product_launch_q4', 'Q4 product launch', '', 'Priya Natarajan', '2026-08-27'], ['partner_referral', 'Partner referral', 'Evergreen partner programme', 'Marcus Lee', '2026-08-10'], ['newsletter_oct', 'October newsletter', '', 'Dana Whitfield', '2026-06-01'],
      ['podcast_s3', 'Podcast season 3', '', 'Marcus Lee', '2026-09-16'], ['saastr_2026', 'SaaStr 2026', 'Booth and badge links', 'Marcus Lee', '2026-09-08'], ['creator_oct', 'Creator programme · Oct', '', 'Dana Whitfield', '2026-10-10'],
      ['spring_sale_2026', 'Spring sale 2026', '', 'Dana Whitfield', '2026-03-02'], ['Summer-Sale', '', '', 'Marcus Lee', '2026-06-14'], ['q1_planning', '', '', 'Priya Natarajan', '2026-01-20'],
    ] },
    { key: 'medium', label: 'Medium', utm: 'utm_medium', format: 'text', desc: 'The marketing channel. Keep to GA4\'s default channel groups so traffic isn\'t "Unassigned"', hint: 'e.g. paid_social', rules: ['required', 'lowercase', 'dropdown'], values: [
      ['paid_social', 'Paid social', 'Meta, LinkedIn, TikTok ads', 'Dana Whitfield', '2026-06-12'], ['social', 'Organic social', 'Posts from our own accounts', 'Marcus Lee', '2026-06-12'], ['cpc', 'Paid search', 'Google and Bing search ads', 'Priya Natarajan', '2026-06-12'],
      ['email', 'Email', 'Newsletter and lifecycle sends', 'Dana Whitfield', '2026-06-12'], ['print', 'Print', 'Posters, packaging, badges (QR)', 'Priya Natarajan', '2026-08-01'], ['referral', 'Referral', 'Partner and docs links', 'Marcus Lee', '2026-08-10'],
      ['audio', 'Audio', 'Podcast host-reads and show notes', 'Marcus Lee', '2026-09-02'], ['video', 'Video', 'YouTube and creator sponsorships', 'Dana Whitfield', '2026-09-15'], ['display', 'Display', 'Banner ads (not running)', 'Priya Natarajan', '2026-05-04'], ['Paid_Social', '', '', 'Marcus Lee', '2026-10-21'],
    ] },
    { key: 'source', label: 'Source', utm: 'utm_source', format: 'text', desc: 'Where the click comes from: the platform, site or publication', hint: 'e.g. linkedin', rules: ['required', 'lowercase', 'dropdown'], deps: { parent: 'medium', allow: {
      paid_social: ['facebook', 'instagram', 'linkedin', 'tiktok'], social: ['facebook', 'instagram', 'linkedin', 'youtube'], cpc: ['google', 'bing'], email: ['newsletter'], print: ['print'], audio: ['podcast'], video: ['youtube'], referral: ['partner'] } }, values: [
      ['facebook', 'Facebook', '', 'Dana Whitfield', '2026-06-12'], ['instagram', 'Instagram', '', 'Dana Whitfield', '2026-06-12'], ['linkedin', 'LinkedIn', '', 'Marcus Lee', '2026-06-12'], ['tiktok', 'TikTok', '', 'Dana Whitfield', '2026-07-20'],
      ['google', 'Google', 'Search and Display', 'Priya Natarajan', '2026-06-12'], ['bing', 'Bing', '', 'Priya Natarajan', '2026-06-12'], ['newsletter', 'Newsletter', 'Our own email list', 'Dana Whitfield', '2026-06-12'], ['print', 'Print', 'Physical placements', 'Priya Natarajan', '2026-08-01'],
      ['youtube', 'YouTube', '', 'Dana Whitfield', '2026-09-15'], ['podcast', 'Podcast', '', 'Marcus Lee', '2026-09-02'], ['partner', 'Partner', 'Referral partners', 'Marcus Lee', '2026-08-10'],
      ['Facebook', '', '', 'Marcus Lee', '2026-10-20'], ['twitter', 'Twitter', '', 'Marcus Lee', '2026-03-11'], ['snapchat', 'Snapchat', '', 'Dana Whitfield', '2026-04-02'],
    ] },
    { key: 'content', label: 'Content', utm: 'utm_content', format: 'text', desc: 'Which creative, placement or variant. Useful for A/B tests', hint: 'e.g. hero_cta', rules: ['lowercase'], values: [
      ['carousel_v2', '', 'Fall sale carousel, 2nd cut', 'Dana Whitfield', '2026-09-05'], ['story_teaser', '', '', 'Dana Whitfield', '2026-10-13'], ['organic_post', '', '', 'Marcus Lee', '2026-08-19'], ['rsa_v3', 'Responsive search ad v3', '', 'Priya Natarajan', '2026-08-28'],
      ['hero_cta', 'Hero CTA', 'Button in the email hero', 'Dana Whitfield', '2026-06-01'], ['store_window', 'Store window', '', 'Priya Natarajan', '2026-09-02'], ['reel_v1', '', '', 'Dana Whitfield', '2026-09-07'], ['promo_banner', 'Promo banner', '', 'Dana Whitfield', '2026-09-08'],
      ['ep42', 'Episode 42', '', 'Marcus Lee', '2026-09-17'], ['sidebar_cta', 'Sidebar CTA', '', 'Priya Natarajan', '2026-07-01'],
    ] },
    { key: 'term', label: 'Term', utm: 'utm_term', format: 'text', desc: 'Paid keyword. Only paid search links need it', hint: 'e.g. utm-builder', rules: ['lowercase'], values: [
      ['acme q4', '', '', 'Priya Natarajan', '2026-08-28'], ['utm-builder', '', '', 'Priya Natarajan', '2026-06-12'], ['campaign-tracking', '', '', 'Priya Natarajan', '2026-06-12'],
    ] },
    { key: 'region', label: 'Region', utm: 'region', format: 'text', custom: true, desc: 'Sales region the link is aimed at. Feeds the regional dashboards', hint: 'Pick a region', rules: ['dropdown'], common: true, values: [
      ['na', 'North America', '', 'Priya Natarajan', '2026-07-15'], ['emea', 'EMEA', 'Europe, Middle East, Africa', 'Priya Natarajan', '2026-07-15'], ['apac', 'APAC', '', 'Priya Natarajan', '2026-07-15'], ['latam', 'LATAM', '', 'Priya Natarajan', '2026-07-15'],
    ] },
    { key: 'promo', label: 'Promo code', utm: 'promo', format: 'text', custom: true, desc: 'Discount code pre-filled on the landing page', hint: 'e.g. FALL20', rules: [], values: [
      ['FALL20', '', '20% off, fall sale', 'Dana Whitfield', '2026-09-01'], ['BF30', '', 'Black Friday 30%', 'Dana Whitfield', '2026-10-12'],
    ] },
    { key: 'ad_id', label: 'Ad ID', utm: 'ad_id', format: 'number', custom: true, desc: 'Platform ad ID, typed per link. No saved values', hint: 'e.g. 120208833', rules: [], shown: false, values: [] },
  ];
  // Custom parameters aren't on the links dataset, so a small lookup says which links carry them.
  const CUSTOM_USAGE = { region: { na: ['acme.co/fall-sale', 'acme.co/bf-teaser', 'acme.co/q4-launch', 'acme.co/newsletter', 'acme.co/fall-email', 'acme.co/yt-review'], emea: ['acme.co/webinar', 'acme.co/fall-ig', 'acme.co/podcast'], apac: ['acme.co/docs-cta'] }, promo: { FALL20: ['acme.co/fall-sale', 'acme.co/fall-ig', 'acme.co/fall-email', 'acme.co/store-poster', 'acme.co/fall-qr'], BF30: ['acme.co/bf-teaser'] } };
  const PARAMS = PARAM_SEED.map(p => ({ ...p, shown: p.shown !== false, deps: p.deps ? { parent: p.deps.parent, allow: Object.fromEntries(Object.entries(p.deps.allow).map(([k, v]) => [k, [...v]])) } : null,
    values: p.values.map(([v, pretty, desc, by, created]) => ({ v, pretty, desc, by, created, status: 'active' })) }));
  const PSORTS = [['links', 'Most used'], ['clicks', 'Most clicks'], ['last', 'Recently used'], ['created', 'Newest first'], ['value', 'Value A–Z']];
  const paramOf = key => PARAMS.find(p => p.key === key);
  const curParam = () => paramOf(state.param) || PARAMS[0];
  const STALE_DAYS = 90;
  const daysAgo = iso => Math.round((D.stripTime(T) - new Date(iso + 'T00:00:00')) / 864e5);
  const daysSince = d => Math.round((D.stripTime(T) - D.stripTime(d)) / 864e5);
  const todayISO = () => `${T.getFullYear()}-${String(T.getMonth() + 1).padStart(2, '0')}-${String(T.getDate()).padStart(2, '0')}`;

  // Links that carry a value for a parameter (case-sensitive, like UTMs themselves).
  function linksWith(p, v) {
    if (p.custom) return Q.linksAll.rows.filter(r => (CUSTOM_USAGE[p.key] && CUSTOM_USAGE[p.key][v] || []).includes(r.link.slug));
    return Q.linksAll.rows.filter(r => r.link[p.key] === v);
  }
  function lastUsed(rows) { let d = null; rows.forEach(r => { for (let i = r.series.length - 1; i >= 0; i--) if (r.series[i].clicks > 0) { if (!d || r.series[i].date > d) d = r.series[i].date; break; } }); return d; }
  // What's wrong with a value, if anything. Each issue carries the fix the review queue offers.
  function issuesFor(p, val, all) {
    const out = []; const v = val.v;
    if (val.status === 'archived') return out;
    const twin = all.find(o => o !== val && o.status !== 'archived' && o.v.toLowerCase().replace(/[\s_-]+/g, '') === v.toLowerCase().replace(/[\s_-]+/g, ''));
    if (twin) { const keep = /[A-Z\s]/.test(v) && !/[A-Z\s]/.test(twin.v) ? twin : (val.created < twin.created ? val : twin); if (keep !== val) out.push({ type: 'dup', label: `Looks like a duplicate of “${keep.v}”`, fix: 'merge', into: keep.v }); }
    if (p.rules.includes('lowercase') && /[A-Z]/.test(v) && !twin) out.push({ type: 'case', label: 'Has capitals, but this parameter is forced to lowercase in Rules', fix: 'rename', to: v.toLowerCase() });
    if (/\s/.test(v)) out.push({ type: 'space', label: 'Contains a space. The builder replaces spaces with “-”', fix: 'rename', to: v.replace(/\s+/g, '-') });
    return out;
  }
  function paramValueRows(p = curParam(), opts = {}) {
    const q = (opts.q != null ? opts.q : state.lq).trim().toLowerCase();
    const rows = p.values.map(val => {
      const links = linksWith(p, val.v); const issues = issuesFor(p, val, p.values);
      const stale = val.status === 'active' && !links.length && daysAgo(val.created) > STALE_DAYS;
      if (stale) issues.push({ type: 'stale', label: `Not used by any link, added ${fmt.d(new Date(val.created + 'T00:00:00'), { month: 'short', day: 'numeric', year: 'numeric' })}` });
      return { id: `${p.key}:${val.v}`, p, val, v: val.v, status: val.status, links: links.length, clicks: links.reduce((a, r) => a + r.clicks, 0), last: lastUsed(links), issues, created: val.created };
    });
    // Seen in links but never saved: the builder let someone type it, or it came in via import.
    if (!p.custom) { const seen = new Set(p.values.map(x => x.v)); const extra = {};
      Q.linksAll.rows.forEach(r => { const v = r.link[p.key]; if (v && !seen.has(v)) (extra[v] = extra[v] || []).push(r); });
      Object.entries(extra).forEach(([v, links]) => rows.push({ id: `${p.key}:${v}`, p, val: null, v, status: 'unplanned', links: links.length, clicks: links.reduce((a, r) => a + r.clicks, 0), last: lastUsed(links), issues: [{ type: 'unplanned', label: `Used by ${links.length} link${links.length === 1 ? '' : 's'} but not in this list, so members can't pick it`, fix: 'add' }], created: links.map(r => r.link.created).sort()[0] })); }
    let out = rows;
    if (!opts.all) {
      if (q) out = out.filter(r => [r.v, r.val && r.val.pretty, r.val && r.val.desc, r.val && r.val.by].some(s => s && s.toLowerCase().includes(q)));
      const { key, dir } = state.lsort;
      out.sort((a, b) => { let v = 0; if (key === 'value') v = a.v.localeCompare(b.v, undefined, { sensitivity: 'base' }); else if (key === 'created') v = a.created < b.created ? -1 : a.created > b.created ? 1 : 0; else if (key === 'last') v = (a.last || 0) - (b.last || 0); else v = a[key] - b[key]; if (!v && key !== 'value') v = a.v.localeCompare(b.v); return v * dir; });
    }
    return out;
  }
  const childOf = p => PARAMS.find(c => c.deps && c.deps.parent === p.key);
  // Which parent values allow this child value (null = not restricted by any grouping)
  function allowedBy(p, v) { if (!p.deps) return null; return Object.entries(p.deps.allow).filter(([, vs]) => vs.includes(v)).map(([k]) => k); }

  function ruleChips(p) { return p.rules.map(r => `<span class="rule-pill" title="${esc(RULE_LABEL[r][1])}">${r === 'dropdown' ? PI.lock : r === 'required' ? '<b>*</b>' : r === 'lowercase' ? '<b>aa</b>' : I.check}${RULE_LABEL[r][0]}</span>`).join(''); }
  // Rail icons: one simple glyph per standard UTM field, a shared one for custom fields
  const P_ICON = {
    campaign: '<svg viewBox="0 0 24 24"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12"/></svg>',
    medium: '<svg viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5"/></svg>',
    source: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    content: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-9 9"/></svg>',
    term: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>',
    custom: '<svg viewBox="0 0 24 24"><path d="M8 4H6a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-2"/></svg>',
  };
  function railHTML() {
    const q = state.lq.trim().toLowerCase();
    const item = p => { const n = p.values.length; const m = q ? paramValueRows(p, { all: true }).filter(r => [r.v, r.val && r.val.pretty].some(s => s && s.toLowerCase().includes(q))).length : null;
      return `<button class="pm-item ${p.key === state.param ? 'on' : ''} ${p.shown ? '' : 'hidden-p'}" data-pm="${esc(p.key)}" role="tab" aria-selected="${p.key === state.param}">
        <span class="grip" title="Drag to reorder (order = link builder order)">${PI.grip}</span>
        <span class="pi ${p.custom ? 'cus' : 'p-' + esc(p.key)}" aria-hidden="true">${P_ICON[p.custom ? 'custom' : p.key] || P_ICON.custom}</span>
        <span class="txt"><span class="k">${esc(p.utm)}</span><span class="l">${esc(p.label)}${p.shown ? '' : `<span class="off" title="Hidden in the link builder (set in Rules)">${PI.eyeOff}</span>`}</span></span>
        <span class="cnt">${m != null ? `<b class="num ${m ? 'hit' : ''}">${m}</b><span class="sm-muted">of ${n}</span>` : `<b class="num">${p.values.length ? n : '–'}</b>`}</span></button>`; };
    const std = PARAMS.filter(p => !p.custom), cus = PARAMS.filter(p => p.custom);
    return `<aside class="card pm-rail" aria-label="Parameters">
      <button class="btn primary pm-add" id="pm-add-param">${PI.plus}Add parameter</button>
      <div class="pm-sec">Standard UTM</div>${std.map(item).join('')}
      <div class="pm-sec">Custom <span class="sm-muted" style="font-weight:400;text-transform:none;letter-spacing:0">· Professional</span></div>${cus.map(item).join('')}
      <div class="pm-foot">Top to bottom is the order fields appear in the link builder.</div></aside>`;
  }
  function paramHeadHTML(p) {
    return `<div class="card pm-head">
      <div class="pm-title"><div class="txt"><h2><span class="k">${esc(p.utm)}</span>${esc(p.label)}${p.custom ? '<span class="tag">Custom</span>' : ''}${p.common ? '<span class="tag" title="Added to every new workspace">All workspaces</span>' : ''}</h2>
          <p>${esc(p.desc)}</p></div>
        <div class="pm-ctl">
          <button class="btn" id="pm-edit">${I.edit}Edit</button><button class="tb-btn icon" id="pm-more" aria-haspopup="menu" aria-expanded="false" aria-label="More">${I.more}</button></div></div>
      <div class="pm-meta"><span class="rule-pill fmt" title="Field format">${FORMATS[p.format]}</span>${p.shown ? '' : `<span class="rule-pill hid" title="Hidden from the link builder by a rule. Existing links keep it.">${PI.eyeOff}Hidden in builder</span>`}${ruleChips(p)}${p.rules.length || p.format !== 'text' ? '' : '<span class="sm-muted">Free text, no rules</span>'}<a class="pm-rules-link" href="#" data-nav-rules>${I.rules}Builder rules are set in Rules</a></div>
</div>`;
  }
  function valueRowHTML(r, i) {
    const p = r.p; const val = r.val; const sel = state.sel.has(r.id);
    const parents = allowedBy(p, r.v); const child = childOf(p); const narrows = child && child.deps.allow[r.v];
    const grp = r.status === 'unplanned' ? '' : parents ? (parents.length ? `<span class="grp-chip" data-pv-grp="${esc(r.v)}" title="Shown in the builder only after ${esc(paramOf(p.deps.parent).label.toLowerCase())} is ${parents.join(' or ')}">${PI.branch}<span class="k">${esc(paramOf(p.deps.parent).label.toLowerCase())}:</span>${parents.slice(0, 2).map(x => `<b>${esc(x)}</b>`).join(', ')}${parents.length > 2 ? `<span class="k">+${parents.length - 2}</span>` : ''}</span>` : `<span class="grp-chip none" data-pv-grp="${esc(r.v)}" title="Not in any grouping: always available">${PI.branch}any ${esc(paramOf(p.deps.parent).label.toLowerCase())}</span>`)
      : narrows ? `<span class="grp-chip" data-pv-grp="${esc(r.v)}" title="Picking this narrows ${esc(child.label.toLowerCase())} to ${narrows.length} value${narrows.length === 1 ? '' : 's'}">${PI.branch}<span class="k">narrows ${esc(child.label.toLowerCase())} to</span><b>${narrows.length}</b></span>` : '';
    const status = r.status === 'unplanned' ? '<span class="status-pill warn">Not saved</span>' : r.issues.length ? `<span class="status-pill warn" title="${esc(r.issues[0].label)}">${r.issues[0].type === 'dup' ? 'Duplicate?' : r.issues[0].type === 'stale' ? 'Unused' : 'Check'}</span>` : daysAgo(r.created) <= 14 ? '<span class="status-pill">New</span>' : '';
    const acts = r.status === 'unplanned' ? `<button class="btn sm" data-fix="add" data-pv-id="${esc(r.id)}">${PI.plus}Add to list</button><button class="icon-btn" data-pv-more="${esc(r.id)}" title="More" aria-haspopup="menu">${I.more}</button>`
      : `<button class="icon-btn" data-pv-edit="${esc(r.id)}" title="Edit value">${I.edit}</button><button class="icon-btn" data-pv-grp="${esc(r.v)}" title="Groupings">${PI.branch}</button><button class="icon-btn" data-pv-more="${esc(r.id)}" title="More" aria-haspopup="menu">${I.more}</button>`;
    return `<div class="lrow prow ${sel ? 'sel' : ''} ${r.status === 'unplanned' ? 'unplanned' : ''}" data-pv="${esc(r.id)}" role="row" tabindex="0" style="animation-delay:${Math.min(i, 12) * 20}ms">
      <span class="cb ${sel ? 'on' : ''} ${r.status === 'unplanned' ? 'dis' : ''}" role="checkbox" aria-checked="${sel}" ${r.status === 'unplanned' ? '' : `data-sel="${esc(r.id)}"`} tabindex="-1">${I.check}</span>
      <div class="pv"><span class="pv-v"><span class="code v">${esc(r.v)}</span>${status}</span><span class="pv-sub">${val && val.pretty ? `<span class="pretty" title="Pretty name: what members see in the builder">${esc(val.pretty)}</span>` : ''}${val && val.pretty && val.desc ? '<span class="dotsep">·</span>' : ''}${val && val.desc ? `<span>${esc(val.desc)}</span>` : ''}${r.issues.length && !(val && (val.pretty || val.desc)) ? `<span class="issue" title="${esc(r.issues[0].label)}">${esc(r.issues[0].label)}</span>` : ''}</span></div>
      <div class="pgrp">${grp}</div>
      <div class="uses">${r.links ? `<button class="n" data-pv-links="${esc(r.id)}" title="Show these links"><b class="num">${r.links}</b> link${r.links === 1 ? '' : 's'}</button><span class="sm-muted num">${fmt.n(r.clicks)} clicks</span>` : '<span class="untagged">Not used yet</span>'}</div>
      <div class="last">${r.last ? `<span>${fmt.d(r.last)}</span><span class="sm-muted">${daysSince(r.last) === 0 ? 'today' : daysSince(r.last) === 1 ? 'yesterday' : daysSince(r.last) + 'd ago'}</span>` : '<span class="untagged">–</span>'}</div>
      <div class="who">${val ? `${avatar(val.by)}<span class="txt"><span>${fmt.d(new Date(val.created + 'T00:00:00'), { month: 'short', day: 'numeric', year: 'numeric' })}</span><span class="sm-muted">${esc(val.by)}</span></span>` : `<span class="txt"><span class="sm-muted">first seen</span><span>${fmt.d(new Date(r.created + 'T00:00:00'), { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>`}</div>
      <div class="acts">${acts}</div></div>`;
  }
  function paramValuesCard(p = curParam()) {
    const rows = paramValueRows(p); const all = paramValueRows(p, { all: true });
    const sortBtn = (key, label) => `<button data-lsort="${key}" class="${state.lsort.key === key ? 'on' : ''} ${state.lsort.key === key && state.lsort.dir === 1 ? 'asc' : ''}">${label}${I.sort}</button>`;
    const head = `<div class="lrow prow head" role="row"><span class="cb" id="sel-all" role="checkbox" aria-checked="false" title="Select all">${I.check}</span><div>${sortBtn('value', 'Value')}</div><div>Groupings</div><div>${sortBtn('links', 'Used by')}</div><div>${sortBtn('last', 'Last used')}</div><div>${sortBtn('created', 'Added')}</div><div></div></div>`;
    const empty = !p.values.length && !all.length ? `<div class="empty" style="min-height:180px"><strong>No saved values yet</strong>${p.format === 'number' ? 'Members type a number per link. Add values here to offer a dropdown instead.' : 'Add values above, paste a list, or import a CSV.'}</div>`
      : `<div class="empty" style="min-height:160px"><strong>No values match</strong>Try a different search.${state.lq ? `<div style="margin-top:10px"><button class="btn" id="pm-clear">Show all values</button></div>` : ''}</div>`;
    return `<section class="card" id="list-table">${bulkBarHTML()}<div class="ltable">${head}${rows.length ? rows.map(valueRowHTML).join('') : empty}</div>
      <div class="tbl-foot"><span>Showing ${rows.length} of ${all.length} values${state.lq ? ` matching “${esc(state.lq)}”` : ''}</span><span class="grow"></span><span>Click a row to edit · ${p.rules.includes('dropdown') ? 'members can only pick from this list' : 'members can also type a new value'}</span></div></section>`;
  }
  const pviewSeg = () => `<div class="seg pm-view" role="tablist" aria-label="View"><button type="button" data-pview="board" class="${state.pview === 'list' ? '' : 'on'}">${PI.branch}Board</button><button type="button" data-pview="list" class="${state.pview === 'list' ? 'on' : ''}">${PI.list}List</button></div>`;
  function parametersHTML() {
    if (state.pview !== 'list') return boardPageHTML();
    state.ptab = 'values';
    const p = curParam(); const s = PSORTS.find(x => x[0] === state.lsort.key) || PSORTS[0];
    const bar = listBarHTML(`Search ${p.label.toLowerCase()} values, pretty names, people…`, `<button class="tb-btn" id="lsort-btn" aria-haspopup="menu" aria-expanded="false">${I.sort}${s[1]}<span class="chev">${I.chev}</span></button>${pviewSeg()}<button class="tb-btn icon" id="pm-page-more" aria-haspopup="menu" aria-expanded="false" aria-label="Import, export and more" title="Import, export and more">${I.more}</button>`);
    const tools = state.ptab === 'values' ? `
      <form class="pm-addrow" id="pv-add-form" autocomplete="off"><label class="ic" for="pv-add" title="Add a value">${PI.plus}</label><div class="pm-addtxt"><input id="pv-add" placeholder="Add a ${esc(p.label.toLowerCase())} value…" aria-label="Add value" ${p.format === 'number' ? 'inputmode="numeric"' : ''}><span class="hint" id="pv-hint">${esc(p.hint)} · ${p.rules.includes('lowercase') ? 'lowercase · ' : ''}${p.format === 'number' ? 'numbers only · ' : ''}spaces become “-” · paste a list to add several</span></div><button class="btn sm pm-addbtn" type="submit">${PI.plus}Add value</button></form>` : '';
    return `<div class="view"><div class="page-head"><div class="title"><h1>Parameters</h1><span class="sm-muted">${PARAMS.length} parameters</span></div></div>
      ${bar}
      <div class="pm-layout">${railHTML()}<div class="pm-main">${paramHeadHTML(p)}${state.ptab === 'values' ? tools + paramValuesCard(p) : groupingsHTML(p)}</div></div></div>`;
  }

  /* ---------- Parameters board: every parameter side by side, groupings drawn as lines ----------
     A grouping links a value to values in the next column (e.g. medium "cpc" → source "google", "bing").
     Hover a value to trace its chain. Click it, then tick values in a neighbouring column to group them. */
  const BK = (k, v) => k + '\u0001' + v;
  let pbHover = null, pbEdges = [];
  const pbTag = r => r.status === 'unplanned' ? ['warn', 'Not saved'] : r.issues.length ? ['warn', r.issues[0].type === 'dup' ? 'Duplicate?' : r.issues[0].type === 'stale' ? 'Unused' : 'Check'] : daysAgo(r.created) <= 14 ? ['', 'New'] : null;
  // Which neighbouring column a parameter can group with: the one to its left as parent, the one to its right as child.
  function pbNeighbours(p) {
    const i = PARAMS.indexOf(p); const L = PARAMS[i - 1], R = PARAMS[i + 1];
    return { L: L && (!p.deps || p.deps.parent === L.key) ? L : null, R: R && (!R.deps || R.deps.parent === p.key) ? R : null };
  }
  function pbChain(key, v) {
    const on = new Set([BK(key, v)]); const idx = PARAMS.findIndex(p => p.key === key); let cur = [v];
    for (let i = idx; i > 0; i--) { const c = PARAMS[i], L = PARAMS[i - 1]; if (!c.deps || c.deps.parent !== L.key) break; const nx = new Set(); cur.forEach(x => Object.entries(c.deps.allow).forEach(([pv, vs]) => { if (vs.includes(x)) nx.add(pv); })); if (!nx.size) break; nx.forEach(x => on.add(BK(L.key, x))); cur = [...nx]; }
    cur = [v];
    for (let i = idx; i < PARAMS.length - 1; i++) { const P = PARAMS[i], R = PARAMS[i + 1]; if (!R.deps || R.deps.parent !== P.key) break; const nx = new Set(); cur.forEach(x => (R.deps.allow[x] || []).forEach(y => nx.add(y))); if (!nx.size) break; nx.forEach(y => on.add(BK(R.key, y))); cur = [...nx]; }
    return on;
  }
  function pbToggle(child, parent, pv, cv) {
    if (!child.deps) child.deps = { parent: parent.key, allow: {} };
    const was = child.deps.allow[pv]; const a = was || [];
    child.deps.allow[pv] = a.includes(cv) ? a.filter(x => x !== cv) : [...a, cv];
    if (!child.deps.allow[pv].length) { delete child.deps.allow[pv]; toast(`${parent.label} “${pv}” shows every ${child.label.toLowerCase()} again`); }
    else if (!was) toast(`${parent.label} “${pv}” now only offers the ${child.label.toLowerCase()} values grouped with it`);
    if (!Object.keys(child.deps.allow).length) child.deps = null;
  }
  function pbRowHTML(r) {
    const val = r.val; const tag = pbTag(r);
    return `<div class="pb-v ${r.status === 'unplanned' ? 'unplanned' : ''}" data-bk="${esc(r.p.key)}" data-bv="${esc(r.v)}" tabindex="0" title="${r.links ? `Used by ${r.links} link${r.links === 1 ? '' : 's'} · ${fmt.n(r.clicks)} clicks` : 'Not used by any link yet'}">
      <button type="button" class="pb-lk" tabindex="-1" aria-label="Group with the selected value">${I.check}</button>
      <span class="v">${esc(r.v)}</span>${val && val.pretty ? `<span class="pn">${esc(val.pretty)}</span>` : ''}<span class="grow"></span>
      ${tag ? `<span class="pb-tag ${tag[0]}">${tag[1]}</span>` : ''}<span class="n">${r.links || ''}</span></div>`;
  }
  function pbColHTML(p) {
    const q = state.lq.trim().toLowerCase(); const all = paramValueRows(p, { all: true });
    const rows = q ? all.filter(r => [r.v, r.val && r.val.pretty].some(x => x && x.toLowerCase().includes(q))) : all;
    const rules = [p.rules.includes('required') && '<span title="Required in the builder">Required</span>', p.rules.includes('dropdown') && `<span class="ico" title="List only: members can only pick from this list">${PI.lock}</span>`, p.rules.includes('lowercase') && '<span title="Forced to lowercase">aa</span>'].filter(Boolean).join('');
    const dep = p.deps ? `<span class="dep" title="Values here are grouped under ${esc(paramOf(p.deps.parent).label.toLowerCase())}">${PI.branch}by ${esc(paramOf(p.deps.parent).label.toLowerCase())}</span>` : '';
    const add = state.padd === p.key ? `<form class="pb-add" data-badd-form="${esc(p.key)}" autocomplete="off"><input data-badd-in="${esc(p.key)}" placeholder="${esc(p.hint || 'New value')}" aria-label="New ${esc(p.label.toLowerCase())} value" spellcheck="false" ${p.format === 'number' ? 'inputmode="numeric"' : ''}><span class="sm-muted">Enter to add · Esc to close</span></form>`
      : `<button type="button" class="pb-addbtn" data-badd="${esc(p.key)}">${PI.plus}Add ${esc(p.label.toLowerCase())}</button>`;
    return `<section class="pb-col ${p.shown ? '' : 'hid'}" data-bcol="${esc(p.key)}">
      <div class="pb-h">${lbIcon(p)}<button type="button" class="t" data-bedit="${esc(p.key)}" title="Edit parameter"><b>${esc(p.label)}</b><span class="k">${esc(p.utm)}</span></button><span class="cnt">${p.values.length}</span><button type="button" class="icon-btn" data-bmore="${esc(p.key)}" aria-label="${esc(p.label)} options" aria-haspopup="menu">${I.more}</button></div>
      <div class="pb-r">${p.shown ? '' : `<span class="hid">${PI.eyeOff}Hidden in builder</span>`}${rules}${dep}</div>
      <div class="pb-list">${rows.map(pbRowHTML).join('') || `<div class="pb-empty">${q ? 'No matches' : p.format === 'number' ? 'Typed per link. No saved values.' : 'No values yet'}</div>`}</div>${add}</section>`;
  }
  function pbBarHTML() {
    const s = state.psel; const p = s && paramOf(s.key); const r = p && paramValueRows(p, { all: true }).find(x => x.v === s.v);
    if (!r) { state.psel = null; return `<div class="pb-bar" id="pb-bar" hidden></div>`; }
    const { L, R } = pbNeighbours(p); const bits = [];
    if (p.deps) { const par = paramOf(p.deps.parent); const ps = allowedBy(p, r.v); bits.push(ps.length ? `Offered when ${esc(par.label.toLowerCase())} is ${ps.map(x => `<b>${esc(x)}</b>`).join(', ')}` : `Offered for every ${esc(par.label.toLowerCase())}`); }
    const kid = childOf(p); if (kid) { const a = kid.deps.allow[r.v]; bits.push(a ? `Narrows ${esc(kid.label.toLowerCase())} to ${a.map(x => `<b>${esc(x)}</b>`).join(', ')}` : `Shows every ${esc(kid.label.toLowerCase())}`); }
    const how = [L, R].filter(Boolean).map(x => esc(x.label.toLowerCase())).join(' or ');
    return `<div class="pb-bar on" id="pb-bar">${lbIcon(p)}<span class="who"><b class="code">${esc(r.v)}</b>${r.val && r.val.pretty ? `<span class="sm-muted">${esc(r.val.pretty)}</span>` : ''}</span>
      <span class="sm-muted">${r.links ? `${r.links} link${r.links === 1 ? '' : 's'} · ${fmt.n(r.clicks)} clicks` : 'not used yet'}</span>
      <span class="what">${bits.join('<span class="dotsep">·</span>') || (how ? `Tick a ${how} value to group it with <b>${esc(r.v)}</b>` : 'No neighbouring column to group with')}</span><span class="grow"></span>
      ${r.status === 'unplanned' ? '<button class="btn sm primary" data-bact="add">Add to list</button>' : `${r.links && !p.custom ? '<button class="btn sm" data-bact="links">Show links</button>' : ''}<button class="btn sm" data-bact="edit">${I.edit}Edit</button><button class="icon-btn" data-bact="delete" title="Delete value">${PI.trash}</button>`}<button class="icon-btn" data-bact="close" title="Done (Esc)">${I.close}</button></div>`;
  }
  // "How grouping works": the legend and steps that used to sit above the board, on demand.
  function pbHowPop(anchor) {
    openPop(anchor, `<div class="pb-how">
      <h4>How grouping works</h4>
      <p>Grouping decides which values the link builder offers. Pick <b class="code">paid_social</b> as the medium, and the source list only shows the sources grouped with it.</p>
      <ol><li><b>Hover</b> a value to trace what it's grouped with across columns.</li><li><b>Click</b> it to select it. Its details appear at the bottom.</li><li><b>Tick</b> values in the next column to group or ungroup them. <kbd>Esc</kbd> finishes.</li></ol>
      <div class="pb-how-key"><span><i class="ln"></i>Grouped</span><span><i class="ln on"></i>Selected value's chain</span></div>
      <p class="pb-how-note">Columns run left to right in the order fields appear in the link builder.</p></div>`, { align: 'right', role: 'dialog' });
  }
  const pbAreaHTML = () => `<div class="pb-area" id="list-table"><div class="pb-scroll" id="pb-scroll"><div class="pb-edge l"><button type="button" class="pb-more" data-pbmore="-1" aria-label="Scroll to earlier columns">${I.chevR}<span></span></button></div><div class="pb-edge r"><button type="button" class="pb-more" data-pbmore="1" aria-label="Scroll to more columns"><span></span>${I.chevR}</button></div><div class="pb" id="pb"><svg class="pb-svg" id="pb-svg" aria-hidden="true"></svg>${PARAMS.map(pbColHTML).join('')}<button type="button" class="pb-ghost" id="pm-add-param">${PI.plus}Add parameter</button></div></div></div>`;
  function boardPageHTML() {
    const grouped = PARAMS.filter(p => p.deps).length;
    return `<div class="view"><div class="page-head"><div class="title"><h1>Parameters</h1><span class="sm-muted">${PARAMS.length} parameters · ${grouped ? `${grouped} grouped` : 'no groupings yet'}</span></div>
</div>
      ${listBarHTML("Search every parameter's values…", `${pviewSeg()}<button class="tb-btn icon" id="pm-page-more" aria-haspopup="menu" aria-expanded="false" aria-label="Import, export and more" title="Import, export and more">${I.more}</button>`)}
      ${pbAreaHTML()}</div>${pbBarHTML()}`; // bar sits outside .view so it can float over the page
  }
  // Lines: measured after layout, redrawn on resize, search and grouping changes.
  // More columns off to the side? Fade that edge and show a small arrow naming the next hidden column.
  function pbScrollHints() {
    const wrap = $('#pb'), box = $('#pb-scroll'); if (!wrap || !box) return;
    const r = wrap.getBoundingClientRect(), cols = $$('.pb-col', wrap);
    const left = wrap.scrollLeft > 4, right = wrap.scrollLeft + wrap.clientWidth < wrap.scrollWidth - 4;
    box.classList.toggle('more-l', left); box.classList.toggle('more-r', right);
    const nextR = cols.find(c => c.getBoundingClientRect().right > r.right + 4), nextL = [...cols].reverse().find(c => c.getBoundingClientRect().left < r.left - 4);
    const name = c => c ? (paramOf(c.dataset.bcol) || {}).label || '' : '';
    const rest = cols.filter(c => c.getBoundingClientRect().left > r.right - 40).length;
    $('.pb-edge.r span', box).textContent = nextR ? `${name(nextR)}${rest > 1 ? ` +${rest - 1}` : ''}` : '';
    $('.pb-edge.l span', box).textContent = name(nextL);
  }
  document.addEventListener('scroll', e => { if (e.target && e.target.id === 'pb') pbScrollHints(); }, true);
  function pbDraw() {
    const wrap = $('#pb'); if (!wrap) return; const svg = $('#pb-svg', wrap); const box = wrap.getBoundingClientRect();
    const els = new Map(); $$('.pb-v', wrap).forEach(el => { el.classList.remove('pl', 'pr'); els.set(BK(el.dataset.bk, el.dataset.bv), el); });
    const pt = (el, side) => { const r = el.getBoundingClientRect(); return [(side === 'r' ? r.right : r.left) - box.left + wrap.scrollLeft, r.top + r.height / 2 - box.top + wrap.scrollTop]; };
    pbEdges = []; let d = '';
    PARAMS.forEach((R, i) => { const L = PARAMS[i - 1]; if (!L || !R.deps || R.deps.parent !== L.key) return;
      Object.entries(R.deps.allow).forEach(([pv, vs]) => { const a = els.get(BK(L.key, pv)); if (!a) return; vs.forEach(cv => { const b = els.get(BK(R.key, cv)); if (!b) return;
        const [x1, y1] = pt(a, 'r'), [x2, y2] = pt(b, 'l'); const c = (x2 - x1) * .5; a.classList.add('pr'); b.classList.add('pl');
        d += `<path data-i="${pbEdges.length}" d="M${x1} ${y1}C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}"/>`; pbEdges.push({ a: BK(L.key, pv), b: BK(R.key, cv) }); }); }); });
    svg.setAttribute('width', wrap.scrollWidth); svg.setAttribute('height', wrap.scrollHeight); svg.innerHTML = d; pbApply();
    pbScrollHints();
  }
  function pbApply() {
    const wrap = $('#pb'); if (!wrap) return; const f = pbHover || state.psel; const chain = f ? pbChain(f.key, f.v) : null;
    wrap.classList.toggle('focus', !!chain); wrap.classList.toggle('pinned', !!state.psel);
    $$('.pb-v', wrap).forEach(el => { const id = BK(el.dataset.bk, el.dataset.bv); el.classList.toggle('hl', !!chain && chain.has(id)); el.classList.toggle('me', !!f && el.dataset.bk === f.key && el.dataset.bv === f.v); el.classList.toggle('sel', !!state.psel && el.dataset.bk === state.psel.key && el.dataset.bv === state.psel.v); });
    $$('path', $('#pb-svg', wrap)).forEach(pth => { const e = pbEdges[+pth.dataset.i]; pth.classList.toggle('on', !!chain && chain.has(e.a) && chain.has(e.b)); });
    $$('.pb-col', wrap).forEach(c => { c.classList.toggle('dim', !!chain && !!$('.pb-v.hl', c)); c.classList.remove('link-l', 'link-r'); $$('.pb-lk.on', c).forEach(b => b.classList.remove('on')); });
    const s = state.psel; const p = s && paramOf(s.key); if (!p) return; const { L, R } = pbNeighbours(p);
    if (L) { const c = $(`[data-bcol="${CSS.escape(L.key)}"]`, wrap); c.classList.add('link-r'); $$('.pb-v', c).forEach(el => { if (p.deps && (p.deps.allow[el.dataset.bv] || []).includes(s.v)) $('.pb-lk', el).classList.add('on'); }); }
    if (R) { const c = $(`[data-bcol="${CSS.escape(R.key)}"]`, wrap); c.classList.add('link-l'); $$('.pb-v', c).forEach(el => { if (R.deps && (R.deps.allow[s.v] || []).includes(el.dataset.bv)) $('.pb-lk', el).classList.add('on'); }); }
  }
  // Redraw just the board, keeping its sideways scroll.
  function pbRefresh(focusAdd) {
    const old = $('.pb-area'); if (!old) return; const x = $('#pb') ? $('#pb').scrollLeft : 0;
    old.outerHTML = pbAreaHTML(); const bar = $('#pb-bar'); if (bar) bar.outerHTML = pbBarHTML(); const wrap = $('#pb'); wrap.scrollLeft = x; pbDraw();
    const sub = $('.page-head .title .sm-muted'); if (sub) { const g = PARAMS.filter(p => p.deps).length; sub.textContent = `${PARAMS.length} parameters · ${g ? g + ' grouped' : 'no groupings yet'}`; }
    if (focusAdd) { const i = $(`[data-badd-in="${CSS.escape(focusAdd)}"]`); if (i) i.focus(); }
  }
  function pbClick(e) {
    const hit = s => e.target.closest(s); let el;
    if ((el = hit('[data-bmore]'))) { paramMoreMenu(el, paramOf(el.dataset.bmore)); return true; }
    if ((el = hit('[data-bedit]'))) { paramModal(paramOf(el.dataset.bedit)); return true; }
    if ((el = hit('[data-badd]'))) { state.padd = el.dataset.badd; pbRefresh(state.padd); return true; }
    if (hit('.pb-add')) return true;
    if ((el = hit('[data-bact]'))) { const s = state.psel; const p = paramOf(s.key); const r = paramValueRows(p, { all: true }).find(x => x.v === s.v); const a = el.dataset.bact;
      if (a === 'close') { state.psel = null; pbRefresh(); } else if (a === 'edit') editValueModal(p, r.v); else if (a === 'links') showValueLinks(p, r.v); else if (a === 'delete') confirmDeleteValue(p, r); else if (a === 'add') { applyFix(p, r, { fix: 'add' }); pbRefresh(); }
      return true; }
    if ((el = hit('.pb-v'))) {
      const k = el.dataset.bk, v = el.dataset.bv; const s = state.psel;
      if (hit('.pb-lk') && s) { const me = paramOf(s.key), them = paramOf(k); const { L, R } = pbNeighbours(me);
        if (them === L) pbToggle(me, L, v, s.v); else if (them === R) pbToggle(R, me, s.v, v); pbRefresh(); return true; }
      state.psel = s && s.key === k && s.v === v ? null : { key: k, v }; pbHover = null; $('#pb-bar').outerHTML = pbBarHTML(); pbApply(); return true; }
    if (hit('#pb') && !hit('button') && state.psel) { state.psel = null; $('#pb-bar').outerHTML = pbBarHTML(); pbApply(); return true; }
    return false;
  }

  /* Parameters: actions */
  function goParam(key, tab) { state.param = key; if (tab) state.ptab = tab; state.sel.clear(); state.lq = ''; render(); }
  function normalizeValue(p, raw) { let v = raw.trim().replace(/\s+/g, '-'); if (p.rules.includes('lowercase')) v = v.toLowerCase(); return v; }
  function validateValue(p, raw) {
    const v = normalizeValue(p, raw); if (!v) return { ok: false };
    if (p.format === 'number' && !/^\d+$/.test(v)) return { ok: false, msg: 'Numbers only for this parameter' };
    const exact = p.values.find(x => x.v === v); if (exact) return { ok: false, msg: `“${v}” is already in the list` };
    const twin = p.values.find(x => x.status !== 'archived' && x.v.toLowerCase() === v.toLowerCase()); if (twin) return { ok: false, msg: `“${twin.v}” already exists with different capitals` };
    const changed = v !== raw.trim(); return { ok: true, v, msg: changed ? `Will be saved as “${v}”` : '' };
  }
  function addValues(p, raws, opts = {}) {
    const added = []; raws.forEach(raw => { const r = validateValue(p, raw); if (r.ok) { p.values.push({ v: r.v, pretty: opts.pretty || '', desc: opts.desc || '', by: 'Tyler Berry', created: todayISO(), status: 'active' }); added.push(r.v); } });
    return added;
  }
  function editValueModal(p, v) {
    const val = p.values.find(x => x.v === v); const row = paramValueRows(p, { all: true }).find(r => r.v === v) || { links: 0, clicks: 0 };
    const parents = allowedBy(p, v);
    openModal(`<div class="modal-h"><h3>Edit value<span class="sub"><span class="code">${esc(p.utm)}</span></span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b">
        <div class="field"><label for="ev-v">Value <span class="sm-muted">what goes in the URL</span></label><div class="search"><input id="ev-v" value="${esc(val.v)}" spellcheck="false"></div><span class="sm-muted" id="ev-hint" style="white-space:normal">${row.links ? `Renaming updates the dropdown and templates only. The ${row.links} existing link${row.links === 1 ? '' : 's'} keep “${esc(val.v)}”.` : 'Not used by any link yet, so renaming is safe.'}</span></div>
        <div class="field"><label for="ev-p">Pretty name <span class="sm-muted">what members see in the builder (optional)</span></label><div class="search"><input id="ev-p" value="${esc(val.pretty)}" placeholder="e.g. ${esc(p.key === 'source' ? 'LinkedIn' : p.key === 'region' ? 'North America' : 'Fall sale 2026')}" style="font-family:var(--font-ui)"></div></div>
        <div class="field"><label for="ev-d">Description <span class="sm-muted">when to use it (optional)</span></label><div class="search"><input id="ev-d" value="${esc(val.desc)}" placeholder="Shown as help text in the builder" style="font-family:var(--font-ui)"></div></div>
        ${p.deps ? `<div class="field"><label>Available when <span class="code">${esc(paramOf(p.deps.parent).utm)}</span> is</label><div class="ev-grp">${parents.length ? parents.map(x => `<span class="kid">${esc(x)}</span>`).join('') : '<span class="untagged">any value (not in a grouping)</span>'}<button class="btn sm" id="ev-grp">${PI.branch}Edit groupings</button></div></div>` : ''}
        <div class="tpl-foot"><span class="sm-muted">${row.links ? `Used by <b>${row.links}</b> link${row.links === 1 ? '' : 's'} · ${fmt.n(row.clicks)} clicks` : 'Not used by any link'} · added ${fmt.d(new Date(val.created + 'T00:00:00'), { month: 'short', day: 'numeric', year: 'numeric' })} by ${esc(val.by)}</span><span class="grow"></span>
          <button class="btn danger-t" id="ev-del">${I.close}Delete</button><button class="btn primary" id="ev-save">Save</button></div></div>`, { width: 560, onMount(s) {
        const iv = $('#ev-v', s), hint = $('#ev-hint', s);
        iv.addEventListener('input', () => { if (iv.value.trim() === val.v) { hint.textContent = ''; return; } const r = validateValue(p, iv.value); hint.textContent = r.ok ? (r.msg || '') : (r.msg || ''); hint.style.color = r.ok ? '' : 'var(--down)'; $('#ev-save', s).disabled = !r.ok; });
        $('#ev-save', s).addEventListener('click', () => { const nv = iv.value.trim() === val.v ? val.v : validateValue(p, iv.value).v; const old = val.v;
          if (nv !== old) { val.v = nv; if (p.deps) Object.values(p.deps.allow).forEach(a => { const i = a.indexOf(old); if (i > -1) a[i] = nv; }); const c = childOf(p); if (c && c.deps.allow[old]) { c.deps.allow[nv] = c.deps.allow[old]; delete c.deps.allow[old]; } }
          val.pretty = $('#ev-p', s).value.trim(); val.desc = $('#ev-d', s).value.trim(); closeModal(); render(); toast(nv !== old ? `Renamed “${old}” to “${nv}”` : `Saved “${nv}”`); });
        $('#ev-del', s).addEventListener('click', () => { closeModal(); confirmDeleteValue(p, paramValueRows(p, { all: true }).find(r => r.v === val.v)); });
        const g = $('#ev-grp', s); if (g) g.addEventListener('click', () => { closeModal(); groupingPicker(p, val.v); });
        setTimeout(() => $('#ev-p', s).focus(), 60);
      } });
  }
  function mergeModal(p, vs, into) {
    const rows = vs.map(v => paramValueRows(p, { all: true }).find(r => r.v === v)).filter(Boolean);
    const cands = into ? [into, ...vs.filter(v => v !== into)] : vs; let keep = cands[0];
    const body = () => `<div class="choice-list">${cands.map(v => { const r = rows.find(x => x.v === v) || paramValueRows(p, { all: true }).find(x => x.v === v); return `<label class="choice ${v === keep ? 'on' : ''}"><input type="radio" name="keep" value="${esc(v)}" ${v === keep ? 'checked' : ''}><span class="t"><span class="code">${esc(v)}</span><span class="sm-muted">${r ? `${r.links} link${r.links === 1 ? '' : 's'} · ${fmt.n(r.clicks)} clicks${r.val && r.val.pretty ? ' · ' + esc(r.val.pretty) : ''}` : ''}</span></span></label>`; }).join('')}</div>`;
    const losers = () => cands.filter(v => v !== keep); const nLinks = () => losers().reduce((a, v) => { const r = rows.find(x => x.v === v); return a + (r ? r.links : 0); }, 0);
    openModal(`<div class="modal-h"><h3>Merge ${cands.length} values<span class="sub"><span class="code">${esc(p.utm)}</span></span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><p class="sm-muted" style="white-space:normal;margin:4px 0 12px">Keep one value. The others are removed from the list and their groupings move to the kept value.</p><div id="mg-body">${body()}</div>
        <div class="grp-note" id="mg-note"></div>
        <div class="tpl-foot"><span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="mg-ok">Merge</button></div></div>`, { width: 520, onMount(s) {
        const note = () => { $('#mg-note', s).innerHTML = `${I.info}<span><b>${nLinks()}</b> existing link${nLinks() === 1 ? '' : 's'} keep ${losers().map(v => `<span class="code">${esc(v)}</span>`).join(', ')} in their URLs. ${p.custom ? '' : 'Analytics will offer to report them under the kept value.'}</span>`; };
        note(); $('#mg-body', s).addEventListener('change', e => { keep = e.target.value; $('#mg-body', s).innerHTML = body(); note(); });
        $('#mg-ok', s).addEventListener('click', () => { losers().forEach(v => { const i = p.values.findIndex(x => x.v === v); if (i > -1) p.values.splice(i, 1);
            if (p.deps) Object.values(p.deps.allow).forEach(a => { if (a.includes(v) && !a.includes(keep)) a.push(keep); const j = a.indexOf(v); if (j > -1) a.splice(j, 1); });
            const c = childOf(p); if (c && c.deps.allow[v]) { c.deps.allow[keep] = [...new Set([...(c.deps.allow[keep] || []), ...c.deps.allow[v]])]; delete c.deps.allow[v]; } });
          if (!p.values.find(x => x.v === keep)) addValues(p, [keep]);
          closeModal(); state.sel.clear(); render(); toast(`Merged into “${keep}”`); });
      } });
  }
  function applyFix(p, r, i, silent) {
    if (i.fix === 'add') { addValues(p, [r.v]); if (!silent) { render(); toast(`Added “${r.v}” to ${p.label.toLowerCase()}`); } return; }
    if (i.fix === 'rename') { const val = p.values.find(x => x.v === r.v); if (val && !p.values.find(x => x.v === i.to)) { val.v = i.to; } else if (val) { const j = p.values.indexOf(val); p.values.splice(j, 1); } if (!silent) { render(); toast(`Renamed to “${i.to}”`); } return; }
    if (i.fix === 'merge') { const j = p.values.findIndex(x => x.v === r.v); if (j > -1) p.values.splice(j, 1); if (p.deps) Object.values(p.deps.allow).forEach(a => { if (a.includes(r.v) && !a.includes(i.into)) a.push(i.into); const k = a.indexOf(r.v); if (k > -1) a.splice(k, 1); }); if (!silent) { render(); toast(`Merged “${r.v}” into “${i.into}”`); } }
  }
  function valueMenu(anchor, id) {
    const p = curParam(); const r = paramValueRows(p, { all: true }).find(x => x.id === id); if (!r) return;
    const un = r.status === 'unplanned';
    openPop(anchor, `<div class="menu" style="width:240px"><div class="group" style="font-family:var(--font-mono);text-transform:none;letter-spacing:0">${esc(r.v)}</div>
      ${un ? `<button class="mi" data-r="add">${PI.plus}<span class="grow">Add to list</span></button><button class="mi" data-r="mergeinto">${PI.merge}<span class="grow">Merge into an existing value…</span></button>` : `<button class="mi" data-r="edit">${I.edit}<span class="grow">Edit value</span></button><button class="mi" data-r="grp">${PI.branch}<span class="grow">Groupings…</span></button><button class="mi" data-r="merge">${PI.merge}<span class="grow">Merge with…</span></button>`}
      ${r.links ? `<button class="mi" data-r="links">${I.links}<span class="grow">Show ${r.links} link${r.links === 1 ? '' : 's'}</span></button><button class="mi" data-r="analytics">${I.analytics}<span class="grow">Analytics for this value</span></button>` : ''}
      <button class="mi" data-r="copy">${I.copy}<span class="grow">Copy value</span></button>
      <div class="sep"></div>
      ${un ? `<button class="mi" data-r="ignore">${PI.eyeOff}<span class="grow">Ignore (keep unsaved)</span></button>` : ''}
      ${!un ? `<button class="mi danger" data-r="delete">${I.close}<span class="grow">Delete${r.links ? ` <span class="sm-muted">(used by ${r.links})</span>` : ''}</span></button>` : ''}</div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; closePop(); const a = b.dataset.r;
          if (a === 'add') applyFix(p, r, { fix: 'add' }); else if (a === 'edit') editValueModal(p, r.v); else if (a === 'grp') groupingPicker(p, r.v); else if (a === 'merge') mergeWithPicker(p, r.v); else if (a === 'mergeinto') mergeWithPicker(p, r.v, true);
          else if (a === 'links') showValueLinks(p, r.v); else if (a === 'analytics') { if (!p.custom) { state.filters = [{ dim: p.key, op: 'is', values: [r.v] }]; goOverview(); } else toast('Custom parameters aren\'t in Analytics yet'); }
          else if (a === 'copy') copyText(r.v, 'Value copied'); else if (a === 'ignore') toast(`“${r.v}” stays unsaved; it won't be suggested again`);
          else if (a === 'delete') confirmDeleteValue(p, r); });
      } });
  }
  function mergeWithPicker(p, v, intoOnly) {
    const others = p.values.filter(x => x.v !== v && x.status !== 'archived');
    openModal(`<div class="modal-h"><h3>Merge “${esc(v)}” ${intoOnly ? 'into' : 'with'}…</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="search" style="margin:4px 0 8px">${I.search}<input id="mw-q" placeholder="Search values…"></div><div class="vals" id="mw-list" style="max-height:280px">${others.map(o => `<button class="val" data-v="${esc(o.v)}"><span class="lbl"><span class="code">${esc(o.v)}</span>${o.pretty ? `<span class="sm-muted">${esc(o.pretty)}</span>` : ''}</span></button>`).join('')}</div></div>`, { width: 440, onMount(s) {
        const q = $('#mw-q', s); q.addEventListener('input', () => $$('.val', s).forEach(b => { b.hidden = !b.dataset.v.toLowerCase().includes(q.value.toLowerCase()); }));
        $('#mw-list', s).addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; closeModal(); if (intoOnly) mergeModal(p, [b.dataset.v, v], b.dataset.v); else mergeModal(p, [v, b.dataset.v]); });
        setTimeout(() => q.focus(), 60);
      } });
  }
  function confirmDeleteValue(p, r) {
    openModal(`<div class="modal-h"><h3>Delete “${esc(r.v)}”?</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>${r.links ? `<b>${r.links}</b> link${r.links === 1 ? '' : 's'} use this value. They keep working, but the value disappears from the builder and from any grouping. This can't be undone.` : 'Nothing uses this value. It will be removed from the list and from any grouping.'}</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary danger" id="dv-ok">Delete</button></div></div>`, { width: 460, onMount(s) {
        $('#dv-ok', s).addEventListener('click', () => { closeModal(); const j = p.values.findIndex(x => x.v === r.v); if (j > -1) p.values.splice(j, 1); if (p.deps) Object.values(p.deps.allow).forEach(a => { const k = a.indexOf(r.v); if (k > -1) a.splice(k, 1); }); const c = childOf(p); if (c) delete c.deps.allow[r.v]; state.sel.clear(); render(); toast(`Deleted “${r.v}”`); });
      } });
  }
  function showValueLinks(p, v) { if (p.custom) { toast('Custom parameters aren\'t searchable on Links yet'); return; } state.from = 'parameters'; goLinks(); state.filters = [{ dim: p.key, op: 'is', values: [v] }]; render(); }
  // Groupings: for a child value, which parent values allow it (edited from the child, HubSpot-style)
  function groupingPicker(p, v) {
    if (!p.deps) { const c = childOf(p); if (c) { groupingEditor(c, v); return; } chooseParent(p); return; }
    const par = paramOf(p.deps.parent); const pvals = par.values.filter(x => x.status !== 'archived');
    const on = new Set(allowedBy(p, v));
    const row = pv => `<label class="val ${on.has(pv.v) ? 'on' : ''}" data-pv-row="${esc(pv.v)}"><span class="box">${I.check}</span><span class="lbl"><span class="code">${esc(pv.v)}</span>${pv.pretty ? `<span class="sm-muted">${esc(pv.pretty)}</span>` : ''}</span><span class="cnt">${p.deps.allow[pv.v] ? `${p.deps.allow[pv.v].length} allowed` : 'all'}</span></label>`;
    openModal(`<div class="modal-h"><h3>When is “${esc(v)}” available?<span class="sub"><span class="code">${esc(p.utm)}</span></span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><p class="sm-muted" style="white-space:normal;margin:4px 0 10px">Tick the <span class="code">${esc(par.utm)}</span> values that should offer <span class="code">${esc(v)}</span>. Untick all to make it always available.</p>
        <div class="vals" id="gp-list" style="max-height:300px;border:1px solid var(--border);border-radius:8px;padding:4px">${pvals.map(row).join('')}</div>
        <div class="tpl-foot"><span class="sm-muted" id="gp-n">${on.size ? `Available after <b>${on.size}</b> of ${pvals.length} ${esc(par.label.toLowerCase())} values` : 'Always available'}</span><span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="gp-ok">Save</button></div></div>`, { width: 480, onMount(s) {
        $('#gp-list', s).addEventListener('click', e => { const l = e.target.closest('[data-pv-row]'); if (!l) return; e.preventDefault(); const k = l.dataset.pvRow; if (on.has(k)) on.delete(k); else on.add(k); l.classList.toggle('on', on.has(k)); $('#gp-n', s).innerHTML = on.size ? `Available after <b>${on.size}</b> of ${pvals.length} ${esc(par.label.toLowerCase())} values` : 'Always available'; });
        $('#gp-ok', s).addEventListener('click', () => { pvals.forEach(pv => { const a = p.deps.allow[pv.v];
            // a parent without a row offered everything; ticking it keeps that, unticking it narrows to everything but this value
            if (on.has(pv.v)) { if (!a) p.deps.allow[pv.v] = p.values.filter(x => x.status !== 'archived').map(x => x.v); else if (!a.includes(v)) a.push(v); }
            else if (a) { const i = a.indexOf(v); if (i > -1) a.splice(i, 1); } else p.deps.allow[pv.v] = p.values.filter(x => x.status !== 'archived' && x.v !== v).map(x => x.v); });
          closeModal(); render(); toast(`Saved groupings for “${v}”`); });
      } });
  }
  // Groupings: for a parent value, which child values it allows
  function groupingEditor(c, pv) {
    const kids = c.values.filter(x => x.status !== 'archived'); const cur = c.deps.allow[pv]; const on = new Set(cur || kids.map(x => x.v)); let restrict = !!cur;
    const row = k => `<label class="val ${on.has(k.v) ? 'on' : ''}" data-k="${esc(k.v)}"><span class="box">${I.check}</span><span class="lbl"><span class="code">${esc(k.v)}</span>${k.pretty ? `<span class="sm-muted">${esc(k.pretty)}</span>` : ''}</span></label>`;
    openModal(`<div class="modal-h"><h3>When <span class="code">${esc(paramOf(c.deps.parent).utm)}</span> is “${esc(pv)}”</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="choice-list" id="ge-mode"><label class="choice ${restrict ? '' : 'on'}"><input type="radio" name="m" value="all" ${restrict ? '' : 'checked'}><span class="t"><b>Offer every ${esc(c.label.toLowerCase())}</b><span class="sm-muted">No narrowing for this value</span></span></label>
          <label class="choice ${restrict ? 'on' : ''}"><input type="radio" name="m" value="some" ${restrict ? 'checked' : ''}><span class="t"><b>Only these ${esc(c.label.toLowerCase())} values</b><span class="sm-muted">Members see just the ticked values</span></span></label></div>
        <div class="vals" id="ge-list" style="max-height:260px;border:1px solid var(--border);border-radius:8px;padding:4px;${restrict ? '' : 'opacity:.45;pointer-events:none'}">${kids.map(row).join('')}</div>
        <div class="tpl-foot"><span class="sm-muted" id="ge-n"></span><span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="ge-ok">Save</button></div></div>`, { width: 480, onMount(s) {
        const n = () => { $('#ge-n', s).innerHTML = restrict ? `<b>${on.size}</b> of ${kids.length} ${esc(c.label.toLowerCase())} values` : `All ${kids.length} values`; }; n();
        $('#ge-mode', s).addEventListener('change', e => { restrict = e.target.value === 'some'; $$('.choice', s).forEach(ch => ch.classList.toggle('on', ch.querySelector('input').checked)); const l = $('#ge-list', s); l.style.opacity = restrict ? '' : '.45'; l.style.pointerEvents = restrict ? '' : 'none'; n(); });
        $('#ge-list', s).addEventListener('click', e => { const l = e.target.closest('[data-k]'); if (!l) return; e.preventDefault(); const k = l.dataset.k; if (on.has(k)) on.delete(k); else on.add(k); l.classList.toggle('on', on.has(k)); n(); });
        $('#ge-ok', s).addEventListener('click', () => { if (restrict) c.deps.allow[pv] = kids.map(x => x.v).filter(v => on.has(v)); else delete c.deps.allow[pv]; closeModal(); render(); toast(restrict ? `“${pv}” now offers ${on.size} ${c.label.toLowerCase()} value${on.size === 1 ? '' : 's'}` : `“${pv}” offers every ${c.label.toLowerCase()}`); });
      } });
  }
  function chooseParent(p) {
    const cands = PARAMS.filter(x => x.key !== p.key && !(x.deps && x.deps.parent === p.key));
    openModal(`<div class="modal-h"><h3>Narrow ${esc(p.label.toLowerCase())} by…</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><p class="sm-muted" style="white-space:normal;margin:4px 0 10px">Members pick the parent first; the ${esc(p.label.toLowerCase())} list then shows only the values you allow for it. One parent per parameter keeps the builder predictable.</p>
        <div class="choice-list">${cands.map(x => `<label class="choice ${p.deps && p.deps.parent === x.key ? 'on' : ''}"><input type="radio" name="par" value="${esc(x.key)}" ${p.deps && p.deps.parent === x.key ? 'checked' : ''}><span class="t"><b><span class="code">${esc(x.utm)}</span> ${esc(x.label)}</b><span class="sm-muted">${x.values.filter(v => v.status !== 'archived').length} values${x.deps ? ` · itself narrowed by ${esc(paramOf(x.deps.parent).label.toLowerCase())}` : ''}</span></span></label>`).join('')}</div>
        <div class="tpl-foot">${p.deps ? `<button class="btn" id="cp-rm">${I.close}Remove groupings</button>` : ''}<span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="cp-ok" ${p.deps ? '' : 'disabled'}>Continue</button></div></div>`, { width: 480, onMount(s) {
        s.addEventListener('change', () => { $$('.choice', s).forEach(ch => ch.classList.toggle('on', ch.querySelector('input').checked)); $('#cp-ok', s).disabled = false; });
        $('#cp-ok', s).addEventListener('click', () => { const k = (s.querySelector('input[name=par]:checked') || {}).value; if (!k) return; if (!p.deps || p.deps.parent !== k) p.deps = { parent: k, allow: {} }; state.ptab = 'groupings'; closeModal(); render(); toast(`${p.label} is now narrowed by ${paramOf(k).label.toLowerCase()}. Add rows per ${paramOf(k).label.toLowerCase()} value.`); });
        const rm = $('#cp-rm', s); if (rm) rm.addEventListener('click', () => { p.deps = null; closeModal(); render(); toast(`Removed groupings from ${p.label.toLowerCase()}`); });
      } });
  }
  function paramModal(p) {
    const isNew = !p; const d = p || { label: '', utm: '', format: 'text', desc: '', hint: '', shown: true, common: false, custom: true, rules: [] };
    openModal(`<div class="modal-h"><h3>${isNew ? 'Add custom parameter' : `Edit ${esc(d.label)}`}</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b">
        <div class="field" style="margin-top:4px"><label for="pp-l">Name <span class="sm-muted">shown in the builder</span></label><div class="search"><input id="pp-l" value="${esc(d.label)}" placeholder="e.g. Region" style="font-family:var(--font-ui)"></div></div>
        <div class="field"><label for="pp-k">URL key <span class="sm-muted">what goes in the link</span></label><div class="search"><span class="sm-muted">?</span><input id="pp-k" value="${esc(d.utm)}" placeholder="region" ${d.custom ? '' : 'disabled'} spellcheck="false"><span class="sm-muted">=…</span></div>${isNew ? '<span class="sm-muted" id="pp-kh" style="white-space:normal">Lowercase letters, numbers and _ only. Filled in from the name.</span>' : ''}</div>
        <div class="field"><label>Format</label><div class="seg" id="pp-f">${Object.entries(FORMATS).map(([k, l]) => `<button type="button" data-f="${k}" class="${d.format === k ? 'on' : ''}">${l}</button>`).join('')}</div><span class="sm-muted" style="white-space:normal">Text offers your saved values as a dropdown. Date and Number are typed per link and can't hold saved values.</span></div>
        <div class="field"><label for="pp-d">Description <span class="sm-muted">help text in the builder</span></label><div class="search"><input id="pp-d" value="${esc(d.desc)}" placeholder="When members should use it" style="font-family:var(--font-ui)"></div></div>
        <div class="field"><label for="pp-h">Placeholder</label><div class="search"><input id="pp-h" value="${esc(d.hint)}" placeholder="e.g. na, emea…" style="font-family:var(--font-ui)"></div></div>
        ${d.custom ? `<div class="field" style="gap:10px">` : ''}
          ${d.custom ? `<label class="switch ${d.common ? 'on' : ''}" id="pp-common"><i></i><span>Add to every new workspace <span class="sm-muted">(common parameter)</span></span></label></div>` : ''}
        <div class="grp-note" style="margin-top:14px">${I.rules}<span>Required, hidden, dropdown-only, lowercase and length limits are set per member group on <b>Rules</b>, so the same parameter can be strict for some teams and open for others.</span></div>
        <div class="tpl-foot">${!isNew && d.custom ? `<button class="btn" id="pp-del">${I.close}Delete parameter</button>` : ''}<span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="pp-ok" ${isNew ? 'disabled' : ''}>${isNew ? 'Add parameter' : 'Save'}</button></div></div>`, { width: 540, onMount(s) {
        let fmtv = d.format; let common = d.common;
        const l = $('#pp-l', s), k = $('#pp-k', s); const slug = v => v.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        let touched = !isNew; l.addEventListener('input', () => { if (!touched) k.value = slug(l.value); $('#pp-ok', s).disabled = !l.value.trim() || !k.value; }); k.addEventListener('input', () => { touched = true; k.value = slug(k.value); $('#pp-ok', s).disabled = !l.value.trim() || !k.value; });
        $('#pp-f', s).addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; fmtv = b.dataset.f; $$('[data-f]', s).forEach(x => x.classList.toggle('on', x === b)); });
        const cm = $('#pp-common', s); if (cm) cm.addEventListener('click', e => { e.preventDefault(); common = !common; e.currentTarget.classList.toggle('on', common); });
        $('#pp-ok', s).addEventListener('click', () => { const label = l.value.trim(), key = k.value;
          if (isNew) { if (PARAMS.find(x => x.key === key)) { toast(`A parameter with key “${key}” already exists`); return; } PARAMS.push({ key, label, utm: key, format: fmtv, custom: true, desc: $('#pp-d', s).value.trim(), hint: $('#pp-h', s).value.trim(), rules: [], shown: true, common, deps: null, values: [] }); closeModal(); goParam(key, 'values'); toast(`Added “${label}”. Now add its values.`); }
          else { p.label = label; p.format = fmtv; p.desc = $('#pp-d', s).value.trim(); p.hint = $('#pp-h', s).value.trim(); p.common = common; if (p.custom) { p.key = key; p.utm = key; state.param = key; } closeModal(); render(); toast(`Saved “${label}”`); } });
        const del = $('#pp-del', s); if (del) del.addEventListener('click', () => { closeModal(); confirmDeleteParam(p); });
        setTimeout(() => l.focus(), 60);
      } });
  }
  function confirmDeleteParam(p) {
    const used = p.values.reduce((a, v) => a + linksWith(p, v.v).length, 0); const child = childOf(p);
    openModal(`<div class="modal-h"><h3>Delete “${esc(p.label)}”?</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>${p.values.length} saved value${p.values.length === 1 ? '' : 's'} go with it${used ? `, and <b>${used}</b> existing link${used === 1 ? ' keeps' : 's keep'} <span class="code">${esc(p.utm)}=…</span> in their URLs` : ''}.${child ? ` <b>${esc(child.label)}</b> is narrowed by this parameter; that grouping is removed too.` : ''} This can't be undone. To keep it but hide it from the builder, add a Hidden rule on <b>Rules</b> instead.</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn close">Cancel</button><button class="btn primary danger" id="dp-ok">Delete</button></div></div>`, { width: 460, onMount(s) {
        $('#dp-ok', s).addEventListener('click', () => { closeModal(); const i = PARAMS.indexOf(p); PARAMS.splice(i, 1); if (child) child.deps = null; state.param = PARAMS[0].key; render(); toast(`Deleted “${p.label}”`); });
      } });
  }
  function paramMoreMenu(anchor, p) {
    const i = PARAMS.indexOf(p);
    openPop(anchor, `<div class="menu" style="width:250px"><div class="group">${esc(p.label)}</div>
      <button class="mi" data-r="edit">${I.edit}<span class="grow">Edit parameter…</span></button>
      <button class="mi" data-r="rules">${I.rules}<span class="grow">Builder rules in Rules</span>${I.external}</button>
      <div class="sep"></div>
      <button class="mi" data-r="up" ${i === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg><span class="grow">Move earlier in builder</span></button>
      <button class="mi" data-r="down" ${i === PARAMS.length - 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg><span class="grow">Move later in builder</span></button>
      <div class="sep"></div>
      <button class="mi" data-r="paste">${I.copy}<span class="grow">Paste a list of values…</span></button>
      <button class="mi" data-r="csv">${I.download}<span class="grow">Export values as CSV</span></button>
      <button class="mi" data-r="ga">${I.analytics}<span class="grow">Import from Google Analytics</span></button>
      ${p.custom ? `<div class="sep"></div><button class="mi danger" data-r="delete">${I.close}<span class="grow">Delete parameter</span></button>` : ''}</div>`, { align: 'right', onMount(el) {
        el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b || b.disabled) return; closePop(); const a = b.dataset.r;
          if (a === 'edit') paramModal(p); else if (a === 'rules') toast('Rules is outside this prototype'); else if (a === 'up' || a === 'down') { const j = a === 'up' ? i - 1 : i + 1; PARAMS.splice(i, 1); PARAMS.splice(j, 0, p); render(); toast(`${p.label} moved ${a} in the builder`); }
          else if (a === 'paste') pasteModal(p); else if (a === 'csv') toast(`Exported ${p.values.length} ${p.label.toLowerCase()} values as CSV`); else if (a === 'ga') toast('Google Analytics import is outside this prototype'); else if (a === 'delete') confirmDeleteParam(p); });
      } });
  }
  function pasteModal(p) {
    openModal(`<div class="modal-h"><h3>Add several ${esc(p.label.toLowerCase())} values</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><p class="sm-muted" style="white-space:normal;margin:4px 0 10px">One per line, or separated by commas. Values already in the list are skipped; ${p.rules.includes('lowercase') ? 'capitals are lowercased and ' : ''}spaces become “-”.</p>
        <textarea id="ps-t" class="pm-textarea" rows="7" placeholder="facebook&#10;instagram&#10;linkedin"></textarea><div class="sm-muted" id="ps-n" style="margin-top:6px"></div>
        <div class="tpl-foot"><span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" id="ps-ok" disabled>Add values</button></div></div>`, { width: 480, onMount(s) {
        const t = $('#ps-t', s); const parse = () => t.value.split(/[\n,]/).map(x => x.trim()).filter(Boolean);
        t.addEventListener('input', () => { const list = parse(); const ok = list.filter(x => validateValue(p, x).ok); $('#ps-n', s).textContent = list.length ? `${ok.length} new value${ok.length === 1 ? '' : 's'}${list.length - ok.length ? ` · ${list.length - ok.length} skipped (already in the list)` : ''}` : ''; $('#ps-ok', s).disabled = !ok.length; });
        $('#ps-ok', s).addEventListener('click', () => { const added = addValues(p, parse()); closeModal(); render(); toast(`Added ${added.length} value${added.length === 1 ? '' : 's'} to ${p.label.toLowerCase()}`); });
        setTimeout(() => t.focus(), 60);
      } });
  }
  function importParamsModal() {
    openModal(`<div class="modal-h"><h3>Import parameters via CSV</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b about"><p>One column per parameter, header = the parameter's key. A header that doesn't exist yet becomes a new custom parameter. Add <span class="code">prettyname:utm_source</span> columns for pretty names. Existing values are kept; only new ones are added.</p>
        <div class="pm-drop">${I.download}<b>Drop a CSV here</b><span class="sm-muted">or click to choose a file</span></div>
        <div class="tpl-foot"><button class="btn">${I.download}Download template</button><span class="grow"></span><button class="btn close">Cancel</button><button class="btn primary" disabled>Import</button></div></div>`, { width: 500, onMount(s) { $('.pm-drop', s).addEventListener('click', () => toast('File picking is outside this prototype')); $('.tpl-foot .btn:not(.close)', s).addEventListener('click', () => toast('Template CSV downloaded')); } });
  }
  function paramsMoreMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:240px">
      <button class="mi" data-act="csv">${I.download}<span class="grow">Export all parameters as CSV</span></button>
      <button class="mi" data-act="import">${PI.upload}<span class="grow">Import parameters via CSV</span></button>
      <button class="mi" data-act="ga">${I.analytics}<span class="grow">Import from Google Analytics</span></button>
      <div class="sep"></div>${state.pview === 'list' ? '' : `<button class="mi" data-act="how">${PI.branch}<span class="grow">How grouping works</span></button>`}
      <button class="mi" data-act="about">${I.info}<span class="grow">Tips &amp; shortcuts</span></button></div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; closePop(); const a = b.dataset.act;
        if (a === 'how') { pbHowPop(anchor); return; }
        if (a === 'csv') toast('Exported all parameters as CSV'); else if (a === 'import') importParamsModal(); else if (a === 'about') tipsModal(); else toast(`${b.textContent.trim()} is outside this prototype`); }); } });
  }

  /* ---------- Link builder: Create link, Edit link, Chrome extension ----------
     One builder, two shells. Fields come straight from Parameters (order, saved values,
     pretty names, groupings) and Rules (required, dropdown only, lowercase, hidden). */
  const LBI = {
    target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/></svg>',
    tpl: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    short: '<svg viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    bad: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>',
    route: '<svg viewBox="0 0 24 24"><path d="M6 3v6a4 4 0 0 0 4 4h8M14 9l4 4-4 4M6 21v-4"/></svg>',
    tab: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>',
  };
  let B = null;
  const lbParams = () => PARAMS.filter(p => p.shown);
  const lbAll = lbParams;
  const lbP = key => PARAMS.find(p => p.key === key);
  const tplOf = k => TEMPLATE_LIST.find(t => t.key === k);
  const usableShorteners = () => SHORTENERS.filter(s => s.status !== 'pending' && !state.disabledDomains.has(s.domain));
  const defaultShortener = () => { const u = usableShorteners(); return (u.find(s => s.default) || u[0] || { domain: 'none' }).domain; };
  const validUrl = u => /^(https?:\/\/)?[^\s/?#]+\.[a-z]{2,}([/?#]\S*)?$/i.test(u.trim());
  const withScheme = u => /^https?:\/\//i.test(u) ? u : `${B && B.proto || 'https'}://` + u;
  const lbUrls = () => B.urls.split(/\n/).map(s => s.trim()).filter(Boolean);

  function newBuilder(o = {}) {
    const vals = {}; lbAll().forEach(p => { vals[p.key] = ''; });
    return { mode: o.mode || 'web', edit: null, multi: false, url: o.url || '', urls: '', tpls: [], vals, proto: 'https', notes: '', shortener: defaultShortener(), slug: '', slugEdited: false,
      qr: defaultShortener() !== 'none', design: 'default', touched: new Set(), submitted: false, more: null, done: null, utmOffer: null, qrNote: '', focus: o.focus || null, combo: null };
  }
  // What the selected template(s) do to a field: fixed value, values that differ per template, or "asked for".
  function tplState(p) {
    if (!B.tpls.length) return null;
    const vs = B.tpls.map(k => tplOf(k)[p.key] || '');
    const fixed = vs.filter(v => v && !isDyn(v));
    if (fixed.length === vs.length) { const u = [...new Set(fixed)]; return u.length === 1 ? { fixed: u[0] } : { varies: u }; }
    if (vs.some(isDyn)) return { asked: [...new Set(vs.filter(isDyn).map(v => v.slice(2, -2)))] };
    return null;
  }
  function lbValue(p) { const t = tplState(p); return t && t.fixed ? t.fixed : (B.vals[p.key] || '').trim(); }
  // Saved values offered for a field, narrowed by its grouping when the parent is set.
  function lbNarrow(p) {
    if (!p.deps) return null; const par = paramOf(p.deps.parent); const pv = lbValue(par); const allow = pv && p.deps.allow[pv];
    return allow ? { par, pv, allow } : null;
  }
  function lbOptions(p) { const n = lbNarrow(p); return n ? p.values.filter(v => n.allow.includes(v.v)) : p.values; }
  function lbIssue(p) {
    const t = tplState(p); if (t && (t.fixed || t.varies)) return null;
    const v = (B.vals[p.key] || '').trim(); const label = p.label.toLowerCase();
    if (!v) return p.rules.includes('required') ? { lvl: 'err', msg: `${p.label} is required` } : null;
    if (p.format === 'number' && !/^\d+$/.test(v)) return { lvl: 'err', msg: 'Numbers only' };
    const saved = p.values.find(x => x.v === v);
    if (p.rules.includes('dropdown') && !saved) return { lvl: 'err', msg: `“${v}” isn't a saved ${label}. Pick one from the list.`, add: !p.attr };
    const n = lbNarrow(p); if (n && saved && !n.allow.includes(v)) return { lvl: 'err', msg: `“${v}” isn't used with ${n.par.label.toLowerCase()} “${n.pv}”. Pick another ${label}.` };
    const norm = normalizeValue(p, v);
    // Free-typing fields: a quiet note when the value isn't on the list yet (or looks like a typo of one that is). Never blocks saving.
    if (!saved && p.values.length && !p.values.find(x => x.v === norm)) {
      const squash = x => x.toLowerCase().replace(/[\s_-]+/g, '');
      const near = p.values.find(x => squash(x.v) === squash(v));
      if (near) return { lvl: 'new', msg: 'Did you mean', use: near.v };
      return { lvl: 'new', msg: `New ${label}, not in the list yet${norm !== v ? ` · saved as “${norm}”` : ''}`, add: !p.attr };
    }
    if (norm !== v) return { lvl: 'info', msg: `Will be saved as “${norm}”` };
    return null;
  }
  function lbUrlIssue() {
    if (B.edit) return null;
    if (B.multi) { const ls = lbUrls(); if (!ls.length) return { lvl: 'err', msg: 'Paste at least one URL, one per line' }; const bad = ls.filter(u => !validUrl(u)); return bad.length ? { lvl: 'err', msg: `${bad.length === 1 ? 'This line isn\'t' : bad.length + ' lines aren\'t'} a web address: ${bad[0]}` } : null; }
    const u = B.url.trim(); if (!u) return { lvl: 'err', msg: 'Add the page this link should open' };
    return validUrl(u) ? null : { lvl: 'err', msg: 'That doesn\'t look like a web address. Try acme.com/page' };
  }
  const autoSlug = () => [lbValue(paramOf('campaign')), lbValue(paramOf('source'))].filter(Boolean).join('-').replace(/[_\s]+/g, '-').toLowerCase().slice(0, 36);
  const lbSlug = () => B.edit ? B.slug : (B.slugEdited ? B.slug.trim() : autoSlug());
  function lbSlugIssue() {
    if (B.edit || B.shortener === 'none' || lbCombos().length > 1) return null; const s = lbSlug(); if (!s) return null;
    if (!/^[a-z0-9-]+$/i.test(s)) return { lvl: 'err', msg: 'Letters, numbers and dashes only' };
    return D.LINKS.some(l => l.slug === `${B.shortener}/${s}`) ? { lvl: 'err', msg: `${B.shortener}/${s} is already taken. Try another ending.` } : null;
  }
  function lbIssues() {
    const out = []; const u = lbUrlIssue(); if (u && (B.submitted || B.touched.has('url'))) out.push({ key: 'url', label: B.multi ? 'URLs' : 'Destination URL', ...u });
    else if (u) out.push({ key: 'url', label: B.multi ? 'URLs' : 'Destination URL', ...u, quiet: true });
    lbAll().forEach(p => { const i = lbIssue(p); if (i && i.lvl === 'err') out.push({ key: p.key, label: p.label, ...i }); });
    const s = lbSlugIssue(); if (s) out.push({ key: 'slug', label: 'Short link', ...s });
    return out;
  }
  // Every link this form will create: URLs × templates.
  function lbCombos() { const urls = B.multi ? (lbUrls().length ? lbUrls() : ['']) : [B.url.trim() || '']; const tpls = B.tpls.length ? B.tpls : [null]; const out = []; urls.forEach(u => tpls.forEach(t => out.push({ url: u, tpl: t }))); return out; }
  function lbQuery(tplKey) {
    return lbParams().map(p => { let v = lbValue(p); if (tplKey) { const tv = tplOf(tplKey)[p.key]; if (tv && !isDyn(tv)) v = tv; } return { p, v: v ? normalizeValue(p, v) : '' }; });
  }
  function lbFullUrl(dest, tplKey) { const q = lbQuery(tplKey).filter(x => x.v).map(x => `${x.p.utm}=${encodeURIComponent(x.v)}`).join('&'); const base = withScheme((dest || '').trim().replace(/[?&]$/, '')); return q ? base + (base.includes('?') ? '&' : '?') + q : base; }
  function utmFromUrl(u) { const m = u.match(/[?&](utm_[a-z]+)=([^&#]*)/gi); if (!m) return null; const o = {}; m.forEach(s => { const [k, v] = s.slice(1).split('='); const key = k.toLowerCase().replace('utm_', ''); if (paramOf(key)) o[key] = decodeURIComponent(v); }); return Object.keys(o).length ? o : null; }
  const stripUtm = u => u.replace(/([?&])utm_[a-z]+=[^&#]*/gi, '$1').replace(/[?&]+$/, '').replace(/\?&+/, '?').replace(/&&+/g, '&');

  // GA4 default channel groups, simplified from Google's rules (support.google.com/analytics/answer/9756891).
  function ga4Channel(src, med) {
    src = (src || '').toLowerCase(); med = (med || '').toLowerCase(); if (!med) return null;
    const paid = /^(.*cp.*|ppc|retargeting|paid.*)$/.test(med);
    const social = /^(facebook|instagram|linkedin|twitter|x|tiktok|snapchat|pinterest|reddit|threads)$/.test(src), search = /^(google|bing|yahoo|duckduckgo|baidu|ecosia)$/.test(src), video = /^(youtube|vimeo|twitch)$/.test(src);
    if (search && paid) return 'Paid Search'; if (social && paid) return 'Paid Social'; if (video && paid) return 'Paid Video';
    if (/^(display|banner|expandable|interstitial|cpm)$/.test(med)) return 'Display'; if (paid) return 'Paid Other';
    if (search || med === 'organic') return 'Organic Search'; if (social || /^(social|social-network|social-media|sm|social network|social media)$/.test(med)) return 'Organic Social';
    if (video || med.includes('video')) return 'Organic Video'; if (/^(email|e-mail|e_mail|e mail)$/.test(src) || /^(email|e-mail|e_mail|e mail)$/.test(med)) return 'Email';
    if (med === 'affiliate') return 'Affiliates'; if (med === 'referral' || med === 'app' || med === 'link') return 'Referral'; if (med === 'audio') return 'Audio'; if (src === 'sms' || med === 'sms') return 'SMS';
    if (med.endsWith('push') || med.includes('mobile') || med.includes('notification')) return 'Mobile Push';
    return 'Unassigned';
  }
  /* Rendering */
  function lbFieldHTML(p) {
    const t = tplState(p); const iss = lbIssue(p); const show = iss && (iss.lvl !== 'err' || B.touched.has(p.key) || B.submitted);
    const locked = t && (t.fixed || t.varies); const req = p.rules.includes('required'); const v = B.vals[p.key] || '';
    const sel = !locked && p.values.find(x => x.v === v.trim());
    const ph = p.values.length ? `${p.rules.includes('dropdown') ? 'Pick' : 'Pick or type'} ${p.hint ? '· ' + p.hint : ''}` : (p.hint || 'Type a value');
    return `<div class="lb-f lb-tone ${pTone(p)} ${show && iss.lvl === 'err' ? 'bad' : ''} ${locked ? 'locked' : ''} ${t && t.asked ? 'asked' : ''}" data-f="${esc(p.key)}">
      <label class="lb-l" for="lb-${esc(p.key)}">${lbIcon(p)}<span class="nm">${esc(p.label)}</span>${req ? '<b class="req" title="Required">*</b>' : ''}${p.attr ? '' : `<span class="k">${esc(p.utm)}</span>`}${t && t.asked ? '<span class="ask">template asks for this</span>' : ''}${p.deps && paramOf(p.deps.parent) ? `<span class="lb-dep" title="The ${esc(p.label.toLowerCase())} list only shows values grouped with the ${esc(paramOf(p.deps.parent).label.toLowerCase())} you pick">${PI.branch}narrowed by ${esc(paramOf(p.deps.parent).label.toLowerCase())}</span>` : ''}${p.desc ? `<span class="tipi" tabindex="0" data-tip="${esc(p.desc)}">${I.info}</span>` : ''}</label>
      ${locked ? `<div class="lb-lock" title="${t.fixed ? 'Set by the template' : 'Each template sets its own value'}">${PI.lock}<span class="code">${esc(t.fixed || t.varies.join(' · '))}</span><span class="sm-muted">${t.fixed ? 'from template' : 'one per template'}</span></div>`
        : `<div class="lb-in ${p.values.length ? 'combo' : ''}"><input id="lb-${esc(p.key)}" data-lb="${esc(p.key)}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" spellcheck="false" role="${p.values.length ? 'combobox' : 'textbox'}" aria-expanded="false" ${p.format === 'number' ? 'inputmode="numeric"' : ''}><span class="pretty">${sel && sel.pretty ? esc(sel.pretty) : ''}</span>${p.values.length ? `<span class="chev">${I.chev}</span>` : ''}</div>`}
      <div class="lb-msg ${show ? iss.lvl : ''}" data-msg="${esc(p.key)}">${lbMsgHTML(p, iss, show)}</div></div>`;
  }
  // Each parameter's color (same as its icon): tints its field tile and its tag in the link preview.
  const pTone = p => p.custom ? 'p-cus' : 'p-' + p.key;
  // Hover or focus a field → its tag lights up in the preview, and the other way round.
  function lbHL(key) {
    B.hl = key || null; if (!lbRoot) return;
    $$('.lb-f.hl, .tk.hl', lbRoot).forEach(el => el.classList.remove('hl'));
    if (key) $$(`.lb-f[data-f="${CSS.escape(key)}"], .tk[data-tk="${CSS.escape(key)}"]`, lbRoot).forEach(el => el.classList.add('hl'));
  }
  const lbIcon = p => `<span class="pi ${p.custom ? 'p-cus' : 'p-' + p.key}" title="${p.custom ? 'Custom parameter' : 'Standard UTM parameter'}">${P_ICON[p.custom ? 'custom' : p.key] || P_ICON.custom}</span>`;
  // Shown up front: what Rules require and what the picked template sets or asks for. The rest is optional and folds away.
  const lbUp = p => p.rules.includes('required') || !!tplState(p);
  function lbMsgHTML(p, iss, show) {
    if (show && iss.lvl === 'new') return iss.use
      ? `<i class="dot"></i><span>${esc(iss.msg)} <button class="link-btn" data-lb-use="${esc(p.key)}" data-v="${esc(iss.use)}" type="button">${esc(iss.use)}</button>?</span>`
      : `<i class="dot"></i><span>${esc(iss.msg)}</span>${iss.add ? `<button class="link-btn" data-lb-addval="${esc(p.key)}" type="button">Add to list</button>` : ''}`;
    if (show) return `${iss.lvl === 'err' ? LBI.bad : I.info}<span>${esc(iss.msg)}</span>${iss.add ? `<button class="link-btn" data-lb-addval="${esc(p.key)}" type="button">Add it to the list</button>` : ''}`;
    const n = lbNarrow(p); if (n) return `${PI.branch}<span>${n.allow.length} ${esc(p.label.toLowerCase())} value${n.allow.length === 1 ? '' : 's'} for ${esc(n.par.label.toLowerCase())} <b>${esc(n.pv)}</b></span>`;
    return '';
  }
  function lbSec(n, icon, title, sub, body, extra = '') { return `<section class="lb-sec" data-sec="${n}"><div class="lb-sec-h"><span class="ic">${icon}</span><h4>${title}</h4>${sub ? `<span class="sub">${sub}</span>` : ''}<span class="grow"></span>${extra}</div>${body}</section>`; }
  function lbFormHTML() {
    const ext = B.mode === 'ext'; const urlIss = lbUrlIssue(); const urlShow = urlIss && (B.touched.has('url') || B.submitted);
    const dest = B.edit ? `<div class="lb-f locked" data-f="url"><label class="lb-l"><span class="nm">Destination URL</span></label><div class="lb-lock">${I.external}<span class="code">${esc(B.url)}</span></div></div>`
      : B.multi ? `<div class="lb-f ${urlShow ? 'bad' : ''}" data-f="url"><label class="lb-l" for="lb-urls"><span class="nm">Destination URLs</span><b class="req">*</b><span class="sm-muted">one per line</span></label><textarea id="lb-urls" rows="4" placeholder="acme.com/sale&#10;acme.com/black-friday" spellcheck="false">${esc(B.urls)}</textarea><div class="lb-msg ${urlShow ? 'err' : ''}" data-msg="url">${urlShow ? LBI.bad + `<span>${esc(urlIss.msg)}</span>` : `<span>${lbUrls().length} URL${lbUrls().length === 1 ? '' : 's'}</span>`}</div></div>`
      : `<div class="lb-f ${urlShow ? 'bad' : ''}" data-f="url"><label class="lb-l" for="lb-url"><span class="nm">Destination URL</span><b class="req">*</b></label><div class="lb-in url"><span class="lb-proto"><select id="lb-proto" aria-label="Protocol"><option ${B.proto === 'https' ? 'selected' : ''}>https</option><option ${B.proto === 'http' ? 'selected' : ''}>http</option></select>${I.chev}</span><span class="lb-sep">://</span><input id="lb-url" value="${esc(B.url)}" placeholder="acme.com/sale" spellcheck="false" autocomplete="off" inputmode="url"></div><div class="lb-msg ${urlShow ? 'err' : ''}" data-msg="url">${urlShow ? LBI.bad + `<span>${esc(urlIss.msg)}</span>` : ''}</div></div>`;
    const offer = B.utmOffer ? `<div class="lb-offer">${I.info}<span>This URL already has ${Object.keys(B.utmOffer).length} UTM tag${Object.keys(B.utmOffer).length === 1 ? '' : 's'} (${Object.entries(B.utmOffer).map(([k, v]) => `<span class="code">${esc(k)}=${esc(v)}</span>`).join(' ')}). Move them into the fields below?</span><button class="btn sm primary" id="lb-utm-use" type="button">Use them</button><button class="btn sm" id="lb-utm-no" type="button">Ignore</button></div>` : '';
    const modeSeg = B.edit ? '' : `<div class="seg lb-seg" role="tablist"><button type="button" data-lb-multi="0" class="${B.multi ? '' : 'on'}">One URL</button><button type="button" data-lb-multi="1" class="${B.multi ? 'on' : ''}">Several URLs</button></div>`;
    const s1 = lbSec(1, LBI.target, 'Where should it go?', '', dest + offer, ext ? '' : modeSeg);
    const tcards = TEMPLATE_LIST.map(t => { const on = B.tpls.includes(t.key); return `<button type="button" class="lb-tpl ${on ? 'on' : ''}" data-tpl-pick="${esc(t.key)}" aria-pressed="${on}"><span class="cb ${on ? 'on' : ''}">${I.check}</span><span class="t"><b>${esc(t.name)}</b><span class="sm-muted">${esc(t.medium)}${t.source && !isDyn(t.source) ? ' · ' + esc(t.source) : ''}</span></span></button>`; }).join('');
    const tsub = B.tpls.length > 1 ? `${B.tpls.length} picked · one link per template` : B.tpls.length ? 'fills the fixed tags for you' : 'optional · pick several to make one link each';
    const s2 = lbSec(2, LBI.tpl, 'Start from a template', tsub, `<div class="lb-tpls">${tcards}</div>`, B.tpls.length ? '<button class="link-btn" id="lb-tpl-clear" type="button">Clear</button>' : '');
    const up = lbParams().filter(lbUp), opt = lbParams().filter(p => !lbUp(p));
    // One field per row; a grouped field (source) says in its label which field narrows it.
    const grid = up.map(lbFieldHTML).join('');
    const sh = usableShorteners(); const slugIss = lbSlugIssue(); const multiLinks = lbCombos().length > 1;
    const shortRow = `<div class="lb-f ${slugIss ? 'bad' : ''}" data-f="slug"><label class="lb-l" for="lb-slug"><span class="nm">Short link</span>${B.edit ? '<span class="sm-muted">can\'t change after it\'s created</span>' : ''}</label>
      <div class="lb-short"><select id="lb-sh" ${B.edit ? 'disabled' : ''} aria-label="Short domain">${sh.map(s => `<option value="${esc(s.domain)}" ${B.shortener === s.domain ? 'selected' : ''}>${esc(s.domain)}</option>`).join('')}<option value="none" ${B.shortener === 'none' ? 'selected' : ''}>Don't shorten</option></select>${B.shortener === 'none' ? '' : `<span class="sl">/</span><input id="lb-slug" value="${esc(multiLinks ? '' : lbSlug())}" placeholder="${multiLinks ? 'set for each link automatically' : 'ending, e.g. fall-sale'}" ${B.edit || multiLinks ? 'disabled' : ''} spellcheck="false" autocomplete="off">`}</div>
      <div class="lb-msg ${slugIss ? 'err' : B.qrNote ? 'info' : ''}" data-msg="slug">${slugIss ? LBI.bad + `<span>${esc(slugIss.msg)}</span>` : B.qrNote ? I.info + `<span>${esc(B.qrNote)}</span>` : (!B.slugEdited && !B.edit && lbSlug() ? '<span>Made from campaign and source. Type to change it.</span>' : '')}</div></div>`;
    const qrRow = `<div class="lb-qr"><label class="switch ${B.qr ? 'on' : ''}" id="lb-qr"><i></i><span>QR code</span></label>${B.qr && !ext ? `<div class="lb-designs">${QR_DESIGNS.map(d => `<button type="button" class="lb-dz ${B.design === d.id ? 'on' : ''}" data-lb-design="${d.id}" title="${esc(d.desc)}"><span class="sw">${qrSVG('acme.co/new', d, 22)}</span>${esc(d.name)}</button>`).join('')}</div>` : B.qr ? '<span class="sm-muted">workspace default design</span>' : '<span class="sm-muted">for print, packaging and events</span>'}</div>`;
    if (ext) {
      const up = lbParams().filter(p => { const t = tplState(p); return p.rules.includes('required') && !(t && (t.fixed || t.varies)) || (t && t.asked); });
      const rest = lbParams().filter(p => !up.includes(p));
      const errIn = rest.some(p => { const i = lbIssue(p); return i && i.lvl === 'err' && B.submitted; });
      B.moreOpen = !!(B.more || errIn);
      const moreX = `<div class="lb-more ${B.moreOpen ? 'open' : ''}"><button type="button" class="lb-more-h" id="lb-more" aria-expanded="${B.moreOpen}">${I.chevR}<span>More fields</span><span class="n">${rest.length}</span></button><div class="lb-more-b">${rest.map(lbFieldHTML).join('')}<div class="lb-f" data-f="notes"><label class="lb-l" for="lb-notes"><span class="nm">Notes</span></label><textarea id="lb-notes" rows="2" placeholder="Saved in UTM.io, not added to the link">${esc(B.notes)}</textarea></div></div></div>`;
      const recent = D.LINKS.slice().sort((a, b) => a.created < b.created ? 1 : -1).slice(0, 3);
      B.recentHTML = `<section class="lb-sec ext-recent"><div class="lb-sec-h"><h4>Recent links</h4><span class="grow"></span><button class="link-btn" id="ext-open-web" type="button">Open UTM.io${I.external}</button></div>${recent.map(l => `<div class="ext-rl"><span class="t"><b>${esc(l.slug)}</b><span class="sm-muted">${esc(l.title)}</span></span><button class="icon-btn" type="button" data-copy-l="${esc(l.slug)}" title="Copy">${I.copy}</button></div>`).join('')}</section>`;
      return s1 + s2.replace('optional · pick several to make one link each', 'optional') + lbSec(3, LBI.tag, 'Tag it', '', `<div class="lb-grid">${up.map(lbFieldHTML).join('') || '<span class="sm-muted">The template fills every required tag.</span>'}</div>${moreX}`) + lbSec(4, LBI.short, 'Short link', '', shortRow + qrRow);
    }
    const filled = opt.filter(p => (B.vals[p.key] || '').trim()).length;
    const optErr = opt.some(p => { const i = lbIssue(p); return i && i.lvl === 'err' && (B.submitted || B.touched.has(p.key)); });
    B.moreOpen = !!(optErr || (B.more == null ? filled : B.more));
    const optStd = opt.filter(p => !p.custom), optCus = opt.filter(p => p.custom);
    const more = opt.length ? `<div class="lb-more ${B.moreOpen ? 'open' : ''}"><button type="button" class="lb-more-h" id="lb-more" aria-expanded="${B.moreOpen}">${I.chevR}<span>Optional parameters</span><span class="n">${opt.length}</span><span class="lb-more-ic">${opt.map(lbIcon).join('')}</span><span class="sm-muted">${filled ? `<b>${filled} filled</b> · ` : ''}${opt.map(p => esc(p.label.toLowerCase())).join(', ')}</span></button>
      <div class="lb-more-b">${optStd.length ? `<div class="lb-grp">UTM parameters</div>${optStd.map(lbFieldHTML).join('')}` : ''}${optCus.length ? `<div class="lb-grp cus">Custom parameters<span class="sm-muted">added by your admin on Parameters</span></div>${optCus.map(lbFieldHTML).join('')}` : ''}</div></div>` : '';
    const hiddenN = PARAMS.filter(p => !p.shown).length;
    const s3 = lbSec(3, LBI.tag, 'Tag it', B.tpls.length ? 'what Rules require and what your template asks for' : 'what Rules require · the rest is optional', `<div class="lb-grid">${grid}</div>${more}`, hiddenN && !ext ? `<span class="sm-muted lb-hidn" data-tip="Hidden by Rules: ${PARAMS.filter(p => !p.shown).map(p => p.label).join(', ')}">${PI.eyeOff}${hiddenN} hidden</span>` : '');
    const s4 = lbSec(4, LBI.note, 'Notes', 'optional · not added to the URL', `<div class="lb-f" data-f="notes"><textarea id="lb-notes" rows="2" aria-label="Notes" placeholder="Anything your team should know about this link">${esc(B.notes)}</textarea></div>`);
    const route = ext ? '' : `<div class="lb-route">${LBI.route}<span><b>Smart routing</b> <span class="sm-muted">send people to different pages by country or device</span></span><span class="grow"></span><span class="sm-muted">Off</span><button class="link-btn" id="lb-route" type="button">Set up</button></div>`;
    const s5 = lbSec(5, LBI.short, 'Short link &amp; QR', '', shortRow + qrRow + route);
    return s1 + (B.edit ? '' : s2) + s3 + s4 + s5;
  }
  function lbTokensHTML(dest, tplKey) {
    const base = dest ? withScheme(dest.trim().replace(/[?&]$/, '')) : 'https://your-page.com'; let sep = base.includes('?') ? '&' : '?';
    const q = lbQuery(tplKey).map(({ p, v }) => { if (!v && !p.rules.includes('required')) return ''; const s = sep; if (v || p.rules.includes('required')) sep = '&';
      return `<span class="tk ${pTone(p)} ${v ? '' : 'miss'} ${B.hl === p.key ? 'hl' : ''}" data-tk="${esc(p.key)}" title="${v ? esc(p.label) : esc(p.label) + ' is required'}">${s}<span class="k">${esc(p.utm)}</span>=<span class="v">${v ? esc(v) : '?'}</span></span>`; }).join('');
    return `<span class="tk base ${dest ? '' : 'miss'}" data-tk="url">${esc(base)}</span>${q}`;
  }
  function lbSideHTML() {
    const combos = lbCombos(); const all = lbIssues(); const iss = B.submitted ? all : []; const ready = !all.length; const sh = B.shortener !== 'none';
    const short = sh ? `${B.shortener}/${combos.length > 1 ? '…' : (lbSlug() || '…')}` : '';
    const first = combos[0];
    const head = combos.length > 1
      ? `<div class="lb-pv-h"><b>${combos.length} links</b><span class="sm-muted">${B.multi ? `${lbUrls().length} URL${lbUrls().length === 1 ? '' : 's'}` : '1 URL'} × ${B.tpls.length || 1} template${(B.tpls.length || 1) === 1 ? '' : 's'}</span></div>
        <div class="lb-many">${combos.slice(0, 6).map(c => `<div class="lb-one"><span class="d">${esc(c.url || 'your-page.com')}</span><span class="t">${c.tpl ? esc(tplOf(c.tpl).name) : 'no template'}</span><code>${lbTokensHTML(c.url, c.tpl)}</code></div>`).join('')}${combos.length > 6 ? `<div class="sm-muted" style="padding:6px 2px">+ ${combos.length - 6} more</div>` : ''}</div>`
      : `${sh ? `<div class="lb-pv-short"><span class="lbl">Short link</span><div class="row"><b class="code">${esc(short)}</b><button class="icon-btn" id="lb-copy-short" type="button" title="Copy short link" ${ready ? '' : 'disabled'}>${I.copy}</button></div></div>` : ''}
        <div class="lb-pv-long"><span class="lbl">${sh ? 'Opens' : 'Full link'}</span><code class="lb-url">${lbTokensHTML(first.url, first.tpl)}</code><span class="sm-muted lb-hint">Click a tag to jump to its field</span></div>
        ${(() => { const q = lbQuery(first.tpl); const g = ga4Channel((q.find(x => x.p.key === 'source') || {}).v, (q.find(x => x.p.key === 'medium') || {}).v); return g && (q.find(x => x.p.key === 'source') || {}).v ? `<div class="lb-ga ${g === 'Unassigned' ? 'warn' : ''}">${g === 'Unassigned' ? PI.warn : I.analytics}<span>${g === 'Unassigned' ? `<b>GA4 will report this as Unassigned.</b> “${esc((q.find(x => x.p.key === 'medium') || {}).v)}” isn't one of GA4's standard mediums, so clicks won't land in a channel.` : `GA4 channel: <b>${g}</b>`}</span></div>` : ''; })()}
        ${B.qr ? `<div class="lb-pv-qr"><span class="q">${qrSVG(short || 'acme.co/new', QR_DESIGNS.find(d => d.id === B.design) || QR_DESIGNS[0], 92)}</span><span class="sm-muted">${esc((QR_DESIGNS.find(d => d.id === B.design) || QR_DESIGNS[0]).name)} design · scans open the short link</span></div>` : ''}`;
    const check = ready ? `<div class="lb-ready ok">${LBI.ok}<span><b>Ready to save</b>${combos.length > 1 ? `Creates ${combos.length} links` : 'Every required tag is filled'}</span></div>`
      : iss.length ? `<div class="lb-ready"><div class="h">${LBI.bad}<b>${iss.length} thing${iss.length === 1 ? '' : 's'} to fix</b></div>${iss.map(i => `<button type="button" class="lb-todo" data-jump="${esc(i.key)}"><span class="l">${esc(i.label)}</span><span class="m">${esc(i.msg)}</span>${I.chevR}</button>`).join('')}</div>`
      : `<div class="lb-ready todo">${I.info}<span><b>${all.length} field${all.length === 1 ? '' : 's'} left</b>${all.map(i => esc(i.label)).join(', ')}</span></div>`;
    return `<div class="lb-pv card">${head}</div>${check}`;
  }
  function lbFootHTML() {
    const n = lbCombos().length; const all = lbIssues();
    const label = B.edit ? 'Save changes' : n > 1 ? `Create ${n} links` : 'Save &amp; copy link';
    return `<span class="lb-st ${all.length ? '' : 'ok'}">${all.length ? `${all.length} left to fill in` : B.edit ? 'Only new clicks get the new tags' : n > 1 ? `${n} links ready` : 'Ready · copies the link when saved'}</span><span class="grow"></span>${B.mode === 'ext' ? '' : '<span class="sm-muted lb-kbd"><kbd>⌘</kbd><kbd>↵</kbd></span>'}<button class="btn close" type="button">Cancel</button><button class="btn primary" id="lb-save" type="button">${I.copy}${label}</button>`;
  }
  function lbDoneHTML() {
    const d = B.done; const one = d.links.length === 1;
    return `<div class="lb-done"><span class="big">${LBI.ok}</span><h3>${B.edit ? 'Link updated' : one ? 'Link created and copied' : `${d.links.length} links created`}</h3>
      <p class="sm-muted">${B.edit ? 'New clicks carry the new tags. Past clicks keep the tags they had.' : one ? 'Paste it anywhere. It\'s also saved in Links with its tags and details.' : 'They\'re in Links. Copy them all, or export a CSV for your ad platform.'}</p>
      <div class="lb-done-list">${d.links.slice(0, 8).map(l => `<div class="lb-one done"><b class="code">${esc(l.short || l.long)}</b>${l.short ? `<code>${esc(l.long)}</code>` : ''}<button class="icon-btn" type="button" data-copy-l="${esc(l.short || l.long)}" title="Copy">${I.copy}</button></div>`).join('')}${d.links.length > 8 ? `<div class="sm-muted">+ ${d.links.length - 8} more</div>` : ''}</div>
      <div class="lb-done-acts">${one ? '' : `<button class="btn" id="lb-copy-all" type="button">${I.copy}Copy all</button><button class="btn" id="lb-csv" type="button">${I.download}Export CSV</button>`}${B.qr && one ? `<button class="btn" id="lb-qr-dl" type="button">${I.download}Download QR</button>` : ''}${B.mode === 'ext' || B.edit ? '' : `<button class="btn" id="lb-to-links" type="button">${I.links}Open Links</button>`}${B.edit ? '' : `<button class="btn primary" id="lb-again" type="button">${PI.plus}Create another like this</button>`}<button class="btn ${B.edit ? 'primary' : ''} close" type="button">Done</button></div></div>`;
  }
  function lbShellHTML() {
    const ext = B.mode === 'ext';
    const title = B.edit ? `Edit link<span class="sub"><span class="code">${esc(B.edit)}</span></span>` : 'Create link';
    const head = ext ? `<div class="ext-top"><span class="ext-logo"><svg viewBox="0 0 24 24"><path d="M5 20 10 4h3L8 20zM12 20l5-16h3l-5 16z" fill="#8a64c0"/></svg>utm.io</span><button class="ext-ws" type="button" id="ext-ws">Acme Marketing${I.chev}</button><span class="grow"></span><button class="close" aria-label="Close">${I.close}</button></div>
        <div class="ext-meter"><span class="bar"><i style="width:48%"></i></span><span><b>12</b> of 25 links this month</span><span class="sm-muted">resets Dec 1</span></div>
        <div class="ext-tab">${LBI.tab}<span class="sm-muted">Current tab</span><span class="code">acme.com/blog/fall-lookbook</span>${B.url === 'acme.com/blog/fall-lookbook' ? '<span class="tag">used</span>' : '<button class="link-btn" id="ext-use-tab" type="button">Use it</button>'}</div>`
      : `<div class="crumbs"><a href="#" class="close">${I.arrowL}${esc(lbBackLabel())}</a><span>/</span><span class="cur ui">${B.edit ? 'Edit link' : 'Create link'}</span></div>
        <div class="page-head lb-ph"><div class="title"><h1>${B.edit ? 'Edit link' : 'Create link'}</h1><span class="sm-muted ${B.edit ? 'code' : ''}">${B.edit ? esc(B.edit) : 'Tag a page, shorten it and get a QR code'}</span></div></div>`;
    if (B.done) return `${head}<div class="lb-body done">${lbDoneHTML()}</div>`;
    return `${head}${B.edit ? `<div class="lb-editnote">${I.info}<span>This link has <b>${fmt.n((Q.linksAll.rows.find(r => r.link.slug === B.edit) || { clicks: 0 }).clicks)}</b> clicks. Changing tags only affects new clicks; the short link and destination stay the same.</span></div>` : ''}
      <div class="lb-body"><div class="lb-form" id="lb-form">${lbFormHTML()}</div><aside class="lb-side" id="lb-side">${lbSideHTML()}</aside>${B.mode === 'ext' ? B.recentHTML || '' : ''}</div>
      <div class="lb-foot" id="lb-foot">${lbFootHTML()}</div>`;
  }

  /* Behaviour */
  let lbRoot = null;
  function lbPaint() {
    if (!lbRoot) return; if (!Q.linksAll) Q.linksAll = D.query({ range: ALL_RANGE, trigger: 'all', filters: [] }); const box = lbRoot; const f = $('#lb-form', box); const top = f ? f.scrollTop : 0; const ae = document.activeElement; const fid = ae && box.contains(ae) ? ae.id : null; const caret = ae && 'selectionStart' in ae ? ae.selectionStart : null;
    box.classList.toggle('is-done', !!B.done); box.innerHTML = lbShellHTML(); $$('.close', box).forEach(b => b.addEventListener('click', lbClose));
    const f2 = $('#lb-form', box); if (f2) f2.scrollTop = top;
    if (fid) { const el = $('#' + CSS.escape(fid), box); if (el) { el.focus({ preventScroll: true }); try { if (caret != null) el.setSelectionRange(caret, caret); } catch (e) { /* not a text input */ } } }
  }
  // Light update while typing: preview, checklist, footer and messages. Inputs are left alone so focus and caret stay put.
  function lbRefresh() {
    if (!lbRoot || B.done) return; const box = lbRoot;
    const side = $('#lb-side', box); if (side) side.innerHTML = lbSideHTML(); const foot = $('#lb-foot', box); if (foot) { foot.innerHTML = lbFootHTML(); $$('.close', foot).forEach(b => b.addEventListener('click', lbClose)); }
    lbAll().forEach(p => { const el = $(`[data-f="${CSS.escape(p.key)}"]`, box); if (!el) return; const iss = lbIssue(p); const show = iss && (iss.lvl !== 'err' || B.touched.has(p.key) || B.submitted);
      el.classList.toggle('bad', !!(show && iss.lvl === 'err')); const m = $('.lb-msg', el); m.className = `lb-msg ${show ? iss.lvl : ''}`; m.innerHTML = lbMsgHTML(p, iss, show);
      const pr = $('.pretty', el); if (pr) { const s = p.values.find(x => x.v === (B.vals[p.key] || '').trim()); pr.textContent = s && s.pretty ? s.pretty : ''; } });
    const sl = $('#lb-slug', box); if (sl && !B.slugEdited && !B.edit && document.activeElement !== sl) sl.value = lbCombos().length > 1 ? '' : lbSlug();
    const ss = $('[data-f="slug"] .lb-msg', box), si = lbSlugIssue(); if (ss) { $('[data-f="slug"]', box).classList.toggle('bad', !!si); ss.className = `lb-msg ${si ? 'err' : ''}`; ss.innerHTML = si ? LBI.bad + `<span>${esc(si.msg)}</span>` : (!B.slugEdited && !B.edit && lbSlug() && lbCombos().length === 1 ? '<span>Made from campaign and source. Type to change it.</span>' : ''); }
    const um = $('[data-f="url"] .lb-msg', box); if (um && !B.edit) { const ui = lbUrlIssue(); const show = ui && (B.touched.has('url') || B.submitted); $('[data-f="url"]', box).classList.toggle('bad', !!show); um.className = `lb-msg ${show ? 'err' : ''}`; um.innerHTML = show ? LBI.bad + `<span>${esc(ui.msg)}</span>` : B.multi ? `<span>${lbUrls().length} URL${lbUrls().length === 1 ? '' : 's'}</span>` : ''; }
  }
  // Combobox: saved values with pretty names and usage; narrowed by groupings; free text only where Rules allow it.
  function lbComboOpen(key) {
    const box = lbRoot; const p = lbP(key); const f = $(`[data-f="${CSS.escape(key)}"]`, box); if (!p || !f || !p.values.length && p.rules.includes('dropdown')) return;
    let pop = $('.lb-pop', f); if (!pop) { pop = document.createElement('div'); pop.className = 'lb-pop'; pop.setAttribute('role', 'listbox'); f.appendChild(pop); }
    const q = (B.vals[key] || '').trim(); const ql = q.toLowerCase(); const n = p.attr ? null : lbNarrow(p);
    const base = lbOptions(p); const exact = base.find(x => x.v === q);
    // Ignore case, spaces, - and _ when matching, so "Carousel V2" still finds the saved carousel_v2.
    const squash = x => x.toLowerCase().replace(/[\s_-]+/g, ''), qs = squash(q);
    const list = (exact ? base : base.filter(x => !ql || x.v.toLowerCase().includes(ql) || (qs && squash(x.v).includes(qs)) || (x.pretty && x.pretty.toLowerCase().includes(ql)))).slice(0, 60);
    const uses = x => p.attr ? 0 : linksWith(p, x.v).length;
    const norm = q ? normalizeValue(p, q) : '';
    const extra = q && !exact && !base.find(x => x.v === norm) ? (p.rules.includes('dropdown') ? `<div class="lb-opt-none">No saved ${esc(p.label.toLowerCase())} matches “${esc(q)}”.${p.attr ? '' : ` <button type="button" class="link-btn" data-lb-addval="${esc(key)}">Add “${esc(norm)}” to the list</button><span class="sm-muted"> · admins only</span>`}</div>` : `<button type="button" class="lb-opt new" data-opt="${esc(norm)}">${PI.plus}<span>Use “<b class="code">${esc(norm)}</b>”</span>${norm !== q ? '<span class="sm-muted">cleaned up for you</span>' : ''}</button>`) : '';
    pop.innerHTML = `${list.length ? list.map((x, i) => { const u = uses(x); return `<button type="button" class="lb-opt ${x.v === q ? 'sel' : ''} ${i === (B.combo && B.combo.key === key ? B.combo.i : -1) ? 'act' : ''}" data-opt="${esc(x.v)}" role="option"><span class="v code">${esc(x.v)}</span>${x.pretty ? `<span class="pn">${esc(x.pretty)}</span>` : ''}<span class="grow"></span>${u ? `<span class="u">${u} link${u === 1 ? '' : 's'}</span>` : ''}${x.desc ? `<span class="d">${esc(x.desc)}</span>` : ''}</button>`; }).join('') : ''}${extra}${!list.length && !extra ? `<div class="lb-opt-none">No saved values yet${p.rules.includes('dropdown') ? '' : '. Type one.'}</div>` : ''}${n ? `<div class="lb-pop-f">${PI.branch}Showing ${n.allow.length} of ${p.values.length}: ${esc(p.label.toLowerCase())} values used with ${esc(n.par.label.toLowerCase())} <b>${esc(n.pv)}</b></div>` : ''}`;
    if (!pop.dataset.shown) { pop.dataset.shown = '1'; requestAnimationFrame(() => pop.scrollIntoView({ block: 'nearest', behavior: 'smooth' })); }
    const inp = $('input', f); if (inp) inp.setAttribute('aria-expanded', 'true'); B.combo = B.combo && B.combo.key === key ? B.combo : { key, i: -1 };
  }
  function lbComboClose() { if (!lbRoot) return; $$('.lb-pop', lbRoot).forEach(p => { const i = $('input', p.parentElement); if (i) i.setAttribute('aria-expanded', 'false'); p.remove(); }); B.combo = null; }
  function lbPick(key, v) {
    B.vals[key] = v; B.touched.add(key); lbComboClose();
    // Changing a parent can leave the child on a value it no longer allows; say so instead of silently clearing it.
    lbPaint(); const kid = PARAMS.find(c => c.deps && c.deps.parent === key);
    if (kid && B.vals[kid.key] && lbIssue(kid) && lbIssue(kid).lvl === 'err') B.touched.add(kid.key);
    lbRefresh();
    const me = $(`#lb-${CSS.escape(key)}`, lbRoot); if (me) me.blur();
  }
  function lbJump(key) {
    const box = lbRoot; const f0 = $(`[data-f="${CSS.escape(key)}"]`, box); if (f0 && f0.closest('.lb-more:not(.open)')) { B.more = true; lbPaint(); }
    const f = $(`[data-f="${CSS.escape(key)}"]`, box); if (!f) return; f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const i = $('input, textarea, select', f); if (i && !i.disabled) setTimeout(() => i.focus({ preventScroll: true }), 250); f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
  }
  function lbSave() {
    const iss = lbIssues(); if (iss.length) { B.submitted = true; lbPaint(); lbJump(iss[0].key); return; }
    const sh = B.shortener !== 'none'; const combos = lbCombos();
    const links = combos.map((c, i) => { const long = B.edit ? lbFullUrl(D.LINKS.find(l => l.slug === B.edit).dest, null) : lbFullUrl(c.url, c.tpl); const slug = B.edit ? B.edit : sh ? `${B.shortener}/${combos.length > 1 ? (lbSlug() || 'link').slice(0, 24) + '-' + (i + 1) : (lbSlug() || Math.random().toString(36).slice(2, 7))}` : ''; return { short: slug, long }; });
    if (B.mode === 'ext') { B.done = { links }; lbPaint(); if (links.length === 1) copyText(links[0].short || links[0].long, B.edit ? 'Saved' : 'Link copied'); return; }
    lbFinish(links, combos);
  }
  // Web builder: save into the Links list, go back to it (edits go back to where they came from), and show what was made in an overlay.
  function lbFinish(links, combos) {
    const T = D.TODAY, today = `${T.getFullYear()}-${String(T.getMonth() + 1).padStart(2, '0')}-${String(T.getDate()).padStart(2, '0')}`;
    const made = links.map((l, i) => {
      const c = combos[i] || combos[0], q = Object.fromEntries(lbQuery(c.tpl).map(x => [x.p.key, x.v || '']));
      const tokens = lbTokensHTML(B.edit ? D.LINKS.find(x => x.slug === B.edit).dest : c.url, c.tpl);
      let slug = l.short || withScheme(l.long).replace(/^https?:\/\//, '').split('?')[0];
      if (B.edit) { const ex = D.LINKS.find(x => x.slug === B.edit); UTM_KEYS.forEach(k => { if (k in q) ex[k] = q[k]; }); slug = ex.slug; }
      else {
        D.LINKS.unshift({ slug, dest: (c.url || '').trim().replace(/^https?:\/\//, ''), title: [q.campaign, q.source].filter(Boolean).join(' · ') || 'New link', campaign: q.campaign || '', source: q.source || '', medium: q.medium || '', content: q.content || '', term: q.term || '',
          created: today, by: 'Tyler Berry', tags: [], qr: B.qr ? .01 : 0, uniq: .7, geo: { US: 1 }, dev: { mobile: .6, desktop: .35, tablet: .05 }, ref: { 'No referrer': 1 }, series: new Array(D.DAYS).fill(0), id: D.LINKS.length + 100, fresh: true });
      }
      if (B.qr) QR_DESIGN_OF[slug] = B.design;
      return { slug, short: l.short, long: l.long, tokens };
    });
    const info = { links: made, edit: !!B.edit, qr: B.qr && B.shortener !== 'none', design: B.design,
      again: { tpls: B.tpls, vals: { ...B.vals }, shortener: B.shortener, qr: B.qr, design: B.design } };
    const back = B.back || {}; lbRoot = null; B.done = { links };
    state.fresh = new Set(made.map(m => m.slug));
    if (info.edit && back.view && back.view !== 'build' && back.view !== 'links') { Object.assign(state, { view: back.view, slug: back.slug, from: back.from }); render({ top: true }); }
    else goLinks();
    if (made.length === 1) copyText(made[0].short || made[0].long, info.edit ? 'Saved' : 'Link created and copied');
    createdModal(info);
    setTimeout(() => { state.fresh = null; $$('.lrow.fresh').forEach(r => r.classList.remove('fresh')); }, 6000);
  }
  // "Link created": the link, its tags, and the QR code with download options, over the Links list.
  function createdModal(info) {
    const one = info.links.length === 1, L = info.links[0], design = QR_DESIGNS.find(d => d.id === info.design) || QR_DESIGNS[0];
    const title = info.edit ? 'Link updated' : one ? 'Link created' : `${info.links.length} links created`;
    const sub = info.edit ? 'New clicks carry the new tags' : one ? 'Copied to your clipboard · it\'s at the top of Links' : 'They\'re at the top of Links';
    const qr = info.qr && one ? `<div class="lc-qr">${qrSVG(L.slug, design, 176)}
        <div class="lc-qr-name">${esc(design.name)} design<button class="link-btn" id="lc-design" type="button">Change</button></div>
        <div class="seg lc-fmt" role="radiogroup" aria-label="Image format"><button type="button" class="on" data-fmt="PNG">PNG</button><button type="button" data-fmt="JPEG">JPEG</button><button type="button" data-fmt="SVG">SVG</button></div>
        <label class="lc-tr"><input type="checkbox" id="lc-transparent"> Transparent background</label>
        <button class="btn primary" id="lc-dl" type="button">${I.download}<span>Download PNG</span></button></div>`
      : one ? `<div class="lc-qr none">${I.qr}<b>No QR code</b><span class="sm-muted">Add one any time from the link's ⋮ menu.</span></div>` : '';
    const main = one ? `<div class="lc-main">
        ${L.short ? `<div class="lc-f"><span class="lbl">Short link</span><div class="lc-short"><b class="code">${esc(L.short)}</b><button class="btn sm" data-lc-copy="${esc(L.short)}" type="button">${I.copy}Copy</button></div></div>` : ''}
        <div class="lc-f"><span class="lbl">${L.short ? 'Opens' : 'Full link'}</span><code class="lb-url">${L.tokens}</code><button class="link-btn lc-copy-long" data-lc-copy="${esc(L.long)}" type="button">${I.copy}Copy full URL</button></div>
        <div class="lc-acts"><button class="btn" id="lc-analytics" type="button">${I.analytics}View analytics</button><button class="btn" id="lc-edit" type="button">${I.edit}Edit</button>${info.edit ? '' : `<button class="btn" id="lc-again" type="button">${PI.plus}Create another like this</button>`}</div></div>`
      : `<div class="lc-main wide"><div class="lc-list">${info.links.slice(0, 8).map(l => `<div class="lc-row"><b class="code">${esc(l.short || l.long)}</b><code class="lb-url">${l.tokens}</code><button class="icon-btn" data-lc-copy="${esc(l.short || l.long)}" type="button" title="Copy">${I.copy}</button></div>`).join('')}${info.links.length > 8 ? `<div class="sm-muted">+${info.links.length - 8} more in Links</div>` : ''}</div>
        <div class="lc-acts"><button class="btn primary" id="lc-copy-all" type="button">${I.copy}Copy all</button><button class="btn" id="lc-csv" type="button">${I.download}Export CSV</button>${info.qr ? `<button class="btn" id="lc-zip" type="button">${I.qr}Download QR codes</button>` : ''}<button class="btn" id="lc-again" type="button">${PI.plus}Create more</button></div></div>`;
    openModal(`<div class="modal-h lc-h"><span class="lc-ok">${I.check}</span><h3>${title}<span class="sub">${sub}</span></h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b lc">${main}${qr}</div>`, {
      width: one ? 760 : 680,
      onMount(s) {
        let fmt = 'PNG';
        s.addEventListener('click', e => {
          const t = e.target, h = q => t.closest(q); let el;
          if ((el = h('[data-lc-copy]'))) { copyText(el.dataset.lcCopy, 'Copied'); return; }
          if ((el = h('[data-fmt]'))) { fmt = el.dataset.fmt; $$('[data-fmt]', s).forEach(b => b.classList.toggle('on', b === el)); $('#lc-dl span', s).textContent = `Download ${fmt}`; const tr = $('#lc-transparent', s); tr.disabled = fmt === 'JPEG'; if (fmt === 'JPEG') tr.checked = false; return; }
          if (h('#lc-dl')) { toast(`QR code ${fmt}${$('#lc-transparent', s).checked ? ' (transparent)' : ''} downloaded`); return; }
          if (h('#lc-design')) { toast('QR designs live under QR codes → QR designs'); return; }
          if (h('#lc-analytics')) { closeModal(); state.from = 'links'; goLink(L.slug); return; }
          if (h('#lc-edit')) { closeModal(); openBuilder({ edit: L.slug }); return; }
          if (h('#lc-copy-all')) { copyText(info.links.map(l => l.short || l.long).join('\n'), `Copied ${info.links.length} links`); return; }
          if (h('#lc-csv')) { toast(`Exported ${info.links.length} links as CSV`); return; }
          if (h('#lc-zip')) { toast(`Downloaded ${info.links.length} QR codes (ZIP)`); return; }
          if (h('#lc-again')) { closeModal(); const k = info.again; openBuilder(); Object.assign(B, { tpls: k.tpls, shortener: k.shortener, qr: k.qr, design: k.design }); ['campaign', 'medium'].forEach(x => { if (x in k.vals) B.vals[x] = k.vals[x]; }); lbPaint(); const u = $('#lb-url'); if (u) u.focus(); return; }
        });
      },
    });
  }
  function lbApplyTemplateDefaults() {
    if (B.tpls.length !== 1) return; const t = tplOf(B.tpls[0]); if (usableShorteners().find(s => s.domain === t.shortener)) B.shortener = t.shortener; if (t.qr) { B.qr = true; B.design = t.qr; }
  }
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && lbRoot && document.body.contains(lbRoot) && B && !B.done) { e.preventDefault(); lbSave(); } });
  function openBuilder(o = {}) {
    if (!Q.linksAll) Q.linksAll = D.query({ range: ALL_RANGE, trigger: 'all', filters: [] });
    B = newBuilder(o);
    if (o.tpl) { B.tpls = [o.tpl]; lbApplyTemplateDefaults(); }
    if (o.edit) { const l = D.LINKS.find(x => x.slug === o.edit); if (l) { B.edit = l.slug; B.url = l.dest; UTM_KEYS.forEach(k => { if (paramOf(k)) B.vals[k] = l[k] || ''; }); const [dom, ...rest] = l.slug.split('/'); B.shortener = dom; B.slug = rest.join('/'); B.qr = l.qr > 0; B.design = designOf(l.slug).id; } }
    if (o.dup) { const l = D.LINKS.find(x => x.slug === o.dup); if (l) { B.url = l.dest; UTM_KEYS.forEach(k => { if (paramOf(k)) B.vals[k] = l[k] || ''; }); B.shortener = l.slug.split('/')[0]; B.qr = l.qr > 0; B.design = designOf(l.slug).id; B.touched = new Set(Object.keys(B.vals)); } }
    if (B.mode === 'ext') { B.url = 'acme.com/blog/fall-lookbook'; const s = openModal('', { width: 420 }); s.classList.add('ext-scrim'); const box = $('.modal', s); box.classList.add('lb-modal', 'ext'); lbMount(box); }
    else { B.back = { view: state.view, slug: state.slug, from: state.from }; state.view = 'build'; render({ top: true }); }
  }
  const lbBackLabel = () => { const b = B.back || {}; return b.view === 'link' ? b.slug : ({ links: 'Links', qr: 'QR codes', templates: 'Templates', shorteners: 'Link shorteners', parameters: 'Parameters' })[b.view] || 'Analytics'; };
  // Cancel, Done and the breadcrumb: close the extension popup, or go back to the page the builder was opened from.
  function lbClose(e) {
    if (e) e.preventDefault(); if (B.mode === 'ext') { closeModal(); lbRoot = null; return; }
    const b = B.back || {}; lbRoot = null;
    if (!b.view || b.view === 'build' || b.view === 'links') { goLinks({ keepFilters: true }); return; }
    Object.assign(state, { view: b.view, slug: b.slug, from: b.from }); render({ top: true });
  }
  function lbMount(box) {
    lbRoot = box; const s = box; const o = { focus: B.focus };
    lbPaint();
    const first = o.focus ? $(`#lb-${CSS.escape(o.focus)}`, box) : B.edit || B.mode === 'ext' ? null : $('#lb-url', box);
    setTimeout(() => { if (o.focus) lbJump(o.focus); else if (first) first.focus(); }, 80);
    const focusedKey = () => { const f = document.activeElement && document.activeElement.closest && document.activeElement.closest('.lb-f.lb-tone'); return f && box.contains(f) ? f.dataset.f : null; };
    s.addEventListener('focusin', e => { const f = e.target.closest('.lb-f.lb-tone'); lbHL(f ? f.dataset.f : null); });
    s.addEventListener('focusout', () => setTimeout(() => lbHL(focusedKey()), 0));
    s.addEventListener('mouseover', e => { const el = e.target.closest('.lb-f.lb-tone, .tk[data-tk]'); const k = el ? (el.dataset.f || el.dataset.tk) : focusedKey(); if (k !== B.hl) lbHL(k); });
    s.addEventListener('mouseleave', () => lbHL(focusedKey()));
    // All builder events are delegated from the modal so repaints don't drop listeners.
    s.addEventListener('input', e => { const t = e.target;
      if (t.dataset.lb) { B.vals[t.dataset.lb] = t.value; if (B.combo) B.combo.i = -1; lbComboOpen(t.dataset.lb); lbRefresh(); return; }
      if (t.id === 'lb-url') { const m = t.value.match(/^\s*(https?):\/\//i); if (m) { B.proto = m[1].toLowerCase(); t.value = t.value.replace(/^\s*https?:\/\//i, ''); const pr = $('#lb-proto', lbRoot); if (pr) pr.value = B.proto; } B.url = t.value; const u = utmFromUrl(t.value); const was = JSON.stringify(B.utmOffer); B.utmOffer = u; if (JSON.stringify(u) !== was) lbPaint(); else lbRefresh(); return; }
      if (t.id === 'lb-urls') { B.urls = t.value; lbRefresh(); return; }
      if (t.id === 'lb-slug') { B.slug = t.value; B.slugEdited = true; lbRefresh(); return; }
      if (t.id === 'lb-notes') { B.notes = t.value; return; } });
    s.addEventListener('change', e => { if (e.target.id === 'lb-proto') { B.proto = e.target.value; lbRefresh(); return; } if (e.target.id === 'lb-sh') { B.shortener = e.target.value; B.qrNote = ''; if (B.shortener === 'none' && B.qr) { B.qr = false; B.qrNote = 'QR codes need a short link, so the QR code was turned off.'; } lbPaint(); } });
    s.addEventListener('focusin', e => { const t = e.target; if (t.dataset && t.dataset.lb) lbComboOpen(t.dataset.lb); });
    s.addEventListener('focusout', e => { const t = e.target; if (!t.id) return; const key = t.dataset.lb || (t.id === 'lb-url' || t.id === 'lb-urls' ? 'url' : null); if (!key) return;
      setTimeout(() => { if (!lbRoot || !document.body.contains(t)) return; if (document.activeElement === t) return; if (key !== 'url' && $('.lb-pop', lbRoot) && $('.lb-pop', lbRoot).parentElement.dataset.f === key) lbComboClose(); if ((B.vals[key] || '').trim() || key === 'url' && (B.url || B.urls)) B.touched.add(key); else if (key !== 'url') B.touched.add(key); lbRefresh(); }, 120); });
    s.addEventListener('mousedown', e => { if (e.target.closest('.lb-opt, .lb-pop')) e.preventDefault(); });
    s.addEventListener('keydown', e => {
      const t = e.target; if (!t.dataset || !t.dataset.lb) return; const pop = $('.lb-pop', t.closest('.lb-f')); if (!pop) return; const opts = $$('.lb-opt', pop);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!opts.length) return; B.combo.i = (B.combo.i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('act', i === B.combo.i)); opts[B.combo.i].scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'Enter') { e.preventDefault(); const o = opts[B.combo.i] || (opts.length === 1 ? opts[0] : null) || opts.find(x => x.dataset.opt === t.value.trim()); if (o) lbPick(t.dataset.lb, o.dataset.opt); }
      else if (e.key === 'Escape' && pop) { e.stopPropagation(); lbComboClose(); } });
    s.addEventListener('click', e => { const h = sel => e.target.closest(sel); let el;
      if ((el = h('[data-opt]'))) { const f = el.closest('[data-f]'); lbPick(f.dataset.f, el.dataset.opt); return; }
      if ((el = h('[data-lb-use]'))) { lbPick(el.dataset.lbUse, el.dataset.v); return; }
      if ((el = h('[data-lb-addval]'))) { const p = lbP(el.dataset.lbAddval); const v = normalizeValue(p, (B.vals[p.key] || '').trim()); if (v && !p.values.find(x => x.v === v)) { addValues(p, [v]); toast(`Added “${v}” to ${p.label.toLowerCase()} on Parameters`); } lbPick(p.key, v); return; }
      if ((el = h('[data-lb-multi]'))) { B.multi = el.dataset.lbMulti === '1'; if (B.multi && !B.urls && B.url) B.urls = B.url; if (!B.multi && !B.url && B.urls) B.url = lbUrls()[0] || ''; lbPaint(); const i = $(B.multi ? '#lb-urls' : '#lb-url', box); if (i) i.focus(); return; }
      if ((el = h('[data-tpl-pick]'))) { const k = el.dataset.tplPick; B.tpls = B.tpls.includes(k) ? B.tpls.filter(x => x !== k) : [...B.tpls, k]; lbApplyTemplateDefaults(); lbPaint(); return; }
      if (h('#lb-tpl-clear')) { B.tpls = []; lbPaint(); return; }
      if (h('#lb-more')) { B.more = !B.moreOpen; lbPaint(); return; }
      if (h('#lb-qr')) { e.preventDefault(); B.qr = !B.qr; B.qrNote = ''; if (B.qr && B.shortener === 'none') { B.shortener = defaultShortener(); B.qrNote = `QR codes need a short link, so ${B.shortener} was picked for you.`; } lbPaint(); return; }
      if ((el = h('[data-lb-design]'))) { B.design = el.dataset.lbDesign; lbPaint(); return; }
      if (h('#lb-route')) { toast('Smart routing setup is outside this prototype'); return; }
      if ((el = h('[data-tk]'))) { lbJump(el.dataset.tk); return; }
      if ((el = h('[data-jump]'))) { lbJump(el.dataset.jump); return; }
      if (h('#lb-utm-use')) { Object.entries(B.utmOffer).forEach(([k, v]) => { B.vals[k] = normalizeValue(paramOf(k), v); B.touched.add(k); }); B.url = stripUtm(B.url); B.utmOffer = null; lbPaint(); toast('Moved the URL\'s UTM tags into the fields'); return; }
      if (h('#lb-utm-no')) { B.utmOffer = null; lbPaint(); return; }
      if (h('#lb-save')) { lbSave(); return; }
      if (h('#lb-copy-short')) { copyText(`${B.shortener}/${lbSlug()}`, 'Short link copied'); return; }
      if ((el = h('[data-copy-l]'))) { copyText(el.dataset.copyL, 'Copied'); return; }
      if (h('#lb-copy-all')) { copyText(B.done.links.map(l => l.short || l.long).join('\n'), `Copied ${B.done.links.length} links`); return; }
      if (h('#lb-csv')) { toast(`Exported ${B.done.links.length} links as CSV`); return; }
      if (h('#lb-qr-dl')) { toast('QR code PNG downloaded'); return; }
      if (h('#lb-to-links')) { lbRoot = null; if (B.mode === 'ext') closeModal(); goLinks(); return; }
      if (h('#lb-again')) { const keep = { tpls: B.tpls, vals: { ...B.vals }, shortener: B.shortener, qr: B.qr, design: B.design, mode: B.mode }; B = newBuilder({ mode: keep.mode }); Object.assign(B, { tpls: keep.tpls, shortener: keep.shortener, qr: keep.qr, design: keep.design }); ['campaign', 'medium'].forEach(k => { if (k in keep.vals) B.vals[k] = keep.vals[k]; }); lbPaint(); const u = $('#lb-url', box); if (u) u.focus(); return; }
      if (h('#ext-use-tab')) { B.url = 'acme.com/blog/fall-lookbook'; lbPaint(); return; }
      if (h('#ext-ws')) { toast('Workspace switching is outside this prototype'); return; }
      if (h('#ext-open-web')) { closeModal(); lbRoot = null; goLinks(); return; }
      if (!h('.lb-f')) lbComboClose(); });
  }

  // Which table a list page draws, so search and sort can redraw just that card.
  const LIST_TABLE = { links: linksTableHTML, qr: qrTableHTML, templates: templatesTableHTML, shorteners: shortenersTableHTML, parameters: () => state.pview === 'list' ? paramValuesCard() : pbAreaHTML() };
  const listTableEl = () => $('#links-table') || $('#list-table');
  function listMoreMenu(anchor) {
    const what = state.view === 'qr' ? 'QR codes' : state.view === 'templates' ? 'templates' : 'shorteners';
    openPop(anchor, `<div class="menu" style="width:230px">
      <button class="mi" data-act="list-csv">${I.download}<span class="grow">Export ${what} as CSV</span></button>
      ${state.view === 'qr' ? `<button class="mi" data-act="qr-designs">${I.swatch}<span class="grow">QR designs…</span></button>` : state.view === 'templates' ? `<button class="mi" data-act="tpl-import">${PI.upload}<span class="grow">Import templates via CSV</span></button>` : `<button class="mi" data-act="cleaner">${I.sliders}<span class="grow">UTM Page Cleaner…</span></button>`}
      <div class="sep"></div>
      <button class="mi" data-act="about">${I.info}<span class="grow">Tips &amp; shortcuts</span></button></div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; closePop(); const a = b.dataset.act;
        if (a === 'list-csv') toast(`Exported ${what} as CSV`); else if (a === 'qr-designs') qrDesignsModal(); else if (a === 'about') tipsModal(); else toast(`${b.textContent.trim()} is outside this prototype`); }); } });
  }

  /* ---------- Render + post-render effects ---------- */
  const prevCounts = {};
  function render(opts = {}) {
    closePop();
    compute();
    // vReskin: pages that keep today's UX are drawn by reskin.js; Analytics and the link report stay here.
    if (window.RESKIN && RESKIN.owns(state.view)) { RESKIN.render(opts); return; }
    const view = $('#view');
    const y = window.scrollY;
    // instant: same page, different view (e.g. Parameters Board ↔ List). Header and toolbar stay put; only the content fades.
    view.classList.toggle('instant', !!opts.instant); if (opts.instant) setTimeout(() => view.classList.remove('instant'), 400);
    if (opts.busy) { view.classList.add('busy'); setTimeout(() => view.classList.remove('busy'), 500); }
    const VIEWS = { build: () => `<div class="view lb-page${B && B.done ? ' is-done' : ''}" id="lb-page"></div>`, link: linkHTML, links: linksHTML, qr: qrHTML, templates: templatesHTML, shorteners: shortenersHTML, parameters: parametersHTML };
    view.innerHTML = (VIEWS[state.view] || overviewHTML)();
    if (state.view === 'build') lbMount($('#lb-page'));
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
      drawChart(); if (state.view === 'parameters' && state.pview !== 'list') pbDraw();
    });
    const section = state.view === 'build' ? (LIST_VIEWS.includes(B.back.view) ? B.back.view : B.back.view === 'link' && LIST_VIEWS.includes(B.back.from) ? B.back.from : 'links') : state.view === 'link' ? (LIST_VIEWS.includes(state.from) ? state.from : 'analytics') : LIST_VIEWS.includes(state.view) ? state.view : 'analytics';
    $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === section));
    const TITLES = { links: 'Links', qr: 'QR codes', templates: 'Templates', shorteners: 'Link shorteners', parameters: 'Parameters' };
    $('#topbar-title').textContent = state.view === 'link' ? state.slug : state.view === 'build' ? (B.edit ? 'Edit link' : 'Create link') : TITLES[state.view] || 'Acme Marketing';
    try { location.hash = state.view === 'build' ? (B.edit ? 'edit-link' : 'create-link') : state.view === 'link' ? 'link-' + state.slug.replace(/[^a-z0-9]+/gi, '-') : state.view === 'parameters' ? 'parameters-' + state.param : state.view; } catch (e) { /* ignore */ }
  }
  window.addEventListener('resize', (() => { let t; return () => { clearTimeout(t); t = setTimeout(() => { drawChart(); pbDraw(); }, 120); }; })());

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
  // The bar's search box: typing drops the value list down under the whole field; empty closes it.
  $('#view').addEventListener('input', e => {
    if (e.target.id !== 'fq') return;
    const fbar = $('#fbar');
    if (!e.target.value.trim()) { if (pop && pop.anchor === fbar) closePop(); return; }
    if (pop && pop.anchor === fbar && pop.el._redraw) pop.el._redraw(); else filterMenu(fbar, '', e.target);
  });
  $('#view').addEventListener('keydown', e => { if (e.target.id === 'fq' && pop && pop.el._keys) pop.el._keys(e); });
  // Type-to-filter: on pages with the filter field, typing anywhere goes into it; "/" just focuses it.
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || pop || $('.scrim') || (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]'))) return;
    const box = $('#fq') || $('#fbar #lq'); if (!box) return;
    if (e.key === '/') { e.preventDefault(); box.focus(); }
    else if (/^[\p{L}\p{N}_.@-]$/u.test(e.key)) { e.preventDefault(); box.focus(); box.value += e.key; box.dispatchEvent(new Event('input', { bubbles: true })); }
  });

  /* ---------- Filter menu ---------- */
  // One search for fields AND their values: typing "sale" finds Campaign = fall_sale_2026 directly,
  // offers "Campaign contains “sale”", and still lists matching fields. ↑↓ to move, Enter to pick.
  function filterMenu(anchor, initial = '', ext = null) {
    const groups = [...new Set(D.DIMS.map(d => d.group))];
    const icon = { link: I.links, trigger: I.trigger, campaign: I.tag, source: I.tag, medium: I.tag, content: I.tag, term: I.tag, referrer: I.referrer, country: I.globe, region: I.globe, city: I.globe, device: I.device, browser: I.device, os: I.device };
    const ctx = { range: state.view === 'links' ? ALL_RANGE : state.range, trigger: state.trigger, filters: state.view === 'link' ? [...state.filters, { dim: 'link', op: 'is', values: [state.slug] }] : state.filters };
    let index = null; // every value of every field, built on first keystroke
    const allValues = () => index || (index = D.DIMS.filter(d => d.key !== 'trigger').flatMap(d => D.valuesFor(d.key, ctx).filter(v => v.label !== '(not set)').map(v => {
      // Countries match by name too ("united"); regions and cities only by their own name, like the contains filter.
      return { dim: d.key, label: v.label, value: v.value, text: (v.label + (d.key === 'country' && D.COUNTRIES[v.label] ? ' ' + D.COUNTRIES[v.label].name : '')).toLowerCase() };
    })));
    const mark = (txt, ql) => esc(txt).replace(new RegExp(`(${esc(ql).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<mark>$1</mark>');
    const isOn = (dim, v) => state.filters.some(f => f.dim === dim && f.op === 'is' && f.values.includes(v));
    const fieldRow = d => { const active = state.filters.some(f => f.dim === d.key); return `<button class="mi ${active ? 'on' : ''}" data-dim="${d.key}">${icon[d.key]}<span class="grow">${esc(d.label)}</span>${d.utm ? `<span class="utm">${d.utm}</span>` : ''}${active ? `<span class="check">${I.check.replace('<svg', '<svg style="width:14px;height:14px"')}</span>` : ''}<span class="chev">${I.chevR}</span></button>`; };
    const render = q => {
      const ql = q.trim().toLowerCase();
      if (!ql) return groups.map(g => `<div class="group">${esc(g)}</div>` + D.DIMS.filter(d => d.group === g).map(fieldRow).join('')).join('');
      const fields = D.DIMS.filter(d => d.label.toLowerCase().includes(ql) || (d.utm || '').includes(ql));
      const vals = allValues().filter(v => v.text.includes(ql)).sort((a, b) => (b.label.toLowerCase().startsWith(ql) - a.label.toLowerCase().startsWith(ql)) || b.value - a.value);
      const byDim = {}; vals.forEach(v => { (byDim[v.dim] = byDim[v.dim] || []).push(v); });
      let html = '';
      const noun = { links: 'links', qr: 'QR codes' }[state.view];
      if (noun) {
        const prev = state.lq; state.lq = q.trim(); const hits = (state.view === 'qr' ? qrRows() : linkRows()).length; state.lq = prev;
        if (hits) html += `<div class="group">Search</div><button class="mi" data-text>${I.search}<span class="grow">${noun[0].toUpperCase() + noun.slice(1)} matching “${esc(q.trim())}”</span><span class="fm-n num">${hits}</span></button>`;
      }
      if (fields.length) html += `<div class="group">Fields</div>` + fields.map(fieldRow).join('');
      if (vals.length) html += `<div class="group">Values</div>` + vals.slice(0, 8).map(v => {
        const geo = geoLabel(v.dim, v.label), on = isOn(v.dim, v.label);
        return `<button class="mi fm-val ${on ? 'on' : ''}" data-pick="${v.dim}" data-v="${esc(v.label)}">${icon[v.dim]}<span class="grow fm-l">${geo || mark(v.label, ql)}</span><span class="fm-dim">${esc(D.DIM[v.dim].label)}</span><span class="fm-n num">${on ? 'Added' : fmt.n(v.value)}</span></button>`;
      }).join('') + (vals.length > 8 ? `<div class="fm-more">${vals.length - 8} more. Narrow the search or use “contains” below.</div>` : '');
      const cdims = Object.keys(byDim).filter(k => !(byDim[k].length === 1 && byDim[k][0].label.toLowerCase() === ql)); // skip when it'd equal the exact value
      if (cdims.length) html += `<div class="group">Match text</div>` + cdims.map(k => `<button class="mi" data-contains="${k}">${I.search}<span class="grow">${esc(D.DIM[k].label)} <span class="fm-op">contains</span> “${esc(q.trim())}”</span><span class="fm-n num">${byDim[k].length} value${byDim[k].length === 1 ? '' : 's'}</span></button>`).join('');
      return html || `<div class="fm-empty"><b>Nothing matches “${esc(q.trim())}”</b>Try part of a campaign, source, city or link.</div>`;
    };
    const listHTML = `<div class="menu fm" id="dim-list" style="max-height:420px;overflow-y:auto;width:360px">${render(ext ? ext.value : initial)}</div><div class="fm-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> add</span><span class="grow"></span><span>${ext ? '<kbd>esc</kbd> close' : 'Try “sale” or “London”'}</span></div>`;
    openPop(anchor, ext ? listHTML : `<div class="search">${I.search}<input id="dim-q" placeholder="Search fields and values…" aria-label="Search fields and values" value="${esc(initial)}"></div>${listHTML}`, {
      onMount(el) {
        const list = $('#dim-list', el), q = ext || $('#dim-q', el);
        let hl = 0;
        const items = () => $$('.mi', list);
        const paint = () => { items().forEach((b, k) => b.classList.toggle('hl', k === hl)); const b = items()[hl]; if (b) b.scrollIntoView({ block: 'nearest' }); };
        const redraw = () => { list.innerHTML = render(q.value); hl = 0; if (q.value.trim()) paint(); };
        const keys = e => {
          const n = items().length;
          if (e.key === 'ArrowDown' && n) { e.preventDefault(); hl = (hl + 1) % n; paint(); }
          else if (e.key === 'ArrowUp' && n) { e.preventDefault(); hl = (hl - 1 + n) % n; paint(); }
          else if (e.key === 'Enter') { e.preventDefault(); const b = items()[hl]; if (b) b.click(); }
        };
        if (ext) { el._redraw = redraw; el._keys = keys; paint(); } // the bar's box drives it (see #fq below)
        else {
        q.focus(); q.setSelectionRange(q.value.length, q.value.length); // focus now, so fast typing isn't lost
        if (initial) paint();
        q.addEventListener('input', redraw);
        q.addEventListener('keydown', keys);
        }
        list.addEventListener('click', e => {
          const b = e.target.closest('.mi'); if (!b) return;
          if (b.hasAttribute('data-text')) { state.lq = q.value.trim(); closePop(); render0({ busy: true }); return; }
          if (b.dataset.dim) { valuePicker(anchor, b.dataset.dim, state.filters.findIndex(f => f.dim === b.dataset.dim), true); return; }
          if (b.dataset.contains) { const dim = b.dataset.contains, t = q.value.trim(); state.filters.push({ dim, op: 'contains', values: [t] }); closePop(); render0({ busy: true }); toast(`Added filter: ${D.DIM[dim].label} contains “${t}”`); return; }
          const dim = b.dataset.pick, v = b.dataset.v;
          if (isOn(dim, v)) { toast(`${D.DIM[dim].label} is already filtered to ${v}`); return; }
          // Same field already filtered with "is"? Add this value to it (A or B) instead of a second chip.
          const f = state.filters.find(x => x.dim === dim && x.op === 'is');
          if (f) f.values.push(v); else state.filters.push({ dim, op: 'is', values: [v] });
          closePop(); render0({ busy: true }); toast(`Added filter: ${D.DIM[dim].label} is ${v}`);
        });
      },
    });
  }
  const render0 = o => render(o);

  function valuePicker(anchor, dim, editIndex = -1, fromMenu = false) {
    const d = D.DIM[dim];
    const existing = editIndex > -1 ? state.filters[editIndex] : null;
    let op = existing ? existing.op : 'is';
    const sel = new Set(existing && op !== 'contains' ? existing.values : []);
    const ctx = { range: state.view === 'links' ? ALL_RANGE : state.range, trigger: state.trigger, filters: state.view === 'link' ? [...state.filters, { dim: 'link', op: 'is', values: [state.slug] }] : state.filters };
    const values = dim === 'trigger' ? [{ label: 'Link click', value: Q.unfiltered.totals.linkClicks, share: 0 }, { label: 'QR scan', value: Q.unfiltered.totals.qr, share: 0 }] : D.valuesFor(dim, ctx);
    const cname = v => { const cc = dim === 'country' ? v.label : D.PLACE[dim] && D.PLACE[dim][v.label] && D.PLACE[dim][v.label].cc; return cc && D.COUNTRIES[cc] ? D.COUNTRIES[cc].name.toLowerCase() : ''; };
    // "contains" matches the text itself (countries by name); the search box finds values for is / is not.
    const matching = ql => values.filter(v => !ql || v.label.toLowerCase().includes(ql) || (op === 'contains' ? dim === 'country' : true) && cname(v).includes(ql));
    const list = q => {
      const ql = q.trim().toLowerCase();
      if (op === 'contains' && !ql) return `<div class="group vp-hint">Type part of a value. “sale” matches fall_sale_2026 and spring_sale.</div>`;
      const vs = matching(ql);
      if (!vs.length) return `<div class="group" style="padding:14px 10px">No values match “${esc(q)}”${op === 'contains' ? '. The filter still applies to future clicks.' : ''}</div>`;
      return vs.map(v => {
        let label = geoLabel(dim, v.label) || esc(v.label);
        if (ql && !geoLabel(dim, v.label)) label = label.replace(new RegExp(`(${ql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<mark>$1</mark>');
        return op === 'contains'
          ? `<div class="val match"><span class="lbl">${label}</span><span class="cnt num">${fmt.n(v.value)}</span></div>`
          : `<label class="val ${sel.has(v.label) ? 'on' : ''}" data-v="${esc(v.label)}"><span class="box">${I.check}</span><span class="lbl">${label}</span><span class="cnt num">${fmt.n(v.value)}</span></label>`;
      }).join('');
    };
    const ops = ['is', 'is not', 'contains'].map(o => `<button data-op="${o}" class="${op === o ? 'on' : ''}">${o}</button>`).join('');
    const html = `<div class="pop-head">${fromMenu ? `<button class="back" id="vp-back" aria-label="Back">${I.arrowL}</button>` : ''}<span>${esc(d.label)}</span><span class="op-toggle" style="margin-left:auto">${ops}</span></div>
      <div class="search">${I.search}<input id="vp-q" aria-label="Search values" value="${existing && op === 'contains' ? esc(existing.values[0]) : ''}"></div>
      <div class="vals" id="vp-list" style="width:340px"></div>
      <div class="pop-foot"><span class="grow" id="vp-count"></span><button class="btn ghost" id="vp-cancel">Cancel</button><button class="btn primary" id="vp-apply">${existing ? 'Update' : 'Apply'} filter</button></div>`;
    openPop(anchor, html, {
      role: 'dialog',
      onMount(el) {
        const listEl = $('#vp-list', el), q = $('#vp-q', el), apply = $('#vp-apply', el), count = $('#vp-count', el);
        const text = () => q.value.trim();
        const sync = () => {
          if (op === 'contains') {
            const ms = text() ? matching(text().toLowerCase()) : [];
            apply.disabled = !text();
            count.textContent = text() ? `Matches ${ms.length} value${ms.length === 1 ? '' : 's'} · ${fmt.n(ms.reduce((a, v) => a + v.value, 0))} clicks` : 'Matches any part, any case';
          } else { apply.disabled = !sel.size; count.textContent = sel.size ? `${sel.size} selected` : 'Applies to this dashboard and the Links table'; }
        };
        const redraw = () => { q.placeholder = op === 'contains' ? `${d.label} contains…` : `Search ${d.label.toLowerCase()}…`; listEl.innerHTML = list(q.value); sync(); };
        redraw();
        q.addEventListener('input', redraw);
        q.addEventListener('keydown', e => { if (e.key !== 'Enter') return; if (op === 'contains') { if (text()) apply.click(); return; } const first = $('.val', listEl); if (first && !sel.size) { first.click(); } else if (sel.size) apply.click(); });
        listEl.addEventListener('click', e => { const l = e.target.closest('label.val'); if (!l) return; const v = l.dataset.v; if (sel.has(v)) sel.delete(v); else sel.add(v); l.classList.toggle('on', sel.has(v)); sync(); });
        $$('[data-op]', el).forEach(b => b.addEventListener('click', () => { op = b.dataset.op; $$('[data-op]', el).forEach(x => x.classList.toggle('on', x === b)); redraw(); q.focus(); }));
        $('#vp-cancel', el).addEventListener('click', closePop);
        const back = $('#vp-back', el); if (back) back.addEventListener('click', () => filterMenu(anchor));
        apply.addEventListener('click', () => {
          const vals = op === 'contains' ? [text()] : [...sel];
          if (!vals.length || !vals[0]) return;
          const f = { dim, op, values: vals };
          if (editIndex > -1) state.filters[editIndex] = f; else state.filters.push(f);
          closePop(); render({ busy: true }); toast(`${existing ? 'Updated' : 'Added'} filter: ${d.label} ${op} ${op === 'contains' ? `“${vals[0]}”` : vals.slice(0, 2).join(', ') + (vals.length > 2 ? ` +${vals.length - 2}` : '')}`);
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
      case 'links-import': toast('Import links via CSV is outside this prototype'); break;
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
    const list = q => rowsHTML(items.filter(i => !q || i.label.toLowerCase().includes(q.toLowerCase()) || (i.code && D.COUNTRIES[i.code] && D.COUNTRIES[i.code].name.toLowerCase().includes(q.toLowerCase()))), { dim, bar: CARD_BARS[id], limit: 500 });
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
      <h4>QR codes, Templates, Link shorteners</h4><ul>
      <li><b>QR codes</b> lists every link that has a code, with scans and its design. Click a row to preview and download; tick rows to change the design in bulk.</li>
      <li><b>Templates</b> shows each template's parameters. Dashed chips are asked for in the link builder. Click "N links" to see the links built from it.</li>
      <li><b>Link shorteners</b>: switch a domain off to hide it from the builder without breaking links. "Needs DNS" shows the record to add.</li></ul>
      <h4>Parameters</h4><ul>
      <li>Pick a parameter on the left; its saved values are on the right with how many links use each one. Top-to-bottom order is the link builder order.</li>
      <li><b>Tags</b> on a row flag what needs a look: <i>Not saved</i> (used in links but not in the list), <i>Duplicate?</i> (e.g. <i>Facebook</i> vs <i>facebook</i>), <i>Check</i> (capitals or spaces), <i>Unused</i> (no links for 90 days) and <i>New</i>.</li>
      <li><b>Groupings</b> narrow a list: when medium is <i>paid_social</i>, source offers only paid platforms. On the Board, hover a value to see its lines; click it, then tick values in the next column to group them. Esc to finish.</li>
      <li>Type in the add row to add a value (paste a list to add several). Delete removes a value from the builder; links that already use it keep working. Merge keeps one value and moves groupings across.</li></ul>
      <h4>Keyboard shortcuts</h4><p>With the date menu open: <kbd>D</kbd> Today · <kbd>E</kbd> Yesterday · <kbd>W</kbd> Last 7 days · <kbd>T</kbd> Last 30 days · <kbd>M</kbd> This month · <kbd>L</kbd> Last month · <kbd>Q</kbd> Last 90 days. Start typing anywhere (or press <kbd>/</kbd>) to filter. <kbd>Esc</kbd> closes any menu.</p></div>`, { width: 560 });
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
  function goBack() { if (state.from === 'links') goLinks({ keepFilters: true }); else if (LIST_VIEWS.includes(state.from)) goPage(state.from, { keepFilters: true }); else goOverview(); }

  /* ---------- Global event delegation ---------- */
  $('#view').addEventListener('click', e => {
    const t = e.target; if (t.closest('#lb-page')) return;
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
    if (hit('#fbar') && !hit('button, .chip, input')) { ($('#fq') || $('#lq')).focus(); return; }
    if (hit('.lbar') && !hit('button, .chip, input')) { $('#lq').focus(); return; }
    if ((el = hit('[data-metric]'))) { state.metric = el.dataset.metric; $$('[data-metric]').forEach(k => { k.classList.toggle('on', k === el); k.setAttribute('aria-selected', k === el); }); drawChart(); return; }
    if ((el = hit('[data-sort]'))) { const k = el.dataset.sort; if (state.sort.key === k) state.sort.dir *= -1; else state.sort = { key: k, dir: k === 'link' ? 1 : -1 }; swapSection($('#top-links'), tableHTML()); return; }
    if (hit('#show-all')) { state.showAll = !state.showAll; swapSection($('#top-links'), tableHTML()); return; }
    if (hit('#open-links')) { e.preventDefault(); goLinks({ keepFilters: true }); return; }
    if ((el = hit('[data-utm]'))) { toggleFilter(el.dataset.utm, el.dataset.val); return; }
    if ((el = hit('[data-copy]'))) { copyText(el.dataset.copy, 'Copied to clipboard'); return; }
    // Links page
    if (hit('#create-btn') || hit('#create-btn-empty')) { openBuilder(); return; }
    if (hit('#import-btn')) { toast('Import links via CSV is outside this prototype'); return; }
    if (hit('#group-btn')) { groupMenu(hit('#group-btn')); return; }
    if (hit('#lsort-btn')) { lsortMenu(hit('#lsort-btn')); return; }
    if (hit('#links-more')) { linksMoreMenu(hit('#links-more')); return; }
    if (hit('#list-more')) { if (state.view === 'parameters') paramsMoreMenu(hit('#list-more')); else listMoreMenu(hit('#list-more')); return; }
    if (hit('#lq-clear') || hit('#clear-search')) { state.lq = ''; if (hit('#clear-search')) state.filters = []; render(); return; }
    if ((el = hit('[data-lsort]'))) { const k = el.dataset.lsort; if (state.lsort.key === k) state.lsort.dir *= -1; else state.lsort = { key: k, dir: ['link', 'campaign', 'name', 'domain', 'value'].includes(k) ? 1 : -1 }; swapSection(listTableEl(), LIST_TABLE[state.view]()); return; }
    if ((el = hit('[data-sel]'))) { const sl = el.dataset.sel; if (state.sel.has(sl)) state.sel.delete(sl); else state.sel.add(sl); refreshSelection(); return; }
    if (hit('#sel-all')) { const ids = selectableIds(); const all = ids.every(i => state.sel.has(i)); ids.forEach(i => all ? state.sel.delete(i) : state.sel.add(i)); refreshSelection(); return; }
    if ((el = hit('[data-group]'))) { const g = el.dataset.group; if (state.collapsed.has(g)) state.collapsed.delete(g); else state.collapsed.add(g); swapSection($('#links-table'), linksTableHTML()); return; }
    if ((el = hit('[data-bulk]'))) { bulk(el.dataset.bulk); return; }
    if ((el = hit('[data-row-qr]'))) { qrModal(D.LINKS.find(l => l.slug === el.dataset.rowQr)); return; }
    if ((el = hit('[data-row-analytics]'))) { goLink(el.dataset.rowAnalytics); return; }
    if ((el = hit('[data-row-more]'))) { rowMenu(el, el.dataset.rowMore); return; }
    // QR codes page
    if (hit('#create-qr-btn') || hit('#create-qr-empty')) { toast('Create QR code opens the link builder with QR on (outside this prototype)'); return; }
    if (hit('#qr-designs-btn')) { qrDesignsModal(); return; }
    if ((el = hit('[data-qr-dl]'))) { toast(`QR code PNG for ${el.dataset.qrDl} downloaded`); return; }
    if ((el = hit('[data-qr-more]'))) { qrMenu(el, el.dataset.qrMore); return; }
    if ((el = hit('[data-qr-open]'))) { qrModal(D.LINKS.find(l => l.slug === el.dataset.qrOpen)); return; }
    // Templates page
    if (hit('#create-tpl-btn') || hit('#create-tpl-empty')) { toast('Create template opens the template editor (outside this prototype)'); return; }
    if (hit('#import-tpl-btn')) { toast('Import templates via CSV is outside this prototype'); return; }
    if ((el = hit('[data-tpl-links]'))) { const t = TEMPLATE_LIST.find(x => x.key === el.dataset.tplLinks); goLinks(); state.lq = t.medium; render(); return; }
    if ((el = hit('[data-tpl-use]'))) { openBuilder({ tpl: el.dataset.tplUse }); return; }
    if ((el = hit('[data-tpl-edit]'))) { toast('Template editing is outside this prototype'); return; }
    if ((el = hit('[data-tpl-more]'))) { templateMenu(el, el.dataset.tplMore); return; }
    if ((el = hit('[data-tpl]'))) { templateModal(el.dataset.tpl); return; }
    // Parameters page
    if (state.view === 'parameters') {
      const p = curParam(); const pvId = el => el.dataset.pvId || el.dataset.pvEdit || el.dataset.pvMore || el.dataset.pvLinks || el.dataset.pv; const rowOf = id => paramValueRows(p, { all: true }).find(r => r.id === id);
      if ((el = hit('[data-pview]'))) { if (state.pview === el.dataset.pview) return; state.pview = el.dataset.pview; state.psel = null; state.padd = null; state.sel.clear(); render({ instant: true }); return; }
      if (state.pview !== 'list' && pbClick(e)) return;
      if ((el = hit('[data-pm]'))) { goParam(el.dataset.pm, el.dataset.ptab || null); return; }
      if (hit('#pm-add-param')) { paramModal(null); return; }
      if ((el = hit('[data-pbmore]'))) { const w = $('#pb'), c = $('.pb-col', w); w.scrollBy({ left: +el.dataset.pbmore * (c ? c.offsetWidth + 44 : 280), behavior: 'smooth' }); return; }
      if (hit('#pm-how')) { pbHowPop(hit('#pm-how')); return; }
      if (hit('#pm-page-more')) { paramsMoreMenu(hit('#pm-page-more')); return; }
      if (hit('#pm-export')) { toast('Exported all parameters as CSV'); return; }
      if (hit('#pm-import')) { importParamsModal(); return; }
      if (hit('#pm-edit')) { paramModal(p); return; }
      if (hit('#pm-more')) { paramMoreMenu(hit('#pm-more'), p); return; }
      if (hit('[data-nav-rules]')) { e.preventDefault(); toast('Rules is outside this prototype'); return; }
      if ((el = hit('[data-ptab]'))) { state.ptab = el.dataset.ptab; state.sel.clear(); render(); return; }
      if (hit('#pm-clear')) { state.lq = ''; render(); return; }
      if ((el = hit('[data-fix]'))) { const r = rowOf(el.dataset.pvId); if (r) applyFix(p, r, { fix: el.dataset.fix }); return; }
      if ((el = hit('[data-pv-links]'))) { const r = rowOf(el.dataset.pvLinks); if (r) showValueLinks(p, r.v); return; }
      if ((el = hit('[data-pv-edit]'))) { const r = rowOf(el.dataset.pvEdit); if (r && r.val) editValueModal(p, r.v); return; }
      if ((el = hit('[data-pv-grp]'))) { groupingPicker(p, el.dataset.pvGrp); return; }
      if ((el = hit('[data-pv-more]'))) { valueMenu(el, el.dataset.pvMore); return; }
      if ((el = hit('[data-grp-edit]'))) { groupingEditor(p, el.dataset.grpEdit); return; }
      if (hit('#grp-parent')) { chooseParent(p); return; }
      if (hit('#pv-add-form')) { if (!hit('.pm-addbtn')) { const i = $('#pv-add'); if (i && e.target !== i) i.focus(); } return; }
      if ((el = hit('[data-pv]'))) { const r = rowOf(el.dataset.pv); if (!r) return; if (r.val) editValueModal(p, r.v); else valueMenu($('[data-pv-more]', el) || el, r.id); return; }
    }
    // Link shorteners page
    if (hit('#add-dom-btn')) { addShortenerModal(); return; }
    if (hit('#cleaner-btn')) { toast('UTM Page Cleaner setup is outside this prototype'); return; }
    if ((el = hit('[data-dns]'))) { dnsModal(el.dataset.dns); return; }
    if ((el = hit('[data-dom-links]'))) { goLinks(); state.lq = el.dataset.domLinks; render(); return; }
    if ((el = hit('[data-toggle-dom]'))) { const d = el.dataset.toggleDom; if (state.disabledDomains.has(d)) state.disabledDomains.delete(d); else state.disabledDomains.add(d); swapSection(listTableEl(), shortenersTableHTML()); toast(`${d} ${state.disabledDomains.has(d) ? 'hidden from' : 'available in'} the link builder`); return; }
    if ((el = hit('[data-dom-edit]'))) { shortenerMenu(el, el.dataset.domEdit); return; }
    if ((el = hit('[data-dom-delete]'))) { confirmRemoveShortener(SHORTENERS.find(x => x.domain === el.dataset.domDelete)); return; }
    if ((el = hit('[data-domain]'))) { shortenerMenu($('.acts .icon-btn', el) || el, el.dataset.domain); return; }
    if ((el = hit('[data-link]'))) { goLink(el.dataset.link); return; }
    if ((el = hit('[data-tab]'))) { const cardEl = el.closest('[data-card]'); const id = cardEl.dataset.card; if (state.tabs[id] === el.dataset.tab) return; state.tabs[id] = el.dataset.tab; swapSection(cardEl, cardFor(id)); return; }
    if ((el = hit('[data-expand]'))) { expandModal(el.dataset.expand); return; }
    if ((el = hit('[data-country]'))) { if (+el.dataset.val > 0) toggleFilter('country', el.dataset.country); return; }
    if ((el = hit('.row[data-dim]'))) { toggleFilter(el.dataset.dim, el.dataset.val); return; }
    if (hit('#back')) { e.preventDefault(); goBack(); return; }
    if (hit('#qr-btn')) { qrModal(D.LINKS.find(l => l.slug === state.slug)); return; }
    if (hit('#edit-btn')) { openBuilder({ edit: state.slug }); return; }
  });
  $('#view').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.row, .trow.data, .lrow, .pb-v')) { e.preventDefault(); e.target.click(); } });
  // List search: redraw only the table, keep the caret where it is
  $('#view').addEventListener('input', (() => { let t; return e => { if (e.target.id !== 'lq') return; state.lq = e.target.value; const c = $('#lq-clear'); if (c) c.hidden = !state.lq; clearTimeout(t); t = setTimeout(() => { if (state.view === 'parameters' && state.pview !== 'list') { pbRefresh(); return; } swapSection(listTableEl(), LIST_TABLE[state.view]()); if (state.view === 'parameters') { const rail = $('.pm-rail'); if (rail) rail.outerHTML = railHTML(); } }, 120); }; })());
  // Parameters: inline add-value row (validates as you type, Enter adds, a pasted list adds several)
  $('#view').addEventListener('input', e => { if (e.target.id !== 'pv-add') return; const p = curParam(); const hint = $('#pv-hint'), btn = $('#pv-add-form .btn'); const raw = e.target.value;
    if (!raw.trim()) { hint.textContent = `${p.hint} · ${p.rules.includes('lowercase') ? 'lowercase · ' : ''}${p.format === 'number' ? 'numbers only · ' : ''}spaces become “-” · paste a list to add several`; hint.classList.remove('bad'); btn.classList.remove('ready'); return; }
    if (/[\n,]/.test(raw)) { const n = raw.split(/[\n,]/).map(x => x.trim()).filter(x => validateValue(p, x).ok).length; hint.textContent = `${n} new value${n === 1 ? '' : 's'} will be added`; hint.classList.remove('bad'); btn.classList.toggle('ready', n > 0); return; }
    const r = validateValue(p, raw); hint.textContent = r.msg || 'Press Enter to add'; hint.classList.toggle('bad', !r.ok); btn.classList.toggle('ready', r.ok); });
  $('#view').addEventListener('submit', e => { if (e.target.id !== 'pv-add-form') return; e.preventDefault(); const p = curParam(); const inp = $('#pv-add'); const raw = inp.value; if (!raw.trim()) { inp.focus(); return; }
    const added = addValues(p, raw.split(/[\n,]/)); if (!added.length) return; render(); const i = $('#pv-add'); if (i) i.focus();
    toast(added.length === 1 ? `Added “${added[0]}” to ${p.label.toLowerCase()}` : `Added ${added.length} values to ${p.label.toLowerCase()}`); });
  // Selection: update checkboxes + bulk bar in place, no re-render
  const selectableIds = () => state.view === 'qr' ? qrRows().map(r => r.link.slug) : state.view === 'parameters' ? paramValueRows().filter(r => r.status !== 'unplanned').map(r => r.id) : linkRows().map(r => r.link.slug);
  function refreshSelection() {
    $$('.lrow[data-link], .lrow[data-qr-open], .lrow[data-pv]').forEach(r => { const id = r.dataset.link || r.dataset.qrOpen || r.dataset.pv; const on = state.sel.has(id); r.classList.toggle('sel', on); const cb = $('.cb[data-sel]', r); if (!cb) return; cb.classList.toggle('on', on); cb.setAttribute('aria-checked', on); });
    const ids = selectableIds(), all = ids.length > 0 && ids.every(i => state.sel.has(i)); const sa = $('#sel-all'); if (sa) { sa.classList.toggle('on', all); sa.setAttribute('aria-checked', all); }
    const old = $('.selbar'), html = bulkBarHTML(), card = $('#links-table, #list-table');
    if (old && !html) old.remove(); else if (old) old.outerHTML = html; else if (html && card) card.insertAdjacentHTML('afterbegin', html);
  }

  // Map hover tooltip
  $('#view').addEventListener('mouseover', e => { if (!$('#pb')) return; const v = e.target.closest('.pb-v'); const next = v ? { key: v.dataset.bk, v: v.dataset.bv } : null;
    if ((next && next.key + next.v) === (pbHover && pbHover.key + pbHover.v)) return; pbHover = next; pbApply(); });
  $('#view').addEventListener('submit', e => { const f = e.target.closest('[data-badd-form]'); if (!f) return; e.preventDefault(); const p = paramOf(f.dataset.baddForm); const inp = $('input', f); const raws = inp.value.split(/[\n,]+/).map(x => x.trim()).filter(Boolean); if (!raws.length) return;
    const added = addValues(p, raws); if (added.length) toast(`Added ${added.length === 1 ? `“${added[0]}”` : added.length + ' values'} to ${p.label.toLowerCase()}`); else toast(validateValue(p, raws[0]).msg || 'Nothing to add'); pbRefresh(p.key); });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape' || !$('#pb') || $('.scrim') || pop) return; if (state.padd) { state.padd = null; pbRefresh(); } else if (state.psel) { state.psel = null; $('#pb-bar').outerHTML = pbBarHTML(); pbApply(); } });
  $('#view').addEventListener('mousemove', e => {
    const p = e.target.closest && e.target.closest('[data-country]'); const map = $('#map'); if (!map) return; const tip = $('#map-tip');
    if (!p) { tip.classList.remove('show'); return; }
    const c = D.COUNTRIES[p.dataset.country]; const r = map.getBoundingClientRect();
    const cities = +p.dataset.val ? (Q.cities || (Q.cities = Q.cur.breakdown('city'))).filter(x => x.code === p.dataset.country && !x.label.startsWith('Other')).slice(0, 3) : [];
    tip.innerHTML = `<div><b>${c.flag} ${esc(c.name)}</b></div><div class="row-t"><span class="m">Clicks</span><b class="num">${fmt.full(+p.dataset.val)}</b></div><div class="row-t"><span class="m">Share</span><span class="num">${fmt.pct(+p.dataset.share)}</span></div>${cities.length ? `<div class="tip-sub">Top cities</div>${cities.map(x => `<div class="row-t"><span>${esc(x.label)}</span><span class="num">${fmt.full(Math.round(x.value))}</span></div>`).join('')}` : ''}`;
    tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top - 4) + 'px'; tip.classList.add('show');
  });

  /* ---------- Shell ---------- */
  const NAV = [['links', 'Links'], ['qr', 'QR codes'], ['analytics', 'Analytics'], ['templates', 'Templates'], ['parameters', 'Parameters'], ['attributes', 'Attributes'], ['shorteners', 'Link shorteners'], ['rules', 'Rules'], ['members', 'Workspace members'], ['support', 'Support']];
  $('#nav').innerHTML = NAV.map(([k, l]) => `<a href="#" data-nav="${k}" class="${k === 'analytics' ? 'active' : ''}" title="${l}">${I[k]}<span class="nav-label">${l}</span></a>`).join('');
  $('#nav').addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); const k = a.dataset.nav; if (k === 'analytics') goOverview(); else if (k === 'links') goLinks(); else if (LIST_VIEWS.includes(k)) goPage(k); else toast(`${a.title} is outside this prototype`); });
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
  $('#ext-btn').addEventListener('click', () => openBuilder({ mode: 'ext' }));
  $('#plan-btn').addEventListener('click', () => toast('Plan management is outside this prototype'));

  /* ---------- vReskin hooks ---------- */
  window.APP = { state, render, compute, goOverview, goLink, openModal, closeModal, openPop, closePop, toast, copyText, I, esc, fmt, avatar, initials, templateOf, utmQuery, TEMPLATE_LIST, PARAMS, SHORTENERS, QR_DESIGNS, QR_DESIGN_OF, LIST_VIEWS, ALL_RANGE, qrModal, tipsModal, get Q() { return Q; } };

  /* ---------- Boot ---------- */
  (function boot() {
    const h = (location.hash || '').replace('#', '');
    if (LIST_VIEWS.includes(h)) { state.view = h; if (h !== 'links') state.lsort = h === 'qr' ? { key: 'clicks', dir: -1 } : h === 'templates' ? { key: 'uses', dir: -1 } : { key: 'links', dir: -1 }; }
    if (h.startsWith('parameters-')) { const p = PARAMS.find(x => x.key === h.slice(11)); if (p) { state.view = 'parameters'; state.param = p.key; state.lsort = { key: 'links', dir: -1 }; } }
    if (h.startsWith('link-')) { const slug = D.LINKS.find(l => l.slug.replace(/[^a-z0-9]+/gi, '-') === h.slice(5)); if (slug) { state.view = 'link'; state.slug = slug.slug; } }
    if (h === 'create-link') state.view = 'links';
    render();
    if (h === 'create-link') openBuilder();
  })();
})();
