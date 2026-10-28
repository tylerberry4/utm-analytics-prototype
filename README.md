# UTM Analytics prototype v4

*Built 2026-10-28 by Claude from the Figma concept (pass 2). Plain HTML/CSS/JS, no build step.*

**Open:** double-click `index.html`, or serve the folder (`python3 -m http.server`) for the fonts to load reliably. **Live test URL:** https://tylerberry4.github.io/utm-analytics-prototype/ (GitHub Pages from the public repo `tylerberry4/utm-analytics-prototype`; to update, copy this folder's files into that repo and push). Claude copy: https://claude.ai/artifact/TEbiYDnMRJFxHgeUvHiAGT

## Files

| File | What |
| --- | --- |
| `index.html` | Shell markup (sidebar, top bar) and script tags |
| `styles.css` | All styles. Tokens at the top: UTM shell tokens from `_ds`, then analytics tokens. |
| `app.js` | State → render. Toolbar, filter menu, value picker, date picker, KPI/chart, links table, cards, map, link detail, modals, toasts |
| `data.js` | Synthetic dataset (14 links, 150 days) and `DATA.query()` which computes every number from range + trigger + filters |
| `map-data.js` | World outlines (Natural Earth 110m, simplified) |
| `assets/logo.png` | Copy of the workspace logo |

## What works

All / Links / QR toggle; Filter (grouped dimensions → value picker with counts, search, is / is not); click-to-filter on card rows, map countries and UTM chips; chip edit / remove / clear; date presets (keyboard D E W T M L Q), custom range on a two-month calendar, compare toggle; KPI tiles switch the chart; chart hover; Day / Week; links table sort, show all, row → link detail (breadcrumb back); link detail copy buttons and QR modal; card Expand (full list + search); CSV export; Tips & shortcuts in the ⋮ menu and Need Help button; "4 min ago" status with full text on hover. "Today" is fixed at 2026-10-28.

On phones the sidebar becomes a hamburger drawer, the trigger toggle goes full width, the links table collapses to link + clicks, and popovers become near-full-width sheets.

## Not wired

Sidebar sections other than Analytics, Manage / user menus, Edit link, Open in Links table, Pro date ranges.
