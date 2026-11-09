/* ==================================================================
   UTM prototype vReskin — the pages that keep today's UX
   Rule for this file: same screens, same placement, same forms as
   app.utm.io (staging, 2026-11-05). Only the skin changes. Analytics
   and the per-link report come from app.js (the v4 engine) untouched.
   Example data only; nothing here comes from a real account.
================================================================== */
(function () {
  'use strict';
  const A = window.APP, D = window.DATA, S = A.state;
  const { I, esc, fmt, toast, copyText, openPop, closePop, openModal, closeModal } = A;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const WS = 'Acme Marketing';

  /* ---------- Icons this file adds ---------- */
  const X = {
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>',
    api: '<svg viewBox="0 0 24 24"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>',
    people: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="10" height="17" rx="1"/><path d="M6 8h1M9 8h1M6 12h1M9 12h1M6 16h1M9 16h1"/><circle cx="17" cy="9" r="2.5"/><path d="M13 21v-3a4 4 0 0 1 8 0v3"/></svg>',
  };

  /* ---------- Example data for pages app.js doesn't have ---------- */
  const WORKSPACES = [
    { name: 'Acme Marketing', slug: 'acme-marketing', by: 'Dana Whitfield', created: '2026-04-13', status: 'Active', short: ['acme.co', '+3'] },
    { name: 'Acme EMEA', slug: 'acme-emea', by: 'Dana Whitfield', created: '2026-05-02', status: 'Active', short: ['acme.co', '+2'] },
    { name: 'Coffey & Sons', slug: 'coffey-and-sons', by: 'Marcus Lee', created: '2026-06-18', status: 'Active', short: ['utm.io', '+1'] },
    { name: 'Partner program', slug: 'partner-program', by: 'Marcus Lee', created: '2026-08-10', status: 'Active', short: ['utm.io'] },
    { name: 'Spring sale 2026', slug: 'spring-sale-2026', by: 'Priya Natarajan', created: '2026-02-20', status: 'Archived', short: ['acme.co'] },
  ];
  const ATTRS = [
    { key: 'audience', label: 'audience', type: 'list', values: ['prospects', 'customers', 'partners'] },
    { key: 'budget', label: 'budget', type: 'number', desc: 'Number Field', help: 'The user will be prompted to enter a value in a text box.' },
    { key: 'launch_date', label: 'launch_date', type: 'date', desc: 'Date Picker', help: 'The user will be prompted to select a MM-DD-YYYY date with a calendar picker.' },
    { key: 'market', label: 'market', type: 'list', values: ['us', 'uk', 'de', 'au'] },
  ];
  const MEMBERS = [
    { email: 'dana@acme.example', status: 'Activated', role: 'admin', admin: true, ws: 3 },
    { email: 'marcus@acme.example', status: 'Activated', role: 'member', admin: false, ws: 2 },
    { email: 'priya@acme.example', status: 'Activated', role: 'member', admin: true, ws: 3 },
    { email: 'new.hire@acme.example', status: 'Pending', role: 'member', admin: false, ws: 1 },
  ];
  const API_KEYS = [
    { created: '2026-08-18', used: '2026-10-21', user: 'Dana Whitfield', name: "Dana's API key", token: 'utm_live_4f9a1c7e2b8d6f0a3e5c9b1d7f2a8c4e6b0d9f3a1c5e7b2d8f4a6c0e9b3d5f7a' },
    { created: '2026-10-02', used: '2026-10-26', user: 'Marcus Lee', name: 'Zapier sync', token: 'utm_live_9c2e6a4b1d8f3c7e0a5b9d2f6c4e8a1b3d7f5c9e2a6b0d4f8c1e5a9b3d7f2c6e' },
  ];
  const ZAPS = [
    { t: 'Create UTM.io attributes from newly updated Salesforce records', s: 'Salesforce + UTM.io', a: ['SF', 'U'] },
    { t: 'Create Google Sheets rows for new UTM.io links', s: 'UTM.io + Google Sheets', a: ['U', 'GS'] },
    { t: 'Add new UTM.io link updates to Google Sheets rows', s: 'UTM.io + Google Sheets', a: ['U', 'GS'] },
    { t: 'Delete Google Sheets rows when new UTM.io links are deleted', s: 'UTM.io + Google Sheets', a: ['U', 'GS'] },
    { t: 'Create UTM.io parameters for new Salesforce records', s: 'Salesforce + UTM.io', a: ['SF', 'U'] },
  ];
  const PLANS = [
    { nm: 'Starter', pr: 'Free', for: 'Beginners and Small Teams', f: ['1 Workspace', '3 Templates', 'UTM.guru Shorten Domain', '50 Links / month'] },
    { nm: 'Plus', pr: '$16', bl: 'billed annually', for: 'Beginners and Small Teams', f: ['1 Workspace', '5 Templates', '1 Branded Shortener', '500 Links / month'] },
    { nm: 'Professional', pr: '$58', bl: 'billed annually', for: 'Early-Stage Startups', f: ['1 Workspace', '10 Templates', '1 Branded Shortener', '2,500 Links / month'] },
    { nm: 'Business', pr: '$133', bl: 'billed annually', for: 'Mid-Large Teams', f: ['2 Workspaces', '30 Templates', '2 Branded Shorteners', '10,000 Links / month'] },
    { nm: 'Enterprise', pr: 'Contact Us', contact: true, for: 'Large Companies or Agencies', cur: true, f: ['3 Workspaces', 'Unlimited Templates', '3 Branded Shorteners', 'SSO + API'] },
  ];
  const SH_STATUS = { active: ['ok', 'Activated'], verified: ['ok', 'Verified'], pending: ['warn', 'Pending DNS'], connected: ['ok', 'Activated'] };

  /* ---------- State for these pages ---------- */
  const R = { rq: '', sel: new Set(), groupBy: null, sort: null, lastWs: 'links', cols: {}, pretty: true, rulesOpen: true, addRow: null, yearly: true, deleted: new Set(), extra: {} };
  const OWN = ['links', 'qr', 'templates', 'parameters', 'attributes', 'shorteners', 'rules', 'members', 'mg-workspaces', 'mg-parameters', 'mg-attributes', 'mg-templates', 'mg-qr', 'mg-sso', 'mg-integrations', 'mg-api', 'mg-members', 'mg-shorteners', 'mg-billing', 'mg-zapier'];
  const MANAGE_SHELL = ['mg-workspaces', 'mg-parameters', 'mg-attributes', 'mg-templates', 'mg-qr', 'mg-integrations', 'mg-members', 'mg-shorteners', 'mg-billing', 'mg-zapier']; // SSO + API keys keep the sidebar today
  const TITLES = { links: 'Activity History', qr: 'Custom QR Codes', templates: 'UTM Templates', parameters: 'Parameters', attributes: 'Attributes', shorteners: 'Link Shorteners', rules: 'Workspace Defaults', members: 'Members' };
  const MG_TITLES = { 'mg-workspaces': 'My Team Workspaces', 'mg-parameters': 'Parameters Management', 'mg-attributes': 'Attributes Management', 'mg-templates': 'Templates Management', 'mg-qr': 'Global QR Code Designs', 'mg-sso': 'SSO Configuration', 'mg-integrations': 'App Integrations', 'mg-api': 'API Keys', 'mg-members': 'My Team Members', 'mg-shorteners': 'My Team Link Shorteners', 'mg-billing': 'My Team Billing', 'mg-zapier': 'Zapier Embed Templates' };

  /* ---------- Helpers ---------- */
  const fdate = iso => { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const who = name => `<span class="who">${A.avatar(name, 'xs')}${esc(name)}</span>`;
  const shortUrl = l => 'https://' + l.slug;
  const fullUrl = l => 'https://' + l.dest + A.utmQuery(l);
  const clicksOf = slug => { const q = A.Q && (A.Q.links || A.Q.cur); const r = q && q.rows.find(x => x.link.slug === slug); return r ? Math.round(r.clicks) : 0; };
  const links = () => D.LINKS.filter(l => !R.deleted.has(l.slug));
  const matches = (txt) => !R.rq || txt.toLowerCase().includes(R.rq.toLowerCase());
  const cbHTML = (on, attrs = '') => `<button type="button" class="cb ${on ? 'on' : ''}" role="checkbox" aria-checked="${on}" ${attrs}>${I.check}</button>`;
  const caret = '<svg class="caret" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
  const fakesel = (txt, chip) => `<button type="button" class="fakesel" data-fakesel>${chip ? `<span class="chip">${esc(chip)}</span>` : ''}<span>${esc(txt)}</span>${I.chev}</button>`;
  // Decorative QR-like pattern (not a real encoding), same as the v4 QR modal, as a data URL for thumbnails.
  const qrCache = {};
  function qrURL(key, fg = '#111827', bg = '#ffffff') {
    const k = key + fg + bg; if (qrCache[k]) return qrCache[k];
    const c = document.createElement('canvas'); c.width = c.height = 33; const ctx = c.getContext('2d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 33, 33); ctx.fillStyle = fg;
    let seed = 7; for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const finder = (x, y) => { ctx.fillStyle = fg; ctx.fillRect(x, y, 7, 7); ctx.fillStyle = bg; ctx.fillRect(x + 1, y + 1, 5, 5); ctx.fillStyle = fg; ctx.fillRect(x + 2, y + 2, 3, 3); };
    for (let yy = 0; yy < 33; yy++) for (let xx = 0; xx < 33; xx++) { const inF = (xx < 8 && yy < 8) || (xx > 24 && yy < 8) || (xx < 8 && yy > 24); if (!inF && r() < .45) ctx.fillRect(xx, yy, 1, 1); }
    finder(0, 0); finder(26, 0); finder(0, 26);
    return (qrCache[k] = c.toDataURL());
  }
  const designOf = slug => A.QR_DESIGNS.find(d => d.id === (A.QR_DESIGN_OF[slug] || 'default'));

  /* ---------- Page scaffold ---------- */
  const head = (title, right = '') => `<div class="rk-head"><h1>${esc(title)}</h1>${right ? `<div class="right">${right}</div>` : ''}</div>`;
  const search = (ph = '') => `<div class="rk-search grow">${I.search}<input id="rq" placeholder="${esc(ph)}" aria-label="Search" value="${esc(R.rq)}"><button type="button" class="x" id="rq-clear" ${R.rq ? '' : 'hidden'} aria-label="Clear">${I.close}</button></div>`;
  const gear = () => `<button type="button" class="btn lg icon" id="rk-cols" title="Columns">${X.gear}</button>`;
  const exportBtn = (what) => `<button type="button" class="btn lg" data-export="${esc(what)}">Export to CSV</button>`;
  const recordsFoot = n => `<div class="rk-foot"><span class="fakesel" data-fakesel>${n} records ${I.chev}</span></div>`;
  const table = (cols, rows, opts = {}) => `<div class="rk-tablewrap"><table class="rk-table" style="${opts.minw ? `min-width:${opts.minw}px` : ''}"><thead><tr>${cols.map(c => `<th class="${c.cls || ''}">${c.sort ? `<button type="button" class="sortb">${c.l}${c.sort === 'up' ? X.arrowUp : ''}</button>` : c.l}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${cols.length}"><div class="rk-empty">${opts.empty || 'Nothing matches your search.'}</div></td></tr>`}</tbody></table></div>`;
  const acts = (items) => `<span class="acts">${items.map(([ic, title, attr, cls]) => `<button type="button" class="icon-btn ${cls || ''}" title="${esc(title)}" aria-label="${esc(title)}" ${attr}>${ic}</button>`).join('')}</span>`;
  // One line per URL: domain + path in purple, the ?utm_… part greyed and cut with "…". Hover shows the whole URL; copy copies it.
  const urlCell = (url, withQr) => { const i = url.indexOf('?'), base = i > -1 ? url.slice(0, i) : url, qs = i > -1 ? url.slice(i) : '';
    return `<div class="url-cell">${withQr ? `<button type="button" class="icon-btn" title="QR code" data-qr-of="${esc(url)}">${I.qr}</button>` : ''}<button type="button" class="icon-btn" title="Copy" data-copy-url="${esc(url)}">${I.copy}</button><a class="url" href="${esc(url)}" target="_blank" rel="noopener" title="${esc(url)}">${esc(base.replace(/^https?:\/\//, ''))}${qs ? `<span class="qs">${esc(qs)}</span>` : ''}</a></div>`; };

  /* ---------- Links ---------- */
  function linksPage() {
    const rows = links().filter(l => matches([l.slug, l.dest, l.by, l.campaign, l.source, l.medium, A.templateOf(l)].join(' ')));
    const row = l => `<tr class="${R.sel.has(l.slug) ? 'sel' : ''}" data-row="${esc(l.slug)}"><td class="w-cb">${cbHTML(R.sel.has(l.slug), `data-sel="${esc(l.slug)}"`)}</td>
      <td class="w-acts">${acts([[I.edit, 'Edit link', `data-edit-link="${esc(l.slug)}"`], [X.trash, 'Delete link', `data-del-link="${esc(l.slug)}"`, 'del'], [I.analytics, 'Link analytics', `data-link-analytics="${esc(l.slug)}"`]])}</td>
      <td>${who(l.by)}</td><td class="muted nw">${fdate(l.created)}</td><td>${esc(A.templateOf(l))}</td><td class="num nw"><a href="#" class="clk" data-link-analytics="${esc(l.slug)}" title="Open analytics">${fmt.full(clicksOf(l.slug))}</a></td>
      <td>${urlCell(shortUrl(l), true)}</td><td>${urlCell(fullUrl(l), true)}</td></tr>`;
    let body;
    if (R.groupBy) {
      const g = R.groupBy; const key = l => g === 'by' ? l.by : g === 'created' ? fdate(l.created) : g === 'template' ? A.templateOf(l) : (l[g] || 'Not set');
      const groups = {}; rows.forEach(l => (groups[key(l)] = groups[key(l)] || []).push(l));
      body = Object.entries(groups).map(([k, ls]) => `<tr><td colspan="8" style="background:var(--sunken);font-weight:600;color:var(--text-strong)">${esc(k)} <span class="muted" style="font-weight:400">· ${ls.length} link${ls.length === 1 ? '' : 's'}</span></td></tr>` + ls.map(row).join(''));
    } else body = rows.map(row);
    return `<div class="view rk-page">${head(`${WS} Activity History`, `<button type="button" class="btn lg" data-toast="Import links via CSV is outside this prototype">Import links via CSV</button>`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-link">Create link</button><button type="button" class="btn lg" id="rk-group">${R.groupBy ? 'Grouped by ' + ({ by: 'Created by', created: 'Created at', campaign: 'Campaign name', medium: 'Medium', source: 'Source', term: 'Term', content: 'Content', template: 'Template' })[R.groupBy] : 'Group by'}${caret}</button>${search('Search links')}${exportBtn('links')}${gear()}</div>
      ${table([{ l: '', cls: 'w-cb' }, { l: '', cls: 'w-acts' }, { l: 'Created By' }, { l: 'Created At' }, { l: 'Template' }, { l: 'Clicks', cls: 'num' }, { l: 'Short URL' }, { l: 'Full URL' }], body, { minw: 1060 })}
      ${recordsFoot(10)}</div>`;
  }

  /* ---------- QR codes ---------- */
  function qrPage() {
    const rows = links().filter(l => l.qr > 0).filter(l => matches([l.slug, l.dest, l.by, A.templateOf(l)].join(' ')));
    const row = l => { const d = designOf(l.slug); return `<tr class="${R.sel.has(l.slug) ? 'sel' : ''}"><td class="w-cb">${cbHTML(R.sel.has(l.slug), `data-sel="${esc(l.slug)}"`)}</td><td style="width:72px"><img class="qrthumb" src="${qrURL(l.slug, d.fg, d.bg)}" alt="QR code for ${esc(l.slug)}" data-qr-open="${esc(l.slug)}" style="cursor:pointer"></td>
      <td class="w-acts">${acts([[I.edit, 'Edit QR code', `data-edit-link="${esc(l.slug)}"`], [I.analytics, 'Link analytics', `data-link-analytics="${esc(l.slug)}"`]])}</td>
      <td>${who(l.by)}</td><td class="muted">${fdate(l.created)}</td><td>${esc(A.templateOf(l))}</td><td>${urlCell(shortUrl(l))}</td><td class="num">${fmt.full(clicksOf(l.slug))}</td><td>${urlCell(fullUrl(l))}</td></tr>`; };
    return `<div class="view rk-page">${head(`${WS} Custom QR Codes`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-qr">Create QR code</button><button type="button" class="btn lg" data-toast="The QR designer is outside this prototype">Design QR template</button><button type="button" class="btn lg" data-toast="The QR designer is outside this prototype">Edit QR template</button>${search('Search QR codes')}${gear()}</div>
      ${table([{ l: '', cls: 'w-cb' }, { l: 'QR Code' }, { l: '', cls: 'w-acts' }, { l: 'Created By' }, { l: 'Created At' }, { l: 'Template' }, { l: 'Short URL' }, { l: 'Clicks', cls: 'num' }, { l: 'Full URL' }], rows.map(row), { minw: 1060 })}</div>`;
  }

  /* ---------- Templates ---------- */
  const tplRows = () => A.TEMPLATE_LIST.filter(t => matches([t.name, t.slug, t.by, t.campaign, t.medium, t.source].join(' ')));
  const tplRow = t => `<tr class="${R.sel.has('t:' + t.key) ? 'sel' : ''}"><td class="w-cb">${cbHTML(R.sel.has('t:' + t.key), `data-sel="t:${t.key}"`)}</td>
      <td class="w-acts">${acts([[I.edit, 'Edit template', `data-edit-tpl="${t.key}"`], [I.copy, 'Duplicate template', `data-dup-tpl="${t.key}"`]])}</td>
      <td>${who(t.by)}</td><td class="muted">${fdate(t.created)}</td><td><b style="font-weight:500">${esc(t.name)}</b></td><td class="mono muted">${esc(t.slug)}</td><td class="mono">${esc(t.campaign)}</td><td class="mono">${esc(t.medium)}</td><td class="mono">${esc(t.source)}</td><td class="mono">${esc(t.term)}</td><td class="mono">${esc(t.content)}</td></tr>`;
  const TPL_COLS = [{ l: '', cls: 'w-cb' }, { l: '', cls: 'w-acts' }, { l: 'Created By' }, { l: 'Created At' }, { l: 'Name' }, { l: 'Template Slug' }, { l: 'Campaign Name' }, { l: 'Medium' }, { l: 'Source' }, { l: 'Term' }, { l: 'Content' }];
  function templatesPage() {
    return `<div class="view rk-page">${head(`${WS} UTM Templates`, `<button type="button" class="btn lg" data-toast="Import templates via CSV is outside this prototype">Import templates via CSV</button>`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-tpl">Create template</button>${search('Search templates')}${exportBtn('templates')}${gear()}</div>
      ${table(TPL_COLS, tplRows().map(tplRow), { minw: 1240 })}</div>`;
  }

  /* ---------- Parameters + Attributes boards ---------- */
  function boardHTML(cols, noun) {
    return `<div class="rk-board">${cols.map(c => `<div class="rk-col" data-col="${esc(c.key)}"><div class="rk-col-h"><span>${esc(c.label)}</span>${c.common ? '<span class="tag" title="Added to every new workspace">Common</span>' : ''}<span class="grow"></span><button type="button" class="icon-btn" data-col-menu="${esc(c.key)}" aria-label="More">${I.more}</button></div>
      <div class="rk-col-b">${c.desc ? `<div class="rk-val desc"><b>${esc(c.desc)}</b><span>${esc(c.help)}</span></div>` : c.values.map(v => `<div class="rk-val" data-val="${esc(v)}"><span class="grow">${esc(v)}</span><button type="button" class="icon-btn" data-val-menu="${esc(c.key)}|${esc(v)}" aria-label="More">${I.more}</button></div>`).join('')}</div>
      ${c.desc ? '' : `<div class="rk-addrow">${R.addRow === c.key ? `<form data-add-val="${esc(c.key)}"><input placeholder="New ${esc(c.label)}" autofocus aria-label="New value"><button type="submit" class="btn primary">Add</button></form>` : `<button type="button" class="btn lnk" data-add-row="${esc(c.key)}">+ Add another ${esc(c.label)}</button>`}</div>`}</div>`).join('')}
      <button type="button" class="rk-col-ghost" data-add-col="${noun}">${X.plus}Add ${noun}</button></div>`;
  }
  const paramCols = () => A.PARAMS.map(p => ({ key: p.key, label: p.key === 'campaign' ? 'campaign' : p.label.toLowerCase(), common: p.common, values: p.values.map(v => v.v !== undefined ? v.v : v[0]).filter(v => !R.rq || v.toLowerCase().includes(R.rq.toLowerCase())).concat(R.extra[p.key] || []) }));
  const attrCols = () => ATTRS.map(a => ({ key: 'a:' + a.key, label: a.label, desc: a.desc, help: a.help, values: (a.values || []).filter(v => !R.rq || v.includes(R.rq.toLowerCase())).concat(R.extra['a:' + a.key] || []) }));
  function parametersPage(manage) {
    return `<div class="view rk-page">${head(manage ? 'Parameters Management' : `${WS} Parameters`, manage ? '' : `<button type="button" class="btn lg" data-toast="Import parameters via CSV is outside this prototype">Import parameters via CSV</button>`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-add-param">${I.info}Add custom URL parameter</button>${search('Search parameters')}${exportBtn('parameters')}${gear()}</div>
      ${boardHTML(paramCols(), 'parameter')}</div>`;
  }
  function attributesPage(manage) {
    return `<div class="view rk-page">${head(manage ? 'Attributes Management' : `${WS} Attributes`, manage ? '' : `<button type="button" class="btn lg" data-toast="Import attributes via CSV is outside this prototype">Import attributes via CSV</button>`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-add-attr">${I.info}Add attribute</button>${search('Search attributes')}${exportBtn('attributes')}${gear()}</div>
      ${boardHTML(attrCols(), 'attribute')}</div>`;
  }

  /* ---------- Link shorteners ---------- */
  function shortenersPage(manage) {
    const rows = A.SHORTENERS.filter(s => matches(s.domain + ' ' + s.kind)).map(s => { const [cls, txt] = SH_STATUS[s.status]; const off = S.disabledDomains.has(s.domain);
      return `<tr><td class="w-acts">${acts([[I.edit, 'Edit shortener', `data-edit-dom="${esc(s.domain)}"`], [X.trash, 'Remove shortener', `data-del-dom="${esc(s.domain)}"`, 'del']])}</td><td><b style="font-weight:500">${esc(s.domain)}</b><span class="sub">${esc(s.kind)}</span></td><td><span class="pill ${off ? 'off' : cls}">${off ? 'Disabled' : txt}</span></td><td class="muted">${esc(s.redirect || '—')}</td>
      <td>${manage ? fakesel(`${s.locked ? 5 : 3} workspaces selected`) : `<button type="button" class="btn ${off ? 'primary' : ''}" data-toggle-dom="${esc(s.domain)}" style="min-width:110px">${off ? 'Enable' : 'Disable'}</button>`}</td></tr>`; });
    return `<div class="view rk-page">${head(manage ? 'My Team Link Shorteners' : `${WS} Link Shorteners`, manage ? '' : `<button type="button" class="btn lg" data-toast="UTM Page Cleaner setup is outside this prototype">Setup UTM Page Cleaner</button>`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-add-dom">Add link shortener</button>${search('Search shorteners')}${exportBtn('shorteners')}${gear()}</div>
      ${table([{ l: '', cls: 'w-acts' }, { l: 'Link Shorteners' }, { l: 'Status' }, { l: 'Default Redirect' }, { l: 'Workspaces' }], rows, { minw: 760 })}
      ${recordsFoot(10)}</div>`;
  }

  /* ---------- Rules (Workspace Defaults + Workspace Rules) ---------- */
  const info = '<svg class="info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  function rulesPage() {
    const ruleRows = A.PARAMS.filter(p => !p.custom).map(p => `<tr><td><b style="font-weight:500">${esc(p.key)}</b></td>
      <td>${cbHTML(p.rules.includes('required'), 'data-rulecb')}</td><td>${cbHTML(false, 'data-rulecb')}</td><td>${cbHTML(p.rules.includes('lowercase'), 'data-rulecb')}</td><td>${cbHTML(!p.rules.includes('dropdown'), 'data-rulecb')}</td><td>${cbHTML(p.shown === false, 'data-rulecb')}</td><td>${cbHTML(false, 'data-rulecb')}</td>
      <td><label class="inp sm"><input placeholder="Enter value"></label></td><td><label class="inp sm"><input placeholder="Prohibited values separated by comma"></label></td><td><label class="inp sm"><input placeholder="e.g. holiday special, …"></label></td></tr>`);
    return `<div class="view rk-page rk-rules">${head(`Manage ${WS} Workspace Defaults`)}
      <div class="rf-grid">
        <div class="rf-field"><label>Space Character</label><button type="button" class="inp sel" data-pick-list="Hyphen|Underscore|Plus|None"><span class="grow">Hyphen</span>${I.chev.replace('<svg', '<svg class="caret"')}</button><div class="hint">Replaces spaces in parameters with your chosen character.</div></div>
        <div class="rf-field"><label>Prohibited Characters ${info}</label><label class="inp"><input placeholder=""></label><div class="hint">Characters which are not allowed to use in the builder, separated with a comma</div></div>
      </div>
      <label class="chk">${cbHTML(true, 'data-rulecb')}<span>Force all campaigns parameters to lowercase<span class="sub">Helps maintain consistency</span></span></label>
      <div class="rf-grid">
        <div class="rf-field"><label>Choose the Default QR Code Design</label><button type="button" class="inp sel" data-pick-list="No Template|Default|Acme brand|Dark"><span class="grow ph">No Template</span>${I.chev.replace('<svg', '<svg class="caret"')}</button><label class="chk" style="margin-top:8px">${cbHTML(false, 'data-rulecb')}<span>Allow the members to customize the QR code designs</span></label></div>
        <div class="rf-field"><label class="chk">${cbHTML(true, 'data-rulecb')}<span>Require template selection in link builder ${info}</span></label><label>Choose the default template for your workspace ${info}</label><button type="button" class="inp sel" data-pick-list="${A.TEMPLATE_LIST.map(t => t.name).join('|')}"><span class="grow ph">No Templates Selected</span>${I.chev.replace('<svg', '<svg class="caret"')}</button><label class="chk" style="margin-top:8px">${cbHTML(false, 'data-rulecb')}<span>Do not allow members to select different templates ${info}</span></label></div>
        <div class="rf-field"><label>Choose the Default Shortener</label><button type="button" class="inp sel" data-pick-list="${A.SHORTENERS.map(s => s.domain).join('|')}"><span class="grow ph">No Shortener Selected</span>${I.chev.replace('<svg', '<svg class="caret"')}</button></div>
      </div>
      <div class="rk-head" style="margin-top:8px"><h1 style="font-size:18px">Manage ${WS} Workspace Rules</h1><div class="right"><button type="button" class="btn primary lg" data-toast="New rules are outside this prototype">${X.plus}Create rule</button><button type="button" class="btn primary lg" data-toast="Workspace settings saved">Save workspace settings</button></div></div>
      <div class="rk-rule ${R.rulesOpen ? '' : 'closed'}"><div class="rk-rule-h"><b>Rule 1</b><button type="button" class="icon-btn" title="Rename" data-toast="Renaming rules is outside this prototype">${I.edit}</button><button type="button" class="icon-btn" title="Delete rule" data-toast="Deleting rules is outside this prototype">${X.trash}</button><span class="grow"></span><button type="button" class="icon-btn chev" id="rk-rule-toggle" aria-label="Collapse">${I.chev}</button></div>
        ${table([{ l: 'Parameter' }, { l: 'Required' }, { l: 'Blocked' }, { l: 'Force Lowercase' }, { l: 'Can Type' }, { l: 'Hidden' }, { l: 'Unique' }, { l: 'Max. characters' }, { l: 'Prohibited values' }, { l: 'Custom instructions' }], ruleRows)}</div></div>`;
  }

  /* ---------- Members ---------- */
  function membersPage(manage) {
    const rows = MEMBERS.filter(m => matches(m.email + ' ' + m.status)).map(m => `<tr>${manage ? `<td class="w-acts">${acts([[I.edit, 'Edit member', 'data-toast="Editing members is outside this prototype"'], [X.trash, 'Remove member', 'data-toast="Removing members is outside this prototype"', 'del']])}</td>` : ''}<td><span class="mono" style="font-family:var(--font-ui)">${esc(m.email)}</span></td><td><span class="pill ${m.status === 'Pending' ? 'pend' : 'ok'}">${m.status}</span>${m.status === 'Pending' ? `<span class="sub"><a href="#" data-toast="Invite re-sent">Resend invite</a></span>` : ''}</td><td>${esc(m.role)}</td><td>${manage ? fakesel(`${m.ws} workspaces selected`) : cbHTML(m.admin, 'data-rulecb')}</td></tr>`);
    const cols = manage ? [{ l: '', cls: 'w-acts' }, { l: 'Email' }, { l: 'Status' }, { l: 'Role' }, { l: 'Workspaces' }] : [{ l: 'Email', sort: 'up' }, { l: 'Status' }, { l: 'Rule' }, { l: 'Workspace Admin' }];
    return `<div class="view rk-page">${head(manage ? 'My Team Members' : `${WS} Members`)}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-invite">Invite member</button>${search('Search members')}${exportBtn('members')}${gear()}</div>
      ${table(cols, rows, { minw: 760, empty: `${X.people}No Member added for this Workspace yet!<button type="button" class="btn" id="rk-invite-2">Invite member</button>` })}</div>`;
  }

  /* ---------- Manage pages ---------- */
  function workspacesPage() {
    const rows = WORKSPACES.filter(w => matches(w.name + ' ' + w.slug)).map(w => `<tr><td class="w-acts">${acts([[I.edit, 'Edit workspace', 'data-toast="Workspace settings are outside this prototype"'], [X.trash, 'Archive workspace', 'data-toast="Archiving is outside this prototype"', 'del']])}</td><td>${who(w.by)}</td><td class="muted">${fdate(w.created)}</td><td><b style="font-weight:500">${esc(w.name)}</b></td><td class="mono muted">${esc(w.slug)}</td><td><span class="pill ${w.status === 'Active' ? 'ok' : 'off'}">${w.status}</span></td><td>${fakesel(w.short[1] || '', w.short[0])}</td></tr>`);
    return `<div class="view rk-page">${head('My Team Workspaces')}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-ws">Create workspace</button>${search('Search workspaces')}${exportBtn('workspaces')}${gear()}</div>
      ${table([{ l: '', cls: 'w-acts' }, { l: 'Created By' }, { l: 'Created At' }, { l: 'Name' }, { l: 'Workspace Slug' }, { l: 'Status' }, { l: 'Shorteners' }], rows, { minw: 900 })}${recordsFoot(10)}</div>`;
  }
  function mgTemplatesPage() {
    return `<div class="view rk-page">${head('Templates Management')}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-tpl">Create template</button>${search('Search templates')}${exportBtn('templates')}${gear()}</div>
      ${table(TPL_COLS.concat([{ l: 'Custom Parameters' }]), tplRows().map(t => tplRow(t).replace('</tr>', `<td class="mono muted">${esc(t.region || t.promo || '')}</td></tr>`)), { minw: 1300 })}</div>`;
  }
  function qrDesignsPage() {
    const designs = [{ id: 'default', name: 'Default', by: 'Dana Whitfield', created: '2026-03-05', ws: 3 }, { id: 'brand', name: 'Acme brand', by: 'Dana Whitfield', created: '2026-06-02', ws: 3 }, { id: 'dark', name: 'Dark · packaging', by: 'Priya Natarajan', created: '2026-08-14', ws: 2 }, { id: 'event', name: 'Event badge', by: 'Marcus Lee', created: '2026-09-09', ws: 1 }];
    const rows = designs.filter(d => matches(d.name)).map(d => { const qd = A.QR_DESIGNS.find(x => x.id === d.id) || A.QR_DESIGNS[0]; return `<tr><td class="w-cb">${cbHTML(false, `data-sel="d:${d.id}"`)}</td><td style="width:72px"><img class="qrthumb" src="${qrURL('design-' + d.id, qd.fg, qd.bg)}" alt=""></td><td class="w-acts">${acts([[I.edit, 'Edit design', 'data-toast="The QR designer is outside this prototype"']])}</td><td><b style="font-weight:500">${esc(d.name)}</b></td><td>${who(d.by)}</td><td class="muted">${fdate(d.created)}</td><td>${fakesel(`${d.ws} workspaces selected`)}</td></tr>`; });
    return `<div class="view rk-page">${head('Global QR Code Designs')}
      <div class="rk-tools"><button type="button" class="btn primary lg" data-toast="The QR designer is outside this prototype">Add QR code design</button>${search('Search designs')}${gear()}</div>
      ${table([{ l: '', cls: 'w-cb' }, { l: 'QR Code' }, { l: '', cls: 'w-acts' }, { l: 'Name' }, { l: 'Created By' }, { l: 'Created At' }, { l: 'Workspaces' }], rows, { minw: 820 })}</div>`;
  }
  function ssoPage() {
    return `<div class="view rk-page">${head('SSO Configuration')}<div class="rk-form-card"><form class="rf" id="rk-sso">
      <div class="rf-row"><label><span class="req">*</span>Company name</label><label class="inp"><input placeholder="company name"></label><div class="hint">Used to identify your SSO account in our system. Most customers enter their team name listed on your account.</div></div>
      <div class="rf-row"><label><span class="req">*</span>Domains</label><label class="inp area"><textarea placeholder="example.com"></textarea></label><div class="hint">A list of domains you would like to connect for SSO access. These domains should already be validated with your authentication provider. Domains in the list should be delineated by a hard return.</div></div>
      <div class="rf-row"><span></span><div class="rf-actions left"><button type="submit" class="btn primary lg">Continue</button></div></div></form></div></div>`;
  }
  function integrationsPage() {
    const card = (logo, nm, st, btns) => `<div class="rk-icard"><div class="logo">${logo}</div><div class="nm">${nm}</div><div class="st ${st ? '' : 'none'}">${I.check}${st || 'x'}</div><div class="acts">${btns.map(b => `<button type="button" class="btn" data-toast="${esc(b)} is outside this prototype">${esc(b)}</button>`).join('')}</div></div>`;
    return `<div class="view rk-page">${head('App Integrations')}<div class="rk-cards">
      ${card('<span style="color:#ee6123">bitly</span>', 'Bitly', 'Account integrated', ['Re-auth', 'Remove'])}${card('<span style="color:#ff4a00">_zapier</span>', 'Zapier', 'Activated', ['Manage tokens'])}${card(X.api, 'REST API', 'Activated', ['API page'])}${card(X.help, 'Request an integration', '', ['Request to activate'])}</div></div>`;
  }
  function apiKeysPage() {
    const rows = API_KEYS.filter(k => matches(k.name + ' ' + k.user)).map(k => `<tr><td class="w-acts">${acts([[I.edit, 'Rename key', 'data-toast="Renaming keys is outside this prototype"'], [X.trash, 'Revoke key', 'data-toast="Revoking keys is outside this prototype"', 'del']])}</td><td class="muted">${fdate(k.created)}</td><td class="muted">${fdate(k.used)}</td><td>${who(k.user)}</td><td>${esc(k.name)}</td><td><span class="tok"><button type="button" class="icon-btn" title="Copy" data-copy-url="${esc(k.token)}">${I.copy}</button><span title="${esc(k.token)}">${esc(k.token)}</span></span></td></tr>`);
    return `<div class="view rk-page">${head('API Keys', '<a class="btn lnk" href="https://help.utm.io/" target="_blank" rel="noopener">API Documentation</a>')}
      <div class="rk-tools"><button type="button" class="btn primary lg" id="rk-create-key">Create API key</button>${search('Search keys')}${exportBtn('API keys')}${gear()}</div>
      ${table([{ l: '', cls: 'w-acts' }, { l: 'Created At' }, { l: 'Last Use At' }, { l: 'User' }, { l: 'Name' }, { l: 'Token' }], rows, { minw: 900 })}${recordsFoot(10)}</div>`;
  }
  function billingPage() {
    return `<div class="view rk-page rk-bill">${head('My Team Billing')}
      <div class="rk-guar"><div class="badge">30<small>DAY</small></div><div>We're so confident you'll love our yearly plans, we're offering a full 30 day, money back guarantee. If you aren't completely satisfied with your plan, simply email us at <a href="#" data-toast="Mail is outside this prototype">help@utm.io</a> to get a full refund.</div></div>
      <h2>Choose Your Plan</h2><div class="sub">Your plan is <b>Enterprise</b>. Pick the best plan for your account</div>
      <div class="rk-cycle"><span class="${R.yearly ? '' : 'on'}">MONTHLY</span><label class="switch ${R.yearly ? 'on' : ''}" id="rk-cycle"><i></i></label><span class="${R.yearly ? 'on' : ''}">YEARLY <small>(2 month free)</small></span></div>
      <div class="rk-plans">${PLANS.map(p => `<div class="rk-plan ${p.cur ? 'cur' : ''}"><div class="nm">${p.nm}</div><div class="pr ${p.contact ? 'contact' : ''}">${p.pr}${p.pr.startsWith('$') ? '<small>/month</small>' : ''}</div><div class="bl">${p.bl && R.yearly ? p.bl : ''}</div><div class="for"><b>Best for</b>${p.for}</div><button type="button" class="btn ${p.cur ? '' : 'primary'}" style="width:100%" data-toast="${p.cur ? 'This is your current plan' : 'Plan changes are outside this prototype'}">${p.cur ? 'Current plan' : 'Select plan'}</button><ul>${p.f.map(f => `<li>${I.check}${esc(f)}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
  }
  function zapierPage() {
    const col = { SF: '#00a1e0', U: '#8a64c0', GS: '#0f9d58' };
    return `<div class="view rk-page">${head('Zapier Embed Templates')}<div class="rk-zap">${ZAPS.map(z => `<div class="rk-zrow"><div class="apps">${z.a.map(a => `<span style="background:${col[a]}">${a}</span>`).join('')}</div><div class="t"><b>${esc(z.t)}</b><span>${esc(z.s)}</span></div><button type="button" class="btn dark" data-toast="Zapier opens in a new tab outside this prototype">Use this workflow</button></div>`).join('')}</div></div>`;
  }

  /* ---------- Create link modal (today's modal builder, reskinned) ---------- */
  let B = null;
  const lbParams = () => A.PARAMS.filter(p => p.shown !== false);
  const pvals = p => p.values.map(v => v.v !== undefined ? v.v : v[0]);
  const ic = (svg, cls = 'caret') => svg.replace('<svg', `<svg class="${cls}"`);
  function builderModal(o = {}) {
    const edit = o.edit ? D.LINKS.find(l => l.slug === o.edit) : null;
    B = { qr: !!o.qr || !!(edit && edit.qr > 0), edit, mode: 'single', url: edit ? 'https://' + edit.dest : '', design: 'Default', template: edit ? A.templateOf(edit) : (o.tpl ? (A.TEMPLATE_LIST.find(t => t.key === o.tpl) || {}).name : ''), vals: {}, attrs: {}, notes: '', shortener: edit ? edit.slug.split('/')[0] : 'none', smart: false };
    if (edit) ['campaign', 'medium', 'source', 'content', 'term'].forEach(k => { if (edit[k]) B.vals[k] = edit[k]; });
    if (o.tpl) applyTemplate(A.TEMPLATE_LIST.find(t => t.key === o.tpl));
    const title = edit ? 'Edit Link' : B.qr ? 'Create Link With QR Code' : 'Create Link';
    openModal(`<div class="modal-h"><h3>${title}</h3>${edit ? '' : `<div class="seg rk"><button type="button" data-mode="single" class="on">Single URL</button><button type="button" data-mode="multi">Multiple URLs</button></div>`}<button class="close" aria-label="Close">${I.close}</button></div>
      <div class="lbm"><form class="rf" id="lbm-form" autocomplete="off">${builderFields()}</form>
        <div class="lbm-side"><canvas id="lbm-qr" width="33" height="33" aria-label="QR code preview"></canvas><span class="lbl">Preview</span><button type="button" class="btn" data-toast="The QR designer is outside this prototype">Design QR Code</button></div></div>
      <div class="lbm-foot"><div class="url" id="lbm-url">${X.link}<span class="ph">https://</span></div><button type="button" class="btn primary lg" id="lbm-save">${I.copy}${edit ? 'Save' : 'Copy & Save'}</button></div>`, {
      onMount(s) {
        $('.modal', s).classList.add('rk-wide');
        const form = $('#lbm-form', s);
        const sync = () => { form.innerHTML = builderFields(); paintPreview(s); };
        paintPreview(s);
        form.addEventListener('input', e => { const k = e.target.dataset.f; if (!k) return; if (k === 'url') B.url = e.target.value; else if (k === 'notes') B.notes = e.target.value; else if (k.startsWith('a:')) B.attrs[k.slice(2)] = e.target.value; paintPreview(s); });
        form.addEventListener('submit', e => e.preventDefault());
        form.addEventListener('click', e => {
          const t = e.target;
          if (t.closest('[data-clear]')) { const k = t.closest('[data-clear]').dataset.clear; if (k === 'template') { B.template = ''; } else if (k === 'design') B.design = 'No Template'; else delete B.vals[k]; sync(); return; }
          const pk = t.closest('[data-pick]'); if (pk) { pickValue(pk, pk.dataset.pick, sync); return; }
          if (t.closest('[data-smart]')) { B.smart = !B.smart; sync(); return; }
          if (t.closest('[data-addparam]')) { addParamModal(); return; }
        });
        $$('[data-mode]', s).forEach(b => b.addEventListener('click', () => { B.mode = b.dataset.mode; $$('[data-mode]', s).forEach(x => x.classList.toggle('on', x === b)); sync(); }));
        $('#lbm-save', s).addEventListener('click', () => {
          if (!B.url.trim()) { toast('Add a destination URL first'); $('[data-f="url"]', s).focus(); return; }
          if (B.qr && B.shortener === 'none') { $('#lbm-err', s).hidden = false; return; }
          const u = previewURL(); copyText(u, edit ? 'Link saved and copied' : 'Link created and copied');
          if (!edit) { const l = { slug: (B.shortener === 'none' ? 'utm.io' : B.shortener) + '/' + Math.random().toString(36).slice(2, 7), dest: B.url.replace(/^https?:\/\//, ''), title: 'New link', campaign: B.vals.campaign || '', source: B.vals.source || '', medium: B.vals.medium || '', content: B.vals.content || '', term: B.vals.term || '', created: isoToday(), by: 'Tyler Berry', tags: [], qr: B.qr ? 1 : 0, base: 0, shape: 'steady', uniq: .7, geo: {}, dev: {}, ref: {}, series: new Array(D.DAYS).fill(0), id: D.LINKS.length }; D.LINKS.unshift(l); }
          closeModal(); render({ top: true });
        });
      },
    });
  }
  const isoToday = () => { const t = D.TODAY; return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
  function applyTemplate(t) { if (!t) return; B.template = t.name; ['campaign', 'medium', 'source', 'content', 'term'].forEach(k => { const v = t[k]; if (v && !/^\{\{/.test(v)) B.vals[k] = v; else delete B.vals[k]; }); }
  function previewURL() { if (!B.url.trim()) return ''; const base = /^https?:\/\//i.test(B.url) ? B.url : 'https://' + B.url; const q = lbParams().filter(p => B.vals[p.key]).map(p => `${p.utm}=${encodeURIComponent(B.vals[p.key])}`).join('&'); return q ? base + (base.includes('?') ? '&' : '?') + q : base; }
  function paintPreview(s) {
    const u = previewURL(); const el = $('#lbm-url', s); el.innerHTML = `${X.link}<span class="${u ? '' : 'ph'}">${esc(u || 'https://')}</span>`;
    const c = $('#lbm-qr', s), ctx = c.getContext('2d'), img = new Image(); img.onload = () => { ctx.clearRect(0, 0, 33, 33); ctx.drawImage(img, 0, 0); }; img.src = qrURL(u || 'empty');
  }
  const selInput = (key, val, ph, extra = '') => `<button type="button" class="inp sel ${val ? 'has-val' : ''}" data-pick="${esc(key)}"><span class="grow ${val ? '' : 'ph'}">${esc(val || ph)}</span>${extra}${ic(I.chev)}</button>`;
  function builderFields() {
    const f = (label, body, hint) => `<div class="rf-row"><label>${label}</label>${body}${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
    const prev = k => B.vals[k] ? `<div class="rf-prev" style="margin-top:-2px">Preview: <b>${esc(B.vals[k].toLowerCase().replace(/\s+/g, '-'))}</b></div>` : '';
    let h = B.mode === 'multi' ? f('URLs', `<label class="inp area"><textarea data-f="url" placeholder="One URL per line">${esc(B.url)}</textarea></label>`, 'Each line becomes its own link with the same parameters.') : f('URL', `<label class="inp"><input data-f="url" placeholder="https://" value="${esc(B.url)}">${ic(I.chev)}</label>`);
    h += f('QR Code Design', `<button type="button" class="inp sel has-val" data-pick="design"><span class="grow">${esc(B.design)}</span>${B.design !== 'No Template' ? '<span class="clear" data-clear="design">CLEAR</span>' : ''}${ic(I.chev)}</button>`);
    h += f('Template<span class="req">*</span>', `<button type="button" class="inp sel" data-pick="template">${B.template ? `<span class="chip">${esc(B.template)}${I.close}</span><span class="grow"></span><span class="clear" data-clear="template">CLEAR</span>` : '<span class="grow ph">Select multiple to bulk create links</span>'}${ic(I.chev)}</button>`, 'Select multiple to bulk create links. (<a href="#" data-toast="The tutorial is outside this prototype">Watch Tutorial</a>)');
    lbParams().forEach(p => { h += `<div class="rf-row"><label>${esc(p.key === 'campaign' ? 'campaign' : p.label.toLowerCase())}</label>${selInput(p.key, B.vals[p.key], p.key === 'term' ? 'Use to identify ppc keywords, dynamic tag = {keyword}' : p.key === 'content' ? 'Use to differentiate ads or words on a page' : 'Select or type parameters', `<span class="cnt">${pvals(p).length}</span>`)}${['campaign', 'medium', 'source', 'content'].includes(p.key) ? prev(p.key) : ''}</div>`; });
    h += `<div class="rf-row"><span></span><a href="#" class="btn lnk" style="justify-self:start" data-addparam>Add custom URL parameter</a></div>`;
    ATTRS.forEach(a => { h += f(esc(a.label), a.type === 'date' ? `<label class="inp"><input data-f="a:${a.key}" placeholder="Click to choose a date" value="${esc(B.attrs[a.key] || '')}">${ic(I.calendar, 'ico')}</label>` : a.type === 'number' ? `<label class="inp"><input data-f="a:${a.key}" type="number" placeholder="Enter a number" value="${esc(B.attrs[a.key] || '')}"></label>` : selInput('a:' + a.key, B.attrs[a.key], 'Select or type attributes')); });
    h += f('notes', `<label class="inp"><input data-f="notes" placeholder="Notes are saved in your dashboard, not visible on links" value="${esc(B.notes)}"></label>`);
    h += f('Shortener', selInput('shortener', B.shortener === 'none' ? "Don't shorten" : B.shortener, '', ''));
    h += `<div class="rf-row"><label>Smart Routing</label><div style="display:flex;align-items:center;gap:10px;font-size:14px"><span>${B.smart ? 'On' : 'Off'}</span><span class="grow"></span><button type="button" class="btn lnk" data-smart>Edit ${I.chevR.replace('<svg', '<svg style="width:12px;height:12px;display:inline;vertical-align:-1px"')}</button></div></div>`;
    h += `<div class="rf-err" id="lbm-err" ${B.qr && B.shortener === 'none' ? '' : 'hidden'}>You need to select a link shortener before creating a link with a QR code.</div>`;
    return h;
  }
  // Value dropdown for a builder field: today's "Select or type" combobox.
  function pickValue(anchor, key, done) {
    let opts, pick;
    if (key === 'design') { opts = ['No Template', ...A.QR_DESIGNS.map(d => d.name)]; pick = v => { B.design = v; }; }
    else if (key === 'template') { opts = A.TEMPLATE_LIST.map(t => t.name); pick = v => applyTemplate(A.TEMPLATE_LIST.find(t => t.name === v)); }
    else if (key === 'shortener') { opts = ["Don't shorten", ...A.SHORTENERS.filter(s => s.status !== 'pending').map(s => s.domain)]; pick = v => { B.shortener = v === "Don't shorten" ? 'none' : v; }; }
    else if (key.startsWith('a:')) { const a = ATTRS.find(x => x.key === key.slice(2)); opts = (a.values || []).concat(R.extra[key] || []); pick = v => { B.attrs[a.key] = v; }; }
    else { const p = A.PARAMS.find(x => x.key === key); opts = pvals(p).concat(R.extra[key] || []); pick = v => { B.vals[key] = v; }; }
    const typed = !['design', 'template', 'shortener'].includes(key);
    const list = q => { const ql = q.trim().toLowerCase(); const vs = opts.filter(v => !ql || v.toLowerCase().includes(ql)); return vs.map(v => `<button type="button" class="mi" data-v="${esc(v)}"><span class="grow">${esc(v)}</span></button>`).join('') + (typed && ql && !opts.some(v => v.toLowerCase() === ql) ? `<button type="button" class="mi add" data-v="${esc(q.trim())}">${X.plus}<span class="grow">Use “${esc(q.trim())}”</span></button>` : '') || `<div class="group" style="padding:12px 10px">No matches</div>`; };
    openPop(anchor, `${typed ? `<div class="search">${I.search}<input id="pk-q" placeholder="Select or type…" aria-label="Search values"></div>` : ''}<div class="menu rk-opts" id="pk-list" style="width:${Math.max(260, anchor.offsetWidth)}px">${list('')}</div>`, { onMount(el) {
      const l = $('#pk-list', el), q = $('#pk-q', el);
      if (q) { q.addEventListener('input', () => { l.innerHTML = list(q.value); }); q.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const b = $('.mi', l); if (b) b.click(); } }); }
      l.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; pick(b.dataset.v); closePop(); done(); });
    } });
  }

  /* ---------- Other modals (same fields as today) ---------- */
  function templateModal(t) {
    const f = (label, body, hint) => `<div class="rf-row"><label>${label}</label>${body}${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
    const v = k => t ? (t[k] || '') : '';
    openModal(`<div class="modal-h"><h3>${t ? 'Edit Template' : 'Create Template'}</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><form class="rf" id="tpl-form">${f('Template Name', `<label class="inp"><input value="${esc(v('name'))}" required></label>`)}${f('Template Slug', `<label class="inp"><input value="${esc(v('slug'))}"></label>`, 'You can use the slug to easily refer to this template when using the UTM.io API. Format changes will be applied after save.')}
        <div class="rf-sec">Parameters</div>
        ${f('campaign', `<label class="inp"><input value="${esc(v('campaign'))}" placeholder="e.g. holiday special, birthday promotion"></label>`)}${f('medium', `<label class="inp"><input value="${esc(v('medium'))}" placeholder="e.g. banner ad, email, social post"></label>`)}${f('source', `<label class="inp"><input value="${esc(v('source'))}" placeholder="e.g. adwords, google, mailchimp"></label>`)}${f('content', `<label class="inp"><input value="${esc(v('content'))}" placeholder="Use to differentiate ads or words on a page"></label>`)}${f('term', `<label class="inp"><input value="${esc(v('term'))}" placeholder="Use to identify ppc keywords, dynamic tag = {keyword}"></label>`)}
        ${A.PARAMS.filter(p => p.custom).map(p => f(esc(p.key), `<label class="inp"><input value="${esc(v(p.key))}" placeholder="Select or type parameters"></label>`)).join('')}
        <div class="rf-sec">Attributes</div>${ATTRS.map(a => f(esc(a.label), `<label class="inp"><input placeholder="${a.type === 'date' ? 'Click to choose a date' : 'Select or type attributes'}"></label>`)).join('')}
        <div class="rf-actions"><button type="submit" class="btn primary lg">${t ? 'Save template' : 'Create template'}</button></div></form></div>`, {
      onMount(s) { $('.modal', s).classList.add('rk'); $('.modal', s).style.width = 'min(720px,100%)'; $('#tpl-form', s).addEventListener('submit', e => { e.preventDefault(); const name = $('input', e.target).value.trim(); if (!name) return; if (t) { t.name = name; } else A.TEMPLATE_LIST.push({ key: 'tpl-' + Date.now(), name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), campaign: '', medium: '', source: '', content: '', term: '', by: 'Tyler Berry', created: isoToday() }); closeModal(); render(); toast(t ? 'Template saved' : `Template “${name}” created`); }); },
    });
  }
  function addParamModal(attr) {
    openModal(`<div class="modal-h"><h3>${attr ? 'Add new attribute' : 'Add new custom parameter'}</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><form class="rf" id="ap-form">
        <div class="rf-stack"><label><span class="req">*</span>Field name</label><label class="inp"><input placeholder="Field name" required></label></div>
        <div class="rf-stack"><label><span class="req">*</span>${attr ? 'Attribute' : 'Parameter'} type</label><button type="button" class="inp sel has-val" data-pick-list="Freeform (Default)|Dropdown only|Number Field|Date Picker"><span class="grow">Freeform (Default)</span>${ic(I.chev)}</button></div>
        <div class="rf-stack"><label>Select workspace</label><button type="button" class="inp sel has-val" data-pick-list="${WORKSPACES.map(w => w.name).join('|')}"><span class="chip">${WS}</span><span class="grow"></span>${ic(I.chev)}</button></div>
        <label class="chk">${cbHTML(false, 'data-rulecb')}<span>This is a common ${attr ? 'attribute' : 'parameter'}, and should be added to all future workspaces</span></label>
        <div class="rf-actions"><button type="submit" class="btn primary lg">Add ${attr ? 'attribute' : 'parameter'}</button></div></form></div>`, {
      onMount(s) { $('.modal', s).classList.add('rk'); $('#ap-form', s).addEventListener('submit', e => { e.preventDefault(); const name = $('input', e.target).value.trim(); if (!name) return;
        if (attr) ATTRS.push({ key: name.toLowerCase().replace(/\W+/g, '_'), label: name, type: 'list', values: [] }); else A.PARAMS.push({ key: name.toLowerCase().replace(/\W+/g, '_'), label: name, utm: name.toLowerCase().replace(/\W+/g, '_'), custom: true, format: 'text', rules: [], values: [], shown: true, deps: null, hint: '' });
        closeModal(); render(); toast(`${attr ? 'Attribute' : 'Parameter'} “${name}” added`); }); },
    });
  }
  function addShortenerModal() {
    openModal(`<div class="modal-h"><h3>Add New Link Shortener</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><div class="rk-choice"><button type="button" class="btn primary lg" data-toast="Custom domain setup is outside this prototype">Custom Branded Domain</button><button type="button" class="btn primary lg" data-toast="utm.io is already in this workspace">utm.io</button><button type="button" class="btn primary lg" data-toast="Bitly sign-in is outside this prototype">${I.external}Authenticate Bitly</button></div></div>`, { onMount(s) { $('.modal', s).classList.add('rk'); } });
  }
  function inviteModal() {
    const row = () => `<div class="rf-grid" style="grid-template-columns:2fr 1fr 1fr;gap:12px"><div class="rf-stack"><label>Email Address</label><label class="inp"><input type="email" placeholder=""></label></div><div class="rf-stack"><label><span class="req">*</span>Role</label><button type="button" class="inp sel has-val" data-pick-list="Member|Admin|Viewer"><span class="grow">Member</span>${ic(I.chev)}</button></div><div class="rf-stack"><label><span class="req">*</span>Workspaces</label><button type="button" class="inp sel" data-pick-list="${WORKSPACES.map(w => w.name).join('|')}"><span class="grow ph"></span>${ic(I.chev)}</button></div></div>`;
    openModal(`<div class="modal-h"><h3>Invite Users</h3><button class="close" aria-label="Close">${I.close}</button></div>
      <div class="modal-b"><form class="rf" id="inv-form"><div id="inv-rows" class="rf">${row()}</div><button type="button" class="rk-col-ghost" id="inv-more" style="width:100%;min-height:40px;border-radius:8px">${X.plus}Add more users</button><div class="rf-actions"><button type="submit" class="btn primary lg">Confirm</button></div></form></div>`, {
      onMount(s) { $('.modal', s).classList.add('rk'); $('.modal', s).style.width = 'min(680px,100%)'; $('#inv-more', s).addEventListener('click', () => $('#inv-rows', s).insertAdjacentHTML('beforeend', row()));
        $('#inv-form', s).addEventListener('submit', e => { e.preventDefault(); const emails = $$('input[type=email]', s).map(i => i.value.trim()).filter(Boolean); if (!emails.length) { toast('Add at least one email'); return; } emails.forEach(em => MEMBERS.push({ email: em, status: 'Pending', role: 'member', admin: false, ws: 1 })); closeModal(); render(); toast(`Invited ${emails.length} user${emails.length === 1 ? '' : 's'}`); }); },
    });
  }
  function confirmModal(title, body, onYes, yes = 'Delete') {
    openModal(`<div class="modal-h"><h3>${esc(title)}</h3><button class="close" aria-label="Close">${I.close}</button></div><div class="modal-b"><p style="margin:0 0 16px;color:var(--text-muted);font-size:14px">${body}</p><div class="rf-actions"><button type="button" class="btn lg close">Cancel</button><button type="button" class="btn lg danger" id="cf-yes">${yes}</button></div></div>`, { onMount(s) { $('.modal', s).classList.add('rk'); $('.modal', s).style.width = 'min(440px,100%)'; $('#cf-yes', s).addEventListener('click', () => { closeModal(); onYes(); }); } });
  }
  function simpleModal(title, fields, submitLabel, onSubmit) {
    openModal(`<div class="modal-h"><h3>${esc(title)}</h3><button class="close" aria-label="Close">${I.close}</button></div><div class="modal-b"><form class="rf" id="sm-form">${fields.map(([l, ph]) => `<div class="rf-stack"><label><span class="req">*</span>${esc(l)}</label><label class="inp"><input placeholder="${esc(ph)}" required></label></div>`).join('')}<div class="rf-actions"><button type="submit" class="btn primary lg">${esc(submitLabel)}</button></div></form></div>`, { onMount(s) { $('.modal', s).classList.add('rk'); $('#sm-form', s).addEventListener('submit', e => { e.preventDefault(); onSubmit($$('input', e.target).map(i => i.value.trim())); closeModal(); }); } });
  }
  // Generic list dropdown for "select-looking" controls on Rules / modals
  function pickList(anchor) {
    const opts = anchor.dataset.pickList.split('|');
    openPop(anchor, `<div class="menu" style="width:${Math.max(220, anchor.offsetWidth)}px">${opts.map(o => `<button type="button" class="mi" data-v="${esc(o)}"><span class="grow">${esc(o)}</span></button>`).join('')}</div>`, { onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; const g = $('.grow', anchor); if (g) { g.textContent = b.dataset.v; g.classList.remove('ph'); } anchor.classList.add('has-val'); closePop(); }); } });
  }
  function columnsPop(anchor) {
    const cols = { links: ['Created By', 'Created At', 'Template', 'Clicks', 'Short URL', 'Full URL', 'Campaign Name', 'Medium', 'Source', 'Term', 'Content', 'Notes'], qr: ['Created By', 'Created At', 'Template', 'Short URL', 'Clicks', 'Full URL'], templates: ['Created By', 'Created At', 'Name', 'Template Slug', 'Campaign Name', 'Medium', 'Source', 'Term', 'Content'], parameters: A.PARAMS.map(p => p.label) }[S.view] || ['Created By', 'Created At', 'Name', 'Status'];
    const on = c => R.cols[S.view + c] !== false;
    openPop(anchor, `<div class="menu rk-cols"><label class="mi" style="cursor:pointer">${cbHTML(R.pretty, 'data-pretty')}<span class="grow">Show pretty names</span></label><div class="sep"></div>${cols.map(c => `<label class="mi" style="cursor:pointer">${cbHTML(on(c), `data-colcb="${esc(c)}"`)}<span class="grow">${esc(c)}</span></label>`).join('')}</div>`, { align: 'right', onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('.cb'); if (!b) return; const now = !b.classList.contains('on'); b.classList.toggle('on', now); b.setAttribute('aria-checked', now); if (b.dataset.colcb) R.cols[S.view + b.dataset.colcb] = now; else R.pretty = now; }); } });
  }
  function groupPop(anchor) {
    const opts = [['', 'Links'], ['by', 'Created By'], ['created', 'Created At'], ['campaign', 'Campaign Name'], ['medium', 'Medium'], ['source', 'Source'], ['term', 'Term'], ['content', 'Content'], ['template', 'Template']];
    openPop(anchor, `<div class="menu" style="width:220px">${opts.map(([k, l]) => `<button type="button" class="mi ${(R.groupBy || '') === k ? 'on' : ''}" data-g="${k}"><span class="check">${I.check}</span><span class="grow">${l}</span></button>`).join('')}</div>`, { onMount(el) { el.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; R.groupBy = b.dataset.g || null; closePop(); render(); }); } });
  }

  /* ---------- Render ---------- */
  const PAGES = { links: linksPage, qr: qrPage, templates: templatesPage, parameters: () => parametersPage(false), attributes: () => attributesPage(false), shorteners: () => shortenersPage(false), rules: rulesPage, members: () => membersPage(false),
    'mg-workspaces': workspacesPage, 'mg-parameters': () => parametersPage(true), 'mg-attributes': () => attributesPage(true), 'mg-templates': mgTemplatesPage, 'mg-qr': qrDesignsPage, 'mg-sso': ssoPage, 'mg-integrations': integrationsPage, 'mg-api': apiKeysPage, 'mg-members': () => membersPage(true), 'mg-shorteners': () => shortenersPage(true), 'mg-billing': billingPage, 'mg-zapier': zapierPage };
  function render(opts = {}) {
    const view = $('#view'); const y = window.scrollY;
    view.innerHTML = PAGES[S.view]();
    if (opts.top) window.scrollTo({ top: 0, behavior: 'instant' }); else window.scrollTo(0, y);
    const manage = MANAGE_SHELL.includes(S.view);
    $('#shell').classList.toggle('manage', manage);
    $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav === S.view));
    $('#topbar-title').textContent = MG_TITLES[S.view] || TITLES[S.view] || WS;
    document.title = `${MG_TITLES[S.view] || TITLES[S.view]} · UTM.io vReskin`;
    try { location.hash = S.view; } catch (e) { /* ignore */ }
    if (!manage && !S.view.startsWith('mg-')) R.lastWs = S.view;
    const f = $('#rq'); if (f && opts.focusSearch) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
  }
  function go(view, opts = {}) { if (!PAGES[view]) return; closePop(); closeModal(); S.view = view; S.slug = null; R.rq = ''; R.sel.clear(); R.addRow = null; if (view !== 'links') R.groupBy = null; A.compute(); render({ top: true, ...opts }); }
  window.RESKIN = { owns: v => OWN.includes(v), render, go };

  /* ---------- Events (capture, so app.js's handlers don't also run on these pages) ---------- */
  $('#view').addEventListener('click', e => {
    const t = e.target, hit = s => t.closest(s); let el;
    // The per-link report is app.js's page; only its Edit button changes (today's builder is a modal).
    if (S.view === 'link') { if (hit('#edit-btn')) { e.stopPropagation(); builderModal({ edit: S.slug }); } return; }
    if (!OWN.includes(S.view)) return;
    e.stopPropagation();
    if ((el = hit('[data-toast]'))) { e.preventDefault(); toast(el.dataset.toast); return; }
    if ((el = hit('[data-link-analytics]'))) { e.preventDefault(); S.from = S.view; A.goLink(el.dataset.linkAnalytics); return; }
    if ((el = hit('[data-copy-url]'))) { copyText(el.dataset.copyUrl, 'Copied to clipboard'); return; }
    if ((el = hit('[data-qr-of]'))) { const u = el.dataset.qrOf; const l = D.LINKS.find(x => shortUrl(x) === u || fullUrl(x) === u); if (l) A.qrModal(l); return; }
    if ((el = hit('[data-qr-open]'))) { A.qrModal(D.LINKS.find(x => x.slug === el.dataset.qrOpen)); return; }
    if ((el = hit('[data-sel]'))) { const k = el.dataset.sel; if (R.sel.has(k)) R.sel.delete(k); else R.sel.add(k); el.classList.toggle('on', R.sel.has(k)); el.setAttribute('aria-checked', R.sel.has(k)); el.closest('tr').classList.toggle('sel', R.sel.has(k)); return; }
    if ((el = hit('[data-rulecb]'))) { const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.setAttribute('aria-checked', on); return; }
    if ((el = hit('[data-pick-list]'))) { pickList(el); return; }
    if (hit('[data-fakesel]')) { toast('Multi-select is outside this prototype'); return; }
    if ((el = hit('[data-export]'))) { toast(`Exported ${el.dataset.export} as CSV`); return; }
    if (hit('#rk-cols')) { columnsPop(hit('#rk-cols')); return; }
    if (hit('#rq-clear')) { R.rq = ''; render({ focusSearch: true }); return; }
    if ((el = hit('.sortb'))) { toast('Sorting is outside this prototype'); return; }
    // Links / QR
    if (hit('#rk-create-link')) { builderModal(); return; }
    if (hit('#rk-create-qr')) { builderModal({ qr: true }); return; }
    if (hit('#rk-group')) { groupPop(hit('#rk-group')); return; }
    if ((el = hit('[data-edit-link]'))) { builderModal({ edit: el.dataset.editLink }); return; }
    if ((el = hit('[data-del-link]'))) { const s = el.dataset.delLink; confirmModal('Delete link?', `<b>${esc(s)}</b> will stop redirecting. This can't be undone.`, () => { R.deleted.add(s); render(); toast('Link deleted'); }); return; }
    // Templates
    if (hit('#rk-create-tpl')) { templateModal(null); return; }
    if ((el = hit('[data-edit-tpl]'))) { templateModal(A.TEMPLATE_LIST.find(x => x.key === el.dataset.editTpl)); return; }
    if ((el = hit('[data-dup-tpl]'))) { const x = A.TEMPLATE_LIST.find(y => y.key === el.dataset.dupTpl); A.TEMPLATE_LIST.push({ ...x, key: x.key + '-copy', name: x.name + ' (copy)', slug: x.slug + '-copy', by: 'Tyler Berry', created: isoToday() }); render(); toast(`Duplicated “${x.name}”`); return; }
    // Boards
    if (hit('#rk-add-param')) { addParamModal(false); return; }
    if (hit('#rk-add-attr')) { addParamModal(true); return; }
    if ((el = hit('[data-add-col]'))) { addParamModal(el.dataset.addCol === 'attribute'); return; }
    if ((el = hit('[data-add-row]'))) { R.addRow = el.dataset.addRow; render(); const i = $('[data-add-val] input'); if (i) i.focus(); return; }
    if ((el = hit('[data-col-menu]'))) { openPop(el, `<div class="menu" style="width:200px"><button class="mi" data-toast="Renaming is outside this prototype">${I.edit}<span class="grow">Rename</span></button><button class="mi" data-toast="Import is outside this prototype">${I.download}<span class="grow">Import values</span></button><div class="sep"></div><button class="mi" data-toast="Deleting is outside this prototype" style="color:var(--down)">${X.trash}<span class="grow">Delete</span></button></div>`, { align: 'right', onMount(p) { p.addEventListener('click', ev => { const b = ev.target.closest('[data-toast]'); if (b) { closePop(); toast(b.dataset.toast); } }); } }); return; }
    if ((el = hit('[data-val-menu]'))) { const [k, v] = el.dataset.valMenu.split('|'); openPop(el, `<div class="menu" style="width:200px"><button class="mi" data-act="edit">${I.edit}<span class="grow">Edit value</span></button><div class="sep"></div><button class="mi" data-act="del" style="color:var(--down)">${X.trash}<span class="grow">Delete value</span></button></div>`, { align: 'right', onMount(p) { p.addEventListener('click', ev => { const b = ev.target.closest('[data-act]'); if (!b) return; closePop(); if (b.dataset.act === 'edit') simpleModal('Edit value', [['Value', v]], 'Save', vals => { renameValue(k, v, vals[0]); }); else confirmModal('Delete value?', `<b>${esc(v)}</b> will be removed from the list. Links that already use it keep working.`, () => { removeValue(k, v); }); }); } }); return; }
    // Shorteners
    if (hit('#rk-add-dom')) { addShortenerModal(); return; }
    if ((el = hit('[data-toggle-dom]'))) { const d = el.dataset.toggleDom; if (S.disabledDomains.has(d)) S.disabledDomains.delete(d); else S.disabledDomains.add(d); render(); toast(`${d} ${S.disabledDomains.has(d) ? 'disabled' : 'enabled'} for this workspace`); return; }
    if ((el = hit('[data-edit-dom]'))) { const s = A.SHORTENERS.find(x => x.domain === el.dataset.editDom); simpleModal(`Edit ${s.domain}`, [['Default redirect', s.redirect || 'example.com']], 'Save', vals => { s.redirect = vals[0]; render(); toast('Shortener saved'); }); return; }
    if ((el = hit('[data-del-dom]'))) { const d = el.dataset.delDom; confirmModal('Remove shortener?', `Links on <b>${esc(d)}</b> will stop working.`, () => { const i = A.SHORTENERS.findIndex(x => x.domain === d); if (i > -1) A.SHORTENERS.splice(i, 1); render(); toast(`${d} removed`); }, 'Remove'); return; }
    // Rules
    if (hit('#rk-rule-toggle')) { R.rulesOpen = !R.rulesOpen; hit('.rk-rule').classList.toggle('closed', !R.rulesOpen); return; }
    // Members / workspaces / keys / billing
    if (hit('#rk-invite') || hit('#rk-invite-2')) { inviteModal(); return; }
    if (hit('#rk-create-ws')) { simpleModal('Create Workspace', [['Workspace name', 'e.g. Acme APAC']], 'Create workspace', vals => { WORKSPACES.unshift({ name: vals[0], slug: vals[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'), by: 'Tyler Berry', created: isoToday(), status: 'Active', short: ['utm.io'] }); render(); toast(`Workspace “${vals[0]}” created`); }); return; }
    if (hit('#rk-create-key')) { simpleModal('Create API Key', [['Name', "e.g. Dana's API key"]], 'Create key', vals => { API_KEYS.unshift({ created: isoToday(), used: isoToday(), user: 'Tyler Berry', name: vals[0], token: 'utm_live_' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('') }); render(); toast('API key created'); }); return; }
    if (hit('#rk-cycle')) { R.yearly = !R.yearly; render(); return; }
  }, true);
  function renameValue(k, from, to) { if (!to || to === from) return; const p = A.PARAMS.find(x => x.key === k); if (p) { const v = p.values.find(x => (x.v !== undefined ? x.v : x[0]) === from); if (v) { if (v.v !== undefined) v.v = to; else v[0] = to; } } else { const a = ATTRS.find(x => 'a:' + x.key === k); if (a && a.values) a.values = a.values.map(x => x === from ? to : x); } const ex = R.extra[k]; if (ex) R.extra[k] = ex.map(x => x === from ? to : x); render(); toast(`Renamed to “${to}”`); }
  function removeValue(k, v) { const p = A.PARAMS.find(x => x.key === k); if (p) { const i = p.values.findIndex(x => (x.v !== undefined ? x.v : x[0]) === v); if (i > -1) p.values.splice(i, 1); } else { const a = ATTRS.find(x => 'a:' + x.key === k); if (a && a.values) a.values = a.values.filter(x => x !== v); } if (R.extra[k]) R.extra[k] = R.extra[k].filter(x => x !== v); render(); toast(`Deleted “${v}”`); }
  $('#view').addEventListener('submit', e => {
    const f = e.target.closest('[data-add-val]');
    if (f) { e.preventDefault(); e.stopPropagation(); const k = f.dataset.addVal; const v = $('input', f).value.trim(); if (!v) return; (R.extra[k] = R.extra[k] || []).push(v); R.addRow = null; render(); toast(`Added “${v}”`); return; }
    if (e.target.id === 'rk-sso') { e.preventDefault(); e.stopPropagation(); toast('SSO setup continues outside this prototype'); }
  }, true);
  $('#view').addEventListener('input', (() => { let t; return e => { if (e.target.id !== 'rq') return; e.stopPropagation(); R.rq = e.target.value; const c = $('#rq-clear'); if (c) c.hidden = !R.rq; clearTimeout(t); t = setTimeout(() => render({ focusSearch: true }), 150); }; })(), true);
  $('#view').addEventListener('keydown', e => { if (e.target.id === 'rq' && e.key === 'Escape' && R.rq) { R.rq = ''; render({ focusSearch: true }); } }, true);

  /* ---------- Shell: today's sidebar, switcher, top bar and menus ---------- */
  const NAV = [['links', 'Links', I.links], ['qr', 'QR Codes', I.qr], ['analytics', 'Analytics', I.analytics], ['templates', 'Templates', I.templates], ['parameters', 'Parameters', I.parameters], ['attributes', 'Attributes', I.attributes], ['shorteners', 'Link Shorteners', I.shorteners], ['rules', 'Rules', I.rules], ['members', 'Workspace members', I.members], ['support', 'Support', I.support]];
  const fresh = id => { const o = $('#' + id); const n = o.cloneNode(true); o.replaceWith(n); return n; }; // drops app.js's listeners
  const nav = fresh('nav');
  nav.innerHTML = NAV.map(([k, l, svg]) => `<a href="#${k}" data-nav="${k}" title="${l}">${svg}<span class="nav-label">${l}</span></a>`).join('');
  nav.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); const k = a.dataset.nav; if (k === 'analytics') { closeModal(); A.goOverview(); } else if (k === 'support') window.open('https://help.utm.io/', '_blank', 'noopener'); else go(k); });
  $('#sidebar').insertAdjacentHTML('afterbegin', `<div class="rk-back"><img src="assets/logo.png" alt=""><button type="button" id="rk-back-btn" aria-label="Back to workspace" title="Back to workspace">${I.arrowL}</button></div>`);
  $('#rk-back-btn').addEventListener('click', () => go(R.lastWs || 'links'));
  fresh('ext-btn').addEventListener('click', () => window.open('https://chromewebstore.google.com/', '_blank', 'noopener'));
  fresh('plan-btn').addEventListener('click', () => go('mg-billing'));
  const MANAGE = [['mg-workspaces', 'Workspaces'], ['mg-parameters', 'Parameters'], ['mg-attributes', 'Attributes'], ['mg-templates', 'Templates'], ['mg-qr', 'QR Design'], ['mg-sso', 'Setup SSO'], ['mg-integrations', 'Integrations'], ['mg-api', 'API Keys'], ['mg-members', 'Account Members'], ['mg-shorteners', 'Link Shortener'], ['mg-billing', 'Plans & Pricing'], ['mg-zapier', 'Zapier Templates']];
  fresh('manage-btn').addEventListener('click', e => openPop(e.currentTarget, `<div class="menu" style="width:200px">${MANAGE.map(([k, l]) => `<button type="button" class="mi ${S.view === k ? 'on' : ''}" data-go="${k}"><span class="grow">${l}</span></button>`).join('')}</div>`, { align: 'right', onMount(el) { el.addEventListener('click', ev => { const b = ev.target.closest('[data-go]'); if (b) { closePop(); go(b.dataset.go); } }); } }));
  fresh('user-btn').addEventListener('click', e => openPop(e.currentTarget, `<div class="menu rk-acct"><div class="hd">${I.members}<b>My Team</b></div><button type="button" class="mi" data-toast="Account switching is outside this prototype"><span class="grow">Switch Accounts</span></button><button type="button" class="mi" data-toast="Profile editing is outside this prototype"><span class="grow">Edit Profile</span></button><button type="button" class="mi" data-toast="Demo requests are outside this prototype"><span class="grow">Request a Demo</span></button><div class="sep"></div><button type="button" class="mi" data-toast="Signed out (not really)"><span class="grow">Logout</span></button></div>`, { align: 'right', onMount(el) { el.addEventListener('click', ev => { const b = ev.target.closest('[data-toast]'); if (b) { closePop(); toast(b.dataset.toast); } }); } }));
  fresh('ws').addEventListener('click', e => openPop(e.currentTarget, `<div class="menu rk-ws">${WORKSPACES.filter(w => w.status === 'Active').map(w => `<button type="button" class="mi ${w.name === WS ? 'on' : ''}" data-ws="${esc(w.name)}"><span class="grow">${esc(w.name)}</span>${w.name === WS ? `<span class="check">${I.check}</span>` : ''}</button>`).join('')}<div class="foot"><button type="button" class="btn lg" data-go="mg-workspaces">Manage workspaces</button><button type="button" class="btn primary lg" data-create-ws>Create workspace</button></div></div>`, { onMount(el) { el.addEventListener('click', ev => { const b = ev.target.closest('[data-ws],[data-go],[data-create-ws]'); if (!b) return; closePop(); if (b.dataset.go) go(b.dataset.go); else if (b.hasAttribute('data-create-ws')) { go('mg-workspaces'); $('#rk-create-ws').click(); } else toast(`Switching to ${b.dataset.ws} is outside this prototype`); }); } }));
  $('#need-help').addEventListener('click', () => window.open('https://help.utm.io/', '_blank', 'noopener'));
  // Keep app.js's hash for Analytics / link report; everything else is ours
  const shellTick = () => { const manage = MANAGE_SHELL.includes(S.view); $('#shell').classList.toggle('manage', manage); };
  const origGoOverview = A.goOverview; A.goOverview = () => { $('#shell').classList.remove('manage'); origGoOverview(); };
  const origGoLink = A.goLink; A.goLink = s => { $('#shell').classList.remove('manage'); origGoLink(s); };

  /* ---------- Boot ---------- */
  (function boot() {
    const h = (location.hash || '').replace('#', '');
    if (h === 'overview' || h === 'analytics') { A.goOverview(); return; }
    if (h.startsWith('link-')) return; // app.js already opened the link report
    const v = PAGES[h] ? h : 'links';
    S.view = v; A.compute(); render({ top: true });
    shellTick();
  })();
})();
