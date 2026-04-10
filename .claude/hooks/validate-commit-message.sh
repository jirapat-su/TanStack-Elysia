#!/bin/bash
COMMIT_MSG=$(jq -r '.tool_input.command' | grep -oP "(?<=-m \")[^\"]+|(?<=-m ')[^']+")

if [ -n "$COMMIT_MSG" ] && ! echo "$COMMIT_MSG" | grep -qP '^(feat|fix|docs|style|refactor|perf|test|chore)\(.+\): .+'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Commit message must follow format: type(scope): subject. Types: feat/fix/docs/style/refactor/perf/test/chore"}}'
fi
