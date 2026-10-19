/**
 * audit-colour.cjs
 * Analyzes the share of saturated pixels per screen.
 * Rule: Monochrome-first — >= 90% pixels neutral. Flag anything with saturated pixel share > 8%.
 */
const puppeteer = require('puppeteer');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const ROUTES = [
  { url: 'http://localhost:5173', name: 'User Login' },
  { url: 'http://localhost:5173/chat', name: 'User Chat' },
  { url: 'http://localhost:5174', name: 'Supervisor Command Center' },
];

async function measureColorSaturation(page) {
  return await page.evaluate(async () => {
    // Render current document into a canvas using html2canvas-like sample or screenshot
    // For pure in-browser accuracy, sample 1000 random DOM coordinates
    const samples = 1500;
    let saturatedCount = 0;

    for (let i = 0; i < samples; i++) {
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * window.innerHeight);

      const el = document.elementFromPoint(x, y);
      if (!el) continue;

      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;

      function getRgb(str) {
        const m = str?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return null;
        return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
      }

      function isSaturated(rgb) {
        if (!rgb) return false;
        const [r, g, b] = rgb;
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const l = (max + min) / 2;
        if (max === min) return false;
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        // Exclude near-black/near-white where saturation calculation is noisy
        if (l < 0.08 || l > 0.95) return false;
        return s > 0.40; // More than 40% saturation
      }

      if (isSaturated(getRgb(bg)) || isSaturated(getRgb(color))) {
        saturatedCount++;
      }
    }

    return (saturatedCount / samples) * 100;
  });
}

(async () => {
  console.log('--- AUDIT COLOUR: Measuring saturated pixel share ---');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const route of ROUTES) {
      for (const theme of ['dark', 'light']) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        if (route.url.includes('/chat')) {
          await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 15000 });
          await page.evaluate(async () => {
            try {
              const r = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'alice', password: 'password123' }),
              });
              const data = await r.json();
              if (data.access_token) localStorage.setItem('pqc_token', data.access_token);
            } catch (e) {}
          });
        }

        await page.goto(route.url, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          localStorage.setItem('pqc-theme', t);
        }, theme);
        await new Promise((r) => setTimeout(r, 600));

        const satPercentage = await measureColorSaturation(page);
        const passed = satPercentage <= 8.0;

        console.log(
          `[${passed ? 'PASS' : 'WARN'}] ${route.name} (${theme}): ${satPercentage.toFixed(1)}% saturated pixels (Target: <= 8.0%)`
        );

        await page.close();
      }
    }
  } catch (err) {
    console.error('Audit failed:', err.message);
  } finally {
    if (browser) await browser.close();
  }
})();
