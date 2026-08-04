import Link from 'next/link';

const PATHS = [
    {
        href: '/start',
        question: 'I am new to government open source.',
        answer: 'Let’s walk you through it. You’ll get familiar with key terms and the history of the movement.',
    },
    {
        href: '/crosswalk',
        question: 'I want to know why open source matters to NYC.',
        answer: 'We’ll show you exactly how open source principles can make NYC work better for you.',
    },
    {
        href: '/success',
        question: 'Show me global cities leading the way.',
        answer: 'See how the first city to endorse the Principles did it, and what NYC could gain by following.',
    },
    {
        href: '/resources',
        question: 'I’m looking for related resources.',
        answer: 'Let’s see if we have what you’re looking for. If not, we’ll direct you to someone who does.',
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
