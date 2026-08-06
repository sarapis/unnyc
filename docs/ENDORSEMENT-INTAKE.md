# Formal endorsement intake — setup

`/campaign/endorse` returns **503 on submit** until this is done. Individual
signing on `/campaign/sign` is unaffected: that goes to Payload and works.

Verified 2026-08-06: the route validates correctly (`400` on an empty payload)
and fails closed (`503`, "Endorsement intake is not configured yet") — so
nothing has been silently lost while it has been unconfigured.

## Why this is a manual job

`ENDORSEMENT_SHEET_WEBHOOK_URL` is an Apps Script Web App URL —
`https://script.google.com/macros/s/AKfycb…/exec`. That path segment is a
**bearer capability**: anyone holding the URL can append rows to the sheet. It
is a secret, so it should be entered by a person into the Vercel dashboard
rather than pasted into a chat, a commit, or a shell history.

Nothing about it is recorded in this repo, the vault or the Hub, and there is no
evidence the Apps Script has ever been deployed — so step 1 is likely to be
"create it", not "find it".

## 1. Deploy the receiving end

The script is written and ready: [`endorsement-apps-script.gs`](endorsement-apps-script.gs).
It matches the exact payload `src/app/api/formal-endorsement/route.js` forwards.

1. Create a Google Sheet; note the id from its URL.
2. **Extensions → Apps Script**, paste the file over `Code.gs`.
3. Set `SHEET_ID`, then run `setupSheet` once — writes the header row and proves
   the script can reach the sheet.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the `…/exec` URL.

⚠ **"Who has access" must be `Anyone`, not `Anyone with a Google account`.**
Vercel calls it anonymously; the stricter setting returns an HTML login page with
a 200, which the route treats as a failure and reports as `502`. This is the most
common way this setup appears to work and doesn't.

⚠ **The URL changes on every "New deployment".** To keep it stable later, use
**Manage deployments → edit the existing deployment** rather than creating a new
one — otherwise Vercel needs updating each time.

Sanity check before touching Vercel — this should return JSON, not HTML:

```bash
curl -sL "PASTE_THE_EXEC_URL"
```

Expect `{"ok":true,"message":"UNNYC endorsement intake is live"}`.

## 2. Set the variable in Vercel

Dashboard → `unnyc-campaign` → **Settings → Environment Variables**:

| | |
|---|---|
| Name | `ENDORSEMENT_SHEET_WEBHOOK_URL` |
| Value | the `…/exec` URL |
| Environments | Production, Preview, Development |
| Type | **Secret / Sensitive** |

**It must NOT be `NEXT_PUBLIC_`.** That prefix would ship the URL to every
browser, handing the write capability to anyone who views source.

## 3. Redeploy — the step that gets missed

Vercel environment variables are **not** picked up by already-built
deployments. After saving, redeploy or the form keeps returning 503:

```bash
cd ~/Antigravity/unnyc && vercel deploy --prod
```

(A push to `main` also works — git auto-deploy has been connected since
2026-08-05.)

## 4. Verify end to end

```bash
curl -s -X POST -H 'Content-Type: application/json' \
  -d '{"orgType":"nonprofit","orgName":"Smoke Test","country":"US","employees":"1-10","firstName":"Test","jobTitle":"Tester","workEmail":"test@example.com","endorses":true,"consent":true}' \
  https://unnyc.wegov.nyc/api/formal-endorsement
```

| Response | Meaning |
|---|---|
| `{"ok":true}` | Working — delete the "Smoke Test" row from the sheet |
| `503` | Variable not set, or set but not redeployed (step 3) |
| `502` | Variable set but the webhook rejected it — almost always the "Who has access" setting in step 4 above. Check the Apps Script **Executions** log |
| `400` | Payload was incomplete — the route's own validation, not the sheet |

The route deliberately logs the underlying reason server-side and returns a
generic message to the browser, so a 502 means "read the Vercel function logs
and the Apps Script execution log", not "guess".
