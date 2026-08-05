import Link from 'next/link';

/**
 * PrimerHero — the hub hero: display headline, subtitle, CTAs, stats row.
 * Content comes from content/home.md (`hero:` in frontmatter). The last title
 * line gets the blue→gold accent, since that line is the campaign's ask.
 */
export default function PrimerHero({ hero }) {
    if (!hero) return null;
    const lines = hero.titleLines ?? [];

    return (
        <section className="unnyc-hero unnyc-pr-hero">
            <div className="unnyc-hero__bg" aria-hidden="true" />
            <div className="unnyc-hero__content">
                <h1 className="unnyc-hero__title">
                    {lines.map((part, i) => (
                        <span
                            key={i}
                            className={`unnyc-pr-hero__line${i === lines.length - 1 ? ' unnyc-pr-hero__line--ask' : ''}`}
                        >
                            {part}
                        </span>
                    ))}
                </h1>

                <p className="unnyc-hero__subtitle">{hero.subtitle}</p>

                <div className="unnyc-hero__cta">
                    {(hero.ctas ?? []).map((cta, i) => (
                        <Link key={i} href={cta.href} className={`unnyc-btn unnyc-btn--${cta.style}`}>
                            {cta.label}
                        </Link>
                    ))}
                </div>

                <div className="unnyc-hero__stats">
                    {(hero.stats ?? []).map((stat, i) => (
                        <div key={i} className="unnyc-hero__stat">
                            <span className="unnyc-hero__stat-number">{stat.number}</span>
                            <span className="unnyc-hero__stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
