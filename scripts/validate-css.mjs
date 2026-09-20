/**
 * validate-css — guards the CSS browser-support floor.
 *
 * WHY THIS EXISTS. Until 2026-09-19 this site wrapped 86% of its shipped CSS in
 * `@layer`. Cascade layers landed in Chrome 99 / Firefox 97 / Safari 15.4, all
 * within weeks of March 2022 — and an engine that does not know the at-rule
 * DISCARDS THE WHOLE BLOCK. So on anything older the site rendered with no
 * stylesheet at all: Times headings, default-blue nav links, and the Manhattan
 * outline SVG falling back to black. It was caught on geopeeker.com, where some
 * render nodes are old enough to do exactly that, and reproduced by deleting
 * only the seven `@layer` blocks from the live page.
 *
 * The JS floor is Chrome 80 / Safari 13.1 (optional chaining, early 2020). The
 * CSS floor was two years later than the JS floor, for one at-rule. Checks 1
 * and 3 keep them aligned.
 *
 * ⚠ Check 2 is the other half of removing the layers. base.css's reset used to
 * be the LOWEST layer, so it lost to every component rule regardless of
 * specificity. Flattened, it is ordinary CSS — and its `a:hover
 * { text-decoration: underline }` is (0,1,1), which BEATS a single-class
 * (0,1,0) component rule. Two real links regressed that way
 * (.unnyc-home-story__rent-source, .unnyc-cw-story__rent-source) and were only
 * found by scanning specificity; a rendered-output diff cannot see it, because
 * it is a :hover state.
 */

import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

/* At-rules that make a browser skip everything inside them. A single one of
   these undoes the entire fix, silently, with a green build. */
const FATAL_AT_RULES = ['@layer', '@container', '@scope'];

/* Above the floor, but they only cost the one declaration or rule, so they are
   a judgement call rather than a build failure. Each is listed with when it
   actually became available. */
const ABOVE_FLOOR = [
    [':has(', 'Chrome 105 / Safari 15.4 / Firefox 121 (Dec 2023)'],
    [':where(', 'Chrome 88 / Safari 14 / Firefox 78 (2020-21)'],
    [':is(', 'Chrome 88 / Safari 14 / Firefox 78 (2020-21)'],
    ['color-mix(', 'Chrome 111 / Safari 16.2 (2023)'],
    ['oklch(', 'Chrome 111 / Safari 15.4 (2022)'],
    ['text-wrap:', 'Chrome 114 / Safari 17.5 (2023-24)'],
    ['@starting-style', 'Chrome 117 / Safari 17.5 (2023-24)'],
    ['subgrid', 'Chrome 117 / Safari 16 (2022-23)'],
    ['100dvh', 'Chrome 108 / Safari 15.4 (2022)'],
];

/* `a:hover { text-decoration: underline }` in base.css. Anything setting
   text-decoration below this loses to it. */
const HOVER_RESET = [0, 1, 1];

/* .unnyc-home-story__sdg is a <div>, so `a:hover` cannot match it. Verified in
   the DOM, not inferred from the name — the class sits on a wrapper, and the
   <a> inside it is .unnyc-home-story__sdg-stat, which is scoped. */
const NOT_A_LINK = new Set(['.unnyc-home-story__sdg']);

function cssFiles(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) out.push(...cssFiles(p));
        else if (entry.endsWith('.css')) out.push(p);
    }
    return out;
}

/* Blank comments IN PLACE rather than deleting them: the checks report line
   numbers, and deleting shifts every offset after the first comment. */
const stripComments = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

function specificity(sel) {
    const s = sel.replace(/::[\w-]+/g, '');
    return [
        (s.match(/#[\w-]+/g) || []).length,
        (s.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) || []).length,
        (s.match(/(?:^|[\s>+~,])([a-z][\w-]*)/g) || []).length,
    ];
}
const lt = (a, b) => a[0] !== b[0] ? a[0] < b[0] : a[1] !== b[1] ? a[1] < b[1] : a[2] < b[2];

const errors = [];
const warnings = [];
const aboveFloor = new Map();
const files = cssFiles(SRC);

/* Pass 1: collect every selector that sets text-decoration, across all files,
   so check 2 can ask "does this selector have a :hover rule of its own?" */
const setsTextDecoration = new Set();
for (const f of files) {
    const css = stripComments(readFileSync(f, 'utf8'));
    for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
        if (!/text-decoration/.test(m[2])) continue;
        for (const part of m[1].split(',').map((x) => x.trim())) {
            if (part && !part.startsWith('@')) setsTextDecoration.add(part);
        }
    }
}

for (const f of files) {
    const rel = relative(ROOT, f);
    const raw = readFileSync(f, 'utf8');
    const css = stripComments(raw);

    // ---- Check 1: fatal at-rules -----------------------------------------
    for (const at of FATAL_AT_RULES) {
        const re = new RegExp(`${at}\\b`, 'g');
        let m;
        while ((m = re.exec(css))) {
            const line = css.slice(0, m.index).split('\n').length;
            errors.push(
                `${rel}:${line}  ${at} — a browser that does not support it SKIPS THE WHOLE BLOCK, ` +
                `so the page renders unstyled. This is the exact defect removed on 2026-09-19.`,
            );
        }
    }

    // ---- Check 2: text-decoration below the a:hover reset -----------------
    for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
        const body = m[2];
        const td = body.match(/text-decoration(?:-line)?\s*:\s*([^;]+)/);
        if (!td || !/none/.test(td[1])) continue;
        for (const part of m[1].split(',').map((x) => x.trim())) {
            if (!part || part.startsWith('@')) continue;
            if (part === 'a') continue;                     // the reset's own base rule
            if (NOT_A_LINK.has(part)) continue;
            if (!lt(specificity(part), HOVER_RESET)) continue;
            if (setsTextDecoration.has(`${part}:hover`)) continue;   // covered by its own hover rule
            const line = css.slice(0, m.index).split('\n').length;
            errors.push(
                `${rel}:${line}  ${part} sets text-decoration:none at ${specificity(part).join('-')}, ` +
                `below base.css's a:hover (0-1-1) — if this is an <a>, it gains an underline on hover. ` +
                `Scope it with .unnyc-page, or repeat the declaration in its own :hover rule.`,
            );
        }
    }

    // ---- Check 3: features above the support floor (warn) -----------------
    for (const [needle, since] of ABOVE_FLOOR) {
        if (!css.includes(needle)) continue;
        if (!aboveFloor.has(needle)) aboveFloor.set(needle, { since, files: [] });
        aboveFloor.get(needle).files.push(rel);
    }
}

for (const [needle, { since, files: fs }] of aboveFloor) {
    warnings.push(`${needle} in ${fs.length} file(s) — ${since}. Degrades that rule only, not the page.`);
}
for (const w of warnings) console.warn(`⚠ validate-css: ${w}`);
if (errors.length) {
    for (const e of errors) console.error(`✗ validate-css: ${e}`);
    console.error(`\n✗ validate-css: ${errors.length} error(s).`);
    process.exit(1);
}
console.log(
    `✓ validate-css: ${files.length} stylesheets — no layer/container/scope at-rules, ` +
    `no link rule losing to the a:hover reset${warnings.length ? `, ${warnings.length} warning(s)` : ''}.`,
);
