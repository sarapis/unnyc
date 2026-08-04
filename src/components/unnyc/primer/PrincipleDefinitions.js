import Link from 'next/link';
import Image from 'next/image';
import { principlesDoc } from '@/data/unnyc-primer';

/**
 * PrincipleDefinitions — plain-English definitions of the eight UN Open
 * Source Principles, for a reader with no background. The crosswalk page
 * (/crosswalk) covers the same eight in depth, paired with NYC's
 * reality; this is just the vocabulary. Structured to match the UN's own
 * "Open by Default" one-pager (see data/unnyc-primer.js's `principlesDoc`
 * for provenance) — also viewable as a standalone printable page at
 * /start/principles.
 */
export default function PrincipleDefinitions() {
    const { lead, groups } = principlesDoc;

    return (
        <section id="principles" className="unnyc-section unnyc-section--alt">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">The Eight UN Open Source Principles</h2>
                    <p className="unnyc-section__desc">
                        Adopted by the UN’s Digital and Technology Network in 2025, these eight
                        commitments define what it means for an institution to build software openly and support those doing it.
                    </p>
                    <Link href="/start/principles" className="unnyc-btn unnyc-btn--outline-dark">
                        View as PDF ↗
                    </Link>
                </header>

                <p className="unnyc-start-principles__intro">
                    Primarily, this means that software built for the city ought to be:
                </p>

                <article className="unnyc-start-principle unnyc-start-principle--primary">
                    <Image
                        src={lead.icon}
                        alt=""
                        width={56}
                        height={56}
                        className="unnyc-start-principle__icon"
                    />
                    <h3 className="unnyc-start-principle__title">{lead.title}.</h3>
                    {lead.body.map((p, i) => (
                        <p key={i} className="unnyc-start-principle__desc">{p}</p>
                    ))}
                </article>

                <p className="unnyc-start-principles__intro unnyc-start-principles__intro--committed">
                    As leaders in the global open source movement, we are committed to the
                    following:
                </p>

                {groups.map((group) => (
                    <div className="unnyc-start-principles__group" key={group.title}>
                        <h3 className="unnyc-start-principles__group-title">{group.title}</h3>
                        <div className="unnyc-start-principles__grid">
                            {group.items.map((item) => (
                                <article key={item.title} className="unnyc-start-principle">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={56}
                                        height={56}
                                        className="unnyc-start-principle__icon"
                                    />
                                    <h4 className="unnyc-start-principle__title">{item.title}</h4>
                                    <p className="unnyc-start-principle__desc">{item.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="unnyc-start-principles__cta">
                    <Link href="/campaign/sign" className="unnyc-btn unnyc-btn--primary">
                        Endorse the Principles →
                    </Link>
                </div>
            </div>
        </section>
    );
}
