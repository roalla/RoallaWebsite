from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

from pypdf import PdfReader


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalized_text(page) -> str:
    return re.sub(r"\s+", " ", page.extract_text() or "").strip()


def verify_docx(manifest_path: Path) -> list[dict[str, object]]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    results = []
    for item in manifest["documents"]:
        source = Path(item["source"])
        output = Path(item["output"])
        replaced = set(item["replaced_entries"])
        with zipfile.ZipFile(source) as before, zipfile.ZipFile(output) as after:
            before_names = set(before.namelist())
            after_names = set(after.namelist())
            if before_names != after_names:
                raise RuntimeError(f"DOCX package entries changed for {output.name}")
            changed = {
                name for name in before_names
                if digest(before.read(name)) != digest(after.read(name))
            }
        if changed != replaced:
            raise RuntimeError(
                f"Unexpected DOCX changes for {output.name}: changed={sorted(changed)} expected={sorted(replaced)}"
            )
        results.append({"file": output.name, "changed_entries": sorted(changed), "status": "pass"})
    return results


def original_for(output: Path, private_dir: Path, ucaas_source: Path) -> Path:
    if output.name == ucaas_source.name:
        return ucaas_source
    return private_dir / output.name


def verify_pdfs(pdf_dir: Path, private_dir: Path, ucaas_source: Path) -> tuple[list[dict[str, object]], int]:
    outputs = sorted(pdf_dir.glob("*.pdf"), key=lambda p: p.name)
    if len(outputs) != 50:
        raise RuntimeError(f"Expected 50 PDFs, found {len(outputs)}")
    results = []
    total_pages = 0
    for output in outputs:
        original = original_for(output, private_dir, ucaas_source)
        if not original.exists():
            raise RuntimeError(f"Missing comparison PDF for {output.name}")
        before = PdfReader(original)
        after = PdfReader(output)
        if len(before.pages) != len(after.pages):
            raise RuntimeError(
                f"Page count changed for {output.name}: {len(before.pages)} -> {len(after.pages)}"
            )
        mismatched_text_pages = []
        for index, (before_page, after_page) in enumerate(zip(before.pages, after.pages), start=1):
            if normalized_text(before_page) != normalized_text(after_page):
                mismatched_text_pages.append(index)
        if mismatched_text_pages:
            raise RuntimeError(f"Visible text changed in {output.name}, pages {mismatched_text_pages}")
        pages = len(after.pages)
        total_pages += pages
        results.append({
            "file": output.name,
            "pages": pages,
            "text_pages_matched": pages,
            "status": "pass",
        })
    return results, total_pages


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--docx-manifest", type=Path, required=True)
    parser.add_argument("--pdf-dir", type=Path, required=True)
    parser.add_argument("--private-dir", type=Path, required=True)
    parser.add_argument("--ucaas-source", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    docx = verify_docx(args.docx_manifest)
    pdf, total_pages = verify_pdfs(args.pdf_dir, args.private_dir, args.ucaas_source)
    report = {
        "docx_count": len(docx),
        "pdf_count": len(pdf),
        "pdf_total_pages": total_pages,
        "docx_package_verification": docx,
        "pdf_verification": pdf,
    }
    args.report.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({
        "docx_verified": len(docx),
        "pdf_verified": len(pdf),
        "pdf_total_pages": total_pages,
    }))


if __name__ == "__main__":
    main()
