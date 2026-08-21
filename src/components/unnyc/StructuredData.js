/**
 * Renders JSON-LD into the page. Server component — no "use client".
 *
 * ⚠ `<` IS ESCAPED, AND THAT IS NOT COSMETIC. JSON.stringify happily emits the
 * literal characters `</script>` if they appear inside any string, which closes
 * this tag early and drops the rest of the JSON into the document as markup.
 * Some of what goes through here is third-party text — the endorser names are a
 * transcription of the UN's page, and the OSPO descriptions are hand-authored
 * but edited by more than one person. Escaping `<` to its \\u003c form is still
 * valid JSON, parses identically, and makes the breakout impossible.
 *
 * Takes one object or an array of them; an array becomes one <script> per graph
 * rather than a wrapper, because consumers vary in how well they follow @graph.
 */
export default function StructuredData({ data }) {
    const graphs = (Array.isArray(data) ? data : [data]).filter(Boolean);
    if (!graphs.length) return null;

    return (
        <>
            {graphs.map((graph, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
                    }}
                />
            ))}
        </>
    );
}
