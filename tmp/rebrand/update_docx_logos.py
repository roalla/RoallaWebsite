from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import tempfile
import zipfile
from pathlib import Path


REL_TARGET_RE = re.compile(rb'Target="([^"]+)"')


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def header_image_entries(zf: zipfile.ZipFile) -> set[str]:
    targets: set[str] = set()
    for name in zf.namelist():
        if not re.fullmatch(r"word/_rels/header\d+\.xml\.rels", name):
            continue
        rels = zf.read(name)
        for match in REL_TARGET_RE.finditer(rels):
            target = match.group(1).decode("utf-8")
            entry = target.lstrip("/") if target.startswith("/") else f"word/{target}"
            targets.add(entry)
    return targets


def unique_source_docs(source_dir: Path) -> list[Path]:
    docs = []
    for path in sorted(source_dir.glob("*.docx"), key=lambda p: p.name.lower()):
        if re.search(r" \(1\)$", path.stem):
            continue
        docs.append(path)
    return docs


def find_reference_logo_hash(reference_doc: Path) -> str:
    with zipfile.ZipFile(reference_doc) as zf:
        entries = header_image_entries(zf)
        hashes = {sha256(zf.read(name)) for name in entries if name in zf.namelist()}
    if len(hashes) != 1:
        raise RuntimeError(f"Expected one header-logo hash in {reference_doc.name}, found {len(hashes)}")
    return next(iter(hashes))


def update_doc(source: Path, destination: Path, old_hash: str, new_logo: bytes) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(source, "r") as zin:
        targets = header_image_entries(zin)
        replacements = {
            name for name in targets
            if name in zin.namelist() and sha256(zin.read(name)) == old_hash
        }
        if not replacements:
            raise RuntimeError(f"No matching header logo found in {source.name}")

        temp_fd, temp_name = tempfile.mkstemp(suffix=".docx", dir=destination.parent)
        os.close(temp_fd)
        temp_path = Path(temp_name)
        try:
            with zipfile.ZipFile(temp_path, "w") as zout:
                for item in zin.infolist():
                    data = new_logo if item.filename in replacements else zin.read(item.filename)
                    zout.writestr(item, data)
            temp_path.replace(destination)
        finally:
            if temp_path.exists():
                temp_path.unlink()

    with zipfile.ZipFile(destination, "r") as verify:
        verified_targets = header_image_entries(verify)
        header_hashes = {
            sha256(verify.read(name))
            for name in verified_targets
            if name in verify.namelist()
        }
    new_hash = sha256(new_logo)
    if old_hash in header_hashes or new_hash not in header_hashes:
        raise RuntimeError(f"Header verification failed for {destination.name}")

    return {
        "source": str(source),
        "output": str(destination),
        "replaced_entries": sorted(replacements),
        "header_hashes_after": sorted(header_hashes),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--logo", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    args = parser.parse_args()

    docs = unique_source_docs(args.source_dir)
    if len(docs) != 45:
        raise RuntimeError(f"Expected 45 unique DOCX sources, found {len(docs)}")

    reference = next(path for path in docs if "AI_Readiness_and_Governance" in path.name)
    old_hash = find_reference_logo_hash(reference)
    new_logo = args.logo.read_bytes()
    results = []
    for source in docs:
        results.append(update_doc(source, args.output_dir / source.name, old_hash, new_logo))

    payload = {
        "source_count": len(docs),
        "old_logo_sha256": old_hash,
        "new_logo_sha256": sha256(new_logo),
        "documents": results,
    }
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps({
        "updated": len(results),
        "old_logo_sha256": old_hash,
        "new_logo_sha256": sha256(new_logo),
    }))


if __name__ == "__main__":
    main()
