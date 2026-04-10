#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" && bunx turbo run lint 2>&1 | tail -20
