# Tamil Nadu Flood Atlas — implementation audit

## Current scope

The application has twelve React routes with shared district selection, Tamil-first navigation, an English switch, a Royal Burgundy visual system, responsive layouts, local preferences and practice workflows. The state view uses a simplified Natural Earth Tamil Nadu admin-1 outline with SVG layers transformed in CSS 3D. Ten real district names are used for sample markers.

## Data integrity

- The state outline is geographic source data. Marker points are approximate, and district boundaries are not shown.
- Depth, contours and district links are visual styling, not surveyed elevation, drainage or forecast data.
- All numerical readings, scores, alerts, stations, reports and resources are synthetic. The fixed reference date is 12 June 2025, 09:30.
- Risk scores are authored demonstration values. They are not a probability or safety assessment.
- Form entries, checklist state, alert review status and settings stay in the browser. No backend or agency receives them.
- The Methodology route and global footer disclose these limitations.

## Verification

Run `npm run build`, then `npm run verify`. The verification script tests all twelve routes at 1440, 1280, 768, 390 and 320px, including horizontal overflow and demo disclosures. It checks the real outline path, ten markers, map zoom/rotation/reset/keyboard operation, district selection across navigation, Tamil/English switching, Tamil district search and layer toggling. Screenshots and JSON results are written under `output/playwright/`.

## Remaining product limits

This is an interface demonstration. It has no operational monitoring, official warning integration, district polygons, true elevation model or validated flood prediction. Tamil covers primary navigation and map workflows; secondary explanations and sample record text are partly English. These limits must be addressed before considering any real-world public use.
