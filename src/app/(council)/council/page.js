import Image from 'next/image';
import Link from 'next/link';
import '../../world-map.css';
import CouncilMap from '@/components/unnyc/CouncilMap';
import {
    getContent,
    getCtfgProjects,
    getGovossCatalogues,
    getOspoMapPoints,
    inlineMd,
} from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('council-home');
    return pageMetadata(meta, '/', 'website', 'council');
}

/**
 * council.opensource.nyc/ — the case for an open-source-by-default local law.
 *
 * ⚠ A STATIC PAGE ON PURPOSE, not a storyscroller: nothing here is hidden until
 * an IntersectionObserver fires, so it renders the same in every browser and
 * every screenshotter, and an agent can verify all of it.
 *
 * ALL COPY IS IN content/council-home.md; every figure and case is read from the
 * file that already owns it (see that file's header). Never type a number here.
 */
export default function CouncilHomePage() {
    const doc = getContent('council-home');
    const bill = getContent('council-bill');
    const rent = getContent('crosswalk').rentCard;
    const cases = getContent('success').cases ?? [];
    const start = getContent('start');
    const principle = getContent('principles').principlesDoc?.lead;

    return (
        <div className="council">
            <section className="council__hero">
                <div className="unnyc-container">
                    <p className="council__kicker">{doc.hero.kicker}</p>
                    <h1 className="council__title" dangerouslySetInnerHTML={{ __html: doc.hero.title }} />
                    <p className="council__lede">{doc.hero.lede}</p>
                    <Link href="/bill" className="unnyc-btn unnyc-btn--primary">
                        {doc.hero.ctaLabel} <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>

            {rent && (
                <section className="council__section">
                    <div className="unnyc-container council__split">
                        <div>
                            <p className="council__kicker council__kicker--dark">{doc.problem.kicker}</p>
                            <h2 className="council__h2">{doc.problem.title}</h2>
                            <p className="council__body">{doc.problem.lede}</p>
                        </div>
                        <div className="council__rent">
                            <p className="council__rent-title">{rent.title}</p>
                            <ul className="council__rent-list">
                                {rent.vendors.map((v) => (
                                    <li key={v.name}>
                                        <span>{v.name}</span>
                                        <span>{v.amount}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="council__rent-total">
                                <span>Total</span>
                                <span>{rent.total}</span>
                            </p>
                            <a className="council__rent-source" href={rent.sourceUrl} target="_blank" rel="noopener noreferrer">
                                {rent.sourceLabel}
                            </a>
                        </div>
                    </div>
                </section>
            )}

            <section className="council__section council__section--band">
                <div className="unnyc-container">
                    <p className="council__kicker">{doc.law.kicker}</p>
                    <h2 className="council__h2 council__h2--inverse">{doc.law.title}</h2>
                    <p className="council__body council__body--inverse">{doc.law.lede}</p>
                    <ol className="council__provisions">
                        {bill.provisions.map((p, i) => (
                            <li key={p.anchor}>
                                <span className="council__provision-n">{String(i + 1).padStart(2, '0')}</span>
                                <h3>{p.title}</h3>
                                <p>{p.summary}</p>
                            </li>
                        ))}
                    </ol>
                    <Link href="/bill" className="unnyc-btn unnyc-btn--primary">
                        {doc.law.linkLabel} <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>

            <section className="council__section">
                <div className="unnyc-container council__split">
                    <div>
                        <p className="council__kicker council__kicker--dark">{doc.precedent.kicker}</p>
                        <h2 className="council__h2">{doc.precedent.title}</h2>
                        <p className="council__body">{doc.precedent.lede}</p>
                        <a className="council__link" href={doc.precedent.link.href} target="_blank" rel="noopener noreferrer">
                            {doc.precedent.link.label} ↗
                        </a>
                    </div>
                    <div>
                        <p className="council__kicker council__kicker--dark">{doc.history.kicker}</p>
                        <h2 className="council__h2">{doc.history.title}</h2>
                        <p className="council__body">{doc.history.lede}</p>
                        <ul className="council__bills">
                            {doc.history.bills.map((b) => (
                                <li key={b.id}>
                                    <a href={b.href} target="_blank" rel="noopener noreferrer">
                                        {b.id} ↗
                                    </a>
                                    <span className="council__bill-sponsors">{b.sponsors}</span>
                                    <span className="council__bill-outcome">{b.outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="council__section council__section--warm">
                <div className="unnyc-container">
                    <p className="council__kicker council__kicker--dark">{doc.evidence.kicker}</p>
                    <h2 className="council__h2">{doc.evidence.title}</h2>
                    <p className="council__body">{doc.evidence.lede}</p>
                    <CouncilMap
                        markers={start.mapMarkers}
                        legend={start.mapLegend}
                        mapSource={start.mapSource}
                        govoss={getGovossCatalogues()}
                        ospos={getOspoMapPoints()}
                        ctfg={getCtfgProjects()}
                    />
                    {cases.length > 0 && (
                        <>
                            <h3 className="council__h3">{doc.evidence.casesTitle}</h3>
                            <ul className="council__cases">
                                {cases.map((c) => {
                                    const [name, subtitle] = c.title.split(/:\s*/);
                                    return (
                                        <li key={c.id}>
                                            {c.banner?.src && (
                                                <Image
                                                    src={c.banner.src}
                                                    alt={c.banner.alt ?? ''}
                                                    width={480}
                                                    height={270}
                                                    sizes="(max-width: 720px) 100vw, 33vw"
                                                />
                                            )}
                                            <p className="council__case-name">{name}</p>
                                            <p className="council__case-sub">{subtitle}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            <a className="council__link" href={doc.evidence.casesHref}>
                                {doc.evidence.casesLinkLabel} →
                            </a>
                        </>
                    )}
                </div>
            </section>

            {principle && (
                <section className="council__section">
                    <div className="unnyc-container council__principle">
                        <p className="council__kicker council__kicker--dark">{doc.principle.kicker}</p>
                        <h2 className="council__h2">{doc.principle.title}</h2>
                        <p className="council__body">{doc.principle.lede}</p>
                        <blockquote className="council__quote">
                            <p className="council__quote-title">
                                {principle.n}. {principle.titleCanonical || principle.title}
                            </p>
                            <p dangerouslySetInnerHTML={{ __html: inlineMd(principle.descCity || principle.desc || '') }} />
                        </blockquote>
                        <a className="council__link" href={doc.principle.href}>
                            {doc.principle.linkLabel} →
                        </a>
                    </div>
                </section>
            )}

            <section className="council__section council__section--band council__ask">
                <div className="unnyc-container">
                    <h2 className="council__h2 council__h2--inverse">{doc.ask.title}</h2>
                    <p className="council__body council__body--inverse">{doc.ask.lede}</p>
                    <Link href="/bill" className="unnyc-btn unnyc-btn--primary">
                        {doc.ask.ctaLabel} <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
