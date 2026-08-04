# UNNYC

> Standalone campaign site: make NYC the first city in the Americas to endorse the
> UN Open Source Principles. Next.js on Vercel. Extracted from `wegovnyc_front`.

Read [README.md](README.md) first — it covers routes, the two form paths, env,
and CSS layers. This file is the agent-specific delta.

## Repo shape

The Next app is at the **repo root** (no `frontend/` subdirectory — unlike its
parent repo `wegovnyc_front`). Vercel's defaults therefore work unchanged.

## Non-obvious things that will bite you

- **Content is static, not CMS.** Page copy lives in `src/data/unnyc-primer.js`
  and the page components. The CMS is used *only* for form submissions and the
  endorser wall. Editing Payload will not change page copy.
- **`site` layer must stay above `unnyc`** in `src/app/base.css`. The nav sits
  inside `.unnyc-page` to inherit its tokens, so `.unnyc-page a { color: inherit }`
  in `@layer unnyc` will paint nav links navy-on-navy if the order is changed.
- **Don't add a `title.template`** in `src/app/layout.js`. Page titles already
  end in "— UNNYC"; a template double-suffixes them.
- **Never write `*/` inside a CSS comment** (e.g. listing `--unnyc-*` families
  as `--unnyc-*/--un-*`). It closes the comment and the Turbopack CSS parse
  fails with a confusing `Unexpected token Delim('*')`.
- **Two endorsement destinations by design** (Payload vs Google Sheet) — see the
  README table before "fixing" the apparent duplication.
- **`ENDORSEMENT_SHEET_WEBHOOK_URL` must be set in Vercel** or the formal
  endorse form fails with a 503. It is server-side only — never `NEXT_PUBLIC_`.
- **Leaflet is client-only.** The map is loaded via
  `dynamic(() => import('./PrimerMapInner'), { ssr: false })` from
  `PrimerMovementNow.js` (rendered on `/start`). That relative dynamic import is
  invisible to `@/`-prefixed grep — don't delete `PrimerMapInner.js` as "unused".
- `src/lib/api.js` is intentionally larger than this site needs (inherited whole
  from the marketing site). Don't prune it casually; `fetchAPI` *is* used by the
  endorser wall on `/campaign/sign`.

## Deploy

Push to `main` → Vercel deploys. Previews on PRs.

## Provenance

- Base: `oliviacroteau667/wegovnyc_front` @ `0e349a2` (the four-path restructure),
  merged with `wegovnyc/wegovnyc_front` `main`.
- The old single-page `/unnyc` hub components (`UnnycHero`, `UnnycAbout`,
  `UnnycEvents`, `UnnycNews`, `UnnycPolicy`, `UnnycDirectory`, `UnnycResources`,
  `UnnycMap`, `ScrollReveal`) were **not** carried over — the restructure stopped
  using them. They remain in git history of the parent repo if needed.
- Events/news were deliberately dropped in the restructure; this site has no
  CMS-driven page content as a result.

> [!WARNING]
> The parent repo `wegovnyc/wegovnyc_front` has (or had) two **private SSH keys
> committed to public history** (`ssh_key.pem`, `LightsailDefaultKey-us-east-1.pem`)
> plus `*.exp` scripts referencing passphrases. None were copied here, and
> `.gitignore` blocks `*.pem`, `*.key`, `*.exp`, `ssh_key*`, `ssh.pub`. If you
> ever sync files from the parent repo, do not bring those across.
