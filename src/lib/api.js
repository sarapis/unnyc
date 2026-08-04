/**
 * lib/api.js — client for the Sarapis Payload CMS (multi-brand).
 *
 * Inherited from the wegov.nyc marketing site when this site was split out, so
 * it still carries that client's full surface (`fetchAPI`, `getStrapiMedia`, a
 * Lexical→HTML converter, blog/article shaping). This site uses only a slice of
 * it — see "What this site actually uses" below — but the rest is left intact
 * rather than pruned, so the two codebases stay diff-able and adding a
 * CMS-backed page here later needs no new plumbing.
 *
 * Requests are scoped to one brand via `where[sites.key][equals]=<SITE_KEY>`.
 *
 * Env (both optional — the defaults below are the live values):
 *   NEXT_PUBLIC_PAYLOAD_URL   Payload origin (default https://next.sarapis.org)
 *   NEXT_PUBLIC_SITE_KEY      brand key in the Sites collection (default 'wegovnyc')
 *
 * What this site actually uses:
 *   - `createSubmission('campaign-endorsements', …)` — individual signatures,
 *     from components/unnyc/CampaignSignForm.js.
 *   - `createSubmission('campaign-signups', …)` — "get updates" emails.
 *   - `fetchAPI('/campaign-endorsements')` — the published endorser wall on
 *     /campaign/sign.
 *
 * Note: formal ORGANIZATION endorsements do NOT go through Payload — they post
 * to /api/formal-endorsement, which forwards to a Google Sheet. Two paths by
 * design; see the README.
 */

const PAYLOAD_URL = (
  process.env.NEXT_PUBLIC_PAYLOAD_URL ||
  'https://next.sarapis.org'
).replace(/\/$/, '');

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || 'wegovnyc';

// ---------------------------------------------------------------------------
// Public API (unchanged signatures)
// ---------------------------------------------------------------------------

export async function fetchAPI(path, options = {}) {
  const { isDraftMode } = options;
  const [rawPath, rawQuery = ''] = path.replace(/^\//, '').split('?');
  const collection = rawPath.split('/')[0]; // 'articles' | 'pages' | 'global'
  const sp = new URLSearchParams(rawQuery);

  const cache = isDraftMode ? 'no-store' : 'force-cache';

  switch (collection) {
    case 'articles':
      return getArticles(sp, { cache, isDraftMode });
    case 'global':
      return getGlobal({ cache });
    case 'events':
      return getEvents(sp, { cache });
    case 'news-items':
      return getNewsItems(sp, { cache });
    case 'pages':
      // Marketing page bodies are frozen in src/content/frozen-pages.js, so
      // there is nothing to fetch (see the header notes).
      return { data: [], meta: {} };
    default:
      // Unknown endpoint — behave like an empty list so callers degrade.
      return { data: [], meta: {} };
  }
}

/** Resolve a Payload media URL (absolute passthrough, else prefix the origin). */
export function getStrapiMedia(url) {
  if (url == null) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  // Frozen marketing media lives in the front-end's own /public (migrated off
  // Strapi) — serve as-is, don't prefix the Payload host.
  if (url.startsWith('/frozen-media/')) return url;
  return `${PAYLOAD_URL}${url}`;
}

/**
 * Submit a campaign form to Payload (used by the unnyc components in place of
 * their direct Strapi fetch). `collection` is 'campaign-signups' or
 * 'campaign-endorsements'; `data` is the flat submission (email, campaign, …).
 * The originating brand is attached automatically.
 */
export async function createSubmission(collection, data) {
  const siteId = await getSiteId();
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ...(siteId ? { site: siteId } : {}) }),
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Payload calls + Strapi-shape mapping
// ---------------------------------------------------------------------------

async function payloadGET(collection, params, cache = 'force-cache') {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?${qs.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
    cache,
  });
  if (!res.ok) throw new Error(`Payload ${collection} ${res.status}`);
  return res.json();
}

// Cache the brand's site id for the request lifetime (submissions need the id).
let _siteIdPromise;
function getSiteId() {
  if (!_siteIdPromise) {
    _siteIdPromise = payloadGET('sites', {
      'where[key][equals]': SITE_KEY,
      limit: '1',
      depth: '0',
    })
      .then((r) => r.docs?.[0]?.id ?? null)
      .catch(() => null);
  }
  return _siteIdPromise;
}

async function getArticles(sp, { cache, isDraftMode }) {
  const params = {
    depth: '2', // populate heroImage, categories, tags, populatedAuthors, sites
    limit: sp.get('pagination[limit]') || sp.get('pagination[pageSize]') || '100',
    'where[sites.key][equals]': SITE_KEY,
  };
  if (isDraftMode) params.draft = 'true';

  // sort: originalPublishDate:desc -> -publishedAt
  const sort = sp.get('sort');
  if (sort) {
    const [, dir] = sort.split(':');
    params.sort = `${dir === 'desc' ? '-' : ''}publishedAt`;
  } else {
    params.sort = '-publishedAt';
  }

  // filters -> Payload where (AND-ed with the brand filter)
  const slug = sp.get('filters[slug][$eq]');
  if (slug) params['where[slug][equals]'] = slug;
  const category = sp.get('filters[category][$eq]');
  if (category) params['where[categories.title][equals]'] = category;
  const tag = sp.get('filters[tags][$contains]');
  if (tag) params['where[tags.title][equals]'] = tag;

  const page = sp.get('pagination[page]');
  if (page) params.page = page;

  const r = await payloadGET('posts', params, cache);
  return {
    data: (r.docs || []).map(articleFromPost),
    meta: {
      pagination: {
        page: r.page || 1,
        pageSize: r.limit || Number(params.limit),
        pageCount: r.totalPages || 1,
        total: r.totalDocs ?? (r.docs?.length || 0),
      },
    },
  };
}

/** Payload post -> flattened Strapi-v5 article shape the components expect. */
function articleFromPost(p) {
  const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
  return {
    id: p.id,
    documentId: String(p.id), // Articles.js uses documentId as the React key
    slug: p.slug,
    title: p.title,
    author: (p.populatedAuthors || []).map((a) => a?.name).filter(Boolean).join(', ') || null,
    category: cat && typeof cat === 'object' ? cat.title : null,
    tags: (p.tags || []).map((t) => (t && typeof t === 'object' ? t.title : t)).filter(Boolean),
    description: p.meta?.description || null,
    originalPublishDate: p.publishedAt || null,
    createdAt: p.createdAt || null,
    image: mediaObj(p.heroImage) || (p.meta?.image ? mediaObj(p.meta.image) : null),
    content: lexicalToHTML(p.content), // components render this as HTML
  };
}

function mediaObj(m) {
  if (!m || typeof m !== 'object') return null;
  return { url: m.url, alt: m.alt, width: m.width, height: m.height };
}

/**
 * Events for this brand, soonest-first. Payload's `events` field names already
 * match what the consumer maps (dateLabel/startDate/endDate/location/link), so
 * the docs pass through with just the brand filter applied.
 */
async function getEvents(sp, { cache }) {
  const params = {
    'where[sites.key][equals]': SITE_KEY,
    sort: 'startDate',
    depth: '0',
    limit: sp.get('pagination[pageSize]') || sp.get('pagination[limit]') || '100',
  };
  const r = await payloadGET('events', params, cache);
  return { data: r.docs || [], meta: listMeta(r, params.limit) };
}

/**
 * News cards for this brand, newest-first by `sortDate` (the machine-readable
 * date; `dateLabel` is the fuzzy display string, so it can't be sorted on).
 */
async function getNewsItems(sp, { cache }) {
  const params = {
    'where[sites.key][equals]': SITE_KEY,
    sort: '-sortDate',
    depth: '0',
    limit: sp.get('pagination[pageSize]') || sp.get('pagination[limit]') || '100',
  };
  const r = await payloadGET('news-items', params, cache);
  return { data: r.docs || [], meta: listMeta(r, params.limit) };
}

function listMeta(r, limit) {
  return {
    pagination: {
      page: r.page || 1,
      pageSize: r.limit || Number(limit),
      pageCount: r.totalPages || 1,
      total: r.totalDocs ?? (r.docs?.length || 0),
    },
  };
}

async function getGlobal({ cache }) {
  const r = await payloadGET('sites', {
    'where[key][equals]': SITE_KEY,
    depth: '1',
    limit: '1',
  }, cache);
  const s = r.docs?.[0];
  if (!s) return { data: null };

  const toLink = (l, i) => ({
    id: l.id || i,
    label: l.label,
    url: l.href,
    isExternal: /^https?:\/\//i.test(l.href || ''),
    style: 'primary',
  });

  return {
    data: {
      siteName: s.siteName || s.name,
      defaultSeo: {
        metaTitle: s.defaultSeo?.title || null,
        metaDescription: s.defaultSeo?.description || null,
      },
      favicon: s.logo ? mediaObj(s.logo) : null,
      navbar: {
        links: (s.nav || []).map(toLink),
        button: null, // Donate migrated as a nav link; promote here later if desired
      },
      footer: {
        newsletterTitle: 'Get Involved',
        newsletterText: s.footer?.tagline || null,
        socialLinks: (s.footer?.links || []).map(toLink),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Minimal Lexical -> HTML (dependency-free; covers WeGov article content:
// headings, paragraphs, lists, quotes, links, formatted text, images, tables,
// hr, line breaks). Unknown nodes render their children.
// ---------------------------------------------------------------------------

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function textNode(n) {
  let t = esc(n.text || '');
  const f = n.format || 0;
  if (f & 1) t = `<strong>${t}</strong>`;
  if (f & 2) t = `<em>${t}</em>`;
  if (f & 4) t = `<s>${t}</s>`;
  if (f & 8) t = `<u>${t}</u>`;
  if (f & 16) t = `<code>${t}</code>`;
  return t;
}

function childrenHTML(node) {
  return (node.children || []).map(nodeHTML).join('');
}

function nodeHTML(n) {
  if (!n || typeof n !== 'object') return '';
  switch (n.type) {
    case 'text':
      return textNode(n);
    case 'linebreak':
      return '<br />';
    case 'paragraph': {
      const inner = childrenHTML(n);
      return inner ? `<p>${inner}</p>` : '';
    }
    case 'heading': {
      const tag = /^h[1-6]$/.test(n.tag) ? n.tag : 'h2';
      return `<${tag}>${childrenHTML(n)}</${tag}>`;
    }
    case 'quote':
      return `<blockquote>${childrenHTML(n)}</blockquote>`;
    case 'list': {
      const tag = n.listType === 'number' || n.tag === 'ol' ? 'ol' : 'ul';
      return `<${tag}>${childrenHTML(n)}</${tag}>`;
    }
    case 'listitem':
      return `<li>${childrenHTML(n)}</li>`;
    case 'link':
    case 'autolink': {
      const url = n.fields?.url || n.url || '#';
      const target = n.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${esc(url)}"${target}>${childrenHTML(n)}</a>`;
    }
    case 'horizontalrule':
      return '<hr />';
    case 'upload': {
      const url = n.value?.url;
      if (!url) return '';
      return `<img src="${esc(getStrapiMedia(url))}" alt="${esc(n.value?.alt || '')}" />`;
    }
    case 'table':
      return `<table>${childrenHTML(n)}</table>`;
    case 'tablerow':
      return `<tr>${childrenHTML(n)}</tr>`;
    case 'tablecell':
      return `<${n.headerState ? 'th' : 'td'}>${childrenHTML(n)}</${n.headerState ? 'th' : 'td'}>`;
    default:
      return childrenHTML(n); // unknown container -> render children
  }
}

function lexicalToHTML(content) {
  if (!content || !content.root) return '';
  return childrenHTML(content.root);
}

/*
 * How the content is wired on THIS site
 * -------------------------------------
 * - Page copy is static: it lives in src/data/unnyc-primer.js and in the page
 *   components themselves, NOT in the CMS. Edit those files to change the site.
 * - The CMS is used for form data only: signatures and "get updates" emails go
 *   into Payload's `campaign-endorsements` / `campaign-signups` collections,
 *   scoped to the `wegovnyc` brand.
 * - The endorser wall on /campaign/sign reads back only PUBLISHED endorsements,
 *   so publishing a submission in the Payload admin is the review step.
 * - Public reads are gated to published docs by Payload's access control; email
 *   and private contact fields are never exposed by the read endpoints.
 */
