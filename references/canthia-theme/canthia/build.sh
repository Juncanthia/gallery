#!/usr/bin/env bash
# Build canthia.css and canthia-dark.css from modular source files.
# Usage: cd themes/canthia && bash build.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
OUT_LIGHT="$SCRIPT_DIR/../canthia.css"
OUT_DARK="$SCRIPT_DIR/../canthia-dark.css"

HEADER_LIGHT="/*
 * Canthia Theme for Typora
 * A clean document-style theme for readable Markdown, LaTeX math, tables, and code.
 * Built from modular sources — edit files in canthia/src/, then run build.sh.
 */"

HEADER_DARK="/*
 * Canthia Dark Theme for Typora
 * Dark variant of the Canthia theme.
 * Built from modular sources — edit files in canthia/src/, then run build.sh.
 */"

# Build light theme (uses _variables.css, skips dark-only files)
{
    echo "$HEADER_LIGHT"
    echo ""
    for f in "$SRC_DIR"/_*.css; do
        case "$(basename "$f")" in
            _variables-dark.css|_*-dark.css) continue ;;
        esac
        echo ""
        cat "$f"
    done
} > "$OUT_LIGHT"

# Build dark theme (uses _variables-dark.css, skips _variables.css)
{
    echo "$HEADER_DARK"
    echo ""
    for f in "$SRC_DIR"/_*.css; do
        [[ "$(basename "$f")" == "_variables.css" ]] && continue
        echo ""
        cat "$f"
    done
} > "$OUT_DARK"

LINES_L=$(wc -l < "$OUT_LIGHT")
LINES_D=$(wc -l < "$OUT_DARK")
echo "Built $OUT_LIGHT ($LINES_L lines)"
echo "Built $OUT_DARK ($LINES_D lines)"
