import { movement } from '@/data/unnyc-primer';

/**
 * PrimerMovement — "how the UN got here" narrative + timeline.
 * The educational spine of the primer: shows open source at the UN is
 * adopted policy with institutional momentum, not a fringe conversation.
 */
export default function PrimerMovement() {
    return (
        <section id="movement" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{movement.title}</h2>
                    <p className="unnyc-section__desc">{movement.lede}</p>
                </header>

                <ol className="unnyc-pr-timeline">
                    {movement.timeline.map((item, i) => (
                        <li key={i} className="unnyc-pr-timeline__item">
                            <span className="unnyc-pr-timeline__year">{item.year}</span>
                            <div className="unnyc-pr-timeline__body">
                                <h3 className="unnyc-pr-timeline__title">{item.title}</h3>
                                <p className="unnyc-pr-timeline__desc">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
