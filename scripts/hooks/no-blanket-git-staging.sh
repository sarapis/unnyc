#!/usr/bin/env bash
# PreToolUse(Bash) guard: refuse blanket git staging in this repo.
#
# WHY. More than one Claude session gets run against ~/Antigravity/unnyc at a
# time. On 2026-08-06 a concurrent session's files ended up STAGED in the middle
# of another session's commit, and were only caught by reading `git status`
# before committing. `git add -A` is the mechanism; this refuses it.
#
# CLAUDE.md documents the convention. This enforces the one part of it a machine
# can check. See "Another session may be working in this checkout".
#
# Reads the PreToolUse hook payload on stdin, emits a deny decision when the
# command stages indiscriminately, and stays silent (exit 0, no output) for
# everything else — silence means "no opinion", which lets the call proceed.
#
# Deliberately NOT blocked, because they name what they touch:
#   git add <path>          git add .claude/settings.json     git commit -m
#   git add -p              git commit --amend                git add -u <path>

set -uo pipefail

cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0
[ -n "$cmd" ] || exit 0

deny() {
  # permissionDecision=deny is what actually stops the call; the reason is shown
  # to the model so it can re-stage explicitly instead of guessing.
  jq -nc --arg r "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $r
    }
  }'
  exit 0
}

# `git add -A` / `git add --all` / `git add .`
# The trailing (space|end) matters: `git add .claude/settings.json` is a NAMED
# path and must still work. `.` only counts when it stands alone.
if printf '%s' "$cmd" | grep -Eq '(^|[[:space:];&|(])git[[:space:]]+add[[:space:]]+(-A|--all|\.)([[:space:]]|$|[;&|)])'; then
  deny "Blocked: this repo forbids blanket staging — more than one Claude session shares this working tree, and 'git add -A' has already swept another session's files into a commit here once (2026-08-06).

Stage the paths you actually edited, by name:
  git add path/to/one.js path/to/two.css

Then confirm before committing:
  git diff --cached --name-only

See CLAUDE.md, 'Another session may be working in this checkout'."
fi

# `git commit -a`, `-am`, `--all`. A single-dash cluster containing a lowercase
# 'a' counts (-a, -am, -av); `--amend` and `-m` do not — the cluster pattern
# requires exactly one leading dash, so a long option can never match it, and
# `-A` does not either since the 'a' is matched case-sensitively.
#
# The optional middle group must be OPTIONAL and the following space matched
# separately: an earlier version consumed the only space in `git commit -am`
# with `commit[[:space:]]` and then demanded a second one, so every commit case
# silently passed. It was caught by pipe-testing, not by reading it.
#
# Known limitation: a flag-like token inside the message (`-m "use -a here"`)
# trips it. Rare, and a deny is recoverable; over-blocking beats under-blocking.
if printf '%s' "$cmd" | grep -Eq '(^|[[:space:];&|(])git[[:space:]]+commit([[:space:]]+[^;&|]*)?[[:space:]]+(-[a-zA-Z]*a[a-zA-Z]*|--all)([[:space:]]|$|[;&|)])'; then
  deny "Blocked: 'git commit -a' stages every tracked modification, including files another Claude session may be editing in this shared working tree.

Stage explicitly, then commit without -a:
  git add path/to/one.js
  git diff --cached --name-only
  git commit -m \"...\"

See CLAUDE.md, 'Another session may be working in this checkout'."
fi

exit 0
