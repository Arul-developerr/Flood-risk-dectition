# தமிழ்நாடு வெள்ள வரைபடம் · Tamil Nadu Flood Atlas

A Tamil-first, responsive flood information **interface prototype** for Tamil Nadu. It combines a geographic state outline with an interactive layered 3D view, district browsing, sample charts, alert workflows, community notes, resources, and preparedness guidance. The UI can switch between Tamil and English.

> **Demonstration only.** The state outline and district names are real. District markers are approximate. Every rainfall reading, river level, risk score, alert, station, report, resource, 3D elevation effect and connector is illustrative. There are no live feeds, predictions, official warnings, or connected emergency services. Follow official advice in an emergency.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To build and inspect the production bundle:

```bash
npm run build
npm run preview
```

`npm run build` includes a TypeScript check. `npm run verify` runs browser checks with Playwright Chromium against a temporary preview server on port 5191 and writes screenshots/results to `output/playwright/`. Install Chromium with `npx playwright install chromium` if needed. `npm run lint` is present, but this package does not include ESLint, so it requires separate setup.

## Screens

| Route | Purpose |
| --- | --- |
| `/` | District overview, 3D state view, sample indicators and recent activity |
| `/risk` | State map with district markers, filters, layers and detail panel |
| `/prediction` | Authored district score and separate sample trend analysis |
| `/rainfall` | Synthetic rainfall series and totals |
| `/river` | Synthetic river-level series |
| `/stations` | Fictional representative gauge directory |
| `/alerts` | Sample alert records with browser-local review status |
| `/reports` | Sample notes and a browser-local practice report form |
| `/resources` | Fictional support-resource directory |
| `/preparedness` | General preparation checklists and kit guidance |
| `/methodology` | Data provenance, score method and limitations |
| `/settings` | Appearance, units, density, motion and local-data controls |

The selected district follows the user across pages. Tamil is the default language; the top bar has a Tamil/English switch. Major navigation, page introductions and map controls are translated. Some detailed sample records and secondary explanatory copy are currently in English.

## Map and 3D interaction

`src/data/tamilNaduBoundary.ts` contains a simplified Tamil Nadu state outline extracted from the public-domain [Natural Earth admin-1 GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_1_states_provinces.geojson). The ten district names are real and can be checked against the [Tamil Nadu district portal](https://tndistricts.nic.in/). Marker positions are approximate point placements; the app does **not** include official district polygons.

`TerrainScene` draws the outline as an SVG face and a stack of extruded SVG layers using CSS 3D transforms. Decorative contours, district links and depth are designed for visualization; they are not a digital elevation model or river network. The scene supports drag rotation/tilt, marker selection, zoom, reset, and optional contour, link and grid layers. Focus the map and use left/right arrows to rotate, `+`/`-` to zoom, or `Home` to reset. Motion follows the reduced-motion setting.

## Data and storage

The fixed reference snapshot is **12 June 2025, 09:30**. Sample records live in `src/data/`; shared selectors keep charts and summary cards consistent. Regional scores are authored demonstration constants, not calibrated probabilities. The separate trend curve is computed from synthetic series and does not create the authored score.

There is no backend. Language, display preferences, alert status, checklist progress and user-entered practice reports are stored in this browser's `localStorage`. Reports are not sent to an organization. Settings can clear local demo data. Unit changes convert the displayed sample values.

## Stack and structure

- React 18, TypeScript, Vite and React Router
- Tailwind CSS and Motion for the interface
- Recharts for charts, Lucide for icons
- SVG and CSS 3D for the state visualization; no WebGL or live basemap dependency

```text
src/app/                 Shared state, locale and navigation
src/components/map/      Interactive state view and controls
src/components/charts/   Chart components
src/components/layout/   App shell
src/components/ui/       Reusable components
src/data/                State boundary, district samples, series and selectors
src/pages/               Twelve routes
src/styles/              Atlas styles and Tamil Nadu theme
scripts/verify.mjs       Production browser verification
```

The default Royal Burgundy palette uses Midnight Burgundy `#240D19`, Royal Wine `#401629`, Saffron Gold `#F5B544`, Coral Red `#FF6B55`, Warm Ivory `#FFF1D6`, and Muted Mauve `#765265`. Secondary text uses a lighter mauve tint for legibility. An optional Ivory Daylight appearance is available in Settings. The interface also uses Tamil typography, clear data-provenance labels, responsive layouts and keyboard-accessible controls.
