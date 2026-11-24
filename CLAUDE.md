# Weather Graphics Studio

Broadcast-style weather graphics app for PA, the Northeast, the US and Europe. Owner: Wally.

## Layout
- `index.html` is the whole app: one file, one `<script>`, drawing to a 1920x1080 canvas.
- GitHub Pages serves `index.html` from the `main` branch root.

## Working rules
- After every change Wally asks for, commit and push to `main` so the live site updates.
- Keep it a single self-contained file. No build step.
- Syntax check before committing: extract the script and run `node --check`.
- Render changed scenes headless (Playwright) and look at them before pushing.
- Live data sources: Open-Meteo (forecast, 15-minute, ensemble, single runs, archive and air quality), ACIS station records, NWS api.weather.gov, IEM (storm reports, snow reports, SPC watches and MDs), NOAA map services (WPC, SPC, NHC, CPC hazards and 6-10 day to 3-month outlooks, MRMS QPE, NOHRSC), NWS Damage Assessment Toolkit, U.S. Drought Monitor (ArcGIS), Esri World Imagery, RainViewer, EUMETSAT, MeteoAlarm, USGS earthquake feeds and ShakeMaps, NOAA SWPC (Kp and aurora), NOAA NDGD smoke forecast. Anything that can't load falls back to labeled sample data or a clear on-screen message.
- Open-Meteo budget (free plan, about 10,000 location-calls a day): current and daily are separate requests (10 variables or fewer each). Current: cities on screen (`usedCities()`) every 15 min, other cities near scene maps (`hotCities()`) hourly, the rest every 6 h. Daily: 3 h near maps, 6 h elsewhere. Hourly forecasts every hour, models every 3 h. Extra models (NBM, Canadian, UKMO, ECMWF AI; `x:1` in MODELS) load only for cities a scene uses them for (`xNeed()`). Auto refresh never forces. After a 429, no Open-Meteo calls for an hour (`C.block`). Only one tab per browser fetches (Web Locks `wgs-om-leader`); others read the shared cache. An optional paid API key (localStorage `wgs-om-key`, never in show files) switches requests to `customer-*.open-meteo.com` with `apikey=`.
- Phone remote relays commands through ntfy.sh (topic `wgs-<code>`); the studio only acts on messages marked from the remote.
- Saved shows live in localStorage key `wgs-show-v2`. New default scenes for existing users go in through a one-time `show.settings.<flag>` migration. New devices start with an empty show (`blankShow()`, all migration flags set); Show > Reset to starter rundown loads the sample show.

## Tests
- `tests/smoke.mjs` renders every scene type in headless Chromium and fails on any script error. GitHub runs it on every push (`.github/workflows/smoke.yml`).
- Run locally: `npm install --no-save playwright && npx playwright install chromium && node tests/smoke.mjs` (set `CHROME=/path/to/chrome` to use an installed browser).
- Bump the build tag in the status bar (`id="buildTag"`) with every change. The studio compares it with the live site to show the reload notice.
