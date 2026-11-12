import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm"
REF_DIR = os.path.join(BASE_DIR, r"public\references\landing")
AUDIT_DIR = os.path.join(BASE_DIR, r"docs\audit\fix")
BRAIN_DIR = r"C:\Users\asuja\.gemini\antigravity\brain\d427a985-5ee0-46c5-becb-29582309c322"

def create_side_by_side(ref_path, our_path, out_name, title_ref="REFERENCE (yannickgregoire.nl)", title_our="OUR IMPLEMENTATION (PQCHS)"):
    ref_img = Image.open(ref_path).convert("RGB")
    our_img = Image.open(our_path).convert("RGB")

    # Target height
    target_h = 720
    ref_w = int(ref_img.width * (target_h / ref_img.height))
    our_w = int(our_img.width * (target_h / our_img.height))

    ref_resized = ref_img.resize((ref_w, target_h), Image.Resampling.LANCZOS)
    our_resized = our_img.resize((our_w, target_h), Image.Resampling.LANCZOS)

    header_h = 44
    gap = 20
    total_w = ref_w + our_w + gap + 40
    total_h = target_h + header_h + 30

    canvas = Image.new("RGB", (total_w, total_h), color=(20, 18, 16))
    draw = ImageDraw.Draw(canvas)

    # Header texts
    draw.text((20, 12), title_ref, fill=(180, 170, 155))
    draw.text((20 + ref_w + gap, 12), title_our, fill=(94, 234, 212))

    # Paste images
    canvas.paste(ref_resized, (20, header_h))
    canvas.paste(our_resized, (20 + ref_w + gap, header_h))

    # Border lines
    draw.rectangle([20, header_h, 20 + ref_w, header_h + target_h], outline=(50, 45, 40), width=1)
    draw.rectangle([20 + ref_w + gap, header_h, 20 + ref_w + gap + our_w, header_h + target_h], outline=(50, 45, 40), width=1)

    out_audit = os.path.join(AUDIT_DIR, out_name)
    out_brain = os.path.join(BRAIN_DIR, out_name)
    canvas.save(out_audit, quality=92)
    canvas.save(out_brain, quality=92)
    print(f"Saved: {out_name} ({total_w}x{total_h})")

def main():
    print("=== GENERATING SIDE-BY-SIDE VERIFICATION COMPARISONS ===")
    
    # 1. Home Dark vs Ref 2
    create_side_by_side(
        os.path.join(REF_DIR, "landing-ref-2-hero.png"),
        os.path.join(AUDIT_DIR, "final-qc-home-1280-dark.png"),
        "sxs-home-1280-dark.png",
        "REFERENCE (Yannick Gregoire — Home Hero)",
        "IMPLEMENTATION (PQCHS Environment — Home 1280px Dark)"
    )

    # 2. Home Light vs Ref 2
    create_side_by_side(
        os.path.join(REF_DIR, "landing-ref-2-hero.png"),
        os.path.join(AUDIT_DIR, "final-qc-home-1280-light.png"),
        "sxs-home-1280-light.png",
        "REFERENCE (Yannick Gregoire — Home Hero)",
        "IMPLEMENTATION (PQCHS Environment — Home 1280px Light)"
    )

    # 3. Collapse state vs Ref 3
    create_side_by_side(
        os.path.join(REF_DIR, "landing-ref-3-scroll-collapse.png"),
        os.path.join(AUDIT_DIR, "r2-qc-collapse-state-1280.png"),
        "sxs-collapse-1280.png",
        "REFERENCE (Yannick Gregoire — Scroll Slice-Collapse)",
        "IMPLEMENTATION (PQCHS Environment — Slice-Collapse State)"
    )

    # 4. Awareness vs Ref 4
    create_side_by_side(
        os.path.join(REF_DIR, "landing-ref-4-text-block.png"),
        os.path.join(AUDIT_DIR, "final-qc-awareness-1280-dark.png"),
        "sxs-awareness-1280-dark.png",
        "REFERENCE (Yannick Gregoire — Typographic Text Block)",
        "IMPLEMENTATION (PQCHS Environment — Merged Awareness)"
    )

    print("=== ALL SIDE-BY-SIDE COMPARISONS CREATED ===")

if __name__ == "__main__":
    main()
