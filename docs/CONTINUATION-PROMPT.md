# Continuation prompt — UNNYC campaign site

Paste everything below into a new session. Written 2026-08-04.

---

I'm continuing work on the **UNNYC campaign site**. Please start by querying the Hub
(`get_workspace_detail("unnyc")`, `list_tasks(workspace="unnyc")`) and reading
`~/vault/workspaces/unnyc.md`, then the repo's `CLAUDE.md`, `README.md` and
`docs/EDITING-CONTENT.md`.

## What this is

A standalone Next.js campaign site making the case for NYC to become the first city
in the Americas to endorse the **UN Open Source Principles**.

- **Repo:** `github.com/sarapis/unnyc` (private). Next app at the **repo root**.
- **Live:** <https://unnyc.wegov.nyc>
- **Vercel:** `devins-projects-1baf43f0/unnyc-campaign`
- **Local clone for this session:** clone fresh; the working copy used to build it
  was in a scratch dir, not a permanent checkout.

## How it got here (short version)

It was extracted on 2026-08-04 out of `wegovnyc/wegovnyc_front`, where it lived at
`/unnyc`. The base was Olivia Croteau's four-path restructure
(`oliviacroteau667/wegovnyc_front` @ `0e349a2`) merged with upstream `main`. Routes
moved up one level (`/unnyc/start` → `/start`). Git history is deliberately fresh
because the parent repo has private SSH keys in its *public* history.

Then **all page copy was migrated into `content/*.md`** — frontmatter for structure,
markdown body for prose, rendered at build time. One file per page. That's the main
thing to understand before touching anything.

## ⚠️ Read these before you change anything

1. **Pushing to `main` does NOT deploy.** Vercel's GitHub App isn't installed on the
   `sarapis` org. After pushing, run `vercel deploy --prod`.
2. **To change wording, edit `content/*.md`, never the JSX.** Page components are
   layout only. See `docs/EDITING-CONTENT.md` for the conventions
   (`[text](gloss:slug)`, `{{stats}}`, `{{principles}}`, pull-quote `<cite>`).
3. **`getContent()` must be called inside the component or `generateMetadata`, not
   at module scope** — the markdown isn't a module dependency, so a module-level
   call is evaluated once per dev-server process and edits won't show up.
4. **CSS layer order `reset < components < unnyc < site` must be preserved.**
5. **Never write `*/` inside a CSS comment.** It breaks the Turbopack CSS parse.
6. When refactoring content plumbing, **capture the rendered text of all 10 routes
   first and diff after.** That method caught two real bugs during the migration.
   It will NOT catch interaction-only regressions (a lost hover tooltip slipped
   past it and had to be found by inspection).

## Open work, highest value first

Tracked as Hub task **`ad097da4`** (workspace `unnyc`).

1. **Connect Vercel git auto-deploy** — needs a click in the Vercel dashboard →
   `unnyc-campaign` → Settings → Git → Connect, approving the GitHub App for the
   `sarapis` org. Until then every deploy is manual.
2. **Set `ENDORSEMENT_SHEET_WEBHOOK_URL` in Vercel** — without it
   `/campaign/endorse` returns 503 on submit. It's the Google Apps Script Web App
   URL that appends formal organization endorsements to a Google Sheet. Server-side
   only; must **not** be `NEXT_PUBLIC_`. (Individual signing on `/campaign/sign`
   works — that goes to Payload.)
3. **Redirect `wegov.nyc/unnyc/*` → `unnyc.wegov.nyc/*`** in the `wegovnyc_front`
   repo. Two copies of the campaign are live and competing in search right now.
   While there, delete the dead `unnyc.wegov.nyc` host-redirect rule in
   `frontend/next.config.mjs` — it never fired and now points the wrong way.
4. **Decide on copy inconsistencies** (deliberately left alone):
   - Footer tagline still says "Where the United Nations meets New York City…" —
     the pre-campaign framing.
   - `/start` and `/crosswalk` page H1s and `<title>`s don't match their renamed nav
     labels ("The Global Movement", "Open Source for NYC").
5. **Optional cleanup:** `src/data/unnyc-primer.js` is superseded by `content/*.md`
   and partly orphaned — safe to delete once you're confident. Note
   `src/data/unnyc.js`'s `openSource` export **is** still used (the eight
   principles, shared by the letter and the printable document).

## Separate, still outstanding: exposed keys in the parent repo

Hub task **`51968fc0`** (workspace `WeGovMarketing`). Two unencrypted private keys
and 12 `*.exp` scripts carrying a literal passphrase were committed to the **public**
`wegovnyc/wegovnyc_front`. They were removed from the tree (`509149b`), `.gitignore`
was closed, and GitHub secret scanning + push protection were enabled — but **they
remain in git history**.

Triage findings that lower the urgency: the exposed `ssh_key.pem` is **not** trusted
by root on Hetzner `utilities-2`, and the owner confirms **Lightsail is retired**. So
this is hygiene, not an active incident. Remaining work is the history purge, which
needs coordination because the public fork `oliviacroteau667/wegovnyc_front` keeps
the blobs reachable via GitHub's fork network. Procedure and per-key fingerprints:
`docs/SECRET-PURGE.md` in `wegovnyc_front`. **The one thing still worth acting on
regardless: the passphrase in those `.exp` scripts is public — change it anywhere
it's reused.**

## Three UNNYC sites exist — don't confuse them

| Site | What | Vercel project |
|---|---|---|
| `unnyc.wegov.nyc` | **This** campaign site | `unnyc-campaign` |
| `old-unnyc.wegov.nyc` | The original Vite "UN meets NYC" hub. Live, untouched. | `unnyc` ← note the name |
| `wegov.nyc/unnyc` | Stale duplicate inside the marketing site | `wegovnyc-frontend` |

Don't rename the Vercel project to `unnyc` — that name belongs to the live old site.
