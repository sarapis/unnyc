import Link from 'next/link';

/**
 * UnnycPathCards — a grid of "pick your entry point" cards.
 *
 * Content comes from the calling page's content/*.md (`paths:` in frontmatter),
 * so the same component serves the hub's four reader paths and /campaign's two
 * action paths without holding any copy itself.
 */
export default function UnnycPathCards({ paths = [] }) {
    if (!paths.length) return null;

    return (
        <section className="unnyc-pr-paths">
            <div className="unnyc-container">
                <div className="unnyc-pr-paths__grid">
                    {paths.map((path) => (
                        <Link key={path.href} href={path.href} className="unnyc-pr-path">
                            {path.image && (
                                <div
                                    className="unnyc-pr-path__image"
                                    style={{ backgroundImage: `url(${path.image})` }}
                                />
                            )}
                            <h2 className="unnyc-pr-path__question">{path.question}</h2>
                            <p className="unnyc-pr-path__answer">
                                {path.answer}{' '}
                                <span className="unnyc-pr-path__arrow" aria-hidden="true">→</span>
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
