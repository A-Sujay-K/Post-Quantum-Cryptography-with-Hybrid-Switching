const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: '360', width: 360, height: 780, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: false },
  { name: '1280', width: 1280, height: 800, mobile: false },
  { name: '1920', width: 1920, height: 1080, mobile: false },
];

async function measureTitles() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9298', '--user-data-dir=C:\\Users\\asuja\\AppData\\Local\\Temp\\c_title_calc', '--disable-gpu', '--no-sandbox', 'about:blank'
  ]);
  let wsUrl = null;
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9298/json/list');
      const pages = await res.json();
      if (pages[0]?.webSocketDebuggerUrl) { wsUrl = pages[0].webSocketDebuggerUrl; break; }
    } catch(e){}
    await new Promise(r => setTimeout(r, 150));
  }
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2000));

  const measurements = {};

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await new Promise(r => setTimeout(r, 300));

    // Measure exact advance width ratio of Doto
    const res = await send('Runtime.evaluate', {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '900 100px Doto';
        
        const line1 = 'ARE YOU READY FOR';
        const line2 = 'THE QUANTUM FUTURE?';
        const m1 = ctx.measureText(line1).width;
        const m2 = ctx.measureText(line2).width; // longer line (19 chars)

        // Mobile lines
        const mobLines = ['ARE YOU', 'READY FOR', 'THE QUANTUM', 'FUTURE?'];
        const mobWidths = mobLines.map(l => ({ line: l, width: ctx.measureText(l).width }));
        const maxMob = Math.max(...mobWidths.map(w => w.width));

        // Available container width on page
        // Page padding: p-6 (24px each side = 48px) on mobile, sm:p-8 (32px each side = 64px), md:p-10 (40px each side = 80px)
        let pad = 48;
        if (${vp.width} >= 1024) pad = 80;
        else if (${vp.width} >= 640) pad = 64;

        const contentW = ${vp.width} - pad;

        // If desktop/tablet (2 lines): target line2 to fill contentW
        // font_size * (m2 / 100) = contentW  => font_size = contentW / (m2 / 100)
        const desktopFontSize = contentW / (m2 / 100);

        // If mobile (4 lines): target maxMob to fill contentW
        const mobileFontSize = contentW / (maxMob / 100);

        return {
          viewportW: ${vp.width},
          contentW,
          pad,
          ratioLine2At100px: m2,
          desktopFontSize,
          mobileFontSize,
          mobWidths
        };
      })()`
    });
    measurements[vp.name] = res.result.value;
  }

  console.log('Measurements:', JSON.stringify(measurements, null, 2));

  fs.writeFileSync(
    'C:/Users/asuja/.gemini/antigravity/scratch/pqc-secure-comm/docs/audit/fix/title_measurements.json',
    JSON.stringify(measurements, null, 2)
  );

  ws.close();
  chrome.kill();
  process.exit(0);
}
measureTitles().catch(console.error);
