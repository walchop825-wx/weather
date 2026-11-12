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
- Live data sources: Open-Meteo, NWS api.weather.gov, IEM, NWS WPC map services, RainViewer, EUMETSAT, MeteoAlarm. Anything that can't load falls back to labeled sample data.
- Saved shows live in localStorage key `wgs-show-v2`. New default scenes for existing users go in through a one-time `show.settings.<flag>` migration.
