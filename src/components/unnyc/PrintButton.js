"use client";

export default function PrintButton({ children }) {
    return (
        <button
            type="button"
            className="unnyc-btn unnyc-btn--outline-dark unnyc-doc-toolbar__btn"
            onClick={() => window.print()}
        >
            {children}
        </button>
    );
}
