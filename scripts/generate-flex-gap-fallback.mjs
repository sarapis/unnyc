/**
 * generate-flex-gap-fallback — writes src/app/flex-gap-fallback.css.
 *
 * WHY. `gap` in a FLEX container landed in Safari 14.1 and Chrome 84. In grid
 * it is much older, so only the flex ones are a problem. This site has 97 flex
 * rules using gap; on Safari 13.1-14.0 every one of them loses its spacing and
 * the children bunch together. That is the binding constraint on how far back
 * the CSS goes, now that the cascade layers are out (see base.css).
 *
 * ⚠ WHY A GENERATED SNAPSHOT AND NOT A POSTCSS PLUGIN. Same reasoning as
 * content/world-atlas.json and the other snapshots in this repo: the output is
 * reviewable in a diff, the build has no new moving part, and a plugin that
 * rewrites the cascade at build time is exactly the kind of thing that made the
 * @layer problem invisible for so long. Run this script, read the diff.
 *
 *     node scripts/generate-flex-gap-fallback.mjs
 *
 * ⚠ WHY A CLASS AND NOT @supports. You cannot feature-detect flex gap in CSS.
 * Safari 13.1 supports `gap` in grid, so `@supports (gap: 1px)` is TRUE there
 * even though flex gap does nothing. The detection has to be JS measuring a
 * real flex box — see UnnycFlexGapProbe in layout.js — which sets
 * `.no-flexgap` on <html>. Everything generated here is scoped under that
 * class, so a browser that supports flex gap NEVER sees any of it.
 *
 * ⚠ THE FALLBACK IS MARGINS, AND IT IS NOT PIXEL-IDENTICAL.
 *   - non-wrapping row    -> `> * + * { margin-left: <column-gap> }`
 *   - non-wrapping column -> `> * + * { margin-top: <row-gap> }`
 *   - wrapping            -> `> * { margin-right: <col>; margin-bottom: <row> }`
 * The wrapping case deliberately uses TRAILING margins rather than the classic
 * negative-margin-on-the-parent trick. Negative margins reproduce the spacing
 * exactly but shift the container's own box, which overflows ancestors and is
 * the usual source of "the fallback broke the layout" bugs. Trailing margins
 * cost a little dead space after the last item in a wrapped row and never move
 * the container. On a browser this old, "slightly loose" beats "subtly broken".
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const OUT = join(SRC, 'app', 'flex-gap-fallback.css');

const cssFiles = (dir) =>
    readdirSync(dir).flatMap((e) => {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) return cssFiles(p);
        return e.endsWith('.css') && !p.endsWith('flex-gap-fallback.css') ? [p] : [];
    });

/** Blank comments in place so offsets stay aligned with the original file. */
const blankComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

function matchBrace(s, i) {
    let d = 0;
    for (let j = i; j < s.length; j += 1) {
        if (s[j] === '{') d += 1;
        else if (s[j] === '}') {
            d -= 1;
            if (d === 0) return j;
        }
    }
    return s.length;
}

/** Split a shorthand value on TOP-LEVEL spaces, so var(--a, 1rem) stays whole. */
function topLevelParts(v) {
    const out = [];
    let depth = 0;
    let cur = '';
    for (const ch of v.trim()) {
        if (ch === '(') depth += 1;
        if (ch === ')') depth -= 1;
        if (ch === ' ' && depth === 0) {
            if (cur) out.push(cur);
            cur = '';
        } else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
}

const decl = (body, prop) => {
    const m = body.match(new RegExp(`(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`, 'i'));
    return m ? m[1].trim() : null;
};

const rules = [];
const flexShapes = new Map();

/** Walk a stylesheet, carrying the stack of enclosing at-rules. */
function walk(css, atStack, file) {
    let i = 0;
    while (i < css.length) {
        const brace = css.indexOf('{', i);
        if (brace === -1) return;
        const header = css.slice(i, brace).trim();
        const end = matchBrace(css, brace);
        const body = css.slice(brace + 1, end);
        if (header.startsWith('@')) {
            // Only descend into conditional groups; keyframes have no selectors we want.
            if (/^@(media|supports|layer)/i.test(header)) walk(body, [...atStack, header], file);
        } else if (header) {
            const display = decl(body, 'display');
            const isFlex = display && /^(inline-)?flex$/i.test(display.trim());
            const gap = decl(body, 'gap');
            const rowGap = decl(body, 'row-gap');
            const colGap = decl(body, 'column-gap');
            /* Remember every selector that is a flex container, so a gap set on
               it LATER — typically `gap: 0` or a smaller gap inside a media
               query — is recognised even though that block does not repeat
               `display: flex`. Missing those was a real bug: the mobile nav
               drawer sets `gap: 0`, and without the override the fallback left
               a 2rem margin on every link in it. */
            if (isFlex) {
                for (const part of header.split(',').map((x) => x.trim().replace(/\s+/g, ' '))) {
                    if (part) {
                        flexShapes.set(part, {
                            column: /column/i.test(decl(body, 'flex-direction') || 'row'),
                            wrap: /wrap(?!-reverse)/i.test(decl(body, 'flex-wrap') || ''),
                        });
                    }
                }
            }
            const knownFlex = header
                .split(',')
                .map((x) => x.trim().replace(/\s+/g, ' '))
                .some((x) => flexShapes.has(x));
            if ((isFlex || knownFlex) && (gap || rowGap || colGap)) {
                let row = rowGap;
                let col = colGap;
                if (gap) {
                    const parts = topLevelParts(gap);
                    row = row || parts[0];
                    col = col || parts[1] || parts[0];
                }
                const firstPart = header.split(',')[0].trim().replace(/\s+/g, ' ');
                const base = flexShapes.get(firstPart) || { column: false, wrap: false };
                const ownDir = decl(body, 'flex-direction');
                const ownWrap = decl(body, 'flex-wrap');
                rules.push({
                    file: relative(ROOT, file),
                    at: atStack,
                    depth: atStack.length,
                    selector: header.replace(/\s+/g, ' '),
                    row,
                    col,
                    column: ownDir ? /column/i.test(ownDir) : base.column,
                    wrap: ownWrap ? /wrap(?!-reverse)/i.test(ownWrap) : base.wrap,
                });
            }
        }
        i = end + 1;
    }
}

for (const f of cssFiles(SRC)) walk(blankComments(readFileSync(f, 'utf8')), [], f);

/** Prefix every comma-separated part with .no-flexgap AND give every part the
 *  child combinator. ⚠ Appending the combinator to the joined string instead
 *  silently applies it to the LAST part only — `a, b > * + *` leaves `a`
 *  matching the container itself and margining the wrong box. */
const scope = (sel, suffix) =>
    sel
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `.no-flexgap ${p}${suffix}`)
        .join(',\n');

const lines = [];
lines.push('/* GENERATED by scripts/generate-flex-gap-fallback.mjs — DO NOT EDIT BY HAND.');
lines.push(' *');
lines.push(' * Margin spacing for browsers without flex `gap` (Safari < 14.1, Chrome < 84).');
lines.push(' * Scoped under `.no-flexgap`, which only the JS probe in layout.js ever sets,');
lines.push(' * so a browser with flex gap never matches a single rule in this file.');
lines.push(' *');
lines.push(' * Read the generator header for why this is a checked-in snapshot, why the');
lines.push(' * detection cannot be @supports, and why the wrapping case uses trailing');
lines.push(' * margins rather than negative margins.');
lines.push(' */');
lines.push('');

let emitted = 0;
rules.sort((a, b) => a.depth - b.depth);
const byFile = new Map();
for (const r of rules) {
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push(r);
}

for (const [file, list] of [...byFile.entries()].sort()) {
    lines.push(`/* ---- from ${file} ---- */`);
    for (const r of list) {
        const open = r.at.map((a, i) => `${'  '.repeat(i)}${a} {`);
        const pad = '  '.repeat(r.at.length);
        const ind = (s) => s.split('\n').map((l) => pad + l).join('\n');
        lines.push(...open);
        /* ⚠ EVERY rule states ALL FOUR margins on BOTH selector shapes, even
           the zeroes. A later rule (a media query lowering or zeroing the gap,
           or flipping direction/wrap) must be able to REPLACE an earlier one
           completely. Emitting only the axis in use leaves the other axis set
           by the base rule: the mobile nav drawer turns column with `gap: 0`,
           and a partial override left every drawer link still carrying the
           1.75rem margin-left from the desktop row. */
        const wrapCol = r.wrap ? r.col || '0' : '0';
        const wrapRow = r.wrap ? r.row || '0' : '0';
        const flowLeft = !r.wrap && !r.column ? r.col || '0' : '0';
        const flowTop = !r.wrap && r.column ? r.row || '0' : '0';
        lines.push(ind(`${scope(r.selector, ' > *')} {`));
        lines.push(ind(`  margin-right: ${wrapCol};`));
        lines.push(ind(`  margin-bottom: ${wrapRow};`));
        lines.push(ind('}'));
        lines.push(ind(`${scope(r.selector, ' > * + *')} {`));
        lines.push(ind(`  margin-left: ${flowLeft};`));
        lines.push(ind(`  margin-top: ${flowTop};`));
        lines.push(ind('}'));
        for (let i = r.at.length - 1; i >= 0; i -= 1) lines.push(`${'  '.repeat(i)}}`);
        lines.push('');
        emitted += 1;
    }
}

writeFileSync(OUT, `${lines.join('\n')}\n`);
const shapes = {
    wrap: rules.filter((r) => r.wrap).length,
    column: rules.filter((r) => !r.wrap && r.column).length,
    row: rules.filter((r) => !r.wrap && !r.column).length,
};
console.log(
    `✓ generate-flex-gap-fallback: ${emitted} flex rules ` +
    `(${shapes.row} row, ${shapes.column} column, ${shapes.wrap} wrapping) -> ${relative(ROOT, OUT)}`,
);
