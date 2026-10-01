#!/usr/bin/env python3
"""FAVICON-01 candidate icon-set generator (portfolio property).

Source: the official symbol PNG `landometer-symbol-color.png` (1601 × 1601, montri-th/motif assets/identity/logo).
Permitted transformation: proportional resize only (no redraw, no recolor, no distortion). The symbol is cropped to its
own alpha bounding box — the source file carries transparent padding — and centred on each canvas.

Sizes and roles (FAVICON-01): 16, 32, 48 favicon (transparent; 25% corner mask, a no-op on transparent art) ·
180 apple-touch (opaque tile, because iOS paints black behind transparency) · 192 manifest (transparent) ·
512 manifest-maskable (opaque full-square tile, symbol inside the 80% safe zone).

Candidate choices awaiting the identity owner: the opaque tile background uses brand.beige #F2F1DF (warm identity
surface). Output hashes are written to icon-set.candidate.json. Nothing here is approved until the identity owner
approves the icon_set role.
"""
import hashlib, json, os, sys
from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ENV = dict(l.split("=", 1) for l in (HERE / "../../work/paths.env").resolve().read_text().strip().split("\n"))
SRC = Path(ENV["MOTIF"]) / "assets/identity/logo/landometer-symbol-color.png"
BEIGE = (0xF2, 0xF1, 0xDF, 255)

src_bytes = SRC.read_bytes()
src = Image.open(SRC).convert("RGBA")
bbox = src.getbbox()
symbol = src.crop(bbox)
sw, sh = symbol.size

def fit(canvas_px, fill_ratio):
    """Return the symbol resized so its taller side occupies fill_ratio of the canvas, centred (x, y)."""
    target_h = round(canvas_px * fill_ratio)
    scale = target_h / sh
    target_w = round(sw * scale)
    im = symbol.resize((target_w, target_h), Image.LANCZOS)
    x = (canvas_px - target_w) // 2
    y = (canvas_px - target_h) // 2
    return im, x, y

def rounded_mask(px, radius_ratio):
    m = Image.new("L", (px, px), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, px - 1, px - 1], radius=round(px * radius_ratio), fill=255)
    return m

SPEC = [
    (16, "favicon", "transparent", 0.94, 0.25),
    (32, "favicon", "transparent", 0.94, 0.25),
    (48, "favicon", "transparent", 0.94, 0.0),
    (180, "apple-touch", "beige", 0.80, 0.0),
    (192, "manifest", "transparent", 0.94, 0.0),
    (512, "manifest-maskable", "beige", 0.80, 0.0),
]
files = []
for px, role, bg, fill_ratio, corner in SPEC:
    canvas = Image.new("RGBA", (px, px), BEIGE if bg == "beige" else (0, 0, 0, 0))
    im, x, y = fit(px, fill_ratio)
    canvas.alpha_composite(im, (x, y))
    if corner:
        canvas.putalpha(Image.composite(canvas.getchannel("A"), Image.new("L", (px, px), 0), rounded_mask(px, corner)))
    name = f"icon-portfolio-{px}.png"
    out = HERE / name
    canvas.save(out, format="PNG", optimize=False, compress_level=9)
    data = out.read_bytes()
    files.append({"sizePx": px, "role": role, "file": name, "background": "brand.beige #F2F1DF" if bg == "beige" else "transparent", "symbolFillRatio": fill_ratio, "cornerRadiusPercent": int(corner * 100), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)})

manifest = {
    "schemaVersion": "1.0",
    "iconSetId": "iconset.landometer.portfolio.symbol.candidate.01",
    "ruleId": "FAVICON-01",
    "property": "portfolio",
    "status": "candidate — pending identity-owner approval of the icon_set role",
    "source": {"file": "montri-th/motif assets/identity/logo/landometer-symbol-color.png", "sha256": hashlib.sha256(src_bytes).hexdigest(), "pixelDimensions": list(src.size), "alphaBoundingBox": list(bbox), "governanceNote": "this file is not listed in motif governance/SHA256SUMS.txt; hash recorded here as observed"},
    "transformations": ["crop to alpha bounding box", "proportional LANCZOS resize", "centre on canvas", "25% rounded corner mask at 16 and 32 (no-op on transparent art)", "opaque brand.beige tile for apple-touch and maskable"],
    "prohibited": ["redraw", "recolor", "distort", "motif or animated variant"],
    "candidateChoices": ["opaque tile background brand.beige #F2F1DF for 180 and 512 (owner may prefer surface.canvas or a product gradient)", "symbol fills 94% of transparent canvases (mirrors the approved 64px example) and 80% of opaque tiles (maskable safe zone)"],
    "generator": "generate-icon-set.py (Pillow " + __import__("PIL").__version__ + ")",
    "files": files,
}
(HERE / "icon-set.candidate.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print(json.dumps([{k: f[k] for k in ("sizePx", "role", "bytes", "sha256")} for f in files], indent=1))
