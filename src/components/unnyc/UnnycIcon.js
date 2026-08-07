/**
 * UnnycIcon — the site's icon set, as inline SVG.
 *
 * WHY INLINE SVG AND NOT IMAGES
 * -----------------------------
 * These replace eight PNGs (public/principle-icons/*.png, deleted 2026-08-06).
 * Those were 364 KB of ~1000px raster for a 28–56px slot, drawn in at least
 * four different styles — a heavy solid-filled lock, a medium outline, a
 * hairline silhouette, a hand-drawn sketch — on canvases whose aspect ratios
 * ran from 0.76 to 1.29, so `object-fit: contain` rendered each at a visibly
 * different optical size inside the same box.
 *
 * The design-system reason matters more than the weight. This project's rule is
 * that no rule may write a colour literal, because a literal is invisible to
 * the brand variant — that is the whole point of the two-tier token system. A
 * black PNG is a colour literal baked into pixels: those eight icons were the
 * only visual elements on the site the `unnyc` variant could not touch. These
 * are `stroke="currentColor"`, so they inherit whatever `--wg-*` semantic the
 * surrounding rule sets, exactly like text does.
 *
 * SOURCE + LICENCE
 * ----------------
 * Paths are verbatim from Lucide (lucide.dev) v1.30.0, ISC licensed:
 *   Copyright (c) 2026 Lucide Icons and Contributors
 * One 24×24 canvas, 2px stroke, round caps and joins — that consistency is the
 * point, so KEEP THE CANVAS AND STROKE if you add one. Take new icons from
 * Lucide rather than drawing your own or pulling from another set; mixing sets
 * is precisely the state this replaced.
 *
 * Rendered via dangerouslySetInnerHTML so the paths stay byte-identical to
 * upstream (no kebab-case → camelCase JSX rewriting to get subtly wrong). The
 * markup is a static literal in this file, not user input.
 */

/* eslint-disable react/no-danger */

const ICONS = {
    'unlock':
        '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />',
    'git-pull-request':
        '<circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" x2="6" y1="9" y2="21" />',
    'shield-check':
        '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />',
    'users':
        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />',
    'recycle':
        '<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" /><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" /><path d="m14 16-3 3 3 3" /><path d="M8.293 13.596 7.196 9.5 3.1 10.598" /><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" /><path d="m13.378 9.633 4.096 1.098 1.097-4.096" />',
    'book-open':
        '<path d="M12 5v16" /><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />',
    'award':
        '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /><circle cx="12" cy="8" r="6" />',
    'trending-up':
        '<path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />',
};

/**
 * @param {{name: string, size?: number, className?: string, title?: string}} props
 *   `name` — a key of ICONS. An unknown name renders nothing rather than a
 *   broken box; content/principles.md is the only caller and the build would
 *   surface a typo there as a missing icon, not a crash.
 *   `title` — supply ONLY when the icon carries meaning on its own. Every
 *   current use sits beside the principle's own heading, so they are decorative
 *   and correctly `aria-hidden`.
 */
export default function UnnycIcon({ name, size = 24, className, title }) {
    const markup = ICONS[name];
    if (!markup) return null;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : 'true'}
            aria-label={title}
            dangerouslySetInnerHTML={{ __html: markup }}
        />
    );
}

/** The names this set provides — for a quick check when editing content. */
export const ICON_NAMES = Object.keys(ICONS);
