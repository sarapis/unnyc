import Link from 'next/link';

const PATHS = [
    {
        href: '/start',
        question: 'I’m new to the open source government movement.',
        answer: 'Start with the vocabulary and the arc: how the UN system united around eight Open Source Principles, and who is already behind them.',
    },
    {
        href: '/crosswalk',
        question: 'Why should NYC government make “open source by default” a core pillar of its technology strategy?',
        answer: 'The case for New York, concept by concept — mapped against what the city already has on the books.',
    },
    {
        href: '/success',
        question: 'Which cities have already made open source core to their technology strategy?',
        answer: 'Barcelona, Paris, Munich and more — what each one actually committed to, and what it got back.',
    },
    {
        href: '/resources',
        question: 'I want more information: people, places, projects — and maybe some bumper stickers?',
        answer: 'The directories, the frameworks, and the outward-facing organizations whose job is helping cities do this.',
    },
];

/**
 * UnnycPathCards — the hub's entry point. Four questions route a reader to
 * whichever of the four campaign sub-pages matches where they're starting
 * from, instead of asking everyone to read one long page top to bottom.
 */
export default function UnnycPathCards() {
    return (
        <section className="unnyc-pr-paths">
            <div className="unnyc-container">
                <div className="unnyc-pr-paths__grid">
                    {PATHS.map((path) => (
                        <Link key={path.href} href={path.href} className="unnyc-pr-path">
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
