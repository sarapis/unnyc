"use client";

/* `variant` is the button style: 'outline-dark' (the default) for the light
 * printable pages, 'outline' for a dark background — --outline is white on white
 * and invisible on a light page, --outline-dark the reverse (see CLAUDE.md). */
export default function PrintButton({ children, variant = 'outline-dark' }) {
    return (
        <button
            type="button"
            className={`unnyc-btn unnyc-btn--${variant} unnyc-doc-toolbar__btn`}
            onClick={() => window.print()}
        >
            {children}
        </button>
    );
}
