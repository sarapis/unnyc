import Link from 'next/link';
import Image from 'next/image';
import { inlineMd } from '@/lib/content';

/**
 * PrimerHeroFullBleed — an alternate homepage hero: a full-bleed photo
 * background (UN Headquarters) with a dark gradient scrim under right-aligned
 * text, instead of the original PrimerHero's abstract navy gradient.
 *
 * A second, competing option for Devin to compare against the live hero —
 * NOT wired into page.js by default (see that file for how to switch to it).
 * Built from his Claude Design mockup ("2a: Full bleed, flipped"); the
 * mockup's own placeholder colors/copy were wrong on purpose (it was built
 * against whatever was live in the repo at the time) — this reads the SAME
 * content/home.md `hero:` block PrimerHero does, so both options stay in
 * sync on wording. `kicker` and `backgroundImage` are new fields only this
 * component reads.
 *
 * Title lines run through inlineMd(), same as PrimerHero, so the same
 * markdown and inline-HTML emphasis markup works here too.
 */
export default function PrimerHeroFullBleed({ hero }) {
    if (!hero) return null;
    const lines = hero.titleLines ?? [];

    return (
        <section className="unnyc-hero-fb">
            {hero.backgroundImage && (
                <Image
                    src={hero.backgroundImage}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="unnyc-hero-fb__img"
                />
            )}
            <div className="unnyc-hero-fb__scrim" aria-hidden="true" />

            <div className="unnyc-container unnyc-hero-fb__inner">
                <div className="unnyc-hero-fb__content">
                    {hero.kicker && (
                        <p className="unnyc-hero-fb__kicker">
                            <span>{hero.kicker}</span>
                            <i aria-hidden="true" />
                        </p>
                    )}

                    <h1 className="unnyc-hero-fb__title">
                        {lines.map((part, i) => (
                            <span
                                key={i}
                                className={`unnyc-hero-fb__line${i === lines.length - 1 ? ' unnyc-hero-fb__line--ask' : ''}`}
                                dangerouslySetInnerHTML={{ __html: inlineMd(part) }}
                            />
                        ))}
                    </h1>

                    <p className="unnyc-hero-fb__subtitle" dangerouslySetInnerHTML={{ __html: inlineMd(hero.subtitle) }} />

                    <div className="unnyc-hero-fb__cta">
                        {(hero.ctas ?? []).map((cta, i) => (
                            <Link key={i} href={cta.href} className={`unnyc-btn unnyc-btn--${cta.style}`}>
                                {cta.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
