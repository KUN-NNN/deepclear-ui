"""Generate the shipped dot grids from the character artwork (build aid).

Reads scripts/src-girl.png, keeps the upper body, and writes:
  - scripts/girl-grid.txt   ink-weighted grid (light canvas)
  - scripts/girl-lines.txt  line-art grid (dark canvas)
  - scripts/girl-meta.json  grid dimensions
  - scripts/preview-girl.png  app-fidelity preview of both themes

The blue hair loop above the head is erased by colour, inside a small search box:
it is a saturated blue shape sitting on white background, while the maid headdress
beside it is white, so the mask lifts the loop without biting the headdress.
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src-girl1.png"
if not SRC.exists():
    SRC = ROOT / "src-girl.png"
# Optional hand-painted mask: white erases, black keeps. Wins over the colour mask.
MASK_FILE = ROOT / "src-girl-mask.png"
GRID = ROOT / "girl-grid.txt"
LINES = ROOT / "girl-lines.txt"
META = ROOT / "girl-meta.json"
PREVIEW = ROOT / "preview-girl.png"

COLUMNS = 104
BACKGROUND = (255, 255, 255)
# Fraction of the artwork height kept from the top: upper body only.
CROP = 0.6
CUT = 0.025
GAMMA = 0.9
LINE_GAIN = 3.4
TONE_KEEP = 0.32
# Search box for the hair loop, and the blue hue band that identifies it.
LOOP_BOX = (0.24, 0.46, 0.16)
LOOP_HUE = (140, 200)
LOOP_MIN_SAT = 55
LOOP_MIN_VALUE = 40


def loop_mask(rgb: Image.Image) -> Image.Image:
    """Mask the blue hair loop above the head."""
    hsv = np.asarray(rgb.convert("HSV"), dtype=np.float32)
    hue, saturation, value = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    rows, columns = hue.shape
    ys, xs = np.mgrid[0:rows, 0:columns]
    x = xs / columns
    y = ys / rows
    inside = (x > LOOP_BOX[0]) & (x < LOOP_BOX[1]) & (y < LOOP_BOX[2])
    blue = (
        (hue > LOOP_HUE[0])
        & (hue < LOOP_HUE[1])
        & (saturation > LOOP_MIN_SAT)
        & (value > LOOP_MIN_VALUE)
    )
    return Image.fromarray(((inside & blue).astype(np.uint8)) * 255, "L")


def main() -> None:
    source = Image.open(SRC).convert("RGBA")
    flat = Image.new("RGB", source.size, BACKGROUND)
    flat.paste(source, (0, 0), source)
    upper = flat.crop((0, 0, flat.width, max(1, round(flat.height * CROP))))

    ink = upper.convert("L").point(lambda v: 255 - v)
    rows = max(1, round(COLUMNS * ink.height / ink.width))
    small = ink.resize((COLUMNS, rows), Image.Resampling.LANCZOS)
    small = small.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=0))

    # Erase the loop at grid resolution, with a soft edge so no halo is left.
    # A hand-painted mask (white = erase) wins over the automatic colour mask.
    if MASK_FILE.exists():
        painted = Image.open(MASK_FILE).convert("L").resize(upper.size, Image.Resampling.LANCZOS)
        loop = painted.resize((COLUMNS, rows), Image.Resampling.LANCZOS)
        note = "mask: hand-painted " + MASK_FILE.name
    else:
        loop = loop_mask(upper).resize((COLUMNS, rows), Image.Resampling.LANCZOS)
        note = "mask: automatic colour mask"
    loop = loop.filter(ImageFilter.GaussianBlur(0.7))
    small = ImageChops.subtract(small, loop)

    # Dark canvas: line-art pass (local high-pass keeps the drawn strokes).
    blur = small.filter(ImageFilter.GaussianBlur(1.4))
    strokes = ImageChops.subtract(small, blur).point(lambda v: min(255, int(v * LINE_GAIN)))
    tone = small.point(lambda v: int(v * TONE_KEEP))
    lines = ImageChops.lighter(strokes, tone)

    def encode(image: Image.Image) -> str:
        pixels = image.load()
        digits = []
        for row in range(rows):
            for column in range(COLUMNS):
                weight = (pixels[column, row] / 255) ** GAMMA
                digits.append("0" if weight < CUT else f"{round(weight * 15):x}")
        return "".join(digits)

    GRID.write_text(encode(small), encoding="utf-8")
    LINES.write_text(encode(lines), encoding="utf-8")
    META.write_text(json.dumps({"columns": COLUMNS, "rows": rows}), encoding="utf-8")

    # App-fidelity preview: ink and line-art grids on dark and light canvases.
    pitch = 5
    width, height = COLUMNS * pitch, rows * pitch
    panels = []
    for image in (small, lines):
        for fg, bg in (((236, 238, 242), (16, 16, 18)), ((102, 108, 120), (255, 255, 255))):
            panel = Image.new("RGB", (width, height), bg)
            painter = ImageDraw.Draw(panel)
            radius = 0.28 * pitch
            pixels = image.load()
            for row in range(rows):
                for column in range(COLUMNS):
                    weight = pixels[column, row] / 255
                    if weight < CUT:
                        continue
                    alpha = min(1.0, (0.05 + 0.5 * weight) * 1.2)
                    shade = tuple(int(bg[i] + (fg[i] - bg[i]) * alpha) for i in range(3))
                    cx = (column + 0.5) * pitch
                    cy = (row + 0.5) * pitch
                    painter.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=shade)
            panels.append(panel)

    strip = Image.new("RGB", (width * 4 + 30, height), (40, 40, 44))
    for position, panel in enumerate(panels):
        strip.paste(panel, (position * (width + 10), 0))
    strip.save(PREVIEW)
    print(f"grid={COLUMNS}x{rows} ({note}) -> {GRID.name}, {LINES.name}, {PREVIEW.name}")


if __name__ == "__main__":
    main()
