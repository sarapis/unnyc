# Editing the words on this site

## TL;DR

Open the file in **`content/`** for the page you want to change, edit the words,
commit. That's the live page.

| Page | File |
|---|---|
| `/` | [`content/home.md`](../content/home.md) |
| `/start` | [`content/start.md`](../content/start.md) |
| `/principles` | [`content/principles.md`](../content/principles.md) |
| `/principles/document` | [`content/principles.md`](../content/principles.md) (shared) |
| `/crosswalk` | [`content/crosswalk.md`](../content/crosswalk.md) |
| `/success` | [`content/success.md`](../content/success.md) |
| `/campaign` | [`content/campaign.md`](../content/campaign.md) |
| `/campaign/sign` | [`content/sign.md`](../content/sign.md) |
| `/campaign/endorse` | [`content/endorse.md`](../content/endorse.md) |
| `/campaign/endorse/document` | [`content/principles.md`](../content/principles.md) (shares the principles) |
| `/resources` | [`content/resources.md`](../content/resources.md) |
| `/resources/guide` | [`content/guide.md`](../content/guide.md) |
| `/contact` | [`content/contact.md`](../content/contact.md) |

Site chrome (nav labels, footer) is still in components — see
[CONTENT-MAP.md](CONTENT-MAP.md).

No build step to run, no CMS to log into, nothing to keep in sync — the site
reads that file directly. If you'd rather hand it to an agent: edit the file (or
just describe what you want) and point at [`content/crosswalk.md`](../content/crosswalk.md).

> **Edit through a pull request, not straight into `main`.** A push to `main`
> deploys to production immediately. On a PR, the `Validate content` check runs
> in seconds and tells you if the frontmatter is malformed *before* it can take
> the build down. Run it yourself with `npm run lint:content`.

> **Status:** every page is converted. `content/` is the whole site's copy.

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
- **Mind your quotes.** Every `"` needs its partner. Leave one off and YAML
  keeps reading into the lines below, swallowing whatever follows into the
  string — sometimes failing the build with an error pointing at the *wrong*
  line, sometimes parsing "fine" and quietly dropping a whole key. This broke a
  deploy on 2026-08-06. `npm run lint:content` now catches both shapes and names
  the real line; it runs before every build, and on every push and pull request.

## How it works, in three files

| File | Role |
|---|---|
| [`content/crosswalk.md`](../content/crosswalk.md) | The words. This is what you edit. |
| [`src/lib/content.js`](../src/lib/content.js) | Parses frontmatter (`gray-matter`), renders markdown (`marked`), splits the body on `## slug`, and applies the link/blockquote conventions above. |
| [`src/app/crosswalk/page.js`](../src/app/crosswalk/page.js) | Layout only — no copy. Maps the parsed content onto the page's components and CSS classes. |

The original prose was lifted out of the JSX mechanically (not retyped), and the
result was diffed against the previously deployed page: same words, same
structure, same links. The only change is that one paragraph the old JSX split
into two text nodes is now a single clean paragraph.

## Markers

Some pages place a structured block mid-prose. Write the marker on its own line:

| Marker | Page | Renders |
|---|---|---|
| `{{stats}}` | `success.md` | The three-stat row inside a case study |
| `{{principles}}` | `sign.md` | The eight principles list, from [`content/principles.md`](../content/principles.md) — the single source every listing shares |

## Shared content

- **The eight Principles** live once, in [`content/principles.md`](../content/principles.md), and every
  surface derives from it. See below.
- **Glossary definitions** live in [`content/start.md`](../content/start.md) under `concepts.terms`.
  A `[term](gloss:slug)` link anywhere on the site picks up its definition from
  there as a hover tooltip, so there's one place to edit a definition.
### The eight Principles — single-sourced

[`content/principles.md`](../content/principles.md) is the only place they live. Three surfaces render from
it and none holds a copy:

| Surface | Shape it gets |
|---|---|
| `/principles` (the two sections) | `groupsGrid`, `title` |
| `/principles/document` | `groupsDocument`, `titleDocument` or `title`, `descDocument` or `desc` |
| `/campaign/sign` (the open letter) | Flat 1–8 by `n`, `titleCanonical`, `descShort` |
| `/campaign/endorse/document` | `groupsGrid`, `titleCanonical`, `descCity` or `desc` |

Each principle carries several surface forms. **They are variants on purpose** —
a different thing from the drift they replaced. Until 2026-08-06 these were three
hand-maintained copies and had diverged: the letter said "Foster inclusion" and a
bare "RISE" where everywhere else used the full names, and a stray Oxford comma
had appeared in the declaration.

| Field | Why it exists |
|---|---|
| `n` | The UN's own number — drives the icon and the letter's ordering (the groups deliberately reorder: 3,5,6 / 4,7 / 2,8) |
| `title` | The `/principles` grid's wording, and its alone. Was the gerund form while the group headings demanded it ("Building Good Software that is… *Well documented*"); the headings were shortened on 2026-08-14, so these are now plain forms |
| `titleCanonical` | The UN's own name, for anywhere the principle stands alone |
| `desc` | The full description |
| `descShort` | Terse one-liner for the letter's numbered list, where the full text would swamp the line |
| `descCity` | Optional NYC rewording for the declaration, where the City commits rather than the UN. Only #8 needs it today; falls back to `desc` |
| `titleDocument` / `descDocument` | Optional, **`/principles/document` only**. That page was rewritten into the imperative on 2026-08-14 ("Make security a priority", not "Making") and retitles four principles. Without these fields that edit would also have rewritten the grid, the letter and the declaration. Both fall back |
| `body` | The line shown when a principle renders as a **full-width lead card**. #1 and #2 have one, because each opens a section of `/principles` |

### Groupings are slug references

Two keys decide how the eight are grouped, and both list **slugs**, not objects:

| Key | Drives |
|---|---|
| `groupsGrid` | `/principles` (Software Principles / Community Principles) **and** `/campaign/endorse/document` |
| `groupsDocument` | `/principles/document` only |

⚠ **Never regroup by moving a principle between `groups[].items`.** That array holds
the objects, and it is *flattened* for the open letter and for `/principles`' own
detail sections and rail — so moving an object is how a principle silently vanishes
from a surface that only flattens. Edit the slug lists instead. `principlesResolve()`
**throws** on an unknown slug, because `lint:content` does not check these refs and a
typo would otherwise drop a principle from a printed page with a green build.

**To change a principle's wording, edit [`content/principles.md`](../content/principles.md).** The reshaping
lives in `principlesFlat()`, `principlesDeclaration()` and `principlesResolve()` in
[`src/lib/content.js`](../src/lib/content.js).

### The endorser directory — data, not copy

`/principles` closes on **150 organizations** from
[`content/un-endorsers.json`](../content/un-endorsers.json), filterable by sector and paginated 16 a page.

Only the *copy* is in `content/principles.md` (`endorsers.title`, `lede`, the filter
and pagination labels, the note and the source link). The list itself is data.

- **Counts are DERIVED in the component, never authored.** Do not write a total into
  the copy — a refreshed snapshot would leave the page claiming a number it no longer
  shows. (The lede currently says "Hundreds" over a countable 150; that is a known
  owner decision, not an oversight.)
- **No logos**, deliberately: third-party trademarks, and the UN displaying them
  grants no onward rights.
- **The names are a transcription** read off the logos — the UN page publishes no
  names at all. Spot-check anything user-facing, and record any fix in the file's
  `corrections` array rather than editing silently.
