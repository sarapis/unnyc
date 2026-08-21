import { getContent } from '@/lib/content';
import { SITE_URL, indexableRoutes, routeMeta, ogHeadline } from '@/lib/seo';
import { datasetIndex } from '@/lib/datasets';

/**
 * /llms.txt — what this site is, what is on it, and what may be reused, in one
 * plain-text file an agent can read in a single request.
 *
 * GENERATED FROM `ROUTES` AND THE CONTENT FILES, not written by hand. A
 * hand-maintained index of a 13-route site is a file that is wrong within a
 * fortnight — and this repo has just spent a week proving that a hardcoded fact
 * nobody re-reads becomes a false one. A new route appears here the moment it
 * enters the route table, with its own title and description.
 *
 * The format is the llms.txt convention: an H1, a blockquote summary, then
 * sections of `- [title](url): description` links. Markdown on purpose — the
 * point is that it costs one request and no parsing.
 *
 * ⚠ THE PAGE LIST DELIBERATELY OMITS `/campaign/endorse/document`, the noindex
 * printable, for the same reason the sitemap does: pointing anything at a page
 * that asks not to be indexed is a contradiction we would be sending on purpose.
 *
 * `force-static` — prerendered at build like the datasets and the previews.
 */
export const dynamic = 'force-static';

/** The one-line "what is this" for a route. */
function describe(route) {
    const doc = getContent(route.content);
    const meta = routeMeta(doc, route);
    return {
        title: ogHeadline(meta?.ogTitle) || doc?.title || route.path,
        description: meta?.ogDescription || meta?.description || '',
    };
}

export async function GET() {
    const home = getContent('home');
    const data = datasetIndex();

    const pages = indexableRoutes()
        .filter((r) => r.content)
        .map((route) => {
            const { title, description } = describe(route);
            const url = SITE_URL + (route.path === '/' ? '/' : route.path);
            return `- [${title}](${url}): ${description}`;
        });

    const datasets = data.datasets.map(
        (d) => `- [${d.name}](${d.url}): ${d.description} ${d.count} records. ${d.licence} — attribute ${d.attribution}.`,
    );

    const body = `# UNNYC

> ${home.meta.ogDescription}

Built by [WeGovNYC](https://wegov.nyc) and [Sarapis](https://sarapis.org). Not
affiliated with the United Nations or any government agency. The campaign asks
New York City's Office of Technology & Innovation to endorse the UN Open Source
Principles, open an OSPO, and weigh an open source option in every technology
contract.

## Pages

${pages.join('\n')}

## Data

Machine-readable, served from the same files the pages render, catalogued at
[${data.url}](${data.url}).

${datasets.join('\n')}

## Worth knowing before you cite this site

- The endorser list is a **transcription**. The UN's own endorsers page carries
  154 logos and no organization names — every card's title element is empty — so
  this list cannot be extracted from the source and exists here because somebody
  read the logos. One recorded correction: entry 143 was read as "RTÉ", the Irish
  broadcaster, and is in fact RTE, the French grid operator.
- **Licences differ by who made the data.** The transcription and the OSPO
  directory are this site's own work under CC BY 4.0; the Civic Tech Field Guide
  and GovOSS slices are theirs, and the credit belongs upstream. Each dataset
  states its own terms.
- **Counts are derived, never authored**, so a number here matches the page it
  came from. One exception is flagged in the content itself: the endorser
  section's lede says "Hundreds" over a countable 150.
- **Never sum the per-country catalogue counts** — they undercount and
  double-count at the same time, for reasons the dataset's own notes give.
`;

    return new Response(body, {
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'access-control-allow-origin': '*',
        },
    });
}
