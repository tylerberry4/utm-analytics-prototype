/* ------------------------------------------------------------------
   UTM Analytics prototype v4 — data layer
   One synthetic dataset. Everything on screen is computed from it, so
   filters, the All / Links / QR toggle and the date range all recompute
   every number consistently. Numbers are made up but add up.
------------------------------------------------------------------- */
(function () {
  'use strict';

  // "Today" is fixed so the prototype is deterministic.
  const TODAY = new Date(2026, 9, 28); // 2026-10-28
  const DAYS = 150;                     // history kept per link

  // Seeded RNG (mulberry32) so the data is identical on every load.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Reference tables ---------- */

  // Each country is split into cities; every city sits in one region, so country → region → city
  // always agree when filtered. Region shares are the sum of their cities. 'Other' = clicks we can't place.
  const COUNTRIES = {
    US: { name: 'United States',  flag: '🇺🇸', cities: { 'New York': ['New York', .2], 'Los Angeles': ['California', .16], Austin: ['Texas', .12], Chicago: ['Illinois', .1], 'San Francisco': ['California', .1], Seattle: ['Washington', .08], Miami: ['Florida', .07], Other: [null, .17] } },
    GB: { name: 'United Kingdom', flag: '🇬🇧', cities: { London: ['England', .55], Manchester: ['England', .14], Birmingham: ['England', .1], Edinburgh: ['Scotland', .08], Cardiff: ['Wales', .05], Belfast: ['Northern Ireland', .03], Other: [null, .05] } },
    CA: { name: 'Canada',         flag: '🇨🇦', cities: { Toronto: ['Ontario', .42], Vancouver: ['British Columbia', .22], Montreal: ['Quebec', .18], Calgary: ['Alberta', .1], Other: [null, .08] } },
    DE: { name: 'Germany',        flag: '🇩🇪', cities: { Berlin: ['Berlin', .34], Munich: ['Bavaria', .26], Frankfurt: ['Hesse', .18], Hamburg: ['Hamburg', .14], Other: [null, .08] } },
    AU: { name: 'Australia',      flag: '🇦🇺', cities: { Sydney: ['New South Wales', .46], Melbourne: ['Victoria', .32], Brisbane: ['Queensland', .14], Other: [null, .08] } },
    FR: { name: 'France',         flag: '🇫🇷', cities: { Paris: ['Île-de-France', .58], Lyon: ['Auvergne-Rhône-Alpes', .18], Toulouse: ['Occitanie', .12], Other: [null, .12] } },
    NL: { name: 'Netherlands',    flag: '🇳🇱', cities: { Amsterdam: ['North Holland', .56], Rotterdam: ['South Holland', .24], Utrecht: ['Utrecht', .2] } },
    ES: { name: 'Spain',          flag: '🇪🇸', cities: { Madrid: ['Madrid', .5], Barcelona: ['Catalonia', .36], Seville: ['Andalusia', .14] } },
    IN: { name: 'India',          flag: '🇮🇳', cities: { Mumbai: ['Maharashtra', .4], Bengaluru: ['Karnataka', .35], 'New Delhi': ['Delhi', .25] } },
    BR: { name: 'Brazil',         flag: '🇧🇷', cities: { 'São Paulo': ['São Paulo', .62], 'Rio de Janeiro': ['Rio de Janeiro', .38] } },
    MX: { name: 'Mexico',         flag: '🇲🇽', cities: { 'Mexico City': ['Mexico City', .7], Guadalajara: ['Jalisco', .3] } },
    IE: { name: 'Ireland',        flag: '🇮🇪', cities: { Dublin: ['Leinster', .85], Cork: ['Munster', .15] } },
    SE: { name: 'Sweden',         flag: '🇸🇪', cities: { Stockholm: ['Stockholm', .7], Malmö: ['Skåne', .3] } },
    JP: { name: 'Japan',          flag: '🇯🇵', cities: { Tokyo: ['Tokyo', .75], Osaka: ['Osaka', .25] } },
  };
  // Flat list of places: one entry per city, with the labels used for the region and city dimensions.
  const PLACES = []; const PLACE = { region: {}, city: {} };
  for (const [cc, c] of Object.entries(COUNTRIES)) for (const [name, [region, share]] of Object.entries(c.cities)) {
    const pl = { cc, share, city: name === 'Other' ? `Other (${cc})` : name, region: region || `Other (${cc})` };
    PLACES.push(pl); PLACE.city[pl.city] = { cc, region: region }; PLACE.region[pl.region] = { cc };
  }

  const BROWSERS = { Chrome: .58, Safari: .25, Edge: .08, Firefox: .06, Other: .03 };
  const OS_BY_DEVICE = {
    mobile:  { iOS: .62, Android: .38 },
    desktop: { macOS: .52, Windows: .45, Linux: .03 },
    tablet:  { iPadOS: .8, Android: .2 },
  };

  // Behaviour of QR scans differs from link clicks: almost all mobile, no referrer.
  const QR_DEVICE = { mobile: .88, desktop: .05, tablet: .07 };
  const QR_REFERRER = { 'No referrer': 1 };

  /* ---------- Links ---------- */
  // base = average clicks/day in the current month. shape = how the trend behaves.
  const LINKS = [
    { slug: 'acme.co/fall-sale',     dest: 'acme.com/sale', title: 'Fall sale 2026 · Facebook carousel', campaign: 'fall_sale_2026', source: 'facebook', medium: 'paid_social', content: 'carousel_v2', term: '', created: '2026-09-06', anchor: '2026-10-06', by: 'Dana Whitfield', tags: ['Q4', 'Paid social'], qr: .09, base: 360, shape: 'spike', uniq: .72,
      geo: { US: .45, GB: .13, CA: .11, DE: .07, AU: .06, FR: .04, NL: .03, ES: .03, IN: .02, BR: .02, MX: .02, IE: .01, SE: .005, JP: .005 }, dev: { mobile: .74, desktop: .21, tablet: .05 }, ref: { 'facebook.com': .62, 'm.facebook.com': .19, 'No referrer': .12, 'l.facebook.com': .07 } },
    { slug: 'acme.co/bf-teaser',     dest: 'acme.com/black-friday', title: 'Black Friday teaser · Instagram story', campaign: 'black_friday_teaser', source: 'instagram', medium: 'paid_social', content: 'story_teaser', term: '', created: '2026-10-14', anchor: '2026-10-14', by: 'Dana Whitfield', tags: ['Q4', 'Paid social'], qr: .03, base: 240, shape: 'launch', uniq: .66,
      geo: { US: .41, GB: .15, CA: .09, DE: .08, AU: .07, FR: .05, NL: .04, ES: .04, IN: .03, BR: .02, MX: .01, IE: .005, SE: .005, JP: .005 }, dev: { mobile: .86, desktop: .1, tablet: .04 }, ref: { 'instagram.com': .71, 'l.instagram.com': .17, 'No referrer': .12 } },
    { slug: 'acme.co/webinar',       dest: 'acme.com/webinar/oct-29', title: 'October webinar · LinkedIn post', campaign: 'webinar_oct29', source: 'linkedin', medium: 'social', content: 'organic_post', term: '', created: '2026-08-20', anchor: '2026-10-01', by: 'Marcus Lee', tags: ['Events'], qr: 0, base: 190, shape: 'decline', uniq: .78,
      geo: { US: .36, GB: .22, CA: .1, DE: .09, AU: .05, FR: .04, NL: .04, ES: .02, IN: .04, BR: .01, MX: .01, IE: .015, SE: .01, JP: .005 }, dev: { mobile: .38, desktop: .58, tablet: .04 }, ref: { 'linkedin.com': .74, 'lnkd.in': .14, 'No referrer': .1, 'google.com': .02 } },
    { slug: 'acme.co/q4-launch',     dest: 'acme.com/q4', title: 'Q4 product launch · Google Ads', campaign: 'product_launch_q4', source: 'google', medium: 'cpc', content: 'rsa_v3', term: 'acme q4', created: '2026-08-29', anchor: '2026-09-29', by: 'Priya Natarajan', tags: ['Q4', 'Paid search'], qr: .12, base: 155, shape: 'up', uniq: .7,
      geo: { US: .52, GB: .1, CA: .12, DE: .05, AU: .06, FR: .03, NL: .03, ES: .02, IN: .03, BR: .01, MX: .02, IE: .005, SE: .005, JP: .005 }, dev: { mobile: .55, desktop: .4, tablet: .05 }, ref: { 'google.com': .81, 'No referrer': .15, 'bing.com': .04 } },
    { slug: 'utm.io/r/8fk2a',        dest: 'partners.acme.com/referral', title: 'Partner referral program', campaign: 'partner_referral', source: 'partner', medium: 'referral', content: '', term: '', created: '2026-08-12', by: 'Marcus Lee', tags: ['Partners'], qr: 0, base: 120, shape: 'steady', uniq: .68,
      geo: { US: .3, GB: .12, CA: .31, DE: .06, AU: .05, FR: .04, NL: .03, ES: .02, IN: .02, BR: .02, MX: .02, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .42, desktop: .53, tablet: .05 }, ref: { 'partnerstack.com': .44, 'No referrer': .3, 'mail.google.com': .16, 'outlook.live.com': .1 } },
    { slug: 'acme.co/newsletter',    dest: 'acme.com/newsletter/oct', title: 'October newsletter', campaign: 'newsletter_oct', source: 'newsletter', medium: 'email', content: 'hero_cta', term: '', created: '2026-06-02', anchor: '2026-10-07', by: 'Dana Whitfield', tags: ['Email'], qr: 0, base: 105, shape: 'bursts', uniq: .8,
      geo: { US: .47, GB: .14, CA: .1, DE: .06, AU: .07, FR: .04, NL: .03, ES: .03, IN: .02, BR: .01, MX: .01, IE: .01, SE: .005, JP: .005 }, dev: { mobile: .6, desktop: .35, tablet: .05 }, ref: { 'mail.google.com': .48, 'No referrer': .34, 'outlook.live.com': .14, 'mail.yahoo.com': .04 } },
    { slug: 'acme.co/store-poster',  dest: 'acme.com/stores', title: 'In-store poster · Fall sale', campaign: 'fall_sale_2026', source: 'print', medium: 'print', content: 'store_window', term: '', created: '2026-09-03', anchor: '2026-10-03', by: 'Priya Natarajan', tags: ['Q4', 'Print'], qr: .96, base: 88, shape: 'up', uniq: .8,
      geo: { US: .6, GB: .08, CA: .14, DE: .04, AU: .03, FR: .02, NL: .01, ES: .02, IN: .01, BR: .01, MX: .03, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .9, desktop: .05, tablet: .05 }, ref: { 'No referrer': .96, 'google.com': .04 } },
    { slug: 'acme.co/fall-ig',       dest: 'acme.com/sale', title: 'Fall sale 2026 · Instagram reel', campaign: 'fall_sale_2026', source: 'instagram', source2: '', medium: 'paid_social', content: 'reel_v1', term: '', created: '2026-09-08', anchor: '2026-10-08', by: 'Dana Whitfield', tags: ['Q4', 'Paid social'], qr: 0, base: 46, shape: 'steady', uniq: .74,
      geo: { US: .39, GB: .16, CA: .09, DE: .08, AU: .08, FR: .05, NL: .04, ES: .04, IN: .03, BR: .02, MX: .01, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .88, desktop: .08, tablet: .04 }, ref: { 'instagram.com': .7, 'l.instagram.com': .2, 'No referrer': .1 } },
    { slug: 'acme.co/fall-email',    dest: 'acme.com/sale', title: 'Fall sale 2026 · Email blast', campaign: 'fall_sale_2026', source: 'newsletter', medium: 'email', content: 'promo_banner', term: '', created: '2026-09-09', anchor: '2026-10-09', by: 'Dana Whitfield', tags: ['Q4', 'Email'], qr: 0, base: 31, shape: 'decline', uniq: .78,
      geo: { US: .33, GB: .33, CA: .08, DE: .06, AU: .06, FR: .04, NL: .03, ES: .02, IN: .02, BR: .01, MX: .01, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .58, desktop: .37, tablet: .05 }, ref: { 'mail.google.com': .5, 'No referrer': .3, 'outlook.live.com': .2 } },
    { slug: 'acme.co/fall-qr',       dest: 'acme.com/sale', title: 'Fall sale 2026 · Store window QR', campaign: 'fall_sale_2026', source: 'print', medium: 'print', content: 'store_window', term: '', created: '2026-10-03', anchor: '2026-10-03', by: 'Priya Natarajan', tags: ['Q4', 'Print'], qr: 1, base: 20, shape: 'launch', uniq: .86,
      geo: { US: .58, GB: .1, CA: .12, DE: .04, AU: .04, FR: .03, NL: .02, ES: .02, IN: .01, BR: .01, MX: .02, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .92, desktop: .03, tablet: .05 }, ref: { 'No referrer': 1 } },
    { slug: 'acme.co/podcast',       dest: 'acme.com/podcast', title: 'Podcast sponsorship · Episode 42', campaign: 'podcast_s3', source: 'podcast', medium: 'audio', content: 'ep42', term: '', created: '2026-09-18', by: 'Marcus Lee', tags: ['Brand'], qr: 0, base: 27, shape: 'bursts', uniq: .82,
      geo: { US: .55, GB: .12, CA: .1, DE: .04, AU: .08, FR: .02, NL: .03, ES: .01, IN: .02, BR: .01, MX: .01, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .7, desktop: .25, tablet: .05 }, ref: { 'No referrer': .78, 'open.spotify.com': .14, 'podcasts.apple.com': .08 } },
    { slug: 'acme.co/docs-cta',      dest: 'docs.acme.com/getting-started', title: 'Docs → trial CTA', campaign: '', source: 'docs', medium: 'referral', content: 'sidebar_cta', term: '', created: '2026-07-02', by: 'Priya Natarajan', tags: ['Product'], qr: 0, base: 38, shape: 'steady', uniq: .6,
      geo: { US: .4, GB: .12, CA: .08, DE: .1, AU: .05, FR: .05, NL: .05, ES: .03, IN: .07, BR: .02, MX: .01, IE: .01, SE: .005, JP: .005 }, dev: { mobile: .18, desktop: .78, tablet: .04 }, ref: { 'docs.acme.com': .88, 'google.com': .08, 'No referrer': .04 } },
    { slug: 'acme.co/event-badge',   dest: 'acme.com/events/saastr', title: 'SaaStr booth badge QR', campaign: 'saastr_2026', source: 'event', medium: 'print', content: 'badge', term: '', created: '2026-09-10', by: 'Marcus Lee', tags: ['Events', 'Print'], qr: 1, base: 9, shape: 'decline', uniq: .9,
      geo: { US: .8, GB: .05, CA: .06, DE: .02, AU: .01, FR: .01, NL: .01, ES: .01, IN: .02, BR: 0, MX: .01, IE: 0, SE: 0, JP: 0 }, dev: { mobile: .95, desktop: .02, tablet: .03 }, ref: { 'No referrer': 1 } },
    { slug: 'acme.co/yt-review',     dest: 'acme.com/compare', title: 'YouTube review · description link', campaign: 'creator_oct', source: 'youtube', medium: 'video', content: 'description', term: '', created: '2026-10-11', anchor: '2026-10-11', by: 'Dana Whitfield', tags: ['Creators'], qr: 0, base: 52, shape: 'spike', uniq: .76,
      geo: { US: .42, GB: .13, CA: .1, DE: .06, AU: .06, FR: .03, NL: .03, ES: .03, IN: .08, BR: .03, MX: .02, IE: .005, SE: .005, JP: 0 }, dev: { mobile: .66, desktop: .3, tablet: .04 }, ref: { 'youtube.com': .84, 'm.youtube.com': .1, 'No referrer': .06 } },
  ];

  /* ---------- Daily series per link ---------- */
  // Returns an array of DAYS numbers; index 0 = DAYS-1 days ago, last = today.
  function buildSeries(link, seed) {
    const r = rng(seed);
    const created = dayIndex(parseDate(link.created));
    const anchor = dayIndex(parseDate(link.anchor || link.created));
    const out = new Array(DAYS).fill(0);
    for (let i = 0; i < DAYS; i++) {
      if (i < created) continue;
      const age = i - anchor;                            // days since the campaign moment (anchor) — can be negative
      const date = dateAt(i);
      const dow = date.getDay();
      const weekday = (dow === 0 || dow === 6) ? 0.72 : 1 + (dow === 2 || dow === 3 ? 0.08 : 0);
      let shape = 1;
      switch (link.shape) {
        case 'spike':   shape = 0.6 + (age >= 9 && age <= 12 ? [2.4, 4.1, 2.2, 1.1][age - 9] : 0) + Math.min(Math.max(age, 0), 30) / 60; break;
        case 'launch':  shape = age < 0 ? 0.65 : age < 2 ? 1.9 : age < 6 ? 1.5 - age * 0.08 : 0.9 + Math.sin(age / 5) * 0.08; break;
        case 'decline': shape = age < 0 ? 0.75 : 1.6 * Math.exp(-age / 18) + 0.35; break;
        case 'up':      shape = 0.55 + Math.min(Math.max(age, 0), 40) / 40 * 0.9; break;
        case 'bursts':  shape = 0.45 + ((((age % 7) + 7) % 7) === 1 ? 1.9 : (((age % 7) + 7) % 7) === 2 ? 0.9 : 0); break;
        default:        shape = 1 + Math.sin(age / 9) * 0.12;
      }
      // Older history (before the current month) runs lower so "vs prior" is interesting.
      const era = i < DAYS - 28 ? 0.92 : 1;
      const noise = 0.82 + r() * 0.36;
      // Today is incomplete (collected until ~10:00).
      const partial = i === DAYS - 1 ? 0.41 : 1;
      out[i] = Math.round(link.base * shape * weekday * era * noise * partial);
    }
    return out;
  }

  function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function dateAt(i) { const d = new Date(TODAY); d.setDate(d.getDate() - (DAYS - 1 - i)); return d; }
  function dayIndex(date) { return DAYS - 1 - Math.round((TODAY - stripTime(date)) / 864e5); }
  function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  LINKS.forEach((l, i) => { l.series = buildSeries(l, 1000 + i * 97); l.id = i; });

  /* ---------- Dimensions ---------- */
  const DIMS = [
    { key: 'link',     label: 'Link',          group: 'Link',  kind: 'link' },
    { key: 'trigger',  label: 'Trigger',       group: 'Link',  kind: 'trigger' },
    { key: 'campaign', label: 'Campaign',      group: 'UTM parameters', kind: 'link', utm: 'utm_campaign' },
    { key: 'source',   label: 'Source',        group: 'UTM parameters', kind: 'link', utm: 'utm_source' },
    { key: 'medium',   label: 'Medium',        group: 'UTM parameters', kind: 'link', utm: 'utm_medium' },
    { key: 'content',  label: 'Content',       group: 'UTM parameters', kind: 'link', utm: 'utm_content' },
    { key: 'term',     label: 'Term',          group: 'UTM parameters', kind: 'link', utm: 'utm_term' },
    { key: 'referrer', label: 'Referrer',      group: 'Audience', kind: 'attr' },
    { key: 'country',  label: 'Country',       group: 'Audience', kind: 'attr' },
    { key: 'region',   label: 'Region',        group: 'Audience', kind: 'attr' },
    { key: 'city',     label: 'City',          group: 'Audience', kind: 'attr' },
    { key: 'device',   label: 'Device',        group: 'Audience', kind: 'attr' },
    { key: 'browser',  label: 'Browser',       group: 'Audience', kind: 'attr' },
    { key: 'os',       label: 'OS',            group: 'Audience', kind: 'attr' },
  ];
  const DIM = Object.fromEntries(DIMS.map(d => [d.key, d]));

  // Attribute weight table for one link and one part ('link' | 'qr').
  function weights(link, key, part) {
    switch (key) {
      case 'country':  return link.geo;
      case 'region':
      case 'city':     return derive(link.geo, key);
      case 'device':   return part === 'qr' ? QR_DEVICE : link.dev;
      case 'browser':  return BROWSERS;
      case 'os':       return deriveOS(part === 'qr' ? QR_DEVICE : link.dev);
      case 'referrer': return part === 'qr' ? QR_REFERRER : link.ref;
    }
    return {};
  }
  const deriveCache = {};
  function derive(geo, key) {
    const k = key + JSON.stringify(geo);
    if (deriveCache[k]) return deriveCache[k];
    const out = {};
    for (const pl of PLACES) if (geo[pl.cc]) out[pl[key]] = (out[pl[key]] || 0) + geo[pl.cc] * pl.share;
    return (deriveCache[k] = out);
  }
  // Country, region and city filters are nested, so they're applied together per place, not multiplied.
  const GEO = ['country', 'region', 'city'];
  const placeLabel = (pl, key) => key === 'country' ? pl.cc : pl[key];
  // Does value v pass filter f? ops: 'is', 'is not', 'contains' (part of the value, any case; countries match by name too).
  function passes(f, v) {
    let hit;
    if (f.op === 'contains') {
      const t = String(v).toLowerCase(), name = f.dim === 'country' && COUNTRIES[v] ? COUNTRIES[v].name.toLowerCase() : '';
      hit = f.values.some(x => { x = x.toLowerCase(); return t.includes(x) || (name && name.includes(x)); });
    } else hit = f.values.includes(v);
    return f.op === 'is not' ? !hit : hit;
  }
  function geoPlaces(link, geoFilters) {
    return PLACES.filter(pl => link.geo[pl.cc] && geoFilters.every(f => passes(f, placeLabel(pl, f.dim))))
      .map(pl => ({ pl, w: link.geo[pl.cc] * pl.share }));
  }
  // A link's country mix after any country/region/city filters (shares add up to 1).
  function linkCountries(link, filters) {
    const ps = geoPlaces(link, filters.filter(f => GEO.includes(f.dim))), out = {}; let t = 0;
    for (const { pl, w } of ps) { out[pl.cc] = (out[pl.cc] || 0) + w; t += w; }
    for (const k in out) out[k] /= t || 1;
    return out;
  }
  function deriveOS(dev) {
    const out = {};
    for (const [d, w] of Object.entries(dev)) for (const [os, s] of Object.entries(OS_BY_DEVICE[d])) out[os] = (out[os] || 0) + w * s;
    return out;
  }

  // Value of a link-level dimension for one link.
  function linkValue(link, key) {
    if (key === 'link') return link.slug;
    const v = link[key];
    return v === '' || v == null ? '(not set)' : v;
  }

  /* ---------- Query ---------- */
  // range: {start: Date, end: Date} inclusive. trigger: 'all' | 'link' | 'qr'.
  // filters: [{dim, op: 'is' | 'is not', values: [..]}]
  function query(opts) {
    const { range, trigger = 'all', filters = [] } = opts;
    const i0 = clamp(dayIndex(range.start), 0, DAYS - 1);
    const i1 = clamp(dayIndex(range.end), 0, DAYS - 1);
    const linkFilters = filters.filter(f => DIM[f.dim] && DIM[f.dim].kind === 'link');
    const attrFilters = filters.filter(f => DIM[f.dim] && DIM[f.dim].kind === 'attr' && !GEO.includes(f.dim));
    const geoFilters = filters.filter(f => GEO.includes(f.dim));
    const trig = filters.find(f => f.dim === 'trigger');
    let parts = trigger === 'all' ? ['link', 'qr'] : [trigger];
    if (trig) parts = parts.filter(p => passes(trig, p === 'qr' ? 'QR scan' : 'Link click'));

    const rows = [];
    for (const link of LINKS) {
      if (!linkFilters.every(f => passes(f, linkValue(link, f.dim)))) continue;
      const row = { link, clicks: 0, unique: 0, linkClicks: 0, qr: 0, series: [], mult: {} };
      for (const part of parts) {
        // multiplier from attribute filters for this part
        let m = geoFilters.length ? geoPlaces(link, geoFilters).reduce((a, x) => a + x.w, 0) : 1;
        for (const f of attrFilters) {
          const w = weights(link, f.dim, part);
          m *= Object.entries(w).reduce((a, [v, x]) => a + (passes(f, v) ? x : 0), 0);
        }
        row.mult[part] = m;
      }
      for (let i = i0; i <= i1; i++) {
        const base = link.series[i];
        let link_ = 0, qr_ = 0;
        if (parts.includes('link')) link_ = base * (1 - link.qr) * row.mult.link;
        if (parts.includes('qr'))   qr_   = base * link.qr * row.mult.qr;
        row.series.push({ date: dateAt(i), clicks: link_ + qr_, linkClicks: link_, qr: qr_, unique: (link_ + qr_) * link.uniq, partial: i === DAYS - 1 });
      }
      row.linkClicks = sum(row.series, 'linkClicks');
      row.qr = sum(row.series, 'qr');
      row.clicks = row.linkClicks + row.qr;
      row.unique = row.clicks * link.uniq;
      if (row.clicks > 0.5) rows.push(row);
    }
    rows.sort((a, b) => b.clicks - a.clicks);

    const n = i1 - i0 + 1;
    const series = [];
    for (let k = 0; k < n; k++) {
      const p = { date: dateAt(i0 + k), clicks: 0, linkClicks: 0, qr: 0, unique: 0, partial: i0 + k === DAYS - 1 };
      for (const r of rows) { const s = r.series[k]; p.clicks += s.clicks; p.linkClicks += s.linkClicks; p.qr += s.qr; p.unique += s.unique; }
      series.push(p);
    }
    const totals = {
      clicks: sum(rows, 'clicks'), unique: sum(rows, 'unique'), linkClicks: sum(rows, 'linkClicks'), qr: sum(rows, 'qr'), activeLinks: rows.length,
    };

    function breakdown(key) {
      const d = DIM[key];
      const agg = {};
      if (d.kind === 'link') {
        for (const r of rows) { const v = linkValue(r.link, key); agg[v] = (agg[v] || 0) + r.clicks; }
      } else if (key === 'trigger') {
        agg['Link click'] = totals.linkClicks; agg['QR scan'] = totals.qr;
      } else if (GEO.includes(key)) {
        for (const r of rows) {
          const ps = geoPlaces(r.link, geoFilters); const norm = ps.reduce((a, x) => a + x.w, 0) || 1;
          for (const { pl, w } of ps) { const v = placeLabel(pl, key); agg[v] = (agg[v] || 0) + r.clicks * w / norm; }
        }
      } else {
        const f = attrFilters.find(x => x.dim === key);
        for (const r of rows) for (const part of parts) {
          const w = weights(r.link, key, part);
          const partClicks = part === 'qr' ? r.qr : r.linkClicks;
          if (!partClicks) continue;
          let allowed = w, norm = 1;
          if (f) {
            allowed = Object.fromEntries(Object.entries(w).filter(([v]) => passes(f, v)));
            norm = Object.values(allowed).reduce((a, b) => a + b, 0) || 1;
          }
          for (const [v, wt] of Object.entries(allowed)) agg[v] = (agg[v] || 0) + partClicks * wt / norm;
        }
      }
      const total = totals.clicks || 1;
      return Object.entries(agg).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value, share: value / total, code: key === 'country' ? label : PLACE[key] ? PLACE[key][label].cc : null }));
    }

    return { rows, series, totals, breakdown, range: { start: dateAt(i0), end: dateAt(i1) }, days: n };
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sum(arr, k) { let t = 0; for (const x of arr) t += x[k]; return t; }

  // The period of the same length immediately before `range`.
  function priorRange(range) {
    const days = Math.round((stripTime(range.end) - stripTime(range.start)) / 864e5) + 1;
    const end = new Date(range.start); end.setDate(end.getDate() - 1);
    const start = new Date(end); start.setDate(start.getDate() - days + 1);
    return { start, end };
  }

  // Distinct values for a dimension (for the filter picker), with click counts in the given query context.
  function valuesFor(key, ctx) {
    const q = query({ range: ctx.range, trigger: ctx.trigger, filters: ctx.filters.filter(f => f.dim !== key) });
    return q.breakdown(key);
  }

  window.DATA = { TODAY, DAYS, LINKS, COUNTRIES, PLACE, linkCountries, DIMS, DIM, query, priorRange, valuesFor, linkValue, stripTime };
})();
