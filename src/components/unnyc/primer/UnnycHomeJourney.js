import Link from 'next/link';
import Image from 'next/image';

/**
 * UnnycHomeJourney — the homepage's four-section scroll journey, replacing
 * the four question/answer path cards (2026-08-19, from Devin's redesign
 * artifact). Each section pairs a kicker/headline/lede with either a stat
 * row or a short item list, plus a link into the matching sub-page; every
 * other section (`flip: true` in content/home.md) puts its image on the
 * left instead of the right so the page doesn't read as a repeating row.
 *
 * Content comes from content/home.md (`journey:` in frontmatter) — this
 * file is layout only.
 */
export default function UnnycHomeJourney({ journey = [] }) {
    if (!journey.length) return null;

    return (
        <div className="unnyc-home-j">
            {journey.map((section) => (
                <section
                    key={section.href}
                    className={`unnyc-home-j__section${section.flip ? ' unnyc-home-j__section--flip' : ''}`}
                >
                    <div className="unnyc-container unnyc-home-j__inner">
                        <div className="unnyc-home-j__text">
                            <p className="unnyc-home-j__kicker">{section.kicker}</p>
                            <h2 className="unnyc-home-j__headline">{section.headline}</h2>
                            <p className="unnyc-home-j__lede">{section.lede}</p>

                            {section.stats && (
                                <dl className="unnyc-home-j__stats">
                                    {section.stats.map((stat) => (
                                        <div key={stat.label} className="unnyc-home-j__stat">
                                            <dt className="unnyc-home-j__stat-label">{stat.label}</dt>
                                            <dd className="unnyc-home-j__stat-value">{stat.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}

                            {section.items && (
                                <ul className="unnyc-home-j__items">
                                    {section.items.map((item) => (
                                        <li key={item} className="unnyc-home-j__item">{item}</li>
                                    ))}
                                </ul>
                            )}

                            <Link href={section.href} className="unnyc-btn unnyc-btn--primary unnyc-home-j__link">
                                {section.linkLabel} <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        {section.image && (
                            <div className="unnyc-home-j__media">
                                <Image
                                    src={section.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 900px) 100vw, 520px"
                                    className="unnyc-home-j__img"
                                />
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}
