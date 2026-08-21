import { SITE_URL } from '@/lib/seo';

/**
 * /robots.txt — the file that was 404ing, which also meant nothing pointed a
 * crawler at a sitemap.
 *
 * ⚠ NOTHING IS DISALLOWED, and `/campaign/endorse/document` in particular must
 * stay crawlable even though it is `noindex`. `Disallow` blocks the FETCH, so a
 * crawler never reads the noindex it was sent to obey — the page can then linger
 * in an index as a URL-only entry. Blocking and de-indexing are opposite tools;
 * this site uses the second one, per-page, in its metadata.
 *
 * THE AI CRAWLERS ARE NAMED DELIBERATELY. `User-agent: *` already allows them,
 * so these groups change nothing today — they exist because this is a campaign
 * that wants to be quoted, and an unstated default is indistinguishable from an
 * unmade decision. Two of these tokens (Google-Extended, Applebot-Extended) are
 * opt-OUT signals that do nothing but sit here as a record until someone sets
 * them to disallow. This is the one place to flip if that day comes.
 *
 * ⚠ A named group REPLACES the `*` group for that agent rather than adding to
 * it, so each one must carry its own `allow` — an empty group would be a
 * silent block, not an inherit.
 */
const AI_CRAWLERS = [
    'GPTBot',             // OpenAI, training + retrieval
    'OAI-SearchBot',      // OpenAI, search surfacing
    'ChatGPT-User',       // OpenAI, fetch-on-demand from a chat
    'ClaudeBot',          // Anthropic
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',    // opt-out token: gates Gemini/Vertex use, not indexing
    'Applebot-Extended',  // opt-out token: gates Apple Intelligence training
    'CCBot',              // Common Crawl — feeds many downstream datasets
    'Bingbot',
];

export default function robots() {
    return {
        rules: [
            { userAgent: '*', allow: '/' },
            ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
