# Session continuation prompt

Paste the block below into a new session. Everything above the line is context for
whoever is maintaining this file.

**Last updated 2026-08-06.** The previous version of this file described the state
on 2026-08-04, when the campaign had just been extracted. Almost all of it is now
done — keep this rewritten as things land, or it becomes the thing that misleads
the next session.

---

I'm continuing work on the **UNNYC campaign site** and its two sibling repos.
Start by querying the Hub (`get_workspace_detail("unnyc")`,
`list_tasks(workspace="unnyc")`, `search_knowledge(topic="wegovnyc-design-system")`)
and reading `~/vault/workspaces/unnyc.md`, then this repo's `CLAUDE.md`, `README.md`
and `docs/EDITING-CONTENT.md`.

## The four repos, and how they relate

| Repo | Local | What it is |
|---|---|---|
| `sarapis/unnyc` | `~/Antigravity/unnyc` | **This** campaign site → https://unnyc.wegov.nyc |
| `wegovnyc/wegovnyc_front` | `~/Antigravity/WeGovMarketing` | The marketing site → https://wegov.nyc |
| `sarapis/wegovnyc-design-tokens` | `~/Antigravity/wegovnyc-design-tokens` | The shared design system both sites install |
| `devinbalkind/sarapis-website` | `~/Antigravity/Sarapis/site` | The Payload CMS → https://next.sarapis.org |

All four are clean and deployed as of 2026-08-06.

## Things that will bite you

1. **Pushing `main` deploys to production** on both Vercel sites. No gate. Push
   deliberately. (`vercel deploy --prod` still works; a fresh clone needs
   `vercel link --yes --project unnyc-campaign` first, since `.vercel/` is gitignored.)
2. **The CMS at next.sarapis.org is production for THREE brands** — sarapis.org,
   wegov.nyc and databook.nyc. Its own docs say "staging is a misnomer, treat
   deploys accordingly", and the convention is that **the user approves go-live**.
   Deploys are a Docker image build → scp → recreate (currently `sarapis-site:r43`),
   and schema changes need out-of-band SQL because `push` is a no-op in the prod
   bundle. Back the DB up first — I caused a minute of downtime skipping ahead.
3. **To change wording, edit `content/*.md`, never the JSX.** Page components are
   layout only. The eight principles are single-sourced in `content/principles.md`
   and reshaped per surface — see `docs/EDITING-CONTENT.md`.
4. **`getContent()` must be called inside the component or `generateMetadata`**, not
   at module scope — the markdown isn't a module dependency, so a module-level call
   is evaluated once per dev-server process and edits won't appear.
5. **Never write a colour literal or read a reference token (`--db-*`) in a CSS
   rule.** Both are invisible to the brand variant. Use a `--wg-*` semantic; if none
   fits, add one upstream in the design-tokens package **and reinstall in every
   consumer** — a git dependency pins to a commit, and a missing custom property
   fails *silently*. `npm run lint:tokens` warns (and runs as `prebuild`).
6. **Never write `*/` inside a CSS comment.** It closes the comment and Turbopack
   fails with `Unexpected token Delim('*')`. I did this while documenting the
   very note that warns about it.
7. **CSS layer order `reset < components < unnyc < site` must be preserved** here
   (`site` last, or the nav paints navy-on-navy). wegov.nyc's is different:
   `reset < theme < components`. Don't assume one from the other.

## How to verify anything here

This session found **nine** bugs that all shared one shape: they failed silently
and looked like "no data yet" or "working fine". A `catch` returning `[]`, a
`default:` returning an empty list, `var()` falling back, a missing CORS header, a
403 the page swallowed. So:

- **Test through the real UI, not the API.** The endorsement endpoint returned 200
  to `curl` for two days while every browser submission was blocked by CORS — curl
  doesn't enforce it.
- **For CSS/token changes, capture computed styles before and after and diff.**
  `await document.fonts.ready` first (`line-height: normal` is font-metrics
  dependent), poll until post-hydration styling is actually applied rather than
  waiting a fixed delay, and compare computed values rather than token text
  (minified CSS strips whitespace inside custom properties).
- **Test a guard by trying to defeat it.** Two bugs in `wg-lint-tokens` survived
  review and were caught only by deliberately adding a violation.
- **An empty table proves nothing.** Verify access control with a real row.

## Open work

Nothing is blocking. In rough order of value:

1. **A shared component package.** The token *values* are unified across both
   sites; the *implementations* aren't — each still has its own button, card and
   nav. `~/Antigravity/Sarapis/design-system` (`@sarapis/design-system`) is a
   working template: a real design-synced package with tsup, render-hash
   validation and Storybook. Its own notes carry the warning worth inheriting —
   v0.2 came back from Claude Design and was **never ported to the live site**, so
   the round trip forked the system from the product.
2. **The four documented warts** in the design-tokens README, each a visible change
   needing its own decision: the historical `--db-*` prefix (Databook is *not* in
   this system), `--wg-font-serif` carrying a `Times New Roman` the products' stack
   lacks, the shadow ramp still built on the pre-convergence navy `#1b2a4a`, and
   seven literal scale steps.
3. **Eyeball three computed colours** — `--wg-success/warning/info-on-brand` are
   accessible by measurement but have never been seen in product. `#8FFFA6` is a
   fairly bright mint.
4. **Exposed keys in `wegovnyc_front`'s git history** — Hub task `51968fc0`. Two
   unencrypted private keys and 12 `*.exp` scripts with a literal passphrase are
   still in the *public* history. Triage lowered the urgency (the key isn't trusted
   by root on `utilities-2`; Lightsail is retired) but the purge needs coordination
   because the fork `oliviacroteau667/wegovnyc_front` keeps the blobs reachable via
   GitHub's fork network. **The passphrase in those scripts is public — change it
   anywhere it's reused.** Procedure: `docs/SECRET-PURGE.md` in that repo.
5. **Migrate the ~90 baselined literals** in wegov.nyc's legacy `globals.css`.
6. **Decide whether `old-unnyc.wegov.nyc` stays.** It is now **load-bearing**:
   `wegov.nyc/unnyc/guide` redirects to `unnyc.wegov.nyc/resources` because that
   long-form article was never carried over, and the only live copy is
   `old-unnyc.wegov.nyc/guide.html`.

## Watch for

- **The first real endorsement.** Nobody has ever successfully signed — the CORS
  bug meant no submission reached Payload until 2026-08-06, so the table is empty
  and the flow is proven only by my own test. `published` defaults to false, so a
  new submission needs ticking in the Payload admin before it reaches the wall.
- **Collaborator pushes.** Olivia Croteau pushes to `sarapis/unnyc` (content edits
  to `content/*.md`) and Devin merges her PRs. `git fetch` and check before
  assuming your local `main` is current — this bit me twice in one session.
