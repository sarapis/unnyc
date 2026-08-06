#!/usr/bin/env node
/**
 * validate-content.mjs — check every content/*.md before the build reads it.
 *
 * Why this exists
 * ---------------
 * All the site's copy lives in `content/*.md`, and the intended way to edit it
 * is GitHub's web editor — which does no validation at all. A push to `main`
 * deploys straight to production, so one malformed frontmatter file fails the
 * build with an error that points at the wrong line.
 *
 * The bug that prompted this (`cab57e1`, 2026-08-06) was a missing closing
 * quote:
 *
 *     subtitle: "The world's best performing city governments ...do the same.
 *     ctas:
 *       - href: /campaign
 *         label: "Tell NYC to Use Open Source"
 *
 * YAML kept reading that double-quoted scalar until it found the next `"` —
 * the one in front of `Tell` — and reported `bad indentation of a mapping
 * entry` three lines below the actual mistake.
 *
 * What it checks
 * --------------
 *   errors (exit 1, fails the build / CI)
 *     1. frontmatter that does not parse as YAML — reported at the real line
 *     2. a frontmatter line with an odd number of `"` — an unterminated string,
 *        which is the mistake above. Caught whether or not YAML happens to
 *        recover: the nastier variant parses "fine" and silently swallows the
 *        following keys into the string.
 *     3. a `slug:` with no matching `## slug` section, for lists that use the
 *        slug/section convention — `src/lib/content.js` would otherwise throw
 *        `Cannot read properties of undefined` from inside a page component
 *     4. a repeated `### Label` inside one section — they are used as React
 *        keys
 *
 *   warnings (reported, do not fail)
 *     5. a `[text](gloss:slug)` link with no matching term in start.md
 *
 * Deliberately NOT checked: a `## section` with no frontmatter slug. Components
 * pull sections by name (`intro`, `closing`, `letter`, `barcelona`…), so an
 * unreferenced-looking section is usually correct.
 *
 * Run: `npm run lint:content` (also runs as part of `prebuild`).
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const errors = [];
const warnings = [];
const err = (file, line, msg, hint) => errors.push({ file, line, msg, hint });
const warn = (file, line, msg, hint) => warnings.push({ file, line, msg, hint });

/** The frontmatter block's lines, 1-indexed by their position in the file. */
function frontmatterLines(src) {
    const lines = src.split(/\r?\n/);
    if (lines[0]?.trim() !== '---') return null;
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (end === -1) return null;
    return lines.slice(1, end).map((text, i) => ({ text, n: i + 2 }));
}

/**
 * Check 2 — unterminated double-quoted scalars.
 *
 * A YAML line that opens a `"` and never closes it always leaves an odd count.
 * Skipped: whole-line `#` comments (prose in them may quote a phrase), and the
 * body of a block scalar (`key: |` / `key: >-`), which is free text.
 */
function checkQuotes(file, fmLines) {
    let blockIndent = null;
    for (const { text, n } of fmLines) {
        const indent = text.length - text.trimStart().length;

        // Inside a block scalar until we dedent back out of it.
        if (blockIndent !== null) {
            if (text.trim() === '' || indent > blockIndent) continue;
            blockIndent = null;
        }
        if (text.trim().startsWith('#')) continue;
        if (/:\s*[|>][-+\d]*\s*$/.test(text)) {
            blockIndent = indent;
            continue;
        }

        const quotes = (text.match(/(?<!\\)"/g) || []).length;
        if (quotes % 2 === 1) {
            err(
                file,
                n,
                'unterminated double-quoted string (odd number of `"` on this line)',
                `${text.trim().slice(0, 100)}\n     ^ add the missing closing quote. YAML will otherwise keep reading\n       into the lines below, and report an error somewhere else entirely.`,
            );
        }
    }
}

/** Every `## slug` heading in the body, with its line number in the file. */
function bodySections(src) {
    const out = [];
    src.split(/\r?\n/).forEach((text, i) => {
        const m = /^## +(.+)$/.exec(text);
        if (m) out.push({ slug: m[1].trim(), n: i + 1 });
    });
    return out;
}

/** Every array of objects in the frontmatter that carries `slug` keys. */
function slugLists(data) {
    const lists = [];
    (function walk(node) {
        if (Array.isArray(node)) {
            const slugs = node.filter((x) => x && typeof x.slug === 'string').map((x) => x.slug);
            if (slugs.length) lists.push(slugs);
            node.forEach(walk);
        } else if (node && typeof node === 'object') {
            Object.values(node).forEach(walk);
        }
    })(data);
    return lists;
}

/**
 * Check 3 — slugs that need a body section.
 *
 * Scoped per list, and only once a list has proven it uses the convention: if
 * at least one of its slugs has a `## slug` section, they all must. Without
 * that scoping, start.md's ten glossary-term slugs — which are definitions in
 * frontmatter and have no body section by design — would all report.
 */
function checkSlugSections(file, data, sections) {
    const have = new Set(sections.map((s) => s.slug));
    for (const slugs of slugLists(data)) {
        const matched = slugs.filter((s) => have.has(s));
        if (!matched.length) continue;
        for (const slug of slugs) {
            if (have.has(slug)) continue;
            err(
                file,
                null,
                `frontmatter slug "${slug}" has no matching "## ${slug}" section`,
                `the other ${matched.length} slug(s) in this list do have one, so this is the\n       build-crashing case: the page reads sections["${slug}"] and gets undefined.\n       Add a "## ${slug}" block to the body, or drop the frontmatter entry.`,
            );
        }
    }
}

/** Check 4 — `### Label` is a React key, so it must be unique in its section. */
function checkDuplicateLabels(file, body) {
    const parts = body.split(/^## +(.+)$/gm).slice(1);
    for (let i = 0; i < parts.length; i += 2) {
        const seen = new Set();
        for (const m of (parts[i + 1] ?? '').matchAll(/^### +(.+)$/gm)) {
            const label = m[1].trim();
            if (seen.has(label)) {
                err(
                    file,
                    null,
                    `duplicate "### ${label}" inside section "${parts[i].trim()}"`,
                    'sub-block labels are used as React keys, so they must be unique\n       within a section. Reword one of them.',
                );
            }
            seen.add(label);
        }
    }
}

/** Check 5 — glossary references, defined once in start.md `concepts.terms`. */
function glossaryTerms() {
    try {
        const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, 'start.md'), 'utf8'));
        return new Set((data?.concepts?.terms ?? []).map((t) => t.slug).filter(Boolean));
    } catch {
        return null; // start.md's own parse error is already reported
    }
}

function checkGlossary(file, src, terms) {
    if (!terms) return;
    src.split(/\r?\n/).forEach((text, i) => {
        for (const m of text.matchAll(/\]\(gloss:([^)]+)\)/g)) {
            if (!terms.has(m[1])) {
                warn(
                    file,
                    i + 1,
                    `glossary link "gloss:${m[1]}" has no definition`,
                    'terms are defined in content/start.md under concepts.terms.\n       The link still renders, just without its hover definition.',
                );
            }
        }
    });
}

/* --------------------------------------------------------------------------- */

if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`validate-content: no content/ directory at ${CONTENT_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort();
const terms = glossaryTerms();

for (const file of files) {
    const src = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');

    const fmLines = frontmatterLines(src);
    if (!fmLines) {
        err(file, 1, 'no YAML frontmatter block', 'the file must open with `---` and close it before the markdown body.');
        continue;
    }

    // Quote check first: it names the real line, where the YAML error will not.
    checkQuotes(file, fmLines);

    let parsed;
    try {
        parsed = matter(src);
    } catch (e) {
        // js-yaml puts the location on `mark`; its line is 0-indexed within
        // the frontmatter block, which itself starts on file line 2.
        const line = e.mark?.line != null ? e.mark.line + 2 : null;
        const source = line != null ? src.split(/\r?\n/)[line - 1] : null;
        err(
            file,
            line,
            `frontmatter is not valid YAML — ${(e.reason || e.message || '').split('\n')[0]}`,
            source
                ? `${source.trim().slice(0, 100)}\n       Note YAML often reports the line where it gave up, not the line with\n       the mistake — check the lines above this one too.`
                : undefined,
        );
        continue;
    }

    checkSlugSections(file, parsed.data, bodySections(src));
    checkDuplicateLabels(file, parsed.content);
    checkGlossary(file, src, terms);
}

const show = (list, label) => {
    for (const { file, line, msg, hint } of list) {
        console.error(`\n  ${label} content/${file}${line ? `:${line}` : ''}`);
        console.error(`     ${msg}`);
        if (hint) console.error(`     ${hint}`);
    }
};

if (errors.length) show(errors, '✗');
if (warnings.length) show(warnings, '!');

const n = files.length;
if (errors.length) {
    console.error(
        `\n✗ validate-content: ${errors.length} error(s) in ${n} content file(s). The build would fail.\n`,
    );
    process.exit(1);
}
console.log(
    `✓ validate-content: ${n} content files parse and resolve` +
        (warnings.length ? ` — ${warnings.length} warning(s) above.` : '.'),
);
