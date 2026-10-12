"""Check local Markdown file targets, without network or third-party packages."""
from pathlib import Path
import re
import sys
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
errors = []
links = 0
excluded = {"node_modules", "dist", "test-results", "playwright-report", ".git"}
files = [p for p in root.parent.rglob("*.md") if not any(part in excluded for part in p.parts)]
for path in files:
    for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", path.read_text()):
        target = target.strip().split(' "')[0].strip("<>")
        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target) or target.startswith("#"):
            continue
        target = unquote(target.split("#")[0])
        if not target:
            continue
        links += 1
        if not (path.parent / target).is_file():
            errors.append(f"{path.relative_to(root.parent)}: missing {target}")
if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"Checked {links} local file links across {len(files)} Markdown files; 0 missing targets")
