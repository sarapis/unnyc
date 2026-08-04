import Link from 'next/link';
import { primerHero } from '@/data/unnyc-primer';

/**
 * PrimerHero — hero for the education-first UNNYC framing.
 * Reuses the hub hero's visual classes (navy gradient, display serif,
 * stats row) with static stat values instead of animated counters.
 */
export default function PrimerHero() {
    return (
        <section className="unnyc-hero unnyc-pr-hero">
            <div className="unnyc-hero__bg" aria-hidden="true" />
            <div className="unnyc-hero__content">
                <h1 className="unnyc-hero__title">
                    {primerHero.titleParts.map((part, i) => (
                        <span
                            key={i}
                            className={`unnyc-pr-hero__line${i === primerHero.titleParts.length - 1 ? ' unnyc-pr-hero__line--ask' : ''}`}
                        >
                            {part}
                        </span>
                    ))}
                </h1>

                <p className="unnyc-hero__subtitle">{primerHero.subtitle}</p>

                <div className="unnyc-hero__cta">
                    {primerHero.ctas.map((cta, i) => (
                        cta.internal ? (
                            <Link key={i} href={cta.href} className={`unnyc-btn unnyc-btn--${cta.style}`}>
                                {cta.text}
                            </Link>
                        ) : (
                            <a key={i} href={cta.href} className={`unnyc-btn unnyc-btn--${cta.style}`}>
                                {cta.text}
                            </a>
                        )
                    ))}
                </div>

                <div className="unnyc-hero__stats">
                    {primerHero.stats.map((stat, i) => (
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
