/**
 * GlyphAtlas.js
 * Pre-renders Geist Mono glyphs ('0', '1', '0/1') with additive glow halos
 * into an offscreen canvas atlas so particle rendering requires zero font layout or shadowBlur per frame.
 */

export class GlyphAtlas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.atlasSize = 256;
    this.cellSize = 48; // Size of each sprite cell in atlas
    this.sprites = {}; // name -> { x, y, width, height, anchorX, anchorY }
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.atlasSize;
    this.canvas.height = this.atlasSize;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: false });

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.atlasSize, this.atlasSize);

    // Font definitions: Geist Mono with fallback
    const fontSize = 16;
    ctx.font = `600 ${fontSize}px "Geist Mono", monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sprite palette:
    // - warm: Neutral off-white (wires)
    // - teal: PQC data (column)
    // - amber: QKD key pulses
    // - burst: Dual-key combined (teal + amber glow)
    const variants = [
      { name: '0_warm', text: '0', col: '#f0e8dc', glow: 'rgba(240, 232, 220, 0.4)' },
      { name: '1_warm', text: '1', col: '#f0e8dc', glow: 'rgba(240, 232, 220, 0.4)' },
      { name: '0_teal', text: '0', col: '#5eead4', glow: 'rgba(94, 234, 212, 0.6)' },
      { name: '1_teal', text: '1', col: '#5eead4', glow: 'rgba(94, 234, 212, 0.6)' },
      { name: '0_amber', text: '0', col: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)' },
      { name: '1_amber', text: '1', col: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)' },
      { name: 'psi_teal', text: '0/1', col: '#5eead4', glow: 'rgba(94, 234, 212, 0.7)' },
      { name: 'psi_burst', text: '0/1', col: '#fef08a', glow: 'rgba(245, 158, 11, 0.9)' },
    ];

    const cell = this.cellSize;
    const cols = Math.floor(this.atlasSize / cell);

    variants.forEach((v, idx) => {
      const colIdx = idx % cols;
      const rowIdx = Math.floor(idx / cols);
      const cx = colIdx * cell + cell / 2;
      const cy = rowIdx * cell + cell / 2;

      ctx.save();
      // Outer radial glow halo
      const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cell / 2 - 2);
      radGrad.addColorStop(0, v.glow);
      radGrad.addColorStop(0.5, v.glow.replace(/[\d\.]+\)$/, '0.2)'));
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, cell / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central glyph
      ctx.fillStyle = v.col;
      ctx.fillText(v.text, cx, cy);
      ctx.restore();

      this.sprites[v.name] = {
        sx: colIdx * cell,
        sy: rowIdx * cell,
        sw: cell,
        sh: cell,
        cx: cell / 2,
        cy: cell / 2,
      };
    });

    this.initialized = true;
  }

  draw(ctx, name, dx, dy, scale = 1, alpha = 1) {
    if (!this.initialized) this.init();
    const sp = this.sprites[name];
    if (!sp) return;

    const w = sp.sw * scale;
    const h = sp.sh * scale;
    const prevAlpha = ctx.globalAlpha;
    if (alpha < 1) ctx.globalAlpha = prevAlpha * alpha;

    ctx.drawImage(
      this.canvas,
      sp.sx, sp.sy, sp.sw, sp.sh,
      dx - w / 2, dy - h / 2, w, h
    );

    if (alpha < 1) ctx.globalAlpha = prevAlpha;
  }
}
