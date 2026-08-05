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

/** Inline markdown (bold/links) with no wrapping <p> — for ledes and labels. */
export function inlineMd(src) {
    if (!src?.trim()) return '';
    return marked.parseInline(src.trim(), { renderer: renderer() });
}
