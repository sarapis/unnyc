import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

/**
 * lib/content.js — reads page copy from `content/*.md`.
 *
 * Each file is YAML frontmatter (the structured parts: titles, card lists,
 * per-item metadata) plus a markdown body holding the prose. The body is cut
 * into named sections by `## <slug>` headings, so a page component can pull
 * `sections['open-by-default']` and drop it into its own layout — the markdown
 * carries the words, the component keeps the design.
 *
 * Server-only: uses node:fs, so import it from Server Components only.
 *
 * Conventions inside a section body
 * ---------------------------------
 *   ### Some Heading      -> a sub-block. Its text becomes the block's `label`
 *                            and everything under it becomes that block's html.
 *   [text](gloss:ospo)    -> renders as a glossary term (class + data-slug),
 *                            definition as a hover title, from content/start.md.
 *   normal [links](url)   -> external links get target=_blank + rel, in-page
 *                            (#anchor) and internal (/path) links do not.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Glossary definitions, read from content/start.md (`concepts.terms`) so a
 * `gloss:` link can carry its definition as a hover tooltip. Cached per process;
 * read lazily so a page that uses no glossary links never touches the file.
 */
let _glossary;
function glossary() {
    if (_glossary) return _glossary;
    _glossary = {};
    try {
        const f = path.join(CONTENT_DIR, 'start.md');
        if (fs.existsSync(f)) {
            const { data } = matter(fs.readFileSync(f, 'utf8'));
            for (const t of data?.concepts?.terms ?? []) {
                if (t.slug) _glossary[t.slug] = t.def ?? '';
            }
        }
    } catch {
        /* a missing/!parseable glossary must not break an unrelated page */
    }
    return _glossary;
}

/** Renderer tweaks shared by every page. */
function renderer() {
    const r = new marked.Renderer();
    const baseLink = r.link.bind(r);

    // Blockquotes carry the site's pull-quote treatment, and a final paragraph
    // that opens with an em-dash is the attribution -> <cite>. Lets an editor
    // write a quote in plain markdown:
    //     > The quote.
    //     >
    //     > — Who said it, [source](url)
    r.blockquote = function ({ tokens }) {
        let html = this.parser.parse(tokens);
        html = html.replace(
            /<p>(\s*(?:—|&#8212;|&mdash;)[\s\S]*?)<\/p>\s*$/,
            (_, attribution) => `<cite>${attribution.trim()}</cite>`,
        );
        return `<blockquote class="unnyc-pr-why__quote">\n${html}</blockquote>\n`;
    };

    r.link = function ({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);

        // `gloss:slug` -> the site's glossary-term treatment. The definition
        // rides along as a title attribute so hovering still explains the term
        // (the old <GlossaryTerm> React tooltip can't be used here, because this
        // renders to an HTML string, not components).
        if (href?.startsWith('gloss:')) {
            const slug = href.slice('gloss:'.length);
            const def = glossary()[slug];
            const attr = def ? ` title="${def.replace(/"/g, '&quot;')}"` : '';
            return `<a href="/start#${slug}" class="unnyc-gloss__link" data-gloss="${slug}"${attr}>${text}</a>`;
        }
        // In-page and internal links stay in the tab; external ones open out.
        // Both get `unnyc-inline-link` so a reader can actually tell prose
        // text is clickable — the site-wide `.unnyc-page a` reset strips
        // text-decoration and color from a bare <a>, same as gloss links
        // needed their own class for the same reason.
        if (href?.startsWith('#') || href?.startsWith('/')) {
            return `<a href="${href}" class="unnyc-inline-link"${title ? ` title="${title}"` : ''}>${text}</a>`;
        }
        return baseLink({ href, title, tokens })
            .replace('<a ', '<a class="unnyc-inline-link" target="_blank" rel="noopener noreferrer" ');
    };

    return r;
}

const md = (src) =>
    src?.trim() ? marked.parse(src.trim(), { renderer: renderer(), mangle: false, headerIds: false }) : '';

/**
 * Split a markdown body into `## slug` sections. Within each, a `### Label`
 * starts a new block, so a section is `{ html, blocks: [{label, html}] }`.
 */
function splitSections(body) {
    const out = {};
    // Leading text before the first `## ` is ignored (used for editor comments).
    const parts = body.split(/^## +(.+)$/gm).slice(1);
    for (let i = 0; i < parts.length; i += 2) {
        const slug = parts[i].trim();
        const raw = parts[i + 1] ?? '';
        const chunks = raw.split(/^### +(.+)$/gm);
        out[slug] = {
            html: md(chunks[0]),
            blocks: [],
        };
        for (let j = 1; j < chunks.length; j += 2) {
            out[slug].blocks.push({ label: chunks[j].trim(), html: md(chunks[j + 1] ?? '') });
        }
    }
    return out;
}

/**
 * Load one content file. Returns `{ ...frontmatter, sections }`.
 * Throws loudly at build time if the file is missing — better than a page
 * that silently renders empty.
 */
export function getContent(name) {
    const file = path.join(CONTENT_DIR, `${name}.md`);
    if (!fs.existsSync(file)) {
        throw new Error(`Missing content file: content/${name}.md`);
    }
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    return { ...data, sections: splitSections(content) };
}

/**
 * The curated "government open source programs" map layer, sourced from the Civic
 * Tech Field Guide's public API and snapshotted by
 * `scripts/fetch-ctfg-projects.mjs` (re-run that to refresh; read the diff before
 * committing). A snapshot rather than a live fetch so the map can't go half-empty
 * if the CTFG API is slow, and so the set stays human-gated — CTFG's org-type
 * tagging has some noise.
 *
 * Fail-soft ON PURPOSE, unlike getContent(): this layer is supporting evidence, so
 * a missing file should cost you the extra dots, not the whole page and its
 * argument. Returns null and the map just renders the curated policy markers.
 */
/**
 * The GovOSS country-fill layer: how many public-sector open source entries each
 * country's catalogues list, plus the boundaries to paint them on.
 *
 * TWO files on purpose (see scripts/fetch-govoss-catalogues.mjs): the counts are
 * meant to be read in a diff, the polygons never are. Both fail soft, for the same
 * reason as getCtfgProjects — a missing snapshot should cost the fill, not the page.
 * They fail INDEPENDENTLY too: counts without geometry still render the credit line
 * and the totals, which is more useful than an all-or-nothing blank.
 *
 * GovOSS data is CC BY 4.0 — note that is a DIFFERENT licence from the CTFG layer
 * beside it (CC BY-NC-SA 4.0), so the two credits are not interchangeable.
 */
export function getGovossCatalogues() {
    const file = path.join(CONTENT_DIR, 'govoss-catalogues.json');
    try {
        const d = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (!Array.isArray(d?.countries) || !d.countries.length) return null;
        try {
            d.geo = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'govoss-countries.geo.json'), 'utf8'));
        } catch {
            d.geo = null;
        }
        return d;
    } catch {
        return null;
    }
}

export function getCtfgProjects() {
    const file = path.join(CONTENT_DIR, 'ctfg-gov-open-source.json');
    try {
        const d = JSON.parse(fs.readFileSync(file, 'utf8'));
        return Array.isArray(d?.projects) && d.projects.length ? d : null;
    } catch {
        return null;
    }
}

/**
 * The organizations that have endorsed the UN Open Source Principles — a
 * 2026-08-06 snapshot of the UN's own endorsement page, 152 organizations with
 * a sector on each.
 *
 * Fail-soft, for the same reason as getCtfgProjects: the directory is evidence
 * that the movement is broad, so a missing file should cost the directory, not
 * the page that argues NYC should join it.
 *
 * NAMES ARE A TRANSCRIPTION, not a UN export. The source page carries 154 logos
 * and zero names — every card's title element is empty — so the names were read
 * off the logos themselves. One error has already been corrected in the data
 * (#143 was "RTÉ", the Irish broadcaster; the logo is RTE, the French grid
 * operator). Spot-check against an organization's own site before relying on a
 * name, and record any fix in the file's `corrections` array rather than
 * silently editing it.
 *
 * NO LOGOS. They are third-party trademarks and the UN displaying them grants
 * no onward rights, so the directory is names and sectors only. Do not add an
 * image column without a human decision on usage rights — the full-size
 * originals also run to 16 MB, which is a second reason.
 */
export function getUnEndorsers() {
    const file = path.join(CONTENT_DIR, 'un-endorsers.json');
    try {
        const d = JSON.parse(fs.readFileSync(file, 'utf8'));
        return Array.isArray(d?.organizations) && d.organizations.length ? d : null;
    } catch {
        return null;
    }
}

/* ---------------------------------------------------------------------------
   The eight principles, derived
   ---------------------------------------------------------------------------
   content/principles.md is the single source (see its header). These two
   helpers reshape it for the surfaces that do NOT want the grouped, gerund
   form that /start renders. Deriving beats duplicating: the three listings
   used to be three hand-maintained copies and had drifted.
--------------------------------------------------------------------------- */

/**
 * All eight in the UN's own order, named canonically, with the terse
 * descriptions — for the open letter's numbered list.
 */
export function principlesFlat(principlesDoc) {
  const { lead, groups = [] } = principlesDoc || {};
  const items = [lead, ...groups.flatMap((g) => g.items || [])].filter(Boolean);
  return items
    .slice()
    .sort((a, b) => (a.n ?? 99) - (b.n ?? 99))
    .map((p) => ({
      n: p.n,
      title: p.titleCanonical || p.title,
      desc: p.descShort || p.desc || '',
    }));
}

/**
 * Grouped for the printable declaration: the declaration's own group headings,
 * canonical principle names, and the City-facing description where one exists.
 */
export function principlesDeclaration(principlesDoc) {
  const { lead, groups = [] } = principlesDoc || {};
  return {
    lead: lead && {
      title: lead.titleCanonical || lead.title,
      desc: lead.descCity || lead.desc || (lead.body || []).join(' '),
    },
    groups: groups.map((g) => ({
      title: g.titleDeclaration || g.title,
      items: (g.items || []).map((p) => ({
        title: p.titleCanonical || p.title,
        desc: p.descCity || p.desc || '',
      })),
    })),
  };
}

/** Inline markdown (bold/links) with no wrapping <p> — for ledes and labels. */
export function inlineMd(src) {
    if (!src?.trim()) return '';
    return marked.parseInline(src.trim(), { renderer: renderer() });
}
