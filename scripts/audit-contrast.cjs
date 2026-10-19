/**
 * audit-contrast.cjs
 * WCAG 2.2 AA Contrast Sampling Script
 * Samples 20 critical text elements per screen in both themes.
 * Thresholds: >= 4.5:1 for normal text, >= 3.0:1 for large text (>= 24px or >= 18.5px bold).
 */
const puppeteer = require('puppeteer');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sRgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
}

function contrastRatio(lum1, lum2) {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

const SCREENS = [
  { url: 'http://localhost:5173/login', name: 'User Login' },
  { url: 'http://localhost:5173/chat', name: 'User Chat' },
  { url: 'http://localhost:5174', name: 'Supervisor Command Center' },
];

async function auditScreenContrast(page, screenName, theme) {
  console.log(`\nEvaluating contrast for ${screenName} (${theme})...`);

  const results = await page.evaluate((theme) => {
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

    function sRgbToLin(c) {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    function calcLum(r, g, b) {
      return 0.2126 * sRgbToLin(r) + 0.7152 * sRgbToLin(g) + 0.0722 * sRgbToLin(b);
    }

    // Default base background color based on theme
    const baseBg = theme === 'dark' ? { r: 18, g: 15, b: 14 } : { r: 247, g: 243, b: 238 };

    // Traverse upwards to composite background color
    function getEffectiveBg(el) {
      let cur = el;
      const layers = [];
      while (cur && cur !== document.documentElement) {
        const style = window.getComputedStyle(cur);
        const bg = parseRgba(style.backgroundColor);
        if (bg && bg.a > 0.02) {
          layers.push(bg);
        }
        cur = cur.parentElement;
      }

      // Blend from base upwards
      let composite = { ...baseBg };
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        composite = {
          r: Math.round(l.r * l.a + composite.r * (1 - l.a)),
          g: Math.round(l.g * l.a + composite.g * (1 - l.a)),
          b: Math.round(l.b * l.a + composite.b * (1 - l.a)),
        };
      }
      return composite;
    }

    // Find visible text elements
    const candidates = [];
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, button, a, label, div, input'));

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || rect.top > 900) continue;

      // Must have direct non-empty text content or input placeholder/value
      const text = el.tagName === 'INPUT' 
        ? (el.placeholder || el.value || '') 
        : Array.from(el.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join(' ');

      if (!text || text.length < 2) continue;

      const style = window.getComputedStyle(el);
      const color = parseRgba(style.color);
      if (!color || color.a < 0.1) continue;

      const fontSize = parseFloat(style.fontSize) || 14;
      const fontWeight = parseInt(style.fontWeight, 10) || 400;
      const isLarge = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 600);
      const targetRatio = isLarge ? 3.0 : 4.5;

      const bg = getEffectiveBg(el);
      const textLum = calcLum(color.r, color.g, color.b);
      const bgLum = calcLum(bg.r, bg.g, bg.b);

      const maxLum = Math.max(textLum, bgLum);
      const minLum = Math.min(textLum, bgLum);
      const ratio = (maxLum + 0.05) / (minLum + 0.05);

      candidates.push({
        text: text.slice(0, 32),
        tag: el.tagName.toLowerCase(),
        fontSize: Math.round(fontSize),
        isLarge,
        targetRatio,
        actualRatio: parseFloat(ratio.toFixed(2)),
        pass: ratio >= targetRatio,
      });

      if (candidates.length >= 25) break;
    }

    return candidates.slice(0, 20);
  }, theme);

  let passedCount = 0;
  for (const item of results) {
    const status = item.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`  [${status}] "${item.text}" (${item.fontSize}px) -> ${item.actualRatio}:1 (Target: ${item.targetRatio}:1)`);
    if (item.pass) passedCount++;
  }

  const passRate = (passedCount / results.length) * 100;
  console.log(`Pass rate: ${passedCount}/${results.length} (${passRate.toFixed(1)}%)`);
  return { screenName, theme, total: results.length, passed: passedCount, passRate };
}

(async () => {
  console.log('--- STARTING WCAG 2.2 AA CONTRAST AUDIT ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const overallResults = [];

  try {
    for (const screen of SCREENS) {
      for (const theme of ['dark', 'light']) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        if (screen.url.includes('/chat')) {
          await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
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

        await page.goto(screen.url, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          localStorage.setItem('pqc-theme', t);
        }, theme);
        await new Promise((r) => setTimeout(r, 600));

        const res = await auditScreenContrast(page, screen.name, theme);
        overallResults.push(res);
        await page.close();
      }
    }

    console.log('\n--- CONTRAST AUDIT SUMMARY ---');
    let allPassed = true;
    for (const r of overallResults) {
      const ok = r.passed === r.total;
      if (!ok) allPassed = false;
      console.log(`[${ok ? 'PASS' : 'WARN'}] ${r.screenName} (${r.theme}): ${r.passed}/${r.total} elements met WCAG 2.2 AA`);
    }

    if (allPassed) {
      console.log('\nALL SCREENS FULLY SATISFY WCAG 2.2 AA CONTRAST TARGETS.');
    } else {
      console.log('\nAudit complete with warnings.');
    }
  } catch (e) {
    console.error('Audit failed with error:', e);
  } finally {
    await browser.close();
  }
})();
