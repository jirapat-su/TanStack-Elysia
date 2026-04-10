#!/bin/bash
FILE=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')

if [ -n "$FILE" ] && [ -f "$FILE" ]; then
  LINES=$(wc -l < "$FILE")
  if [ "$LINES" -gt 500 ]; then
    echo "WARNING: $FILE has $LINES lines (max 500). Split this file."
  fi
fi
