"""
One-off script: convert the black-line-art-on-white principle icons in
principlesAssets/ into transparent-background, auto-cropped PNGs in
public/principle-icons/. Uses a luminance-to-alpha conversion (pure black/
white line art assumed) plus a bounding-box crop with a small padding margin.
"""
import os
from PIL import Image

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "principlesAssets")
DST_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "principle-icons")
PADDING_FRAC = 0.06  # extra margin left around the cropped glyph, as a fraction of its size

os.makedirs(DST_DIR, exist_ok=True)

for i in range(1, 9):
    name = f"princ{i}.png"
    src_path = os.path.join(SRC_DIR, name)
    img = Image.open(src_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # luminance-based alpha: black -> opaque, white -> transparent
            luminance = (r + g + b) / 3
            alpha = 255 - int(luminance)
            pixels[x, y] = (0, 0, 0, alpha)

    bbox = img.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        bw, bh = right - left, bottom - top
        pad_x = int(bw * PADDING_FRAC)
        pad_y = int(bh * PADDING_FRAC)
        left = max(0, left - pad_x)
        top = max(0, top - pad_y)
        right = min(w, right + pad_x)
        bottom = min(h, bottom + pad_y)
        img = img.crop((left, top, right, bottom))

    dst_path = os.path.join(DST_DIR, name)
    img.save(dst_path, "PNG", optimize=True)
    print(f"{name}: {img.size[0]}x{img.size[1]} -> {dst_path}")
