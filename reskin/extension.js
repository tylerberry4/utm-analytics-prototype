/* UTM.io vReskin · Chrome extension popup (concept, 2026-11-10)
   Opens from the top bar's "Download Chrome Extension" button and behaves like a real
   extension popup: fixed size, closes when you click outside it or press Esc, and keeps its
   draft / tab / search for the next time it opens.
   Tabs: Create (the vReskin builder, every field shown, form scrolls, footer sticky) and
   Links (the current workspace's links). A link opens a mini analytics view inside the popup.
   Research: Research/Chrome Extension (2026-11-10)/ */
(function () {
  'use strict';
  const A = window.APP, D = window.DATA, RS = window.RESKIN, E = RS && RS.ext;
  if (!A || !E) return;
  const { I, esc, fmt, toast, copyText, openPop, closePop } = A;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  const TAB_URL = 'acme.com/sale'; // the page the user is "on" while the popup is open
  const X = {
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/></svg>',
    dup: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/><path d="M14 11v6M11 14h6"/></svg>',
    page: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/></svg>',
  };

  /* ---------- State (kept between opens, like an extension's saved draft) ---------- */
  const X0 = () => ({ url: TAB_URL, editUrl: false, template: '', vals: {}, attrs: {}, notes: '', qr: false, shortener: (A.SHORTENERS.find(s => s.default) || A.SHORTENERS[0]).domain });
  const st = { tried: false, open: false, tab: 'create', q: '', here: false, detail: null, range: 30, draft: X0(), created: null, used: 1, seen: null };
  const lbParams = () => A.PARAMS.filter(p => p.shown !== false);
  const pvals = p => p.values.map(v => v.v !== undefined ? v.v : v[0]);
  const ic = (svg, cls = 'caret') => svg.replace('<svg', `<svg class="${cls}"`);
  const slugify = v => String(v).toLowerCase().trim().replace(/\s+/g, '-');

  /* ---------- Numbers for one link (straight from the link's daily history) ---------- */
  const daily = (l, n) => l.series.slice(Math.max(0, D.DAYS - n));
  const sumN = (l, n) => daily(l, n).reduce((a, x) => a + x, 0);
  const clicks30 = l => Math.round(sumN(l, 30));
  const sparkPts = (vals, w, h) => { const max = Math.max(1, ...vals); return vals.map((v, i) => `${(i / Math.max(1, vals.length - 1) * w).toFixed(1)},${(h - 1 - v / max * (h - 3)).toFixed(1)}`).join(' '); };
  const wsLinks = () => D.LINKS;

  /* ---------- Toolbar button + badge ---------- */
  const old = $('#ext-btn'); const btn = old.cloneNode(true); old.replaceWith(btn); // drop reskin.js's "open the store" click
  btn.title = 'Open the UTM.io Chrome extension (concept)';
  const badgeCount = () => { const d = wsLinks().reduce((a, l) => a + (l.series[D.DAYS - 1] || 0), 0); return Math.round(d * .35); };
  btn.insertAdjacentHTML('beforeend', `<span class="xp-badge" id="xp-badge">+${badgeCount()}</span>`);

  const pop = document.createElement('div');
  pop.className = 'xp'; pop.id = 'xp'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'UTM.io Chrome extension');
  document.body.appendChild(pop);

  function place() {
    const r = btn.getBoundingClientRect(), w = Math.min(400, window.innerWidth - 16);
    pop.style.width = w + 'px';
    pop.style.top = Math.round(r.bottom + 8) + 'px';
    pop.style.left = Math.round(Math.max(8, Math.min(r.left, window.innerWidth - w - 8))) + 'px';
    pop.style.height = Math.min(600, window.innerHeight - r.bottom - 16) + 'px';
  }
  function open() {
    st.open = true; pop.hidden = false; place(); paint(); btn.classList.add('on');
    const b = $('#xp-badge'); if (b) b.remove(); // opening clears "new clicks since you last looked"
    requestAnimationFrame(() => pop.classList.add('in'));
  }
  function close() { if (!st.open) return; closePop(); st.open = false; pop.classList.remove('in'); pop.hidden = true; btn.classList.remove('on'); }
  btn.addEventListener('click', e => { e.stopPropagation(); st.open ? close() : open(); });
  // Like a real popup: any click outside closes it. Popovers and modals opened from it don't count.
  document.addEventListener('mousedown', e => { if (!st.open) return; if (pop.contains(e.target) || btn.contains(e.target) || e.target.closest('.popover, .scrim, .toast')) return; close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && st.open && !$('.popover') && !$('.scrim')) close(); });
  window.addEventListener('resize', () => { if (st.open) place(); });

  /* ---------- Shell of the popup ---------- */
  function paint(keepScroll) {
    const body0 = $('.xp-body', pop), y = keepScroll && body0 ? body0.scrollTop : 0;
    const view = st.created ? 'created' : st.detail ? 'detail' : st.tab;
    pop.innerHTML = `
      <div class="xp-hd">
        <img class="xp-logo" src="assets/logo.png" alt="UTM.io">
        <button type="button" class="xp-crumb" id="xp-ws" title="Switch account or workspace"><span class="acc">My Team</span><span class="sep">/</span><span class="ws">${esc(E.WS)}</span>${ic(I.chev)}</button>
        <button type="button" class="xp-ic" id="xp-help" title="Support" aria-label="Support">${X.help}</button>
        <button type="button" class="xp-ic" id="xp-set" title="Settings" aria-label="Settings">${X.gear}</button>
      </div>
      ${view === 'detail' ? '' : `<div class="xp-tabs" role="tablist">
        <button type="button" role="tab" data-tab="create" class="${st.tab === 'create' ? 'on' : ''}">Create</button>
        <button type="button" role="tab" data-tab="links" class="${st.tab === 'links' ? 'on' : ''}">Links</button>
        <span class="xp-use" title="Links created this month on your plan"><i><b style="width:${Math.min(100, st.used / 25 * 100)}%"></b></i>${st.used} of 25 this month</span>
      </div>`}
      <div class="xp-body">${view === 'create' ? createHTML() : view === 'links' ? linksHTML() : view === 'detail' ? detailHTML() : createdHTML()}</div>
      ${view === 'create' ? footHTML() : ''}`;
    const body = $('.xp-body', pop); if (y) body.scrollTop = y;
    const shade = () => pop.classList.toggle('scrolled', body.scrollTop + body.clientHeight < body.scrollHeight - 2);
    body.addEventListener('scroll', shade); shade();
    if (view === 'create') paintQR();
    if (view === 'detail') drawChart();
  }

  /* ---------- Create (the vReskin builder) ---------- */
  const selInput = (key, val, ph, extra = '') => `<button type="button" class="inp sel ${val ? 'has-val' : ''}" data-pick="${esc(key)}"><span class="grow ${val ? '' : 'ph'}">${esc(val || ph)}</span>${extra}${ic(I.chev)}</button>`;
  const row = (label, bodyH, hint, req) => `<div class="xp-r"><label>${req ? '<span class="req">*</span>' : ''}${label}</label>${bodyH}${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
  function createHTML() {
    const d = st.draft;
    let h = '';
    h += row('URL', d.editUrl
      ? `<label class="inp"><input data-f="url" value="${esc(d.url)}" placeholder="https://"></label>`
      : `<div class="xp-url"><span class="grow" title="${esc(d.url)}">${esc(d.url)}</span><button type="button" class="btn lnk" data-act="change-url">Change</button></div>`,
      d.editUrl ? '' : 'From your current tab', true);
    h += row('Template', `<button type="button" class="inp sel" data-pick="template">${d.template ? `<span class="chip">${esc(d.template)}</span><span class="grow"></span><span class="clear" data-clear="template">CLEAR</span>` : '<span class="grow ph">Select multiple to bulk create links</span>'}${ic(I.chev)}</button>`);
    const prev = k => d.vals[k] ? `<div class="hint">Preview: <b>${esc(slugify(d.vals[k]))}</b></div>` : '';
    const utm = lbParams().filter(p => !p.custom), cus = lbParams().filter(p => p.custom);
    h += `<div class="xp-sec">UTM parameters</div>`;
    utm.forEach(p => { h += `<div class="xp-r"><label>${['campaign', 'medium', 'source'].includes(p.key) ? '<span class="req">*</span>' : ''}${esc(p.key === 'campaign' ? 'campaign' : p.label.toLowerCase())}</label>${selInput(p.key, d.vals[p.key], p.key === 'term' ? 'Paid keyword, e.g. {keyword}' : p.key === 'content' ? 'Which ad or spot on the page' : 'Select or type', `<span class="cnt">${pvals(p).length}</span>`)}${prev(p.key)}</div>`; });
    h += `<div class="xp-sec">Custom parameters</div>`;
    cus.forEach(p => { h += row(esc(p.utm), p.format === 'number' ? `<label class="inp"><input data-f="v:${p.key}" type="number" placeholder="Enter a number" value="${esc(d.vals[p.key] || '')}"></label>` : selInput(p.key, d.vals[p.key], 'Select or type', `<span class="cnt">${pvals(p).length}</span>`)); });
    h += `<div class="xp-r"><span></span><button type="button" class="btn lnk xp-add" data-toast="Adding a custom parameter opens UTM.io (outside this concept)">+ Add custom URL parameter</button></div>`;
    h += `<div class="xp-sec">Attributes <span class="xp-sec-note">not added to the URL</span></div>`;
    E.ATTRS.forEach(a => { h += row(esc(a.label), a.type === 'date' ? `<label class="inp"><input data-f="a:${a.key}" type="date" value="${esc(d.attrs[a.key] || '')}"></label>` : a.type === 'number' ? `<label class="inp"><input data-f="a:${a.key}" type="number" placeholder="Enter a number" value="${esc(d.attrs[a.key] || '')}"></label>` : selInput('a:' + a.key, d.attrs[a.key], 'Select or type')); });
    h += row('notes', `<label class="inp"><input data-f="notes" placeholder="Saved in UTM.io, not on the link" value="${esc(d.notes)}"></label>`);
    return `<form class="xp-form" autocomplete="off" onsubmit="return false">${h}</form>`;
  }
  function previewURL() {
    const d = st.draft; if (!d.url.trim()) return '';
    const base = /^https?:\/\//i.test(d.url) ? d.url : 'https://' + d.url;
    const q = lbParams().filter(p => d.vals[p.key]).map(p => `${p.utm}=${encodeURIComponent(slugify(d.vals[p.key]))}`).join('&');
    return q ? base + (base.includes('?') ? '&' : '?') + q : base;
  }
  const missing = () => ['campaign', 'medium', 'source'].filter(k => !st.draft.vals[k]);
  function footHTML() {
    const d = st.draft, u = previewURL(), i = u.indexOf('?');
    const m = missing();
    return `<div class="xp-foot">
      <div class="xp-prev" id="xp-prev" title="${esc(u)}">${X.link}<span>${u ? `${esc(i > -1 ? u.slice(0, i) : u)}<em>${esc(i > -1 ? u.slice(i) : '')}</em>` : '<span class="ph">https://</span>'}</span></div>
      <div class="xp-acts">
        <button type="button" class="xp-qr ${d.qr ? 'on' : ''}" data-act="qr" title="${d.qr ? 'QR code on' : 'Add a QR code'}" aria-pressed="${d.qr}"><canvas id="xp-qrc" width="33" height="33"></canvas><span>QR</span></button>
        <button type="button" class="inp sel xp-short" data-pick="shortener" title="Short link domain"><span class="grow">${d.shortener === 'none' ? "Don't shorten" : esc(d.shortener)}</span>${ic(I.chev)}</button>
        <button type="button" class="btn primary lg" id="xp-save" title="${m.length ? 'Missing: ' + m.join(', ') : 'Copy & Save (Enter)'}">${I.copy}Copy &amp; Save</button>
      </div>
      <div class="xp-req" id="xp-req" ${m.length && st.tried ? '' : 'hidden'}>${m.length ? `Still needed: ${m.join(', ')}` : ''}</div>
    </div>`;
  }
  function paintQR() {
    const c = $('#xp-qrc', pop); if (!c) return; const ctx = c.getContext('2d'), img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, 33, 33); ctx.drawImage(img, 0, 0); }; img.src = E.qrURL(previewURL() || 'empty');
  }
  function refreshFoot() { const f = $('.xp-foot', pop); if (!f) return; f.outerHTML = footHTML(); paintQR(); }
  function applyTemplate(t) { const d = st.draft; d.template = t.name; ['campaign', 'medium', 'source', 'content', 'term'].forEach(k => { const v = t[k]; if (v && !/^\{\{/.test(v)) d.vals[k] = v; }); if (t.shortener) d.shortener = t.shortener; }
  function pick(anchor, key) {
    const d = st.draft; let opts, set;
    if (key === 'template') { opts = A.TEMPLATE_LIST.map(t => t.name); set = v => applyTemplate(A.TEMPLATE_LIST.find(t => t.name === v)); }
    else if (key === 'shortener') { opts = ["Don't shorten", ...A.SHORTENERS.filter(s => s.status !== 'pending').map(s => s.domain)]; set = v => { d.shortener = v === "Don't shorten" ? 'none' : v; }; }
    else if (key.startsWith('a:')) { const a = E.ATTRS.find(x => x.key === key.slice(2)); opts = (a.values || []).concat(E.extraVals(key)); set = v => { d.attrs[a.key] = v; }; }
    else { const p = A.PARAMS.find(x => x.key === key); opts = pvals(p).concat(E.extraVals(key)); set = v => { d.vals[key] = v; }; }
    const typed = !['template', 'shortener'].includes(key);
    const list = q => { const ql = q.trim().toLowerCase(); const vs = opts.filter(v => !ql || v.toLowerCase().includes(ql)); return vs.map(v => `<button type="button" class="mi" data-v="${esc(v)}"><span class="grow">${esc(v)}</span></button>`).join('') + (typed && ql && !opts.some(v => v.toLowerCase() === ql) ? `<button type="button" class="mi add" data-v="${esc(q.trim())}"><span class="grow">Use “${esc(q.trim())}”</span></button>` : '') || '<div class="group" style="padding:12px 10px">No matches</div>'; };
    openPop(anchor, `${typed ? `<div class="search">${I.search}<input id="xp-pq" placeholder="Select or type…" aria-label="Search values"></div>` : ''}<div class="menu rk-opts" id="xp-pl" style="width:${Math.max(220, anchor.offsetWidth)}px;max-height:260px;overflow:auto">${list('')}</div>`, { onMount(el) {
      el.classList.add('xp-pop');
      const l = $('#xp-pl', el), q = $('#xp-pq', el);
      if (q) { q.addEventListener('input', () => { l.innerHTML = list(q.value); }); q.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const b = $('.mi', l); if (b) b.click(); } }); }
      l.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; set(b.dataset.v); closePop(); paint(true); });
    } });
  }
  function save() {
    const d = st.draft;
    if (!d.url.trim()) { toast('Add a URL first'); return; }
    st.tried = true; const m = missing(); if (m.length) { const r = $('#xp-req', pop); if (r) { r.hidden = false; r.classList.remove('shake'); void r.offsetWidth; r.classList.add('shake'); } const f = $(`[data-pick="${m[0]}"]`, pop); if (f) { f.scrollIntoView({ block: 'center', behavior: 'smooth' }); f.classList.add('xp-need'); setTimeout(() => f.classList.remove('xp-need'), 1400); } return; }
    if (d.qr && d.shortener === 'none') { toast('A QR code needs a short link. Pick a domain first.'); return; }
    const full = previewURL();
    const slug = (d.shortener === 'none' ? 'utm.io' : d.shortener) + '/' + Math.random().toString(36).slice(2, 7);
    const l = { slug, dest: d.url.replace(/^https?:\/\//, ''), title: [d.vals.campaign, d.vals.source].filter(Boolean).join(' · ') || 'New link', campaign: d.vals.campaign || '', source: d.vals.source || '', medium: d.vals.medium || '', content: d.vals.content || '', term: d.vals.term || '', created: D.TODAY.toISOString().slice(0, 10), by: 'Tyler Berry', tags: [], qr: d.qr ? 1 : 0, base: 0, shape: 'steady', uniq: .7, geo: {}, dev: {}, ref: {}, series: new Array(D.DAYS).fill(0), id: D.LINKS.length, fresh: true };
    D.LINKS.unshift(l);
    copyText(d.shortener === 'none' ? full : 'https://' + slug, 'Link created and copied');
    st.used++; st.tried = false; st.created = { slug, full, qr: d.qr, short: d.shortener !== 'none' };
    if (E.ownsView()) RS.render();
    paint();
  }
  function createdHTML() {
    const c = st.created;
    return `<div class="xp-done">
      <div class="xp-done-ic">${X.ok}</div>
      <h3>Link created and copied</h3>
      <p class="sub">Saved to ${esc(E.WS)}. It's in your Links tab and in UTM.io.</p>
      <div class="xp-done-card">
        ${c.qr ? `<canvas id="xp-doneqr" width="33" height="33" aria-label="QR code"></canvas>` : ''}
        <div class="grow">
          ${c.short ? `<div class="xp-done-row"><span class="mono strong">${esc(c.slug)}</span><button type="button" class="icon-btn" data-copy="https://${esc(c.slug)}" title="Copy short link">${I.copy}</button></div>` : ''}
          <div class="xp-done-row"><span class="mono faint" title="${esc(c.full)}">${esc(c.full)}</span><button type="button" class="icon-btn" data-copy="${esc(c.full)}" title="Copy full URL">${I.copy}</button></div>
          ${c.qr ? `<div class="xp-done-row"><button type="button" class="btn lnk" data-toast="Downloads QR PNG (outside this concept)">${I.download}PNG</button><button type="button" class="btn lnk" data-toast="Downloads QR SVG (outside this concept)">${I.download}SVG</button></div>` : ''}
        </div>
      </div>
      <div class="xp-done-acts">
        <button type="button" class="btn lg" data-act="see-links">See in Links</button>
        <button type="button" class="btn primary lg" data-act="another">Create another</button>
      </div>
      <button type="button" class="btn lnk" data-act="same-again">Keep these values for the next link</button>
    </div>`;
  }

  /* ---------- Links (the current workspace) ---------- */
  function linkRows() {
    const q = st.q.trim().toLowerCase();
    return wsLinks().filter(l => !q || [l.title, l.slug, l.dest, l.campaign, l.source, l.medium, l.content, l.by].join(' ').toLowerCase().includes(q));
  }
  function linksHTML() {
    const rows = linkRows(), q = st.q.trim();
    const here = rows.filter(l => l.dest === TAB_URL), rest = rows.filter(l => l.dest !== TAB_URL);
    const hereClicks = here.reduce((a, l) => a + clicks30(l), 0);
    const rowH = l => { const v = daily(l, 30), c = clicks30(l); return `<div class="xp-row ${l.fresh ? 'fresh' : ''}" data-open="${esc(l.slug)}" tabindex="0">
        <div class="xp-row-t"><b title="${esc(l.title)}">${esc(l.title)}</b><span class="mono">${esc(l.slug)}</span><span class="xp-by">${A.avatar(l.by, 'xs')}${esc(l.by.split(' ')[0])} · ${fmt.d ? fmt.d(new Date(l.created + 'T00:00:00')) : esc(l.created)}</span></div>
        <svg class="xp-spark" viewBox="0 0 56 20" aria-hidden="true"><polyline points="${sparkPts(v, 56, 20)}"/></svg>
        <div class="xp-n"><b>${fmt.n(c)}</b><span>30 days</span></div>
        <div class="xp-row-a"><button type="button" class="icon-btn" data-copy="https://${esc(l.slug)}" title="Copy short link">${I.copy}</button><button type="button" class="icon-btn" data-more="${esc(l.slug)}" title="More">${I.more}</button></div>
      </div>`; };
    const MAX = 3, shown = st.here ? here : here.slice(0, MAX);
    const hereBlock = here.length ? `<section class="xp-onpage" aria-label="Links to the page you're on">
        <div class="xp-onpage-hd">${X.page}<b>On this page</b><span class="mono" title="${esc(TAB_URL)}">${esc(TAB_URL)}</span><span class="xp-onpage-n">${here.length} · ${fmt.n(hereClicks)} clicks</span></div>
        <div class="xp-list">${shown.map(rowH).join('')}</div>
        ${here.length > MAX ? `<button type="button" class="xp-onpage-more" data-act="here">${st.here ? 'Show fewer' : `Show all ${here.length}`}</button>` : ''}
      </section>`
      : (!q ? `<div class="xp-onpage-empty">${X.page}<span class="grow">No links to <span class="mono">${esc(TAB_URL)}</span> yet</span><button type="button" class="btn lnk" data-tab="create">Create one</button></div>` : '');
    return `<div class="xp-links">
      <div class="rk-search xp-search">${I.search}<input id="xp-q" placeholder="Search ${esc(E.WS)} links, campaigns, people…" value="${esc(st.q)}" aria-label="Search links"></div>
      <div class="xp-results">${hereBlock}
      ${rest.length ? `<div class="xp-count">${here.length ? 'Everything else' : 'All links'} in ${esc(E.WS)} · ${rest.length}</div><div class="xp-list">${rest.map(rowH).join('')}</div>`
        : (!here.length ? `<div class="rk-empty" style="padding:28px 8px">No links match “${esc(q)}”.</div>` : '')}</div>
    </div>`;
  }
  function moreMenu(anchor, slug) {
    const l = D.LINKS.find(x => x.slug === slug);
    openPop(anchor, `<div class="menu" style="width:220px"><div class="group" style="text-transform:none;letter-spacing:0;font-family:var(--font-mono)">${esc(slug)}</div>
      <button type="button" class="mi" data-m="dup">${X.dup}<span class="grow">Duplicate</span></button>
      <button type="button" class="mi" data-m="full">${I.copy}<span class="grow">Copy full URL</span></button>
      <button type="button" class="mi" data-m="stats">${I.analytics}<span class="grow">Clicks &amp; details</span></button>
      <button type="button" class="mi" data-m="report">${I.external}<span class="grow">Open full report</span></button></div>`, { align: 'right', onMount(el) {
      el.classList.add('xp-pop');
      el.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (!b) return; closePop(); const m = b.dataset.m;
        if (m === 'dup') duplicate(l); else if (m === 'full') copyText('https://' + l.dest + A.utmQuery(l), 'Full URL copied'); else if (m === 'stats') { st.detail = slug; paint(); } else report(slug); });
    } });
  }
  function duplicate(l) {
    const d = X0(); d.url = l.dest; d.editUrl = false;
    ['campaign', 'medium', 'source', 'content', 'term'].forEach(k => { if (l[k]) d.vals[k] = l[k]; });
    d.qr = l.qr >= .5; d.template = A.templateOf ? (A.templateOf(l) || '') : '';
    st.draft = d; st.detail = null; st.created = null; st.tab = 'create'; paint();
    toast('Duplicated: change what you need, then Copy & Save');
  }
  function report(slug) { close(); A.goLink(slug); }

  /* ---------- Link detail (mini analytics) ---------- */
  function detailHTML() {
    const l = D.LINKS.find(x => x.slug === st.detail); if (!l) { st.detail = null; return linksHTML(); }
    const n = st.range, tot = sumN(l, n), prev = l.series.slice(Math.max(0, D.DAYS - 2 * n), D.DAYS - n).reduce((a, x) => a + x, 0);
    const delta = prev ? (tot - prev) / prev : 0, qr = tot * l.qr;
    const top = (obj, label) => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `<div class="xp-bar"><span class="grow">${label(k)}</span><b>${Math.round(v * 100)}%</b><i style="width:${Math.round(v * 100)}%"></i></div>`).join('') || '<div class="faint">No data yet</div>';
    const cname = k => { const c = D.COUNTRIES[k]; return c ? `${c.flag} ${esc(c.name)}` : esc(k); };
    const tags = ['campaign', 'medium', 'source', 'content', 'term'].filter(k => l[k]).map(k => `<span class="xp-tag"><span>${k}</span>${esc(l[k])}</span>`).join('');
    return `<div class="xp-det">
      <div class="xp-det-hd"><button type="button" class="xp-back" data-act="back" aria-label="Back to links">${I.arrowL}</button><div class="grow"><b title="${esc(l.title)}">${esc(l.title)}</b><span class="mono">${esc(l.slug)}</span></div><button type="button" class="icon-btn" data-copy="https://${esc(l.slug)}" title="Copy short link">${I.copy}</button></div>
      <div class="seg rk xp-range">${[7, 30, 90].map(r => `<button type="button" data-range="${r}" class="${n === r ? 'on' : ''}">${r} days</button>`).join('')}</div>
      <div class="xp-kpis">
        <div><span>Clicks</span><b>${fmt.n(tot)}</b><em class="${delta > .005 ? 'up' : delta < -.005 ? 'down' : ''}">${prev ? (delta > 0 ? '▲ ' : delta < 0 ? '▼ ' : '') + Math.abs(Math.round(delta * 100)) + '%' : '–'}</em></div>
        <div><span>Link clicks</span><b>${fmt.n(tot - qr)}</b></div>
        <div><span>QR scans</span><b>${fmt.n(qr)}</b></div>
      </div>
      <div class="xp-chart" id="xp-chart"></div>
      <div class="xp-two"><div><h4>Top countries</h4>${top(l.geo, cname)}</div><div><h4>Top referrers</h4>${top(l.ref, esc)}</div></div>
      ${tags ? `<div class="xp-tags">${tags}</div>` : ''}
      <div class="xp-det-acts"><button type="button" class="btn primary" data-act="dup">${X.dup}Duplicate</button><button type="button" class="btn" data-copy="https://${esc(l.dest)}${esc(A.utmQuery(l))}">${I.copy}Full URL</button><button type="button" class="btn lnk" data-act="report">Full report ${I.external}</button></div>
    </div>`;
  }
  function drawChart() {
    const el = $('#xp-chart', pop); if (!el) return; const l = D.LINKS.find(x => x.slug === st.detail); if (!l) return;
    const v = daily(l, st.range), w = el.clientWidth || 340, h = 96, max = Math.max(1, ...v);
    const pts = v.map((x, i) => [i / Math.max(1, v.length - 1) * w, h - 16 - x / max * (h - 26)]);
    const line = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
    const d0 = new Date(D.TODAY); d0.setDate(d0.getDate() - (st.range - 1));
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" aria-label="Clicks per day"><defs><linearGradient id="xpg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      <line x1="0" x2="${w}" y1="${h - 16}" y2="${h - 16}" class="xp-axis"/><polygon points="0,${h - 16} ${line} ${w},${h - 16}" fill="url(#xpg)"/><polyline points="${line}" class="xp-line"/>
      <text x="0" y="${h - 2}" class="xp-tick">${esc(fmt.d ? fmt.d(d0) : '')}</text><text x="${w}" y="${h - 2}" text-anchor="end" class="xp-tick">Today</text><text x="0" y="10" class="xp-tick">${fmt.n(max)}/day</text></svg>`;
  }

  /* ---------- Events inside the popup ---------- */
  pop.addEventListener('click', e => {
    const t = e.target;
    const tab = t.closest('[data-tab]'); if (tab) { st.tab = tab.dataset.tab; st.detail = null; st.created = null; paint(); if (st.tab === 'links') { const q = $('#xp-q', pop); if (q) q.focus(); } return; }
    if (t.closest('#xp-ws')) { wsMenu(t.closest('#xp-ws')); return; }
    if (t.closest('#xp-help')) { window.open('https://help.utm.io/', '_blank', 'noopener'); return; }
    if (t.closest('#xp-set')) { setMenu(t.closest('#xp-set')); return; }
    const cl = t.closest('[data-clear]'); if (cl) { e.stopPropagation(); st.draft.template = ''; paint(true); return; }
    const pk = t.closest('[data-pick]'); if (pk) { pick(pk, pk.dataset.pick); return; }
    const cp = t.closest('[data-copy]'); if (cp) { e.stopPropagation(); copyText(cp.dataset.copy, 'Copied'); return; }
    const mo = t.closest('[data-more]'); if (mo) { e.stopPropagation(); moreMenu(mo, mo.dataset.more); return; }
    const ts = t.closest('[data-toast]'); if (ts) { toast(ts.dataset.toast); return; }
    const rg = t.closest('[data-range]'); if (rg) { st.range = +rg.dataset.range; paint(true); return; }
    const a = t.closest('[data-act]');
    if (a) {
      const act = a.dataset.act, d = st.draft;
      if (act === 'change-url') { d.editUrl = true; paint(true); const i = $('[data-f="url"]', pop); if (i) { i.focus(); i.select(); } }
      else if (act === 'qr') { d.qr = !d.qr; if (d.qr && d.shortener === 'none') d.shortener = (A.SHORTENERS.find(s => s.default) || A.SHORTENERS[0]).domain; refreshFoot(); }
      else if (act === 'here') { st.here = !st.here; paint(); }
      else if (act === 'back') { st.detail = null; paint(); }
      else if (act === 'dup') duplicate(D.LINKS.find(x => x.slug === st.detail));
      else if (act === 'report') report(st.detail);
      else if (act === 'see-links') { st.created = null; st.tab = 'links'; st.q = ''; paint(); }
      else if (act === 'another') { st.created = null; st.draft = X0(); paint(); }
      else if (act === 'same-again') { st.created = null; paint(); }
      return;
    }
    const op = t.closest('[data-open]'); if (op) { st.detail = op.dataset.open; paint(); }
  });
  pop.addEventListener('keydown', e => {
    const op = e.target.closest && e.target.closest('[data-open]');
    if (op && e.key === 'Enter') { st.detail = op.dataset.open; paint(); return; }
    if (e.key === 'Enter' && st.tab === 'create' && !st.detail && !st.created && e.target.matches('input') && !$('.popover')) { e.preventDefault(); save(); }
  });
  pop.addEventListener('input', e => {
    const f = e.target.dataset.f, d = st.draft;
    if (e.target.id === 'xp-q') { st.q = e.target.value; const tmp = document.createElement('div'); tmp.innerHTML = linksHTML(); $('.xp-results', pop).replaceWith($('.xp-results', tmp)); return; }
    if (!f) return;
    if (f === 'url') d.url = e.target.value; else if (f === 'notes') d.notes = e.target.value; else if (f.startsWith('a:')) d.attrs[f.slice(2)] = e.target.value; else if (f.startsWith('v:')) d.vals[f.slice(2)] = e.target.value;
    refreshFoot();
  });
  pop.addEventListener('focusout', e => { if (e.target.dataset.f === 'url' && st.draft.url.trim()) { st.draft.editUrl = false; setTimeout(() => { if (st.open && !pop.contains(document.activeElement)) paint(true); else if (st.open) { const y = $('.xp-body', pop).scrollTop; paint(); $('.xp-body', pop).scrollTop = y; } }, 0); } });
  pop.addEventListener('click', e => { if (e.target.closest('#xp-save')) save(); });

  function wsMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:240px"><div class="group">Account</div><button type="button" class="mi on" data-w="acct"><span class="grow">My Team</span><span class="check">${I.check}</span></button><button type="button" class="mi" data-w="acct-other"><span class="grow">Switch account…</span></button><div class="sep"></div><div class="group">Workspace</div>${E.WORKSPACES.filter(w => w.status === 'Active').map(w => `<button type="button" class="mi ${w.name === E.WS ? 'on' : ''}" data-w="${esc(w.name)}"><span class="grow">${esc(w.name)}</span>${w.name === E.WS ? `<span class="check">${I.check}</span>` : ''}</button>`).join('')}</div>`, { onMount(el) {
      el.classList.add('xp-pop');
      el.addEventListener('click', e => { const b = e.target.closest('[data-w]'); if (!b) return; closePop(); const w = b.dataset.w; if (w !== 'acct' && w !== E.WS) toast(w === 'acct-other' ? 'Switching accounts is outside this prototype' : `Switching to ${w} is outside this prototype`); });
    } });
  }
  function setMenu(anchor) {
    openPop(anchor, `<div class="menu" style="width:240px"><button type="button" class="mi" data-s="app">${I.external}<span class="grow">Open UTM.io</span></button><button type="button" class="mi" data-s="key"><span class="grow">Keyboard shortcut</span><span class="faint" style="font-size:12px">⌥⇧U</span></button><button type="button" class="mi" data-s="badge"><span class="grow">Badge: new clicks</span><span class="check">${I.check}</span></button><div class="sep"></div><button type="button" class="mi" data-s="out"><span class="grow">Sign out</span></button></div>`, { align: 'right', onMount(el) {
      el.classList.add('xp-pop');
      el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; closePop(); const s = b.dataset.s;
        if (s === 'app') close(); else toast(s === 'key' ? 'Shortcuts are set in chrome://extensions/shortcuts' : s === 'badge' ? 'The toolbar badge shows new clicks since you last opened the extension' : 'Signed out (not really)'); });
    } });
  }
})();
