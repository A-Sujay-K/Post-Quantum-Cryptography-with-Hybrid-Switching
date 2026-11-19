#!/usr/bin/env python3
"""
prepare_complete_hero.py
Comprehensive, production-grade pipeline for the Quantum Computer Hero.
1. Stitches the complete top end from quantum-computer-full.png onto quantum-computer.jpg.
2. Applies sub-pixel despilling and anti-aliasing (zero black halo, zero white fringe).
3. Produces responsive 1x (640x640) and 2x (1280x1280) suites:
   - Base machine (copper)
   - Front-mask occlusion (top disc, plates, central column)
   - Warm-monochrome baked variants
   - Light-theme variants with ground contact shadow
   - AVIF, WebP, PNG formats
   - Binary alpha buffer (qc-alpha-1x.bin)
"""

import os
import sys
import numpy as np
from PIL import Image, ImageFilter

SRC_HIGH = 'public/references/landing/quantum-computer.jpg'
SRC_FULL = 'public/references/landing/quantum-computer-full.png'
OUT_DIR = 'frontend-user/public/hero'
DOCS_AUDIT_DIR = 'docs/audit/fix'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(DOCS_AUDIT_DIR, exist_ok=True)

print("=== 1. STITCHING COMPLETE TOP END ===")
img_h = Image.open(SRC_HIGH).convert('RGB')
img_f = Image.open(SRC_FULL).convert('RGB')

# Proven alignment scale factor
scale = 3.16250
w_scaled = int(round(img_f.width * scale))
h_scaled = int(round(img_f.height * scale))
full_scaled = img_f.resize((w_scaled, h_scaled), Image.Resampling.LANCZOS)
arr_fs = np.array(full_scaled).astype(np.float32)
arr_h = np.array(img_h).astype(np.float32)

top_pad = 120
new_h = arr_h.shape[0] + top_pad
new_w = arr_h.shape[1]

canvas = np.zeros((new_h, new_w, 3), dtype=np.float32)
canvas[top_pad:, :] = arr_h

# Alignment offsets (Groove A row 69 in full matches Row 70 in high-res)
y_offset = top_pad - 154.21
x_offset = 511.0 - (253.0 * scale) - 1.0

# Brightness matching across overlap
patch_canvas = canvas[top_pad:top_pad+50, 250:770]
patch_fs = arr_fs[154:204, int(round(250 - x_offset)):int(round(770 - x_offset))]
ratio = patch_canvas.mean() / (patch_fs.mean() + 1e-4)
print(f"Luminance equalization ratio: {ratio:.3f}")
arr_fs_adj = arr_fs * ratio

blend_len = 50
for yc in range(0, top_pad + blend_len):
    y_fs = yc - y_offset
    y_fs_idx = int(round(y_fs))
    if y_fs_idx < 0 or y_fs_idx >= arr_fs_adj.shape[0]: continue
    
    for xc in range(0, new_w):
        x_fs = xc - x_offset
        x_fs_idx = int(round(x_fs))
        if x_fs_idx < 0 or x_fs_idx >= arr_fs_adj.shape[1]: continue
        
        val_fs = arr_fs_adj[y_fs_idx, x_fs_idx]
        if yc < top_pad:
            canvas[yc, xc] = val_fs
        else:
            t = (yc - top_pad) / float(blend_len)
            alpha_b = t * t * (3.0 - 2.0 * t) # smoothstep
            canvas[yc, xc] = (1.0 - alpha_b) * val_fs + alpha_b * canvas[yc, xc]

# Pad to exact square 1024 x 1024
sq_canvas = np.zeros((1024, 1024, 3), dtype=np.float32)
sq_canvas[0:canvas.shape[0], 0:canvas.shape[1]] = canvas

print("=== 2. SUB-PIXEL ALPHA CUTOUT & DESPILLING ===")
# Analytical dome & cylinder profile for top tier (Y < 225)
Y_center = 92.0
B = 72.0 # Top of dome at 20.0
A = 442.0
X_center = 512.0

yy, xx = np.mgrid[0:1024, 0:1024].astype(np.float32)

# Dome distance:
d_dome = np.sqrt(((xx - X_center) / A)**2 + ((yy - Y_center) / B)**2) - 1.0

# Stepped bevel tier (Y from 92 to 145)
t_tier = np.clip((yy - 92.0) / (145.0 - 92.0), 0.0, 1.0)
hw_tier = 442.0 + t_tier * (506.0 - 442.0)
d_tier = (np.abs(xx - X_center) - hw_tier) / 1.0

# Cylinder body (Y from 145 to 225)
d_body = (np.abs(xx - X_center) - 506.0) / 1.0

d_outer = np.where(yy < 92.0, d_dome * 35.0, np.where(yy < 145.0, d_tier, d_body))
c_alpha = np.clip(0.5 - d_outer / 1.5, 0.0, 1.0)

# Base wire alpha from smooth luminance ramp
max_c = np.max(sq_canvas, axis=2)
t = np.clip((max_c - 3.0) / 28.0, 0.0, 1.0)
wire_alpha = t * t * (3.0 - 2.0 * t)

alpha = wire_alpha.copy()
# Strictly set top cylinder alpha to c_alpha
alpha[0:225, :] = c_alpha[0:225, :]

# Solid core for bottom plate (rows 880 to 955)
for r in range(880, 955):
    nz = np.where(sq_canvas[r, :, :].max(axis=-1) > 20)[0]
    if len(nz) > 10:
        alpha[r, nz[0]:nz[-1]+1] = np.maximum(alpha[r, nz[0]:nz[-1]+1], 1.0)

# True despill / un-premultiply to eliminate dark edge fringes
unpremul = np.zeros_like(sq_canvas)
for c in range(3):
    safe_a = np.maximum(alpha, 0.22)
    unpremul[:, :, c] = np.clip(sq_canvas[:, :, c] / safe_a, 0.0, 255.0)

for c in range(3):
    unpremul[:, :, c] = np.where(alpha > 0.02, unpremul[:, :, c], sq_canvas[:, :, c])

# Where alpha == 0, RGB must be 0
for c in range(3):
    unpremul[:, :, c] = np.where(alpha == 0.0, 0.0, unpremul[:, :, c])

copper_base_rgba = np.dstack([unpremul.astype(np.uint8), (alpha * 255.0).astype(np.uint8)])
img_copper_base = Image.fromarray(copper_base_rgba, 'RGBA')

print("=== 3. FRONT-MASK OCCLUSION LAYER ===")
# Layer 3: Solid objects that occlude data particles passing behind them
# Top disc: Y 0..235
# Plate 1: Y 470..535
# Plate 2: Y 680..740
# Plate 3: Y 885..955
# Central column: X 485..540, Y 235..955
# Foreground structural rods: X ~360..385 and X ~640..665
native_alpha_u8 = (alpha * 255.0).astype(np.uint8)
mask_alpha = np.zeros((1024, 1024), dtype=np.uint8)

# Top disc
mask_alpha[0:235, :] = native_alpha_u8[0:235, :]

# Plates
mask_alpha[470:535, :] = native_alpha_u8[470:535, :]
mask_alpha[680:740, :] = native_alpha_u8[680:740, :]
mask_alpha[885:955, :] = native_alpha_u8[885:955, :]

# Central column & coupling rings
for y in range(235, 955):
    mask_alpha[y, 485:540] = np.maximum(mask_alpha[y, 485:540], native_alpha_u8[y, 485:540])

# Foreground vertical structural rods
for y in range(235, 885):
    mask_alpha[y, 360:385] = np.maximum(mask_alpha[y, 360:385], native_alpha_u8[y, 360:385])
    mask_alpha[y, 640:665] = np.maximum(mask_alpha[y, 640:665], native_alpha_u8[y, 640:665])

copper_mask_rgba = np.dstack([unpremul.astype(np.uint8), mask_alpha])
img_copper_mask = Image.fromarray(copper_mask_rgba, 'RGBA')

print("=== 4. WARM MONOCHROME VARIANTS ===")
gray = 0.299 * unpremul[:, :, 0] + 0.587 * unpremul[:, :, 1] + 0.114 * unpremul[:, :, 2]
mono_r = np.clip(gray * 1.05 + 10, 0, 255).astype(np.uint8)
mono_g = np.clip(gray * 0.92 + 5, 0, 255).astype(np.uint8)
mono_b = np.clip(gray * 0.78, 0, 255).astype(np.uint8)

mono_base_rgba = np.dstack([mono_r, mono_g, mono_b, native_alpha_u8])
img_mono_base = Image.fromarray(mono_base_rgba, 'RGBA')

mono_mask_rgba = np.dstack([mono_r, mono_g, mono_b, mask_alpha])
img_mono_mask = Image.fromarray(mono_mask_rgba, 'RGBA')

print("=== 5. LIGHT THEME VARIANTS WITH CONTACT SHADOW ===")
# Soft ground contact shadow under bottom plate
s_arr = np.zeros((1024, 1024), dtype=np.uint8)
yy, xx = np.ogrid[:1024, :1024]
dist_sq = ((xx - 512) / 330.0)**2 + ((yy - 960) / 45.0)**2
s_arr[dist_sq <= 1.0] = (np.clip((1.0 - np.sqrt(dist_sq[dist_sq <= 1.0])) * 55.0, 0, 255)).astype(np.uint8)
s_img = Image.fromarray(s_arr, 'L').filter(ImageFilter.GaussianBlur(radius=10))

light_shadow_rgba = np.zeros((1024, 1024, 4), dtype=np.uint8)
light_shadow_rgba[:, :, :3] = [42, 32, 24] # Warm espresso shadow
light_shadow_rgba[:, :, 3] = np.array(s_img)
light_shadow_img = Image.fromarray(light_shadow_rgba, 'RGBA')

img_copper_light_base = Image.alpha_composite(light_shadow_img, img_copper_base)
img_mono_light_base = Image.alpha_composite(light_shadow_img, img_mono_base)

print("=== 6. RESPONSIVE EXPORT (640x640 1x, 1280x1280 2x) ===")
sizes = {
    '1x': (640, 640),
    '2x': (1280, 1280)
}

assets = [
    ('qc-base', img_copper_base),
    ('qc-mask', img_copper_mask),
    ('qc-base-mono', img_mono_base),
    ('qc-mask-mono', img_mono_mask),
    ('qc-base-light', img_copper_light_base),
    ('qc-mask-light', img_copper_mask),
    ('qc-base-light-mono', img_mono_light_base),
    ('qc-mask-light-mono', img_mono_mask),
]

for name, master in assets:
    for scale_key, (w, h) in sizes.items():
        resampled = master.resize((w, h), Image.Resampling.LANCZOS)
        
        # Export WebP
        webp_file = os.path.join(OUT_DIR, f'{name}-{scale_key}.webp')
        resampled.save(webp_file, 'WEBP', lossless=True, quality=100)
        
        # Export PNG
        png_file = os.path.join(OUT_DIR, f'{name}-{scale_key}.png')
        resampled.save(png_file, 'PNG')
        
        # Export AVIF
        avif_file = os.path.join(OUT_DIR, f'{name}-{scale_key}.avif')
        try:
            resampled.save(avif_file, 'AVIF')
        except Exception:
            pass
        
        print(f"Exported {name}-{scale_key} ({w}x{h})")

# Export binary alpha mask for path verification
base_1x_alpha = np.array(img_copper_base.resize((640, 640), Image.Resampling.LANCZOS))[:, :, 3]
alpha_bin_path = os.path.join(OUT_DIR, 'qc-alpha-1x.bin')
with open(alpha_bin_path, 'wb') as f:
    f.write(base_1x_alpha.tobytes())
print(f"Saved binary alpha buffer: {alpha_bin_path} ({len(base_1x_alpha.tobytes())} bytes)")

print("\n=== COMPLETED ASSET GENERATION SUCCESSFULLY ===")
