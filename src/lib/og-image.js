import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
// ogHeadline lives in seo.js: pageMetadata needs the same stripped string for
// the image's alt text, and metadata must not import this file (fs + next/og).
import { ogHeadline } from '@/lib/seo';

/**
 * The shared renderer behind every /og/*.png — the link-preview images.
 *
 * WHY GENERATED AND NOT PHOTOGRAPHIC: the site had no og:image on any route, so
 * every share of this campaign rendered as bare text. A photo per page means
 * twelve licensed images, twelve CREDITS.md rows and a design decision each —
 * which is the thing that has kept homepage card 1 a placeholder through three
 * moves. Text on the brand palette needs none of that, updates itself when the
 * copy changes, and cannot go stale against the page it advertises.
 *
 * Server-only (reads the font from disk) and evaluated at BUILD time — the route
 * that calls it is `force-static`.
 */

/** Open Graph's expected size. Facebook, LinkedIn, Slack and Twitter all crop
 *  from 1200x630; anything else gets letterboxed by somebody. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// From the design tokens (node_modules/@wegovnyc/design-tokens/src), NOT picked
// by eye: the canonical navy, and the two flag accents the unnyc brand variant
// maps --wg-accent / --wg-accent-warm onto. The wordmark below is the same
// two-span split as .unnyc-nav__logo.
const NAVY = '#162e51';
const UN_BLUE = '#009EDB';
const NYC_ORANGE = '#FF6600';
const ON_BRAND = '#eef3f9';
const MUTED = '#93aac6';

const FONT_PATH = 'src/assets/fonts/DMSerifDisplay-Regular.ttf';

/**
 * ⚠ TTF, NOT WOFF2. Satori (what ImageResponse renders with) reads ttf/otf/woff
 * and CANNOT read woff2 — and woff2 is the only thing Google Fonts serves to a
 * modern browser, which is what unnyc.css @imports. Asking the CSS API for the
 * old format with an ancient user-agent gets you EOT, not ttf. The file is
 * vendored from github.com/google/fonts instead, with its OFL licence beside it.
 *
 * Vendored rather than fetched at build for the same reason the CTFG and GovOSS
 * data are snapshots: a build that reaches the network is a build that can fail
 * for reasons that have nothing to do with the commit.
 */
let fontCache;
function displayFont() {
    if (!fontCache) fontCache = fs.readFileSync(path.join(process.cwd(), FONT_PATH));
    return fontCache;
}


/** Long headlines have to fit without a scrollbar there is no room for. Sized in
 *  steps rather than continuously so two pages of similar length look alike. */
function headlineSize(text) {
    if (text.length > 70) return 60;
    if (text.length > 45) return 72;
    return 86;
}

export { ogHeadline };

export function renderOgImage(headline) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: NAVY,
                    padding: '68px 76px 76px',
                    fontFamily: 'DM Serif Display',
                }}
            >
                {/* Wordmark — the same UN/NYC colour split as the site nav. */}
                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 54, letterSpacing: 1 }}>
                    <span style={{ color: UN_BLUE }}>UN</span>
                    <span style={{ color: NYC_ORANGE }}>NYC</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: headlineSize(headline),
                        lineHeight: 1.12,
                        color: ON_BRAND,
                        // Leave the right edge alone: a headline running to the
                        // bezel reads as truncated even when it isn't.
                        maxWidth: 940,
                    }}
                >
                    {headline}
                </div>

                <div style={{ display: 'flex', fontSize: 28, color: MUTED, letterSpacing: 0.5 }}>
                    un.opensource.nyc
                </div>

                {/* The orange rule under the site header, repeated here so the
                    preview and the page it opens are recognisably the same thing. */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        height: 12,
                        background: NYC_ORANGE,
                    }}
                />
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [{ name: 'DM Serif Display', data: displayFont(), style: 'normal', weight: 400 }],
        },
    );
}
