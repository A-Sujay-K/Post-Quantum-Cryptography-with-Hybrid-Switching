#!/usr/bin/env python3
"""
build_hero_assets.py
Production asset pipeline for the Quantum Computer Hero.
- Crops 1024x892 source to 680x892 (portrait slot, 4:5 ratio).
- Generates despilled alpha cutout with zero dark fringe.
- Generates front-mask layer for plate/rim/disc occlusion.
- Generates warm-monochrome baked variants.
- Generates light-theme variants with contact shadow.
- Exports at 1x (640x840) and 2x (1280x1680) in WebP, AVIF, and PNG formats.
"""

import os
import sys
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

SOURCE_PATH = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\public\references\landing\quantum-computer.jpg'
OUT_DIR = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\frontend-user\public\hero'
ARTIFACT_DIR = r'C:\Users\asuja\.gemini\antigravity\brain\d427a985-5ee0-46c5-becb-29582309c322'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

print(f"Loading source: {SOURCE_PATH}")
src = Image.open(SOURCE_PATH)
w_orig, h_orig = src.size

# 1. Portrait crop centered on machine (column center x=514)
# Width 680, height 892 -> (174, 0, 854, 892)
crop_box = (174, 0, 854, 892)
crop = src.crop(crop_box)
w_crop, h_crop = crop.size
print(f"Cropped to {w_crop}x{h_crop}")

# Target dimensions:
# 1x: 640 x 840 (exact 16:21 aspect ratio)
# 2x: 1280 x 1680
W_1X, H_1X = 640, 840
W_2X, H_2X = 1280, 1680

# 2. Compute Despilled Alpha Cutout
arr = np.array(crop).astype(float)
max_c = np.maximum.reduce([arr[:,:,0], arr[:,:,1], arr[:,:,2]])

# Alpha ramp: dark background <= 5, solid metal >= 32
t_low = 5.0
t_high = 32.0
alpha_norm = np.clip((max_c - t_low) / (t_high - t_low), 0.0, 1.0)
alpha_norm = np.power(alpha_norm, 0.85) # keep faint wire glints

# Edge despill / unmultiply: prevent dark halo on light backgrounds
rgb_despill = np.zeros_like(arr)
for c in range(3):
    rgb_c = arr[:,:,c]
    safe_alpha = np.maximum(alpha_norm, 0.08)
    unmult = rgb_c / safe_alpha
    rgb_despill[:,:,c] = np.clip(unmult, 0, 255)

rgba_native = np.dstack([rgb_despill, alpha_norm * 255.0]).astype(np.uint8)
img_copper = Image.fromarray(rgba_native, 'RGBA')

# 3. Create Warm-Monochrome Variant
arr_c = np.array(img_copper).astype(float)
gray = 0.299 * arr_c[:,:,0] + 0.587 * arr_c[:,:,1] + 0.114 * arr_c[:,:,2]
warm_mono_rgb = np.stack([
    np.clip(gray * 1.04 + 12, 0, 255),
    np.clip(gray * 0.94 + 6, 0, 255),
    np.clip(gray * 0.80, 0, 255)
], axis=2).astype(np.uint8)
rgba_mono = np.dstack([warm_mono_rgb, arr_c[:,:,3]]).astype(np.uint8)
img_mono = Image.fromarray(rgba_mono, 'RGBA')

# 4. Create Front-Mask Layer
# The front mask contains solid objects that must OCCLUDE particles:
# - Top disc (y: 0 to 160)
# - Plate 1 rim and mounting blocks (y: 360 to 405)
# - Plate 2 rim and mounting blocks (y: 590 to 630)
# - Plate 3 rim and base surface (y: 815 to 885)
# In wire zones (y: 160-360, 405-590, 630-815), the mask is transparent (alpha 0)
mask_alpha = np.zeros((h_crop, w_crop), dtype=float)

# Top disc: fully occluding
mask_alpha[0:160, :] = 1.0

# Plate 1: smooth vertical transition
for y in range(355, 410):
    if y < 365:
        w_y = (y - 355) / 10.0
    elif y > 400:
        w_y = (410 - y) / 10.0
    else:
        w_y = 1.0
    mask_alpha[y, :] = np.maximum(mask_alpha[y, :], w_y)

# Plate 2: smooth vertical transition
for y in range(585, 635):
    if y < 595:
        w_y = (y - 585) / 10.0
    elif y > 625:
        w_y = (635 - y) / 10.0
    else:
        w_y = 1.0
    mask_alpha[y, :] = np.maximum(mask_alpha[y, :], w_y)

# Plate 3: bottom disc
for y in range(810, 885):
    if y < 820:
        w_y = (y - 810) / 10.0
    else:
        w_y = 1.0
    mask_alpha[y, :] = np.maximum(mask_alpha[y, :], w_y)

# Modulate mask alpha by the actual object alpha so background is never filled
final_mask_alpha = mask_alpha * alpha_norm * 255.0

# Front-mask copper image
mask_rgba_copper = np.dstack([rgb_despill, final_mask_alpha]).astype(np.uint8)
img_mask_copper = Image.fromarray(mask_rgba_copper, 'RGBA')

# Front-mask mono image
mask_rgba_mono = np.dstack([warm_mono_rgb, final_mask_alpha]).astype(np.uint8)
img_mask_mono = Image.fromarray(mask_rgba_mono, 'RGBA')

# 5. Create Light Theme Variant with Contact Shadow
# A subtle warm shadow behind the machine:
shadow = Image.new('RGBA', (w_crop, h_crop), (0, 0, 0, 0))
shadow_alpha = (alpha_norm * 45).astype(np.uint8) # 18% max shadow
shadow_img = Image.fromarray(shadow_alpha, 'L').filter(ImageFilter.GaussianBlur(radius=8))
shadow_arr = np.array(shadow_img)
# Shift shadow down by 8px
shadow_shifted = np.zeros_like(shadow_arr)
shadow_shifted[8:, :] = shadow_arr[:-8, :]
# Warm brown shadow tint (42, 32, 24)
shadow_rgba = np.zeros((h_crop, w_crop, 4), dtype=np.uint8)
shadow_rgba[:,:,0] = 42
shadow_rgba[:,:,1] = 32
shadow_rgba[:,:,2] = 24
shadow_rgba[:,:,3] = shadow_shifted
shadow_layer = Image.fromarray(shadow_rgba, 'RGBA')

img_light_copper = Image.alpha_composite(shadow_layer, img_copper)
img_light_mono = Image.alpha_composite(shadow_layer, img_mono)

# 6. Export pipeline: 1x (640x840) and 2x (1280x1680) in WebP, AVIF, PNG
targets = [
    ('qc-base', img_copper),
    ('qc-mask', img_mask_copper),
    ('qc-base-mono', img_mono),
    ('qc-mask-mono', img_mask_mono),
    ('qc-base-light', img_light_copper),
    ('qc-base-light-mono', img_light_mono)
]

for name, base_img in targets:
    # 1x image
    img_1x = base_img.resize((W_1X, H_1X), Image.Resampling.LANCZOS)
    # 2x image (high-quality upscale)
    img_2x = base_img.resize((W_2X, H_2X), Image.Resampling.LANCZOS)
    # Mild unsharp mask on 2x to preserve fine wire crispness
    enhancer = ImageEnhance.Sharpness(img_2x)
    img_2x_sharp = enhancer.enhance(1.25)

    # Save 1x exports
    for ext, kwargs in [
        ('webp', {'quality': 92, 'method': 6}),
        ('png', {'optimize': True})
    ]:
        p1 = os.path.join(OUT_DIR, f"{name}-1x.{ext}")
        img_1x.save(p1, **kwargs)
        # Also copy to artifact dir for audit
        p1_art = os.path.join(ARTIFACT_DIR, f"{name}-1x.{ext}")
        img_1x.save(p1_art, **kwargs)
        print(f"Saved {name}-1x.{ext} ({os.path.getsize(p1)} bytes)")

    # Save 2x exports
    for ext, kwargs in [
        ('webp', {'quality': 92, 'method': 6}),
        ('png', {'optimize': True})
    ]:
        p2 = os.path.join(OUT_DIR, f"{name}-2x.{ext}")
        img_2x_sharp.save(p2, **kwargs)
        p2_art = os.path.join(ARTIFACT_DIR, f"{name}-2x.{ext}")
        img_2x_sharp.save(p2_art, **kwargs)
        print(f"Saved {name}-2x.{ext} ({os.path.getsize(p2)} bytes)")

    # Try AVIF export if available
    try:
        p1_avif = os.path.join(OUT_DIR, f"{name}-1x.avif")
        img_1x.save(p1_avif, quality=90)
        p2_avif = os.path.join(OUT_DIR, f"{name}-2x.avif")
        img_2x_sharp.save(p2_avif, quality=90)
        print(f"Saved {name} AVIF 1x/2x")
    except Exception as e:
        print(f"AVIF export skipped for {name}: {e}")

print("\n=== ALL HERO ASSETS BUILT SUCCESSFULLY ===")
