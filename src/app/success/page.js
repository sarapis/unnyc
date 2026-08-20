import Link from 'next/link';
import Image from 'next/image';
import '../primer.css';
import './success.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import PrimerCases from '@/components/unnyc/primer/PrimerCases';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('success');
    return pageMetadata(meta, '/success');
}

/** Marker an editor writes on its own line to place the stats row mid-prose. */
const STATS_MARKER = '<p>{{stats}}</p>';

/**
 * /success — "what success looks like." Long-form case studies driven by the
 * `cases` list in the frontmatter (Barcelona, Munich, Paris as of 2026-08-14 —
 * Tokyo was removed that day), then the shorter shared PrimerCases grid.
 *
 * ALL COPY LIVES IN content/success.md. See docs/EDITING-CONTENT.md.
 */
export default function SuccessPage() {
    const doc = getContent('success');

    return (
        <div className="unnyc-pr unnyc-success">
            <HeaderHeightVar />

            <UnnycSectionNav items={doc.sectionNav} />

            <header className="unnyc-success__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-success__title">{doc.title}</h1>
                    <p
                        className="unnyc-success__lede"
                        dangerouslySetInnerHTML={{ __html: inlineMd(doc.lede) }}
                    />
                </div>
            </header>

            {doc.cases.map((c, caseIndex) => {
                const html = doc.sections[c.id]?.html ?? '';
                const [before, after] = html.includes(STATS_MARKER)
                    ? html.split(STATS_MARKER)
                    : [html, ''];

                return (
                    <section
                        key={c.id}
                        id={c.id}
                        className={`unnyc-success__case${c.alt ? ' unnyc-success__case--alt' : ''}`}
                    >
                        {c.banner ? (
                            <div className="unnyc-success__case-hero">
                                {/* next/image rather than a CSS background: these are
                                    2560px photos on a full-bleed hero, and background-image
                                    gets no WebP/AVIF conversion, no responsive srcset and no
                                    lazy loading. `fill` + object-fit reproduces `cover`
                                    exactly. The first hero is `priority` because it is above
                                    the fold; the rest stay lazy. */}
                                <Image
                                    src={c.banner.src}
                                    alt={c.banner.alt}
                                    fill
                                    sizes="100vw"
                                    priority={caseIndex === 0}
                                    className="unnyc-success__case-hero-img"
                                />
                                <div className="unnyc-success__case-hero-scrim" />
                                <div className="unnyc-success__case-hero-content">
                                    <div className="unnyc-container unnyc-container--narrow">
                                        <div className="unnyc-success__case-hero-text">
                                            <h2 className="unnyc-success__case-title">{c.title}</h2>
                                            <div dangerouslySetInnerHTML={{ __html: before }} />
                                        </div>
                                    </div>
                                </div>
                                {c.banner.creditHref && (
                                    <a
                                        href={c.banner.creditHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="unnyc-success__case-banner-credit"
                                    >
                                        {c.banner.creditText}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="unnyc-container unnyc-container--narrow">
                                <h2 className="unnyc-success__case-title">{c.title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: before }} />
                            </div>
                        )}

                        <div className="unnyc-container unnyc-container--narrow">
                            {c.stats?.length > 0 && (
                                <div className="unnyc-success__stats">
                                    {c.stats.map((s, i) => (
                                        <div key={i} className="unnyc-success__stat">
                                            <span className="unnyc-success__stat-number">{s.number}</span>
                                            <span className="unnyc-success__stat-label">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {after && <div dangerouslySetInnerHTML={{ __html: after }} />}

                            {c.sources?.length > 0 && (
                                <p
                                    className="unnyc-success__sources"
                                    dangerouslySetInnerHTML={{
                                        __html: 'Sources: ' + c.sources.map((s) => inlineMd(s)).join(', '),
                                    }}
                                />
                            )}
                        </div>
                    </section>
                );
            })}

            <PrimerCases cases={doc.caseGrid} />

            <section className="unnyc-success__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-pr-cw__foot-ctas">
                        {doc.foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
