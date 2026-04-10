#!/bin/bash
FILE=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')

if [ -n "$FILE" ] && [ -f "$FILE" ] && echo "$FILE" | grep -q 'apps/api/'; then
  if grep -Pn 'new Elysia\(\s*\)' "$FILE" 2>/dev/null; then
    echo "ERROR: new Elysia() without arguments. Every Elysia instance MUST have a name property."
  elif grep -Pn 'new Elysia\(\{[^}]*\}' "$FILE" 2>/dev/null | grep -Pv 'name\s*:' ; then
    echo "ERROR: new Elysia({...}) without name property. Every Elysia instance MUST have a name."
  fi

  if echo "$FILE" | grep -q '\.handler\.ts$'; then
    if grep -Pn '\.(get|post|put|patch|delete)\(' "$FILE" 2>/dev/null | grep -v 'detail' >/dev/null; then
      if ! grep -q 'detail' "$FILE" 2>/dev/null; then
        echo "WARNING: Handler route missing 'detail' property. Every route MUST have detail with tags, summary, and description for OpenAPI."
      fi
    fi
  fi
fi
