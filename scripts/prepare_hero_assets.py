import os
from PIL import Image, ImageFilter
import numpy as np

def run():
    src_path = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\public\references\landing\quantum-computer.jpg'
    out_dir = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\frontend-user\public\hero'
    os.makedirs(out_dir, exist_ok=True)
    
    print(f'Loading source from: {src_path}')
    im = Image.open(src_path)
    
    # 1. Portrait crop: 700 x 892 px (ratio 0.785:1, ~4:5 slot)
    crop = im.crop((164, 0, 864, 892))
    w_nat, h_nat = crop.size
    print(f'Cropped native size: {w_nat} x {h_nat}')
    
    arr = np.array(crop).astype(np.float32)
    max_c = np.max(arr, axis=2)
    
    # 2. Precise Alpha Ramp with anti-aliasing
    # Smooth step between 3.0 and 32.0 to catch delicate wire fringes without clipping
    alpha = np.where(max_c < 3.0, 0.0, np.minimum(1.0, (max_c - 3.0) / 28.0))
    
    # 3. Despill / un-premultiply to eliminate black fringes on light backgrounds
    unpremul = np.zeros_like(arr)
    for c in range(3):
        unpremul[:, :, c] = np.where(alpha > 0.02, 
                                     np.clip(arr[:, :, c] / np.maximum(alpha, 0.22), 0.0, 255.0),
                                     arr[:, :, c])
    
    copper_rgba = np.dstack([unpremul.astype(np.uint8), (alpha * 255.0).astype(np.uint8)])
    copper_base_img = Image.fromarray(copper_rgba, 'RGBA')
    
    # 4. Front-Mask (Layer 3)
    # Occludes particles where solid hardware sits in the foreground:
    # Top disc, Plate 1, Plate 2, Plate 3, Central Column
    mask_alpha = np.zeros((h_nat, w_nat), dtype=np.uint8)
    native_alpha_u8 = (alpha * 255.0).astype(np.uint8)
    
    # Top disc: Y 0 to 186
    mask_alpha[0:186, :] = native_alpha_u8[0:186, :]
    
    # Plate 1 rim & body: Y 362 to 388
    mask_alpha[362:388, :] = native_alpha_u8[362:388, :]
    
    # Plate 2 rim & body: Y 560 to 602
    mask_alpha[560:602, :] = native_alpha_u8[560:602, :]
    
    # Plate 3 rim & body: Y 770 to 825
    mask_alpha[770:825, :] = native_alpha_u8[770:825, :]
    
    # Central column (cylinders and coupling rings): X 325 to 375, Y 186 to 825
    for y in range(186, 825):
        mask_alpha[y, 325:375] = np.maximum(mask_alpha[y, 325:375], native_alpha_u8[y, 325:375])
    
    # Front vertical structural rods (thickest foreground tubes)
    # Rod 1 at X ~226..242, Rod 2 at X ~456..472
    for y in range(186, 362):
        mask_alpha[y, 226:242] = np.maximum(mask_alpha[y, 226:242], native_alpha_u8[y, 226:242])
        mask_alpha[y, 456:472] = np.maximum(mask_alpha[y, 456:472], native_alpha_u8[y, 456:472])
    for y in range(388, 560):
        mask_alpha[y, 226:242] = np.maximum(mask_alpha[y, 226:242], native_alpha_u8[y, 226:242])
        mask_alpha[y, 456:472] = np.maximum(mask_alpha[y, 456:472], native_alpha_u8[y, 456:472])
    for y in range(602, 770):
        mask_alpha[y, 226:242] = np.maximum(mask_alpha[y, 226:242], native_alpha_u8[y, 226:242])
        mask_alpha[y, 456:472] = np.maximum(mask_alpha[y, 456:472], native_alpha_u8[y, 456:472])
        
    copper_mask_rgba = np.dstack([unpremul.astype(np.uint8), mask_alpha])
    copper_mask_img = Image.fromarray(copper_mask_rgba, 'RGBA')
    
    # 5. Warm Monochrome Variant
    # Desaturate + tint to match ASCII amber-warm token
    gray = 0.299 * unpremul[:, :, 0] + 0.587 * unpremul[:, :, 1] + 0.114 * unpremul[:, :, 2]
    mono_r = np.clip(gray * 1.05 + 10, 0, 255).astype(np.uint8)
    mono_g = np.clip(gray * 0.92 + 5, 0, 255).astype(np.uint8)
    mono_b = np.clip(gray * 0.78, 0, 255).astype(np.uint8)
    
    mono_base_rgba = np.dstack([mono_r, mono_g, mono_b, native_alpha_u8])
    mono_base_img = Image.fromarray(mono_base_rgba, 'RGBA')
    
    mono_mask_rgba = np.dstack([mono_r, mono_g, mono_b, mask_alpha])
    mono_mask_img = Image.fromarray(mono_mask_rgba, 'RGBA')
    
    # 6. Light Theme Variants (with subtle ambient contact shadow)
    # A soft ground shadow under bottom plate (Y 810..880) to anchor against cream
    shadow_layer = Image.new('RGBA', (w_nat, h_nat), (0, 0, 0, 0))
    s_arr = np.zeros((h_nat, w_nat), dtype=np.uint8)
    # Elliptical contact shadow
    yy, xx = np.ogrid[:h_nat, :w_nat]
    dist_sq = ((xx - 350) / 220.0)**2 + ((yy - 850) / 35.0)**2
    s_arr[dist_sq <= 1.0] = (np.clip((1.0 - np.sqrt(dist_sq[dist_sq <= 1.0])) * 55.0, 0, 255)).astype(np.uint8)
    s_img = Image.fromarray(s_arr, 'L').filter(ImageFilter.GaussianBlur(radius=8))
    
    # Light theme composite with soft shadow behind base
    light_shadow_rgba = np.zeros((h_nat, w_nat, 4), dtype=np.uint8)
    light_shadow_rgba[:, :, :3] = [42, 32, 24] # Deep espresso shadow
    light_shadow_rgba[:, :, 3] = np.array(s_img)
    light_shadow_img = Image.fromarray(light_shadow_rgba, 'RGBA')
    
    copper_light_base = Image.alpha_composite(light_shadow_img, copper_base_img)
    mono_light_base = Image.alpha_composite(light_shadow_img, mono_base_img)
    
    # 7. Resample to 1x (640x816) and 2x (1280x1632)
    sizes = {
        '1x': (640, 816),
        '2x': (1280, 1632)
    }
    
    assets = [
        ('qc-base', copper_base_img),
        ('qc-mask', copper_mask_img),
        ('qc-base-mono', mono_base_img),
        ('qc-mask-mono', mono_mask_img),
        ('qc-base-light', copper_light_base),
        ('qc-base-light-mono', mono_light_base),
        ('qc-mask-light', copper_mask_img),
    ]
    
    print('Exporting responsive assets (WebP and PNG)...')
    for name, img in assets:
        for scale, (w, h) in sizes.items():
            # Lanczos resample
            resampled = img.resize((w, h), Image.Resampling.LANCZOS)
            
            # For 2x, apply slight unsharp mask to keep wire edges razor-sharp
            if scale == '2x':
                resampled = resampled.filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=3))
            
            # Export WebP (lossless with alpha)
            webp_path = os.path.join(out_dir, f'{name}-{scale}.webp')
            resampled.save(webp_path, 'WEBP', lossless=True, quality=100)
            
            # Export PNG fallback
            png_path = os.path.join(out_dir, f'{name}-{scale}.png')
            resampled.save(png_path, 'PNG', optimize=True)
            
            print(f'  -> {name}-{scale}.webp ({w}x{h}, {os.path.getsize(webp_path)} bytes)')

    print('\n=== ASSET PIPELINE COMPLETED SUCCESSFULLY ===')

if __name__ == '__main__':
    run()
