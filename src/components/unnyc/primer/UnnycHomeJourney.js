import Link from 'next/link';
import Image from 'next/image';

/**
 * UnnycHomeJourney — the homepage as a vertical scroll: one full-width section
 * per interior page, in nav order, each with a kicker, a display headline, a
 * lede, a DERIVED proof row, and one link deeper.
 *
 * Replaces the four-card grid (UnnycPathCards — still alive, /campaign uses it
 * for its two action paths). The words live in content/home.md under `journey:`;
 * the proof rows arrive as props from page.js, derived from the same files the
 * interior pages render, so the homepage cannot claim a number its target no
 * longer shows. That rule is why this component ACCEPTS data rather than
 * importing loaders: what gets derived, and from where, stays visible in one
 * place (page.js).
 *
 * Stat LABELS are copy (each section's `stats:` in the markdown); their VALUES
 * arrive in `proofs` keyed by the entry's `source:` name, so the words are the
 * editor's and the numbers stay derived. A source with no derived value drops
 * its stat silently — same fail-soft posture as the loaders.
 *
 * Layout: text column plus media column, image side alternating per row.
 * The FIRST section has no image on purpose — the only asset ever available for
 * it was the favicon placeholder that embarrassed the card version through
 * three moves. Its proof row (programs / countries / catalogues as big figures)
 * IS the visual, which retires that problem instead of inheriting it.
 */
export default function UnnycHomeJourney({ journey = [], proofs = {} }) {
    if (!journey.length) return null;

    return (
        <div className="unnyc-home-j">
            {journey.map((section, i) => {
                const proof = proofs[section.href];
                const flip = i % 2 === 1;
                const stats = (section.stats ?? [])
                    .map((s) => ({ ...s, value: proof?.values?.[s.source] }))
                    .filter((s) => s.value != null);
                return (
                    <section
                        key={section.href}
                        className={`unnyc-home-j__section${flip ? ' unnyc-home-j__section--flip' : ''}`}
                    >
                        <div className="unnyc-container unnyc-home-j__inner">
                            <div className="unnyc-home-j__text">
                                <p className="unnyc-home-j__kicker">{section.kicker}</p>
                                <h2 className="unnyc-home-j__headline">{section.headline}</h2>
                                <p className="unnyc-home-j__lede">{section.lede}</p>

                                {stats.length > 0 && (
                                    <dl className="unnyc-home-j__stats">
                                        {stats.map((s) => (
                                            /* dt before dd is what HTML requires;
                                               the flex column-reverse in the CSS
                                               shows the figure above its label. */
                                            <div key={s.source} className="unnyc-home-j__stat">
                                                <dt className="unnyc-home-j__stat-label">{s.label}</dt>
                                                <dd className="unnyc-home-j__stat-value">
                                                    {s.value.toLocaleString('en-US')}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}

                                {proof?.items && (
                                    <ul className="unnyc-home-j__items">
                                        {proof.items.map((item) => (
                                            <li key={item} className="unnyc-home-j__item">{item}</li>
                                        ))}
                                    </ul>
                                )}

                                {/* A real button, not a text link — the one action
                                    per section should pop. .unnyc-btn--primary is
                                    the site's primary; .unnyc-page .unnyc-btn in
                                    unnyc.css already out-specifies the anchor
                                    reset. */}
                                <Link
                                    href={section.href}
                                    className="unnyc-btn unnyc-btn--primary unnyc-home-j__link"
                                >
                                    {section.linkLabel}{' '}
                                    <span aria-hidden="true">→</span>
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
                );
            })}
        </div>
    );
}
