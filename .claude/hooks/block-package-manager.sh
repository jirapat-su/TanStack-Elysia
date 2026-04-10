#!/bin/bash
COMMAND=$(jq -r '.tool_input.command')
MANAGER=$(echo "$COMMAND" | grep -oP '^(npm|yarn|pnpm)')

if [ -n "$MANAGER" ]; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Use bun, not $MANAGER. Project rule: Bun only.\"}}"
fi
