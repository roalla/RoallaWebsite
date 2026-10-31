from __future__ import annotations

import argparse
import io
import json
import shutil
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, black
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


def overlay_page(width: float, height: float, logo: ImageReader, layout: str, page_index: int):
    stream = io.BytesIO()
    c = canvas.Canvas(stream, pagesize=(width, height))
    if layout == "standard":
        if page_index == 0:
            c.setFillColor(black)
            c.rect(69.5, height - 81.0, 22.0, 22.0, stroke=0, fill=1)
            c.drawImage(logo, 71.5, height - 79.0, 18.0, 18.0, preserveAspectRatio=True, mask="auto")
        else:
            c.setFillColor(black)
            c.rect(60.5, height - 42.0, 20.0, 20.0, stroke=0, fill=1)
            c.drawImage(logo, 62.0, height - 40.5, 17.0, 17.0, preserveAspectRatio=True, mask="auto")
    elif layout == "light":
        c.setFillColor(Color(244 / 255, 247 / 255, 251 / 255))
        c.rect(49.0, height - 36.5, 19.5, 19.5, stroke=0, fill=1)
        c.drawImage(logo, 50.5, height - 35.0, 16.5, 16.5, preserveAspectRatio=True, mask="auto")
    else:
        raise ValueError(f"Unknown layout: {layout}")
    c.save()
    stream.seek(0)
    return PdfReader(stream).pages[0]


def update_pdf(source: Path, destination: Path, logo: ImageReader, layout: str) -> dict[str, object]:
    reader = PdfReader(source)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    for index, page in enumerate(writer.pages):
        box = page.mediabox
        width = float(box.width)
        height = float(box.height)
        page.merge_page(overlay_page(width, height, logo, layout, index), over=True)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as handle:
        writer.write(handle)

    verify = PdfReader(destination)
    if len(verify.pages) != len(reader.pages):
        raise RuntimeError(f"Page-count verification failed for {destination.name}")
    return {
        "source": str(source),
        "output": str(destination),
        "pages": len(reader.pages),
        "layout": layout,
        "status": "logo replaced",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--private-dir", type=Path, required=True)
    parser.add_argument("--ucaas-source", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--logo", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    args = parser.parse_args()

    logo = ImageReader(str(args.logo))
    private_pdfs = sorted(args.private_dir.glob("*.pdf"), key=lambda path: path.name)
    if len(private_pdfs) != 49:
        raise RuntimeError(f"Expected 49 published private PDFs, found {len(private_pdfs)}")

    results = []
    for source in private_pdfs:
        layout = "light" if source.name == "web-development-digital-experience-outlook-2027.pdf" else "standard"
        results.append(update_pdf(source, args.output_dir / source.name, logo, layout))

    ucaas_output = args.output_dir / args.ucaas_source.name
    shutil.copy2(args.ucaas_source, ucaas_output)
    ucaas_pages = len(PdfReader(ucaas_output).pages)
    results.append({
        "source": str(args.ucaas_source),
        "output": str(ucaas_output),
        "pages": ucaas_pages,
        "layout": "distinct outlook design",
        "status": "carried forward unchanged; no legacy butterfly mark present",
    })

    args.manifest.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps({"processed": len(results), "updated": 49, "carried_forward": 1}))


if __name__ == "__main__":
    main()
