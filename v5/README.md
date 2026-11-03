# UTM.io prototype v5: platform re-org (navigation + where things live)

*Built 2026-11-03 by Claude as a **copy of Prototype v4** (`../Prototype v4/` is untouched and still live at its old URL). Everything below the "v5 changes" section is inherited from v4.*

**Open:** double-click `index.html`, or serve the folder (`python3 -m http.server`). **Live test URL:** https://tylerberry4.github.io/utm-analytics-prototype/v5/ (the `v5/` subfolder of the same GitHub Pages repo; v4 stays at the repo root). Plan and rationale: `../../Projects/Platform IA/Overview.md`.

## v5 changes (2026-11-03)

- **No top bar on desktop.** Its contents moved: workspace switcher stays top-left; Chrome extension, Help and the account menu sit at the bottom of the sidebar. Phones keep a slim bar with the hamburger and page title.
- **Sidebar in three groups,** same items and order as before: **Work** (Links, QR codes, Analytics), **Convention** (Templates, Parameters, Attributes, Rules), **Workspace** (Members, Shorteners, Settings). Collapsed, the group labels become thin dividers.
- **Two named scopes.** A small line above every page title says *Workspace · Acme Marketing* or *Account · applies to all 3 workspaces*.
- **Account settings replace the "Manage" dropdown.** Reached from the workspace switcher or the account menu; the sidebar swaps to Account items with "Back to Acme Marketing" on top: Workspaces, Members, **Shared library** (Parameters / Templates / Attributes tabs, with "Used in N workspaces"), Link shorteners (domains + which workspaces may use them), Integrations (Apps / API keys / Zapier templates as tabs), Security (SSO, 2FA), Plan & billing.
- **Relationships shown inline.** "Shared" tags on Medium/Source (Parameters board), Paid social / Organic social / Paid search (Templates) and shared Attributes and Rules; clicking one opens the Shared library. Rules lists what each rule acts on (click to open that parameter) with **Preview in builder**.
- **New pages (light, example data):** Attributes, Rules, Members, Workspace settings (absorbs QR design defaults), and the seven Account pages. Edit/add actions show "outside this prototype" toasts.
- Code: shell markup in `index.html`; the v5 block in `app.js` starts at "v5: two scopes"; styles at the end of `styles.css` ("v5 shell").

## Files

| File | What |
| --- | --- |
| `index.html` | Shell markup (sidebar, top bar) and script tags |
| `styles.css` | All styles. Tokens at the top: UTM shell tokens from `_ds`, then analytics tokens. |
| `app.js` | State → render. Toolbar, filter menu, value picker, date picker, KPI/chart, links table, cards, map, link detail, **Links page** (search, group, sort, bulk bar), modals, toasts |
| `data.js` | Synthetic dataset (14 links, 150 days) and `DATA.query()` which computes every number from range + trigger + filters |
| `map-data.js` | World outlines (Natural Earth 110m, simplified) |
| `assets/logo.png` | Copy of the workspace logo |

## What works

All / Links / QR toggle; Filter (grouped dimensions → value picker with counts, search, is / is not); click-to-filter on card rows, map countries and UTM chips; chip edit / remove / clear; date presets (keyboard D E W T M L Q), custom range on a two-month calendar, compare toggle; KPI tiles switch the chart; chart hover; Day / Week; links table sort, show all, row → link detail (breadcrumb back); link detail copy buttons and QR modal; card Expand (full list + search); CSV export; Tips & shortcuts in the ⋮ menu and Need Help button; "4 min ago" status with full text on hover. "Today" is fixed at 2026-10-28.

On phones the sidebar becomes a hamburger drawer, the trigger toggle goes full width, the links table collapses to link + clicks, and popovers become near-full-width sheets.

## Links page (added 2026-10-28)

`#links`, also via the sidebar. A redesign of the current Links table in the analytics design language: page header (count, Import CSV, Create link), search + the **same Filter** as Analytics, Group by (campaign / source / medium / created by / template), Sort, 56px rows with type icon, tags, destination, campaign chip (click to filter), lifetime clicks + 30-day sparkline and change, creator avatar, template pill, hover actions (copy, QR, analytics, ⋮ menu), tick boxes with a floating bulk bar (copy, export, tag, archive, delete with confirm). Row click opens the link's analytics page; the breadcrumb returns to Links. "Open in Links table" on the dashboard opens Links with the current filters applied.

## QR codes, Templates, Link shorteners (added 2026-11-03)

Three more sidebar sections restyled from the live app screenshots (`../../Screenshot 2026-11-03 *.png`) into the same page language: page header with count + primary action, search + sort toolbar, 56px rows, hover actions, ⋮ menus, modals.

- **QR codes** (`#qr`): every link that has a code. Thumbnail drawn in its design (Default / Acme brand / Dark), link title + short → destination, campaign chip (click to filter), lifetime scans with a 30-day amber sparkline, creator, design pill with QR share of clicks. Row click opens the QR preview/download modal. Shares the Analytics **Filter** and chips. Tick rows → Download PNGs / Copy / Export / Change design / Delete. "QR designs" opens the design templates grid.
- **Templates** (`#templates`): 8 UTM templates with their parameter defaults as chips; **dashed chips are `{{placeholders}}` asked for in the link builder**. "N links" opens the Links page searched for that template. Row click opens the template with an example URL, "View links", "Build a link".
- **Link shorteners** (`#shorteners`): utm.io, acme.co (default), go.acme.com (Needs DNS → CNAME instructions modal), bit.ly. Links/clicks per domain from the dataset. On/Off switch hides a domain from the builder without breaking links; Remove warns when links use it. "Add shortener" modal (custom domain or Bitly) adds a pending row and shows the DNS record.

## Parameters (added 2026-11-03, reworked into a board the same day)

`#parameters`. Research: `../../Research/Parameters Benchmark.md`; live board screenshots in `../../Research/`.

- **Board (default):** one column per parameter in builder order (left to right). Header: colored icon, name + `utm_` key (click to edit), value count, ⋮ (edit, move earlier/later, paste a list, export, delete custom), rules (Required, lock = list only, aa = lowercase), "by medium" when grouped, "Hidden in builder" when a rule hides it. Rows: value, pretty name, tag (New / Unused / Check / Duplicate? / Not saved, striped), links count. "+ Add value" at the bottom of each column (comma list adds several); dashed "+ Add parameter" column at the end; search filters every column.
- **Groupings on the board:** faint lines link a value to the values it's grouped with in the next column. Hover traces the whole chain. Click a value: the top bar says what it's offered with / narrows, with Show links, Edit and Delete; tick circles appear in neighboring columns to group or ungroup. Esc or × finishes. Any two neighboring parameters can be grouped (seeded: medium → source).
- **List view:** the earlier master-detail page (rail, header with rules, values table with usage, tags, bulk merge/export/delete). The Groupings tab was removed.
- **Removed 2026-11-03:** the floating Need Help bubble (all pages) and "See in builder".
- Data: values and groupings are seeded in `app.js` (`PARAM_SEED`); usage comes from `DATA.LINKS`. Edits are in-memory only.

## Link builder (added 2026-11-03)

A full page (`#create-link`) with a breadcrumb back to where it was opened from; the preview and the Save bar stay pinned while scrolling. Open from Links → **Create link**, a link page → **Edit link**, row menus (Edit, Duplicate), Templates → **Build a link with it**, or the top bar's **Download Chrome Extension** (extension preview, which stays a popup). Research: `../../Research/Link Builder Benchmark.md`.

- Five steps: destination (one or several URLs, https/http picker; pasted UTM tags can be moved into fields) → template (pick several to bulk create) → tag it (required tags and whatever the template sets or asks for, in Parameters order, medium → source side by side; every other parameter under "Optional parameters", split UTM / Custom; field icons match the Parameters rail; hidden ones left out) → notes (optional, not in the URL) → short link & QR (domain + suggested ending, QR on by default with a design picker, smart routing row). "Don't shorten" turns QR off with a note. Example attributes were removed 2026-11-03.
- Fields read Parameters and Rules: saved values with pretty names and usage, groupings narrow lists, dropdown-only refuses typed values (admin can add), lowercase/spaces cleaned with a note. Checks run when you leave a field and on Save.
- Right panel: short link, full URL as clickable tags, GA4 channel hint, QR thumbnail, checklist. Save is always enabled; ⌘↵ saves. Success screen: copy, QR download, "Create another like this".
- Saved links are not added to the Links table.

## Not wired

Attributes, Rules, Workspace members, Support; Manage / user menus; Import link; template and QR design editors; column settings; archive; Pro date ranges.
