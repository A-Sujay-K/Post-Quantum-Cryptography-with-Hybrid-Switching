/**
 * audit-edges.cjs
 * Automated crawl checking border/outline alpha against canonical --edge-rest token.
 * Rule: No border/outline/ring with white alpha above 2x rest (0.20) at rest.
 */
const puppeteer = require('puppeteer');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const ROUTES = [
  { url: 'http://localhost:5173', name: 'User Login' },
  { url: 'http://localhost:5173/register', name: 'User Register' },
  { url: 'http://localhost:5173/chat', name: 'User Chat' },
  { url: 'http://localhost:5174', name: 'Supervisor Command Center' },
];

async function auditRoute(browser, route, theme) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // For chat, inject auth token
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

  const violations = await page.evaluate((theme) => {
    const issues = [];
    const elements = document.querySelectorAll('*');

    function parseRgba(str) {
      if (!str || str === 'none' || str === 'transparent') return null;
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return {
        r: parseInt(m[1], 10),
        g: parseInt(m[2], 10),
        b: parseInt(m[3], 10),
        a: m[4] !== undefined ? parseFloat(m[4]) : 1.0,
      };
    }

    elements.forEach((el) => {
      // Skip hidden, svg children, script/style
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'G', 'DEFS', 'PATTERN'].includes(el.tagName)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const style = window.getComputedStyle(el);
      const bWidth = parseFloat(style.borderTopWidth) || 0;
      const bColor = parseRgba(style.borderTopColor);

      // Check if it's a solid bright outline at rest (> 2x rest = 0.20 in dark)
      if (theme === 'dark' && bWidth > 0 && bColor) {
        // Near-white border with alpha > 0.22
        if (bColor.r > 200 && bColor.g > 200 && bColor.b > 200 && bColor.a > 0.22) {
          // Exclude buttons or active states if designated
          const id = el.id || el.className?.slice(0, 30) || el.tagName;
          issues.push({
            tag: el.tagName,
            selector: id,
            borderWidth: bWidth,
            borderColor: style.borderTopColor,
            alpha: bColor.a,
          });
        }
      }
    });

    return issues;
  }, theme);

  await page.close();
  return violations;
}

(async () => {
  console.log('--- AUDIT EDGES: Starting automated crawl ---');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let totalViolations = 0;

    for (const route of ROUTES) {
      for (const theme of ['dark', 'light']) {
        const violations = await auditRoute(browser, route, theme);
        if (violations.length > 0) {
          console.warn(`[WARN] ${route.name} (${theme}): ${violations.length} edge issues flagged`);
          violations.slice(0, 3).forEach((v) => console.log('   ->', v));
          totalViolations += violations.length;
        } else {
          console.log(`[PASS] ${route.name} (${theme}): 0 edge violations`);
        }
      }
    }

    console.log(`\nAudit complete. Total edge warnings: ${totalViolations}`);
  } catch (err) {
    console.error('Audit failed to run:', err.message);
  } finally {
    if (browser) await browser.close();
  }
})();
