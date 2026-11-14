"""Preview the current dot grids at a readable size (build aid).

Renders girl-grid.txt and girl-lines.txt so a hand-edited artwork or mask can be
checked before rebuilding, without opening the app: scripts/preview-grid.png.
"""

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
META = ROOT / "girl-meta.json"
GRID = ROOT / "girl-grid.txt"
LINES = ROOT / "girl-lines.txt"
OUT = ROOT / "preview-grid.png"

PITCH = 9


def render(cells: str, columns: int, rows: int, fg: tuple, bg: tuple) -> Image.Image:
    image = Image.new("RGB", (columns * PITCH, rows * PITCH), bg)
    painter = ImageDraw.Draw(image)
    radius = PITCH * 0.3
    for index, digit in enumerate(cells):
        weight = int(digit, 16)
        if weight == 0:
            continue
        row, column = divmod(index, columns)
        alpha = min(1.0, (0.05 + 0.5 * (weight / 15)) * 1.2)
        shade = tuple(int(bg[i] + (fg[i] - bg[i]) * alpha) for i in range(3))
        cx = (column + 0.5) * PITCH
        cy = (row + 0.5) * PITCH
        painter.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=shade)
    return image


def main() -> None:
    meta = json.loads(META.read_text(encoding="utf-8"))
    columns, rows = meta["columns"], meta["rows"]
    grid = GRID.read_text(encoding="utf-8").strip()
    lines = LINES.read_text(encoding="utf-8").strip()

    panels = [
        render(grid, columns, rows, (236, 238, 242), (16, 16, 18)),
        render(grid, columns, rows, (102, 108, 120), (255, 255, 255)),
        render(lines, columns, rows, (236, 238, 242), (16, 16, 18)),
        render(lines, columns, rows, (102, 108, 120), (255, 255, 255)),
    ]
    width, height = panels[0].size
    strip = Image.new("RGB", (width * 4 + 30, height), (40, 40, 44))
    for position, panel in enumerate(panels):
        strip.paste(panel, (position * (width + 10), 0))
    strip.save(OUT)
    print(f"grid={columns}x{rows} -> {OUT.name}")


if __name__ == "__main__":
    main()
