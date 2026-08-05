# Editing the words on this site

## TL;DR

Open **`content/crosswalk.md`**, change the words, commit. That's the live page.

No build step to run, no CMS to log into, nothing to keep in sync — the site
reads that file directly. If you'd rather hand it to an agent: edit the file (or
just describe what you want) and point at `content/crosswalk.md`.

> **Status:** `/crosswalk` is the first page converted, as a sample. Every other
> page still has its copy in `src/data/unnyc-primer.js` or hardcoded in JSX —
> see [CONTENT-MAP.md](CONTENT-MAP.md). If this pattern works for you, the rest
> can follow.

## How a content file is laid out

Two halves: **frontmatter** (between the `---` lines) for structure, and a
**markdown body** for prose.

```markdown
---
title: "New York Runs on Software It Doesn't Control"     # the <h1>
lede: "Who pays for vendor reliance today..."             # intro paragraph
meta:                                                    # browser + social
  title: "Why Open Source Matters to NYC — UNNYC"
  description: "..."
principles:                                              # the 8 sections,
  - slug: open-by-default                                # in display order
    icon: 1                                              # /principle-icons/princ1.png
    number: 1
    title: "Open by Default"
closingTitle: "Why New York Is Central to This Movement"
foot:
  text: "Convinced? Here's what it's already won other cities."
  ctas:
    - href: /success
      label: "See what success looks like →"
      style: primary                                     # primary | outline
---

## intro

### Who Pays for Vendor Reliance?

Every city agency runs on software...

## open-by-default

UN Open Source Principle #1 reverses the usual burden of proof...

### The Gap to Close

PIT Crew is already built to work this way...
```

### The rules

| You write | You get |
|---|---|
| `## some-slug` | Starts a section. Must match a `slug:` in frontmatter (plus `intro` and `closing`) |
| `### Any Label` | A sub-block. On a principle, `### The Gap to Close` renders the highlighted gap panel; in the intro it becomes a section heading |
| blank line between paragraphs | Separate `<p>`s |
| `**bold**`, `*italic*` | Bold / italic |
| `[text](https://example.com)` | External link — automatically opens in a new tab |
| `[text](/start)` or `[text](#anchor)` | Internal / in-page link — stays in the tab |
| `[text](gloss:ospo)` | A glossary term, styled and linked to that entry |
| `> quote` then `>` then `> — Source, [link](url)` | Pull-quote; the em-dash line becomes the `<cite>` |

Curly quotes and em-dashes: just type them (`'`, `"`, `—`). No `&rsquo;` escapes,
no `{' '}` spacing glue — that was the old JSX tax.

## Common edits

**Change a heading or paragraph** — find it in the body and type over it.

**Reorder the eight principles** — reorder the `principles:` list in
frontmatter. The body sections can stay in any order; display order follows
frontmatter.

**Add a ninth section** — add an entry to `principles:` with a new `slug`, then
add a matching `## your-slug` block in the body.

**Change the page title in search results / social** — edit `meta:`.
The visible `<h1>` is `title:`, which is separate on purpose.

## Gotchas

- **A `## slug` with no frontmatter entry won't render.** The frontmatter list
  drives what appears; the body only supplies the words.
- **Conversely, a frontmatter slug with no `## slug` section will crash the
  build** with `Cannot read properties of undefined`. That's deliberate — a loud
  failure beats a silently blank section.
- **`### ` labels are used as React keys**, so don't repeat the same label twice
  inside one section.
- **`getContent()` is server-only** (it reads the filesystem). Import it in
  Server Components only — never in a `"use client"` file.

## How it works, in three files

| File | Role |
|---|---|
| `content/crosswalk.md` | The words. This is what you edit. |
| `src/lib/content.js` | Parses frontmatter (`gray-matter`), renders markdown (`marked`), splits the body on `## slug`, and applies the link/blockquote conventions above. |
| `src/app/crosswalk/page.js` | Layout only — no copy. Maps the parsed content onto the page's components and CSS classes. |

The original prose was lifted out of the JSX mechanically (not retyped), and the
result was diffed against the previously deployed page: same words, same
structure, same links. The only change is that one paragraph the old JSX split
into two text nodes is now a single clean paragraph.
