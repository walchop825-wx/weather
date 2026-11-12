// Loads the studio in headless Chromium, renders every scene type, and fails on any script error.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const url = pathToFileURL(resolve('index.html')).href;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push('Page error: ' + e.message));
await page.goto(url);
await page.waitForTimeout(3000);

const result = await page.evaluate(() => {
  const out = [];
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const extra = { futuremap: [{ v: 'temp' }, { v: 'rain' }, { v: 'snow' }, { v: 'ptype' }, { v: 'wind' }], forecast7: [{}, { mode: 'custom' }] };
  for (const type of Object.keys(TYPE_NAMES)) {
    for (const o of (extra[type] || [{}])) {
      for (const t of [0.4, 2, 99]) {
        try { const sc = newScene(type, Object.assign({ region: 'pa', city: 'harrisburg' }, o)); if (sc.mode === 'custom') sc.custom = customFromModel(sc); renderScene(g, sc, t, {}); drawChrome(g, t); }
        catch (e) { out.push(`${type} ${JSON.stringify(o)} at ${t}s: ${e.message}`); }
      }
    }
  }
  try { show.scenes.forEach((s, i) => { goTo(i); renderInspector(); }); } catch (e) { out.push('Scene panel: ' + e.message); }
  return out;
});
errors.push(...result);
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('All scene types rendered without errors.');
